import { describe, it, expect } from "vitest";
import { calculateRisk, getClauseById } from "../scoring";
import { CLAUSE_GROUPS } from "../clauses-data";

const allClauses = CLAUSE_GROUPS.flatMap((g) => g.clauses);
const allIds = allClauses.map((c) => c.id);

describe("calculateRisk", () => {
  it("returns low risk for no clauses", () => {
    const report = calculateRisk([], ["onlyfans"]);
    expect(report.riskScore.level).toBe("low");
    expect(report.riskScore.total).toBe(0);
    expect(report.riskScore.percent).toBe(0);
    expect(report.analyzedClauses).toHaveLength(0);
    expect(report.platforms).toEqual(["onlyfans"]);
  });

  it("returns low risk for minor clauses (total ≤ 7)", () => {
    // hidden_fees=4, auto_renewal=3 → 7 → round(7/30*100)=23% → low
    const report = calculateRisk(
      ["hidden_fees", "auto_renewal"],
      ["onlyfans"],
    );
    expect(report.riskScore.level).toBe("low");
    expect(report.riskScore.percent).toBe(23);
  });

  it("returns moderate risk for mid-tier clauses (total 8-15)", () => {
    // 5 + 4 + 4 = 13 → round(13/30*100) = 43% → moderate
    const report = calculateRisk(
      ["account_credentials", "dm_access", "payment_withholding"],
      ["fansly"],
    );
    expect(report.riskScore.level).toBe("moderate");
    expect(report.riskScore.percent).toBe(43);
  });

  it("returns high risk for concerning clauses (total 16-22)", () => {
    // 5 + 5 + 5 + 5 = 20 → round(20/30*100) = 67% → high
    const report = calculateRisk(
      ["account_credentials", "password_locked", "commission_over_50", "agency_holds_rights"],
      ["mym"],
    );
    expect(report.riskScore.level).toBe("high");
    expect(report.riskScore.percent).toBe(67);
  });

  it("returns critical risk for severe clauses (total ≥ 23)", () => {
    // 5 + 5 + 5 + 5 + 5 = 25 → round(25/30*100) = 83% → critical
    const report = calculateRisk(
      ["account_credentials", "password_locked", "commission_over_50", "agency_holds_rights", "post_contract_image_use"],
      ["onlyfans"],
    );
    expect(report.riskScore.level).toBe("critical");
    expect(report.riskScore.percent).toBe(83);
  });

  it("caps percent at 100 for max possible severity", () => {
    const report = calculateRisk(allIds, ["onlyfans"]);
    expect(report.riskScore.percent).toBe(100);
    expect(report.riskScore.level).toBe("critical");
  });

  it("includes diagnosis text matching risk level", () => {
    const lowReport = calculateRisk([], ["onlyfans"]);
    expect(lowReport.diagnosis).toContain("équilibré");

    const criticalReport = calculateRisk(allIds, ["onlyfans"]);
    expect(criticalReport.diagnosis).toContain("immédiate");
  });

  it("returns analyzed clauses with explanations and reformulations", () => {
    const report = calculateRisk(["account_credentials"], ["onlyfans"]);
    expect(report.analyzedClauses).toHaveLength(1);
    expect(report.analyzedClauses[0].clause.id).toBe("account_credentials");
    expect(report.analyzedClauses[0].clause.severity).toBe(5);
    expect(report.analyzedClauses[0].explanation).toBeTruthy();
    expect(report.analyzedClauses[0].reformulation).toBeTruthy();
    expect(report.analyzedClauses[0].action).toBeTruthy();
  });

  it("handles duplicate clause IDs gracefully", () => {
    const report = calculateRisk(
      ["account_credentials", "account_credentials"],
      ["onlyfans"],
    );
    // Should only count unique matches from CLAUSE_GROUPS
    expect(report.analyzedClauses).toHaveLength(1);
  });

  it("handles unknown clause IDs silently", () => {
    const report = calculateRisk(
      ["non_existent_id"],
      ["onlyfans"],
    );
    expect(report.riskScore.total).toBe(0);
    expect(report.analyzedClauses).toHaveLength(0);
  });

  it("supports multiple platforms", () => {
    const report = calculateRisk([], ["onlyfans", "fansly", "mym"]);
    expect(report.platforms).toEqual(["onlyfans", "fansly", "mym"]);
  });

  it("returns consistent score for same inputs", () => {
    const ids = ["account_credentials", "commission_over_50", "non_compete"];
    const a = calculateRisk(ids, ["onlyfans"]);
    const b = calculateRisk(ids, ["onlyfans"]);
    expect(a.riskScore).toEqual(b.riskScore);
    expect(a.analyzedClauses).toEqual(b.analyzedClauses);
  });
});

describe("getClauseById", () => {
  it("returns the correct clause definition", () => {
    const clause = getClauseById("account_credentials");
    expect(clause).toBeTruthy();
    expect(clause!.id).toBe("account_credentials");
    expect(clause!.severity).toBe(5);
  });

  it("returns undefined for unknown id", () => {
    expect(getClauseById("unknown_id")).toBeUndefined();
  });
});
