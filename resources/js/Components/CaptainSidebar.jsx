import React from "react";
import { Home, Users } from "lucide-react";
import { router, usePage } from "@inertiajs/react";

export default function CaptainSidebar() {
  const { url } = usePage(); // untuk cek route aktif

  const isActive = (path) => url.startsWith(path);

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col min-h-screen shadow-lg">
      
      {/* LOGO */}
      <div className="p-5 flex items-center border-b border-blue-700">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_placeholder.svg"
          alt="Logo"
          className="w-10 h-10 mr-3"
        />
        <h2 className="text-lg font-bold tracking-wide">PILAH</h2>
      </div>

      {/* MENU */}
      <ul className="flex-1 p-3 space-y-2">

        {/* Dashboard */}
        <li
          onClick={() => router.visit("/CaptainDashboard")}
          className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition 
            hover:bg-blue-800
            ${isActive("/CaptainDashboard") ? "bg-blue-800" : ""}`}
        >
          <Home size={18} /> Dashboard
        </li>

        {/* Peminjaman */}
        <li
          onClick={() => router.visit("/CaptainPeminjaman")}
          className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition 
            hover:bg-blue-800
            ${isActive("/CaptainPeminjaman") ? "bg-blue-800" : ""}`}
        >
          <Users size={18} /> Peminjaman
        </li>

      </ul>
    </div>
  );
}
