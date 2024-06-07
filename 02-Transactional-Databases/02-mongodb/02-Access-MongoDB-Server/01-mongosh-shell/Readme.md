# mongosh Shell

# Connect to the MongoDB Docker Container with `mongosh`

- Open the Bash shell inside the running **MongoDB docker container** through the following command:
  ```sh
    docker exec -it mongo bash
  ```
- Once you're inside the container, you can then start `mongosh`:
  ```bash
    mongosh
  ```
- This command launches the **mongosh shell**, allowing you to interact with the MongoDB instance running inside the container. **Sample output** is as shown below:

  ```bash
    root@b807fe258a24:/# mongosh
    Current Mongosh Log ID: 665741e84617c7a4672202d7
    Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5
    Using MongoDB:          7.0.9
    Using Mongosh:          2.2.5

    For mongosh info see: https://docs.mongodb.com/mongodb-shell/
  ```

# Comands

## Command 1: Show Databases

```sh
  show dbs
```

## Command 2: Show Collections

- List **collections** of a **database**

  ```sh
  show collections
  ```

## Command 3: Create new non-existant database:

```sh
  use test_db;
```

## Command 4: Create a Collection:

- In the `mongosh` shell, create a collection by:
  ```sh
    #
    db.test_collection.insertOne({'some key': 'some value'});
    {
      acknowledged: true,
      insertedId: ObjectId("65eef82cb0faece445b9bb74")
    }
  ```
