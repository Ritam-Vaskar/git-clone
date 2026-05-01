import { Router } from "express";
import {
  listPulls,
  getPull,
  listPullComments,
  getPullDiff,
  mergePull
} from "../services/gitea.js";

const router = Router();

router.get("/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const pulls = await listPulls(owner, repo);
    res.json({ pulls });
  } catch {
    res.status(500).json({ error: "Failed to load pulls" });
  }
});

router.get("/:owner/:repo/:index", async (req, res) => {
  const { owner, repo, index } = req.params;
  try {
    const pull = await getPull(owner, repo, index);
    res.json({ pull });
  } catch {
    res.status(500).json({ error: "Failed to load pull" });
  }
});

router.get("/:owner/:repo/:index/comments", async (req, res) => {
  const { owner, repo, index } = req.params;
  try {
    const comments = await listPullComments(owner, repo, index);
    res.json({ comments });
  } catch {
    res.status(500).json({ error: "Failed to load comments" });
  }
});

router.get("/:owner/:repo/:index/diff", async (req, res) => {
  const { owner, repo, index } = req.params;
  try {
    const diff = await getPullDiff(owner, repo, index);
    res.json({ diff });
  } catch {
    res.status(500).json({ error: "Failed to load diff" });
  }
});

router.post("/:owner/:repo/:index/merge", async (req, res) => {
  const { owner, repo, index } = req.params;
  try {
    const result = await mergePull(owner, repo, index);
    res.json({ result });
  } catch {
    res.status(500).json({ error: "Failed to merge" });
  }
});

export default router;
