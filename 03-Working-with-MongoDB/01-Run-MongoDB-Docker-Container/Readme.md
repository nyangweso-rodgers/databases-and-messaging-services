# Run MongoDB Docker Container

## Table Of Contents







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

# Connect to MongoDB Server using Mongo Shell

# Useful Coomands in Mongo Shell

## Show Databases

```sh
  show dbs
```

## Create new non-existant database:

```sh
  use test_db;
```

## Show Collections

```sh
  show collections
```

# Resources

1. [How to Run & Deploy MongoDB Docker Container?](https://hevodata.com/learn/mongodb-docker/)
2. [How to Run MongoDB in a Docker Container](https://www.howtogeek.com/devops/how-to-run-mongodb-in-a-docker-container/)
