<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

// IMPORT COMMAND MQTT KITA
use App\Console\Commands\MqttListen;

class Kernel extends ConsoleKernel
{
    /**
     * Register the commands for the application.
     */
    protected $commands = [
        MqttListen::class, // <- DAFTARKAN COMMAND MQTT DI SINI
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Contoh jika suatu hari ingin menjalankan MQTT listener otomatis
        // $schedule->command('mqtt:rfid-listen')->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
