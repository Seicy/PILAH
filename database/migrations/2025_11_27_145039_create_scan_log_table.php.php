<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScanLogTable extends Migration
{
    public function up()
    {
        Schema::create('scan_log', function (Blueprint $table) {
            $table->id();
            $table->string('uid');
            $table->foreignId('captain_course_id')->nullable()->constrained('captain_courses')->onDelete('set null');
            $table->boolean('authorized')->default(false);
            $table->text('response_json')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('scan_log');
    }
}
