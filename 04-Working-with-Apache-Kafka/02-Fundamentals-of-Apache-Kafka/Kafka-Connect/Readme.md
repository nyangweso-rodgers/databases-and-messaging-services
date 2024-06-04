# Kafka Connect

## Table Of Contents

# Kafka Connect

- **Kafka Connect** is a tool for scalably and reliably streaming data between **Apache Kafka** and other data systems. It makes it simple to quickly define **connectors** that move large data sets in and out of **Kafka**. **Kafka Connect** can ingest entire databases or collect metrics from all your application servers into **Kafka topics**, making the data available for **stream processing** with low latency.

# Types Of Kafka Connectors

- There are two types of Kafka connectors:
  1. **Source connector**: Used to move data from source systems to **Kafka topics**.
  2. **Sink connector**: Used to send data from **Kafka topics** into target (sink) systems.

# What is Debezium?

- **Debezium** is a set of **source connectors** for **Kafka Connect**. We can use it to capture changes in our databases so that your applications can respond to them in real-time.
- **Debezium** is built upon the **Apache Kafka** project and uses **Kafka** to transport the changes from one system to another. The most interesting aspect of **Debezium** is that at the core it is using **Change Data Capture** (CDC) to capture the data and push it into **Kafka**. The advantage of this is that the source database remains untouched in the sense that we don’t have to add triggers or log tables. This is a huge advantage as triggers and log tables degrade performance.

# Run Debezium Kafka Connect using Docker

```yml
# debezium connector
debezium:
  #image: debezium/connect:1.9
  image: debezium/connect:latest
  ports:
    - 8083:8083
  environment:
    CONFIG_STORAGE_TOPIC: my_connect_configs
    OFFSET_STORAGE_TOPIC: my_connect_offsets
    STATUS_STORAGE_TOPIC: my_connect_statuses
    BOOTSTRAP_SERVERS: kafka:29092
  links:
    - zookeeper
    - postgres
  depends_on:
    - kafka
    - zookeeper
    - postgres
    - mongo
```

- Where:
  - `BOOTSTRAP_SERVERS: kafka:29092` - The **Kafka broker** to connect to.
  - `GROUP_ID: 1`: - Consumer group ID assigned to Kafka Connect consumer.
  - `CONFIG_STORAGE_TOPIC` - Topic to store connector configuration.
  - `OFFSET_STORAGE_TOPIC` - Topic to store connector offsets.
  - `STATUS_STORAGE_TOPIC` - Topic to store connector status.

# Configure Debezium to Capture CDC Events

## Method 1: REST API

- Assuming that the **Debezium** is up and running, we can then configure a **connector** to the source database using **Kafka Connect REST API**
- The **Debezium** **connectors** are created using **Kafka Connect REST API**, so make sure either **curl** or **Postman** is installed in your development box.

### Step 1: Verify that Kafka Connect is installed and running

- The default port for **Kafka Connect API** is `8083`. Assuming that it runs on localhost, the URL for the API endpoint which returns configured connectors is:
  ```sh
    http://localhost:8083/connectors
  ```

### Step 2. Create a new connector for Microsoft SQL Server

- **ENDPOINT URL**: http://localhost:8083/connectors
- **METHOD**: `POST`
- **PAYLOAD** (example):

  ```json
  {
    "name": "sqlserver-connector",
    "config": {
      "connector.class": "io.debezium.connector.sqlserver.SqlServerConnector",
      "tasks.max": "1",
      "database.hostname": "localhost",
      "database.port": "1433",
      "database.user": "sa",
      "database.password": "password",
      "database.dbname": "database_name",
      "database.server.name": "database_server_name",
      "table.whitelist": "comma separated list of fully_qualified_table_names",
      "database.history.kafka.bootstrap.servers": "localhost:9092",
      "database.history.kafka.topic": "dbhistory.database_server_name.database_name",

      "key.converter": "org.apache.kafka.connect.json.JsonConverter",
      "key.converter.schemas.enable": "true",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": "true",
      "include.schema.changes": "true"
    }
  }
  ```

## Method 2: Debezium UI

- The alternative to **REST API** for creating **Debezium connectors** is a **Debezium UI**.
- To start **Debezium UI** open the following URL in the browser: http://localhost:8090/
- Remark: **The naming convention for Kafka topics**
  - **Debezium** stores CDC events in a separate **topic** for each table. If the connector was configured using the following parameters:
    ```json
      "database.dbname": "database_name",
      "database.server.name": "database_server_name",
    ```
  - The CDC events for the table `customer` will be stored in a **Kafka topic** `database_server_name.database_name.customer`
- Create a Flow to stream CDC events created by Debezium into any destination as follows:

### Step 1: Create and configure source connection for message queue

### Step 2: When configuring a source connection, make sure Integration with CDC provider is set to Debezium

### Step 3: Create a streaming flow for any of the following destinations

- Create a streaming flow for any of the following destinations:
  - File storage
  - Relational database
  - Database which supports the bulk storage
  - Snowflake
  - Amazon Redshift.
  - Google BigQuery.
  - Azure Synapse Analytics.
  - Greenplum.
  - Vertica.

#### Step 4. Configure TO (destination).

- The **TO** depends on the type of destination.

##### Step 4.1: For Relational Database

- For Relational database, the **TO** is a **destination table name**.
- The **TO** in the streaming transformation can include any of the **[tokens]** below:
  - `[table]` - the source table name.
  - `[db]` - the source database name.
  - `[schema]` - the source schema.
  - `*` - the source topic name.

##### Step 4.2: For Google BigQuery

- For Google BigQuery, the **TO** is the **destination table name**.
- It is recommended to set **TO** as `project.schema.*`. In this case, the flow will load data into the table with the same (or modified) name as the source table or topic

#### Step 5: Schedule the Flow

- We recommend using a [continuous run Schedule type](). The idea is that the streaming Flow runs indefinitely or until there are no messages to extract, or it stops if there is an error. When the Flow stops for any of the reasons above, it restarts automatically after the configured number of seconds.

# Resources and Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
2. [runchydata.com/blog - postgresql-change-data-capture-with-debezium](https://www.crunchydata.com/blog/postgresql-change-data-capture-with-debezium)
3. [official tutorial for Debezium UI ](https://debezium.io/blog/2021/08/12/introducing-debezium-ui/)
