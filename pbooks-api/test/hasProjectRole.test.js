import assert from "node:assert/strict";
import test from "node:test";
import hasProjectRole from "../src/middlewares/hasProjectRole.js";

const createResponse = () => {
  const result = { statusCode: null, body: null };
  return {
    result,
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(body) {
      result.body = body;
      return this;
    },
  };
};

test("autorise les rôles moderator et admin", () => {
  for (const role of ["moderator", "admin"]) {
    const res = createResponse();
    let called = false;
    hasProjectRole("moderator", "admin")({ user: { role } }, res, () => {
      called = true;
    });
    assert.equal(called, true);
    assert.equal(res.result.statusCode, null);
  }
});

test("refuse un rôle non autorisé", () => {
  const res = createResponse();
  let called = false;
  hasProjectRole("admin")({ user: { role: "user" } }, res, () => {
    called = true;
  });
  assert.equal(called, false);
  assert.equal(res.result.statusCode, 403);
});
