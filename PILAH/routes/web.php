<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman utama (langsung test Tailwind)
Route::get('/', function () {
    return Inertia::render('LandingPage');
});

require __DIR__.'/auth.php';
