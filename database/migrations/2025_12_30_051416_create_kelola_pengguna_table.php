<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kelola_pengguna', function (Blueprint $table) {
            $table->id();
            $table->string('kelas', 50);
            $table->unsignedTinyInteger('semester');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelola_pengguna');
    }
};
