import { Hono } from "hono";
import { cors } from "hono/cors";
import productRoute from "./routes/product";
import dotenv from "dotenv";
import "dotenv/config";

dotenv.config();

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.route("/products", productRoute);

app.get("/", (c) => c.text("product-service is running"));

export default app;
