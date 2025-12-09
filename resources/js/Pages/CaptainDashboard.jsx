// resources/js/Pages/CaptainDashboard.jsx

import React, { useState } from "react";
import { Wrench } from "lucide-react";

// IMPORT SIDEBAR & HEADER (sesuai folder Component)
import SidebarCaptain from "@/Components/CaptainSidebar";
import HeaderCaptain from "@/Components/CaptainHeader";

export default function CaptainDashboard() {
  const [tools] = useState([
    { id: 1, nama: "Kunci Pas" },
    { id: 2, nama: "Tang" },
    { id: 3, nama: "Obeng Plus" },
    { id: 4, nama: "Palu" },
    { id: 5, nama: "Kunci L" },
    { id: 6, nama: "Gergaji" },
    { id: 7, nama: "Bor" },
    { id: 8, nama: "Tang Jepit" },
  ]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <SidebarCaptain />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <HeaderCaptain />

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Captain Dashboard
          </h1>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-md p-2 w-full md:w-1/2 mb-6 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* GRID LIST TOOL */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex flex-col items-center bg-blue-100 hover:bg-blue-200 
                           p-4 rounded-lg shadow-sm transition"
              >
                <Wrench size={32} className="text-blue-800 mb-2" />
                <p className="text-sm md:text-base font-medium text-gray-700">
                  {tool.nama}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
