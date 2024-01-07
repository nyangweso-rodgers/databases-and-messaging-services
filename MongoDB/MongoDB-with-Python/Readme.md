# MongoDB with Python

## Table of Contents

- [Further Reading]()
  1. [MongoDB Developer - Python](https://www.mongodb.com/developer/languages/python/)
  2. [Dev.to - Working with MongoDB and Python](https://dev.to/dev0928/working-with-mongodb-and-python-1e2i)
  3. [Dev.to - Learn MongoDB + Python basics in 5 minutes !](https://dev.to/siddheshshankar/learn-mongodb-python-basics-in-10-minutes-8ld)

# Introduction

# Configure VS Code for Python Environment

- For guideon configuring VS Code for Python development, check: https://github.com/nyangweso-rodgers/Programming-with-Python

# Setting Up Python Virtual Environment

- For a guide of setting up Python's Virtual Environment, check: https://github.com/nyangweso-rodgers/Programming-with-Python

# How to work with MongoDB in Python?

- To work with **MongoDB** in `Python`, install `PyMongo` driver using command - `python -m pip install pymongo`

## Test your MongoDB Connection

```py
    # test a successful MongoDB connection

    from pymongo import MongoClient
    #print(dir(MongoClient))

    # Replace the following with your actual MongoDB connection string
    connection_string = ""
    client = MongoClient(connection_string)

    # Specify the database and collection names
    db = client["rodgers-users"]
    collection = db['users']

    # Check connection status using server_info()
    try:
        info = client.server_info()
        print("Successfully Connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
```

## Create a `collection` in `MongoDB`

- create a `database` called `users-v2` containing `users` collections

## Query `collection`s

- Task 1:

  - query a collection matching a particular criteria

    ```py
        # query collections

        from pymongo import MongoClient
        from pprint import pprint

        # connect to MongoDB
        connection_string = ""
        client = MongoClient(connection_string)
        # Specify the database and collection names
        db = client["rodgers-users"]
        collection = db['users']

        # print one of the users matching a criteria
        user = collection.find_one({"age": 20})
        pprint(user)
    ```

- Task 2:

  - query all documents in a collection

    ```py
        # query collections

        from pymongo import MongoClient
        from pprint import pprint

        # connect to MongoDB
        connection_string = ""
        client = MongoClient(connection_string)
        # Specify the database and collection names
        db = client["rodgers-users"]
        collection = db['users']

        # print all the users
        list_users = collection.find({})
        for user in list_users:
            pprint(user)
    ```

## Update `collection`s in MongoDB

- Unlike traditional databases, new fields could be added to a particular row of data.
- Task 1:

  - add `first_name` to a use named `Robert Okoth`

    ```py
        # update collections in MongoDB

        from pymongo import MongoClient
        from pprint import pprint

        # connect to MongoDB
        connection_string = "" # specify the connection string
        client = MongoClient(connection_string)
        # Specify the database and collection names
        db = client["rodgers-users"]
        collection = db['users']

        # find a document
        user = collection.find_one({"full_name": "Robert Okoth"})
        pprint(user)

        # update the document
        result = collection.update_one({ "_id": user.get("_id") }, { "$set": {"first_name": "Robert" }})
        print('Number of documents modified : ' + str(result.modified_count))

        # print updated document
        updated_user = collection.find_one({'_id': user.get('_id')})
        print("This is the updated document:")
        pprint(updated_user)
    ```

## Delete documents in MongoDB

- Task 1:

  - delete a document

    ```py
        # delete collections in MongoDB

        from pymongo import MongoClient
        from pprint import pprint

        # connect to MongoDB
        connection_string = "" # specify the connection string
        client = MongoClient(connection_string)
        # Specify the database and collection names
        db = client["rodgers-users"]
        collection = db['users']

        # find a document
        user = collection.find_one({"full_name": "Robert Okoth"})
        pprint(user)

        # delete document matching a criteria
        result = collection.delete_many({"full_name": "Robert Okoth"})

        # print deleted count
        print(f'Deleted {result.deleted_count} documents!')
    ```
