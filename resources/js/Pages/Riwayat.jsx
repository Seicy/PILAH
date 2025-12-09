import React from "react";
import StoremanSidebar from "@/Components/StoremanSidebar";  
import StoremanHeader from "@/Components/StoremanHeader";

export default function Riwayat() {
    const data = [
        {
            namaKelas: "Pagi A",
            semester: "3",
            alat: "Toolbox",
            waktuPinjam: "23/09/2025 08.00",
            waktuKembali: "23/09/2025 10.00",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <StoremanSidebar />

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <StoremanHeader />

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">
                        Riwayat Peminjaman
                    </h2>

                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="p-4 font-bold text-gray-700">Nama Kelas</th>
                                    <th className="p-4 font-bold text-gray-700">Semester</th>
                                    <th className="p-4 font-bold text-gray-700">Alat</th>
                                    <th className="p-4 font-bold text-gray-700">Waktu Pinjam</th>
                                    <th className="p-4 font-bold text-gray-700">Waktu Kembali</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-200">
                                        <td className="p-4 text-gray-600">{row.namaKelas}</td>
                                        <td className="p-4 text-gray-600">{row.semester}</td>
                                        <td className="p-4 text-gray-600">{row.alat}</td>
                                        <td className="p-4 text-gray-600">{row.waktuPinjam}</td>
                                        <td className="p-4 text-gray-600">{row.waktuKembali}</td>
                                    </tr>
                                ))}

                                {/* Empty filler rows */}
                                {[...Array(3)].map((_, i) => (
                                    <tr key={`empty-${i}`} className="border-b border-gray-200">
                                        <td className="p-4">&nbsp;</td>
                                        <td className="p-4">&nbsp;</td>
                                        <td className="p-4">&nbsp;</td>
                                        <td className="p-4">&nbsp;</td>
                                        <td className="p-4">&nbsp;</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
