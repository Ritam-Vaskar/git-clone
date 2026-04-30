const baseUrl = (process.env.GITEA_URL || "").replace(/\/$/, "");
const adminUser = process.env.GITEA_ADMIN_USER || "";
const adminPassword = process.env.GITEA_ADMIN_PASSWORD || "";

function requireConfig() {
  if (!baseUrl || !adminUser || !adminPassword) {
    throw new Error("Gitea config missing");
  }
}

function authHeader() {
  const encoded = Buffer.from(`${adminUser}:${adminPassword}`).toString("base64");
  return `Basic ${encoded}`;
}

export async function listRepos() {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/user/repos?limit=100`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch repos");
  }
  const repos = await res.json();
  return repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    owner: repo.owner?.login || repo.owner?.username || "",
    createdAt: repo.created_at
  }));
}

export async function listCommits(owner, repo) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/commits?limit=20`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch commits");
  }
  const commits = await res.json();
  return commits.map((commit) => ({
    id: commit.sha,
    sha: commit.sha?.slice(0, 8) || "",
    message: commit.commit?.message || "",
    author: commit.commit?.author?.name || "",
    createdAt: commit.created
  }));
}
*** End Patch