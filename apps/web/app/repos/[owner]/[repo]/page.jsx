import Link from "next/link";
import { fetchJson } from "../../../../lib/api";

export default async function RepoPage({ params }) {
  const data = await fetchJson(`/repos/${params.owner}/${params.repo}/commits`);

  return (
    <main>
      <header className="header">
        <div className="logo">{data.repo.owner}/{data.repo.name}</div>
        <nav className="nav">
          <Link href="/">Overview</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/pulls">Pull Requests</Link>
        </nav>
      </header>

      <section className="panel">
        <h3>Recent commits</h3>
        <div className="list">
          {data.commits.map((commit) => (
            <div key={commit.id} className="list-item">
              <div>
                <div>{commit.message}</div>
                <div className="badge">{commit.sha}</div>
              </div>
              <div>{commit.author}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
