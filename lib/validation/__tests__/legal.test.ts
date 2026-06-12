import { describe, it, expect } from "vitest";
import { AnalyzeLegalSchema } from "../legal";

describe("AnalyzeLegalSchema", () => {
  it("accepts valid input with required fields", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "onlyfans",
      clauses_checked: ["account_credentials", "commission_over_50"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty platform", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "",
      clauses_checked: ["account_credentials"],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.platform).toBeDefined();
    }
  });

  it("rejects empty clauses_checked array", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "onlyfans",
      clauses_checked: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.clauses_checked).toBeDefined();
    }
  });

  it("rejects missing clauses_checked", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "onlyfans",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing platform", () => {
    const result = AnalyzeLegalSchema.safeParse({
      clauses_checked: ["account_credentials"],
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional other_clause_text", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "onlyfans",
      clauses_checked: ["other"],
      other_clause_text: "Ma clause personnalisée",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional agency_name", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "mym",
      clauses_checked: ["non_compete"],
      agency_name: "Super Agence",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional language", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "fansly",
      clauses_checked: ["auto_renewal"],
      language: "en",
    });
    expect(result.success).toBe(true);
  });

  it("rejects platform as number", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: 123,
      clauses_checked: ["account_credentials"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects clauses_checked as string", () => {
    const result = AnalyzeLegalSchema.safeParse({
      platform: "onlyfans",
      clauses_checked: "not-an-array",
    });
    expect(result.success).toBe(false);
  });

  it("infers correct type", () => {
    const input = {
      platform: "onlyfans",
      clauses_checked: ["clause_1"],
      other_clause_text: "test",
    };
    const parsed = AnalyzeLegalSchema.parse(input);
    expect(parsed.platform).toBe("onlyfans");
    expect(parsed.clauses_checked).toEqual(["clause_1"]);
    expect(parsed.other_clause_text).toBe("test");
    // agency_name should be undefined since not provided
    expect(parsed.agency_name).toBeUndefined();
  });
});
