# Kafka Connect

## Table Of Contents

# Kafka Connect

- **Kafka Connect** is a tool for scalably and reliably streaming data between **Apache Kafka** and other data systems. It makes it simple to quickly define connectors that move large data sets in and out of Kafka. **Kafka Connect** can ingest entire databases or collect metrics from all your application servers into **Kafka topics**, making the data available for **stream processing** with low latency.

# How Kafka Connect Works

- You can deploy **Kafka Connect** as a standalone process that runs jobs on a single machine (for example, log collection), or as a distributed, scalable, fault-tolerant service supporting an entire organization.

# Whst is Debezium?

- **Debezium** is built upon the **Apache Kafka** project and uses **Kafka** to transport the changes from one system to another. The most interesting aspect of **Debezium** is that at the core it is using **Change Data Capture** (CDC) to capture the data and push it into **Kafka**. The advantage of this is that the source database remains untouched in the sense that we don’t have to add triggers or log tables. This is a huge advantage as triggers and log tables degrade performance.

# PostgreSQL connector limitations

1. The connector relies on PostgreSQL’s logical decoding feature. Therefore, it does not capture **DDL** changes and is unable to reflect these events in topics.
2. Replication slots mean that the connector can only be connected to the primary database instance.
3. If the connector user has read-only access, you will need to manually create the replication slot and the database publication.

# Run Debezium Kafka Connect using Docker

```yml
# debezium connector
kconnect:
  image: debezium/connect:1.9
  ports:
    - 8083:8083
  environment:
    CONFIG_STORAGE_TOPIC: my_connect_configs
    OFFSET_STORAGE_TOPIC: my_connect_offsets
    STATUS_STORAGE_TOPIC: my_connect_statuses
    BOOTSTRAP_SERVERS: kafka:29091,kafka2:29093
  links:
    - zookeeper
    - postgres
  depends_on:
    - kafka
    - zookeeper
    - postgres
    - mongo
```

# Setting up Debezium with PostgreSQL

- Setting up the **Debezium connector** for **Postgres** with all the changes required to allow **Debezium** to capture the changes.
- The following services would be needed to make the Debezium and Postgres work locally::
  1. Kafka Broker
  2. Zookeeper
  3. Postgres
  4. Debezium Connector
  5. Schema Registry
  6. Debezium UI
  7. Rest-Proxy - This is optional, but helps with checking cluster metadata, topics etc

## Step 1: Start Docker Compose

- Below is the `docker-compose` file to start the stack:
- Where:
  - The **kafka-connect** service is created from `debezium/connect` Docker image and exposes port `8083`. It is linked to the **kafka service**, and the following Kafka Connect-related environment variables have also been configured:
    1. `BOOTSTRAP_SERVERS: kafka:29092` - The Kafka broker to connect to.
    2. `GROUP_ID: 1`- Consumer group ID assigned to Kafka Connect consumer.
    3. `CONFIG_STORAGE_TOPIC: connect_configs`- Topic to store connector configuration.
    4. `OFFSET_STORAGE_TOPIC: connect_offsets` - Topic to store connector offsets.
    5. `STATUS_STORAGE_TOPIC: connect_statuses` - Topic to store connector status.
- Remarks:
  - For **Debezium** to work with **Postgres**, **Postgres** needs to have the **logical replication** enabled and if you observe the line command: `["postgres", "-c", "wal_level=logical"]` we are configuring the **Postgres DB** to start with `wal_level` as logical.
  - If we don't do this step, then **debezium** would not be able to capture the changes happening on **Postgres**. The default `wal_level` is `replica`.

## Step : Create Source Connector

- To create a source connector, We require a bit of JSON to send to the **REST API** to configure the source connector:
  ```json
  {
    "name": "delegates-survey-db-connector",
    "config": {
      "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
      "plugin.name": "pgoutput",
      "tasks.max": "1",
      "database.hostname": "postgres",
      "database.port": "5432",
      "database.user": "rodgers",
      "database.password": "Rodgy@01",
      "database.dbname": "test_db",
      "database.server.name": "postgres",
      "table.include.list": "public.delegates_survey",
      "database.history.kafka.bootstrap.servers": "kafka:9092",
      "database.history.kafka.topic": "schema-changes.delegates_survey",
      "topic.prefix": "postgres",
      "topic.creation.enable": "true",
      "topic.creation.default.replication.factor": "1",
      "topic.creation.default.partitions": "1",
      "topic.creation.default.cleanup.policy": "delete",
      "topic.creation.default.retention.ms": "604800000"
    }
  }
  ```
- Where:

  - `name` is the **name** of the connector that uses the configuration above; this name is later used for interacting with the connector (i.e., viewing the status/restarting/updating the configuration) via the Kafka Connect REST API;
  - `connector.class`: is the DBMS connector class to be used by the connector being configured;
  - `plugin.name` is the name of the plugin for the logical decoding of WAL data. The `wal2json`, `decoderbuffs`, and `pgoutput` plugins are available for selection. The first two require the installation of the appropriate DBMS extensions; `pgoutput` for PostgreSQL (version 10+) does not require additional actions;
  - `database.*` — options for connecting to the database, where database.server.name is the name of the PostgreSQL instance used to generate the topic name in the Kafka cluster;
  - `table.include.list` is the list of tables to track changes in; it has the `schema.table_name` format and cannot be used together with the `table.exclude.list`;
  - `heartbeat.interval.ms` — the interval (in milliseconds) at which the connector sends heartbeat messages to a Kafka topic;
  - `heartbeat.action.query` is a query that the connector executes on the source database at each heartbeat message (this option was introduced in version 1.1);
  - `slot.name` is the name of the PostgreSQL logical decoding slot. The server streams events to the Debezium connector using this slot;
  - `publication.name` is the name of the PostgreSQL publication that the connector uses. If it doesn’t exist, Debezium will attempt to create it. The connector will fail with an error if the connector user does not have the necessary privileges (thus, you better create the publication as a superuser before starting the connector for the first time).
  - `transforms` defines the way the name of the target topic is changed:
    - `transforms.AddPrefix.type` specifies that regular expressions are used;
    - `transforms.AddPrefix.regex` specifies the mask used to rename the target topic;
    - `transforms.AddPrefix.replacement` contains the replacing string.

- This provides a name for the connector, how to connect to the database and which table to read.

# Step : Applying the configuration

- Start a connector which will read the customer table out of the postgres database.
  ```sh
    curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @postgresql-connect.json
  ```
- Check that the upload is successful and the connector is running:
  ```sh
    curl -i http://localhost:8083/connectors/delegates-survey-db-connector/status
  ```
- Remarks :
  - **Kafka connect** has a **REST** endpoint which we can use to find out things like what connectors are enabled in the container.
    ```sh
      curl -H "Accept:application/json" localhost:8083/connectors/
    ```

# Step : Configure Sink Connector

- Similarly we create a JSON file to configure the **sink connector**.
  ```json
  {
    "name": "jdbc-sink",
    "config": {
      "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
      "tasks.max": "1",
      "topics": "fullfillment.public.customers",
      "dialect.name": "PostgreSqlDatabaseDialect",
      "table.name.format": "customers",
      "connection.url": "jdbc:postgresql://pgsql:5432/customers?user=postgres&password=debezium",
      "transforms": "unwrap",
      "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
      "transforms.unwrap.drop.tombstones": "false",
      "auto.create": "true",
      "insert.mode": "upsert",
      "pk.fields": "id",
      "pk.mode": "record_key",
      "delete.enabled": "true"
    }
  }
  ```
- Note:
  - Kafka JDBC sink defaults to creating the destination table with the same name as the topic which in this case is fullfillment.public.customers I’m not sure of other databases but in PostgreSQL this creates a table which needs to be double quoted to use. I tend to avoid these so I added the "table.name.format": "customers" to force it to create a table named customers.
- And similarly we enable the connector with:
  ```sh
    curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @jdbc-sink.json
  ```

## Step : Viewing the Data

```sh
  kafka-console-consumer --bootstrap-server kafka:9092 --topic postgres.public.delegates_surveys --from-beginning
```

## Register Schema

```sh
  curl -X POST -H "Content-Type: application/json" -d @schema.json http://localhost:8081/subjects/postgres.public.delegates_surveys/versions
```

## Step : Cleanup

- Remove the connectors by:
  ```sh
    curl -X DELETE http://localhost:8083/connectors/delegates-survey-db-connector
  ```

# Resources and Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
2. [runchydata.com/blog - postgresql-change-data-capture-with-debezium](https://www.crunchydata.com/blog/postgresql-change-data-capture-with-debezium)
