import React, { useState, useEffect, useRef } from "react";
import CaptainSidebar from "@/Components/CaptainSidebar";
import CaptainHeader from "@/Components/CaptainHeader";
import Webcam from "react-webcam";
import axios from "axios";

// --- KOMPONEN KAMERA AI ---
const CameraAI = ({ onDetected, loading }) => {
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Mengambil data base64 tanpa header data:image/jpeg;base64,
      const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
      onDetected(base64Data);
    }
  };

  return (
    <div className="mt-4 p-4 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center bg-gray-50">
      <div className="w-full overflow-hidden rounded-md mb-3 bg-black">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-auto"
        />
      </div>
      <p className="text-xs text-gray-500 mb-3 text-center">
        Arahkan alat ke kamera agar AI dapat melakukan verifikasi pengembalian.
      </p>
      <button
        type="button"
        onClick={handleCapture}
        disabled={loading}
        className={`px-4 py-3 w-full text-white rounded-md font-bold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
        }`}
      >
        {loading ? "⌛ Memproses Verifikasi AI..." : "📸 Ambil Foto & Kembalikan"}
      </button>
    </div>
  );
};

export default function CaptainPeminjaman() {
  const [riwayat, setRiwayat] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- AMBIL DATA DARI DATABASE ---
  const fetchData = async () => {
    try {
      const res = await axios.get('/api/riwayat-peminjaman');
      setRiwayat(res.data);
    } catch (err) {
      console.error("Gagal mengambil data riwayat:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturnClick = (tool) => {
    setSelectedTool(tool);
    setShowCamera(true);
  };

  // --- PROSES PENGEMBALIAN KE LARAVEL ---
  const processReturn = async (base64Image) => {
    setLoading(true);
    try {
      // Mengirim ke API return-alat yang dihandle oleh DetectionController
      const response = await axios.post("/api/return-alat", { 
        image: base64Image,
        kodePinjam: selectedTool.kode_pinjam 
      });

      if (response.data.status === "success") {
        alert("✅ Verifikasi Berhasil! Alat telah dikembalikan ke sistem.");
        setShowCamera(false);
        setSelectedTool(null);
        fetchData(); // Refresh tabel
      }
    } catch (error) {
      // Menangkap pesan error dari AI (misal: "Verifikasi Gagal! Alat tidak terdeteksi")
      const errorMessage = error.response?.data?.message || "Gagal memproses pengembalian.";
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <CaptainSidebar />

      <div className="flex-1 flex flex-col">
        <CaptainHeader />

        <div className="p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
            Manajemen <span className="text-blue-600">Peminjaman</span>
          </h1>

          {/* TABEL 1: SEDANG DIPINJAM */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-l-4 border-blue-500 pl-4">
              Sedang Dipinjam
            </h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-4 font-bold text-gray-700">Kode</th>
                    <th className="p-4 font-bold text-gray-700">Nama Alat</th>
                    <th className="p-4 font-bold text-gray-700">Kelas</th>
                    <th className="p-4 font-bold text-gray-700 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.filter(item => item.status === 'Dipinjam').length > 0 ? (
                    riwayat.filter(item => item.status === 'Dipinjam').map((row) => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-4 text-gray-600 font-mono">{row.kode_pinjam}</td>
                        <td className="p-4 text-gray-800 font-bold">{row.nama_alat}</td>
                        <td className="p-4 text-gray-600">{row.nama_kelas}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleReturnClick(row)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-semibold shadow-sm transition"
                          >
                            Kembalikan
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400 italic">
                        Tidak ada alat yang sedang dipinjam saat ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABEL 2: RIWAYAT SELESAI */}
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-l-4 border-green-500 pl-4">
              Riwayat Peminjaman Selesai
            </h2>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-green-50">
                  <tr>
                    <th className="p-4 font-bold text-gray-700">Nama Alat</th>
                    <th className="p-4 font-bold text-gray-700">Peminjam</th>
                    <th className="p-4 font-bold text-gray-700 text-center">Waktu Pinjam</th>
                    <th className="p-4 font-bold text-gray-700 text-center">Waktu Kembali</th>
                    <th className="p-4 font-bold text-gray-700 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.filter(item => item.status === 'Kembali').map((row) => (
                    <tr key={row.id} className="border-b border-gray-100">
                      <td className="p-4 text-gray-800 font-bold">{row.nama_alat}</td>
                      <td className="p-4 text-gray-600">{row.nama_kelas}</td>
                      <td className="p-4 text-center text-gray-500 text-xs">
                        {new Date(row.waktu_pinjam).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 text-center text-green-600 font-semibold text-xs">
                        {row.waktu_kembali ? new Date(row.waktu_kembali).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL PROSES PENGEMBALIAN */}
      {showCamera && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-1 text-gray-800 text-center">Proses Pengembalian</h2>
            <p className="text-center text-blue-600 font-bold mb-4">
              {selectedTool.nama_alat} ({selectedTool.kode_pinjam})
            </p>
            
            <CameraAI onDetected={processReturn} loading={loading} />
            
            <div className="flex justify-center mt-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => { setShowCamera(false); setSelectedTool(null); }}
                className="text-gray-500 hover:text-gray-700 font-medium transition"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}