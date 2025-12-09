import React, { useState } from "react";
import { ArrowLeft, Lock, User } from "lucide-react";
import { router, Link } from "@inertiajs/react";

export default function StoremanLogin() {
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            alert("Storeman Berhasil Login!");
            router.visit("/StoremanDashboard"); // ⬅ NAVIGASI INERTIA
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center px-6">
            
            {/* CARD */}
            <div className="w-full max-w-md bg-blue-900/40 backdrop-blur-xl border border-blue-500/40 shadow-2xl rounded-2xl p-8">

                {/* Back Button */}
                <button
                    onClick={() => router.visit("/")}
                    className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition"
                >
                    <ArrowLeft size={20} />
                    Landing Page
                </button>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Storeman Login
                </h2>

                <p className="text-center text-blue-200 mb-8">
                    Masuk untuk mengelola peminjaman alat hanggar.
                </p>

                {/* FORM */}
                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Username */}
                    <div className="bg-blue-900/40 border border-blue-700/40 rounded-xl p-3 flex items-center gap-3">
                        <User className="text-blue-300" />
                        <input
                            type="text"
                            required
                            placeholder="Username"
                            className="w-full bg-blue-900/10 text-white placeholder-blue-300 outline-none border-none"
                            style={{ backgroundColor: "rgba(30, 58, 138, 0.1)" }}
                        />
                    </div>

                    {/* Password */}
                    <div className="bg-blue-900/40 border border-blue-700/40 rounded-xl p-3 flex items-center gap-3">
                        <Lock className="text-blue-300" />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            className="w-full bg-blue-900/10 text-white placeholder-blue-300 outline-none border-none"
                            style={{ backgroundColor: "rgba(30, 58, 138, 0.1)" }}
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 
                                   hover:from-blue-500 hover:to-blue-600 transition text-white font-semibold 
                                   shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>

            </div>
        </div>
    );
}
