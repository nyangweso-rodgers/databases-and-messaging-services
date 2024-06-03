# Setting Up PostgreSQL with Docker using Docker Compose

## Table Of Contents

# What is Docker Compose?

- **Docker Compose** is a very powerful tool that’s used to manage multiple containers, called services, with a single file.

# How to Setup PostgreSQL Database with Docker Compose?

## Step 1: Creat a `docker-compose.yml` File.

- Create a `docker-compose.yml` file with the following contents:

  ```yml
  version: "1"

  services:
    postgres:
      image: postgres:latest
      container_name: postgres
      environment:
        POSTGRES_USER: rodgers
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        POSTGRES_DB: test_db
      ports:
        - "5432:5432"
      env_file:
        - .env
      environment:
        POSTGRES_USER: ${POSTGRES_USER}
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        POSTGRES_DB: ${POSTGRES_DB}
      volumes:
        - postgres_volume:/var/lib/postgresql/data
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
        - ./pgadmin_volume:/var/lib/pgadmin
      depends_on:
        - postgres
  volumes:
    postgres_volume:
      driver: local
  ```

- **Remarks**:

  - create a `.env` file in the same directory as your `docker-compose.yml` that contains the environment variables:

    ```env
      #for POSTGRES
      POSTGRES_USER=rodgers
      POSTGRES_PASSWORD=<specify password>
      POSTGRES_DB=test_db

      #for PGADMIN
      PGADMIN_DEFAULT_EMAIL=<specify email>
      PGADMIN_DEFAULT_PASSWORD=<specify password>
    ```

  - `driver: local`: This line specifies the volume driver to be used for the named volume. In this case, it uses the local driver, which means it will be managed by Docker on the local filesystem.

## Step 2: Run PostgreSQL Docker Container

- Run the below command to run the PostgreSQL container
  ```sh
      docker-compose up -d
  ```

## Step 3: Configure PgAdmin Connection

- Configure the **PgAdmin** connection by specifying the following parameters:
  - **Host name/address**: `postgres` (the name of your service in Docker Compose)
  - **Port**: `5432` (the port exposed in your Docker Compose)
  - **Username**: as per your `.env` file ()
  - **Password**: as per your `.env` file ()
- Note:
  - **Network Connection Between Containers**: Since `pgadmin` and `postgres` are running as services within the same Docker Compose file, they are by default on the same network.
  - **Correct Credentials and Host**: When setting up your `PgAdmin` connection, make sure to use the correct credentials from your `.env` file and specify the `host` as `postgres` (the service name in the Docker Compose file). This should match what you have set up in your environment variables.

## Step : Connecting to a Postgres container

- To connect to a **PostgreSQL** instance running within a **Docker container**, you can use the `docker exec` command combined with the `psql` command:
  ```bash
    docker exec -it <container> psql -U <username>
  ```
- Example:
  ```sh
    docker exec -it postgres psql -U rodgers -d test_db
  ```

## Step : Creating a Postgres user

- The default user created by the `postgres` image when launching a container is named `postgres`. To create a specific user with superuser privileges, you can use the `POSTGRES_USER` environment variable as follows:
- Note that, the password defined in the `POSTGRES_PASSWORD` variable will be assigned to the user defined in the `POSTGRES_USER` variable.
- Example:
  ```sh
    docker run -d -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -p 5432:5432 postgres
  ```
  - This command launches a Postgres container with a new root user named `admin`, identified by the password `admin`.

## Step : Creating a custom database

- By default, **Postgres** creates a database matching the name of the user defined in the `POSTGRES_USER` variable.
- To define a different name for the default database that is created when the image is first started, you can use the `POSTGRES_DB` variable as follows:
  ```sh
    docker run -d -e POSTGRES_USER=<username> -e POSTGRES_PASSWORD=<password> -e POSTGRES_DB=<database> -p <host_port>:<container_port> postgres
  ```
- Example:
  ```sh
    docker run -d -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=test_db -p 5432:5432 postgres
  ```
  - This command launches a Postgres container with a new root user named admin, identified by the password admin, whose default database is `test_db`.

## Step : Connecting pgAdmin to Postgres

- Where:
  - `PGADMIN_DEFAULT_EMAIL` is used to create a new user account on **pgAdmin**.
  - `PGADMIN_DEFAULT_PASSWORD` is used as a password for the user account identified by `PGADMIN_DEFAULT_EMAIL`.

# Bonus: Basic `psql` Commands

- To execute an SQL query, simply type it at the prompt followed by a semicolon (`;`), and hit enter

## Command : Check Version

- Check the version with this SQL statement:

  ```sh
    # check the version
    SELECT version();
  ```

## Command : List Databases

- To list all databases in your **PostgreSQL** server, use the `\l` command:
  ```sh
    mydb=> \l
  ```
- **Remarks**:
  - Running the above command will list all the databases in your **PostgreSQL** server incluing `template0` and `template1`. `template0` and `template1` are template databases that are used as the basis for creating new databases. Here’s what they are and their purposes:
  - `template0`:
    - **Purpose**: `template0` is a pristine template database. It remains unchanged and is used to create new databases that are guaranteed to start from a clean state.
    - **Usage**: When you create a new database, you can specify `template0` as the template to avoid inheriting any custom objects or modifications. This is particularly useful if you need a new database that is free from any user-defined changes.
    - **Immutability**: `template0` is meant to be left unchanged. It does not include any custom objects, extensions, or configurations that might have been added by users.
  - `template1`:
    - **Purpose**: `template1` is the default template database used when creating new databases unless another template is specified. It allows users to define custom objects, configurations, and extensions that will be copied to any new database created from this template.
    - **Usage**: When a new database is created without specifying a template, **PostgreSQL** uses `template1` by default. Any changes made to `template1` will be present in all databases created from it.
    - **Customizability**: You can add custom objects, such as tables, functions, and extensions, to `template1`, and these changes will be propagated to new databases created from it.
  - When you create a new database in _PostgreSQL_, you can specify which template to use. By default, **PostgreSQL** uses `template1`. If you want to create a new database from `template0` (to ensure it is a clean slate), you can specify it like this:
    ```sh
      #psql
      CREATE DATABASE new_db TEMPLATE template0;
    ```

## Command : Connect to a specific database

- Use the `\c` command followed by the database name you want to connect to. For example, if you want to connect to `test_db`, you would run:
  ```sh
    #psql
    postgres=# \c test_db
  ```

## Command : Check the current database

- To see which database you are currently connected to, use the following command:

  ```sh
    test_db=# \conninfo
  ```

- **Sample Output**:
  ```sh
    You are connected to database "test_db" as user "admin" on host "postgres" (address "172.22.0.2") at port "5432".
  ```

## Command : List Tables in a Database

- To list all tables in the current database, use the `\dt` command:
  ```sh
    mydb=> \dt
  ```

## Command : Database Table Information

- To get information about a specific table, use the `\d` command followed by the table name:
  ```sh
    mydb=> \d mytable
  ```

## Command : Create Database Table

- Create `sale_order` table:
  ```sh
    # create the order
    create table sale_order (id varchar(255), item varchar(255), quantity int);
  ```

## Command : Insert Table Row/Data

- insert data into the `sale_order` table
  ```sh
    # insert into the sale_order table
    insert into sale_order table
    values ('SO-TEST-123', 'test item 1', 1);
  ```

## Command : Insert Multiple Table Rows

- Insert multiple rows:
  ```sh
    # insert into the sale_order table
    insert into sale_order (id, item, quantity) values ('SO-TEST-2', 'test item 2', 2), ('SO-TEST-3', 'test item 3', 3), ('SO-TEST-4', 'test item 4', 4);
  ```

## Command : Display Database Table

- Display table:

  ```sh
    select * from sale_order;
  ```

## Command : Switch To Another Database Table

- To switch to another database, use the `\c` command followed by the database name:
  ```sh
    mydb=> \c anotherdb
  ```

## Command : Exit `psql`

- To quit `psql`, type `\q` and hit enter:
  ```sh
    mydb=> \q
  ```

# Resources and Further Reading

1. [docker.com/blog - how-to-use-the-postgres-docker-official-image/](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)
2. [hashnode.dev - setup-postgresql-docker](https://mayukh551.hashnode.dev/setup-postgresql-docker)
3. [Setting up PostgreSQL and pgAdmin 4 with Docker](https://medium.com/@marvinjungre/get-postgresql-and-pgadmin-4-up-and-running-with-docker-4a8d81048aea)
