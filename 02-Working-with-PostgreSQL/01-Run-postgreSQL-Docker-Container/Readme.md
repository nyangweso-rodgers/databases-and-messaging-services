# Run PostgreSQL Docker Container

## Table Of Contents

# PostgreSQL and Docker Setup

## Step #1: Pull the Image

- To run the Postgres database, we first need to pull the postgres image from the [Docker Hub](https://hub.docker.com/)

  ```sh
  # pull the postgres image
  docker pull postgres
  ```

- This command will download the postgres image on your docker.

## Step #2: Run a PostgreSQL Container

- write a command needed to run the image to create a container that will start the Postgres Database Server.
  ```sh
      # run postgreSQL container
      docker run --name my-postgres-container -e POSTGRES_PASSWORD=mysecretpassword -d postgres
  ```
- The command does the following:

  - `--name my-postgres-container` names the container as "`my-postgres-container`". You can choose any name you like.
  - `-e POSTGRES_PASSWORD=mysecretpassword`: Sets the environment variable `POSTGRES_PASSWORD` to "`mysecretpassword`" (replace with your desired password).
  - `-d`: Runs the container in detached mode, meaning it runs in the background.
  - `postgres`: Specifies the image to use for the container, in this case, the official **PostgreSQL image**.

- **Remark**

  - Running `docker run` command creates a container from PostgreSQL image,but it does not store the container within your project directory. Instead, the container is created and managed by **Docker Engine**, independent of your project directory.

  - By running, `docker run --name test-postgres-container .......`, Docker Engine creates a new container named `my-postgres-container` based on the postgres image. This container is now running on your system and is completely separate from your project directory.

  - When running a PostgreSQL container, you can specify additional parameters such as port mapping and environment variables to create a database
    ```sh
        # run postgresql container with additional parameters:
        docker run --name test-postgres-container -e  POSTGRES_PASSWORD=<password> -e POSTGRES_DB=testDB -p 5432:5432 -d postgres
    ```
  - Here, `-e POSTGRES_DB=testDB`: Sets the environment variable `POSTGRES_DB` to "`testDB`", creating a new database named "`testDB`" (You can replace "`testDB`" with your desired database name).
  - `-p 5432:5432`: Maps port `5432` on the host machine to port `5432` inside the container. This allows you to connect to the PostgreSQL database using the default PostgreSQL port (5432).
  - `-d postgres`: Specifies the image to use for the container, in this case, the official PostgreSQL image.

## Step #3: Verify the Container

- Verify the container is running by running:
  ```sh
      # list running containers
      docker ps
  ```
- This will list all running containers, and you should see your PostgreSQL container listed

## Step #4: Connect to PostgreSQL Database Inside the `test-postgres-container` Container Using `psql`

- To connect to the PostgreSQL database running inside the container, you can use `psql` or any other PostgreSQL client.
- You can use the following command to connect:
  ```sh
      # connect to postgresql database
      docker exec -it test-postgres-container psql -U postgres
  ```
  - This command is used to execute a command (`psql -U postgres`) inside a running Docker container named `my-postgres-container`.
  - `docker exec`: Executes a command inside a running container.
  - `-it`: Allocates a pseudo-TTY and keeps STDIN open even if not attached. This allows you to interact with the psql command
  - `my-postgres-container`: Specifies the name of the Docker container to run the command in.
- or, you can connect to a PostgreSQL server running in a local machine (localhost) using the default PostgreSQL port (5432), use:
  ```sh
    psql -h localhost -U postgres -p 5432
  ```
  - `-h localhost`: Specifies the host to connect to. In this case, it's the local machine
  - `-U postgres`: Specifies the username to use for the connection. Here, it's connecting as the user "postgres"
  - `-p 5432`: Specifies the port to connect to. It's connecting to the default PostgreSQL port

## Step #5: Perform Database Operations

- Once connected, you can perform any database operations as you would on a regular PostgreSQL server. For example, you can create databases, create tables, insert data, etc.
- Our database is empty, so we cannot query any tables yet, but we can check the version with this SQL statement:

  ```sh
    # check the version
    SELECT version();
  ```

- To list all databases, run the following command
  ```sh
    # list databases
    \l
  ```
- To list all tables in the current database, run the following command

  ```sh
    # list all tables  a database
    \dt
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
    insert into sale_order (id, item, quantity)
    values ('SO-TEST-2', 'test item 2', 2), ('SO-TEST-3', 'test item 3', 3), ('SO-TEST-4', 'test item 4', 4);
  ```
- Display table:
  ```sh
    # display the sale order table
    select * from sale_order;
  ```
- To get information about about a specific table, run:

  ```sh
    # list databases
    \d sale_order;
  ```

- To switch to a different database:

  ```sh
   # switch to another databases
   \c sale_invoice;
  ```

- After you're done, you can exit the PostgreSQL client by typing:
  ```sh
    # exit the PostgreSQL client
    \q
  ```

## Step #6: Stop and Remove the Container

- When you're done with the PostgreSQL container, you can stop and remove it using the following commands:

  ```sh
      docker stop test-postgres-container
      docker rm test-postgres-container
  ```

- Remarks:
  - Removing a **PostgreSQL container** using Docker commands does not delete the PostgreSQL database or its data from your machine. Instead, it stops and removes the container instance.
  - When you remove a Docker container, you're essentially deleting the container instance that was running, along with any changes made inside the container during its runtime (such as files created, modifications, etc.). However, the underlying image from which the container was instantiated remains on your machine, along with any data volumes that were mounted to the container.
  - If you want to permanently delete the PostgreSQL data, you would need to remove the associated Docker volume (if any) explicitly or use Docker commands to remove the volume along with the container.

# Resources and References

1. [w3schools - PostgreSQL Tutorial](https://www.w3schools.com/postgresql/postgresql_intro.php)
