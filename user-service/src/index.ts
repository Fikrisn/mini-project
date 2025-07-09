import { Hono } from "hono";
import { cors } from "hono/cors";
import userRoute from "../routes/user";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

app.use("*", cors());

// ini penting!
app.route("/users", userRoute);

app.get("/", (c) => c.text("user-service is running"));

export default app;
