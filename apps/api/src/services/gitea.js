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

export async function listTree(owner, repo, path = "") {
  requireConfig();
  const cleanPath = path
    ? `/${path.split("/").map((part) => encodeURIComponent(part)).join("/")}`
    : "";
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/contents${cleanPath}`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch tree");
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type,
    size: item.size
  }));
}

export async function fetchFile(owner, repo, path) {
  requireConfig();
  const safePath = path.split("/").map((part) => encodeURIComponent(part)).join("/");
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/contents/${safePath}`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch file");
  }
  const data = await res.json();
  if (!data || data.type !== "file") {
    throw new Error("Not a file");
  }
  const content = data.content ? Buffer.from(data.content, "base64").toString("utf8") : "";
  return {
    name: data.name,
    path: data.path,
    size: data.size,
    content
  };
}