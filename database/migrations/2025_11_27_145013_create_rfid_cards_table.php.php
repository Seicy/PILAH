<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRfidCardsTable extends Migration
{
    public function up()
    {
        Schema::create('rfid_cards', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique();
            $table->foreignId('captain_course_id')->nullable()->constrained('captain_courses')->onDelete('set null');
            $table->boolean('active')->default(true);
            $table->string('label')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('rfid_cards');
    }
}
