import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const repos = await prisma.repo.findMany({
    select: {
      id: true,
      name: true,
      owner: true,
      createdAt: true
    }
  });
  res.json({ repos });
});

router.get("/:owner/:name/commits", async (req, res) => {
  const { owner, name } = req.params;
  const repo = await prisma.repo.findUnique({ where: { owner_name: { owner, name } } });
  if (!repo) {
    return res.status(404).json({ error: "Repo not found" });
  }

  const commits = await prisma.commit.findMany({
    where: { repoId: repo.id },
    orderBy: { createdAt: "desc" }
  });

  res.json({ repo, commits });
});

export default router;
