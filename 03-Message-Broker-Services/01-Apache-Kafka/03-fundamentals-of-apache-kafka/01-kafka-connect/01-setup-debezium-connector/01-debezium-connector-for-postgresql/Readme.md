# Debezium connector for PostgreSQL

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
  ```yml
  services:
    ############################################################################
    # postgres DB
    #
    postgres:
      image: postgres:latest
      container_name: postgres
      hostname: postgres
      restart: always
      ports:
        - "5432:5432"
      env_file:
        - .env
      environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      command: ["postgres", "-c", "wal_level=logical"]
      volumes:
        - postgres_volume:/var/lib/postgresql/data
      healthcheck:
      test: ["CMD", "psql", "-U", "postgres", "-c", "SELECT 1"]
      interval: 10s
      timeout: 5s
      retries: 5
  ```
- Where:
  - The **kafka-connect** service is created from `debezium/connect` **Docker image** and exposes port `8083`. It is linked to the **kafka service**, and the following Kafka Connect-related environment variables have also been configured:
    1. `BOOTSTRAP_SERVERS: kafka:29092` - The Kafka broker to connect to.
    2. `GROUP_ID: 1`- Consumer group ID assigned to Kafka Connect consumer.
    3. `CONFIG_STORAGE_TOPIC: connect_configs`- Topic to store connector configuration.
    4. `OFFSET_STORAGE_TOPIC: connect_offsets` - Topic to store connector offsets.
    5. `STATUS_STORAGE_TOPIC: connect_statuses` - Topic to store connector status.
- Remarks:

  - For **Debezium** to work with **Postgres**, **Postgres** needs to have the **logical replication** enabled and if you observe the line command: `["postgres", "-c", "wal_level=logical"]` we are configuring the **Postgres DB** to start with `wal_level` as logical.
  - If we don't do this step, then **debezium** would not be able to capture the changes happening on **Postgres**. The default `wal_level` is `replica`.

## Step 2: Configure Postgres Connector

### Step 2.1: Register Postgres connector using HTTP API

- We need to register the **Postgres connector** using **HTTP API** so that **debezium** could read the transaction logs from the server.
- To create a **source connector**, We require a bit of `JSON` to send to the **REST API** to configure the **source connector**:

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

  - `name` is the **name** of the connector that uses the configuration above; this `name` is later used for interacting with the connector (i.e., viewing the status/restarting/updating the configuration) via the Kafka Connect REST API;
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

- To **register** the above **connector**, run the below `curl` commands:

  ```sh
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @register-customers-pg-connector.json
    #or,
    curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @register-pg-connector.json
  ```

  - **Sample Output**:
    ```json
    {
      "name": "register-pg-connector",
      "config": {
        "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
        "tasks.max": "1",
        "plugin.name": "pgoutput",
        "database.hostname": "postgres",
        "database.port": "5432",
        "database.user": "admin",
        "database.password": "<password>",
        "database.dbname": "test_db",
        "database.server.name": "postgres",
        "table.include.list": "test_db.customers",
        "heartbeat.interval.ms": "5000",
        "publication.autocreate.mode": "filtered",
        "key.converter": "org.apache.kafka.connect.json.JsonConverter",
        "value.converter": "org.apache.kafka.connect.json.JsonConverter",
        "value.converter.schemas.enable": "false",
        "topic.prefix": "test_db",
        "topic.creation.enable": "true",
        "topic.creation.default.replication.factor": "1",
        "topic.creation.default.partitions": "1",
        "topic.creation.default.cleanup.policy": "delete",
        "topic.creation.default.retention.ms": "604800000",
        "name": "register-pg-connector"
      },
      "tasks": [],
      "type": "source"
    }
    ```

- Both of these commands will start a **connector** which will read the **postgres** table out of the **postgres database**.

- **Remarks**:
  - We can check that the upload is successful and the **connector** is running by:
    ```sh
      curl -X GET "http://localhost:8083/connectors/register-customers-pg-connector/status"
    ```
    - Sample Output:
      ```json
      {
        "name": "register-customers-pg-connector",
        "connector": { "state": "RUNNING", "worker_id": "172.25.0.11:8083" },
        "tasks": [
          { "id": 0, "state": "RUNNING", "worker_id": "172.25.0.11:8083" }
        ],
        "type": "source"
      }
      ```
    - The status message indicates that your **Kafka connector** is successfully running. Both the connector and its task are in the "RUNNING" state, which means it has been properly configured and is currently active.
  - **Kafka connect** has a **REST** endpoint which we can use to find out things like what connectors are enabled in the container.
    ```sh
      curl -H "Accept:application/json" localhost:8083/connectors/
    ```
    - Sample output:
      ```sh
        ["delegates_surveys-pg-connector","register-customers-pg-connector"]
      ```

## Step 3: List Kafka Topics

- If there was no issue running the above steps we could confirm that our **connector** is working fine by checking if the **topic** is created for `customers` table by the **connector**.
  ```sh
    kafka-topics --bootstrap-server localhost:29092 --list
  ```
- Sample output:

## Step 4: Reading the data

- We can check that the data availability on the **topic**.
- There would be data present in the **topic** because when the **connector** starts it takes an initial snapshot of the database table. This is a default `config` named `snapshot.mode` which we didn't configure but is set to `initial` which means that the **connector** will do a snapshot on the initial run when it doesn't find the last known **offset** from the transaction log available for the database server.
  ```bash
    #kafka bash
    kafka-console-consumer --bootstrap-server localhost:9092 --topic postgres.public.customers --from-beginning
  ```

# Step 4: Configure Sink Connector

- We create a `JSON` file to configure the **sink connector**.
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
- **Note**:
  - Kafka JDBC sink defaults to creating the destination table with the same name as the topic which in this case is fullfillment.public.customers I’m not sure of other databases but in PostgreSQL this creates a table which needs to be double quoted to use. I tend to avoid these so I added the "table.name.format": "customers" to force it to create a table named customers.
- And similarly we enable the connector with:
  ```sh
    curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d @jdbc-sink.json
  ```

## Step : Viewing the Data

```sh
  kafka-console-consumer --bootstrap-server kafka:29092 --topic postgres.public.delegates_surveys --from-beginning
```

## Register Schema

```sh
  curl -X POST -H "Content-Type: application/json" -d @schema.json http://localhost:8081/subjects/postgres.public.delegates_surveys/versions
```

## Step : Cleanup

- Remove the connectors by:
  ```sh
    curl -X DELETE http://localhost:8083/connectors/delegates-survey-pg-connector
  ```

# PostgreSQL connector limitations

1. The connector relies on PostgreSQL’s logical decoding feature. Therefore, it does not capture **DDL** changes and is unable to reflect these events in topics.
2. Replication slots mean that the connector can only be connected to the primary database instance.
3. If the connector user has read-only access, you will need to manually create the replication slot and the database publication.

# Resources and Further Reading

1. [runchydata.com/blog - postgresql-change-data-capture-with-debezium](https://www.crunchydata.com/blog/postgresql-change-data-capture-with-debezium)
2. [www.iamninad.com - docker-compose-for-your-next-debezium-and-postgres-project](https://www.iamninad.com/posts/docker-compose-for-your-next-debezium-and-postgres-project/)
