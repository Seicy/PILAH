import React from "react";
import { Home, Users } from "lucide-react";
import { router, usePage } from "@inertiajs/react";

// IMPORT LOGO
import Pilah from "@/Assets/Pilah.png";

export default function CaptainSidebar() {
  const { url } = usePage(); // untuk cek route aktif

  const isActive = (path) => url.startsWith(path);

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col min-h-screen shadow-lg">
      
      {/* LOGO FULL */}
      <div className="p-5 flex justify-center border-b border-blue-700">
        <img
          src={Pilah}
          alt="Pilah"
          className="w-32 h-auto" // sesuaikan ukuran logo
        />
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
