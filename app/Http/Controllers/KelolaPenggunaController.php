<?php

namespace App\Http\Controllers;

use App\Models\KelolaPengguna;
use Illuminate\Http\Request;

class KelolaPenggunaController extends Controller
{
    public function index()
    {
        return KelolaPengguna::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'kelas' => 'required|string|max:50',
            'semester' => 'required|integer|min:1|max:9',
        ]);

        return KelolaPengguna::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'kelas' => 'required|string|max:50',
            'semester' => 'required|integer|min:1|max:9',
        ]);

        $data = KelolaPengguna::findOrFail($id);
        $data->update($request->all());

        return $data;
    }

    public function destroy($id)
    {
        KelolaPengguna::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

