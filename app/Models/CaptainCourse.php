<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaptainCourse extends Model
{
    protected $table = 'captain_courses';

    protected $fillable = [
        'kelas',
        'semester',
    ];

    public function rfidCard()
    {
        return $this->hasMany(RFIDCard::class, 'captain_course_id');
    }

    public function scanLogs()
    {
        return $this->hasMany(ScanLog::class, 'captain_course_id');
    }
}
