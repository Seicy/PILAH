<?php

namespace App\Http\Controllers;

use App\Models\KelolaPengguna;
use App\Models\RFIDCard;
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
    public function storeRfid(Request $request) 
{
    $request->validate([
        'uid' => 'required|string',
        'captain_course_id' => 'required'
    ]);

    // Asumsi Anda punya tabel/model RfidCard
    return \App\Models\RFIDCard::create($request->all());
}

public function indexRfid()
{
    // Mengambil data rfid beserta data kelasnya
    return \App\Models\RFIDCard::with('captain')->get();
}
public function destroyRfid($id)
    {
        // Cari di model RFIDCard, bukan KelolaPengguna
        $rfid = RFIDCard::find($id);

        if (!$rfid) {
            return response()->json(['message' => 'Kartu tidak ditemukan'], 404);
        }

        $rfid->delete();
        return response()->json(['message' => 'Kartu RFID berhasil dihapus']);
    }
}

