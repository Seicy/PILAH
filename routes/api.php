<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DetectionController;
use App\Http\Controllers\RFIDLoginController;

//---RFID LOGIN---//
Route::post('/wait-scan', [RFIDLoginController::class, 'waitScan']);
Route::post('/rfid/login', [RFIDLoginController::class, 'loginCaptain']);
Route::get('/last-login', [RFIDLoginController::class, 'lastLogin']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//---CAMERA PINJAM DAN KEMBALI---//
Route::get('/riwayat-peminjaman', [DetectionController::class, 'getRiwayat']);
Route::post('/detect-alat', [DetectionController::class, 'detectAndBorrow']);
Route::post('/return-alat', [DetectionController::class, 'returnAlat']);