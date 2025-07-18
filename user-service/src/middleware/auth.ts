import type { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";

export type JwtPayload = {
  id: number;
  email: string;
};

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("authorization");
  if (!authHeader) return c.json({ error: "Unauthorized" }, 401);

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(
      token,
      process.env.JWT_SECRET || "supersecret"
    );

    c.set("jwtPayload", payload as JwtPayload);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
};
