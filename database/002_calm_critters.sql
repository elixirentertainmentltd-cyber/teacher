-- Optional pre-provisioning. The authenticated scene editor creates this table on first save.
CREATE TABLE IF NOT EXISTS tml_calm_scenes (
 id VARCHAR(64) PRIMARY KEY,
 definition JSON NOT NULL,
 published BOOLEAN NOT NULL DEFAULT FALSE,
 revision INT UNSIGNED NOT NULL DEFAULT 1,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
