-- GoTrue のマイグレーションは auth.* テーブルを作るが、スキーマ auth 自体は作らない。
CREATE SCHEMA IF NOT EXISTS auth;
