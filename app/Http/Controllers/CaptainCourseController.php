<?php

namespace App\Http\Controllers;

use App\Models\CaptainCourse;
use Illuminate\Http\Request;

class CaptainCourseController extends Controller
{
    // GET: ambil semua captain course
    public function index()
    {
        return response()->json(
            CaptainCourse::orderBy('created_at', 'desc')->get()
        );
    }

    // POST: tambah captain course
    public function store(Request $request)
    {
        $request->validate([
            'kelas' => 'required|string|max:255',
            'semester' => 'required|string|max:255',
        ]);

        $data = CaptainCourse::create([
            'kelas' => $request->kelas,
            'semester' => $request->semester,
        ]);

        return response()->json($data, 201);
    }

    // PUT: update
    public function update(Request $request, $id)
    {
        $request->validate([
            'kelas' => 'required|string|max:255',
            'semester' => 'required|string|max:255',
        ]);

        $data = CaptainCourse::findOrFail($id);
        $data->update($request->only('kelas', 'semester'));

        return response()->json($data);
    }

    // DELETE: hapus
    public function destroy($id)
    {
        CaptainCourse::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Captain course berhasil dihapus'
        ]);
    }
}

