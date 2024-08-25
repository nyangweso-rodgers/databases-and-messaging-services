# cp-kafka-connect

## Table Of Contents

# What is Kafka Connect

- **Kafka Connect** is a tool for scalably and reliably streaming data between **Apache Kafka** and other data systems. It makes it simple to quickly define **connectors** that move large data sets in and out of **Kafka**. **Kafka Connect** can ingest entire databases or collect metrics from all your application servers into **Kafka topics**, making the data available for stream processing with low latency. An export **connector** can deliver data from **Kafka topics** into secondary indexes like Elasticsearch, or into batch systems–such as Hadoop for offline analysis.

# Benefits of cp-kafka-connect

# Modes Of Execution

- **Kafka Connect** currently supports two modes of execution:
  1. standalone (single process) and
  2. distributed.
- In **standalone mode**, all work is performed in a single process it's simpler to get started with and may be useful in situations where only one worker makes sense (e.g. collecting log files), but it does not benefit from some of the features of **Kafka Connect** such as fault tolerance.
- **Distributed mode** handles automatically the balancing of work, allows you to scale up (or down) dynamically, and offers fault tolerance both in the active tasks and for configuration and offset commit data.

# Kafka Connect Concepts

## 1. Connectors

- **Kafka Connect** includes two types of connectors:
  1. **Source Connector**: ingest entire databases and stream table updates to **Kafka topics**. **Source connectors** can also collect metrics from all your application servers and store the data in Kafka topics–making the data available for stream processing with low latency.
  2. **Sink Connector**: deliver data from **Kafka topics** to secondary indexes, such as Elasticsearch, or batch systems such as Hadoop for offline analysis.
- Remark:
  - Confluent offers several [pre-built connectors](https://www.confluent.io/product/connectors/?session_ref=https://www.google.com/&_ga=2.266203727.1350022208.1723832910-234518971.1709664712&_gl=1*ss8h9o*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyMzk5MDkzNi4xNDQuMS4xNzIzOTkxOTE1LjQ4LjAuMA..) that can be used to stream data to or from commonly used systems.

## 2. Task

- **Tasks** are independent units of work that enable parallel data processing in **Kafka Connect**. When a **connector** is created, **Kafka Connect** divides its work into multiple **tasks** based on the configured level of parallelism.

### Task Assignment

- Each **task** processes a subset of the data for a **connector**. For example, if the source system is a database table, you may assign each task a partition of the table data based on some criteria like a column value.
- Some ways in which **tasks** can be assigned partitions:
  1. Round-robin for non-partitioned tables
  2. Hash partitioning based on the hash of the primary key column
  3. Time-based date or timestamp ranges
  4. Custom like any application-specific logic
- If there are no natural partitions, **Kafka Connect** distributes partitions across tasks randomly using round-robin.

### Task Configuration

- **Tasks** inherit most configurations from their parent connector but also allow some custom settings such as:
  1. **transforms** - Data manipulation logic
  2. **converters** - Serialization formats
- Examples:

  - MySQL Connector (This MySQL source connector with four tasks inserts a "topic" field to records using a transformation before publishing to Kafka)

    ```json
    {
      "connector.class": "MySqlSourceConnector",

      "tasks.max": "4",

      "transforms": "insertTopic",

      "transforms.insertTopic.type": "org.apache.kafka.connect.transforms.InsertField$Value",

      "transforms.insertTopic.topic.field": "topic"
    }
    ```

## 3. Workers

- A **worker** denotes a server capable of executing **connectors** and **tasks**, overseeing their lifecycle, and offering scalability.

## 4. Converters

- **Converters** are required to have a **Kafka Connect** deployment support a particular data format when writing to, or reading from **Kafka**. Tasks use **converters** to change the format of data from bytes to a Connect internal data format and vice versa.
- By default, **Confluent Platform** provides the following converters:
  1. **AvroConverter** `io.confluent.connect.avro.AvroConverter`: use with [Schema Registry]()
  2. **ProtobufConverter**: `io.confluent.connect.protobuf.ProtobufConverter`: use with [Schema Registry]()
  3. **JsonSchemaConverter** `io.confluent.connect.json.JsonSchemaConverter`: use with [Schema Registry]()
  4. **JsonConverter** `org.apache.kafka.connect.json.JsonConverter` (without Schema Registry): use with structured data
  5. **StringConverter** `org.apache.kafka.connect.storage.StringConverter`: simple string format
  6. **ByteArrayConverter** `org.apache.kafka.connect.converters.ByteArrayConverter`: provides a “pass-through” option that does no conversion
- Remark:
  - **Converters** are decoupled from **connectors** themselves to allow for the reuse of **converters** between **connectors**. For example, using the same **Avro converter**, the **JDBC Source Connector** can write **Avro** data to **Kafka**, and the HDFS Sink Connector can read Avro data from Kafka

### 4.1: Using String Converter

- Here’s an example of using the **String converter**. Since it’s just a **string**, there’s no **schema** to the data, and thus it’s not so useful to use for the **value**:
  ```json
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
  ```

### 4.2: Using JSON Converter (`JsonConverter`)

- For **JSON**, you need to specify if you want **Kafka Connect** to embed the **schema** in the **JSON** itself.
- Whilst **JSON** does not by default support carrying a **schema**, **Kafka Connect** supports two ways that you can still have a declared **schema** and use **JSON**:
  - The first is to use **JSON Schema** with the **Confluent Schema Registry**.
  - If you cannot use the **Schema Registry** then your second (less optimal option) is to use **Kafka Connect’s** support of a particular structure of **JSON** in which the **schema** is embedded. The resulting data size can get large as the **schema** is included in every single message along with the **schema**.
- If you’re setting up a **Kafka Connect source** and want **Kafka Connect** to include the **schema** in the message it writes to **Kafka**, you’d set:
  ```json
    "value.converter":"org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable":true
  ```
- The resulting message to **Kafka** would look like the example below, with **schema** and **payload** top-level elements in the **JSON**:
  ```json
  {
    "schema": {
      "type": "struct",
      "fields": [
        {
          "type": "int64",
          "optional": false,
          "field": "registertime"
        },
        {
          "type": "string",
          "optional": false,
          "field": "userid"
        },
        {
          "type": "string",
          "optional": false,
          "field": "regionid"
        },
        {
          "type": "string",
          "optional": false,
          "field": "gender"
        }
      ],
      "optional": false,
      "name": "ksql.users"
    },
    "payload": {
      "registertime": 1493819497170,
      "userid": "User_1",
      "regionid": "Region_5",
      "gender": "MALE"
    }
  }
  ```
- **Note** the size of the message, as well as the proportion of it that is made up of the **payload** vs. the **schema**. Considering that this is repeated in every message, you can see why a serialisation format like **JSON Schema** or **Avro** makes a lot of sense, as the **schema** is stored separately and the message holds just the payload (and is compressed at that).
- **Remark**:
  - If you’re consuming **JSON** data from a **Kafka topic** into a **Kafka Connect sink**, you need to understand how the **JSON** was serialised. If it was with **JSON Schema serialiser**, then you need to set **Kafka Connect** to use the **JSON Schema converter** (`io.confluent.connect.json.JsonSchemaConverter`). If the **JSON** data was written as a plain **string**, then you need to determine if the data includes a nested **schema**. If it does—and it’s in the same format as above, not some arbitrary schema-inclusion format—then you’d set:
    ```json
      "value.converter":"org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable":true
    ```
  - However, if you’re consuming **JSON** data and it doesn’t have the **schema/payload** construct, such as this sample:
    ```json
    {
      "registertime": 1489869013625,
      "userid": "User_1",
      "regionid": "Region_2",
      "gender": "OTHER"
    }
    ```
  - …you must tell **Kafka Connect** not to look for a **schema** by setting `schemas.enable:false`:
    ```json
      "value.converter":"org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable":false
    ```
  - As before, remember that the **converter** configuration option (here, `schemas.enable`) needs the prefix of `key.converter` or `value.converter` as appropriate.

### 4.3: Using Avro Converter

- Some **converters** have additional configuration. For **Avro**, you need to specify the **Schema Registry**.
- When you specify converter-specific configurations, always use the `key.converter.` or `value.converter.` prefix. For example, to use **Avro** for the message payload, you’d specify the following:
  ```json
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "http://schema-registry:8081"
  ```

## 5. Transforms

- **Connectors** can be configured with **transformations** to make simple and lightweight modifications to individual messages.
- A **transform** is a simple function that accepts one record as an input and outputs a modified record. All transforms provided by Kafka Connect perform simple but commonly useful modificationss

### 5.1: Single Message Transforms (SMTs)

- **SMTs** allow you to modify the records in real-time before they are sent to the **Kafka topic**.
- Common **SMTs** include:
  1. `ExtractField`: Extracts a specific field from the **Key** or **Value**.
  2. `ReplaceField`: Removes or renames fields within a record.
  3. `ValueToKey`: Promotes one or more fields from the Value to the Key.
  4. `Cast`: Converts a field’s data type.
  5. `InsertField`: Adds a field with a specified value to the record.
  6. `MaskField`: Replaces a field’s value with a masked value (useful for sensitive data).
  7. `Filter`: Filters records based on conditions.
- Examles:
  1. `transforms": "InsertKey, ExtractId, CastLong"`
  2. `"transforms.InsertKey.type":`
  3. `"transforms.InsertKey.fields": "id"`
  4. `"transforms.ExtractId.type":`
  5. `"transforms.ExtractId.field": "id"`
  6. `"transforms.CastLong.type":`
  7. `"transforms.CastLong.spec": "int64"`
- Examle Scenario:
  1. Promoting a Field from Value to Key
     - You have a `customers` table, and each record has a `customer_id` in the **Value**. You want to use `customer_id` as the **Key** in **Kafka**.
     - SMT: `ValueToKey`
     - Configuration:
       ```json
       {
         "transforms": "InsertKey",
         "transforms.InsertKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
         "transforms.InsertKey.fields": "customer_id"
       }
       ```
     - Outcome: The `customer_id` field is promoted from the Value to the Key of the record.
  2. Removing Unnecessary Fields
     - You want to remove sensitive fields like `ssn` from the **Value** before the data is published to **Kafka**.
     - SMT: `ReplaceField`
     - Configuration:
       ```json
       {
         "transforms": "RemoveSSN",
         "transforms.RemoveSSN.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
         "transforms.RemoveSSN.blacklist": "ssn"
       }
       ```
     - Outcome: The ssn field is removed from the Value.
  3. Converting a Field’s Data Type
     - You have a `timestamp` field stored as a `string`, and you want to convert it to an `integer` (epoch time).
     - SMT: `Cast`
     - Configuration
       ```json
       {
         "transforms": "CastTimestamp",
         "transforms.CastTimestamp.type": "org.apache.kafka.connect.transforms.Cast$Value",
         "transforms.CastTimestamp.spec": "timestamp:int64"
       }
       ```
     - Outcome: The timestamp field is converted to a long integer representing epoch time.
  4. Filtering Out Records
     - You only want to send records where the status field is set to `active`.
     - SMT: `Filter`
     - Configuration
       ```json
       {
         "transforms": "FilterInactive",
         "transforms.FilterInactive.type": "org.apache.kafka.connect.transforms.Filter$Value",
         "transforms.FilterInactive.condition": "status == 'active'"
       }
       ```
     - Outcome: Only records with status set to active will be passed through; others will be filtered out.

## 6. Dead Letter Queues

- **Dead Letter Queues** (DLQs) are only applicable for **sink connectors**.
- An invalid record may occur for a number of reasons. One example is when a record arrives at a **sink connector** serialized in **JSON** format, but the **sink connector** configuration is expecting **Avro** format. When an invalid record can’t be processed by the **sink connector**, the error is handled based on the connector `errors.tolerance` configuration property.

### Create a Dead Letter Queue topic

- To create a **DLQ**, add the following configuration properties to your **sink connector** configuration:
  ```json
    errors.tolerance = all
    errors.deadletterqueue.topic.name = <dead-letter-topic-name>
  ```
- Even if the **DQL topic** contains the records that failed, it does not show why. You can add the following configuration property to include failed record header information.
  ```json
    errors.deadletterqueue.context.headers.enable=true
  ```

## 7. Kafka Connect Plugin

- A **Kafka Connect plugin** is a set of **JAR files** containing the implementation of one or more **connectors**, **transforms**, or **converters**. **Connect** isolates each **plugin** from one another so libraries in one **plugin** are not affected by the libraries in any other **plugins**. This is very important when mixing and matching **connectors** from multiple providers.
- A **Kafka Connect plugin** can be any one of the following:
  1. A directory on the file system that contains all required **JAR files** and third-party dependencies for the **plugin**. This is most common and is preferred.
  2. A single uber JAR containing all the class files for a plugin and its third-party dependencies.
- To install a **plugin**, you must place the **plugin directory** in a directory already listed in the plugin path.
- To find the components that fit your needs, check out the [Confluent Hub](https://www.confluent.io/hub/?session_ref=https://www.google.com/&_gl=1*1sogvi8*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyMzk5MDkzNi4xNDQuMS4xNzIzOTkzMjEzLjYwLjAuMA..&_ga=2.28774524.1350022208.1723832910-234518971.1709664712) page-it has an ecosystem of **connectors**,**transforms**, and **converters**. For a full list of supported **connectors**, see [Supported Self-Managed Connectors](https://docs.confluent.io/platform/current/connect/supported.html)

### 7.1: Avro Plugin

- The **Avro converter** is a **plugin** that allows **Kafka Connect** to handle data in the **Avro format**. It's typically included in pre-built **Kafka Connect** images like `confluentinc/cp-kafka-connect`.
- Remark:
  - If you're using a pre-built image, you generally don't need to install the **Avro plugin** separately. The image should already contain the necessary components.

# Setup

- We will set up:
  1. A postgres database
  2. A local Kafka cluster using Docker Compose
     - with Confluent Schema Registry to support Avro (de)serialization
  3. **Kafka Connect** instance, in distributed mode
     - with AKHQ to more easily create and manage connectors
  4. **Source connector** from the **Postgres** table to a **Kafka topic**
     - with database connection password as environment variable
  5. JMX metrics exported and scraped by Prometheus for monitoring
  6. **Grafana** dashboard to visualize & alert Connector status

# Running Kafka Connect in Docker

- [Confluent]() maintains its own image for **Kafka Connect**,[confluentinc/cp-kafka-connect](https://hub.docker.com/r/confluentinc/cp-kafka-connect), which provides a basic Connect worker to which you can add your desired **JAR files** for **sink** and **source connectors**, single message **transforms**, and **converters**.
- **Note**:
  - Starting with Confluent Platform version 6.0 release, many **connectors** previously bundled with Confluent Platform are now available for download from [Confluent Hub](https://www.confluent.io/hub/?_ga=2.262009677.1350022208.1723832910-234518971.1709664712&_gl=1*11la3pl*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyNDE1OTU2My4xNDcuMS4xNzI0MTYwNTU1LjM1LjAuMA..). For more information, see the [6.0 Connector Release Notes](https://docs.confluent.io/platform/current/release-notes/index.html#connectors).

## Step 1: Set up Postgres Database, Local Kafka Cluster,and Confluent Schema Registry

## Step 2: Configure Kafka Connect

- Setup Kafka Connect.
- For example:

  ```yml
  # docker-compose.yml
  version: "3"
  services:
    kafka:
    # ... your kafka configuration

    schema-registry:
      # ... your schema-registry configuration

    zookeeper:
      # ... your zookeeper configuration
  ```

- Configuration includes:
  1. `CONNECT_BOOTSTRAP_SERVERS`
  2. `CONNECT_GROUP_ID`
  3. `CONNECT_KEY_CONVERTER`
  4. `CONNECT_VALUE_CONVERTER`
  5. `CONNECT_CONFIG_STORAGE_TOPIC`
  6. `CONNECT_OFFSET_STORAGE_TOPIC`
  7. `CONNECT_STATUS_STORAGE_TOPIC`

## Step 3: Adding Connectors to a Container

- You can use [Confluent Hub]() to add your desired **JARs**, either by installing them at runtime or by creating a new Docker image. Of course, there are pros and cons to either of these options, and you should choose based on your individual needs.

## Step 3.1: Create a Docker Image Containing Confluent Hub Connectors

- Add connectors from [Confluent Hub](https://www.confluent.io/hub/?_ga=2.263155916.1350022208.1723832910-234518971.1709664712&_gl=1*1ttjnnz*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyNDE1OTU2My4xNDcuMS4xNzI0MTYyNjA2LjEuMC4w)

- Write a `Dockerfile` -

  - Example 1():
    ```Dockerfile
      FROM confluentinc/cp-server-connect-base:7.7.0
      RUN   confluent-hub install --no-prompt hpgrahsl/kafka-connect-mongodb:1.1.0 && confluent-hub install --no-prompt microsoft/kafka-connect-iothub:0.6 && confluent-hub install --no-prompt wepay/kafka-connect-bigquery:1.1.0
    ```
  - Example 2 ():
    ```Dockerfile
      FROM confluentinc/cp-kafka-connect:7.1.0-1-ubi8
      ENV CONNECT_PLUGIN_PATH: "/usr/share/java,/usr/share/confluent-hub-components"
      RUN confluent-hub install --no-prompt neo4j/kafka-connect-neo4j:2.0.2
    ```

- Remarks:
  - The `CONNECT_PLUGIN_PATH` environment variable is set to `/usr/share/java,/usr/share/confluent-hub-components`, which are the paths where **Kafka Connect** looks for **plugins**.
- Build a `Dockerfile`

## Step 4: Get Available Connector Plugins

```sh
  curl localhost:8083/connector-plugins | json_pp
```

- If you need to check the list of available **plugins** you should hit `localhost:8083/connector-plugins`
  ```sh
      curl localhost:8083/connector-plugins
  ```
- The `curl` command you ran is querying the **Kafka Connect** REST API to list the available **connector plugins** on your **Kafka Connect** instance.
- Sample Output:
  ```json
  [
    {
      "class": "io.confluent.connect.jdbc.JdbcSinkConnector",
      "type": "sink",
      "version": "10.7.6"
    },
    {
      "class": "io.confluent.connect.jdbc.JdbcSourceConnector",
      "type": "source",
      "version": "10.7.6"
    },
    {
      "class": "org.apache.kafka.connect.mirror.MirrorCheckpointConnector",
      "type": "source",
      "version": "1"
    },
    {
      "class": "org.apache.kafka.connect.mirror.MirrorHeartbeatConnector",
      "type": "source",
      "version": "1"
    },
    {
      "class": "org.apache.kafka.connect.mirror.MirrorSourceConnector",
      "type": "source",
      "version": "1"
    }
  ]
  ```
- Here, The response indicates that several **connector plugins** are available, each identified by its class, type, and version.
  1. JdbcSinkConnector and JdbcSourceConnector:
     - `io.confluent.connect.jdbc.JdbcSinkConnector` (version 10.7.6): A **sink connector** that allows data to be written from **Kafka topics** into a relational database using **JDBC**.
     - `io.confluent.connect.jdbc.JdbcSourceConnector` (version 10.7.6): A **source connector** that allows data to be ingested from a relational database into **Kafka topics** using **JDBC**
  2. MirrorMaker 2 Connectors:
     - `org.apache.kafka.connect.mirror.MirrorCheckpointConnector` (version 1): Part of **MirrorMaker 2**, this **connector** helps manage the **offsets** in the target cluster, allowing **consumers** to pick up where they left off after a failover.
     - `org.apache.kafka.connect.mirror.MirrorHeartbeatConnector` (version 1): Also part of **MirrorMaker 2**, this **connector** is used for monitoring and ensuring the health and consistency of the data replication process.
     - `org.apache.kafka.connect.mirror.MirrorSourceConnector` (version 1): This **connector** is responsible for replicating data from one **Kafka cluster** to another (cross-cluster mirroring).

## Step 5: Popular Kafka command

1. List Kafka Topics:
   ```sh
      kafka-topics --bootstrap-server localhost:9092 --list
   ```
2. Create Kafka Topic

   - To create a **topic** in Kafka, you can use the `kafka-topics` command with the `--create` option.
   - Create a new **kafka topic**, `test-kafka-topic` with `docker exec` command
     ```sh
       kafka-topics --create --bootstrap-server kafka:9092 --partitions 1 --replication-factor 1 --topic users.customers
     ```

3. Delete Kafka Topic by:
   ```sh
      kafka-topics --bootstrap-server localhost:9092 --delete --topic  users.customers
   ```

# Source Connectors

- You can download connectors from [https://www.confluent.io/hub/](https://www.confluent.io/hub/)

# 1. [JDBC Source Connector](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc)

- The [Kafka Connect JDBC Source connector]() allows you to import data from any relational database with a **JDBC** driver into an **Apache Kafka topic**. This **connector** can support a wide variety of databases.

- The **JDBC Source connector** includes the following **features**:
  1. **At least once delivery**: This **connector** guarantees that records are delivered to the **Kafka topic** at least once. If the **connector** restarts, there may be some duplicate records in the **Kafka topic**.
  2. **Supports one task**: The **JDBC Source connector** can read one or more tables from a single task. In query mode, the **connector** supports running only one task.
  3. Incremental query modes
  4. **Message keys**:
     - Kafka messages are **key**/**value** pairs. For a **JDBC connector**, the **value** (payload) is the contents of the table row being ingested. However, the **JDBC connector** does not generate the **key** by default.
     - Message **keys** are useful in setting up partitioning strategies. **Keys** can direct messages to a specific **partition** and can support downstream processing where joins are used. If no message **key** is used, messages are sent to partitions using round-robin distribution.
     - To set a message **key** for the **JDBC connector**, you use two Single Message Transformations (SMTs): the [ValueToKey](https://docs.confluent.io/platform/current/connect/transforms/valuetokey.html) SMT and the [ExtractField](https://docs.confluent.io/platform/current/connect/transforms/extractfield.html) SMT. You add these two SMTs to the **JDBC connector** configuration.
     - **Example** (the following shows a snippet added to a configuration that takes the `id` column of the `accounts` table to use as the message key).
       ```json
       {
         "name": "jdbc_source_mysql_01",
         "config": {
           "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
           "connection.url": "jdbc:mysql://mysql:3306/test",
           "connection.user": "connect_user",
           "connection.password": "connect_password",
           "topic.prefix": "mysql-01-",
           "poll.interval.ms": 3600000,
           "table.whitelist": "test.accounts",
           "mode": "bulk",
           "transforms": "createKey,extractInt",
           "transforms.createKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
           "transforms.createKey.fields": "id",
           "transforms.extractInt.type": "org.apache.kafka.connect.transforms.ExtractField$Key",
           "transforms.extractInt.field": "id"
         }
       }
       ```
  5. Mapping column types
- We add both the [Avro Converter](https://www.confluent.io/hub/confluentinc/kafka-connect-avro-converter) and [JDBC Source/Sink](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) plugins to our **Docker image**.
- `Dockerfile` for **Kafka Connect** with **plugins**:

  ```Dockerfile
    FROM confluentinc/cp-kafka-connect-base:6.2.1

    # Install Avro & JDBC plugins
    RUN confluent-hub install --no-prompt confluentinc/kafka-connect-avro-converter:5.5.4
    RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.1.1
  ```

- Properties of **JDBC Source Connector**:
  1. `"mode":` - The **Kafka JDBC Source Connector** supports several **modes** that determine how data is captured from a **relational database** and streamed to **Kafka topics**. Each **mode** serves a different purpose, depending on the nature of your data and the requirements of your streaming application.
     1. `bulk` (**Bulk Mode**): In **bulk mode**, the **connector** loads the entire content of the specified tables at each poll interval.Use cases include:
        - Suitable for use cases where the entire table data needs to be replicated periodically.
        - Ideal when data is relatively small or when the table is static (rarely changes).
        - Not efficient for large, frequently changing tables because it reloads all the data every time.
        - Examle:
          ```json
          {
            "mode": "bulk"
          }
          ```
     2. `incrementing` (**Incrementing Mode**): The **connector** identifies new records based on an **incrementing column**, typically a **primary key** or auto-incrementing ID. It tracks the maximum value of this column seen so far and only fetches rows with a greater value. Use cases include:
        - Suitable when records are only inserted, and the ID column is guaranteed to increment monotonically.
        - Commonly used for tables with an auto-incremented primary key.
        - Not suitable if rows can be updated, as updates won't be captured.
        - Examle:
          ```json
          {
            "mode": "incrementing",
            "incrementing.column.name": "id"
          }
          ```
     3. `timestamp` (**Timestamp Mode**): The **connector** tracks changes by monitoring a timestamp column. It queries only rows where the timestamp is greater than the last recorded timestamp. Use Cases include:
        - Ideal for tables where records can be updated, and the timestamp column captures the last modified time.
        - Suitable when records are inserted and updated, but no deletions occur.
        - Requires a reliable timestamp column that is updated with every change.
        - Example:
          ```json
          {
            "mode": "timestamp",
            "timestamp.column.name": "updated_at"
          }
          ```
     4. `timestamp+incrementing` (**Timestamp + Incrementing Mode**): This **mode** combines **timestamp** and **incrementing modes**. It ensures that both new and updated records are captured. The **connector** uses the timestamp column to track updates and the incrementing column to ensure unique identification of records, especially in case of multiple updates within the same timestamp. Use Cases:
        - Ideal for tables where both inserts and updates occur frequently.
        - Ensures that no updates are missed, even if multiple updates happen within the same timestamp.
        - Requires both a reliable timestamp and an incrementing column.
        - Example:
          ```json
          {
            "mode": "timestamp+incrementing",
            "timestamp.column.name": "updated_at",
            "incrementing.column.name": "id"
          }
          ```
     5. `query` (**Custom Query Mode**): In this mode, you can define a custom SQL query to fetch data. The **connector** executes this query at each poll interval. It's useful when you need to filter or join tables in a specific way. Use Cases include:
        - Best when you need more control over what data is captured, such as filtering specific rows, joining multiple tables, or using complex SQL logic.
        - Allows for flexibility in handling various use cases that standard modes cannot cover.
        - Requires manual management of change tracking within the query.
        - Example:
          ```json
          {
            "mode": "query",
            "query": "SELECT * FROM customers WHERE updated_at > ?"
          }
          ```
  2. **Single Message Transforms** (SMTs)
- Once all the above is up and running we’re ready to create our new **JDBC Source connector** to produce database records onto **Kafka**.
- **Remarks**:
  - **Limitations** Of **JDBC Connector**:
    1. The geometry column type isn’t supported for the **JDBC Source connector**.
    2. The **connector** does not support the array data type.
    3. If the **connector** makes numerous parallel insert operations in a large source table, insert transactions can commit out of order; this is typical and means that a greater auto_increment ID (for example, 101) is committed earlier and a smaller ID (for example, 100) is committed later. The time difference may only be a few milliseconds, but the commits are out of order nevertheless.

## 1.1. JDBC Source Connector with with Single Message Transformations (SMTs) -> Key:Long and Value:JSON

- Examles:

  - For PostgreSQL:

    ```json
    {
      "name": "postgresdb-connector-for-customers-v2",
      "config": {
        "_comment": "The JDBC connector class. Don't change this if you want to use the JDBC Source.",
        "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",

        "tasks.max": "1",
        "connection.url": "jdbc:postgresql://postgres:5432/users",
        "connection.user": "admin",
        "connection.password": "mypassword",

        "mode": "timestamp",
        "timestamp.column.name": "updated_at",

        "table.whitelist": "customers",
        "topic.prefix": "users.",
        "poll.interval.ms": "5000",
        "validate.non.null": "true",

        "key.converter": "org.apache.kafka.connect.json.JsonConverter",
        "value.converter": "org.apache.kafka.connect.json.JsonConverter",
        "schema.registry.url": "http://your-schema-registry:8081"
      }
    }
    ```

- **Step** (Register Connector)

  - Register Postgres Source Connector by:
    ```sh
     curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @jdbc-json-connector-for-customers-postgresdb.json
    ```

- **Step**: (**Test Your Connect Server**):

  - Test connector server by:
    ```sh
      curl --location --request GET 'http://localhost:8083/connectors'
    ```

- **Step** (**Delete Source Connector**):
  - Remove the **connectors** by:
    ```sh
      curl -X DELETE http://localhost:8083/connectors/postgresdb-connector-for-customers-v1
    ```

## 1.2. JDBC Source Connector with SpecificAvro -> Key:String(null) and Value:SpecificAvro

- To (de)serialize messages using **Avro** by default, we add the following environment variables.
  ```yml
  # Default converter configuration
  CONNECT_KEY_CONVERTER: "org.apache.kafka.connect.storage.StringConverter"
  CONNECT_VALUE_CONVERTER: "io.confluent.connect.avro.AvroConverter"
  CONNECT_VALUE_CONVERTER_SCHEMA_REGISTRY_URL: "http://schema-registry:8081/"
  ```
- Example:
  ```Dockerfile
    # Dockerfile
    # Install Avro plugins
    RUN confluent-hub install --no-prompt confluentinc/kafka-connect-avro-converter:5.5.4
  ```
- Examples:

  - PostgreSQL
  - MySQL

    ```json
    {
      "name": "jdbc_source_mysql_foobar_01",
      "config": {
        "_comment": "The JDBC connector class. Don't change this if you want to use the JDBC Source.",
        "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",

        "_comment": "How to serialise the value of keys - here use the Confluent Avro serialiser. Note: the JDBC Source Connector always returns null for the key ",
        "key.converter": "io.confluent.connect.avro.AvroConverter".

        "_comment": "Since we're using Avro serialisation, we need to specify the Confluent schema registry at which the created schema is to be stored.",
        "_comment": "NB Schema Registry and Avro serialiser are both part of Confluent Platform.",
        "key.converter.schema.registry.url": "http://localhost:8081",

        "_comment": "As above, but for the value of the message. Note that these key/value serialisation settings can be set globally for Connect and thus omitted for individual connector configs to make them shorter and clearer",
        "value.converter": "io.confluent.connect.avro.AvroConverter",
        "value.converter.schema.registry.url": "http://localhost:8081",

        "_comment": " --- JDBC-specific configuration below here  --- ",
        "_comment": "JDBC connection URL. This will vary by RDBMS. Consult your manufacturer's handbook for more information",
        "connection.url": "jdbc:mysql://localhost:3306/demo?user=rmoff&password=pw",

         "_comment": "Which table(s) to include",
          "table.whitelist": "foobar",

         " _comment": "Pull all rows based on an timestamp column. You can also do bulk or incrementing column-based extracts.",
         "_comment": "For more information, see http://docs.confluent.io/current/connect/connect-jdbc/docs/source_config_options.html#mode",
          "mode": "timestamp",

          "_comment": "Which column has the timestamp value to use?  ",
          "timestamp.column.name": "update_ts",

          "_comment": "If the column is not defined as NOT NULL, tell the connector to ignore this  ",
          "validate.non.null": "false",

          "_comment": "The Kafka topic will be made up of this prefix, plus the table name  ",
          "topic.prefix": "mysql-",

          "_comment": "---- Single Message Transforms ----",
          "transforms":"createKey,extractInt",
          "transforms.createKey.type":"org.apache.kafka.connect.transforms.ValueToKey",
          "transforms.createKey.fields":"c1",
          "transforms.extractInt.type":"org.apache.kafka.connect.transforms.ExtractField$Key",
          "transforms.extractInt.field":"c1"
      }
    }
    ```

  - MongoDB

# 2. [Debezium PostgreSQL CDC Source Connector](https://www.confluent.io/hub/debezium/debezium-connector-postgresql)

- Download [Debezium PostgreSQL CDC Source Connector](https://www.confluent.io/hub/debezium/debezium-connector-postgresql)

# Sink Connectors

## 1. BigQuery Sink Connector

- Now, we will **register** a **Kafka connector** to sink data based on the events streamed into the **Kafka topics**. We will achieve this by using a JSON configuration file named “bigquery-connector.json’”:
  ```json
  {
    "name": "inventory-connector-bigquery",
    "config": {
      "connector.class": "com.wepay.kafka.connect.bigquery.BigQuerySinkConnector",
      "tasks.max": "1",
      "consumer.auto.offset.reset": "earliest",
      "topics.regex": "debezium.inventory.*",
      "sanitizeTopics": "true",
      "autoCreateTables": "true",
      "keyfile": "/bigquery-keyfile.json",
      "schemaRetriever": "com.wepay.kafka.connect.bigquery.retrieve.IdentitySchemaRetriever",
      "project": "my-gcp-project-id",
      "defaultDataset": "kafka_dataset",
      "allBQFieldsNullable": true,
      "allowNewBigQueryFields": true,
      //"transforms": "regexTopicRename,extractAfterData",
      "transforms": "regexTopicRename,extractAfterData",
      "transforms.regexTopicRename.type": "org.apache.kafka.connect.transforms.RegexRouter",
      "transforms.regexTopicRename.regex": "debezium.inventory.(.*)",
      "transforms.regexTopicRename.replacement": "$1",
      "transforms.extractAfterData.type": "io.debezium.transforms.ExtractNewRecordState"
    }
  }
  ```
- The **BigQuery Sink connector** can be configured using a variety of configuration **properties**:

  1. `name`: Globally-unique name to use for this connector.
  2. `tasks.max`: Maximum number of tasks to use for this connector. The default is `1`. Each task replicates exclusive set of partitions assigned to it.
  3. `topics.regex`: A Java regular expression of topics to replicate. For example: specify .`*` to replicate all available **topics** in the cluster. Applicable only when Use regular expressions is selected.
  4. `keyfile`:
     - A `JSON` key with **BigQuery** service account credentials.
     - `keyfile` can be either a string representation of the Google credentials file or the path to the Google credentials file itself. The string representation of the Google credentials file is supported in BigQuery sink connector version 1.3 (and later).
     - Type: string
     - Default: null
  5. `keySource`
     - Determines whether the keyfile configuration is the path to the credentials JSON file or to the JSON itself. Available values are `FILE` and `JSON`. This property is available in BigQuery sink connector version 1.3 (and later).
     - Type: string
     - Default: FILE
  6. `project`:
     - The BigQuery project to which topic data will be written.
     - Type: `string`
  7. `defaultDataset`:
     - The default Google BigQuery dataset to be used.
     - Typs is `string`
  8. `topics`:
     - A list of **Kafka topics** to read from.
  9. `sanitizeTopics`:
     - Designates whether to automatically sanitize topic names before using them as table names. If not enabled, topic names are used as table names.
     - Type: boolean
     - Default: `false`
  10. `includeKafkaData`:
      - Whether to include an extra block containing the Kafka source topic, offset, and partition information in the resulting BigQuery rows.
      - Type: boolean
      - Default: false
  11. `schemaRetriever`:
      - A class that can be used for automatically creating tables and/or updating schemas. Note that in version 2.0.0, `SchemaRetriever` API changed to retrieve the schema from each SinkRecord, which will help support multiple schemas per topic. `SchemaRegistrySchemaRetriever` has been removed as it retrieves schema based on the topic.
      - Type: class
      - Default: `com.wepay.kafka.connect.bigquery.retrieve.IdentitySchemaRetriever`
  12. `autoCreateTables`:
      - Create **BigQuery** tables if they don’t already exist. This property should only be enabled for Schema Registry-based inputs: **Avro**, **Protobuf**, or **JSON Schema** (JSON_SR). Table creation is not supported for **JSON** input.
      - Type: boolean
      - Default: `false`
  13. `topic2TableMap`:
      - Map of **topics** to **tables** (optional). Format: comma-separated tuples, e.g. <topic-1>:<table-1>,<topic-2>:<table-2>,.. Note that **topic name** should not be modified using regex SMT while using this option. Also note that `SANITIZE_TOPICS_CONFIG` would be ignored if this config is set.
      - Lastly, if the `topic2table` map doesn’t contain the topic for a record, a table with the same name as the topic name would be created.
      - Type: `string`
      - Default: “”
  14. `allowNewBigQueryFields`: If `true`, new fields can be added to BigQuery tables during subsequent schema updates.
  15. `allowBigQueryRequiredFieldRelaxation`: If `true`, fields in the BigQuery schema can be changed from `REQUIRED` to `NULLABLE`.
  16. `upsertEnabled`:
      - Enables upsert functionality on the connector
      - Enable upsert functionality on the connector through the use of record keys, intermediate tables, and periodic merge flushes. Row-matching will be performed based on the contents of record keys. This feature won’t work with SMTs that change the name of the topic and doesn’t support JSON input.
      - Type: boolean
      - Default: `false`
  17. `deleteEnabled`:
      - Enable delete functionality on the connector through the use of record keys, intermediate tables, and periodic merge flushes. A delete will be performed when a record with a null value (that is–a tombstone record) is read. This feature will not work with **SMTs** that change the name of the topic and doesn’t support JSON input.
      - Type: boolean
      - Default: `false`
  18. `kafkaKeyFieldName`:
      - The name of the BigQuery table field for the Kafka key. Must be set when upsert or delete is enabled.
      - The Kafka key field name. The default value is `null`, which means the **Kafka Key** field will not be included.
      - Type: `string`
      - Default: `null`
  19. `kafkaDataFieldName`:
      - The **Kafka data field name**. The default value is `null`, which means the **Kafka Data** field will not be included.
      - Type: `string`
      - Default: `null`
  20. `timePartitioningType`:
      - The time partitioning type to use when creating tables. Existing tables will not be altered to use this partitioning type.
      - Type: string
      - Default: DAY
      - Valid Values: (case insensitive) [MONTH, YEAR, HOUR, DAY]
  21. `bigQueryRetry`:
      - The number of retry attempts made for each BigQuery request that fails with a backend or quota exceeded error.
      - Type: `int`
      - Default: 0
      - Valid Values: [0,…]
  22. `bigQueryRetryWait`:
      - The minimum amount of time, in milliseconds, to wait between BigQuery backend or quota exceeded error retry attempts.
      - Type: long
      - Default: 1000
      - Valid Values: [0,…]
  23. `allowNewBigQueryFields`:
      - If `true`, new fields can be added to BigQuery tables during subsequent schema updates.
      - Type: boolean
      - Default: `false`
  24. `allowBigQueryRequiredFieldRelaxation`:
      - If true, fields in BigQuery Schema can be changed from `REQUIRED` to `NULLABLE`. Note that `allowNewBigQueryFields` and `allowBigQueryRequiredFieldRelaxation` replaced the `autoUpdateSchemas` parameter of older versions of this connector.
      - Type: boolean
      - Default: `false`
  25. `bigQueryMessageTimePartitioning`:
      - Whether or not to use the message time when inserting records. Default uses the connector processing time.
      - Type: `boolean`
      - Default: false
  26. `allowSchemaUnionization`:
      - If `true`, the existing table schema (if one is present) will be unionized with new record schemas during schema updates. If false, the record of the last schema in a batch will be used for any necessary table creation and schema update attempts.
      - Type: boolean
      - Default: false
  27. `bigQueryPartitionDecorator`:
      - Whether or not to append partition decorator to BigQuery table name when inserting records.
      - Default is `true`. Setting this to `true` appends partition decorator to table name (e.g. table$yyyyMMdd depending on the configuration set for `bigQueryPartitionDecorator`).
      - Setting this to `false` bypasses the logic to append the partition decorator and uses raw table name for inserts.
  28. `timestampPartitionFieldName`:
      - The name of the field in the value that contains the timestamp to partition by in BigQuery and enable timestamp partitioning for each table. Leave this configuration blank, to enable ingestion time partitioning for each table.
      - Type: `string`
      - Default: null
  29. `allBQFieldsNullable`:
      - If `true`, no fields in any produced BigQuery schema are REQUIRED. All non-nullable `Avro` fields are translated as NULLABLE (or REPEATED, if arrays).
      - Type: boolean
      - Default: `false`
  30. `intermediateTableSuffix`:
      - A suffix that will be appended to the names of destination tables to create the names for the corresponding intermediate tables. Multiple intermediate tables may be created for a single destination table, but their names will always start with the name of the destination table, followed by this suffix, and possibly followed by an additional suffix.
      - Type: `string`
      - Default: “tmp”
  31. `mergeIntervalMs`:
      - How often (in milliseconds) to perform a merge flush, if upsert/delete is enabled. Can be set to -1 to disable periodic flushing.
      - Type: `long`
      - Default: 60_000L
  32. `mergeRecordsThreshold`:
      - How many records to write to an intermediate table before performing a merge flush, if upsert/delete is enabled. Can be set to `-1` to disable record count-based flushing.
      - Type: long
      - Default: -1
  33. `clusteringPartitionFieldNames`:
      - Comma-separated list of fields where data is clustered in BigQuery.
      - Type: `list`
      - Default: null
  34. `avroDataCacheSize`
      - The size of the cache to use when converting schemas from Avro to Kafka Connect.
      - Type: int
      - Default: 100
      - Valid Values: [0,…]
  35. `enableBatchLoad`:
      - **Beta Feature** Use with caution. The sublist of topics to be batch loaded through GCS.
      - Type: list
      - Default: “”
  36. `batchLoadIntervalSec`:
      - The interval, in seconds, in which to attempt to run GCS to BigQuery load jobs. Only relevant if `enableBatchLoad` is configured.
      - Type: `int`
      - Default: 120
  37. `convertDoubleSpecialValues`
      - Designates whether +Infinity is converted to Double.MAX_VALUE and whether -Infinity and NaN are converted to Double.MIN_VALUE to ensure successfull delivery to BigQuery.
      - Type: boolean
      - Default: `false`
  38. `errors.tolerance`: Error tolerance response during connector operation. Default value is `none` and signals that any error will result in an immediate connector task failure. Value of `all` changes the behavior to skip over problematic records.
  39. `errors.deadletterqueue.topic.name`: The name of the **topic** to be used as the **dead letter queue** (DLQ) for messages that result in an error when processed by this **sink connector**, its transformations, or converters. The **topic name** is blank by default, which means that no messages are recorded in the DLQ.
  40. `errors.deadletterqueue.topic .replication.factor`: Replication factor used to create the dead letter queue topic when it doesn’t already exist.
  41. `errors.deadletterqueue.context .headers.enable`: When `true`, adds a header containing error context to the messages written to the dead letter queue. To avoid clashing with headers from the original record, all error context header keys, start with `__connect.errors`.
  42. `value.converter`: The format of the value in the Redpanda topic. The default is `JSON`.
  43. `autoCreateBucket`:
      - Whether to automatically create the given bucket, if it does not exist.
      - Type: boolean
      - Default: `true`
  44. `gcsBucketName`:
      - The maximum size (or -1 for no maximum size) of the worker queue for **BigQuery** write requests before all topics are paused. This is a soft limit; the size of the queue can go over this before topics are paused. All topics resume once a flush is triggered or the size of the queue drops under half of the maximum size.
      - Type: `long`
      - Default: -1
      - Valid Values: [-1,…]
      - Importance: high
  45. `threadPoolSize`:
      - The size of the BigQuery write thread pool. This establishes the maximum number of concurrent writes to BigQuery.
      - Type: `int`
      - Default: 10
      - Valid Values: [1,…]

- Step: **register** the **Bigquery sink**:

  ```sh
    curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @bigquery-connector.json
  ```

- **Step 5**: Check Status Of The BigQuery Sink Connector
  - Verify the status of the **connector** to ensure it is running without errors:
    ```sh
      curl -X GET http://localhost:8083/connectors/delegates-survey-bq-sink/status
    ```
- **Step 6**: Validate the connector configuration to see if there are any misconfigurations:

  ```sh
    curl -X PUT -H "Content-Type: application/json" http://localhost:8083/connector-plugins/com.wepay.kafka.connect.bigquery.BigQuerySinkConnector/config/validate -d @delegates-survey-sink-connector.json
  ```

- **Step 7**: Delete BigQuery Sink Connector

- Delete the existing **connector** by:
  ```sh
    #delete sink connector
    curl -X DELETE http://localhost:8083/connectors/delegates-survey-sink-connector-v1
  ```

# Bonus

# JMX metrics exporter

- We add the [Prometheus JMX Exporter agent]() to our **Kafka Connect image**.
  ```Dockerfile
    # Dockerfile
    # Install and configure JMX Exporter
    COPY jmx_prometheus_javaagent-0.15.0.jar /opt/
    COPY kafka-connect.yml /opt/
  ```
- Update `docker-compose.yml` with the following:
  ```yml
  # docker-compose.yml
  # Export JMX metrics to :9876/metrics for Prometheus
  KAFKA_JMX_PORT: "9875"
  KAFKA_OPTS: "-javaagent:/opt/jmx_prometheus_javaagent-0.15.0.jar=9876:/opt/kafka-connect.yml"
  ```

# Resources and Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
2. [docs.confluent.ion - How to Use Kafka Connect - Get Started](https://docs.confluent.io/platform/current/connect/userguide.html)
3. [redpanda - Understanding Apache Kafka](https://www.redpanda.com/guides/kafka-tutorial-what-is-kafka-connect)
4. [runchydata.com/blog - postgresql-change-data-capture-with-debezium](https://www.crunchydata.com/blog/postgresql-change-data-capture-with-debezium)
5. [www.iamninad.com - docker-compose-for-your-next-debezium-and-postgres-project](https://www.iamninad.com/posts/docker-compose-for-your-next-debezium-and-postgres-project/)
6. [docs.confluent.io/kafka-connectors - bigquery/current/kafka_connect_bigquery_config](https://docs.confluent.io/kafka-connectors/bigquery/current/kafka_connect_bigquery_config.html)
