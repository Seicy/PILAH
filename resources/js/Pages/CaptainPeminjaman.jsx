// resources/js/components/CaptainPeminjaman.jsx

import React from "react";
import CaptainSidebar from "../components/CaptainSidebar";
import CaptainHeader from "../components/CaptainHeader";

// =========================
// STATUS PEMINJAMAN TABLE
// =========================
const StatusPeminjamanTable = () => {
  const data = [
    { kodePinjam: "12345", namaAlat: "Tool Box", namaKelas: "Pagi A", keterangan: "Lengkap" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-4 font-bold text-gray-700">Kode Pinjam</th>
            <th className="p-4 font-bold text-gray-700">Nama Alat</th>
            <th className="p-4 font-bold text-gray-700">Nama Kelas</th>
            <th className="p-4 font-bold text-gray-700">Keterangan Alat</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="p-4 text-gray-600">{row.kodePinjam}</td>
              <td className="p-4 text-gray-600">{row.namaAlat}</td>
              <td className="p-4 text-gray-600">{row.namaKelas}</td>
              <td className="p-4 text-gray-600">{row.keterangan}</td>
            </tr>
          ))}

          {[...Array(3)].map((_, i) => (
            <tr key={`empty-${i}`} className="border-b border-gray-200">
              <td className="p-4 h-14">&nbsp;</td>
              <td className="p-4">&nbsp;</td>
              <td className="p-4">&nbsp;</td>
              <td className="p-4">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =========================
// RIWAYAT PEMINJAMAN TABLE
// =========================
const RiwayatPeminjamanTable = () => {
  const data = [
    {
      kodeAlat: "3128",
      namaAlat: "ToolBox 2",
      peminjam: "Pagi A",
      waktuPinjam: "23/09/2025 08.00",
      waktuKembali: "23/09/2025 10.00",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-4 font-bold text-gray-700">Kode Alat</th>
            <th className="p-4 font-bold text-gray-700">Nama Alat</th>
            <th className="p-4 font-bold text-gray-700">Peminjam</th>
            <th className="p-4 font-bold text-gray-700">Waktu Pinjam</th>
            <th className="p-4 font-bold text-gray-700">Waktu Kembali</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="p-4 text-gray-600">{row.kodeAlat}</td>
              <td className="p-4 text-gray-600">{row.namaAlat}</td>
              <td className="p-4 text-gray-600">{row.peminjam}</td>
              <td className="p-4 text-gray-600">{row.waktuPinjam}</td>
              <td className="p-4 text-gray-600">{row.waktuKembali}</td>
            </tr>
          ))}

          {[...Array(3)].map((_, i) => (
            <tr key={`empty-history-${i}`} className="border-b border-gray-200">
              <td className="p-4 h-14">&nbsp;</td>
              <td className="p-4">&nbsp;</td>
              <td className="p-4">&nbsp;</td>
              <td className="p-4">&nbsp;</td>
              <td className="p-4">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =========================
// CAPTAIN PEMINJAMAN PAGE
// =========================
export default function CaptainPeminjaman() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <CaptainSidebar />

      <div className="flex-1 flex flex-col">
        <CaptainHeader />

        <div className="p-8 bg-gray-50">

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Status Peminjaman
              </h2>
              <StatusPeminjamanTable />
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Riwayat Peminjaman
              </h2>
              <RiwayatPeminjamanTable />
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
