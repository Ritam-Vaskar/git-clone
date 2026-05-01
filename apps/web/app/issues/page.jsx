import Link from "next/link";
import { fetchJson } from "../../lib/api";

export default async function IssuesPage() {
  const reposData = await fetchJson("/repos");
  const repoList = reposData.repos || [];

  const issuesByRepo = await Promise.all(
    repoList.map(async (repo) => {
      const data = await fetchJson(`/issues/${repo.owner}/${repo.name}`);
      return data.issues || [];
    })
  );

  const issues = issuesByRepo.flat();

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
          {issues.map((issue) => (
            <Link
              key={`${issue.repo.owner}-${issue.repo.name}-${issue.number}`}
              className="list-item"
              href={`/issues/${issue.repo.owner}/${issue.repo.name}/${issue.number}`}
            >
              <div>
                {issue.repo.owner}/{issue.repo.name} - {issue.title}
              </div>
              <span className="badge">{issue.state}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
