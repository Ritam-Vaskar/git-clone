import Link from "next/link";
import { fetchJson } from "../../lib/api";

export default async function IssuesPage() {
  const data = await fetchJson("/issues");

  return (
    <main>
      <header className="header">
        <div className="logo">Issues</div>
        <nav className="nav">
          <Link href="/">Overview</Link>
          <Link href="/pulls">Pull Requests</Link>
          <Link href="/login">Sign In</Link>
        </nav>
      </header>

      <section className="panel">
        <h3>Open issues</h3>
        <div className="list">
          {data.issues.map((issue) => (
            <div key={issue.id} className="list-item">
              <div>
                {issue.repo.owner}/{issue.repo.name} - {issue.title}
              </div>
              <span className="badge">{issue.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
