<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCaptainCoursesTable extends Migration
{
    public function up()
    {
        Schema::create('captain_courses', function (Blueprint $table) {
            $table->id();
            $table->string('kelas')->nullable();
            $table->string('semester')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('captain_courses');
    }
}
