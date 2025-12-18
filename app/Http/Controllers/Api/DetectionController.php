<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Peminjaman;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DetectionController extends Controller
{
    /**
     * PEMETAAN ALAT (Sesuaikan dengan isi Toolbox Anda)
     * Contoh: Toolbox 1-4 berisi handgrip, Toolbox 5-8 berisi Pen
     */
    private $toolMapping = [
        'Toolbox 1' => 'handgrip',
        'Toolbox 2' => 'handgrip',
        'Toolbox 3' => 'handgrip',
        'Toolbox 4' => 'handgrip',
        'Toolbox 5' => 'Pen',
        'Toolbox 6' => 'Pen',
        'Toolbox 7' => 'Pen',
        'Toolbox 8' => 'Pen',
    ];

    private function validateAI($imageData, $expectedToolName)
    {
        $apiKey = env('ROBOFLOW_API_KEY');
        $modelId = env('ROBOFLOW_MODEL_ID');

        // Panggil Roboflow v4
        $response = Http::withHeaders([
            'Content-Type' => 'application/x-www-form-urlencoded',
        ])->withBody($imageData, 'text/plain')
          ->post("https://detect.roboflow.com/{$modelId}/4?api_key={$apiKey}");

        $result = $response->json();

        if (!isset($result['predictions']) || empty($result['predictions'])) {
            return ['isValid' => false, 'message' => 'AI tidak melihat objek apa pun.'];
        }

        $bestMatch = $result['predictions'][0];
        $detectedLabel = $bestMatch['class'];
        $confidence = $bestMatch['confidence'];

        // Ambil label yang seharusnya berdasarkan nama Toolbox
        $expectedLabel = $this->toolMapping[$expectedToolName] ?? null;

        // Validasi: 
        // 1. Label harus sesuai mapping
        // 2. Akurasi (confidence) minimal 50%
        if ($detectedLabel === $expectedLabel && $confidence >= 0.5) {
            return ['isValid' => true, 'label' => $detectedLabel];
        }

        return [
            'isValid' => false, 
            'message' => "Alat tidak sesuai! Anda membawa '{$detectedLabel}', sedangkan '{$expectedToolName}' seharusnya berisi '{$expectedLabel}'."
        ];
    }

    public function detectAndBorrow(Request $request)
    {
        // Validasi AI dengan mencocokkan pilihan Toolbox
        $aiResult = $this->validateAI($request->image, $request->nama_alat);

        if (!$aiResult['isValid']) {
            return response()->json([
                'status' => 'error',
                'message' => $aiResult['message']
            ], 422);
        }

        $data = Peminjaman::create([
            'kode_pinjam'  => 'PJ-' . strtoupper(Str::random(5)),
            'nama_alat'    => $request->nama_alat,
            'nama_kelas'   => $request->nama_kelas,
            'waktu_pinjam' => Carbon::now('Asia/Jakarta'),
            'status'       => 'Dipinjam'
        ]);

        return response()->json(['status' => 'success', 'detected' => $aiResult['label'], 'data' => $data]);
    }

    public function returnAlat(Request $request)
    {
        // 1. Cari data peminjaman terlebih dahulu
        $peminjaman = Peminjaman::where('kode_pinjam', $request->kodePinjam)
            ->where('status', 'Dipinjam')
            ->first();

        if (!$peminjaman) {
            return response()->json(['status' => 'error', 'message' => 'Data peminjaman tidak ditemukan.'], 404);
        }

        // 2. Jalankan Validasi AI berdasarkan nama_alat yang ada di database
        $aiResult = $this->validateAI($request->image, $peminjaman->nama_alat);

        if (!$aiResult['isValid']) {
            return response()->json([
                'status' => 'error',
                'message' => "Gagal Kembali: " . $aiResult['message']
            ], 422);
        }

        // 3. Jika cocok, update status
        $peminjaman->update([
            'status' => 'Kembali',
            'waktu_kembali' => Carbon::now('Asia/Jakarta')
        ]);

        return response()->json(['status' => 'success', 'detected' => $aiResult['label']]);
    }

    public function getRiwayat()
    {
        return response()->json(Peminjaman::orderBy('created_at', 'desc')->get());
    }
}