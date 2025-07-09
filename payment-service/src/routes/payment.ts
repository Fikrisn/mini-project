import { Hono } from "hono";
import { pool } from "../db";
import { authMiddleware } from "../middleware/auth";
import { cors } from "hono/cors";

const paymentRoute = new Hono();

paymentRoute.use("*", cors({
  origin: "*",
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

paymentRoute.options("*", (c) => c.body(null, 204));

paymentRoute.use("*", authMiddleware);

// GET payments
paymentRoute.get("/", async (c) => {
  const result = await pool.query("SELECT * FROM payments");
  return c.json(result.rows);
});

// POST payment with order_id validation
paymentRoute.post("/", async (c) => {
  const { order_id, amount, status } = await c.req.json();

  // Validasi order_id ke order-service
  const token = c.req.header("authorization");
  const orderRes = await fetch(`http://localhost:3003/orders`, {
    headers: { Authorization: token! },
  });

  if (!orderRes.ok) return c.json({ error: "Gagal memvalidasi order" }, 400);
  const orders = await orderRes.json();
  const orderExists = orders.some((o: any) => o.id === order_id);

  if (!orderExists) return c.json({ error: "Order ID tidak valid" }, 404);

  const result = await pool.query(
    "INSERT INTO payments (order_id, amount, status) VALUES ($1, $2, $3) RETURNING *",
    [order_id, amount, status]
  );

  return c.json(result.rows[0]);
});

// PUT & DELETE seperti biasa
paymentRoute.put("/:id", async (c) => {
  const id = c.req.param("id");
  const { order_id, amount, status } = await c.req.json();
  const result = await pool.query(
    "UPDATE payments SET order_id=$1, amount=$2, status=$3 WHERE id=$4 RETURNING *",
    [order_id, amount, status, id]
  );
  return c.json(result.rows[0]);
});

paymentRoute.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await pool.query("DELETE FROM payments WHERE id=$1", [id]);
  return c.json({ message: "deleted" });
});

export default paymentRoute;
