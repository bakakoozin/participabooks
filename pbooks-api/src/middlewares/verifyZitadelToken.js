import { createRemoteJWKSet, jwtVerify } from "jose";
import User from "../models/users.model.js";

const issuer = () => process.env.ZITADEL_ISSUER?.replace(/\/$/, "");
let jwks;
const getJwks = () => {
  if (!jwks) {
    jwks = createRemoteJWKSet(
      new URL(process.env.ZITADEL_JWKS_URI || `${issuer()}/oauth/v2/keys`)
    );
  }
  return jwks;
};

const getRoleClaim = (payload) => {
  const claimName = process.env.ZITADEL_ROLE_CLAIM ||
    `urn:zitadel:iam:org:project:${process.env.ZITADEL_PROJECT_ID}:roles`;
  const roles = payload[claimName] || {};
  return ["admin", "moderator", "user"].find((role) => roles[role]) || "user";
};

const getUserInfo = async (accessToken) => {
  const response = await fetch(
    process.env.ZITADEL_USERINFO_URL || `${issuer()}/oidc/v1/userinfo`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!response.ok) throw new Error("Impossible de récupérer le profil Zitadel.");
  return response.json();
};

const attachLocalUser = async ({ subject, email, pseudo, role }) => {
  let user = await User.findByZitadelSubject(subject);
  if (user) return { ...user, role };

  user = await User.findUnlinkedByEmail(email);
  if (user) {
    await User.attachZitadelSubject(user.id, subject);
    return { ...user, zitadel_subject: subject, role };
  }

  const id = await User.createZitadelUser({ subject, email, pseudo });
  return User.findById(id).then((created) => ({ ...created, role }));
};

export default (required = true) => async (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    if (!required) return next();
    return res.status(401).json({ error: "Accès refusé : jeton Bearer manquant." });
  }

  try {
    const accessToken = authorization.slice("Bearer ".length);
    const { payload } = await jwtVerify(accessToken, getJwks(), {
      issuer: issuer(),
      audience: process.env.ZITADEL_API_AUDIENCE,
    });
    const profile = await getUserInfo(accessToken);
    if (!profile.email_verified || !profile.email || !profile.preferred_username) {
      return res.status(403).json({ error: "Votre adresse e-mail Zitadel doit être vérifiée." });
    }

    req.user = await attachLocalUser({
      subject: payload.sub,
      email: profile.email.toLowerCase(),
      pseudo: profile.preferred_username,
      role: getRoleClaim(payload),
    });
    req.auth = { subject: payload.sub, claims: payload };
    return next();
  } catch (error) {
    console.error("Vérification Zitadel impossible:", error.message);
    return res.status(401).json({ error: "Jeton Zitadel invalide ou expiré." });
  }
};
