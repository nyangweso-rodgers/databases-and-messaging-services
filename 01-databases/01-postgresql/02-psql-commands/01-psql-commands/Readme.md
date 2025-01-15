# `psql` Commands

## Table Of Contents

# `psql` Commands

- To execute an SQL query, simply type it at the prompt followed by a semicolon (`;`), and hit enter

# Connecting to a Postgres Docker Container

- To connect to a **PostgreSQL** instance running within a **Docker container**, you can use the `docker exec` command combined with the `psql` command:
  ```bash
    docker exec -it <container> psql -U <username>
  ```
- Example:
  ```sh
    docker exec -it postgres psql -U admin -d test_db
  ```