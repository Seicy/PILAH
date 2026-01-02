<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Storeman;

class StoremanAuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'username' => 'required',
        'password' => 'required',
    ]);

    $storeman = Storeman::where('username', $request->username)->first();

    if (!$storeman) {
        return response()->json([
            'message' => 'Username atau password salah'
        ], 401);
    }

    // PENTING: karena password masih plaintext
    if ($storeman->password !== $request->password) {
        return response()->json([
            'message' => 'Username atau password salah'
        ], 401);
    }

    return response()->json([
        'message' => 'Login berhasil',
        'storeman' => $storeman
    ]);
}
    public function logout()
    {
        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}
