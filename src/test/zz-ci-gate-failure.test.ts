// TEMPORARY: deliberate failure to prove CI blocks deploy. Reverted before merge.
import { expect, test } from "vitest";

test("deliberate CI gate failure", () => {
  expect(1).toBe(2);
});
