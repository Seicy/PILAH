<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
    Schema::create('riwayats', function (Blueprint $table) {
        $table->id();
        $table->string('kode_pinjam')->unique(); // TAMBAHKAN INI
        $table->string('nama_alat');
        $table->string('nama_kelas');
        $table->dateTime('waktu_pinjam');
        $table->dateTime('waktu_kembali')->nullable();
        $table->string('status');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('riwayats');
    }
};
