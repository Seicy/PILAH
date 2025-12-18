import React, { useState, useRef, useEffect } from "react";
import SidebarCaptain from "@/Components/CaptainSidebar";
import HeaderCaptain from "@/Components/CaptainHeader";
import Webcam from "react-webcam";
import axios from "axios";

// IMPORT GAMBAR TOOLBOX
import toolbox1 from "@/Assets/toolbox1.png";
import toolbox2 from "@/Assets/toolbox2.png";
import toolbox3 from "@/Assets/toolbox3.png";
import toolbox4 from "@/Assets/toolbox4.png";
import toolbox5 from "@/Assets/toolbox5.png";
import toolbox6 from "@/Assets/toolbox6.png";
import toolbox7 from "@/Assets/toolbox7.png";
import toolbox8 from "@/Assets/toolbox8.png";

const toolboxImages = {
  "Toolbox 1": toolbox1,
  "Toolbox 2": toolbox2,
  "Toolbox 3": toolbox3,
  "Toolbox 4": toolbox4,
  "Toolbox 5": toolbox5,
  "Toolbox 6": toolbox6,
  "Toolbox 7": toolbox7,
  "Toolbox 8": toolbox8,
};

// --- KOMPONEN KAMERA AI ---
const CameraAI = ({ onDetected, loading }) => {
  const webcamRef = useRef(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Membersihkan string base64 agar hanya datanya saja yang dikirim (sesuai kebutuhan Laravel Http)
      const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
      onDetected(base64Data);
    }
  };

  return (
    <div className="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-md flex flex-col items-center bg-blue-50">
      <div className="w-full overflow-hidden rounded-md mb-2 bg-black border-2 border-gray-800">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-auto"
        />
      </div>
      <p className="text-xs text-blue-700 mb-3 text-center font-medium">
        📷 Pastikan alat terlihat jelas di kamera.
      </p>
      <button
        type="button"
        onClick={handleCapture}
        disabled={loading}
        className={`px-4 py-3 w-full text-white rounded-md font-bold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 shadow-lg"
        }`}
      >
        {loading ? "⌛ Menganalisis Objek..." : "🎯 Verifikasi AI & Ambil"}
      </button>
    </div>
  );
};

export default function CaptainDashboard() {
  const [tools] = useState([
    { id: 1, nama: "Toolbox 1" },
    { id: 2, nama: "Toolbox 2" },
    { id: 3, nama: "Toolbox 3" },
    { id: 4, nama: "Toolbox 4" },
    { id: 5, nama: "Toolbox 5" },
    { id: 6, nama: "Toolbox 6" },
    { id: 7, nama: "Toolbox 7" },
    { id: 8, nama: "Toolbox 8" },
  ]);

  const [selectedTool, setSelectedTool] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAmbilAlatClick = (e) => {
    e.preventDefault();
    if (!namaKelas) return alert("Silakan masukkan Nama Kelas peminjam!");
    setShowCamera(true);
  };

  const handleDetected = async (base64Data) => {
    setLoadingAI(true);
    try {
      // Mengirim data ke route /api/detect-alat di Laravel
      const response = await axios.post("/api/detect-alat", {
        image: base64Data,
        nama_alat: selectedTool.nama,
        nama_kelas: namaKelas
      });

      if (response.data.status === "success") {
        alert(`✅ Berhasil! AI Mendeteksi: ${response.data.detected}. Data peminjaman telah disimpan.`);
        setShowCamera(false);
        setSelectedTool(null);
        setNamaKelas("");
      }
    } catch (error) {
      // Menangkap pesan error dari Controller (Misal: "AI tidak mendeteksi alat")
      const msg = error.response?.data?.message || "Verifikasi AI gagal, coba lagi.";
      alert(`❌ Error: ${msg}`);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <SidebarCaptain />

      <div className="flex-1 flex flex-col">
        <HeaderCaptain />

        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Captain Dashboard <span className="text-blue-600">PILAH</span>
            </h1>
            <p className="text-gray-500">Pilih toolbox untuk memulai proses peminjaman dengan verifikasi AI.</p>
          </header>

          {/* GRID LIST TOOLBOX */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool);
                  setShowCamera(false);
                  setNamaKelas("");
                }}
                className={`flex flex-col items-center bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-300 hover:scale-105 p-4 ${
                  selectedTool?.id === tool.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-transparent"
                }`}
              >
                <img
                  src={toolboxImages[tool.nama]}
                  alt={tool.nama}
                  className="w-full h-40 object-contain mb-3"
                />
                <p className="text-lg font-semibold text-gray-700">{tool.nama}</p>
              </div>
            ))}
          </div>

          {/* MODAL PROSES PEMINJAMAN */}
          {selectedTool && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn">
              <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button 
                  onClick={() => setSelectedTool(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center border-b pb-4">
                  Pinjam {selectedTool.nama}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Alat</label>
                    <input
                      type="text"
                      value={selectedTool.nama}
                      className="w-full border bg-gray-100 rounded-lg p-3 outline-none font-bold text-gray-700"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Kelas / Peminjam</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama kelas (contoh: XII RPL 1)"
                      value={namaKelas}
                      onChange={(e) => setNamaKelas(e.target.value)}
                      disabled={showCamera}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>

                  {!showCamera ? (
                    <button
                      onClick={handleAmbilAlatClick}
                      className="w-full mt-4 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg transition-all"
                    >
                      Buka Kamera Verifikasi
                    </button>
                  ) : (
                    <CameraAI onDetected={handleDetected} loading={loadingAI} />
                  )}
                  
                  {showCamera && (
                    <button 
                      onClick={() => setShowCamera(false)}
                      disabled={loadingAI}
                      className="mt-2 w-full text-sm text-gray-400 hover:text-red-500 transition"
                    >
                      Batal & Tutup Kamera
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}