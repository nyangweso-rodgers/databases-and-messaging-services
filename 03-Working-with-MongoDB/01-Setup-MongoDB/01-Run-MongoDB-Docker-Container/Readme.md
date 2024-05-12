# Run MongoDB Docker Container

## Table Of Contents

# Run a MongoDB Server With Docker Compose?

## What is Docker Compose?

- **Docker Compose** is a very powerful tool that’s used to manage multiple containers, called services, with a single file.

# Setup

## Step #1: Create a `docker-compose.yml` File

- Create a `docker-compose.yml` file with the following:

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
        - MONGO_INITDB_DATABASE=admin #you can omit this
      ports:
        - "27017:27017"
      volumes:
        - mongodb_data:/data/db
  volumes:
    mongodb_data:
  ```

- **Remarks**:
  - **Environment Variables**:
    - `MONGO_INITDB_DATABASE`: used to specify the name of the initial database to be created when the **MongoDB container** starts up for the first time. If you don't specify it, MongoDB will default to creating a database named `test`. If you're not planning to create a specific initial database or if you're only working with the default `test` database, you can omit this line from the `docker-compose.yml` file.

## Step #2: Start the database service

- start the MongoDB services defined in the compose file by executing the given command:
  ```sh
    #
    docker-compose up --build -d
  ```
- You can view the running mongodb container by `docker ps` command.

## Step #3: Access MongoDB

### Step #3.1: Access MongoDB via MongoDB Compass

- Connection string:

  ```sh
    mongodb://localhost:27017
  ```

- Remarks:
  - If you already installed "MongoDB", and if you accidentally exit from the MongoDB server, then "restart your system".
  - On **Windows**: press `Windows + R`, then type `services.msc` and click "ok", it opens "services" window, and then search for "MongoDB Server" in the list. After you find "MongoDB Server", right-click and choose "start" from the pop-up menu.

### Step #32.: Access MongoDB Container

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
- This command launches the **mongosh shell**, allowing you to interact with the MongoDB instance running inside the container.

## Step #4: Create root user

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

## Step #5: Create other user

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

## Show Databases

```sh
  show dbs
```

## Show Collections

- List **collections** of a **database**

  ```sh
  show collections
  ```

## Create new non-existant database:

```sh
  use test_db;
```

## Step #6: Create a Collection:

- In the `mongosh` shell, create a collection by:
  ```sh
    #
    db.test_collection.insertOne({'some key': 'some value'});
    {
      acknowledged: true,
      insertedId: ObjectId("65eef82cb0faece445b9bb74")
    }
  ```

# Resources

1. [How to Run & Deploy MongoDB Docker Container?](https://hevodata.com/learn/mongodb-docker/)
2. [How to Run MongoDB in a Docker Container](https://www.howtogeek.com/devops/how-to-run-mongodb-in-a-docker-container/)
