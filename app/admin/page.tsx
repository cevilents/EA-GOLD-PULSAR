"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type ClaimStatus = "pending" | "approved" | "rejected";
type Tab = "klaim" | "pendaftar";

interface ClaimRow {
  issueNumber: number;
  name: string;
  email: string;
  telegram: string;
  account: string;
  updatedAt: string;
  status: ClaimStatus;
}

interface ClientRow {
  uid: string;
  country: string;
  regDate: string;
  depositAmount: number;
  balance: number;
  ftdReceived: boolean;
  volumeMlnUsd: number;
  status: string;
}

const STATUS_BADGE: Record<ClaimStatus, string> = {
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  approved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  rejected: "border-red-500/40 bg-red-500/10 text-red-300"
};

const STATUS_LABEL: Record<ClaimStatus, string> = {
  pending: "Pending",
  approved: "Disetujui",
  rejected: "Ditolak"
};

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function strField(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function numField(record: Record<string, unknown>, key: string): number {
  const value = Number(record[key]);
  return Number.isFinite(value) ? value : 0;
}

function asClaimRows(payload: unknown): ClaimRow[] {
  if (typeof payload !== "object" || payload === null) return [];
  const claims = (payload as Record<string, unknown>)["claims"];
  if (!Array.isArray(claims)) return [];
  const rows: ClaimRow[] = [];
  for (const item of claims) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    const status = record["status"];
    if (
      strField(record, "account") === "" ||
      (status !== "pending" && status !== "approved" && status !== "rejected")
    ) {
      continue;
    }
    rows.push({
      issueNumber: numField(record, "issueNumber"),
      name: strField(record, "name"),
      email: strField(record, "email"),
      telegram: strField(record, "telegram"),
      account: strField(record, "account"),
      updatedAt: strField(record, "updatedAt"),
      status
    });
  }
  return rows;
}

function asClientRows(payload: unknown): ClientRow[] {
  if (typeof payload !== "object" || payload === null) return [];
  const clients = (payload as Record<string, unknown>)["clients"];
  if (!Array.isArray(clients)) return [];
  const rows: ClientRow[] = [];
  for (const item of clients) {
    if (typeof item !== "object" || item === null) continue;
    const record = item as Record<string, unknown>;
    rows.push({
      uid: strField(record, "uid"),
      country: strField(record, "country"),
      regDate: strField(record, "regDate"),
      depositAmount: numField(record, "depositAmount"),
      balance: numField(record, "balance"),
      ftdReceived: Boolean(record["ftdReceived"]),
      volumeMlnUsd: numField(record, "volumeMlnUsd"),
      status: strField(record, "status")
    });
  }
  return rows;
}

function errorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "object" && payload !== null) {
    const value = (payload as Record<string, unknown>)["error"];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return fallback;
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString("id-ID");
}

function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

const thClass =
  "whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500";
const tdClass = "whitespace-nowrap px-3 py-2.5 text-zinc-300";

export default function AdminPage() {
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("klaim");

  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState("");

  const [clients, setClients] = useState<ClientRow[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const [clientsLoaded, setClientsLoaded] = useState(false);

  const [busyAccount, setBusyAccount] = useState("");

  const loadClaims = useCallback(async (): Promise<boolean> => {
    setClaimsLoading(true);
    setClaimsError("");
    try {
      const response = await fetch("/api/admin/claims");
      const payload = await readJson(response);
      if (response.status === 401) {
        setAuthed(false);
        return false;
      }
      if (!response.ok) {
        setClaimsError(errorMessage(payload, "Gagal memuat klaim."));
        return false;
      }
      setClaims(asClaimRows(payload));
      return true;
    } catch {
      setClaimsError("Tidak dapat terhubung ke server.");
      return false;
    } finally {
      setClaimsLoading(false);
    }
  }, []);

  const loadClients = useCallback(async (): Promise<void> => {
    setClientsLoading(true);
    setClientsError("");
    try {
      const response = await fetch("/api/admin/clients");
      const payload = await readJson(response);
      if (response.status === 401) {
        setAuthed(false);
        return;
      }
      if (!response.ok) {
        setClientsError(errorMessage(payload, "Gagal mengambil data pendaftar."));
        return;
      }
      setClients(asClientRows(payload));
      setClientsLoaded(true);
    } catch {
      setClientsError("Tidak dapat terhubung ke server.");
    } finally {
      setClientsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/admin/claims");
        const payload = await readJson(response);
        if (cancelled) return;
        if (response.ok) {
          setClaims(asClaimRows(payload));
          setAuthed(true);
        }
      } catch {
        setAuthed(false);
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!authed || tab !== "pendaftar" || clientsLoaded) return;
    void loadClients();
  }, [authed, tab, clientsLoaded, loadClients]);

  async function handleLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (response.ok) {
        setPassword("");
        setAuthed(true);
        await loadClaims();
      } else {
        setLoginError(errorMessage(await readJson(response), "Password salah."));
      }
    } catch {
      setLoginError("Tidak dapat terhubung ke server.");
    } finally {
      setLoggingIn(false);
    }
  }

  function resetState(): void {
    setAuthed(false);
    setTab("klaim");
    setClaims([]);
    setClients([]);
    setClientsLoaded(false);
    setPassword("");
    setLoginError("");
  }

  async function handleLogout(): Promise<void> {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      resetState();
    }
  }

  async function handleAction(account: string, action: "approve" | "reject"): Promise<void> {
    const confirmed = window.confirm(
      action === "approve" ? `Setujui klaim ${account}?` : `Tolak ${account}?`
    );
    if (!confirmed) return;
    setBusyAccount(account);
    try {
      const response = await fetch("/api/admin/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account, action })
      });
      if (response.status === 401) {
        setAuthed(false);
        return;
      }
      if (!response.ok) {
        setClaimsError(errorMessage(await readJson(response), "Gagal memperbarui klaim."));
      }
    } catch {
      setClaimsError("Tidak dapat terhubung ke server.");
    } finally {
      setBusyAccount("");
      await loadClaims();
    }
  }

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-zinc-500">Memuat…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={(e) => void handleLogin(e)}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8"
          noValidate
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-gold-light to-gold-deep font-display text-lg font-bold text-ink">
            GP
          </div>
          <h1 className="mt-4 text-center font-display text-xl font-bold text-white">
            Admin GoldPulsarEA
          </h1>
          <p className="mt-1 text-center text-sm text-zinc-500">
            Masuk untuk mengelola klaim dan pendaftar.
          </p>
          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            />
          </label>
          {loginError && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300"
            >
              {loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={loggingIn || password.length === 0}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep py-3 text-sm font-bold text-ink transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingIn ? "Memeriksa…" : "Masuk"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-white">
          Admin <span className="text-gold">GoldPulsarEA</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setTab("klaim")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                tab === "klaim"
                  ? "bg-gradient-to-r from-gold-light to-gold-deep text-ink"
                  : "text-zinc-400 enabled:hover:text-white"
              }`}
            >
              Klaim
            </button>
            <button
              type="button"
              onClick={() => setTab("pendaftar")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                tab === "pendaftar"
                  ? "bg-gradient-to-r from-gold-light to-gold-deep text-ink"
                  : "text-zinc-400 enabled:hover:text-white"
              }`}
            >
              Pendaftar
            </button>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-zinc-300 transition enabled:hover:border-red-500/40 enabled:hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </header>

      {tab === "klaim" ? (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-white">Daftar Klaim</h2>
            <button
              type="button"
              onClick={() => void loadClaims()}
              disabled={claimsLoading}
              className="rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-bold text-gold-light transition enabled:hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {claimsLoading ? "Memuat…" : "Refresh"}
            </button>
          </div>

          {claimsError && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-red-500/25 bg-red-500/[0.07] px-4 py-3 text-sm text-red-300"
            >
              {claimsError}
            </p>
          )}

          {claims.length === 0 && !claimsLoading ? (
            <p className="py-10 text-center text-sm text-zinc-500">Belum ada klaim masuk.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className={thClass}>Waktu</th>
                    <th className={thClass}>Nama</th>
                    <th className={thClass}>Email</th>
                    <th className={thClass}>Telegram</th>
                    <th className={thClass}>Akun</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.issueNumber} className="border-b border-white/5">
                      <td className={tdClass}>{formatTime(claim.updatedAt)}</td>
                      <td className={`${tdClass} font-semibold text-white`}>{claim.name}</td>
                      <td className={tdClass}>{claim.email}</td>
                      <td className={tdClass}>{claim.telegram === "" ? "–" : claim.telegram}</td>
                      <td className={`${tdClass} font-mono`}>{claim.account}</td>
                      <td className={tdClass}>
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[claim.status]}`}
                        >
                          {STATUS_LABEL[claim.status]}
                        </span>
                      </td>
                      <td className={tdClass}>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => void handleAction(claim.account, "approve")}
                            disabled={busyAccount !== ""}
                            className="rounded-lg border border-emerald-500/40 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition enabled:hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {busyAccount === claim.account ? "…" : "Setujui"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleAction(claim.account, "reject")}
                            disabled={busyAccount !== ""}
                            className="rounded-lg border border-red-500/40 px-2.5 py-1 text-xs font-semibold text-red-300 transition enabled:hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-white">Daftar Pendaftar Exness</h2>
            <button
              type="button"
              onClick={() => void loadClients()}
              disabled={clientsLoading}
              className="rounded-lg border border-gold/40 px-3 py-1.5 text-xs font-bold text-gold-light transition enabled:hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {clientsLoading ? "Memuat…" : "Refresh"}
            </button>
          </div>

          {clientsError && (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p role="alert" className="text-sm text-red-300">
                {clientsError}
              </p>
              <button
                type="button"
                onClick={() => void loadClients()}
                disabled={clientsLoading}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-zinc-300 enabled:hover:text-white disabled:opacity-50"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {clients.length === 0 && !clientsLoading ? (
            <p className="py-10 text-center text-sm text-zinc-500">Belum ada data pendaftar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className={thClass}>UID</th>
                    <th className={thClass}>Negara</th>
                    <th className={thClass}>Tgl Daftar</th>
                    <th className={thClass}>Deposit</th>
                    <th className={thClass}>Saldo</th>
                    <th className={thClass}>FTD</th>
                    <th className={thClass}>Vol (mln USD)</th>
                    <th className={thClass}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.uid} className="border-b border-white/5">
                      <td className={`${tdClass} font-mono`}>{client.uid}</td>
                      <td className={tdClass}>{client.country}</td>
                      <td className={tdClass}>{client.regDate}</td>
                      <td className={tdClass}>{formatNumber(client.depositAmount)}</td>
                      <td className={tdClass}>{formatNumber(client.balance)}</td>
                      <td className={tdClass}>
                        {client.ftdReceived ? (
                          <span className="text-emerald-400">✓</span>
                        ) : (
                          <span className="text-zinc-600">✗</span>
                        )}
                      </td>
                      <td className={tdClass}>{formatNumber(client.volumeMlnUsd)}</td>
                      <td className={tdClass}>{client.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
