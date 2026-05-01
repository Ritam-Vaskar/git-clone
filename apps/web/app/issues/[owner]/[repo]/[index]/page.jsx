import Link from "next/link";
import { fetchJson } from "../../../../../lib/api";

export default async function IssueDetailPage({ params }) {
  const { owner, repo, index } = params;
  const [issueData, commentsData] = await Promise.all([
    fetchJson(`/issues/${owner}/${repo}/${index}`),
    fetchJson(`/issues/${owner}/${repo}/${index}/comments`)
  ]);

  const issue = issueData.issue;
  const comments = commentsData.comments || [];

  return (
    <main>
      <header className="header">
        <div className="logo">Issue #{issue.number}</div>
        <nav className="nav">
          <Link href={`/repos/${owner}/${repo}`}>Repo</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/pulls">Pull Requests</Link>
        </nav>
      </header>

      <section className="panel">
        <h3>{issue.title}</h3>
        <p className="muted">{owner}/{repo} • {issue.state}</p>
        <p className="body-text">{issue.body || "No description provided."}</p>
      </section>

      <section className="panel">
        <h3>Comments</h3>
        <div className="comment-list">
          {comments.length === 0 && <p className="muted">No comments yet.</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-meta">{comment.author}</div>
              <p>{comment.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
