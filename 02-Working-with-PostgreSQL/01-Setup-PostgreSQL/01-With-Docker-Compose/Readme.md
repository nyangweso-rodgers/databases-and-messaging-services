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

## Step 4: Connect to PostgreSQL using `psql`

- Use the following command to connect to PostgreSQL container:
  ```sh
    docker exec -it postgres psql -U rodgers -d test_db
  ```
- Remarks:
  - `docker exec`: This command is used to execute a command in a running container.
  - `-it` flag is used when running the `docker exec` command. It is a combination of two separate flags: `-i` and `-t`: `-i` (or `--interactive`): It enables you to interact with the container's process by providing input through the command line. `-t` (or `--tty`): This flag allocates a pseudo-TTY (Teletypewriter) for the container. It allows you to see the output of the command and provides a terminal-like interface, making the interaction with the container more user-friendly.
  - `test-postgres`: This specifies the name of the container in which the command will be executed.
  - `psql`: This is the command that will be executed inside the container. It stands for **PostgreSQL interactive terminal**.
  - `-U rodgers`: The `-U` flag stands for user and specifies the name of the user to connect as. In this case, it is connecting as user `rodgers`
  - `-d mydb`: The `-d` flag is used to state the database you are going to use.
- After the running the above command, the `psql` terminal will open. Now you can interact with your postgres database by running your SQL commands.

## Bonus: Basic `psql` Commands

- To execute an SQL query, simply type it at the prompt followed by a semicolon (`;`), and hit enter
- Basic commands to interact with PostgreSQL database using `psql` are as follows:
- Check the version with this SQL statement:

  ```sh
    # check the version
    SELECT version();
  ```

- To list all databases in your PostgreSQL server, use the `\l` command:
  ```sh
    mydb=> \l
  ```
- To list all tables in the current database, use the `\dt` command:
  ```sh
    mydb=> \dt
  ```
- To get information about a specific table, use the `\d` command followed by the table name:
  ```sh
    mydb=> \d mytable
  ```
- Create `sale_order` table:
  ```sh
    # create the order
    create table sale_order (id varchar(255), item varchar(255), quantity int);
  ```
- insert data into the `sale_order` table
  ```sh
    # insert into the sale_order table
    insert into sale_order table
    values ('SO-TEST-123', 'test item 1', 1);
  ```
- or, insert multiple rows:
  ```sh
    # insert into the sale_order table
    insert into sale_order (id, item, quantity) values ('SO-TEST-2', 'test item 2', 2), ('SO-TEST-3', 'test item 3', 3), ('SO-TEST-4', 'test item 4', 4);
  ```
- Display table:

  ```sh
    # display the sale order table
    select * from sale_order;
  ```

- To switch to another database, use the `\c` command followed by the database name:
  ```sh
    mydb=> \c anotherdb
  ```
- To quit `psql`, type `\q` and hit enter:
  ```sh
    mydb=> \q
  ```

# Resources and Further Reading

1. [docker.com/blog - how-to-use-the-postgres-docker-official-image/](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)
2. [hashnode.dev/setup-postgresql-docker](https://mayukh551.hashnode.dev/setup-postgresql-docker)
3. [Setting up PostgreSQL and pgAdmin 4 with Docker](https://medium.com/@marvinjungre/get-postgresql-and-pgadmin-4-up-and-running-with-docker-4a8d81048aea)
