import Link from "next/link";
import { fetchJson } from "../lib/api";

export default async function HomePage() {
  let repos = [];
  try {
    const data = await fetchJson("/repos");
    repos = data.repos;
  } catch {
    repos = [];
  }

  return (
    <>
      <header className="header">
        <div className="logo">GHC</div>
        <nav className="nav">
          <Link href="/repos/demo/alpha">Repo</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/pulls">Pull Requests</Link>
          <Link href="/login">Sign In</Link>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div>
            <h1>Build. Review. Merge. All in one bold workspace.</h1>
            <p>
              A GitHub-style experience with clean pipelines, expressive UI, and
              instant visibility into code health.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/repos/demo/alpha">
                Explore demo repo
              </Link>
              <Link className="button ghost" href="/issues">
                View issues
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="badge">Live activity</span>
            <div className="panel-grid">
              <div className="panel">
                <h3>Build status</h3>
                <p>Checks are clean across 4 pipelines.</p>
              </div>
              <div className="panel">
                <h3>Review rhythm</h3>
                <p>3 pull requests ready to merge.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-grid">
          <div className="panel">
            <h3>Repositories</h3>
            <div className="list">
              {repos.length === 0 && <div className="list-item">No repos yet</div>}
              {repos.map((repo) => (
                <div key={repo.id} className="list-item">
                  <div>
                    {repo.owner}/{repo.name}
                  </div>
                  <Link href={`/repos/${repo.owner}/${repo.name}`}>Open</Link>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3>Insights</h3>
            <p>
              Track your velocity with clean charts, issue queues, and merge
              gates.
            </p>
          </div>
          <div className="panel">
            <h3>Security</h3>
            <p>
              Ready for SSO and policy enforcement. Add your own provider when
              deploying.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
