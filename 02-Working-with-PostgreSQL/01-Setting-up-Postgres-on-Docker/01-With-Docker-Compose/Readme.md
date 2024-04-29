# Setting Up PostgreSQL with Docker using Docker Compose

## Table Of Contents

# What is Docker Compose?

- **Docker Compose** is a very powerful tool that’s used to manage multiple containers, called services, with a single file.

## Step #1: Creat a `docker-compose.yml` File with the following:

```yml
    version: "1"

    services:
        postgres:
        image: postgres:latest
        container_name: postgres
        environment:
            POSTGRES_USER: rodgers
            POSTGRES_PASSWORD: mysecretpassword
            POSTGRES_DB: test_db
        ports:
            - "5432:5432"
        volumes:
            - postgres_volume:/var/lib/postgresql/data

volumes:
  postgres_volume:
    driver: local
```

- Remarks:
  - `driver: local`: This line specifies the volume driver to be used for the named volume. In this case, it uses the local driver, which means it will be managed by Docker on the local filesystem.

## Step #2: Run PostgreSQL Docker Container

- Run the below command to run the PostgreSQL container
  ```sh
      docker-compose up -d
  ```

## Step #: Connect to PostgreSQL using `psql`

- Use the following command to connect to PostgreSQL container:
  ```sh
    docker exec -it test-postgres psql -U rodgers -d mydb
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

### Command #:

```psql
    mydb=> SELECT * FROM mytable;
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
- To switch to another database, use the `\c` command followed by the database name:
  ```sh
    mydb=> \c anotherdb
  ```
- To quit `psql`, type `\q` and hit enter:
  ```sh
    mydb=> \q
  ```

# Resources and Further Reading

1. [hashnode.dev/setup-postgresql-docker](https://mayukh551.hashnode.dev/setup-postgresql-docker)
