<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RFIDCard;
use App\Models\CaptainCourse;
use App\Models\ScanLog;
use Illuminate\Support\Facades\Cache;

class RFIDLoginController extends Controller
{
    /**
     * Dipanggil oleh React untuk memberi tahu bahwa halaman sedang menunggu scan.
     */
    public function waitScan()
    {
        Cache::put('rfid_waiting', true, 30); // 30 detik
        return response()->json(['status' => 'waiting']);
    }

    /**
     * Dipanggil oleh ESP via MQTT (bukan React)
     * → Tetapi React polling hasilnya dari /api/last-login
     */
    public function loginCaptain(Request $request)
    {
        $uid = $request->uid;

        if (!$uid) {
            return response()->json([
                'success' => false,
                'message' => 'UID is required'
            ], 400);
        }

        $card = RFIDCard::where('uid', $uid)->where('active', true)->first();

        if (!$card) {
            $log = ScanLog::create([
                'uid' => $uid,
                'captain_course_id' => null,
                'authorized' => false,
            ]);

            Cache::put('last_rfid_login', $log, 10);

            return response()->json([
                'authorized' => false,
                'message' => 'RFID not registered'
            ]);
        }

        $captain = $card->captain;

        $log = ScanLog::create([
            'uid' => $uid,
            'captain_course_id' => $captain->id,
            'authorized' => true,
        ]);

        Cache::put('last_rfid_login', $log->load('captain'), 10);

        return response()->json([
            'authorized' => true,
            'captain' => $captain
        ]);
    }

    /**
     * React polling endpoint
     */
    public function lastLogin()
{
    $latest = Cache::get('last_rfid_login');

    // BELUM ADA SCAN
    if (!$latest) {
        return response()->json([
            'status' => Cache::get('rfid_waiting') ? 'waiting' : 'idle'
        ]);
    }

    // ADA SCAN → KIRIM KE FRONTEND
    Cache::forget('last_rfid_login');
    Cache::forget('rfid_waiting');

    return response()->json([
        'status'     => 'scanned',
        'id'         => $latest->id,
        'uid'        => $latest->uid,
        'authorized' => $latest->authorized,
        'captain'    => $latest->captain
    ]);
}



}
