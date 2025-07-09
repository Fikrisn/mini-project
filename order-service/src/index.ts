import { Hono } from "hono";
import { cors } from "hono/cors";
import orderRoute from "./routes/order";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();
app.use("*", cors());
app.route("/orders", orderRoute);

app.get("/", (c) => c.text("order-service is running"));

export default app;