import React, { useEffect, useState } from "react";
import axios from "axios";
import StoremanSidebar from "../Components/StoremanSidebar";
import StoremanHeader from "../Components/StoremanHeader";
import { Pencil, Trash2, Plus } from "lucide-react";
import { router } from "@inertiajs/react"; // <-- import router untuk redirect

const API_URL = "http://127.0.0.1:8000/api/storeman/captain-course";
const RFID_API_URL = "http://127.0.0.1:8000/api/storeman/rfid-cards";

export default function KelolaPengguna() {
  /* =====================
     AUTH GUARD
  ====================== */
  useEffect(() => {
    if (!localStorage.getItem("storeman_login")) {
      router.visit("/"); // redirect ke login
    }
  }, []);

  /* =====================================================
     STATE KELOLA CAPTAIN COURSE (ASLI)
  ===================================================== */
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    namaKelas: "",
    semester: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  /* =====================================================
     STATE KELOLA RFID CARD (TAMBAHAN)
  ===================================================== */
  const [rfids, setRfids] = useState([]);
  const [modalRfid, setModalRfid] = useState(false);
  const [rfidForm, setRfidForm] = useState({
    uid: "",
    captain_course_id: "",
    active: true,
  });
  const [rfidError, setRfidError] = useState("");

  /* =====================================================
     FETCH DATA
  ===================================================== */
  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      const mapped = res.data.map((item) => ({
        id: item.id,
        namaKelas: item.kelas,
        semester: item.semester,
      }));
      setUsers(mapped);
    } catch (err) {
      console.error("Gagal mengambil data course");
    }
  };

  const fetchRfids = async () => {
    try {
      const res = await axios.get(RFID_API_URL);
      setRfids(res.data);
    } catch (err) {
      console.error("Gagal mengambil data RFID");
    }
  };

  useEffect(() => {
    fetchData();
    fetchRfids();
  }, []);

  /* =====================================================
     LOGIKA KELOLA CAPTAIN COURSE
  ===================================================== */
  const handleSaveCourse = async () => {
    if (!formData.namaKelas.trim() || !formData.semester) {
      setError("Semua field wajib diisi.");
      return;
    }

    try {
      if (modal === "tambah") {
        await axios.post(API_URL, {
          kelas: formData.namaKelas,
          semester: formData.semester,
        });
      } else {
        await axios.put(`${API_URL}/${editId}`, {
          kelas: formData.namaKelas,
          semester: formData.semester,
        });
      }
      fetchData();
      setModal(null);
      setFormData({ namaKelas: "", semester: "" });
      setError("");
    } catch (err) {
      setError("Gagal menyimpan data.");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    } catch (err) {
      alert("Gagal menghapus.");
    }
  };

  /* =====================================================
     LOGIKA KELOLA RFID CARD
  ===================================================== */
  const handleAddRfid = async () => {
    if (!rfidForm.uid.trim() || !rfidForm.captain_course_id) {
      setRfidError("UID dan Captain Course wajib diisi.");
      return;
    }

    // Validasi 1 Captain = 1 RFID
    const used = rfids.find((r) => r.captain_course_id == rfidForm.captain_course_id);
    if (used) {
      setRfidError("Captain Course ini sudah memiliki kartu RFID.");
      return;
    }

    try {
      await axios.post(RFID_API_URL, rfidForm);
      fetchRfids();
      setModalRfid(false);
      setRfidForm({ uid: "", captain_course_id: "", active: true });
      setRfidError("");
    } catch (err) {
      setRfidError("Gagal mendaftarkan kartu.");
    }
  };

  const handleDeleteRfid = async (id) => {
    if (!confirm("Hapus kartu RFID ini?")) return;
    try {
      await axios.delete(`${RFID_API_URL}/${id}`);
      fetchRfids();
    } catch (err) {
      alert("Gagal menghapus RFID.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StoremanSidebar />

      <div className="flex-1 flex flex-col">
        <StoremanHeader />

        <div className="p-6">
          {/* BAGIAN 1: KELOLA CAPTAIN COURSE */}
          <h1 className="text-2xl font-semibold mb-4">Kelola Captain Course</h1>
          <button
            onClick={() => {
              setModal("tambah");
              setFormData({ namaKelas: "", semester: "" });
              setError("");
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1 mb-3"
          >
            <Plus size={18} /> Tambah
          </button>

          <table className="w-full bg-white border">
            <thead className="bg-blue-100">
              <tr>
                <th className="border p-2">Nama Kelas</th>
                <th className="border p-2">Semester</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="text-center">
                  <td className="border p-2">{u.namaKelas}</td>
                  <td className="border p-2">{u.semester}</td>
                  <td className="border p-2 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditId(u.id);
                        setFormData({ namaKelas: u.namaKelas, semester: u.semester });
                        setModal("edit");
                      }}
                      className="text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDeleteCourse(u.id)} className="text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* BAGIAN 2: KELOLA RFID CARD */}
          <div className="mt-10">
            <div className="mb-3">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Kelola Kartu RFID</h2>
              <button
                onClick={() => {
                  setModalRfid(true);
                  setRfidError("");
                }}
                className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1"
              >
                <Plus size={18} /> Tambah Kartu RFID
              </button>
            </div>

            <table className="w-full bg-white border">
              <thead className="bg-green-100">
                <tr>
                  <th className="border p-2">UID</th>
                  <th className="border p-2">Captain Course</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rfids.length === 0 ? (
                  <tr><td colSpan="4" className="text-center p-4 text-gray-500">Data RFID belum tersedia</td></tr>
                ) : (
                  rfids.map((r) => (
                    <tr key={r.id} className="text-center">
                      <td className="border p-2 font-mono">{r.uid}</td>
                      <td className="border p-2">
                        {r.captain ? `${r.captain.kelas} - Semester ${r.captain.semester}` : ""}
                      </td>
                      <td className="border p-2">{r.active ? "Aktif" : "Nonaktif"}</td>
                      <td className="border p-2">
                        <button onClick={() => handleDeleteRfid(r.id)} className="text-red-600">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MODAL UNTUK CAPTAIN COURSE */}
          {modal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-3">{modal === "tambah" ? "Tambah" : "Edit"} Course</h2>
                {error && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded text-xs">{error}</div>}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nama Kelas"
                    className="border p-2 w-full rounded"
                    value={formData.namaKelas}
                    onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Semester"
                    className="border p-2 w-full rounded"
                    value={formData.semester}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 1) setFormData({ ...formData, semester: val });
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setModal(null)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                  <button onClick={handleSaveCourse} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL UNTUK RFID CARD */}
          {modalRfid && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-3">Tambah RFID</h2>
                {rfidError && <div className="bg-red-100 text-red-700 p-2 mb-2 rounded text-xs">{rfidError}</div>}
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-bold block mb-1">UID RFID</label>
                    <input
                      type="text"
                      placeholder="Masukkan UID (Contoh: A1B2C3D4)"
                      className="border p-2 w-full rounded"
                      value={rfidForm.uid}
                      onChange={(e) => setRfidForm({ ...rfidForm, uid: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1">Pilih Captain Course</label>
                    <select
                      className="border p-2 w-full rounded bg-white"
                      value={rfidForm.captain_course_id}
                      onChange={(e) => setRfidForm({ ...rfidForm, captain_course_id: e.target.value })}
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.namaKelas} - Semester {u.semester}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setModalRfid(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                  <button onClick={handleAddRfid} className="px-4 py-2 bg-green-600 text-white rounded">Simpan</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
