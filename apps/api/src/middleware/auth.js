import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Missing authorization" });
  }

  const token = header.replace("Bearer ", "").trim();
  try {
    const secret = process.env.JWT_SECRET || "";
    const payload = jwt.verify(token, secret);
    if (typeof payload !== "object" || payload === null || !("sub" in payload)) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
