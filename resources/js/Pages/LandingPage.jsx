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

    import Kucing from "@/Assets/Pilah.png";
    import Hanggar from "@/Assets/Hanggar.png";
    import Menu from "@/Assets/Menu.svg";

    export default function LandingPage() {
        const [isScanning, setIsScanning] = useState(false);

        const API_WAIT = "/api/wait-scan";
        const API_LAST = "/api/last-login";

        /* ==========================================
            RFID LOGIC (OPTIMIZED FOR CLASS & SEMESTER)
        ========================================== */
        useEffect(() => {
            let intervalId;

            const startScan = async () => {
                try {
                    // Inisialisasi proses scan di server
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

                            if (data.status === "idle") {
                                setIsScanning(false);
                                return;
                            }

                            if (data.status === "scanned") {
                                clearInterval(intervalId);
                                setIsScanning(false);

                                if (!data.authorized) {
                                    alert("❌ RFID tidak terdaftar");
                                    return;
                                }

                                // SIMPAN DATA KE LOCALSTORAGE (SESUAI TABEL DATABASE)
                                localStorage.setItem(
                                    "captain",
                                    JSON.stringify({
                                        id: data.captain.id,
                                        nama: data.captain.nama,
                                        nim: data.captain.nim,
                                        kelas: data.captain.kelas,     // Dari kolom 'kelas'
                                        semester: data.captain.semester, // Dari kolom 'semester'
                                        uid: data.uid,
                                    })
                                );

                                // Redirect ke Dashboard setelah data tersimpan
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

                {/* SECTION 1: HERO & RFID ACCESS */}
                <div
                    className="w-full h-[1000px] bg-cover bg-center bg-no-repeat flex flex-col pt-20"
                    style={{ backgroundImage: `url(${Hanggar})` }}
                >
                    <main className="px-6 py-10 grid lg:grid-cols-2 gap-12 items-start">

                        {/* LEFT SIDE: TEXT INFO */}
                        <div className="flex flex-col justify-center p-16 rounded-xl backdrop-blur-md bg-black/10">
                            <h2 className="text-6xl font-bold leading-tight text-white">
                                Aplikasi Peminjaman Alat
                                Hanggar Perawatan<br />
                                Pesawat
                            </h2>

                            <p className="text-white mt-6 font-medium text-lg">
                                Sistem manajemen peminjaman alat berbasis
                                <b className="text-blue-300"> “Artificial Intelligence” </b> dengan teknologi
                                <b className="text-blue-300"> “RFID” </b> untuk efisiensi dan keamanan maksimal.
                            </p>
                        </div>

                        {/* RIGHT SIDE: RFID SCANNER UI */}
                        <div className="bg-blue-900/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl 
                                        h-[600px] flex flex-col justify-between border border-blue-400/30">

                            <div className="text-center">
                                <div className="bg-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-blue-400">
                                    <Radio className="w-10 h-10 text-white animate-pulse" />
                                </div>
                                <h3 className="text-3xl font-bold mt-6 text-white tracking-wide">
                                    RFID Access Point
                                </h3>
                                <p className="text-blue-200 mt-2">
                                    Tempelkan kartu RFID Anda pada reader untuk masuk
                                </p>
                            </div>

                            {/* RFID BUTTON VISUAL */}
                            <div
                                className={`w-full transition-all duration-500 p-10 py-16 rounded-2xl flex flex-col items-center justify-center gap-4 ${
                                    isScanning ? "bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.4)]" : "bg-blue-500/40 border-2 border-dashed border-blue-400"
                                }`}
                            >
                                {isScanning ? (
                                    <Loader2 className="w-20 h-20 text-white animate-spin" />
                                ) : (
                                    <Radio className="w-20 h-20 text-white opacity-80" />
                                )}
                                <p className="font-black text-white text-2xl uppercase tracking-[0.2em]">
                                    {isScanning ? "Scanning Card..." : "Ready to Scan"}
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-blue-300 font-semibold tracking-wider">
                                <ShieldCheck className="w-5 h-5" />
                                SECURED BY PILAH SYSTEM
                            </div>
                        </div>

                    </main>
                </div>

                {/* SECTION 2: FEATURES */}
                <div className="py-24 px-6 max-w-7xl mx-auto bg-white shadow-2xl -mt-20 rounded-[3rem] relative z-10 border border-gray-100">
                    <h2 className="text-4xl font-black text-slate-900 text-center uppercase tracking-widest">Fitur Unggulan</h2>
                    <div className="w-24 h-2 bg-blue-600 mx-auto mt-4 rounded-full"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                        <FeatureCard icon={<Zap size={40} />} title="AI-Powered" desc="Verifikasi alat otomatis menggunakan Computer Vision." />
                        <FeatureCard icon={<Radio size={40} />} title="RFID Tech" desc="Login cepat tanpa password, cukup tap kartu." />
                        <FeatureCard icon={<Wrench size={40} />} title="Inventory" desc="Manajemen Toolbox hanggar secara real-time." />
                        <FeatureCard icon={<Users size={40} />} title="Tracking" desc="Riwayat peminjaman per kelas & semester tercatat." />
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    /* ============================
            NAVBAR COMPONENT
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
            <nav className={`fixed top-0 left-0 w-full z-50 px-6 transition-all duration-300 ${solid ? "bg-white/90 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={Kucing} className="h-14 w-14 rounded-2xl shadow-lg border-2 border-white" />
                        <div>
                            <h1 className={`font-black text-2xl tracking-tighter ${solid ? "text-blue-900" : "text-white"}`}>PILAH</h1>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${solid ? "text-blue-600" : "text-blue-200"}`}>Hanggar Maintenance</p>
                        </div>
                    </div>

                    <div className={`hidden md:flex items-center space-x-8 font-black uppercase text-sm ${solid ? "text-slate-700" : "text-white"}`}>
                        <button className="hover:text-blue-500 transition">Home</button>
                        <button className="hover:text-blue-500 transition">About</button>
                        <button 
                            onClick={() => router.visit("/StoremanLogin")}
                            className={`px-6 py-3 rounded-xl transition-all active:scale-95 ${solid ? "bg-blue-600 text-white shadow-blue-200" : "bg-white text-blue-900 shadow-xl"}`}
                        >
                            Storeman Login
                        </button>
                    </div>
                </div>
            </nav>
        );
    }

    function FeatureCard({ icon, title, desc }) {
        return (
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-blue-300 transition-all hover:shadow-xl group">
                <div className="w-14 h-14 mb-6 text-blue-600 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">{icon}</div>
                <h4 className="font-black text-xl text-slate-900 mb-2">{title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
        );
    }

    function Footer() {
        return (
            <footer className="bg-slate-950 text-white py-16 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="font-black text-3xl tracking-tighter">PILAH SYSTEM</h2>
                    <div className="flex justify-center gap-6 mt-8 text-slate-400">
                        <Mail size={20}/> <Phone size={20}/> <MapPin size={20}/>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-900 text-slate-600 text-xs font-bold tracking-widest uppercase">
                        © {new Date().getFullYear()} PILAH — Avionic Maintenance System
                    </div>
                </div>
            </footer>
        );
    }