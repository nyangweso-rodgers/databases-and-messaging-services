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

# How to Run a MongoDB Server With Docker Compose?

## Step #1: Create a `docker-compose.yml` File

- create a `docker-compose.yml` file and deine the services
  ```yml
  #docker-compose.yml for mongodb
  version: "2"
  services:
    mongo:
      image: mongo
      container_name: mongo
      environment:
        - MONGO_INITDB_ROOT_USERNAME: root
        - MONGO_INITDB_ROOT_PASSWORD: rootpassword
        #- MONGO_INITDB_DATABASE=admin #you can omit this
      ports:
        - "27017:27017"
      volumes:
        - mongodb_data:/data/db
  volumes:
    mongodb_data:
  ```

## Step #1.1: Understanding the Environment Variables

- The `MONGO_INITDB_DATABASE` environment variable is used to specify the name of the initial database to be created when the MongoDB container starts up for the first time. If you don't specify it, MongoDB will default to creating a database named `test`.
  - If you're not planning to create a specific initial database or if you're only working with the default `test` database, you can omit this line from the `docker-compose.yml` file.

## Step #2: Start the Compose Service

- start the MongoDB services defined in the compose file by executing the given command:
  ```sh
    #
    docker-compose up -d
  ```
- You can view the running mongodb container by `docker ps` command.

## Step #3: Access MongoDB Container

- Open the Bash shell inside the running MongoDB container through the following command
  ```sh
    #access the container
    docker exec -it mongo bash
  ```
- Once you're inside the container, you can then start `mongosh`:
  ```bash
    #start the mongosh inside the container
    mongosh
  ```
- This command launches the mongosh shell, allowing you to interact with the MongoDB instance running inside the container.

## Step #5: Create root user

- Create admin user with username `root` and password `root` in admin database.
  ```sh
    #
    use admin
  ```
- Create a user:
  ```sh
    #
    db.createUser({user: 'root', pwd: 'root', roles:['root']});
  ```

## Step #6: Create other user

- Suppose I have a `test` db, we can create another user with read and write access:
  ```sh
    #
    use test
    db.createUser(
        {
            user: "test",
            pwd: "test",
            roles:[
                {
                    role: "readWrite",
                    db: "test"
                }
            ]
        }
    );
  ```

## Step #7: Create a Collection:

- In the `mongosh` shell, create a collection by:
  ```sh
    #
    db.test_collection.insertOne({'some key': 'some value'});
    {
      acknowledged: true,
      insertedId: ObjectId("65eef82cb0faece445b9bb74")
    }
  ```

## Step #7: Run mongo with auth

- Enable auth in mongo with `--auth` flag.
  ```yml
  #
  mongodb:
    container_name: mongo
    image: mongo
    ports:
      - "27017:27017"
    command: [--auth]
    volumne:
      - mongo_data:/data/db
  ```

## Step #8: Connect to MongoDB with auth

- In this step we can connect our db with defined authentication. We first need to run `docker exec -it mongo bash` command in order to enter inside the container.
- Following commands enables to connect mongodb with specifying `username`, `password` and `authentication database`.
  ```sh
    #
    mongosh -u root -p root --authenticationDatabase admin
    mongosh -u test-user -p test-user-password --authenticationDatabase test-db
  ```

# Bonus: Querying Data in `mongosh`

- Databases:

  - To select a database to use:

    ```sh
    #select database to use
    use testDb
    ```

- List **collections** of a **database**
  ```sh
    #show collections
    show collections
  ```
- Create Collection:
  - create a new, `countries` collection in a database
    ```sh
      #
      db.createCollection(countries)
    ```
- Create a Database:
  - If a database does not exist, MongoDB creates the database when you first store data for that database. As such, you can switch to a non-existent database and perform the following operation in `mongosh`:
    ```sh
      # Create a database
      use testDB
      db.testCollection.insertOne( { x: 1 } )
    ```
- Create a Collection
  - If a collection does not exist, MongoDB creates the collection when you first store data for that collection.
    ```sh
      # Create a collection
      db.myNewCollection2.insertOne( { x: 1 } )
      db.myNewCollection3.createIndex( { y: 1 } )
    ```
- `find()`
  ```sh
    db.testCollection.fin()
  ```

# Resources

1. [How to Run & Deploy MongoDB Docker Container?](https://hevodata.com/learn/mongodb-docker/)
2. [How to Run MongoDB in a Docker Container](https://www.howtogeek.com/devops/how-to-run-mongodb-in-a-docker-container/)
