import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
};

type Order = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newOrder, setNewOrder] = useState({
    user_id: "",
    product_id: "",
    quantity: "",
  });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [isOrdersAvailable, setIsOrdersAvailable] = useState(true);
  const [isProductsAvailable, setIsProductsAvailable] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3003/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data);
      setIsOrdersAvailable(true);
    } catch (err) {
      setOrders([]);
      setIsOrdersAvailable(false);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3002/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(data);
      setIsProductsAvailable(true);
    } catch (err) {
      setProducts([]);
      setIsProductsAvailable(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("http://localhost:3003/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: parseInt(newOrder.user_id),
        product_id: parseInt(newOrder.product_id),
        quantity: parseInt(newOrder.quantity),
      }),
    });
    setNewOrder({ user_id: "", product_id: "", quantity: "" });
    fetchOrders();
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3003/orders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchOrders();
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3003/orders/${editingOrder.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingOrder),
    });
    setEditingOrder(null);
    fetchOrders();
  };

  return (
    <section className="p-4 max-w-screen-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Buat Pesanan</h2>

      {!isOrdersAvailable && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          ❌ Gagal mengambil data pesanan (orders-service mati)
        </div>
      )}
      {!isProductsAvailable && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          ❌ Gagal mengambil data produk (products-service mati)
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-2 mb-6">
        <input
          type="number"
          placeholder="User ID"
          value={newOrder.user_id}
          onChange={(e) => setNewOrder({ ...newOrder, user_id: e.target.value })}
          className="p-2 border rounded w-full text-gray-800"
          required
        />
        <select
          value={newOrder.product_id}
          onChange={(e) => setNewOrder({ ...newOrder, product_id: e.target.value })}
          className="p-2 border rounded w-full text-gray-800"
          required
        >
          <option value="">Pilih Produk</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - Rp {p.price}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Jumlah"
          value={newOrder.quantity}
          onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
          className="p-2 border rounded w-full text-gray-800"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Tambah Pesanan
        </button>
      </form>

      {editingOrder && (
        <form onSubmit={handleUpdate} className="space-y-2 mb-6 bg-gray-100 p-4 rounded">
          <h3 className="font-bold text-gray-700">Edit Pesanan #{editingOrder.id}</h3>
          <input
            type="number"
            value={editingOrder.user_id}
            onChange={(e) =>
              setEditingOrder({ ...editingOrder, user_id: parseInt(e.target.value) })
            }
            className="p-2 border rounded w-full"
          />
          <select
            value={editingOrder.product_id}
            onChange={(e) =>
              setEditingOrder({ ...editingOrder, product_id: parseInt(e.target.value) })
            }
            className="p-2 border rounded w-full"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={editingOrder.quantity}
            onChange={(e) =>
              setEditingOrder({ ...editingOrder, quantity: parseInt(e.target.value) })
            }
            className="p-2 border rounded w-full"
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setEditingOrder(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <h2 className="text-xl font-bold mb-2 text-gray-800">Daftar Pesanan</h2>
      <ul className="space-y-2">
        {orders.map((order) => {
          const product = products.find((p) => p.id === order.product_id);
          return (
            <li
              key={order.id}
              className="bg-white p-4 shadow rounded text-gray-800 flex justify-between items-center"
            >
              <div>
                🧾 User #{order.user_id} pesan {product?.name ?? "Produk: unknown"} x {order.quantity}
                <br />
                <span className="text-sm text-gray-500">ID Order: {order.id}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(order)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
