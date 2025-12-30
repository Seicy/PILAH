<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KelolaPengguna extends Model
{
    use HasFactory;

    protected $table = 'kelola_pengguna';

    protected $fillable = [
        'kelas',
        'semester',
    ];
}
