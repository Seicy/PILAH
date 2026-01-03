<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RFIDCard;
use App\Models\ScanLog;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class RFIDLoginController extends Controller
{
    /**
     * Dipanggil React (Landing / Storeman)
     * Menandai frontend SIAP menerima scan
     */
    public function waitScan()
    {
        Cache::put('rfid_waiting_since', now(), 60);

        return response()->json([
            'status' => 'waiting'
        ]);
    }

    /**
     * Dipanggil ESP via MQTT
     * Menyimpan hasil scan ke DB (ScanLog)
     */
    public function loginCaptain(Request $request)
    {
        $uid = $request->uid;

        if (!$uid) {
            return response()->json([
                'authorized' => false,
                'message' => 'UID is required'
            ], 400);
        }

        $card = RFIDCard::where('uid', $uid)
            ->where('active', true)
            ->first();

        if (!$card) {
            ScanLog::create([
                'uid' => $uid,
                'captain_course_id' => null,
                'authorized' => false,
            ]);

            return response()->json([
                'authorized' => false,
                'message' => 'RFID not registered'
            ]);
        }

        $captain = $card->captain;

        ScanLog::create([
            'uid' => $uid,
            'captain_course_id' => $captain->id,
            'authorized' => true,
        ]);

        return response()->json([
            'authorized' => true,
            'captain' => $captain
        ]);
    }

    /**
     * Dipanggil React (polling)
     * Mengambil scan SETELAH waitScan()
     */
    public function lastLogin()
    {
        $waitingSince = Cache::get('rfid_waiting_since');

        // Frontend belum siap scan
        if (!$waitingSince) {
            return response()->json([
                'status' => 'idle'
            ]);
        }

        // Cari scan BARU setelah waitScan
        $scan = ScanLog::where('created_at', '>=', $waitingSince)
            ->latest()
            ->with('captain')
            ->first();

        if (!$scan) {
            return response()->json([
                'status' => 'waiting'
            ]);
        }

        return response()->json([
            'status'     => 'scanned',
            'id'         => $scan->id,
            'uid'        => $scan->uid,
            'authorized' => $scan->authorized,
            'captain'    => $scan->captain
        ]);
    }
}
