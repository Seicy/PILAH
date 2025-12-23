<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScanLog extends Model
{
    protected $table = 'scan_log'; // ← WAJIB!
    protected $fillable = [
        'uid', 
        'captain_course_id',
        'authorized',
        'response_json'
    ];

    public function captain()
    {
        return $this->belongsTo(CaptainCourse::class, 'captain_course_id');
    }
}
