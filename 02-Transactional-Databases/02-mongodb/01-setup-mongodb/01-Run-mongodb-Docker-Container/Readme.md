# How to Run a MongoDB Server With Docker Compose?

## What is Docker Compose?

- **Docker Compose** is a very powerful tool that’s used to manage multiple containers, called **services**, with a single file.

# Can MongoDB Run in a Docker Container?

- **MongoDB** can run in a container. The official images available on [Docker Hub](https://hub.docker.com/orgs/mongodb/repositories) include the [community edition](https://hub.docker.com/r/mongodb/mongodb-community-server) and [enterprise edition](https://hub.docker.com/r/mongodb/mongodb-enterprise-server) of **MongoDB** and are maintained by **MongoDB**.
- Remark:
  - Using the [kubernetes operator](https://www.mongodb.com/docs/kubernetes-operator/master/) with the enterprise image is highly recommended for a production environment to be fully supported.

# Running MongoDB with Docker Compose

- In a `docker-compose.yaml` file, describe all of your containers that are part of the application.

# Run MongoDB Without auth

## Step 1: Run MongoDB Without auth

- Create a `docker-compose.yml` file with the following service:

  ```yml
  #docker-compose.yml for mongodb
  version: "2"
  services:
    mongo:
      image: mongo:latest
      container_name: mongo
      ports:
        - "27017:27017"
      volumes:
        - mongo_volume:/data/db
  volumes:
    mongo_data:
  ```

- Where:

  - `MONGO_INITDB_DATABASE`: used to specify the name of the initial database to be created when the **MongoDB container** starts up for the first time. If you don't specify it, MongoDB will default to creating a database named `test`. If you're not planning to create a specific initial database or if you're only working with the default `test` database, you can omit this line from the `docker-compose.yml` file.
  - The `27017:27017` in this command maps the container port to the host port. This allows you to connect to **MongoDB** with a `localhost:27017` connection string.

- start the **MongoDB** services defined in the compose file by executing the given command:
  ```sh
    docker-compose up --build -d
  ```
- You can view the running mongodb container by `docker ps` command.

## Step 2: Connect to MongoDB without auth

- By default, self hosted **MongoDB** doesn’t enforce user **authentication** by default. For example, when you connect to **MongoDB** from the command line using the **mongosh** or command mongosh `mongodb://127.0.0.1:27017`, you will connect with no prompt for authentication.
  ```bash
    #Connect MongoDB without auth inside container
    docker exec -it mongodb-community-server bash
    mongosh
  ```
- This gets you directly onto the default **MongoDB** database shell prompt.

  ```bash
    #sample output
    Current Mongosh Log ID: 66649bde8d3400f11ca26a12
    Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.6
    Using MongoDB:          7.0.3
    Using Mongosh:          2.2.6

    For mongosh info see: https://docs.mongodb.com/mongodb-shell/
  ```

- **Remark**:
  - To confirm your **MongoDB** instance is running, run the Hello command:
    ```sh
      db.runCommand({hello: 1})
    ```
  - The result of this command returns a document describing your `mongod` deployment:
    ```sh
      {
        isWritablePrimary: true,
        topologyVersion: {
          processId: ObjectId('66573f5ac9f4dcfbff93864d'),
          counter: Long('0')
        },
        maxBsonObjectSize: 16777216,
        maxMessageSizeBytes: 48000000,
        maxWriteBatchSize: 100000,
        localTime: ISODate('2024-05-29T14:58:41.485Z'),
        logicalSessionTimeoutMinutes: 30,
        connectionId: 21,
        minWireVersion: 0,
        maxWireVersion: 21,
        readOnly: false,
        ok: 1
      }
    ```
- This basically means that, any one with access to the system, can do anything possible to **MongoDB** databases since there is no restriction implemented. For example, once can list the databases;
  ```bash
    #mongosh
    show dbs
  ```
  - Sample output:
    ```sh
      test> show dbs
      admin   40.00 KiB
      config  12.00 KiB
      local   40.00 KiB
    ```
- If you check from **MongoDB** shell prompt, no user is created by default;
  ```bash
    #mongosh
    show users #output: []
    #or
    db.getUsers(); #output: { users: [], ok: 1 }
  ```

## Step 3: Create MongoDB Administrative, `admin` User

- To create an `admin` user, switch to default `admin` **MongoDB** database.
- Listing available databases first;
  ```bash
    #mongosh
    show dbs
  ```
  - Sample output:
    ```sh
      test> show dbs
      admin   40.00 KiB
      config  12.00 KiB
      local   40.00 KiB
    ```
- Next, run the command below from the shell prompt to switch to **MongoDB** default `admin` database;
  ```sh
    #mongosh
    use admin
  ```
- Once you have switched to `admin` database, create **MongoDB** `admin` user by:
  ```bash
    #mongosh
    use admin
    db.createUser({user: 'admin', pwd: '<password>', roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]})
  ```
  - Sample Output:
    ```sh
      { ok: 1 }
    ```
- The command above simply create an admin user with the following roles;
  - **roles**: This field specifies the roles assigned to the user. Roles define the user’s permissions and privileges within the MongoDB database.
    - `{ role: “userAdminAnyDatabase”, db: “admin” }`: Grants the user administrative privileges (userAdminAnyDatabase) on the admin database. This role allows the user to create and manage users on any database.
    - `“readWriteAnyDatabase”`: Grants the user read and write access (readWriteAnyDatabase) to any database. This role allows the user to read and write data to any database in the MongoDB instance.
- List users again to confirm;
  ```bash
    #mongosh
    show users
  ```
  - Sample Output:
    ```bash
      [
      {
        _id: 'admin.admin',
        userId: UUID('b97b2883-16c9-4f73-98fa-2fc6e9f63a35'),
        user: 'admin',
        db: 'admin',
        roles: [
          { role: 'userAdminAnyDatabase', db: 'admin' },
          { role: 'readWriteAnyDatabase', db: 'admin' }
        ],
        mechanisms: [ 'SCRAM-SHA-1', 'SCRAM-SHA-256' ]
      }
    ]
    ```

## Step 4: Create other user

- For a database name, `test_db`, we can create a seperate user with a read and write access to the database as follows:
  ```sh
    #mongosh
    use test_db
    db.createUser({user: 'test_user', pwd: 'test_pwd', roles: [{role: "readWrite", db: "test_db"}]})
  ```

## Step 5: Connect to MongoDB with auth

- Connect to `admin` database with `auth`:

  ```bash
    docker exec -it mongodb-community-server mongosh -u admin <pwd> --authenticationDatabase admin
  ```

- Connect to `test_db` database with `auth`:
  ```bash
    docker exec -it mongodb-community-server mongosh -u test_db <pwd> --authenticationDatabase test_db
  ```

## Step 6: Update the `MONGO_URI` to Use the New Credentials

```yml
#
environment:
  - MONGO_URI=mongodb://<user>:<userpasswd>@mongodb:27017/<db_name>
```

# Steps to Enable MongoDB Authentication in MongoDB using `docker-compose`

## Step 1: Enable MongoDB `auth` in `docker-compose`

- In order to enable **auth** in **MongoDB** we will use `--auth` flag in `docker-compose`.
  ```yml
  version: "3"
  services:
    mongodb-community-server:
      image: mongodb/mongodb-community-server:7.0.3-ubi8 #https://hub.docker.com/r/mongodb/mongodb-community-server
      container_name: mongodb-community-server
    ports:
      - "27017:27017"
    command: [--auth]
    volumes:
      - mongodb-community-server-volume:/data/db
      - ./db/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
  volumes:
    mongodb-community-server-volume:
      name: mongodb-community-server-volume
  ```
- In a `docker-compose.yaml` file, the `command` key is used to specify the **command** that should be running inside the **container** when it starts up. For a **MongoDB container**, one common use of the `command` key is to enable **authentication** by passing the `--auth` option to the **mongod** process.
- When the `--auth` option is passed to the **mongod** process, it enables authentication for the **MongoDB** instance. This means that users will need to provide valid credentials (username and password) to access the database.
- Without **authentication**, anyone with access to the **MongoDB** instance could potentially access, modify, or delete sensitive data, which could lead to serious security breaches.
- We're copying `db/mongo-init.js` file to the container by running - `./db/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js`.

## Step 2: MongoDB JavaScript User/Pass Creation File

```javascript
// db/mongo-init.js
db = db.getSiblingDB("test_db");
db.createUser({
  user: "test_user",
  pwd: "test_pwd",
  roles: [{ rolle: "dbOwner", db: "test_db" }],
});
```

## Step 3: Connecting to MongoDB

- Create a `.env` File with:
  ```.env
    MONGO_INITDB_ROOT_USERNAME=admin
    MONGO_INITDB_ROOT_PASSWORD=<pwd>
    MONGODB_DATABASE=test_db
    MONGODB_USER=test_user
    MONGODB_PASSWORD=test_pwd
    MONGODB_HOST_NAME=localhost
    MONGODB_PORT=27017
  ```

## Step 3.1: Access MongoDB via MongoDB Compass

- Using this method, you will be able to connect to your **MongoDB** instance on `mongodb://localhost:27017`. You can try it with [Compass](https://www.mongodb.com/products/tools/compass), MongoDB’s GUI to visualize and analyze your data.
- If your application is running inside a container itself, you can run **MongoDB** as part of the same Docker network as your application using `--network`. With this method, you will connect to **MongoDB** on `mongodb://mongodb:27017` from the other containerized applications in the network.
- To initialize your **MongoDB** with a root user, you can use the environment variables `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD`. These environment variables will create a user with root permissions with the specified user name and password.
- Remarks:
  - If you already installed "MongoDB", and if you accidentally exit from the MongoDB server, then "restart your system".
  - On **Windows**: press `Windows + R`, then type `services.msc` and click "ok", it opens "services" window, and then search for "MongoDB Server" in the list. After you find "MongoDB Server", right-click and choose "start" from the pop-up menu.

# Need for adding health checks for the MongoDB container

- Below I have a NodeJS application that will be deployed only when the health check on the **MongoDB container** is successful.
  ```yml
  #
  services:
    mongo-db:
      image: <>
    healthcheck:
      #
      interval: 10s
      timeout: 60s
      retries: 3
      start_period: 20s
  ```
- Where:
  - `interval`: determines the interval between two checks.
  - `timeout`: If the `HEALTHCHECK` command exceeds the specified duration, it is categorized as a failure. The default duration is the 30s.
  - `retries`: If it reaches the specified number of retries, the state is considered to be unhealthy.
  - `start_period`: time interval after which start the health check.
- Now let us look at the application container.
  ```yml
  depends_on:
    mongo-db:
      condition: service_healthy
  ```

# Resources and Further Reading

1. [mongodb.com - resources/products/compatibilities/docker](https://www.mongodb.com/resources/products/compatibilities/docker)
