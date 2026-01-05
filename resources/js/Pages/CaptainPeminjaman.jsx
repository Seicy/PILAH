import React, { useState, useEffect, useRef } from "react";
import CaptainSidebar from "@/Components/CaptainSidebar";
import CaptainHeader from "@/Components/CaptainHeader";
import Webcam from "react-webcam";
import axios from "axios";

// --- KOMPONEN KAMERA UNTUK VERIFIKASI ---
const CameraAI = ({ onDetected, loading }) => {
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
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
      <button
        type="button"
        onClick={handleCapture}
        disabled={loading}
        className={`px-4 py-3 w-full text-white rounded-md font-bold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md"
        }`}
      >
        {loading ? "⌛ Memproses Verifikasi..." : "📸 Ambil Foto & Kembalikan"}
      </button>
    </div>
  );
};

export default function CaptainPeminjaman() {
  const [riwayat, setRiwayat] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captainData, setCaptainData] = useState({ kelas: "", semester: "" });

  /* ============================================================
      1. LOAD SESSION (Mencari data kelas yang sedang login)
  ============================================================ */
  useEffect(() => {
    const findSession = () => {
      // Prioritaskan key 'captain' yang diset saat login sukses
      const keys = ["captain", "captain_course", "user", "session"];
      for (let key of keys) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            const detectedKelas = parsed.kelas || parsed.nama_kelas;
            const detectedSemester = parsed.semester || parsed.nama_semester;

            if (detectedKelas) {
              setCaptainData({
                kelas: detectedKelas,
                semester: String(detectedSemester)
              });
              return; // Berhenti mencari jika sudah ketemu
            }
          } catch (e) {
            console.error("Gagal parsing session:", e);
          }
        }
      }
    };

    findSession();
  }, []);

  /* ============================================================
      2. FETCH DATA (Hanya jalan jika captainData sudah terisi)
  ============================================================ */
  useEffect(() => {
    if (captainData.kelas) {
      fetchData();
    }
  }, [captainData.kelas]); // Trigger ulang jika kelas berubah

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/riwayat-peminjaman');
      setRiwayat(res.data);
    } catch (err) {
      console.error("Gagal ambil data riwayat:", err);
    }
  };

  /* ============================================================
      3. FILTER LOGIC (Strict Matching)
  ============================================================ */
  const dataFiltered = riwayat.filter(item => {
    // Jika sesi belum terbaca, jangan tampilkan apapun
    if (!captainData.kelas) return false;

    const sessionKelas = String(captainData.kelas).toLowerCase().replace(/\s/g, "");
    const dbKelas = String(item.nama_kelas).toLowerCase().replace(/\s/g, "");
    
    // Pastikan kelas sama dan semester
    return dbKelas === sessionKelas;
  });

  /* =====================
      PROSES KEMBALI
  ====================== */
  const handleReturnClick = (tool) => {
    setSelectedTool(tool);
    setShowCamera(true);
  };

  const processReturn = async (base64Image) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/return-alat", { 
        image: base64Image,
        kodePinjam: selectedTool.kode_pinjam 
      });

      if (response.data.status === "success") {
        alert("✅ Berhasil! Alat telah dikembalikan.");
        setShowCamera(false);
        setSelectedTool(null);
        fetchData();
      }
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.message || "Gagal memproses"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <CaptainSidebar activePage="peminjaman" />

      <div className="flex-1">
        <CaptainHeader />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Manajemen <span className="text-blue-600">Peminjaman</span>
          </h1>

          {/* TABEL 1: SEDANG DIPINJAM */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Sedang Dipinjam
            </h2>
            <div className="bg-white rounded-lg shadow border border-blue-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="p-3 border">Kode Pinjam</th>
                    <th className="p-3 border">Nama Alat</th>
                    <th className="p-3 border text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFiltered.filter(i => i.status === 'Dipinjam').length > 0 ? (
                    dataFiltered.filter(i => i.status === 'Dipinjam').map((row) => (
                      <tr key={row.id} className="text-center border-b hover:bg-blue-50/50">
                        <td className="p-3 border font-mono text-gray-600 text-sm">{row.kode_pinjam}</td>
                        <td className="p-3 border font-bold text-gray-800">{row.nama_alat}</td>
                        <td className="p-3 border text-center">
                          <button 
                            onClick={() => handleReturnClick(row)}
                            className="px-6 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-sm transition-all"
                          >
                            Kembalikan
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-400 italic bg-gray-50">
                        Tidak ada alat yang sedang dipinjam oleh kelas {captainData.kelas}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* TABEL 2: RIWAYAT LENGKAP */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-green-500 rounded-full"></span> Riwayat Peminjaman Selesai
            </h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-500 text-white uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-blue-800">Nama Kelas</th>
                    <th className="p-4 border-b border-blue-800">Alat</th>
                    <th className="p-4 border-b border-blue-800 text-center">Waktu Pinjam</th>
                    <th className="p-4 border-b border-blue-800 text-center">Waktu Kembali</th>
                    <th className="p-4 border-b border-blue-800 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataFiltered.length > 0 ? (
                    dataFiltered.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-800 font-medium border-r">{row.nama_kelas}</td>
                        <td className="p-4 border-r">
                          <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 text-xs font-mono text-gray-700">
                            {row.nama_alat}
                          </span>
                        </td>
                        <td className="p-4 text-center text-gray-500 text-xs border-r">
                          {row.waktu_pinjam ? new Date(row.waktu_pinjam).toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="p-4 text-center text-xs border-r">
                          {row.waktu_kembali ? (
                            <span className="text-green-600 font-bold">{new Date(row.waktu_kembali).toLocaleString('id-ID')}</span>
                          ) : (
                            <span className="text-gray-400 italic">Belum kembali</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter ${
                            row.status === 'Dipinjam' 
                            ? "bg-orange-100 text-orange-600 ring-1 ring-orange-200" 
                            : "bg-green-100 text-green-700 ring-1 ring-green-200"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center text-gray-400 italic">
                        Belum ada riwayat peminjaman untuk kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL KAMERA VERIFIKASI */}
      {showCamera && selectedTool && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800 text-center">Konfirmasi Pengembalian</h2>
            <p className="text-center text-blue-600 font-bold mb-4 uppercase text-xs tracking-widest">{selectedTool.nama_alat}</p>
            <CameraAI onDetected={processReturn} loading={loading} />
            <button 
              onClick={() => { setShowCamera(false); setSelectedTool(null); }} 
              className="w-full mt-4 text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              Batalkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}