import React, { useEffect, useState } from "react";
import StoremanSidebar from "../Components/StoremanSidebar";
import StoremanHeader from "../Components/StoremanHeader";
import { Pencil, Trash2, Plus } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/api/storeman/captain-course";

export default function KelolaPengguna() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    namaKelas: "",
    semester: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();

    // mapping backend → frontend
    const mapped = data.map((item) => ({
      id: item.id,
      namaKelas: item.kelas,
      semester: item.semester,
    }));

    setUsers(mapped);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= TAMBAH ================= */
  const handleAdd = async () => {
    if (!formData.namaKelas.trim()) {
      setError("Nama kelas wajib diisi.");
      return;
    }
    if (!formData.semester) {
      setError("Semester wajib diisi.");
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kelas: formData.namaKelas,
        semester: formData.semester,
      }),
    });

    fetchData();
    setModal(null);
    setFormData({ namaKelas: "", semester: "" });
    setError("");
  };

  /* ================= EDIT ================= */
  const handleEdit = async () => {
    if (!formData.namaKelas.trim()) {
      setError("Nama kelas wajib diisi.");
      return;
    }
    if (!formData.semester) {
      setError("Semester wajib diisi.");
      return;
    }

    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kelas: formData.namaKelas,
        semester: formData.semester,
      }),
    });

    fetchData();
    setModal(null);
    setEditId(null);
    setError("");
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  /* ================= VALIDASI SEMESTER ================= */
  const handleSemesterChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;
    setFormData({ ...formData, semester: value });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StoremanSidebar />

      <div className="flex-1 flex flex-col">
        <StoremanHeader />

        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Kelola Captain Course
          </h1>

          <button
            onClick={() => {
              setFormData({ namaKelas: "", semester: "" });
              setError("");
              setModal("tambah");
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center gap-1 mb-3"
          >
            <Plus size={18} /> Tambah
          </button>

          {/* TABLE */}
          <table className="w-full border border-blue-200 bg-white shadow">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border">Nama Kelas</th>
                <th className="p-2 border">Semester</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    Data belum tersedia
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="text-center border">
                    <td className="p-2 border">{u.namaKelas}</td>
                    <td className="p-2 border">{u.semester}</td>
                    <td className="p-2 border flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditId(u.id);
                          setFormData(u);
                          setError("");
                          setModal("edit");
                        }}
                        className="text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white rounded-md shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-3">
                {modal === "tambah"
                  ? "Tambah Captain Course"
                  : "Edit Captain Course"}
              </h2>

              {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold">
                    Nama Kelas *
                  </label>
                  <input
                    type="text"
                    value={formData.namaKelas}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        namaKelas: e.target.value,
                      })
                    }
                    className="w-full border rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold">
                    Semester *
                  </label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={handleSemesterChange}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-md bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={modal === "tambah" ? handleAdd : handleEdit}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white"
                >
                  {modal === "tambah" ? "Tambah" : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
