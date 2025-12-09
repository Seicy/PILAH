import React, { useState } from "react";
import StoremanSidebar from "@/Components/StoremanSidebar";
import StoremanHeader from "@/Components/StoremanHeader";

export default function StoremanDashboard() {
    const [search, setSearch] = useState("");
    const [activePage, setActivePage] = useState("dashboard");

    const [alat] = useState([
        { nama: "ToolboxA", kode: 3318, status: "Tersedia" },
        { nama: "ToolboxB", kode: 3123, status: "Dipinjam" },
        { nama: "ToolboxC", kode: 5231, status: "Tersedia" },
        { nama: "ToolboxD", kode: 2528, status: "Tersedia" },
    ]);

    const filteredAlat = alat.filter((a) =>
        a.nama.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* ===== SIDEBAR ===== */}
            <StoremanSidebar activePage={activePage} setActivePage={setActivePage} />

            {/* ===== MAIN CONTENT ===== */}
            <div className="flex-1">
                
                {/* Header */}
                <StoremanHeader />

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-6">Storeman Dashboard</h1>

                    {/* Verifikasi RFID */}
                    <div className="bg-blue-100 p-4 rounded-md mb-6 shadow">
                        <h2 className="font-bold text-lg">KELAS TERVERIFIKASI</h2>
                        <p>Kelas: Pagi A</p>
                        <p>Semester: 3</p>
                        <p>RFID Tag ID: A4:C3:F1:B9</p>
                    </div>

                    {/* Inventaris Section */}
                    <h2 className="text-xl font-semibold mb-3">
                        Inventaris Alat & Peminjaman
                    </h2>

                    {/* Search & Filter */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Cari nama/kode alat..."
                            className="border rounded-md p-2 flex-1"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select className="border rounded-md p-2">
                            <option>Status</option>
                            <option>Tersedia</option>
                            <option>Dipinjam</option>
                        </select>
                    </div>

                    {/* Table */}
                    <table className="w-full border border-blue-200 shadow">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="p-2 border">Nama Alat</th>
                                <th className="p-2 border">Kode Alat</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAlat.map((item, i) => (
                                <tr key={i} className="text-center border">
                                    <td className="p-2 border">{item.nama}</td>
                                    <td className="p-2 border">{item.kode}</td>
                                    <td
                                        className={`p-2 border font-semibold ${
                                            item.status === "Tersedia"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {item.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

        </div>
    );
}
