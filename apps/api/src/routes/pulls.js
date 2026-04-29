import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import prisma from "../prisma.js";

const router = Router();

const pullSchema = z.object({
  repoId: z.string(),
  title: z.string().min(3),
  body: z.string().min(3)
});

router.get("/", async (_req, res) => {
  const pulls = await prisma.pullRequest.findMany({
    include: { repo: true, author: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ pulls });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = pullSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const pull = await prisma.pullRequest.create({
    data: {
      ...parsed.data,
      authorId: req.userId || ""
    }
  });

  res.status(201).json({ pull });
});

export default router;
