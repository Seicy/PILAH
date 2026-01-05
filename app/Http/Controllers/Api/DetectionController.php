<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Peminjaman; 
use App\Models\Riwayat;    
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DetectionController extends Controller
{
    /**
     * Mapping Label Roboflow agar sinkron dengan pilihan di Frontend.
     */
    private $toolMapping = [
        'Toolbox 1'   => 'obeng', 
        'Toolbox 2'   => 'tang potong',
        'Toolbox 3'   => 'obeng',
        'Toolbox 4'   => 'tang potong',
        'Toolbox 5'   => 'obeng',
        'Toolbox 6'   => 'tang potong',
        'Toolbox 7'   => 'obeng',
        'Toolbox 8'   => 'tang potong',
        'Tang Potong' => 'tang potong',
        'Obeng'       => 'obeng',
    ];

    /**
     * 1. Mendapatkan Data Riwayat untuk Tabel Frontend
     */
    public function getRiwayat()
    {
        return response()->json(Riwayat::orderBy('created_at', 'desc')->get());
    }

    /**
     * 2. Fungsi Validasi AI Menggunakan Roboflow
     */
    private function validateAI($imageData, $expectedToolName)
    {
        $apiKey  = "HyShoLxW4MxBAPMRaorN"; 
        $modelId = "alat-sndmu";         
        $version = "6";                 

        try {
            $response = Http::withHeaders(['Content-Type' => 'application/x-www-form-urlencoded'])
                ->withOptions(['timeout' => 30, 'verify' => false])
                ->withBody($imageData, 'text/plain')
                ->post("https://detect.roboflow.com/{$modelId}/{$version}?api_key={$apiKey}");

            $result = $response->json();

            if (!isset($result['predictions']) || empty($result['predictions'])) {
                return ['isValid' => false, 'message' => 'Alat tidak terdeteksi. Pastikan alat berada di area scan.'];
            }

            $bestMatch     = $result['predictions'][0];
            $detectedLabel = $bestMatch['class'];
            $confidence    = $bestMatch['confidence'];
            $expectedLabel = $this->toolMapping[$expectedToolName] ?? $expectedToolName;

            if ($detectedLabel === $expectedLabel && $confidence >= 0.50) {
                return [
                    'isValid' => true, 
                    'label'   => $detectedLabel, 
                    'score'   => round($confidence * 100) . '%'
                ];
            }

            return [
                'isValid' => false, 
                'message' => "Terdeteksi '{$detectedLabel}', tetapi Anda memilih '{$expectedToolName}'."
            ];
        } catch (\Exception $e) {
            Log::error('AI Error: ' . $e->getMessage());
            return ['isValid' => false, 'message' => 'Gagal terhubung ke server AI.'];
        }
    }

    /**
     * 3. Proses Pinjam Alat
     */
    public function detectAndBorrow(Request $request)
    {
        // Jalankan validasi AI
        $aiResult = $this->validateAI($request->image, $request->nama_alat);

        if (!$aiResult['isValid']) {
            return response()->json(['status' => 'error', 'message' => $aiResult['message']], 422);
        }

        DB::beginTransaction();
        try {
            $waktuSekarang = Carbon::now('Asia/Jakarta');
            
            // --- BAGIAN YANG DIUBAH SESUAI PERMINTAAN ---
            // Mengambil nama toolbox langsung dari request (misal: "Toolbox 1")
            // Lalu digabung menjadi: "tang potong (Toolbox 1)"
            $toolboxName = $request->nama_alat ?? 'Toolbox Tidak Diketahui';
            $namaLengkapAlat = $aiResult['label'] . " (" . $toolboxName . ")";
            // --------------------------------------------

            $dataPayload = [
                'kode_pinjam'  => 'PJ-' . strtoupper(Str::random(5)),
                'nama_alat'    => $namaLengkapAlat, 
                'nama_kelas'   => $request->nama_kelas ?? 'Umum',
                'semester'     => $request->semester ?? '-',
                'waktu_pinjam' => $waktuSekarang,
                'status'       => 'Dipinjam'
            ];

            Peminjaman::create($dataPayload);
            Riwayat::create($dataPayload);

            DB::commit();
            return response()->json([
                'status'  => 'success', 
                'message' => "Berhasil meminjam {$namaLengkapAlat} dengan skor deteksi {$aiResult['score']}",
                'data'    => $dataPayload
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Database Save Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Gagal menyimpan ke database.'], 500);
        }
    }

    /**
     * 4. Proses Kembali Alat
     */
    public function returnAlat(Request $request)
    {
        $peminjaman = Peminjaman::where('kode_pinjam', $request->kodePinjam)->first();

        if (!$peminjaman) {
            return response()->json(['status' => 'error', 'message' => 'Data peminjaman tidak ditemukan.'], 404);
        }

        // Mengambil nama asli alat (sebelum tanda kurung) untuk divalidasi AI
        $namaAlatAsli = explode(' (', $peminjaman->nama_alat)[0];
        
        // Mengambil nama toolbox dari dalam kurung untuk keperluan mapping AI
        preg_match('/\((.*?)\)/', $peminjaman->nama_alat, $matches);
        $toolboxName = $matches[1] ?? $namaAlatAsli;

        $aiResult = $this->validateAI($request->image, $toolboxName);

        if (!$aiResult['isValid']) {
            return response()->json(['status' => 'error', 'message' => $aiResult['message']], 422);
        }

        DB::beginTransaction();
        try {
            Riwayat::where('kode_pinjam', $request->kodePinjam)->update([
                'waktu_kembali' => Carbon::now('Asia/Jakarta'),
                'status'        => 'Kembali'
            ]);

            $peminjaman->update([
                'waktu_kembali' => Carbon::now('Asia/Jakarta'),
            'status' => 'Kembali'
        ]);

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Alat berhasil dikembalikan.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses pengembalian.'], 500);
        }
    }
}