# Docker (Postgres + Supabase Auth)

Compose stack:

- **postgres** — official image; Drizzle と GoTrue の両方が **`POSTGRES_USER`**（既定 `postgres`）で接続し、アプリは `public`、Auth は `auth` スキーマを使う。
- **GoTrue** — authentication API。
- **Kong** — `{API_EXTERNAL_URL}/auth/v1/*` を `@supabase/supabase-js` 向けに公開。

See [Supabase self-hosting](https://supabase.com/docs/guides/self-hosting/docker) for key generation and Auth options.

本番で Auth 用 DB ロールをアプリ用と分けたい場合は、専用ロールと `GOTRUE_DB_DATABASE_URL` を別途設定する。

Switching from the old `supabase/postgres` image: **remove `volumes/db/data`** (or run `reset.sh`) before first boot on the new image.
