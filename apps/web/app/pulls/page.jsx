import Link from "next/link";
import { fetchJson } from "../../lib/api";

export const dynamic = "force-dynamic";

export default async function PullsPage() {
  const reposData = await fetchJson("/repos");
  const repoList = reposData.repos || [];

  const pullsByRepo = await Promise.all(
    repoList.map(async (repo) => {
      const data = await fetchJson(`/pulls/${repo.owner}/${repo.name}`);
      return data.pulls || [];
    })
  );

  const pulls = pullsByRepo.flat();

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
          {pulls.map((pull) => (
            <Link
              key={`${pull.repo.owner}-${pull.repo.name}-${pull.number}`}
              className="list-item"
              href={`/pulls/${pull.repo.owner}/${pull.repo.name}/${pull.number}`}
            >
              <div>
                {pull.repo.owner}/{pull.repo.name} - {pull.title}
              </div>
              <span className="badge">{pull.state}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
