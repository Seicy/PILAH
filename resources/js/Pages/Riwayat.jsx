import React, { useState, useEffect } from "react";
import StoremanSidebar from "@/Components/StoremanSidebar";  
import StoremanHeader from "@/Components/StoremanHeader";
import axios from "axios";

export default function Riwayat() {
    const [riwayat, setRiwayat] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAllHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/riwayat-peminjaman');
            setRiwayat(response.data);
        } catch (err) {
            console.error("Gagal mengambil data riwayat:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllHistory();
    }, []);

    const filteredData = riwayat.filter((item) =>
        item.nama_kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nama_alat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <StoremanSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <StoremanHeader />

                <div className="p-8 flex-1 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Riwayat Peminjaman
                        </h2>
                        
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari kelas atau alat..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                🔍
                            </span>
                        </div>
                    </div>

                    {/* Container Tabel dengan Scrollbar */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col flex-1 overflow-hidden">
                        <div className="overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-blue-600 text-white z-10">
                                    <tr>
                                        <th className="p-4 font-semibold uppercase text-sm tracking-wider">Nama Kelas</th>
                                        <th className="p-4 font-semibold uppercase text-sm tracking-wider">Alat</th>
                                        <th className="p-4 font-semibold uppercase text-sm tracking-wider text-center">Waktu Pinjam</th>
                                        <th className="p-4 font-semibold uppercase text-sm tracking-wider text-center">Waktu Kembali</th>
                                        <th className="p-4 font-semibold uppercase text-sm tracking-wider text-center">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-gray-500">
                                                <div className="flex justify-center items-center gap-2">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                                    Memuat data...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredData.length > 0 ? (
                                        filteredData.map((row, i) => (
                                            <tr key={i} className="hover:bg-blue-50 transition-colors">
                                                <td className="p-4 text-gray-800 font-medium">{row.nama_kelas}</td>
                                                <td className="p-4 text-gray-600">
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono border border-gray-200">
                                                        {row.nama_alat}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center text-gray-500 text-sm">
                                                    {new Date(row.waktu_pinjam).toLocaleString('id-ID')}
                                                </td>
                                                <td className="p-4 text-center text-gray-500 text-sm">
                                                    {row.waktu_kembali 
                                                        ? new Date(row.waktu_kembali).toLocaleString('id-ID') 
                                                        : <span className="text-gray-300 italic">Belum kembali</span>}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                                        row.status === 'Kembali' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-10 text-center text-gray-400 italic">
                                                Data riwayat tidak ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tambahkan CSS di bawah ini dalam file CSS atau style tag */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}