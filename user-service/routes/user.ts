import { Hono } from "hono";
import { pool } from "../src/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";

const userRoute = new Hono();

// ✅ GET all users
userRoute.get("/", async (c) => {
  const res = await pool.query("SELECT id, name, email FROM users");
  return c.json(res.rows);
});

// ✅ REGISTER user
userRoute.post("/register", async (c) => {
  const body = await c.req.json();

  const schema = z.object({
    name: z.string().min(1).trim(),
    email: z.string().email().trim(),
    password: z.string().min(6),
  });

  // Tangani array dan objek
  const users = Array.isArray(body) ? body : [body];

  const results = [];

  for (const u of users) {
    const data = schema.parse(u);
    const hashed = await bcrypt.hash(data.password, 10);

    const res = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [data.name, data.email, hashed]
    );

    results.push(res.rows[0]);
  }

  return c.json(results);
});


// ✅ LOGIN user (tanpa kolom role)
userRoute.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const schema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(1),
  });

  const data = schema.parse({ email, password });

  const result = await pool.query(
    "SELECT id, name, email, password FROM users WHERE email=$1 LIMIT 1",
    [data.email]
  );

  const user = result.rows[0];
  if (!user) return c.json({ error: "User not found" }, 404);

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) return c.json({ error: "Invalid password" }, 401);

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET is not set");

  const token = await sign(
    {
      id: user.id,
      email: user.email,
    },
    jwtSecret
  );

  return c.json({ token });
});

// ✅ UPDATE user
userRoute.put("/:id", async (c) => {
  const idParam = c.req.param("id");
  const id = Number(idParam);
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const body = await c.req.json();

  const schema = z.object({
    name: z.string().trim().optional(),
    email: z.string().email().trim().optional(),
    password: z.string().min(6).optional(),
  });

  const data = schema.parse(body);

  const existing = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (existing.rowCount === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  const user = existing.rows[0];

  const updatedName = data.name ?? user.name;
  const updatedEmail = data.email ?? user.email;
  const updatedPassword = data.password
    ? await bcrypt.hash(data.password, 10)
    : user.password;

  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email",
    [updatedName, updatedEmail, updatedPassword, id]
  );

  return c.json(result.rows[0]);
});

// ✅ DELETE user
userRoute.delete("/:id", async (c) => {
  const idParam = c.req.param("id");
  const id = Number(idParam);
  if (isNaN(id)) return c.json({ error: "Invalid ID" }, 400);

  const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

  if (result.rowCount === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ message: "User deleted", id: result.rows[0].id });
});

export default userRoute;
