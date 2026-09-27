import crypto from "crypto";

const DEFAULT_MAX_NUMBER = 100_000;
const DEFAULT_EXPIRES_IN_MS = 5 * 60 * 1000;

const encode = (value) => Buffer.from(value).toString("base64url");

const sign = (value, secret) =>
  crypto.createHmac("sha256", secret).update(value).digest("base64url");

export const createChallenge = ({
  secret,
  maxNumber = DEFAULT_MAX_NUMBER,
  expiresInMs = DEFAULT_EXPIRES_IN_MS,
  now = Date.now(),
} = {}) => {
  if (!secret) throw new Error("ALTCHA_HMAC_KEY est requis.");

  const salt = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");
  const solution = crypto.randomInt(maxNumber + 1);
  const payload = {
    algorithm: "SHA-256",
    challenge: crypto
      .createHash("sha256")
      .update(`${salt}${solution}${nonce}`)
      .digest("hex"),
    salt,
    nonce,
    maxnumber: maxNumber,
    expires: now + expiresInMs,
  };
  const encodedPayload = encode(JSON.stringify(payload));

  return {
    ...payload,
    signature: `${encodedPayload}.${sign(encodedPayload, secret)}`,
  };
};

export const verifySolution = ({ payload, secret, now = Date.now() }) => {
  if (!secret || !payload?.signature || !Number.isInteger(payload.number)) return false;

  const [encodedPayload, providedSignature] = payload.signature.split(".");
  if (!encodedPayload || !providedSignature) return false;

  const expectedSignature = sign(encodedPayload, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(providedSignature);
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return false;
  }

  try {
    const challenge = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
    if (
      challenge.algorithm !== "SHA-256" ||
      now > challenge.expires ||
      payload.number < 0 ||
      payload.number > challenge.maxnumber
    ) {
      return false;
    }

    const hash = crypto
      .createHash("sha256")
      .update(`${challenge.salt}${payload.number}${challenge.nonce}`)
      .digest("hex");
    return hash === challenge.challenge;
  } catch {
    return false;
  }
};
