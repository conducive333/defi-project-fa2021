#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE test;
    CREATE ROLE testuser WITH SUPERUSER LOGIN PASSWORD 'password';
    GRANT ALL PRIVILEGES ON DATABASE test TO testuser;
EOSQL