import React, { useState, useRef, useEffect } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { router } from "@inertiajs/react";

export default function CaptainHeader() {
  const [open, setOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State untuk menyimpan data dinamis
  const [userProfile, setUserProfile] = useState({
    nama: "",
    kelas: "",
    semester: "",
    nim: ""
  });

  const dropdownRef = useRef(null);

  // Ambil data dari localStorage saat komponen dimuat
  useEffect(() => {
    const data = localStorage.getItem("captain"); // Sesuaikan key dengan LandingPage
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setUserProfile({
          nama: parsed.nama || "User",
          kelas: parsed.kelas || parsed.nama_kelas || "Pagi A",
          semester: parsed.semester || "3",
          nim: parsed.nim || "-"
        });
      } catch (e) {
        console.error("Gagal ambil data profil", e);
      }
    }
  }, []);

  // Tutup dropdown saat klik luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("captain"); // Bersihkan session
    router.visit("/"); 
  };

  return (
    <>
      {/* HEADER */}
      <div className="bg-white shadow-md flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-semibold text-gray-700">Captain Course</h1>

        {/* USER ICON */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <UserCircle size={30} className="text-gray-700" />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border z-50">
              <ul className="py-2 text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    setShowProfileModal(true);
                  }}
                >
                  Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* MODAL PROFILE */}
      {showProfileModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl w-80 relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Captain Course Profile
            </h2>

            <div className="flex flex-col gap-2 text-gray-700">
              <p><strong>Nama Kelas:</strong> {userProfile.kelas}</p>
              <p><strong>Semester:</strong> {userProfile.semester}</p>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGOUT */}
      {showLogoutModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Anda yakin ingin log out?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}