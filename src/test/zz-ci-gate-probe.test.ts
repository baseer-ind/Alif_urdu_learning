import { describe, expect, it } from "vitest";
// TEMPORARY: proves the CI gate blocks deploy on a red suite. Reverted in the next commit.
describe("ci gate probe", () => {
  it("intentionally fails", () => {
    expect(1).toBe(2);
  });
});
