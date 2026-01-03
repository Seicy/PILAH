import React, { useState, useEffect } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import StoremanSidebar from "@/Components/StoremanSidebar";
import StoremanHeader from "@/Components/StoremanHeader";

export default function StoremanDashboard() {

    /* =====================
       AUTH GUARD
    ====================== */
    useEffect(() => {
        if (!localStorage.getItem("storeman_login")) {
            router.visit("/");
        }
    }, []);

    /* =====================
       RFID STATE
    ====================== */
    const [rfidStatus, setRfidStatus] = useState("waiting");
    const [rfidResult, setRfidResult] = useState(null);

    /* =====================
       INVENTARIS
    ====================== */
    const [riwayat, setRiwayat] = useState([]);

    /* =====================
       START RFID SCAN
    ====================== */
    useEffect(() => {

        const interval = setInterval(async () => {
            try {
                const res = await axios.get("/api/last-login");

                if (res.data.status === "scanned") {
                    setRfidStatus("scanned");
                    setRfidResult(res.data);
                    clearInterval(interval);
                }
            } catch (err) {
                console.error("RFID polling error", err);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    /* =====================
       LOAD INVENTARIS
    ====================== */
    useEffect(() => {
        axios.get("/api/riwayat-peminjaman")
            .then(res => setRiwayat(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">

            <StoremanSidebar activePage="dashboard" />

            <div className="flex-1">
                <StoremanHeader />

                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                    {/* =====================
                        VERIFIKASI RFID
                    ====================== */}
                    <div className="bg-blue-100 p-4 rounded-md mb-6 shadow">
                        <h2 className="font-bold text-lg mb-2">
                            VERIFIKASI RFID
                        </h2>

                        {rfidStatus === "waiting" && (
                            <p className="italic text-gray-600">
                                Menunggu scan RFID...
                            </p>
                        )}

                        {rfidStatus === "scanned" && rfidResult?.authorized && (
                            <>
                                <p><b>Kelas:</b> {rfidResult.captain.kelas}</p>
                                <p><b>Semester:</b> {rfidResult.captain.semester}</p>
                                <p><b>UID:</b> {rfidResult.uid}</p>
                            </>
                        )}

                        {rfidStatus === "scanned" && !rfidResult?.authorized && (
                            <p className="text-red-600 font-bold">
                                RFID tidak terdaftar
                            </p>
                        )}
                    </div>

                    {/* =====================
                        INVENTARIS – SEDANG DIPINJAM
                    ====================== */}
                    <h2 className="text-xl font-semibold mb-3">
                        Inventaris Alat & Peminjaman
                    </h2>

                    <table className="w-full border border-blue-200 shadow bg-white">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="p-2 border">Kode</th>
                                <th className="p-2 border">Nama Alat</th>
                                <th className="p-2 border">Kelas</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {riwayat.filter(r => r.status === "Dipinjam").length > 0 ? (
                                riwayat
                                    .filter(r => r.status === "Dipinjam")
                                    .map(row => (
                                        <tr key={row.id} className="text-center">
                                            <td className="p-2 border font-mono">
                                                {row.kode_pinjam}
                                            </td>
                                            <td className="p-2 border font-bold">
                                                {row.nama_alat}
                                            </td>
                                            <td className="p-2 border">
                                                {row.nama_kelas}
                                            </td>
                                            <td className="p-2 border text-red-600 font-semibold">
                                                Dipinjam
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-gray-400 italic">
                                        Tidak ada alat yang sedang dipinjam
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}
