# Run MongoDB Docker Container

## Table Of Contents

# Setup

# Setup with MongoDB [Community Server Edition](https://www.mongodb.com/try/download/community)

### Step #1: Pull Image

- Find the official MongoDB docker images at [DockerHub](https://hub.docker.com/_/mongo)
  ```sh
      #pull mongo db docker Image
      docker pull mongo
  ```
- **Note**:

  - When pulling an image without specifying a tag name, Docker will try to pull the image tagged `latest`

- Check that the image has been created in your local Docker repository

  ```sh
    #check the images
    docker images
  ```

### Step #2: Start a MongoDB Container

- Run a container by:
  ```sh
    #run a container
    docker run -d -p 27017:27017 --name mongo-test-container mongo:latest
  ```
- This will give you a live server running the latest version of MongoDB. It uses the official image available on Docker Hub.

  - `--name` is the name of the container (default: auto-generated). Our container name is set to `mongodb-test-container`
  - `-p` represents the port mapping of the host port to the container port. Here, we map the default `27017` MariaDB port to the `27017` part of our localhost.
  - `-d` runs the container in detached mode, i.e., in the background and prints the container id.

- The MongoDB image also includes the `mongo` shell, i.e., `docker exec` command which provides a way to access it in a running container:

  ```sh
    #access the mongo shell
    docker exec -it mongo-test-container mongo
  ```

  - This will launch an interactive Mongo shell session in your terminal. It's ideal for quickly interacting with your database instance without adding any external dependencies.

- You can inspect Mongo's logs with the `docker logs` command. The `follow` flag means logs will be continually streamed to your terminal.
  ```sh
    #inspect logs
    docker logs mongo-test-container --follow
  ```

### Step #3: Connecting From Another Container

- If you're deploying Mongo in Docker, chances are you'll be wanting to connect from another container such as your API server. It's best to join both to a shared Docker network. This means you won't need to publish Mongo ports to your host, reducing your attack surface.

### Step #4: Persisting Data with Volumes

- You must use **Docker volumes** if you'll be hosting a real database in your Mongo container. Using a volume persists your data so it's not lost when you stop the container or restart the Docker daemon.
- The MongoDB image is configured to store all its data in the `/data/db` directory in the container filesystem. Mounting a volume to this location will ensure data is persisted outside the container.
  ```sh
    #persists data
    docker run -d -p 27017:27017 --name mongo-test-container mongo:latest -v mongo-data:/data/db mongo:latest
  ```
  - this part creates a new Docker Volume called `mongo-data` and mounts it into the container. The volume will be managed by Docker; you can see it by running:
    ```sh
        #check the running volumnes
        docker volume ls
    ```
- Volumes persist until you remove them with the
  ```sh
    #remove volumnes
    docker volumes rm
  ```

### Step #5: Add Test Data to the DB

### Step #6: Add Authentication

- Fresh MongoDB containers lack authentication so anyone can connect to your server. Don't expose the container's ports on a networked system that an attacker could access. Mongo's authentication system should be used to properly secure your database.
- You can add an initial user account by setting the `MONGO_INITDB_ROOT_USERNAME` and `MONGODB_INITDB_ROOT_PASSWORD` environment variables when you create your container:
  ```sh
    #adding environment variables
    docker run -d -p 27017:27017 --name mongo=test-container -v mongo-data:/data/db -e MONGODB_INITDB_ROOT_USERNAME=example-user -e MONGODB_INITDB_ROOT_PASSWORD=example-pass mongo:latest
  ```
- This will start the database with a new user account called `example-user`
- The user will be assigned the `root` role in the `admin` authentication database, granting superuser privileges.

### Step #7: Bonus Step

- Stop the container

  ```sh
    #stop the mongodb-test-container container
    docker stop mongodb-test-containerg
  ```

- Start the container:

  ```sh
    #start the mongodb-test-container container
    docker start mongodb-test-container
  ```

- Access the container shell:
  ```sh
    #access container shell
    docker exec -it mongodb-test-container bash
  ```

# Docker Compose Configurations

- Create a `docker-compose.yml` file with the following:
  ```yml
  #docker-compose.yml
  version: "3"
  services:
    app:
      container-name:
      ports:
        - "5500:5500"
    mongo:
      container-name: mongo
      image: mongo
      ports:
        - "27012:27017"
    mongo-express:
      container-name: mongo-express
      image: mongo-express
      ports:
        - "8083:8081"
  ```

# Resources

1. [How to Run & Deploy MongoDB Docker Container?](https://hevodata.com/learn/mongodb-docker/)
2. [How to Run MongoDB in a Docker Container](https://www.howtogeek.com/devops/how-to-run-mongodb-in-a-docker-container/)
