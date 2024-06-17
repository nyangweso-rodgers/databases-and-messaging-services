# Kafka Connect

## Table Of Contents





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


