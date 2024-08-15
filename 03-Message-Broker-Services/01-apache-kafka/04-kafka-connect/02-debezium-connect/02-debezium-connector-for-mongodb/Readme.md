# Setup Kafka Connect for MongoDB

## Streaming MongoDB Changes to Kafka with Debezium

# Debezium connector for MongoDB

## Step : Configuring Replication Mechanism

- Since the **Debezium MongoDB Connector** can capture data changes from one **Replica Set**, you have to start the container with at least one running **replica server** to initiate the replica. If the replica is not initiated, you have to initiate the replica and add servers to it.

## Step 1: Create the MongoDB Connector Configuration File

- Create the file `register-mongodb.json` to store the following connector configuration:

  ```json
  {
    "name": "participants-mongodb-connector",
    "config": {
      "connector.class": "io.debezium.connector.mongodb.MongoDbConnector",
      "tasks.max": "1",
      "mongodb.hosts": "debezium/localhost:27017",
      "mongodb.name": "mongo",
      "mongodb.user": "debezium",
      "mongodb.password": "dbname",
      "database.whitelist": "db_1,db_2",
      "transforms": "AddPrefix",
      "transforms.AddPrefix.type": "org.apache.kafka.connect.transforms.RegexRouter",
      "transforms.AddPrefix.regex": "mongo.([a-zA-Z_0-9]*).([a-zA-Z_0-9]*)",
      "transforms.AddPrefix.replacement": "data.cdc.mongo_$1"
    }
  }
  ```

- Where:
  - `mongodb.hosts`: value can be set to:
    - `"mongodb.hosts" : "debezium/localhost:27017"`
    - `"mongodb.hosts": "MainRepSet/mongo:27017"`

## Step 2: Register the MongoDB Connector

- Use the `curl` command to register the **MongoDB connector** with **Debezium**:
  ```sh
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @register-mongo-connector.json
  ```

## Step 4: Verify the Connector

- After registering the **MongoDB connector**, verify it by checking the status:
  ```sh
      curl -X GET "http://localhost:8083/connectors/mongo-connector/status"
  ```

# Resources and Further Reading

1. [debezium.io/documentation - connectors/mongodb](https://debezium.io/documentation/reference/2.6/connectors/mongodb.html)
