import { Hono } from "hono";
import { cors } from "hono/cors";
import paymentRoute from "./routes/payment";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

// CORS root (opsional tambahan di level global)
app.use("*", cors());

app.route("/payments", paymentRoute);

app.get("/", (c) => c.text("payment-service is running"));

export default app;
