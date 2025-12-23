<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PhpMqtt\Client\MqttClient;
use PhpMqtt\Client\ConnectionSettings;

use App\Models\RFIDCard;
use App\Models\CaptainCourse;
use App\Models\ScanLog;
use Illuminate\Support\Facades\Cache;   // <-- TAMBAHKAN INI

class MqttListen extends Command
{
    protected $signature = 'mqtt:listen';
    protected $description = 'Listen to MQTT and validate RFID';

    public function handle()
    {
        $clientId = 'laravel_listener_' . uniqid();
        $mqtt = new MqttClient(env('MQTT_HOST'), env('MQTT_PORT'), $clientId);

        $settings = (new ConnectionSettings)
            ->setUsername(env('MQTT_USER'))
            ->setPassword(env('MQTT_PASS'))
            ->setKeepAliveInterval(10);

        $mqtt->connect($settings, true);

        $this->info("Connected to MQTT broker");
        $this->info("Listening on topic: pilah/rfid/scan");

        $mqtt->subscribe('pilah/rfid/scan', function ($topic, $message) use ($mqtt) {

            echo "\n============================\n";
            echo "RAW MESSAGE: $message\n";

            $data = json_decode($message, true);

            if (!$data || !isset($data['uid'])) {
                echo "INVALID MESSAGE FORMAT!\n";
                return;
            }

            $uid = strtoupper($data['uid']);
            echo "UID: $uid\n";

            $card = RFIDCard::where('uid', $uid)
                ->where('active', true)
                ->first();

            if ($card) {
                $captain = CaptainCourse::find($card->captain_course_id);

                $response = [
                    'authorized' => true,
                    'captain' => $captain,
                ];

                echo "RFID VALID → {$captain->nama}\n";
            } else {
                $captain = null;

                $response = [
                    'authorized' => false,
                    'uid' => $uid
                ];

                echo "RFID INVALID → UID NOT FOUND\n";
            }

            // === SAVE TO DATABASE ===
            $log = ScanLog::create([
                'uid' => $uid,
                'captain_course_id' => $captain?->id,
                'authorized' => $card ? true : false,
                'response_json' => json_encode($response)
            ]);

            echo "LOG SAVED → ID: {$log->id}\n";

            // === SAVE TO CACHE (FIX LANDING PAGE) ===
            Cache::put('last_rfid_login', $log->load('captain'), 10);

            echo "CACHE UPDATED → last_rfid_login\n";

            // === PUBLISH RESPONSE ===
            $mqtt->publish('pilah/rfid/response', json_encode($response), 0);

            echo "RESPONSE SENT\n";

        }, 0);

        $mqtt->loop(true);
    }
}
