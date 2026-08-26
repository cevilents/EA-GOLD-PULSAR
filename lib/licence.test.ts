import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appendLicensedAccount } from "./licence";

interface Call {
  url: string;
  method: string;
  body: string;
}

const calls: Call[] = [];

function base64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64");
}

function metadataResponse(sha: string, fileContent: string): Response {
  return new Response(JSON.stringify({ sha, content: base64(fileContent) }), { status: 200 });
}

function queueFetch(responses: Array<() => Response>): void {
  let index = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: unknown, init?: RequestInit): Promise<Response> => {
      const call: Call = {
        url: String(url),
        method: (init?.method ?? "GET").toUpperCase(),
        body: String(init?.body ?? "")
      };
      calls.push(call);
      const factory = responses[Math.min(index, responses.length - 1)];
      index++;
      return factory();
    })
  );
}

function putBody(call: Call | undefined): Record<string, unknown> {
  return JSON.parse(call?.body ?? "{}") as Record<string, unknown>;
}

describe("appendLicensedAccount", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_REPO = "owner/MEMBERVIP";
    delete process.env.LICENSE_FILE_PATH;
    calls.length = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("appended saat akun belum ada di file", async () => {
    queueFetch([
      () => metadataResponse("sha-1", "257528675\n"),
      () => new Response(JSON.stringify({ commit: "x" }), { status: 200 })
    ]);

    const result = await appendLicensedAccount("11112222");

    expect(result).toBe("appended");
    expect(calls[0]?.method).toBe("GET");
    expect(calls[0]?.url).toBe(
      "https://api.github.com/repos/owner/MEMBERVIP/contents/PHOENIXALPHA?ref=main"
    );
    expect(calls[0]?.body).toBe("");
    expect(calls[1]?.method).toBe("PUT");
    expect(putBody(calls[1])).toEqual({
      message: "Add licensed account 11112222",
      content: base64("257528675\n11112222\n"),
      sha: "sha-1",
      branch: "main"
    });
  });

  it("exists saat akun sudah terdaftar dan tidak ada PUT", async () => {
    queueFetch([() => metadataResponse("sha-1", "257528675\n11112222\n")]);

    const result = await appendLicensedAccount("11112222");

    expect(result).toBe("exists");
    expect(calls.filter((call) => call.method === "PUT")).toHaveLength(0);
  });

  it("retry sukses saat PUT pertama konflik stale sha", async () => {
    queueFetch([
      () => metadataResponse("sha-stale", "257528675\n"),
      () => new Response(JSON.stringify({}), { status: 422 }),
      () => metadataResponse("sha-fresh", "257528675\n"),
      () => new Response(JSON.stringify({ commit: "y" }), { status: 201 })
    ]);

    const result = await appendLicensedAccount("33334444");

    expect(result).toBe("appended");
    expect(calls.filter((call) => call.method === "PUT")).toHaveLength(2);
    expect(putBody(calls.find((call) => call.method === "PUT" && putBody(call)["sha"] === "sha-fresh"))).toMatchObject({
      content: base64("257528675\n33334444\n"),
      branch: "main"
    });
  });

  it("failed saat selalu gagal sampai batas percobaan", async () => {
    queueFetch([
      () => metadataResponse("sha-1", "257528675\n"),
      () => new Response(JSON.stringify({}), { status: 409 }),
      () => metadataResponse("sha-2", "257528675\n"),
      () => new Response(JSON.stringify({}), { status: 409 }),
      () => metadataResponse("sha-3", "257528675\n"),
      () => new Response(JSON.stringify({}), { status: 409 })
    ]);

    const result = await appendLicensedAccount("55556666");

    expect(result).toBe("failed");
    expect(calls.filter((call) => call.method === "PUT")).toHaveLength(3);
  });
});
