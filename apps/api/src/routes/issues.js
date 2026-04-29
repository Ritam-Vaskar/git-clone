import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import prisma from "../prisma.js";

const router = Router();

const issueSchema = z.object({
  repoId: z.string(),
  title: z.string().min(3),
  body: z.string().min(3)
});

router.get("/", async (_req, res) => {
  const issues = await prisma.issue.findMany({
    include: { repo: true, author: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ issues });
});

router.post("/", requireAuth, async (req, res) => {
  const parsed = issueSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const issue = await prisma.issue.create({
    data: {
      ...parsed.data,
      authorId: req.userId || ""
    }
  });

  res.status(201).json({ issue });
});

export default router;
