const issuer = () => process.env.ZITADEL_ISSUER?.replace(/\/$/, "");

const managementBaseUrl = () =>
  process.env.ZITADEL_MANAGEMENT_API_URL || `${issuer()}/management/v1`;

const usersBaseUrl = () => `${issuer()}/v2`;

const emailVerificationUrlTemplate = () =>
  process.env.ZITADEL_EMAIL_VERIFICATION_URL_TEMPLATE || undefined;

const getManagementToken = async () => {
  const tokenUrl = process.env.ZITADEL_TOKEN_URL || `${issuer()}/oauth/v2/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: process.env.ZITADEL_MANAGEMENT_SCOPE || "",
  });
  const credentials = Buffer.from(
    `${process.env.ZITADEL_SERVICE_CLIENT_ID || ""}:${process.env.ZITADEL_SERVICE_CLIENT_SECRET || ""}`
  ).toString("base64");
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!response.ok) throw new Error("Impossible d'obtenir le jeton du compte technique Zitadel.");
  return (await response.json()).access_token;
};

const authorizedRequest = async (baseUrl, path, options = {}) => {
  const token = await getManagementToken();
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const responseBody = await response.json().catch(() => ({}));
    const reason = responseBody.message || responseBody.error || response.statusText;
    const error = new Error(
      `Zitadel a refusé la demande de gestion (${response.status})${reason ? ` : ${reason}` : ""}.`
    );
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
};

const managementRequest = (path, options = {}) =>
  authorizedRequest(managementBaseUrl(), path, options);

const usersRequest = (path, options = {}) =>
  authorizedRequest(usersBaseUrl(), path, options);

export const createHumanUser = ({ email, pseudo, password }) =>
  usersRequest("/users/human", {
    method: "POST",
    body: JSON.stringify({
      username: pseudo,
      profile: { givenName: pseudo, familyName: pseudo, displayName: pseudo },
      email: {
        email,
        sendCode: emailVerificationUrlTemplate()
          ? { urlTemplate: emailVerificationUrlTemplate() }
          : {},
      },
      password: { password, changeRequired: false },
    }),
  });

export const verifyEmail = (userId, verificationCode) =>
  usersRequest(`/users/${encodeURIComponent(userId)}/email/verify`, {
    method: "POST",
    body: JSON.stringify({ verificationCode }),
  });

export const setUserActive = (subject, active) =>
  managementRequest(`/users/${subject}/${active ? "reactivate" : "deactivate"}`, {
    method: "POST",
  });

export const setProjectRole = async (subject, role) => {
  if (!["user", "moderator", "admin"].includes(role)) {
    const error = new Error("Rôle non autorisé.");
    error.status = 400;
    throw error;
  }

  const grants = await managementRequest("/users/grants/_search", {
    method: "POST",
    body: JSON.stringify({ query: { userIdQuery: { userId: subject } } }),
  });
  const projectGrants = (grants.result || []).filter(
    (grant) => grant.projectId === process.env.ZITADEL_PROJECT_ID
  );
  await Promise.all(
    projectGrants.map((grant) =>
      managementRequest(`/users/grants/${grant.id}`, { method: "DELETE" })
    )
  );

  return managementRequest(`/users/${subject}/grants`, {
    method: "POST",
    body: JSON.stringify({
      projectId: process.env.ZITADEL_PROJECT_ID,
      roleKeys: [role],
    }),
  });
};
export const assignProjectRole = (subject, role) => {
  if (!['user', 'moderator', 'admin'].includes(role)) {
    const error = new Error('Rôle non autorisé.');
    error.status = 400;
    throw error;
  }

  return managementRequest(`/users/${subject}/grants`, {
    method: "POST",
    body: JSON.stringify({
      projectId: process.env.ZITADEL_PROJECT_ID,
      roleKeys: [role],
    }),
  });
};
