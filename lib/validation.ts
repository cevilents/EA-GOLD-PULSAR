export interface ClaimFields {
  name: string;
  whatsapp: string;
  account: string;
}

export type FieldErrors = Partial<Record<keyof ClaimFields, string>>;

export type ClaimValidationResult =
  | { ok: true; value: ClaimFields }
  | { ok: false; errors: FieldErrors };

const NAME_MIN = 2;
const NAME_MAX = 60;

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  return raw as Record<string, unknown>;
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function normalizeWhatsapp(value: string): string {
  const cleaned = value.replace(/[\s-]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  return `+${cleaned}`;
}

function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
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
  const name = readString(record, "name").trim();
  const whatsappRaw = readString(record, "whatsapp").trim();
  const account = readString(record, "account").trim();

  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = "Nama harus 2–60 karakter.";
  }

  const whatsapp = normalizeWhatsapp(whatsappRaw);
  if (!/^\+\d+$/.test(whatsapp) || countDigits(whatsapp) < 9 || countDigits(whatsapp) > 16) {
    errors.whatsapp = "Nomor WhatsApp tidak valid (9–16 digit).";
  }

  if (!/^\d{5,12}$/.test(account)) {
    errors.account = "Nomor akun harus 5–12 angka tanpa karakter lain.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { name, whatsapp, account } };
}
