import { useEffect, useState } from "react";

type Order = {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
};

type Product = {
  id: number;
  name: string;
  price: number;
};

type Payment = {
  id: number;
  order_id: number;
  amount: number;
  status: string;
};

export function PaymentList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newPayments, setNewPayments] = useState<Record<number, string>>({});

  const [isOrderAvailable, setOrderAvailable] = useState(true);
  const [isProductAvailable, setProductAvailable] = useState(true);
  const [isPaymentAvailable, setPaymentAvailable] = useState(true);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");

    try {
      const orderRes = await fetch("http://localhost:3003/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!orderRes.ok) throw new Error("Order fetch failed");
      setOrders(await orderRes.json());
      setOrderAvailable(true);
    } catch (err) {
      setOrders([]);
      setOrderAvailable(false);
    }

    try {
      const productRes = await fetch("http://localhost:3002/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!productRes.ok) throw new Error("Product fetch failed");
      setProducts(await productRes.json());
      setProductAvailable(true);
    } catch (err) {
      setProducts([]);
      setProductAvailable(false);
    }

    try {
      const paymentRes = await fetch("http://localhost:3004/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!paymentRes.ok) throw new Error("Payment fetch failed");
      setPayments(await paymentRes.json());
      setPaymentAvailable(true);
    } catch (err) {
      setPayments([]);
      setPaymentAvailable(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const paymentMap: Record<number, number> = payments.reduce((acc, p) => {
    acc[p.order_id] = (acc[p.order_id] || 0) + p.amount;
    return acc;
  }, {} as Record<number, number>);

  const unpaidOrders = orders.filter((order) => {
    const product = products.find((p) => p.id === order.product_id);
    if (!product) return true;
    const total = product.price * order.quantity;
    const paid = paymentMap[order.id] || 0;
    return paid < total;
  });

  const handlePay = async (order: Order) => {
    const token = localStorage.getItem("token");
    const product = products.find((p) => p.id === order.product_id);
    if (!product) return alert("Produk tidak ditemukan");

    const total = product.price * order.quantity;
    const paid = parseInt(newPayments[order.id]) || 0;
    const status = paid >= total - (paymentMap[order.id] || 0) ? "paid" : "pending";

    const res = await fetch("http://localhost:3004/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: order.id,
        amount: paid,
        status,
      }),
    });

    if (res.ok) {
      setNewPayments((prev) => ({ ...prev, [order.id]: "" }));
      fetchAll();
    } else {
      alert("Gagal membuat pembayaran");
    }
  };

  return (
    <section className="p-4 max-w-screen-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Pembayaran</h2>

      {!isOrderAvailable && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          ❌ Tidak dapat mengambil data Order (Server offline)
        </div>
      )}
      {!isProductAvailable && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          ❌ Tidak dapat mengambil data Produk (Server offline)
        </div>
      )}
      {!isPaymentAvailable && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          ❌ Tidak dapat mengambil data Pembayaran (Server offline)
        </div>
      )}

      {unpaidOrders.length > 0 ? (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-yellow-700">
            🔔 Daftar Order Belum Lunas
          </h3>
          {unpaidOrders.map((order) => {
            const product = products.find((p) => p.id === order.product_id);
            const total = product ? product.price * order.quantity : 0;
            const paid = paymentMap[order.id] || 0;
            const remaining = total - paid;

            return (
              <div
                key={order.id}
                className="bg-yellow-50 border border-yellow-200 p-4 rounded shadow-sm"
              >
                <p className="mb-2 text-gray-800">
                  Order #{order.id} - {product?.name || "Produk tidak ditemukan"} x{" "}
                  {order.quantity} <br />
                  Total: Rp {total} | Sudah dibayar: Rp {paid} | Sisa: Rp {remaining}
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePay(order);
                  }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="number"
                    placeholder="Jumlah bayar"
                    required
                    value={newPayments[order.id] || ""}
                    onChange={(e) =>
                      setNewPayments((prev) => ({
                        ...prev,
                        [order.id]: e.target.value,
                      }))
                    }
                    className="p-2 border rounded text-gray-800 w-40"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Bayar
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-green-700 font-medium mb-6">
          ✅ Semua pesanan sudah dibayar lunas
        </p>
      )}

      <h2 className="text-xl font-bold mb-2 text-gray-800">Riwayat Pembayaran</h2>
      <ul className="space-y-2">
        {payments.map((p) => (
          <li
            key={p.id}
            className={`p-4 shadow rounded text-gray-800 ${
              p.status === "paid" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            Order #{p.order_id} - Jumlah: Rp {p.amount} - Status:{" "}
            <strong className={p.status === "paid" ? "text-green-800" : "text-red-800"}>
              {p.status}
            </strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PaymentList;
