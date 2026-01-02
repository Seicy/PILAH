<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Storeman extends Model
{
    protected $table = 'storemen';

    protected $fillable = [
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
    ];
}
