import { Router } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).optional(),
  password: z.string().min(6)
});

router.post("/register", async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, name, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      name: name || email.split("@")[0],
      password: hashed
    }
  });

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || "", {
    expiresIn: "7d"
  });

  return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.post("/login", async (req, res) => {
  const parsed = credentialsSchema.pick({ email: true, password: true }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || "", {
    expiresIn: "7d"
  });

  return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

export default router;
