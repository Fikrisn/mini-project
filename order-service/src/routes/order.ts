import { Hono } from "hono";
import { pool } from "../db";
import { authMiddleware } from "../middleware/auth";
import { cors } from "hono/cors";

const orderRoute = new Hono();

orderRoute.use("*", cors({
  origin: "*",
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

orderRoute.options("*", (c) => c.body(null, 204));

orderRoute.use("*", authMiddleware);

// GET orders
orderRoute.get("/", async (c) => {
  const result = await pool.query("SELECT * FROM orders");
  return c.json(result.rows);
});

// POST order + auto create payment
orderRoute.post("/", async (c) => {
  const { user_id, product_id, quantity } = await c.req.json();

  // 1. Simpan order
  const result = await pool.query(
    "INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    [user_id, product_id, quantity]
  );
  const order = result.rows[0];

  // 2. Fetch harga produk dari product-service
  const productRes = await fetch(`http://localhost:3002/products/${product_id}`);
  if (!productRes.ok) return c.json({ error: "Produk tidak ditemukan" }, 404);
  const product = await productRes.json();

  // 3. Hitung total harga
  const amount = product.price * quantity;

  // 4. Kirim ke payment-service
  const token = c.req.header("authorization");
  await fetch("http://localhost:3004/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token!,
    },
    body: JSON.stringify({
      order_id: order.id,
      amount,
      status: "pending",
    }),
  });

  return c.json(order);
});

// PUT & DELETE seperti biasa
orderRoute.put("/:id", async (c) => {
  const id = c.req.param("id");
  const { user_id, product_id, quantity } = await c.req.json();
  const result = await pool.query(
    "UPDATE orders SET user_id=$1, product_id=$2, quantity=$3 WHERE id=$4 RETURNING *",
    [user_id, product_id, quantity, id]
  );
  return c.json(result.rows[0]);
});

orderRoute.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await pool.query("DELETE FROM orders WHERE id=$1", [id]);
  return c.json({ message: "deleted" });
});

export default orderRoute;
