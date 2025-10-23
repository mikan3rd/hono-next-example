-- Revoke anon access in application schema `public`
REVOKE USAGE ON SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Revoke authenticated access in application schema `public`
REVOKE USAGE ON SCHEMA public FROM authenticated;
REVOKE ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public FROM authenticated;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;

-- Ensure future objects created in `public` do not grant to anon by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;

-- Ensure future objects created in `public` do not grant to authenticated by default
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES    FROM authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM authenticated;
