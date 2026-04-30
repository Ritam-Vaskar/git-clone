import { Router } from "express";
import { listRepos, listCommits } from "../services/gitea.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const repos = await listRepos();
    res.json({ repos });
  } catch (error) {
    res.status(500).json({ error: "Failed to load repos" });
  }
});

router.get("/:owner/:name/commits", async (req, res) => {
  const { owner, name } = req.params;
  try {
    const repos = await listRepos();
    const repo = repos.find((item) => item.owner === owner && item.name === name);
    if (!repo) {
      return res.status(404).json({ error: "Repo not found" });
    }

    const commits = await listCommits(owner, name);
    res.json({ repo, commits });
  } catch {
    res.status(500).json({ error: "Failed to load commits" });
  }
});

export default router;
