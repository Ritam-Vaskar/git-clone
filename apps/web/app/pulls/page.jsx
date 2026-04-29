import Link from "next/link";
import { fetchJson } from "../../lib/api";

export default async function PullsPage() {
  const data = await fetchJson("/pulls");

  return (
    <main>
      <header className="header">
        <div className="logo">Pull Requests</div>
        <nav className="nav">
          <Link href="/">Overview</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/login">Sign In</Link>
        </nav>
      </header>

      <section className="panel">
        <h3>Active pull requests</h3>
        <div className="list">
          {data.pulls.map((pull) => (
            <div key={pull.id} className="list-item">
              <div>
                {pull.repo.owner}/{pull.repo.name} - {pull.title}
              </div>
              <span className="badge">{pull.status}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
