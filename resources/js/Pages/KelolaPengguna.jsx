import React, { useState } from "react";
import StoremanSidebar from "../Components/StoremanSidebar";
import StoremanHeader from "../Components/StoremanHeader";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function KelolaPengguna() {
  const [users, setUsers] = useState([
    { namaKelas: "Pagi A", semester: 3, email: "pagiA@pilah.com" },
    { namaKelas: "Pagi B", semester: 3, email: "pagiB@pilah.com" },
    { namaKelas: "Pagi C", semester: 5, email: "pagiC@pilah.com" },
    { namaKelas: "Pagi D", semester: 3, email: "pagiD@pilah.com" },
  ]);

  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    namaKelas: "",
    semester: "",
    email: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    setUsers([...users, formData]);
    setFormData({ namaKelas: "", semester: "", email: "" });
    setModal(null);
  };

  const handleEdit = (index) => {
    const data = [...users];
    data[index] = formData;
    setUsers(data);
    setModal(null);
  };

  const handleDelete = (index) => {
    const data = [...users];
    data.splice(index, 1);
    setUsers(data);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <StoremanSidebar />

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        
        <StoremanHeader />

        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Kelola Pengguna</h1>

          <button
            onClick={() => {
              setFormData({ namaKelas: "", semester: "", email: "" });
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
              {users.map((u, i) => (
                <tr key={i} className="text-center border">
                  <td className="p-2 border">{u.namaKelas}</td>
                  <td className="p-2 border">{u.semester}</td>
                  <td className="p-2 border flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setEditIndex(i);
                        setFormData(u);
                        setModal("edit");
                      }}
                      className="text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-white rounded-md shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-3">
                {modal === "tambah" ? "Tambah Pengguna" : "Edit Pengguna"}
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium">Nama Kelas *</label>
                  <input
                    type="text"
                    value={formData.namaKelas}
                    onChange={(e) =>
                      setFormData({ ...formData, namaKelas: e.target.value })
                    }
                    className="w-full border rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Semester *</label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
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
                  onClick={() =>
                    modal === "tambah" ? handleAdd() : handleEdit(editIndex)
                  }
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
