# Connecting to the PostgreSQL Database

- Two most common ways to connect to the **PostgreSQL database** include:
  1. SQL Shell (psql), and
  2. pgAdmin 4
- Both of them comes with the installation of **PostgreSQL**

## Connect to PostgreSQL #1: SQL Shell (psql)

- SQL Shell (`psql`) is a terminal based program where you can write and execute SQL syntax in the command-line terminal.
- Once you have connected to the database, you can start executing SQL statements.
- Our database is empty, so we cannot query any tables yet, but we can check the version with this SQL statement:

  ```sh
    # check the version
    SELECT version();
  ```

- Remark:
  - Always end SQL statements with a semicolon `;` as SQL Shell waits for the semicolon and executes all lines as one SQL statement.

## Connecting pgAdmin to Postgres

- Where:
  - `PGADMIN_DEFAULT_EMAIL` is used to create a new user account on **pgAdmin**.
  - `PGADMIN_DEFAULT_PASSWORD` is used as a password for the user account identified by `PGADMIN_DEFAULT_EMAIL`.
