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

export async function listIssues(owner, repo) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/issues?state=open&limit=50`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch issues");
  }
  const issues = await res.json();
  return issues.map((issue) => ({
    id: issue.id,
    number: issue.number,
    title: issue.title,
    body: issue.body || "",
    state: issue.state,
    createdAt: issue.created_at,
    repo: { owner, name: repo }
  }));
}

export async function getIssue(owner, repo, index) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/issues/${index}`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch issue");
  }
  const issue = await res.json();
  return {
    id: issue.id,
    number: issue.number,
    title: issue.title,
    body: issue.body || "",
    state: issue.state,
    createdAt: issue.created_at,
    repo: { owner, name: repo }
  };
}

export async function listIssueComments(owner, repo, index) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/issues/${index}/comments`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch issue comments");
  }
  const comments = await res.json();
  return comments.map((comment) => ({
    id: comment.id,
    body: comment.body || "",
    author: comment.user?.login || comment.user?.username || "",
    createdAt: comment.created_at
  }));
}

export async function listPulls(owner, repo) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/pulls?state=open&limit=50`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pulls");
  }
  const pulls = await res.json();
  return pulls.map((pull) => ({
    id: pull.id,
    number: pull.number,
    title: pull.title,
    body: pull.body || "",
    state: pull.state,
    createdAt: pull.created_at,
    repo: { owner, name: repo },
    base: pull.base?.ref || "",
    head: pull.head?.ref || ""
  }));
}

export async function getPull(owner, repo, index) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/pulls/${index}`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pull");
  }
  const pull = await res.json();
  return {
    id: pull.id,
    number: pull.number,
    title: pull.title,
    body: pull.body || "",
    state: pull.state,
    createdAt: pull.created_at,
    repo: { owner, name: repo },
    base: pull.base?.ref || "",
    head: pull.head?.ref || ""
  };
}

export async function listPullComments(owner, repo, index) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/pulls/${index}/comments`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch pull comments");
  }
  const comments = await res.json();
  return comments.map((comment) => ({
    id: comment.id,
    body: comment.body || "",
    author: comment.user?.login || comment.user?.username || "",
    createdAt: comment.created_at
  }));
}

export async function getPullDiff(owner, repo, index) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/pulls/${index}.diff`, {
    headers: { Authorization: authHeader() }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch diff");
  }
  return res.text();
}

export async function mergePull(owner, repo, index) {
  requireConfig();
  const res = await fetch(`${baseUrl}/api/v1/repos/${owner}/${repo}/pulls/${index}/merge`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ merge_title_field: "Merge pull request" })
  });
  if (!res.ok) {
    throw new Error("Failed to merge pull");
  }
  return res.json();
}