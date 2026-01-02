<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Riwayat extends Model
{
    use HasFactory;
    protected $table = 'riwayats';

    // Daftar kolom yang diizinkan untuk diisi (Mass Assignment)
    protected $fillable = [
        'kode_pinjam',
        'nama_alat',
        'nama_kelas',
        'waktu_pinjam',
        'waktu_kembali',
        'status'
    ];
}