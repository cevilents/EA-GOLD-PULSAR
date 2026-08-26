import { describe, expect, it } from "vitest";
import { dictionaries, type Locale } from "./i18n";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function asJson(value: unknown): JsonValue {
  if (value === null) return null;
  const kind = typeof value;
  if (kind === "string" || kind === "number" || kind === "boolean") {
    return value as string | number | boolean;
  }
  if (Array.isArray(value)) {
    return value.map((item) => asJson(item));
  }
  if (kind === "object") {
    const record = value as Record<string, unknown>;
    const entries = Object.keys(record).map(
      (key) => [key, asJson(record[key])] as [string, JsonValue]
    );
    return Object.fromEntries(entries);
  }
  throw new Error(`Unexpected runtime value: ${String(value)}`);
}

function collectPaths(value: JsonValue, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectPaths(item, `${prefix}[${index}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.keys(value).flatMap((key) =>
      collectPaths(value[key], prefix === "" ? key : `${prefix}.${key}`)
    );
  }
  return [prefix];
}

function compareTypes(a: JsonValue, b: JsonValue, path: string): string[] {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return [`array mismatch at ${path}`];
    }
    return a.flatMap((item, index) => compareTypes(item, b[index], `${path}[${index}]`));
  }
  if (
    a !== null &&
    b !== null &&
    typeof a === "object" &&
    typeof b === "object"
  ) {
    return Object.keys(a).flatMap((key) =>
      compareTypes(a[key], b[key], path === "" ? key : `${path}.${key}`)
    );
  }
  return typeof a === typeof b ? [] : [`leaf type mismatch at ${path}`];
}

function dictionaryOf(locale: Locale): JsonValue {
  return asJson(dictionaries[locale]);
}

describe("i18n dictionary parity", () => {
  const idDict = dictionaryOf("id");
  const enDict = dictionaryOf("en");
  const idPaths = collectPaths(idDict).sort();
  const enPaths = collectPaths(enDict).sort();

  it("exposes identical key paths in both locales", () => {
    expect(enPaths).toEqual(idPaths);
  });

  it("matches leaf value types across locales", () => {
    expect(compareTypes(idDict, enDict, "")).toEqual([]);
  });

  it("keeps faq item count aligned", () => {
    expect(dictionaries.en.faq.items.length).toBe(dictionaries.id.faq.items.length);
    expect(dictionaries.id.faq.items.length).toBe(6);
  });

  it("keeps tutorial step count aligned", () => {
    expect(dictionaries.en.tutorial.steps.length).toBe(dictionaries.id.tutorial.steps.length);
    expect(dictionaries.id.tutorial.steps.length).toBe(5);
  });
});
