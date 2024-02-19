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

  - `--name my-postgres-container` Names the container as "`my-postgres-container`". You can choose any name you like.
  - `-e POSTGRES_PASSWORD=mysecretpassword`: Sets the environment variable `POSTGRES_PASSWORD` to "`mysecretpassword`" (replace with your desired password).
  - `-d`: Runs the container in detached mode, meaning it runs in the background.
  - `postgres`: Specifies the image to use for the container, in this case, the official **PostgreSQL image**.

- **Remark**

  - When running a PostgreSQL container, you can specify additional parameters such as port mapping and environment variables to create a database
    ```sh
        docker run --name my-postgres-container -e  POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=myDatabase -p 5432:5432 -d postgres
    ```
  - Here, `-e POSTGRES_DB=mydatabase`: Sets the environment variable `POSTGRES_DB` to "`myDatabase`", creating a new database named "`myDatabase``" (You can replace "mydatabase" with your desired database name).
  - `-p 5432:5432`: Maps port `5432` on the host machine to port `5432` inside the container. This allows you to connect to the PostgreSQL database using the default PostgreSQL port (5432).
  - `-d postgres`: Specifies the image to use for the container, in this case, the official PostgreSQL image.

## Step #3: Verify the container

- You can verify that your container is running by using the following command
  ```sh
      docker ps
  ```
- This will list all running containers, and you should see your PostgreSQL container listed

## Step #4: Connect to PostgreSQL

- To connect to the PostgreSQL database running inside the container, you can use `psql` or any other PostgreSQL client.
- You can use the following command to connect:
  ```sh
      #
      docker exec -it my-postgres-container psql -U postgres
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
- Create a New Database:
  ```sh
    # create a new database
    CREATE DATABASE mydatabase
  ```

## Step #6: Stop and Remove the Container:

- When you're done with the PostgreSQL container, you can stop and remove it using the following commands:\

  ```sh
      docker stop my-postgres-container
      docker rm my-postgres-container
  ```

- Remarks:
  - Removing a PostgreSQL container using Docker commands does not delete the PostgreSQL database or its data from your machine. Instead, it stops and removes the container instance.
  - When you remove a Docker container, you're essentially deleting the container instance that was running, along with any changes made inside the container during its runtime (such as files created, modifications, etc.). However, the underlying image from which the container was instantiated remains on your machine, along with any data volumes that were mounted to the container.
  - If you want to permanently delete the PostgreSQL data, you would need to remove the associated Docker volume (if any) explicitly or use Docker commands to remove the volume along with the container.

# Understanding Docker Volume

- Volumes are managed by Docker and are essential for preserving data even if containers are stopped, restarted, or removed.
- `-v` is used to create a volume in the path `/var/lib/postgresql/data`, which is the default path, will contain the data required for the containers. `postgres_volume` is the named volume present in that directory.
- There are also anonymous volumes.

  - An anonymous volume in Docker is a volume that is created without a specified name. When you create an anonymous volume, Docker assigns it a random name that is guaranteed to be unique within the scope of the host.
  - The name of an anonymous volume is a long string of letters and numbers, such as `83a3275e889506f3e8ff12cd50f7d5b501c1ace95672334597f9a071df439493`
  - You can view the list of volumes, including anonymous volumes, on your host by running the command `docker volume ls`

# Resources and References
