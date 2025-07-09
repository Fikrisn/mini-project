import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3002/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setProducts)
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice("");
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = { name, price: parseFloat(price) };
    setLoading(true);

    const url = editing
      ? `http://localhost:3002/products/${editing.id}`
      : "http://localhost:3002/products";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    resetForm();
    fetchProducts();
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3002/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Produk</h2>

      {/* Form Tambah/Edit */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-4 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-700">
          {editing ? "Edit Produk" : "Tambah Produk Baru"}
        </h3>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
              Nama Produk
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Contoh: Laptop ASUS"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="price" className="block text-sm text-gray-600 mb-1">
              Harga Produk
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Contoh: 1500000"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {editing ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400 transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* List Produk */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center">Belum ada produk tersedia.</p>
      ) : (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {products.map((p) => (
            <li
              key={p.id}
              className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{p.name}</h4>
                <p className="text-gray-600">Rp {p.price.toLocaleString("id-ID")}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(p);
                    setName(p.name);
                    setPrice(String(p.price));
                  }}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
