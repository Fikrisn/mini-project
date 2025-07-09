import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    fetch("http://localhost:3001/users")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch users");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => {
        console.error("Fetch Error:", err);
        alert("Gagal mengambil data user.");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus user ini?")) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus user");

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus user.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3001/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          email: editing.email,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate user");

      setEditing(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengupdate user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daftar User</h2>

      {/* Daftar User */}
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Belum ada user.</p>
      ) : (
        <div className="grid gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-lg shadow border p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-semibold text-gray-900">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(u)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                  disabled={loading}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Edit (di dalam halaman, bukan full overlay) */}
      {editing && (
        <div className="mt-10 mx-auto max-w-md bg-white border shadow-lg rounded-lg p-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
            <button
              onClick={() => setEditing(null)}
              className="text-gray-500 hover:text-gray-800 text-xl leading-none"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editing.email}
                onChange={(e) =>
                  setEditing({ ...editing, email: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
