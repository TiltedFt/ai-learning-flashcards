-- выполняется под суперпользователем POSTGRES_USER=postgres

-- роль приложения
CREATE ROLE app WITH LOGIN PASSWORD 'app' CREATEDB;

-- базы приложения
CREATE DATABASE flashcards OWNER app;
CREATE DATABASE flashcards_shadow OWNER app;

-- расширения и права в основной БД
\connect flashcards
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER SCHEMA public OWNER TO app;

-- расширения и права в shadow-БД
\connect flashcards_shadow
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER SCHEMA public OWNER TO app;
