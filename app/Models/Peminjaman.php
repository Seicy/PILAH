<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'peminjamans';

    // Kolom yang boleh diisi
    protected $fillable = [
        'kode_pinjam',
        'nama_alat',
        'nama_kelas',
        'waktu_pinjam',
        'waktu_kembali',
        'status',
    ];

    // Mengatur agar Laravel mengenali format tanggal otomatis
    protected $casts = [
        'waktu_pinjam' => 'datetime',
        'waktu_kembali' => 'datetime',
    ];
}