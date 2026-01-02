import React, { useState } from "react";
import { ArrowLeft, Lock, User } from "lucide-react";
import { router } from "@inertiajs/react";
import axios from "axios";
import Hanggar from "@/Assets/hanggar.png";

export default function StoremanLogin() {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/api/storeman/login", {
                username: username,
                password: password,
            });

            // simpan status login
            localStorage.setItem("storeman_login", "true");
            localStorage.setItem(
                "storeman_username",
                response.data.storeman.username
            );

            router.visit("/StoremanDashboard");
        } catch (error) {
            alert("Username atau password salah");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${Hanggar})` }}
        >
            <div className="w-full max-w-md bg-blue-700/40 backdrop-blur-xl border border-blue-700/40 shadow-2xl rounded-2xl p-8">

                {/* Back Button */}
                <button
                    onClick={() => router.visit("/")}
                    className="flex items-center gap-2 text-white hover:text-blue-300 mb-6 transition"
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

                    <div className="bg-blue-900/90 border border-blue-700/40 rounded-xl p-3 flex items-center gap-3">
                        <User className="text-white" />
                        <input
                            type="text"
                            required
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent text-white placeholder-blue-300 border border-blue-700 outline-none"
                        />
                    </div>

                    <div className="bg-blue-900/90 border border-blue-700/40 rounded-xl p-3 flex items-center gap-3">
                        <Lock className="text-white" />
                        <input
                            type="password"
                            required
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent text-white placeholder-blue-300 border border-blue-700 outline-none"
                        />
                    </div>

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
