# Debezium Connector

## Table Of Contents

# Use Cases for Publishing Database Changes to Kafka

1. **Real-Time Analytics**: Feeding database changes to a real-time analytics system to provide up-to-the-minute insights.
2. **Event-Driven Architecture**: Enabling services to react to database changes, triggering workflows or business processes.
3. **Cache Invalidation**: Automatically invalidating or updating cache entries based on database changes to ensure consistency.
4. **Data Replication**: Replicating data across different data stores or geographic regions for redundancy and high availability.
5. **Audit Logging**: Keeping a comprehensive audit log of all changes made to database for compliance and debugging purposes.

# What Is Change Data Capture (CDC)?

# Use-cases of CDC

1. OLAP (online analytical processing) systems use CDC to migrate data from transactional databases to analytical databases.
2. OLTP (online transactional processing) systems can also use CDC as an event bus to replicate data in a different data store. For example, from MySQL to Elasticsearch.

# What is Debezium?

- **Debezium** is an open-source, distributed system that enables users to capture real-time changes so that applications can notice such changes and react to them. It consists of **connectors** that record all real-time data changes and store them as events in **Kafka topics**.
- **Debezium** supports various databases, including **PostgreSQL**, **MySQL**, and **MongoDB**, making it a versatile choice for change data capture (CDC) needs.

# Docker Compose Setup

## 1. Configure Debezium Docker Container

- Configure Debezium Docker Container By:
  ```yml
  version: "2"
  services:
    connect:
      image: debezium/connect:latest
      restart: always
      container_name: connect
      depends_on:
        - kafka
      ports:
        - "8083:8083"
      environment:
        BOOTSTRAP_SERVERS: kafka:9092
        GROUP_ID: 1
        CONFIG_STORAGE_TOPIC: connect_configs
        OFFSET_STORAGE_TOPIC: connect_offsets
        STATUS_STORAGE_TOPIC: connect_statuses
        CONFIG_STORAGE_REPLICATION_FACTOR: 2
        OFFSET_STORAGE_REPLICATION_FACTOR: 2
        STATUS_STORAGE_REPLICATION_FACTOR: 2
        CONNECT_KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
        CONNECT_VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
        CONNECT_KEY_CONVERTER_SCHEMAS_ENABLE: "false"
        CONNECT_VALUE_CONVERTER_SCHEMAS_ENABLE: "false"
        KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
        VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
        ENABLE_DEBEZIUM_SCRIPTING: "true"
        healthcheck:
          test:
            [
              "CMD",
              "curl",
              "--silent",
              "--fail",
              "-X",
              "GET",
              "http://localhost:8083/connectors",
            ]
          start_period: 10s
          interval: 10s
          timeout: 5s
          retries: 5
  ```
- The above configuration include:
  1. `GROUP_ID`: Sets the **consumer group ID** for **Kafka Connect**.
     - Example: `GROUP_ID: 1`
  2. `BOOTSTRAP_SERVERS`: Lists the Kafka bootstrap servers for **Kafka Connect** to communicate with.
     - Example: `BOOTSTRAP_SERVERS: kafka:29092`
  3. `CONFIG_STORAGE_TOPIC`: The **topic** where **connector** configurations are stored.
     - Example:`CONFIG_STORAGE_TOPIC: connect_configs`
  4. `OFFSET_STORAGE_TOPIC`: The **topic** where **offsets** are stored, tracking the progress of each **connector**.
     - Example: `OFFSET_STORAGE_TOPIC: connect_offsets`
  5. `STATUS_STORAGE_TOPIC`: The **topic** where the **status of connectors** and tasks are stored.
     - Example: `STATUS_STORAGE_TOPIC: connect_statuses`
  6. `CONFIG_STORAGE_REPLICATION_FACTOR`, `OFFSET_STORAGE_REPLICATION_FACTOR`, `STATUS_STORAGE_REPLICATION_FACTOR`: Set the replication factors for the respective **topics**, ensuring fault tolerance.
  7. `CONNECT_KEY_CONVERTER` and `CONNECT_VALUE_CONVERTER`: Specify the **converters** used for **keys** and **values**. In this case, the `JsonConverter` is used.
  8. `CONNECT_KEY_CONVERTER_SCHEMAS_ENABLE` and `CONNECT_VALUE_CONVERTER_SCHEMAS_ENABLE`: Disable **schema** support for the **converters**, using plain `JSON` instead.
  9. `KEY_CONVERTER` and `VALUE_CONVERTER`: Set the **converters** for `keys` and `values`.
  10. `ENABLE_DEBEZIUM_SCRIPTING`: Enables scripting support for Debezium connectors, allowing custom transformations.
- **Remarks**:
  - You can use `docker exec -it debezium sh` command to enter the **Debezium container** and verify the content of any mounted file. E.g.,
    ```bash
      docker exec -it debezium sh
    ```
  - Then, using the `cat /etc/debezium/bigquery-keyfile.json` command
    ```bash
      cat /etc/debezium/bigquery-keyfile.json
    ```

## 2. Configure Debezium UI

- **Debezium UI** is a graphical user interface for managing **Debezium connectors**. It simplifies the configuration, deployment, and monitoring of CDC (Change Data Capture) connectors, providing an intuitive way to handle data streaming from various databases to **Kafka**.
- Setup:
  ```yml
  services:
    debezium-ui:
      image: debezium/debezium-ui:latest
      restart: always
      container_name: debezium-ui
      hostname: debezium-ui
      depends_on:
        - connect
      ports:
        - "8181:8080"
      environment:
        KAFKA_CONNECT_URIS: http://connect:8083
  ```
- Alternatives
  - Kafka Connect UI (Open Source): A web-based interface to manage and monitor Kafka Connect connectors. (old)
  - Confluent Control Center (Enterprise): A comprehensive monitoring and management tool for Kafka clusters and connectors, including support for Debezium.

## 3. Define Debezium Connector Configuration File

- Create a configuration file named `register-postgresdb-source-connector-for-customer.json` with the following connector **configurations**:
  ```json
  { "name": "postgresdb-connector-for-customer" }
  ```
- Configuration are as follows:
  1.  `name` is the **name** of the connector that uses the configuration above; this `name` is later used for interacting with the **connector** (i.e., viewing the status/restarting/updating the configuration) via the **Kafka Connect REST API**; - Example: `"name": "postgresdb-connector-for-customer"`
  2.  `connector.class`: is the DBMS connector class to be used by the **connector** being configured;
  3.  `plugin.name` is the name of the plugin for the logical decoding of WAL data. The `wal2json`, `decoderbuffs`, and `pgoutput` plugins are available for selection. The first two require the installation of the appropriate DBMS extensions; `pgoutput` for **PostgreSQL** (version 10+) does not require additional actions;
  4.  `database.*` — options for connecting to the database, where database.server.name is the name of the **PostgreSQL** instance used to generate the topic name in the **Kafka cluster**;
  5.  `table.include.list` is the list of tables to track changes in; it has the `schema.table_name` format and cannot be used together with the `table.exclude.list`;
  6.  `topic.creation.default.cleanup.policy: "delete`" Possible values inclide:
      - `delete`
      - `compact`
  7.  `slot.name` is the name of the **PostgreSQL logical decoding slot**. The server streams events to the **Debezium connector** using this slot;
  8.  `publication.name` is the name of the **PostgreSQL publication** that the **connector** uses. If it doesn’t exist, **Debezium** will attempt to create it. The **connector** will fail with an error if the connector user does not have the necessary privileges (thus, you better create the publication as a superuser before starting the connector for the first time).
  9.  `heartbeat.interval.ms` — the interval (in milliseconds) at which the **connector** sends heartbeat messages to a **Kafka topic**;
  10. `heartbeat.action.query` is a query that the **connector** executes on the source database at each heartbeat message (this option was introduced in version 1.1);
  11. `transforms` defines the way the name of the target topic is changed:
      - `transforms.AddPrefix.type` specifies that regular expressions are used;
      - `transforms.AddPrefix.regex` specifies the mask used to rename the target topic;
      - `transforms.AddPrefix.replacement` contains the replacing string.
  12. `publication.autocreate.mode`:
      - Example: `"publication.autocreate": "filtered"`
      - Setting `publication.autocreate.mode` property to `"filtered"` instructs **Debezium** to automatically create a **publication** that includes only the tables listed in `table.include.list`. It doesn't specify the exact tables or schema you want to include. However, if you'll be defining your own **publication** explicitly (using `CREATE PUBLICATION` command ), this property is not necessary. Removing it from both connector configurations will streamline your setup.

# Remarks

1. From version 2.0, **Confluent Avro converters** was removed from Docker image. Here is the ticket https://issues.redhat.com/browse/DBZ-4952

# Debezium Source Connectors

## 1. Debezium Source Connector For PostgreSQL

- This how **Debezium** implements Change Data Capture (CDC) with **PostgreSQL**.

  1. **Debezium** connects to **PostgreSQL** as a **replication client**, which involves setting up a **Debezium connector** for **PostgreSQL**. This requires **PostgreSQL** to be configured with `wal_level` set to `logical`.
  2. When set up, **Debezium** creates a **logical replication slot** in **PostgreSQL**. This slot ensures that relevant WAL entries are retained until Debezium processes them, preventing data loss even if the Debezium connector goes offline temporarily.
  3. **Debezium** reads changes from the `WAL` through the **replication slot**. It decodes these changes from their binary format into a structured format (e.g., JSON) that represents the SQL operations.
  4. Each decoded change is then emitted as a separate event. These events contain all necessary information about the database changes, such as the type of operation (INSERT, UPDATE, DELETE), the affected table, and the old and new values of the modified rows.
  5. **Debezium** acts as a NATS producer, publishing each change event to a NATS topic (usually one topic per table).
  6. **Consumers** can subscribe to these NATS topics to receive real-time updates about database changes. This enables applications and microservices to react to data changes as they happen.

- Setting up **Debezium** with **PostgreSQL**

  - For **Debezium** to work with **Postgres**, **Postgres** needs to have the **logical replication** enabled. If we don't do this step, then **debezium** would not be able to capture the changes happening on **Postgres**.
  - The following services would be needed to make the **Debezium** and **Postgres** work locally::
    1. Kafka Broker - `localhost:29092`
    2. Zookeeper - `localhost:2181`
    3. Postgres - `localhost:5432`
    4. Debezium Connector - `localhost:8083`
    5. Schema Registry - `localhost:8081`
    6. Debezium UI - `localhost:8080`
    7. Rest-Proxy - This is optional, but helps with checking cluster metadata, topics etc - `localhost:8082`

- Step 1: Configure **Postgres** Docker Container

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

- Step 2: Connect to a **Postgres Docker** Container

  - To connect to a **PostgreSQL** instance running within a **Docker container**, you can use the `docker exec` command combined with the `psql` command:
  - Example:
    ```bash
      #accessing postgres docker container
      docker exec -it postgres psql -U admin -d users
    ```

- **Step 3**: Create Publications in PostgreSQL

  - Create **publications** for the respective tables in **PostgreSQL**.

    ```sql
      -- Connect to your PostgreSQL database
      psql -h localhost -U admin -d users

      -- Create a publication for the customer table
      CREATE PUBLICATION debezium_customers_publication FOR TABLE public.customers;

      -- Create a publication for the delegates_survey table
      CREATE PUBLICATION debezium_delegates_survey_publication FOR TABLE public.delegates_survey;
    ```

- **Step 4**: Verifying Postgres Docker Container Setup

  1. **Check Replication Slot Status**: Ensure both replication slots are correctly configured and active.
     ```sql
      SELECT * FROM pg_replication_slots;
     ```
  2. **Check Publications**: Verify that the publications include the correct tables.
     ```sql
      -- Check the publications
      SELECT * FROM pg_publication;
      -- Check the tables associated with each publication
      SELECT * FROM pg_publication_tables;
     ```
  3. **Check Kafka Topics**: Ensure that Kafka topics are created and data is being streamed correctly.

- **Step 5**: (Bonus) Remove the Unused debezium Slot

  1. Drop the Unused **Slot**:
     ```sql
      SELECT pg_drop_replication_slot('debezium');
     ```
  2. Verify **Slots** After Dropping:

     ```sql
      SELECT * FROM pg_replication_slots;
     ```

- Step 6: Define Connector Configuration File:
  ```json
  {
    "name": "postgresdb-connector-for-customer",
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
      "table.include.list": "public.customer",
      "heartbeat.interval.ms": "5000",
      "key.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": false,
      "topic.prefix": "test_db",
      "topic.creation.enable": "true",
      "topic.creation.default.replication.factor": "1",
      "topic.creation.default.partitions": "1",
      "topic.creation.default.cleanup.policy": "delete",
      "topic.creation.default.retention.ms": "604800000"
    }
  }
  ```
- **Step 7**: Register Source Connector with Kafka Connect
  - Use `curl` to make a **POST** request to your **Kafka Connect REST API** to register the connector.
  - Example 1: (For `customers`)
    ```sh
      curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @users.customers.json
    ```
- **Step 8**: Validate the Status of the Source Connector:

  - We can check that the upload is successful and the **connector** is running by:
    ```sh
      curl -X GET "http://localhost:8083/connectors/postgresdb-connector-for-customer-v1/status"
    ```

- **Step 9**: Test the Debezium Source Connector:

  - Test the Source Connector By Listing Kafka Topics
    - If there was no issue running the above steps we could confirm that our **connector** is working fine by checking if the **topic** is created for `customers` table by the **connector**.
      ```sh
        kafka-topics --bootstrap-server localhost:29092 --list
      ```
  - Test the Source Connector By Reading (Viewing) Data
    - We can check that the data availability on the **topic**.
    - There would be data present in the **topic** because when the **connector** starts it takes an initial snapshot of the database table. This is a default `config` named `snapshot.mode` which we didn't configure but is set to `initial` which means that the **connector** will do a snapshot on the initial run when it doesn't find the last known **offset** from the transaction log available for the database server.
      ```bash
        # kafka bash
        kafka-console-consumer --bootstrap-server localhost:29092 --topic users.public.customers --from-beginning
      ```

- **Step 10**: Delete the Debezium Source Connector
  - Remove the **connectors** by:
    ```sh
      curl -X DELETE http://localhost:8083/connectors/postgresdb-connector-for-customers-v1
    ```

## 2. Debezium Source Connector For MySQL

- Step 1 (Setup MySQL Docker Container):
  - Below our **docker-compose** file to deploy all the required services locally:
    ```yml
    version: "2"
    services:
      zookeeper:
      kafka:
      mysql:
        image:
        container_name: msql
        ports:
          - 3306:3306
        environment:
          - MYSQL_ROOT_PASSWORD=debezium
          - MYSQL_USER=mysqluser
          - MYSQL_PASSWORD=mysqlpw
      debezium:
    ```
- Step 2 (Configure Debezium to start syncing MySQL to Kafka):
  - Create a new file (“mysql-connector.json”) with these configurations:
    ```json
    {
      "name": "mysql-connector",
      "config": {
        "connector.class": "io.debezium.connector.mysql.MySqlConnector",
        "tasks.max": "1",
        "database.hostname": "mysql",
        "database.port": "3306",
        "database.user": "root",
        "database.password": "debezium",
        "database.server.id": "184054",
        "topic.prefix": "debezium",
        "database.include.list": "inventory",
        "schema.history.internal.kafka.bootstrap.servers": "kafka:9092",
        "schema.history.internal.kafka.topic": "schemahistory.inventory"
      }
    }
    ```
- Step 3 (Register MySQL Connector):
  - To register the connector, run the following command :
    ```sh
        curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @mysql-connector.json
    ```

## 3. Debezium connector for MongoDB Atlas

- **Debezium’s MongoDB connector** tracks a **MongoDB replica set** or a **MongoDB sharded cluster** for document changes in databases and collections, recording those changes as events in **Kafka topics**. The **connector** automatically handles the addition or removal of shards in a sharded cluster, changes in membership of each replica set, elections within each replica set, and awaiting the resolution of communications problems.

- Step (Configure MongoDB Atlas Connector):

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

- Step (Register MongoDB Atlas Connector):
  - Use `curl` to send the configuration to the **Kafka Connect API**:
  ```sh
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @register-participants-survey-mongodb-atlas-connector.json
  ```
- Step (Remove the connectors by):
  ```sh
    curl -X DELETE http://localhost:8083/connectors/participants-survey-mongodb-atlas-connector
  ```

## 4. Debezium Source Connector For MongoDB

# Resources and Further Reading

1. [https://github.com/data-burst/debezium_avro_integration](https://github.com/data-burst/debezium_avro_integration)
