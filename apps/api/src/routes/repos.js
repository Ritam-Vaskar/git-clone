import { Router } from "express";
import { listRepos, listCommits, listTree, fetchFile } from "../services/gitea.js";

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

router.get("/:owner/:name/tree", async (req, res) => {
  const { owner, name } = req.params;
  const path = typeof req.query.path === "string" ? req.query.path : "";
  try {
    const tree = await listTree(owner, name, path);
    res.json({ tree, path });
  } catch {
    res.status(500).json({ error: "Failed to load tree" });
  }
});

router.get("/:owner/:name/file", async (req, res) => {
  const { owner, name } = req.params;
  const path = typeof req.query.path === "string" ? req.query.path : "";
  if (!path) {
    return res.status(400).json({ error: "Missing path" });
  }

  try {
    const file = await fetchFile(owner, name, path);
    res.json({ file });
  } catch {
    res.status(500).json({ error: "Failed to load file" });
  }
});

export default router;
