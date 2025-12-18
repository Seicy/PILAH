<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peminjamans', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pinjam')->unique(); // Contoh: PJ-12345
            $table->string('nama_alat');           // Contoh: Toolbox 1
            $table->string('nama_kelas');          // Input dari user di React
            $table->dateTime('waktu_pinjam');      // Tanggal & jam saat deteksi berhasil
            $table->dateTime('waktu_kembali')->nullable(); // Diisi saat alat dikembalikan
            $table->enum('status', ['Dipinjam', 'Kembali'])->default('Dipinjam');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::offIfExists('peminjamans');
    }
};