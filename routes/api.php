<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DetectionController;
use App\Http\Controllers\RFIDLoginController;
use App\Http\Controllers\KelolaPenggunaController;
use App\Http\Controllers\CaptainCourseController;

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

//---Kelola Pengguna---//
Route::get('/kelola-pengguna', [KelolaPenggunaController::class, 'index']);
Route::post('/kelola-pengguna', [KelolaPenggunaController::class, 'store']);
Route::put('/kelola-pengguna/{id}', [KelolaPenggunaController::class, 'update']);
Route::delete('/kelola-pengguna/{id}', [KelolaPenggunaController::class, 'destroy']);

//---Kelola Pengguna Captain Course---//
Route::prefix('storeman')->group(function () {
    Route::get('/captain-course', [CaptainCourseController::class, 'index']);
    Route::post('/captain-course', [CaptainCourseController::class, 'store']);
    Route::put('/captain-course/{id}', [CaptainCourseController::class, 'update']);
    Route::delete('/captain-course/{id}', [CaptainCourseController::class, 'destroy']);
});