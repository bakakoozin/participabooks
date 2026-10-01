import assert from "node:assert/strict";
import test from "node:test";
import {
  assignProjectRole,
  createHumanUser,
  sendEmailVerification,
} from "../src/services/zitadel.service.js";

const response = (body) => ({
  ok: true,
  status: 200,
  json: async () => body,
});

test("crée un utilisateur non vérifié, lui attribue user et envoie la vérification", async (t) => {
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
    if (url.endsWith("/users/human")) return response({ userId: "user-1" });
    if (url.endsWith("/users/user-1/grants")) return response({});
    if (url.endsWith("/users/user-1/email/_resend_verification")) return response({});
    throw new Error(`Appel inattendu: ${url}`);
  };

  const user = await createHumanUser({ email: "test@example.com", pseudo: "test", password: "Password1!" });
  assert.equal(user.userId, "user-1");
  await assignProjectRole(user.userId, "user");
  await sendEmailVerification(user.userId);

  const creation = calls.find((call) => call.url.endsWith("/users/human"));
  assert.deepEqual(JSON.parse(creation.options.body), {
    userName: "test",
    profile: { firstName: "test", lastName: "test", displayName: "test" },
    email: { email: "test@example.com", isEmailVerified: false },
    initialPassword: { password: "Password1!", changeRequired: false },
  });

  const assignment = calls.find((call) => call.url.endsWith("/users/user-1/grants"));
  assert.deepEqual(JSON.parse(assignment.options.body), {
    projectId: "participabooks-project",
    roleKeys: ["user"],
  });
  assert.ok(calls.some((call) => call.url.endsWith("/users/user-1/email/_resend_verification")));
  const tokenRequest = calls.find((call) => call.url.endsWith("/oauth/v2/token"));
  assert.match(tokenRequest.options.headers.Authorization, /^Basic /);
});
