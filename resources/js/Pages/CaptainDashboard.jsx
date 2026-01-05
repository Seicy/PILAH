import React, { useState, useRef, useEffect } from "react";
import SidebarCaptain from "@/Components/CaptainSidebar";
import HeaderCaptain from "@/Components/CaptainHeader";
import Webcam from "react-webcam";
import axios from "axios";

// ASSETS TOOLBOX
import toolbox1 from "@/Assets/toolbox1.png";
import toolbox2 from "@/Assets/toolbox2.png";
import toolbox3 from "@/Assets/toolbox3.png";
import toolbox4 from "@/Assets/toolbox4.png";
import toolbox5 from "@/Assets/toolbox5.png";
import toolbox6 from "@/Assets/toolbox6.png";
import toolbox7 from "@/Assets/toolbox7.png";
import toolbox8 from "@/Assets/toolbox8.png";

const toolboxImages = {
  "Toolbox 1": toolbox1, "Toolbox 2": toolbox2, "Toolbox 3": toolbox3, "Toolbox 4": toolbox4,
  "Toolbox 5": toolbox5, "Toolbox 6": toolbox6, "Toolbox 7": toolbox7, "Toolbox 8": toolbox8,
};

/* ==========================================
   COMPONENT: CAMERA AI
   ========================================== */
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
    <div className="mt-4 p-4 border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center bg-blue-50">
      <div className="w-full overflow-hidden rounded-lg mb-4 bg-black border-2 border-gray-800">
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
        className={`px-4 py-4 w-full text-white rounded-lg font-bold text-lg transition shadow-lg ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:scale-95"
        }`}
      >
        {loading ? "⌛ Menganalisis Objek..." : "🎯 Verifikasi & Ambil Alat"}
      </button>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT: CAPTAIN DASHBOARD
   ========================================== */
export default function CaptainDashboard() {
  const [tools] = useState([
    { id: 1, nama: "Toolbox 1" }, { id: 2, nama: "Toolbox 2" },
    { id: 3, nama: "Toolbox 3" }, { id: 4, nama: "Toolbox 4" },
    { id: 5, nama: "Toolbox 5" }, { id: 6, nama: "Toolbox 6" },
    { id: 7, nama: "Toolbox 7" }, { id: 8, nama: "Toolbox 8" },
  ]);

  const [selectedTool, setSelectedTool] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [captainData, setCaptainData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Load data dari LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("captain");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCaptainData(parsed);
    }
  }, []);

  /* PROSES KIRIM KE DATABASE (PERBAIKAN NAMA_KELAS) */
  const handleDetected = async (base64Data) => {
    setLoadingAI(true);
    try {
      /** * PERBAIKAN: Pastikan 'nama_kelas' dikirim dengan isi 'captainData.kelas' 
       * agar tidak lagi masuk sebagai "Umum" di database.
       */
      const payload = {
        image: base64Data, 
        nama_alat: selectedTool.nama, 
        nama_kelas: captainData?.kelas || "Umum", // Mengambil Pagi C / Pagi B dari session
        semester: captainData?.semester || "-"
      };

      const res = await axios.post("/api/detect-alat", payload);
      
      if (res.data.status === "success") {
        alert(`✅ Sukses! Peminjaman Kelas ${captainData.kelas} tercatat.`);
        setSelectedTool(null);
        setShowCamera(false);
      }
    } catch (err) { 
      alert("❌ Gagal: " + (err.response?.data?.message || "Verifikasi AI Gagal")); 
    } finally { setLoadingAI(false); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <SidebarCaptain />
      
      <div className="flex-1 flex flex-col">
        <HeaderCaptain />
        
        <div className="p-8">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
              Dashboard <span className="text-blue-600 text-3xl">PILAH</span>
            </h1>
          </header>

          {/* GRID ALAT */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {tools.map((t) => (
              <div 
                key={t.id} 
                onClick={() => { setSelectedTool(t); setShowCamera(false); }}
                className={`group p-6 bg-white rounded-3xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  selectedTool?.id === t.id ? "border-blue-600 bg-blue-50/50" : "border-gray-100 hover:border-blue-300"
                }`}
              >
                <div className="aspect-square flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-gray-50">
                  <img src={toolboxImages[t.nama]} className="w-4/5 h-4/5 object-contain" alt={t.nama} />
                </div>
                <p className="text-center font-black text-gray-800 text-lg uppercase">{t.nama}</p>
              </div>
            ))}
          </div>

          {/* MODAL PINJAM (KELAS & SEMESTER SAJA) */}
          {selectedTool && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
              <div className="bg-white p-8 rounded-[2rem] w-full max-w-md relative shadow-2xl border-t-[10px] border-blue-600">
                <button 
                  onClick={() => setSelectedTool(null)} 
                  className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
                >✕</button>
                
                <h2 className="text-2xl font-black mb-6 text-center text-gray-900">Pinjam {selectedTool.nama}</h2>
                
                <div className="space-y-6">
                  {/* Tampilan Kelas & Semester Sesuai Database */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Sesi Login</label>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-bold">KELAS</span>
                            <span className="text-xl font-black text-blue-700">{captainData?.kelas || "---"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-bold">SEMESTER</span>
                            <span className="text-xl font-black text-slate-900">{captainData?.semester || "-"}</span>
                        </div>
                    </div>
                  </div>

                  {!showCamera ? (
                    <button 
                      onClick={() => setShowCamera(true)} 
                      disabled={!captainData}
                      className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 ${
                        captainData 
                        ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200" 
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Buka Kamera Verifikasi AI
                    </button>
                  ) : (
                    <CameraAI onDetected={handleDetected} loading={loadingAI} />
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