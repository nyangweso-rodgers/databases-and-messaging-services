# Debezium connector for PostgreSQL

## Table Of Contents

# What is Change data capture?

# How Debezium Achieves CDC with PostgreSQL

- This how **Debezium** implements Change Data Capture (CDC) with **PostgreSQL**.
  1. **Debezium** connects to **PostgreSQL** as a **replication client**, which involves setting up a **Debezium connector** for **PostgreSQL**. This requires **PostgreSQL** to be configured with `wal_level` set to `logical`.
  2. When set up, **Debezium** creates a **logical replication slot** in **PostgreSQL**. This slot ensures that relevant WAL entries are retained until Debezium processes them, preventing data loss even if the Debezium connector goes offline temporarily.
  3. **Debezium** reads changes from the `WAL` through the **replication slot**. It decodes these changes from their binary format into a structured format (e.g., JSON) that represents the SQL operations.
  4. Each decoded change is then emitted as a separate event. These events contain all necessary information about the database changes, such as the type of operation (INSERT, UPDATE, DELETE), the affected table, and the old and new values of the modified rows.
  5. **Debezium** acts as a NATS producer, publishing each change event to a NATS topic (usually one topic per table).
  6. **Consumers** can subscribe to these NATS topics to receive real-time updates about database changes. This enables applications and microservices to react to data changes as they happen.

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

# Steps

## Step 1: Define Postgres Docker Configuration

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

### Step 1.1: Connect to a Postgres Docker Container

- To connect to a **PostgreSQL** instance running within a **Docker container**, you can use the `docker exec` command combined with the `psql` command:
- Example:
  ```bash
    #accessing postgres docker container
    docker exec -it postgres psql -U admin -d test_db
  ```
- Remarks:
  - Check my [GitHub Repo](https://github.com/nyangweso-rodgers/My-Databases/blob/main/02-Transactional-Databases/01-postgresql/02-connect-to-postgresql/01-psql-commands/Readme.md) for a list of `psql` commands

### Step 1.2: Create Publications in PostgreSQL

- Create **publications** for the respective tables in **PostgreSQL**.

  ```sql
    -- Connect to your PostgreSQL database
    psql -h localhost -U admin -d test_db

    -- Create a publication for the customer table
    CREATE PUBLICATION debezium_customer_publication FOR TABLE public.customer;

    -- Create a publication for the delegates_survey table
    CREATE PUBLICATION debezium_delegates_survey_publication FOR TABLE public.delegates_survey;
  ```

### Step 1.3: Verifying Postgres Docker Container Setup

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

### Step 1.4: Remove the Unused debezium Slot

1. Drop the Unused **Slot**:
   ```sql
    SELECT pg_drop_replication_slot('debezium');
   ```
2. Verify **Slots** After Dropping:
   ```sql
    SELECT * FROM pg_replication_slots;
   ```

## Step 2: Define Debezium Docker Configurations

```yml
version: "2"
services:
  debezium:
```

- Where:

  - The **kafka-connect** service is created from `debezium/connect` **Docker image** and exposes port `8083`. It is linked to the **kafka service**, and the following Kafka Connect-related environment variables have also been configured:
    1. `BOOTSTRAP_SERVERS: kafka:29092` - The Kafka broker to connect to.
    2. `GROUP_ID: 1`- Consumer group ID assigned to Kafka Connect consumer.
    3. `CONFIG_STORAGE_TOPIC: connect_configs`- Topic to store connector configuration.
    4. `OFFSET_STORAGE_TOPIC: connect_offsets` - Topic to store connector offsets.
    5. `STATUS_STORAGE_TOPIC: connect_statuses` - Topic to store connector status.

- **Remarks**:

  - For **Debezium** to work with **Postgres**, **Postgres** needs to have the **logical replication** enabled and if you observe the line command: `["postgres", "-c", "wal_level=logical"]` we are configuring the **Postgres DB** to start with `wal_level` as logical.
  - If we don't do this step, then **debezium** would not be able to capture the changes happening on **Postgres**. The default `wal_level` is `replica`.

- **Remarks**:
  - You can use `docker exec -it debezium sh` command to enter the **Debezium container** and verify the content of any mounted file. E.g.,
    ```bash
      docker exec -it debezium sh
    ```
  - Then, using the `cat /etc/debezium/bigquery-keyfile.json` command
    ```bash
      cat /etc/debezium/bigquery-keyfile.json
    ```

## Step 3: Define Zookeeper Docker Configurations

## Step 4: Define Kafka Docker Configurations

## Step 5: Define a Debezium Source Connector Configuration File

- Create a configuration file named `register-postgresdb-source-connector-for-customer.json` with the following connector **configurations**:

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

- Where:
  1. `name` is the **name** of the connector that uses the configuration above; this `name` is later used for interacting with the connector (i.e., viewing the status/restarting/updating the configuration) via the Kafka Connect REST API;
  2. `connector.class`: is the DBMS connector class to be used by the connector being configured;
  3. `plugin.name` is the name of the plugin for the logical decoding of WAL data. The `wal2json`, `decoderbuffs`, and `pgoutput` plugins are available for selection. The first two require the installation of the appropriate DBMS extensions; `pgoutput` for PostgreSQL (version 10+) does not require additional actions;
  4. `database.*` — options for connecting to the database, where database.server.name is the name of the PostgreSQL instance used to generate the topic name in the Kafka cluster;
  5. `table.include.list` is the list of tables to track changes in; it has the `schema.table_name` format and cannot be used together with the `table.exclude.list`;
  6. `heartbeat.interval.ms` — the interval (in milliseconds) at which the **connector** sends heartbeat messages to a **Kafka topic**;
  7. `heartbeat.action.query` is a query that the **connector** executes on the source database at each heartbeat message (this option was introduced in version 1.1);
  8. `slot.name` is the name of the **PostgreSQL logical decoding slot**. The server streams events to the **Debezium connector** using this slot;
  9. `publication.name` is the name of the **PostgreSQL publication** that the **connector** uses. If it doesn’t exist, **Debezium** will attempt to create it. The **connector** will fail with an error if the connector user does not have the necessary privileges (thus, you better create the publication as a superuser before starting the connector for the first time).
  10. `transforms` defines the way the name of the target topic is changed:
      - `transforms.AddPrefix.type` specifies that regular expressions are used;
      - `transforms.AddPrefix.regex` specifies the mask used to rename the target topic;
      - `transforms.AddPrefix.replacement` contains the replacing string.
  11. `topic.creation.default.cleanup.policy: "delete`
  - Possible values inclide:
    - `delete`
    - `compact`
  12. `publication.autocreate.mode`
      - Example: `"publication.autocreate": "filtered"`
      - Setting `publication.autocreate.mode` property to `"filtered"` instructs **Debezium** to automatically create a **publication** that includes only the tables listed in `table.include.list`. It doesn't specify the exact tables or schema you want to include. However, if you'll be defining your own **publication** explicitly (using `CREATE PUBLICATION` command ), this property is not necessary. Removing it from both connector configurations will streamline your setup.
  -

### Step 5.2: Register Postgres connector using HTTP API (Register Debezium Connector(s) using `curl` Commands)

- We need to register the **Postgres connector** using **HTTP API** so that **debezium** could read the transaction logs from the server.
- To **register** debezium **connector**, run the below `curl` commands:

  ```sh
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @register-customer-postgresdb-connector.json
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

### Step 5.3: Validate the Status of the Source Connector

- We can check that the upload is successful and the **connector** is running by:

```sh
  curl -X GET "http://localhost:8083/connectors/customer-postgresdb-connector/status"
```

- Sample Output:
  ```json
  {}
  ```
- The status message indicates that your **Kafka connector** is successfully running. Both the connector and its task are in the "`RUNNING`" state, which means it has been properly configured and is currently active.
- **Remarks**:
  - **Kafka connect** has a **REST** endpoint which we can use to find out things like what connectors are enabled in the container.
    ```sh
      curl -H "Accept:application/json" localhost:8083/connectors/
    ```
    - Sample output:
      ```sh
        ["delegates_surveys-pg-connector","register-customers-pg-connector"]
      ```

### Step 5.4: Test the Source Connector

#### Step 5.4.1: List Kafka Topics

- If there was no issue running the above steps we could confirm that our **connector** is working fine by checking if the **topic** is created for `customers` table by the **connector**.
  ```sh
    kafka-topics --bootstrap-server localhost:29092 --list
  ```
- Sample output:

#### Step 5.4.2: Reading (Viewing) Data

- We can check that the data availability on the **topic**.
- There would be data present in the **topic** because when the **connector** starts it takes an initial snapshot of the database table. This is a default `config` named `snapshot.mode` which we didn't configure but is set to `initial` which means that the **connector** will do a snapshot on the initial run when it doesn't find the last known **offset** from the transaction log available for the database server.
  ```bash
    #kafka bash
    kafka-console-consumer --bootstrap-server localhost:29092 --topic test_db.public.customer --from-beginning
  ```
  ep 4: Configure BigQuery Sink Connector (`com.wepay.kafka.connect.bigquery.BigQuerySinkConnector`)

### Step 5.5: Cleanup (Delete the Source Connector)

- Remove the **connectors** by:
  ```sh
    curl -X DELETE http://localhost:8083/connectors/customer-postgresdb-connector
  ```

## Step 7: Implement Sink Connector From Apache Kafka to Google BigQuery

- Implementation of a sink connetor from **Apache Kafka** to **Google BigQuery**.

### Step 7.1: Setup

- Create a `plugins/` directory.
- [Download BigQuery plugin](https://www.confluent.io/hub/wepay/kafka-connect-bigquery) put the contents into the `plugins/` directory
- Now your plugins directory should look like this:
  ```sh
    ls plugins
  ```
- Output:
  ```sh
    #output
  ```

### Step 7.2: Setting Up GCP BigQuery

- Example service account key file:
  ```json
  {}
  ```

### Step 7.3.: BigQuery Sink Connector Configurations

- Create a file, `register-sink-bigquery.json` to store the connector configuration.
  ```json
  {
    "name": "bigquery-sink-connector",
    "config": {
      "connector.class": "com.wepay.kafka.connect.bigquery.BigQuerySinkConnector",
      "defaultDataset": "kafka_dataset",
      "project": "general-364419"
    }
  }
  ```
- The **BigQuery Sink connector** can be configured using a variety of configuration **properties**:
  1. `defaultDataset`
     - The default dataset to be used
     - Typs is `string`
  2. `project`
     - The BigQuery project to write to.
     - Type: string
  3. `topics`:
     - A list of **Kafka topics** to read from.
  4. `autoCreateTables`:
     - Create **BigQuery** tables if they don’t already exist. This property should only be enabled for Schema Registry-based inputs: **Avro**, **Protobuf**, or **JSON Schema** (JSON_SR). Table creation is not supported for **JSON** input.
     - Type: boolean
     - Default: `false`
  5. `gcsBucketName`
     - The name of the bucket where **Google Cloud Storage** (GCS) blobs are located. These blobs are used to batch-load to **BigQuery**. This is applicable only if `enableBatchLoad` is configured.
     - Type: string
     - Default: “”
  6. `queueSize`:
     - The maximum size (or -1 for no maximum size) of the worker queue for **BigQuery** write requests before all topics are paused. This is a soft limit; the size of the queue can go over this before topics are paused. All topics resume once a flush is triggered or the size of the queue drops under half of the maximum size.
     - Type: long
     - Default: -1
     - Valid Values: [-1,…]
     - Importance: high
  7. `bigQueryRetry`:
     - The number of retry attempts made for a BigQuery request that fails with a backend error or a quota exceeded error.
     - Type: int
     - Default: 0
     - Valid Values: [0,…]
  8. `bigQueryRetryWait`
     - The minimum amount of time, in milliseconds, to wait between retry attempts for a **BigQuery** backend or quota exceeded error.
     - Type: long
     - Default: 1000
     - Valid Values: [0,…]
  9. `bigQueryMessageTimePartitioning`
     - Whether or not to use the message time when inserting records. Default uses the connector processing time.
     - Type: boolean
     - Default: false
  10. `bigQueryPartitionDecorator`
      - Whether or not to append partition decorator to BigQuery table name when inserting records. Default is true. Setting this to true appends partition decorator to table name (e.g. table$yyyyMMdd depending on the configuration set for bigQueryPartitionDecorator). Setting this to false bypasses the logic to append the partition decorator and uses raw table name for inserts.
      - Type: boolean
      - Default: true
  11. `timestampPartitionFieldName`
      - The name of the field in the value that contains the timestamp to partition by in BigQuery and enable timestamp partitioning for each table. Leave this configuration blank, to enable ingestion time partitioning for each table.
      - Type: string
      - Default: null
  12. `clusteringPartitionFieldNames`
      - Comma-separated list of fields where data is clustered in BigQuery.
      - Type: list
      - Default: null
  13. `timePartitioningType`
      - The time partitioning type to use when creating tables. Existing tables will not be altered to use this partitioning type.
      - Type: string
      - Default: DAY
      - Valid Values: (case insensitive) [MONTH, YEAR, HOUR, DAY]
  14. `keySource`
      - Determines whether the keyfile configuration is the path to the credentials JSON file or to the JSON itself. Available values are `FILE` and `JSON`. This property is available in BigQuery sink connector version 1.3 (and later).
      - Type: string
      - Default: FILE
  15. `keyfile`
      - `keyfile` can be either a string representation of the Google credentials file or the path to the Google credentials file itself. The string representation of the Google credentials file is supported in BigQuery sink connector version 1.3 (and later).
      - Type: string
      - Default: null
  16. `sanitizeTopics`
      - Designates whether to automatically sanitize topic names before using them as table names. If not enabled, topic names are used as table names.
      - Type: boolean
      - Default: false
  17. `schemaRetriever`
      - A class that can be used for automatically creating tables and/or updating schemas. Note that in version 2.0.0, SchemaRetriever API changed to retrieve the schema from each SinkRecord, which will help support multiple schemas per topic. `SchemaRegistrySchemaRetriever` has been removed as it retrieves schema based on the topic.
      - Type: class
      - Default: `com.wepay.kafka.connect.bigquery.retrieve.IdentitySchemaRetriever`
  18. `threadPoolSize`
      - The size of the BigQuery write thread pool. This establishes the maximum number of concurrent writes to BigQuery.
      - Type: int
      - Default: 10
      - Valid Values: [1,…]
  19. `allBQFieldsNullable`
      - If true, no fields in any produced BigQuery schema are REQUIRED. All non-nullable Avro fields are translated as NULLABLE (or REPEATED, if arrays).
      - Type: boolean
      - Default: false
  20. `avroDataCacheSize`
      - The size of the cache to use when converting schemas from Avro to Kafka Connect.
      - Type: int
      - Default: 100
      - Valid Values: [0,…]
  21. `batchLoadIntervalSec`
      - The interval, in seconds, in which to attempt to run GCS to BigQuery load jobs. Only relevant if `enableBatchLoad` is configured.
      - Type: int
      - Default: 120
  22. `convertDoubleSpecialValues`
      - Designates whether +Infinity is converted to Double.MAX_VALUE and whether -Infinity and NaN are converted to Double.MIN_VALUE to ensure successfull delivery to BigQuery.
      - Type: boolean
      - Default: false
  23. `enableBatchLoad`
      - **Beta Feature** Use with caution. The sublist of topics to be batch loaded through GCS.
      - Type: list
      - Default: “”
  24. `includeKafkaData`
      - Whether to include an extra block containing the Kafka source topic, offset, and partition information in the resulting BigQuery rows.
      - Type: boolean
      - Default: false
  25. `upsertEnabled`
      - Enable upsert functionality on the connector through the use of record keys, intermediate tables, and periodic merge flushes. Row-matching will be performed based on the contents of record keys. This feature won’t work with SMTs that change the name of the topic and doesn’t support JSON input.
      - Type: boolean
      - Default: false
  26. `deleteEnabled`
      - Enable delete functionality on the connector through the use of record keys, intermediate tables, and periodic merge flushes. A delete will be performed when a record with a null value (that is–a tombstone record) is read. This feature will not work with SMTs that change the name of the topic and doesn’t support JSON input.
      - Type: boolean
      - Default: false
  27. `intermediateTableSuffix`
      - A suffix that will be appended to the names of destination tables to create the names for the corresponding intermediate tables. Multiple intermediate tables may be created for a single destination table, but their names will always start with the name of the destination table, followed by this suffix, and possibly followed by an additional suffix.
      - Type: string
      - Default: “tmp”
  28. `mergeIntervalMs`
      - How often (in milliseconds) to perform a merge flush, if upsert/delete is enabled. Can be set to -1 to disable periodic flushing.
      - Type: long
      - Default: 60_000L
  29. `mergeRecordsThreshold`
      - How many records to write to an intermediate table before performing a merge flush, if upsert/delete is enabled. Can be set to `-1` to disable record count-based flushing.
      - Type: long
      - Default: -1
  30. `autoCreateBucket`
      - Whether to automatically create the given bucket, if it does not exist.
      - Type: boolean
      - Default: true
  31. `allowNewBigQueryFields`
      - If true, new fields can be added to BigQuery tables during subsequent schema updates.
      - Type: boolean
      - Default: false
  32. `allowBigQueryRequiredFieldRelaxation`
      - If true, fields in BigQuery Schema can be changed from `REQUIRED` to `NULLABLE`. Note that `allowNewBigQueryFields` and `allowBigQueryRequiredFieldRelaxation` replaced the `autoUpdateSchemas` parameter of older versions of this connector.
        - Type: boolean
        - Default: false
  33. `allowSchemaUnionization`
      - If true, the existing table schema (if one is present) will be unionized with new record schemas during schema updates. If false, the record of the last schema in a batch will be used for any necessary table creation and schema update attempts.
      - Type: boolean
      - Default: false
  34. `kafkaDataFieldName`
      - The **Kafka data field name**. The default value is null, which means the **Kafka Data** field will not be included.
      - Type: `string`
      - Default: `null`
  35. `kafkaKeyFieldName`
      - The Kafka key field name. The default value is `null`, which means the **Kafka Key** field will not be included.
      - Type: `string`
      - Default: `null`
  36. `topic2TableMap`
      - Map of **topics** to **tables** (optional). Format: comma-separated tuples, e.g. <topic-1>:<table-1>,<topic-2>:<table-2>,.. Note that **topic name** should not be modified using regex SMT while using this option. Also note that `SANITIZE_TOPICS_CONFIG` would be ignored if this config is set. Lastly, if the `topic2table` map doesn’t contain the topic for a record, a table with the same name as the topic name would be created.
      - Type: string
      - Default: “”
- **Remarks**:
  - If your **kafka connect** is deployed in **kubernetes** or a **compute engine**, you can remove the attribute `“keyfile”` and use directly workload identity.

### Step 7.4: Register BigQuery Sink Connector

- **Register the Bigquery sink** by:
  ```sh
    #register bigquery sink connector
    curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @register-bigquery-sink-connector-for-customer-v1.json
  ```
- Sample output:
  ```json
  {
    "name": "customer-bigquery-sink-connector",
    "config": {
      "connector.class": "com.wepay.kafka.connect.bigquery.BigQuerySinkConnector",
      "tasks.max": "1",
      "consumer.auto.offset.reset": "earliest",
      "topics": "test_db.public.customer",
      "keyfile": "/etc/debezium/bigquery-keyfile.json",
      "project": "general-364419",
      "defaultDataset": "kafka_dataset",
      "allBQFieldsNullable": "true",
      "allowNewBigQueryFields": "true",
      "errors.tolerance": "all",
      "errors.log.enabled": "true",
      "errors.log.include.messages": "true",
      "key.converter": "org.apache.kafka.connect.storage.StringConverter",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": "false",
      "topicsToTables": "test_db.public.customer=test_db_public_customer",
      "name": "customer-bigquery-sink-connector"
    },
    "tasks": [],
    "type": "sink"
  }
  ```

### Step 7.5: Check Status Of The BigQuery Sink Connector

- Verify the status of the **connector** to ensure it is running without errors:
  ```sh
    curl -X GET http://localhost:8083/connectors/customer-bigquery-sink-connector-v1/status
  ```
- **Sample output** (**successful** connection):
  ```json
  {
    "name": "customer_bigquery_sink_connector",
    "connector": { "state": "RUNNING", "worker_id": "172.22.0.7:8083" },
    "tasks": [{ "id": 0, "state": "RUNNING", "worker_id": "172.22.0.7:8083" }],
    "type": "sink"
  }
  ```
- **Sample output** (**FAILED** connection)
  ```json
  {
    "name": "customer-bigquery-sink-connector",
    "connector": { "state": "RUNNING", "worker_id": "172.22.0.5:8083" },
    "tasks": [
      {
        "id": 0,
        "state": "FAILED",
        "worker_id": "172.22.0.5:8083",
        "trace": "org.apache.kafka.connect.errors.ConnectException: Exiting WorkerSinkTask due to unrecoverable exception.\n\tat org.apache.kafka.connect.runtime.WorkerSinkTask.deliverMessages(WorkerSinkTask.java:632)\n\tat org.apache.kafka.connect.runtime.WorkerSinkTask.poll(WorkerSinkTask.java:350)\n\tat org.apache.kafka.connect.runtime.WorkerSinkTask.iteration(WorkerSinkTask.java:250)\n\tat org.apache.kafka.connect.runtime.WorkerSinkTask.execute(WorkerSinkTask.java:219)\n\tat org.apache.kafka.connect.runtime.WorkerTask.doRun(WorkerTask.java:204)\n\tat org.apache.kafka.connect.runtime.WorkerTask.run(WorkerTask.java:259)\n\tat org.apache.kafka.connect.runtime.isolation.Plugins.lambda$withClassLoader$1(Plugins.java:236)\n\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)\n\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)\n\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)\n\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)\n\tat java.base/java.lang.Thread.run(Thread.java:829)\nCaused by: com.google.cloud.bigquery.BigQueryException: Invalid table ID \"test_db.public.customer\".\n\tat com.google.cloud.bigquery.spi.v2.HttpBigQueryRpc.translate(HttpBigQueryRpc.java:115)\n\tat com.google.cloud.bigquery.spi.v2.HttpBigQueryRpc.getTable(HttpBigQueryRpc.java:286)\n\tat com.google.cloud.bigquery.BigQueryImpl$18.call(BigQueryImpl.java:761)\n\tat com.google.cloud.bigquery.BigQueryImpl$18.call(BigQueryImpl.java:758)\n\tat com.google.api.gax.retrying.DirectRetryingExecutor.submit(DirectRetryingExecutor.java:103)\n\tat com.google.cloud.RetryHelper.run(RetryHelper.java:76)\n\tat com.google.cloud.RetryHelper.runWithRetries(RetryHelper.java:50)\n\tat com.google.cloud.bigquery.BigQueryImpl.getTable(BigQueryImpl.java:757)\n\tat com.wepay.kafka.connect.bigquery.BigQuerySinkTask.retrieveTable(BigQuerySinkTask.java:395)\n\tat java.base/java.util.HashMap.computeIfAbsent(HashMap.java:1134)\n\tat com.wepay.kafka.connect.bigquery.BigQuerySinkTask.retrieveCachedTable(BigQuerySinkTask.java:390)\n\tat com.wepay.kafka.connect.bigquery.BigQuerySinkTask.getRecordTable(BigQuerySinkTask.java:235)\n\tat com.wepay.kafka.connect.bigquery.BigQuerySinkTask.writeSinkRecords(BigQuerySinkTask.java:268)\n\tat com.wepay.kafka.connect.bigquery.BigQuerySinkTask.put(BigQuerySinkTask.java:321)\n\tat org.apache.kafka.connect.runtime.WorkerSinkTask.deliverMessages(WorkerSinkTask.java:601)\n\t... 11 more\nCaused by: com.google.api.client.googleapis.json.GoogleJsonResponseException: 400 Bad Request\nGET https://www.googleapis.com/bigquery/v2/projects/general-364419/datasets/kafka_dataset/tables/test_db.public.customer?prettyPrint=false\n{\n  \"code\" : 400,\n  \"errors\" : [ {\n    \"domain\" : \"global\",\n    \"message\" : \"Invalid table ID \\\"test_db.public.customer\\\".\",\n    \"reason\" : \"invalid\"\n  } ],\n  \"message\" : \"Invalid table ID \\\"test_db.public.customer\\\".\",\n  \"status\" : \"INVALID_ARGUMENT\"\n}\n\tat com.google.api.client.googleapis.json.GoogleJsonResponseException.from(GoogleJsonResponseException.java:146)\n\tat com.google.api.client.googleapis.services.json.AbstractGoogleJsonClientRequest.newExceptionOnError(AbstractGoogleJsonClientRequest.java:118)\n\tat com.google.api.client.googleapis.services.json.AbstractGoogleJsonClientRequest.newExceptionOnError(AbstractGoogleJsonClientRequest.java:37)\n\tat com.google.api.client.googleapis.services.AbstractGoogleClientRequest$1.interceptResponse(AbstractGoogleClientRequest.java:428)\n\tat com.google.api.client.http.HttpRequest.execute(HttpRequest.java:1111)\n\tat com.google.api.client.googleapis.services.AbstractGoogleClientRequest.executeUnparsed(AbstractGoogleClientRequest.java:514)\n\tat com.google.api.client.googleapis.services.AbstractGoogleClientRequest.executeUnparsed(AbstractGoogleClientRequest.java:455)\n\tat com.google.api.client.googleapis.services.AbstractGoogleClientRequest.execute(AbstractGoogleClientRequest.java:565)\n\tat com.google.cloud.bigquery.spi.v2.HttpBigQueryRpc.getTable(HttpBigQueryRpc.java:284)\n\t... 24 more\n"
      }
    ],
    "type": "sink"
  }
  ```

## Step 4.5: BigQuery Sink Connector Configuration Validation

- Validate the connector configuration to see if there are any misconfigurations:
  ```sh
    curl -X PUT -H "Content-Type: application/json" http://localhost:8083/connector-plugins/com.wepay.kafka.connect.bigquery.BigQuerySinkConnector/config/validate -d @register-bigquery-sink-connector-for-customer-v1.json
  ```
- Sample output
  ```json
  {
    "error_code": 500,
    "message": "Cannot deserialize value of type `java.lang.String` from Object value (token `JsonToken.START_OBJECT`)\n at [Source: (org.glassfish.jersey.message.internal.ReaderInterceptorExecutor$UnCloseableInputStream); line: 1, column: 59] (through reference chain: java.util.LinkedHashMap[\"config\"])"
  }
  ```

## Step 4.6: Delete BigQuery Sink Connector

- Delete the existing **connector** by:
  ```sh
    #delete sink connector
    curl -X DELETE http://localhost:8083/connectors/customer-bigquery-sink-connector-v1
  ```

## Step 4.4: Debugging BigQuery Sink Connector

### Step 4.4.1: Verify Plugin Detection

- Check if the **connector** is detected by listing the available plugins:
  ```sh
    curl -X GET http://localhost:8083/connector-plugins
  ```
- Sample output:
  ```json
  [
    {
      "class": "com.wepay.kafka.connect.bigquery.BigQuerySinkConnector",
      "type": "sink",
      "version": "unknown"
    },
    {
      "class": "io.debezium.connector.jdbc.JdbcSinkConnector",
      "type": "sink",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.db2.Db2Connector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.informix.InformixConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.mongodb.MongoDbConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.mysql.MySqlConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.oracle.OracleConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.postgresql.PostgresConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.spanner.SpannerConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.sqlserver.SqlServerConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "io.debezium.connector.vitess.VitessConnector",
      "type": "source",
      "version": "2.5.0.Final"
    },
    {
      "class": "org.apache.kafka.connect.mirror.MirrorCheckpointConnector",
      "type": "source",
      "version": "3.6.1"
    },
    {
      "class": "org.apache.kafka.connect.mirror.MirrorHeartbeatConnector",
      "type": "source",
      "version": "3.6.1"
    },
    {
      "class": "org.apache.kafka.connect.mirror.MirrorSourceConnector",
      "type": "source",
      "version": "3.6.1"
    }
  ]
  ```

### Step 4.4.2: Inspect Logs

- If the **connector** is still not detected, inspect the logs of the **Debezium** container for any errors related to **plugin** loading:
  ```sh
    docker logs debezium
  ```

# PostgreSQL connector limitations

1. The connector relies on PostgreSQL’s logical decoding feature. Therefore, it does not capture **DDL** changes and is unable to reflect these events in topics.
2. Replication slots mean that the connector can only be connected to the primary database instance.
3. If the connector user has read-only access, you will need to manually create the replication slot and the database publication.

# Resources and Further Reading

1. [runchydata.com/blog - postgresql-change-data-capture-with-debezium](https://www.crunchydata.com/blog/postgresql-change-data-capture-with-debezium)
2. [www.iamninad.com - docker-compose-for-your-next-debezium-and-postgres-project](https://www.iamninad.com/posts/docker-compose-for-your-next-debezium-and-postgres-project/)
3. [docs.confluent.io/kafka-connectors - bigquery/current/kafka_connect_bigquery_config](https://docs.confluent.io/kafka-connectors/bigquery/current/kafka_connect_bigquery_config.html)

```

```
