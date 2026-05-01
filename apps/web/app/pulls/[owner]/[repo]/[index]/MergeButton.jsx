"use client";

import { useState } from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MergeButton({ owner, repo, index }) {
  const [status, setStatus] = useState("idle");

  async function handleMerge() {
    setStatus("loading");
    try {
      const res = await fetch(`${apiBase}/pulls/${owner}/${repo}/${index}/merge`, {
        method: "POST"
      });
      if (!res.ok) {
        throw new Error("Merge failed");
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <button className="button primary" onClick={handleMerge} disabled={status === "loading"}>
      {status === "loading" ? "Merging..." : status === "done" ? "Merged" : "Merge"}
    </button>
  );
}
