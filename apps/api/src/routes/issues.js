import { Router } from "express";
import { listIssues, getIssue, listIssueComments } from "../services/gitea.js";

const router = Router();

router.get("/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const issues = await listIssues(owner, repo);
    res.json({ issues });
  } catch {
    res.status(500).json({ error: "Failed to load issues" });
  }
});

router.get("/:owner/:repo/:index", async (req, res) => {
  const { owner, repo, index } = req.params;
  try {
    const issue = await getIssue(owner, repo, index);
    res.json({ issue });
  } catch {
    res.status(500).json({ error: "Failed to load issue" });
  }
});

router.get("/:owner/:repo/:index/comments", async (req, res) => {
  const { owner, repo, index } = req.params;
  try {
    const comments = await listIssueComments(owner, repo, index);
    res.json({ comments });
  } catch {
    res.status(500).json({ error: "Failed to load comments" });
  }
});

export default router;
