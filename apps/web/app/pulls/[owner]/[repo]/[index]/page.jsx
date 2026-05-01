import Link from "next/link";
import { fetchJson } from "../../../../../lib/api";
import MergeButton from "./MergeButton";

export default async function PullDetailPage({ params }) {
  const { owner, repo, index } = params;
  const [pullData, commentsData, diffData] = await Promise.all([
    fetchJson(`/pulls/${owner}/${repo}/${index}`),
    fetchJson(`/pulls/${owner}/${repo}/${index}/comments`),
    fetchJson(`/pulls/${owner}/${repo}/${index}/diff`)
  ]);

  const pull = pullData.pull;
  const comments = commentsData.comments || [];
  const diff = diffData.diff || "";

  return (
    <main>
      <header className="header">
        <div className="logo">PR #{pull.number}</div>
        <nav className="nav">
          <Link href={`/repos/${owner}/${repo}`}>Repo</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/pulls">Pull Requests</Link>
        </nav>
      </header>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>{pull.title}</h3>
            <p className="muted">{owner}/{repo} • {pull.state}</p>
          </div>
          <MergeButton owner={owner} repo={repo} index={index} />
        </div>
        <p className="body-text">{pull.body || "No description provided."}</p>
        <p className="muted">{pull.head} → {pull.base}</p>
      </section>

      <section className="panel">
        <h3>Diff</h3>
        <pre className="diff-content">{diff}</pre>
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
