import React, { useRef, useState, useCallback } from 'react';
import Webcam from "react-webcam";
import axios from 'axios';

const DetectionModal = ({ namaAlat, onClose, onRefreshData }) => {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [namaKelas, setNamaKelas] = useState("");

  const captureAndDetect = useCallback(async () => {
    if (!namaKelas) return alert("Masukkan nama kelas dulu!");
    
    setLoading(true);
    // Ambil screenshot dari webcam dalam format Base64
    const imageSrc = webcamRef.current.getScreenshot();
    
    // Bersihkan prefix base64 untuk dikirim ke API
    const base64Image = imageSrc.split(',')[1];

    try {
      const response = await axios.post('/api/detect-alat', {
        image: base64Image,
        nama_alat: namaAlat,
        nama_kelas: namaKelas
      });

      alert(response.data.message);
      onRefreshData(); // Refresh tabel riwayat
      onClose();       // Tutup modal
    } catch (error) {
      alert(error.response?.data?.message || "Deteksi Gagal");
    } finally {
      setLoading(false);
    }
  }, [webcamRef, namaKelas, namaAlat]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Pinjam {namaAlat}</h3>
        <input 
          type="text" 
          placeholder="Masukkan Nama Kelas" 
          onChange={(e) => setNamaKelas(e.target.value)}
          className="form-input"
        />
        
        {/* Frame Kamera AI */}
        <div className="camera-box" style={{ border: '2px dashed #ccc', margin: '10px 0' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
          />
          <p>Kamera AI aktif: Arahkan alat ke kamera</p>
        </div>

        <div className="button-group">
          <button onClick={onClose} className="btn-batal">Batal</button>
          <button 
            onClick={captureAndDetect} 
            disabled={loading} 
            className="btn-simulasikan"
            style={{ backgroundColor: '#2ecc71', color: 'white' }}
          >
            {loading ? "Memproses..." : "Simulasikan Deteksi Alat"}
          </button>
        </div>
      </div>
    </div>
  );
};