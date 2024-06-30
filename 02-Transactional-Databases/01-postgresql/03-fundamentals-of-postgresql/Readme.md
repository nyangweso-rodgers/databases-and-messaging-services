# Fundamentals Of PostgreSQL

# Step 1: Setup Docker Compose

- Define postgreSQL instance:

  ```yml
  services:
    ############################################################################
    # postgres DB
    #
    postgres:
      image: postgres:latest
      container_name: postgres
      hostname: postgres
      restart: always
      ports:
        - "5432:5432"
      env_file:
        - .env
      environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      command: ["postgres", "-c", "wal_level=logical"]
      volumes:
        - postgres_volume:/var/lib/postgresql/data
      healthcheck:
      #test: ["CMD", "psql", "-U", "postgres", "-c", "SELECT 1"]
      test:
        [
          "CMD-SHELL",
          "PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -d ${POSTGRES_TEST_DB} -c 'SELECT 1'",
        ]
      interval: 10s
      timeout: 5s
      retries: 5
    ############################################################################
    # pgadmin
    #
    pgadmin:
      image: dpage/pgadmin4
      container_name: postgres-pgadmin
      ports:
        - "5050:80"
      env_file:
        - .env
      environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_DEFAULT_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_DEFAULT_PASSWORD}
      volumes:
        - pgadmin_volume:/var/lib/pgadmin
      depends_on:
        - postgres
    volumes:
      postgres_volume:
        name: postgres_volume
        driver: local
      pgadmin_volume:
        name: pgadmin_volume
        driver: local
  ```

- Where:
  - For `test: ["CMD-SHELL", "PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -d ${POSTGRES_TEST_DB} -c 'SELECT 1'"]` command:
    - `CMD-SHELL`: Allows running shell commands, which is necessary to set the `PGPASSWORD` environment variable inline.
    - `PGPASSWORD=${POSTGRES_PASSWORD}`: Sets the `PGPASSWORD` environment variable to the value of `POSTGRES_PASSWORD`, which is read by `psql` to authenticate without prompting for a password.
    - `psql -U ${POSTGRES_USER} -d ${POSTGRES_TEST_DB} -c 'SELECT 1'`: Runs the psql command to connect to the specified database as the specified user and execute a simple query (SELECT 1), which is a common way to check if the database is responding.
- Remarks:
- Check `wal_level`:

  ```sh
  #psql
  show wal_level;
  ```
