const issuer = () => process.env.ZITADEL_ISSUER?.replace(/\/$/, "");

const managementBaseUrl = () =>
  process.env.ZITADEL_MANAGEMENT_API_URL || `${issuer()}/management/v1`;

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

const managementRequest = async (path, options = {}) => {
  const token = await getManagementToken();
  const response = await fetch(`${managementBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = new Error("Zitadel a refusé la demande de gestion.");
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
};

export const createHumanUser = ({ email, pseudo, password }) =>
  managementRequest("/users/human", {
    method: "POST",
    body: JSON.stringify({
      userName: pseudo,
      profile: { firstName: pseudo, lastName: pseudo, displayName: pseudo },
      email: { email, isEmailVerified: false },
      initialPassword: { password, changeRequired: false },
    }),
  });

export const sendEmailVerification = (subject) =>
  managementRequest(`/users/${subject}/email/_resend_verification`, {
    method: "POST",
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
