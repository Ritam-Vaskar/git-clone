import Link from "next/link";
import { fetchJson } from "../../../../lib/api";

function buildQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

function parentDir(path) {
  if (!path) {
    return "";
  }
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

export default async function RepoPage({ params, searchParams }) {
  const currentDir = typeof searchParams?.dir === "string" ? searchParams.dir : "";
  const upDir = parentDir(currentDir);
  const selectedPath = typeof searchParams?.path === "string" ? searchParams.path : "";

  const [commitData, treeData, fileData] = await Promise.all([
    fetchJson(`/repos/${params.owner}/${params.repo}/commits`),
    fetchJson(`/repos/${params.owner}/${params.repo}/tree${buildQuery({ path: currentDir })}`),
    selectedPath
      ? fetchJson(`/repos/${params.owner}/${params.repo}/file${buildQuery({ path: selectedPath })}`)
      : Promise.resolve(null)
  ]);

  const commits = commitData.commits || [];
  const repo = commitData.repo || { owner: params.owner, name: params.repo };
  const tree = treeData.tree || [];
  const file = fileData ? fileData.file : null;

  return (
    <main>
      <header className="header">
        <div className="logo">{repo.owner}/{repo.name}</div>
        <nav className="nav">
          <Link href="/">Overview</Link>
          <Link href="/issues">Issues</Link>
          <Link href="/pulls">Pull Requests</Link>
        </nav>
      </header>

      <section className="repo-grid">
        <div className="panel">
          <h3>Files {currentDir ? `- ${currentDir}` : ""}</h3>
          <div className="list">
            {currentDir && (
              <Link className="list-item file-item" href={buildQuery({ dir: upDir })}>
                <span>..</span>
                <span className="badge">up</span>
              </Link>
            )}
            {tree.map((item) => (
              <Link
                key={item.path}
                className="list-item file-item"
                href={
                  item.type === "dir"
                    ? buildQuery({ dir: item.path })
                    : buildQuery({ dir: currentDir, path: item.path })
                }
              >
                <span>{item.name}</span>
                <span className="badge">{item.type}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel file-panel">
          <h3>{file ? file.path : "Select a file"}</h3>
          {file ? (
            <pre className="file-content">{file.content}</pre>
          ) : (
            <p className="muted">Choose a file to preview its contents.</p>
          )}
        </div>
      </section>

      <section className="panel">
        <h3>Recent commits</h3>
        <div className="list">
          {commits.map((commit) => (
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
