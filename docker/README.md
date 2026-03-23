# Docker（Postgres + Supabase Auth）

- [`docker-compose.postgres.yml`](docker-compose.postgres.yml) — 公式 Postgres（`public` / `auth`）
- [`docker-compose.supabase.yml`](docker-compose.supabase.yml) — GoTrue + Kong（`/auth/v1`）

キー生成・Auth 設定は [Supabase self-hosting](https://supabase.com/docs/guides/self-hosting/docker) を参照。

本番で DB ロールを分ける場合は `GOTRUE_DB_DATABASE_URL` などを別途設定する。

旧 `supabase/postgres` からの切り替え時は **`volumes/db/data` を削除**するか `reset.sh` を実行してから起動する。
