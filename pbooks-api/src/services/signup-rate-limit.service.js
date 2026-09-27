import crypto from "crypto";
import pool from "../config/db.js";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const hashIp = (ip, secret) =>
  crypto.createHmac("sha256", secret).update(ip).digest("hex");

export const assertSignupRateLimit = async (ip) => {
  const secret = process.env.SIGNUP_IP_HASH_KEY;
  if (!secret) throw new Error("SIGNUP_IP_HASH_KEY est requis.");

  const ipHash = hashIp(ip, secret);
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS attempts
     FROM signup_attempts
     WHERE ip_hash = ? AND attempted_at >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 HOUR)`,
    [ipHash]
  );

  if (rows[0].attempts >= MAX_ATTEMPTS) {
    const error = new Error("Trop de tentatives d'inscription. Réessayez dans une heure.");
    error.status = 429;
    throw error;
  }

  await pool.execute("INSERT INTO signup_attempts (ip_hash) VALUES (?)", [ipHash]);
  await pool.execute(
    "DELETE FROM signup_attempts WHERE attempted_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 HOUR)"
  );
};
