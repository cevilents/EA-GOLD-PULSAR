export interface ClaimFields {
  name: string;
  email: string;
  telegram: string;
  account: string;
}

export type FieldErrors = Partial<Record<keyof ClaimFields, string>>;

export type ClaimValidationResult =
  | { ok: true; value: ClaimFields }
  | { ok: false; errors: FieldErrors };

const NAME_MIN = 2;
const NAME_MAX = 60;
const EMAIL_MAX = 120;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEGRAM_PATTERN = /^[a-zA-Z0-9_]{4,32}$/;
const ACCOUNT_PATTERN = /^\d{5,12}$/;

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

export function validateClaim(raw: unknown): ClaimValidationResult {
  const record = asRecord(raw);
  if (!record) {
    return { ok: false, errors: { name: "Data tidak valid." } };
  }

  if (readString(record, "website").length > 0) {
    return { ok: false, errors: { name: "Data tidak valid." } };
  }

  const errors: FieldErrors = {};
  const name = readString(record, "name")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\x60/g, "'")
    .trim();
  const email = readString(record, "email")
    .trim()
    .toLowerCase();
  const telegramRaw = readString(record, "telegram").trim();
  const account = readString(record, "account").trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = "Nama harus 2–60 karakter.";
  }

  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    errors.email = "Email tidak valid.";
  }

  let telegram = "";
  if (telegramRaw.length > 0) {
    telegram = telegramRaw.startsWith("@") ? telegramRaw.slice(1) : telegramRaw;
    if (!TELEGRAM_PATTERN.test(telegram)) {
      errors.telegram = "Username Telegram tidak valid.";
    }
  }

  if (!ACCOUNT_PATTERN.test(account)) {
    errors.account = "Nomor akun harus 5–12 angka tanpa karakter lain.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { name, email, telegram, account } };
}
