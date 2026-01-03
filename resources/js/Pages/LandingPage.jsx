import React, { useState, useEffect } from "react";
import {
    Radio,
    Zap,
    Wrench,
    Users,
    Loader2,
    ShieldCheck,
    Mail,
    Phone,
    MapPin
} from "lucide-react";

import { router } from "@inertiajs/react";

import Kucing from "@/Assets/Kucing.png";
import Hanggar from "@/Assets/Hanggar.png";
import Menu from "@/Assets/Menu.svg";

export default function LandingPage() {
    const [isScanning, setIsScanning] = useState(false);

    const API_WAIT = "/api/wait-scan";
    const API_LAST = "/api/last-login";

    /* =========================
        RFID LOGIC (FINAL)
    ========================== */
    useEffect(() => {
        let intervalId;
    
        const startScan = async () => {
            try {
                // Klaim scan RFID
                await fetch(API_WAIT, {
                    method: "POST",
                    credentials: "include",
                });
    
                intervalId = setInterval(async () => {
                    try {
                        const res = await fetch(API_LAST, {
                            credentials: "include",
                        });
    
                        const data = await res.json();
                        if (!data) return;
    
                        console.log("RFID STATUS:", data);
    
                        // belum ada scan
                        if (data.status === "idle") {
                            setIsScanning(false);
                            return;
                        }
    
                        // scan selesai
                        if (data.status === "scanned") {
                            clearInterval(intervalId);
                            setIsScanning(false);
    
                            if (!data.authorized) {
                                alert("❌ RFID tidak terdaftar");
                                return;
                            }
    
                            localStorage.setItem(
                                "captain",
                                JSON.stringify({
                                    id: data.captain.id,
                                    nama: data.captain.nama,
                                    nim: data.captain.nim,
                                    uid: data.uid,
                                })
                            );
    
                            // 🔁 redirect
                            router.visit("/CaptainDashboard");
                        }
    
                    } catch (err) {
                        console.error("Polling error:", err);
                    }
                }, 800);
    
            } catch (err) {
                console.error("Wait scan error:", err);
            }
        };
    
        startScan();
    
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);
    
    
    


    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat">

            <Navbar />

            {/* SECTION 1 */}
            <div
                className="w-full h-[1000px] bg-cover bg-center bg-no-repeat flex flex-col pt-20"
                style={{ backgroundImage: `url(${Hanggar})` }}
            >
                <main className="px-6 py-10 grid lg:grid-cols-2 gap-12 items-start">

                    {/* LEFT */}
                    <div className="flex flex-col justify-center p-16 rounded-xl backdrop-blur-md">
                        <h2 className="text-6xl font-bold leading-tight text-white">
                            Aplikasi Peminjaman Alat
                            Hanggar Perawatan<br />
                            Pesawat
                        </h2>

                        <p className="text-white mt-4 font-medium">
                            Sistem manajemen peminjaman alat berbasis
                            <b> “Artificial Intelligence” </b> dengan teknologi
                            <b> “RFID” </b> untuk efisiensi dan keamanan maksimal.
                        </p>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-blue-900/80 backdrop-blur-lg p-10 rounded-2xl shadow-lg 
                                    h-screen flex flex-col justify-between">

                        <div className="text-center">
                            <Radio className="w-12 h-12 mx-auto text-white" />
                            <h3 className="text-2xl font-semibold mt-4 text-white">
                                RFID Access Point
                            </h3>
                            <p className="text-blue-200 mt-2">
                                Tap kartu RFID Anda untuk mengakses sistem
                            </p>
                        </div>

                        {/* BUTTON (VISUAL ONLY) */}
                        <button
                            className="w-full bg-blue-500 hover:bg-blue-400 transition p-10 py-16 rounded-xl mt-8 text-xl font-semibold"
                        >
                            {isScanning ? (
                                <Loader2 className="w-14 h-14 mx-auto animate-spin" />
                            ) : (
                                <Radio className="w-14 h-14 mx-auto" />
                            )}
                            <p className="mt-5 font-medium text-white text-2xl">
                                {isScanning ? "Scanning..." : "Tap Your RFID Card"}
                            </p>
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-blue-300 text-sm">
                            <ShieldCheck className="w-4 h-4" />
                            Secured by PILAH
                        </div>
                    </div>

                </main>
            </div>

            {/* SECTION 2 */}
            <div className="py-24 px-6 max-w-7xl mx-auto bg-white/80 mt-10 rounded-2xl backdrop-blur-md">
                <h2 className="text-4xl font-bold text-black text-center">Fitur Unggulan</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
                    <FeatureCard icon={<Zap size={40} />} title="AI-Powered" desc="Sistem cerdas untuk prediksi kebutuhan alat" />
                    <FeatureCard icon={<Radio size={40} />} title="RFID Technology" desc="Akses cepat dan aman dengan kartu RFID" />
                    <FeatureCard icon={<Wrench size={40} />} title="Tool Management" desc="Kelola inventaris alat dengan mudah" />
                    <FeatureCard icon={<Users size={40} />} title="User Tracking" desc="Lacak riwayat peminjaman secara real-time" />
                </div>

                <ul className="mt-14 space-y-3 text-blue-900 text-lg font-medium">
                    <li>• Mengurangi waktu pencarian alat hingga 70%</li>
                    <li>• Meningkatkan akuntabilitas peminjaman alat</li>
                    <li>• Otomasi laporan dan dokumentasi</li>
                    <li>• Integrasi dengan sistem maintenance pesawat</li>
                </ul>
            </div>

            <Footer />
        </div>
    );
}

/* ============================
       NAVBAR
============================ */
function Navbar() {
    const [open, setOpen] = useState(false);
    const [solid, setSolid] = useState(false);

    useEffect(() => {
        const handleScroll = () => setSolid(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 px-4 transition-all ${
                solid ? "bg-white shadow-lg backdrop-blur-lg" : "bg-transparent"
            }`}
        >
            <div className="mx-auto flex justify-between h-16 items-center">

                <div className="flex items-center gap-3">
                    <img src={Kucing} className="h-12 w-12 rounded-full" />
                    <div>
                        <h1 className={`font-bold text-2xl ${solid ? "text-black" : "text-white"}`}>
                            PILAH
                        </h1>
                        <p className={`${solid ? "text-gray-700" : "text-blue-200"} text-sm`}>
                            AI-Powered Tool Management
                        </p>
                    </div>
                </div>

                <button
                    className={`md:hidden ${solid ? "text-black" : "text-white"}`}
                    onClick={() => setOpen(!open)}
                >
                    <img src={Menu} className="w-10" />
                </button>

                <div
                    className={`hidden md:flex text-xl space-x-10 font-bold ${
                        solid ? "text-black" : "text-white"
                    }`}
                >
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        Home
                    </button>

                    <button onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}>
                        About Us
                    </button>

                    <button
                        onClick={() => router.visit("/StoremanLogin")}
                        className={`px-4 py-2 rounded-lg font-bold ${
                            solid ? "bg-blue-700 text-white" : "bg-white text-blue-900"
                        }`}
                    >
                        Storeman Login
                    </button>
                </div>

                {open && (
                    <div className="absolute top-16 right-4 p-4 rounded-lg md:hidden bg-blue-900/80 text-white">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                            Home
                        </button>
                        <button onClick={() => window.scrollTo({ top: 900, behavior: "smooth" })}>
                            About Us
                        </button>
                        <button onClick={() => router.visit("/StoremanLogin")}>
                            Storeman Login
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

/* COMPONENT */
function FeatureCard({ icon, title, desc }) {
    return (
        <div className="bg-blue-900 p-6 rounded-xl border border-blue-200">
            <div className="w-10 h-10 mb-3 text-blue-200">{icon}</div>
            <h4 className="font-semibold text-lg text-white">{title}</h4>
            <p className="text-blue-200 text-sm mt-1">{desc}</p>
        </div>
    );
}

/* FOOTER */
function Footer() {
    return (
        <footer className="bg-blue-950 text-white mt-20 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <h2 className="font-bold text-xl">PILAH System</h2>
                    <p className="text-blue-300 mt-2 text-sm">
                        Sistem peminjaman alat berbasis AI & RFID.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg">Kontak</h3>
                    <div className="mt-3 space-y-2 text-blue-300">
                        <p className="flex items-center gap-2"><Mail size={18}/> pilah.system@gmail.com</p>
                        <p className="flex items-center gap-2"><Phone size={18}/> +62 812-3456-7890</p>
                        <p className="flex items-center gap-2"><MapPin size={18}/> Hanggar Perawatan Pesawat</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg">Dikembangkan Oleh</h3>
                    <p className="text-blue-300 mt-2">TEAM PILAH</p>
                </div>
            </div>

            <div className="text-center text-blue-400 text-sm mt-10 pt-6 border-t border-blue-800">
                © {new Date().getFullYear()} PILAH System — All Rights Reserved
            </div>
        </footer>
    );
}
