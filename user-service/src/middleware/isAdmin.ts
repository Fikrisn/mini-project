import type { MiddlewareHandler } from "hono";

export const isAdminMiddleware: MiddlewareHandler = async (c, next) => {
  const payload = c.get("jwtPayload") as { role: string };

  if (payload.role !== "admin") {
    return c.json({ error: "Forbidden, admin only" }, 403);
  }

  await next();
};
