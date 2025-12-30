<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // jangan lupa import Auth


// HALAMAN UTAMA
Route::get('/', function () {
    return Inertia::render('LandingPage');
});

// STOREMAN LOGIN
Route::get('/StoremanLogin', function () {
    return Inertia::render('StoremanLogin');
});

// STOREMAN DASHBOARD
Route::get('/StoremanDashboard', function () {
    return Inertia::render('StoremanDashboard');
});

// STOREMAN KELOLA PENGGUNA
Route::get('/KelolaPengguna', function () {
    return Inertia::render('KelolaPengguna');
});

// STOREMAN RIWAYAT PEMINJAMAN
Route::get('/Riwayat', function () {
    return Inertia::render('Riwayat');
});

// CAPTAIN DASHBOARD
Route::get('/CaptainDashboard', function () {
    return Inertia::render('CaptainDashboard');
});

// CAPTAIN Peminjaman
Route::get('/CaptainPeminjaman', function () {
    return Inertia::render('CaptainPeminjaman');
});

// =========================
// LOGOUT
// =========================
Route::post('/logout', function () {
    Auth::logout(); // hapus session user
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/'); // arahkan ke LandingPage.jsx
})->name('logout');

require __DIR__.'/auth.php';

