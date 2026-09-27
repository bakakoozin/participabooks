import assert from "node:assert/strict";
import test from "node:test";
import { ensureDefaultProjectRole } from "../src/services/zitadel.service.js";

const response = (body) => ({
  ok: true,
  status: 200,
  json: async () => body,
});

test("attribue user seulement quand le projet ne possède encore aucun rôle", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalEnv = {
    issuer: process.env.ZITADEL_ISSUER,
    projectId: process.env.ZITADEL_PROJECT_ID,
    clientId: process.env.ZITADEL_SERVICE_CLIENT_ID,
    clientSecret: process.env.ZITADEL_SERVICE_CLIENT_SECRET,
  };
  process.env.ZITADEL_ISSUER = "https://zitadel.test";
  process.env.ZITADEL_PROJECT_ID = "participabooks-project";
  process.env.ZITADEL_SERVICE_CLIENT_ID = "service-client";
  process.env.ZITADEL_SERVICE_CLIENT_SECRET = "service-secret";
  t.after(() => {
    globalThis.fetch = originalFetch;
    process.env.ZITADEL_ISSUER = originalEnv.issuer;
    process.env.ZITADEL_PROJECT_ID = originalEnv.projectId;
    process.env.ZITADEL_SERVICE_CLIENT_ID = originalEnv.clientId;
    process.env.ZITADEL_SERVICE_CLIENT_SECRET = originalEnv.clientSecret;
  });

  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    if (url.endsWith("/oauth/v2/token")) return response({ access_token: "token" });
    if (url.endsWith("/users/grants/_search")) {
      return response({ result: [] });
    }
    if (url.endsWith("/users/user-1/grants")) return response({});
    throw new Error(`Appel inattendu: ${url}`);
  };

  assert.equal(await ensureDefaultProjectRole("user-1"), true);
  const assignment = calls.find((call) => call.url.endsWith("/users/user-1/grants"));
  assert.deepEqual(JSON.parse(assignment.options.body), {
    projectId: "participabooks-project",
    roleKeys: ["user"],
  });

  calls.length = 0;
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    if (url.endsWith("/oauth/v2/token")) return response({ access_token: "token" });
    if (url.endsWith("/users/grants/_search")) {
      return response({ result: [{ projectId: "participabooks-project", roleKeys: ["moderator"] }] });
    }
    throw new Error(`Appel inattendu: ${url}`);
  };

  assert.equal(await ensureDefaultProjectRole("user-1"), false);
  assert.equal(calls.some((call) => call.url.endsWith("/users/user-1/grants")), false);
});
