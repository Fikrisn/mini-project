// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaMoneyBill,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [productStats, setProductStats] = useState<{ name: string; total: number }[]>([]);
  const [paymentStats, setPaymentStats] = useState<{ date: string; amount: number }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:3001/users", { headers }),
      fetch("http://localhost:3002/products", { headers }),
      fetch("http://localhost:3003/orders", { headers }),
      fetch("http://localhost:3004/payments", { headers }),
    ])
      .then(async ([resUsers, resProducts, resOrders, resPayments]) => {
        const [users, products, orders, payments] = await Promise.all([
          resUsers.json(),
          resProducts.json(),
          resOrders.json(),
          resPayments.json(),
        ]);

        setUserCount(users.length);
        setProductCount(products.length);
        setOrderCount(orders.length);

        const total = payments.reduce((acc: number, p: any) => acc + Number(p.amount), 0);
        setTotalPayment(total);

        // Ambil order_id dari payment yang sudah paid
        const paidOrderIds = new Set(
          payments.filter((p: any) => p.status === "paid").map((p: any) => p.order_id)
        );

        // Filter order yang sudah paid
        const paidOrders = orders.filter((order: any) => paidOrderIds.has(order.id));

        // Hitung jumlah order paid per product_id
        const productOrderCount: Record<number, number> = {};
        paidOrders.forEach((order: any) => {
          productOrderCount[order.product_id] = (productOrderCount[order.product_id] || 0) + 1;
        });

        // Gabungkan dengan nama produk
        const stats = products
          .filter((p: any) => productOrderCount[p.id])
          .map((p: any) => ({
            name: p.name,
            total: productOrderCount[p.id],
          }))
          .sort((a: { name: string; total: number }, b: { name: string; total: number }) => b.total - a.total)
          .slice(0, 5);

        setProductStats(stats);

        // Ambil 7 data terakhir dari payment
        const last7 = payments.slice(-7).map((item: any) => ({
          date: new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
          amount: item.amount,
        }));
        setPaymentStats(last7);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="card-grid">
        <CardStat title="Total Users" value={userCount} icon={<FaUsers />} />
        <CardStat title="Total Products" value={productCount} icon={<FaBox />} />
        <CardStat title="Total Orders" value={orderCount} icon={<FaShoppingCart />} />
        <CardStat
          title="Total Payments"
          value={`Rp ${totalPayment.toLocaleString()}`}
          icon={<FaMoneyBill />}
        />
      </div>

      <div className="chart-section side-by-side">
        <div className="chart-box">
          <h2>Top 5 Paid Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Payments (Last 7 Entries)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentStats}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

type CardStatProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

function CardStat({ title, value, icon }: CardStatProps) {
  return (
    <div className="card-stat">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
      </div>
    </div>
  );
}
