const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchJson(path) {
  const res = await fetch(`${baseUrl}${path}`);
  if (!res.ok) {
    throw new Error("Request failed");
  }
  return res.json();
}
