ALTER TABLE users
  ADD COLUMN zitadel_subject VARCHAR(255) NULL UNIQUE AFTER id,
  MODIFY COLUMN password VARCHAR(255) NULL;

CREATE TABLE signup_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip_hash CHAR(64) NOT NULL,
  attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX signup_attempts_ip_attempted_at (ip_hash, attempted_at)
);
