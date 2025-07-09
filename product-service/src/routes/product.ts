import { Hono } from "hono";
import { cors } from "hono/cors";
import { pool } from "../db";
import { authMiddleware } from "../middleware/auth";

const productRoute = new Hono();

// ✅ Tambahkan middleware CORS agar browser bisa kirim Authorization header
productRoute.use("*", cors({
  origin: "http://localhost:5173", // atau ganti "http://localhost:5173" untuk lebih aman
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// ✅ Tangani request preflight (OPTIONS)
productRoute.options("*", (c) => c.body(null, 204));

// ✅ Debug log semua request
productRoute.use("*", async (c, next) => {
  console.log(`${c.req.method} ${c.req.url}`);
  console.log("Headers:", c.req.header());
  await next();
});

// ✅ Proteksi semua endpoint setelah ini
productRoute.use("*", authMiddleware);

// ✅ GET /products
productRoute.get("/", async (c) => {
  try {
    console.log("Fetching products...");
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    console.log("Products found:", result.rows.length);
    console.log("Products data:", result.rows);
    return c.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products" }, 500);
  }
});

// ✅ POST /products
productRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const products = Array.isArray(body) ? body : [body]; // ⬅ bisa array atau single

    const inserted = [];

    for (const product of products) {
      const { name, price } = product;

      if (!name || typeof price !== "number") {
        console.warn("Invalid product data skipped:", product);
        continue;
      }

      const result = await pool.query(
        "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
        [name, price]
      );

      inserted.push(result.rows[0]);
    }

    return c.json(inserted);
  } catch (error) {
    console.error("Error creating product(s):", error);
    return c.json({ error: "Failed to create product(s)" }, 500);
  }
});


// ✅ PUT /products/:id
productRoute.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { name, price } = await c.req.json();
    console.log("Updating product:", { id, name, price });

    const result = await pool.query(
      "UPDATE products SET name=$1, price=$2 WHERE id=$3 RETURNING *",
      [name, price, id]
    );

    if (result.rows.length === 0) {
      return c.json({ error: "Product not found" }, 404);
    }

    console.log("Product updated:", result.rows[0]);
    return c.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ error: "Failed to update product" }, 500);
  }
});

// ✅ DELETE /products/:id
productRoute.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log("Deleting product:", id);

    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return c.json({ error: "Product not found" }, 404);
    }

    console.log("Product deleted:", result.rows[0]);
    return c.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ error: "Failed to delete product" }, 500);
  }
});

export default productRoute;
