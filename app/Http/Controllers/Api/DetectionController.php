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
    private $toolMapping = [
        'Toolbox 1'   => 'tang potong', 
        'Toolbox 2'   => 'obeng',
        'Tang Potong' => 'tang potong',
        'Obeng'       => 'obeng',
    ];

    /**
     * 1. Ambil Semua Data Riwayat (Untuk Tabel React)
     */
    public function getRiwayat()
    {
        // Mengambil semua data dari riwayats untuk ditampilkan oleh Captain & Storeman
        return response()->json(Riwayat::orderBy('created_at', 'desc')->get());
    }

    /**
     * 2. Fungsi Validasi AI (Versi 5)
     */
    private function validateAI($imageData, $expectedToolName)
    {
        $apiKey  = "HyShoLxW4MxBAPMRaorN"; 
        $modelId = "alat-sndmu";         
        $version = "5"; 

        try {
            $response = Http::withHeaders(['Content-Type' => 'application/x-www-form-urlencoded'])
                ->withOptions(['timeout' => 30, 'verify' => false])
                ->withBody($imageData, 'text/plain')
                ->post("https://detect.roboflow.com/{$modelId}/{$version}?api_key={$apiKey}");

            $result = $response->json();

            if (!isset($result['predictions']) || empty($result['predictions'])) {
                return ['isValid' => false, 'message' => 'Alat tidak terlihat. Coba arahkan lebih jelas ke kamera.'];
            }

            $bestMatch     = $result['predictions'][0];
            $detectedLabel = $bestMatch['class'];
            $confidence    = $bestMatch['confidence'];
            $expectedLabel = $this->toolMapping[$expectedToolName] ?? $expectedToolName;

            if ($detectedLabel === $expectedLabel && $confidence >= 0.50) {
                return ['isValid' => true, 'label' => $detectedLabel];
            }

            return ['isValid' => false, 'message' => "Terdeteksi '{$detectedLabel}', butuh '{$expectedLabel}'."];
        } catch (\Exception $e) {
            return ['isValid' => false, 'message' => 'Koneksi AI terputus.'];
        }
    }

    /**
     * 3. Proses Pinjam Alat
     */
    public function detectAndBorrow(Request $request)
    {
        $aiResult = $this->validateAI($request->image, $request->nama_alat);
        if (!$aiResult['isValid']) return response()->json(['status' => 'error', 'message' => $aiResult['message']], 422);

        DB::beginTransaction();
        try {
            $data = [
                'kode_pinjam'  => 'PJ-' . strtoupper(Str::random(5)),
                'nama_alat'    => $request->nama_alat,
                'nama_kelas'   => $request->nama_kelas ?? 'Umum',
                'waktu_pinjam' => Carbon::now('Asia/Jakarta'),
                'status'       => 'Dipinjam'
            ];

            Peminjaman::create($data);
            Riwayat::create($data);

            DB::commit();
            return response()->json(['status' => 'success', 'data' => $data]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Gagal simpan database.'], 500);
        }
    }

    /**
     * 4. Proses Kembali Alat
     */
    public function returnAlat(Request $request)
    {
        $peminjaman = Peminjaman::where('kode_pinjam', $request->kodePinjam)->first();

        if (!$peminjaman) {
            return response()->json(['status' => 'error', 'message' => 'Data pinjaman tidak ditemukan.'], 404);
        }

        // AI Verifikasi saat pengembalian
        $aiResult = $this->validateAI($request->image, $peminjaman->nama_alat);

        if (!$aiResult['isValid']) {
            return response()->json(['status' => 'error', 'message' => $aiResult['message']], 422);
        }

        DB::beginTransaction();
        try {
            // Update tabel Riwayats (untuk storeman)
            Riwayat::where('kode_pinjam', $request->kodePinjam)->update([
                'waktu_kembali' => Carbon::now('Asia/Jakarta'),
                'status'        => 'Kembali'
            ]);

            // Hapus dari tabel Peminjamans (agar hilang dari daftar Captain)
            $peminjaman->delete();

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Alat berhasil dikembalikan.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Gagal memproses pengembalian.'], 500);
        }
    }
}