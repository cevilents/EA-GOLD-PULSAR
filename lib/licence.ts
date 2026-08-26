export type LicenceAppendResult = "appended" | "exists" | "failed";

const API_BASE = "https://api.github.com";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;
const DEFAULT_LICENSE_FILE_PATH = "PHOENIXALPHA";

interface ContentMetadata {
  sha: string;
  content: string;
}

type PutOutcome = "ok" | "stale" | "failed";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

function fileUrl(repo: string, path: string): string {
  return `${API_BASE}/repos/${repo}/contents/${encodeURIComponent(path)}`;
}

async function fetchMetadata(repo: string, path: string, token: string): Promise<ContentMetadata | null> {
  try {
    const response = await fetch(`${fileUrl(repo, path)}?ref=main`, {
      headers: authHeaders(token),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    if (!response.ok) return null;
    const record = asRecord(await response.json());
    if (!record) return null;
    const sha = record["sha"];
    const content = record["content"];
    if (typeof sha !== "string" || typeof content !== "string") return null;
    return { sha, content };
  } catch {
    return null;
  }
}

async function putContent(
  repo: string,
  path: string,
  token: string,
  sha: string,
  contentBase64: string,
  message: string
): Promise<PutOutcome> {
  try {
    const response = await fetch(fileUrl(repo, path), {
      method: "PUT",
      headers: { ...authHeaders(token), "Content-Type": "application/json" },
      body: JSON.stringify({ message, content: contentBase64, sha, branch: "main" }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
    if (response.ok) return "ok";
    if (response.status === 409 || response.status === 422) return "stale";
    return "failed";
  } catch {
    return "failed";
  }
}

function decodeFile(contentBase64: string): string[] {
  const decoded = Buffer.from(contentBase64.replace(/\s/g, ""), "base64").toString("utf8");
  const trimmed = decoded.trim();
  if (trimmed.length === 0) return [];
  return trimmed.split("\n");
}

export async function appendLicensedAccount(account: string): Promise<LicenceAppendResult> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const path = process.env.LICENSE_FILE_PATH ?? DEFAULT_LICENSE_FILE_PATH;
  if (!token || !repo || account.length === 0) return "failed";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const metadata = await fetchMetadata(repo, path, token);
    if (metadata === null) return "failed";
    const lines = decodeFile(metadata.content);
    if (lines.some((line) => line.trim() === account)) return "exists";
    const newContent = lines.length === 0 ? `${account}\n` : `${lines.join("\n")}\n${account}\n`;
    const outcome = await putContent(
      repo,
      path,
      token,
      metadata.sha,
      Buffer.from(newContent, "utf8").toString("base64"),
      `Add licensed account ${account}`
    );
    if (outcome === "ok") return "appended";
    if (outcome === "failed") return "failed";
  }
  return "failed";
}
