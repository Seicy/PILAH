import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Home, Users, Clock } from "lucide-react";

export default function StoremanSidebar() {
  const { url } = usePage();

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/StoremanDashboard" },
    { name: "Kelola Pengguna", icon: <Users size={18} />, path: "/KelolaPengguna" },
    { name: "Riwayat Peminjaman", icon: <Clock size={18} />, path: "/Riwayat" },
  ];

  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col shadow-lg">
      <div className="p-5 border-b border-blue-700">
        <h2 className="text-lg font-bold">PILAH</h2>
      </div>

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
