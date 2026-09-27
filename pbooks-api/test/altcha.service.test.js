import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { createChallenge, verifySolution } from "../src/services/altcha.service.js";

const solve = (challenge) => {
  for (let number = 0; number <= challenge.maxnumber; number += 1) {
    const hash = crypto
      .createHash("sha256")
      .update(`${challenge.salt}${number}${challenge.nonce}`)
      .digest("hex");
    if (hash === challenge.challenge) return number;
  }
  throw new Error("Défi sans solution");
};

test("accepte une preuve de travail signée et correcte", () => {
  const secret = "test-secret";
  const challenge = createChallenge({ secret, maxNumber: 20, now: 1000 });
  const number = solve(challenge);

  assert.equal(
    verifySolution({ payload: { signature: challenge.signature, number }, secret, now: 1001 }),
    true
  );
});

test("refuse une preuve modifiée ou expirée", () => {
  const secret = "test-secret";
  const challenge = createChallenge({ secret, maxNumber: 20, expiresInMs: 10, now: 1000 });
  const number = solve(challenge);

  assert.equal(
    verifySolution({ payload: { signature: challenge.signature, number: number + 1 }, secret, now: 1001 }),
    false
  );
  assert.equal(
    verifySolution({ payload: { signature: challenge.signature, number }, secret, now: 1011 }),
    false
  );
});
