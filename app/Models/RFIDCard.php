<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RFIDCard extends Model
{
    protected $table = 'rfid_cards';

    protected $fillable = [
        'uid',
        'captain_course_id',
        'active',
        'label',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function captain()
    {
        return $this->belongsTo(CaptainCourse::class, 'captain_course_id');
    }
}
