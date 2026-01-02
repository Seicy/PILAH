import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Home, Users, Clock } from "lucide-react";

// IMPORT FOTO PROFILE / LOGO
import Pilah from "@/Assets/Pilah.png"; // bisa diganti foto storeman

export default function StoremanSidebar() {
  const { url } = usePage();

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/StoremanDashboard" },
    { name: "Kelola Pengguna", icon: <Users size={18} />, path: "/KelolaPengguna" },
    { name: "Riwayat Peminjaman", icon: <Clock size={18} />, path: "/Riwayat" },
  ];

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white flex flex-col shadow-lg">

      {/* PROFILE STOREMAN */}
      <div className="p-6 flex flex-col items-center border-b border-blue-700">
        <img
          src={Pilah}
          alt="Storeman Profile"
          className="w-24 h-24 rounded-full"
        />
      </div>

      {/* MENU */}
      <ul className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const isActive = url.startsWith(item.path);

          return (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`
                  flex items-center gap-3 p-3 rounded-md transition
                  ${isActive ? "bg-blue-700" : "hover:bg-blue-800"}
                `}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
