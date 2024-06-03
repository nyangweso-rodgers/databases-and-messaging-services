# PostgreSQL

## Table Of Contents

# Introduction to PostgreSQL

- **PostgreSQL** is an free open-source database system that supports both relational (SQL) and non-relational (JSON) queries.



# Connecting to the PostgreSQL database

- Two most common ways to connect to the PostgreSQL database include:
  1. SQL Shell (psql), and
  2. pgAdmin 4
- Both of them comes with the installation of PostgreSQL

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

## Connect to PostgreSQL #2: pgAdmin4

# Resources

1. [w3schools - PostgreSQL Tutorial](https://www.w3schools.com/postgresql/postgresql_intro.php)
