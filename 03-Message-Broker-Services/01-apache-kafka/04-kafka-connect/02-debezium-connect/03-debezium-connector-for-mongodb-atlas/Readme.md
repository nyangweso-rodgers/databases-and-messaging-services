# Debezium connector for MongoDB Atlas

## Streaming MongoDB Atlas Changes to Kafka with Debezium

## Use a Debezium Connector Running on Docker to capture changes from MongoDB Atlas and stream them to a Kafka topic

## Table Of Contents

# Debezium connector for MongoDB Atlas

- **Debezium’s MongoDB connector** tracks a **MongoDB replica set** or a **MongoDB sharded cluster** for document changes in databases and collections, recording those changes as events in **Kafka topics**. The **connector** automatically handles the addition or removal of shards in a sharded cluster, changes in membership of each replica set, elections within each replica set, and awaiting the resolution of communications problems.

# Setup

## Step 1: Set Up MongoDB Atlas

- Ensure you have a MongoDB Atlas cluster set up and accessible. Note down the connection details (username, password, cluster URL).

## Step 2: Create a Docker Compose File

-This file will define the services for **Kafka**, **Zookeeper**, and the **Debezium** connector.

```yml
version: "2"
services:
```

## Step 3: Start Docker Containers

- Run the following command to start the services
  ```sh
    docker-compose up -d
  ```

## Step 4: Configure MongoDB Connector

- Once the containers are running, you need to configure the **Debezium** MongoDB connector. You can do this by sending a `POST` request to the **Kafka Connect REST API**. Here is an example of the configuration:

  ```json
  {
    "name": "participants-survey-mongodb-atlas-connector",
    "config": {
      "connector.class": "io.debezium.connector.mongodb.MongoDbConnector",
      "tasks.max": "1",
      "mongodb.connection.string": "<connection string>",
      "mongodb.user": "<user>",
      "mongodb.password": "<password>",
      "mongodb.name": "<database>",
      "collection.include.list": "survey-service.participants_surveys",
      "heartbeat.interval.ms": "5000",
      "publication.autocreate.mode": "filtered",
      "topic.prefix": "survey-service",
      "topic.creation.enable": "true",
      "topic.creation.default.replication.factor": "1",
      "topic.creation.default.partitions": "1",
      "topic.creation.default.cleanup.policy": "delete",
      "topic.creation.default.retention.ms": "604800000",
      "database.history.kafka.topic": "schema-changes.mongo",
      "database.history.kafka.bootstrap.servers": "kafka:29092",
      "key.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": false,
      "snapshot.mode": "initial"
    }
  }
  ```

- Replace `<DATABASE_NAME>`, `<USERNAME>`, and `<PASSWORD>` with your **MongoDB Atlas** details.

## Step 6: Deploy the Connector

- Use `curl` to send the configuration to the **Kafka Connect API**:
  ```sh
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @register-participants-survey-mongodb-atlas-connector.json
  ```
- Sample Outpt:
  ```json
  {
    "name": "participants-survey-mongodb-atlas-connector",
    "config": {
      "connector.class": "io.debezium.connector.mongodb.MongoDbConnector",
      "tasks.max": "1",
      "mongodb.connection.string": "<specify the connecton string>",
      "mongodb.user": "<user>",
      "mongodb.password": "< password>",
      "mongodb.name": "survey-service",
      "collection.include.list": "participants_surveys",
      "topic.prefix": "mongodb-atlas-survey-service",
      "topic.creation.enable": "true",
      "topic.creation.default.replication.factor": "1",
      "topic.creation.default.partitions": "1",
      "topic.creation.default.cleanup.policy": "delete",
      "topic.creation.default.retention.ms": "604800000",
      "database.history.kafka.topic": "schema-changes.mongo",
      "database.history.kafka.bootstrap.servers": "kafka:29092",
      "key.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "name": "participants-survey-mongodb-atlas-connector"
    },
    "tasks": [],
    "type": "source"
  }
  ```

## Step 7: Monitor and Verify

- You can verify the status of your connector by accessing the **Kafka Connect API**
  ```sh
    curl -X GET http://localhost:8083/connectors/mongo-connector/status
  ```
- Sample Outpt:
  ```json
  {
    "name": "participants-survey-mongodb-atlas-connector",
    "connector": { "state": "RUNNING", "worker_id": "172.26.0.7:8083" },
    "tasks": [{ "id": 0, "state": "RUNNING", "worker_id": "172.26.0.7:8083" }],
    "type": "source"
  }
  ```

## Step 8: List Kafka Topics

- If there was no issue running the above steps we could confirm that our **connector** is working fine by checking if the **topic** is created for `customers` table by the **connector**.
  ```sh
    kafka-topics --bootstrap-server localhost:29092 --list
  ```
- Sample output:

## Step 9: Reading the data

- We can check that the data availability on the **topic**.
- There would be data present in the **topic** because when the **connector** starts it takes an initial snapshot of the database table. This is a default `config` named `snapshot.mode` which we didn't configure but is set to `initial` which means that the **connector** will do a snapshot on the initial run when it doesn't find the last known **offset** from the transaction log available for the database server.
  ```bash
    #kafka bash
    kafka-console-consumer --bootstrap-server localhost:29092 --topic postgres.public.customers --from-beginning
  ```

## Step 10: Consume Data from Kafka

- Use a **Kafka consumer** to read the data from the **Kafka topic** where **Debezium** is publishing the change events.

  ```sh
    kafka-console-consumer --bootstrap-server kafka:29092 --topic survey-service.survey-service.participants_surveys --from-beginning
  ```

## Step 11: Cleanup

- Remove the connectors by:
  ```sh
    curl -X DELETE http://localhost:8083/connectors/participants-survey-mongodb-atlas-connector
  ```

# Resources and Further Reading

1. [debezium.io/documentation - connectors/mongodb](https://debezium.io/documentation/reference/1.9/connectors/mongodb.html)
