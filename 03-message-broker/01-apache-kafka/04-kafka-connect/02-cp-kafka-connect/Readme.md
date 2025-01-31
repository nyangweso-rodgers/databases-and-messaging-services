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

### 4.1: Using String Converter (`StringConverter`)

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

### 4.3: Using Avro Converter (`AvroConverter`)

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

- Configure **Kafka Connect**:

# Adding Connectors to a Docker Container

- You can use [Confluent Hub]() to add your desired **JARs**, either by installing them at runtime or by creating a new Docker image. Of course, there are pros and cons to either of these options, and you should choose based on your individual needs.

## Create a Docker Image Containing Confluent Hub Connectors

- Add connectors from [Confluent Hub](https://www.confluent.io/hub/?_ga=2.263155916.1350022208.1723832910-234518971.1709664712&_gl=1*1ttjnnz*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyNDE1OTU2My4xNDcuMS4xNzI0MTYyNjA2LjEuMC4w)

- Write a `Dockerfile` with the connectors as follows:

  ```Dockerfile
    FROM confluentinc/cp-server-connect-base:7.7.0
    # FROM confluentinc/cp-kafka-connect:7.1.0-1-ubi8

    ENV CONNECT_PLUGIN_PATH: "/usr/share/java,/usr/share/confluent-hub-components"

    RUN confluent-hub install --no-prompt hpgrahsl/kafka-connect-mongodb:1.1.0
    RUN confluent-hub install --no-prompt microsoft/kafka-connect-iothub:0.6
    RUN confluent-hub install --no-prompt wepay/kafka-connect-bigquery:1.1.0
    RUN confluent-hub install --no-prompt neo4j/kafka-connect-neo4j:2.0.2
  ```

- **Remarks**:
  - The `CONNECT_PLUGIN_PATH` environment variable is set to `/usr/share/java,/usr/share/confluent-hub-components`, which are the paths where **Kafka Connect** looks for **plugins**.
- Build a `Dockerfile`

# Install Connectors

## 1. Install Connectors With Docker At Runtime

- In **Docker Compose** this looks like this:
  ```yml
  # docker-compose.yml
  environment:
    CONNECT_PLUGIN_PATH: "/usr/share/java,/usr/share/confluent-hub-components/"
  command:
    - bash
    - c
    - |
      # Install connector plugins
      # This will by default install into /usr/share/confluent-hub-components/ so make
      #  sure that this path is added to the plugin.path in the environment variables
      confluent-hub install --no-prompt jcustenborder/kafka-connect-spooldir:2.0.43
      # Launch the Kafka Connect worker
      /etc/confluent/docker/run &
      # Don't exit
      sleep infinity
  ```

## 2. Manual Installation

- Download the **JAR** file (usually from [Confluent Hub](https://www.confluent.io/hub/)) and place it in a folder on your **Kafka Connect** worker (directory specified by the CONNECT_PLUGIN_PATH environment variable). This method offers granular control but requires manual intervention on each node.
- Key Components of the downloaded folder are:

  1.  `lib/`: This directory holds the core JAR file containing the connector implementation. This is the essential part for your **Docker image**.
  2.  `assets/`, `doc/`, `etc/`: These directories contain additional resources like configuration examples, documentation, and other supporting files. While not strictly required for the connector to function, they can be useful for reference and troubleshooting.

- **Step 2**: Create a `cp-kafka-connect/` for the downloaded **connectors**. Here is how the directory might looks like:

  - cp-kafka-connect/
    - Dockerfile
    - plugins
      - debezium-debezium-connector-postgres-2.5.4
        - assets/
        - doc/
        - etc/
        - lib/
        - manifest.json

- **Step 3**: create a `Dockerfile` and configure the files:
  - **Example** (for debezium Postgres CDC Source Connector):
    ```Dockerfile
        #FROM confluentinc/cp-kafka-connect-base:5.5.0
        FROM confluentinc/cp-kafka-connect:7.7.0
        ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"
        RUN confluent-hub install --no-prompt jcustenborder/kafka-connect-spooldir:2.0.43
    ```

## 3. Kafka Connect With `Dockerfile`

- `Dockerfile` for **Kafka Connect** with **plugins**:

  ```Dockerfile
    FROM confluentinc/cp-kafka-connect-base:6.2.1

    # Install Avro & JDBC plugins
    RUN confluent-hub install --no-prompt confluentinc/kafka-connect-avro-converter:5.5.4
    RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.1.1
  ```

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

# Connector Configurations

- You can download connectors from [https://www.confluent.io/hub/](https://www.confluent.io/hub/)

## 1. [JDBC Source Connector](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) Configurations

- The [Kafka Connect JDBC Source connector]() allows you to import data from any relational database with a **JDBC** driver into an **Apache Kafka topic**. This **connector** can support a wide variety of databases.
- We add both the [Avro Converter](https://www.confluent.io/hub/confluentinc/kafka-connect-avro-converter) and [JDBC Source/Sink](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) plugins to our **Docker image**.

- **Limitations Of JDBC Connector**:

  1. The geometry column type isn’t supported for the **JDBC Source connector**.
  2. The **connector** does not support the array data type.
  3. If the **connector** makes numerous parallel insert operations in a large source table, insert transactions can commit out of order; this is typical and means that a greater auto_increment ID (for example, 101) is committed earlier and a smaller ID (for example, 100) is committed later. The time difference may only be a few milliseconds, but the commits are out of order nevertheless.

- **Features Of JDBC Connector**:

  1. **At least once delivery**: This **connector** guarantees that records are delivered to the **Kafka topic** at least once. If the **connector** restarts, there may be some duplicate records in the **Kafka topic**.
  2. **Supports one task**: The **JDBC Source connector** can read one or more tables from a single task. In query mode, the **connector** supports running only one task.
  3. Incremental query modes

  4. **Message Keys**:

     - Kafka messages are `key`/`value` pairs. For a **JDBC connector**, the `value` (payload) is the contents of the table row being ingested. However, the **JDBC connector** does not generate the `key` by default.
     - Message `keys` are useful in setting up **partitioning strategies**. `Keys` can direct messages to a specific **partition** and can support downstream processing where joins are used. If no message **key** is used, messages are sent to partitions using **round-robin distribution**.
     - To set a message **key** for the **JDBC connector**, you use two **Single Message Transformations** (**SMTs**):

       1. The [ValueToKey](https://docs.confluent.io/platform/current/connect/transforms/valuetokey.html) **SMT**
       2. The [ExtractField](https://docs.confluent.io/platform/current/connect/transforms/extractfield.html) **SMT**.

     - You add these two **SMTs** to the **JDBC connector** configuration.
     - **Example** (the following shows a snippet added to a configuration that takes the `id` column of the `accounts` table to use as the **message key**):

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

  5. **Connector Modes**

     - The **Kafka JDBC Source Connector** supports several **modes** that determine how data is captured from a **relational database** and streamed to **Kafka topics**. Each **mode** serves a different purpose, depending on the nature of your data and the requirements of your streaming application.
     - Following **Modes** are suported:

       1. `bulk` (**Bulk Mode**):
          - In **bulk mode**, the **connector** loads the entire content of the specified tables at each poll interval.
          - **Use cases include**:
            1. Suitable for use cases where the entire table data needs to be replicated periodically.
            2. Ideal when data is relatively small or when the table is static (rarely changes).
            3. Not efficient for large, frequently changing tables because it reloads all the data every time.
            4. **Initial Data Load**: When you want to bootstrap your **Kafka topics** with the entire dataset from a database table.
            5. **Periodic Batch Processing**: If your use case requires periodic full synchronization of data (e.g., every night or every few hours), **bulk mode** can fetch the full dataset to ensure the topic is fully up-to-date.
            6. **Stateless Data Pipelines**: When your pipeline doesn't require tracking changes over time, and you only care about the full dataset being replicated periodically.
            7. **Data Archiving**: If you want to archive or snapshot your entire database table to a Kafka topic for downstream processing, bulk mode is suitable.
            8. **Testing and Debugging**: Useful for testing Kafka Connect configurations by quickly populating topics with large amounts of data.
          - Examle:
            ```json
            {
              "mode": "bulk"
            }
            ```

     2. `incrementing` (**Incrementing Mode**):

        - The **connector** identifies new records based on an **incrementing column**, typically a **primary key** or auto-incrementing ID. It tracks the maximum value of this column seen so far and only fetches rows with a greater value.
        - **Use cases include**:
          1. Suitable when records are only inserted, and the ID column is guaranteed to increment monotonically.
          2. Commonly used for tables with an auto-incremented primary key.
          3. Not suitable if rows can be updated, as updates won't be captured.
        - Examle:
          ```json
          {
            "mode": "incrementing",
            "incrementing.column.name": "id"
          }
          ```

     3. `timestamp` (**Timestamp Mode**):
        - The **connector** tracks changes by monitoring a `timestamp` column. It queries only rows where the timestamp is greater than the last recorded timestamp.
        - **Use Cases include**:
          1. Ideal for tables where records can be updated, and the timestamp column captures the last modified time.
          2. Suitable when records are inserted and updated, but no deletions occur.
          3. Requires a reliable timestamp column that is updated with every change.
        - Example:
        ```json
        {
          "mode": "timestamp",
          "timestamp.column.name": "updated_at"
        }
        ```
     4. `timestamp+incrementing` (**Timestamp + Incrementing Mode**):

        - This **mode** combines **timestamp** and **incrementing modes**. It ensures that both new and updated records are captured. The **connector** uses the `timestamp` column to track updates and the incrementing column to ensure unique identification of records, especially in case of multiple updates within the same timestamp.
        - **Use Cases**:

          1. Ideal for tables where both inserts and updates occur frequently.
          2. Ensures that no updates are missed, even if multiple updates happen within the same timestamp.
          3. Requires both a reliable timestamp and an incrementing column.

        - Examle:
          ```json
          {
            "mode": "timestamp+incrementing",
            "timestamp.column.name": "updated_at",
            "incrementing.column.name": "id"
          }
          ```

     5. `query` (**Custom Query Mode**):
        - In this mode, you can define a custom SQL query to fetch data. The **connector** executes this query at each poll interval. It's useful when you need to filter or join tables in a specific way. - **Use Cases include**:
          1. Best when you need more control over what data is captured, such as filtering specific rows, joining multiple tables, or using complex SQL logic.
          2. Allows for flexibility in handling various use cases that standard modes cannot cover.
          3. Requires manual management of change tracking within the query.
        - Example:
          ```json
          {
            "mode": "query",
            "query": "SELECT * FROM customers WHERE updated_at > ?"
          }
          ```

- **Configuration Properties for the JDBC Connector**:

  1. `connection.url`: JDBC connection URL.

     - Examples:
       - MySQL: `jdbc:mysql://localhost/db_name`
       - SQL Server: `jdbc:sqlserver://localhost;instance=SQLEXPRESS;databaseName=db_name`

  2. `connection.user`: JDBC connection user.
  3. `connection.password`: JDBC connection password.
  4. `connection.attempts`: Maximum number of attempts to retrieve a valid JDBC connection. Must be a positive integer.

     - Default: 3

  5. `connection.backoff.ms`: Backoff time in milliseconds between connection attempts.
     - Type: long
     - Default: 10000
  6. `catalog.pattern`: Catalog pattern to fetch table metadata from the database.
     - Type: string
     - Default: `null`
       - `""` retrieves those without a catalog
       - `null` (default) indicates that the schema name is not used to narrow the search and that all table metadata is fetched, regardless of the catalog.
       - Importance: medium
  7. `table.whitelist`: List of tables to include in copying. If specified, `table.blacklist` may not be set. Use a comma-separated list to specify multiple tables (for example, `table.whitelist`: `"User, Address, Email"`).
     - Type: list
     - Default: “”
     - Importance: medium
  8. `table.blacklist`: List of tables to exclude from copying. If specified, `table.whitelist` may not be set. Use a comma-separated list to specify multiple tables (for example, `table.blacklist`: `"User, Address, Email"`).
     - Type: `list`
     - Default: “”
     - Importance: medium
  9. `schema.pattern`: Schema pattern to fetch table metadata from the database.
     - Type: string
     - Default: `null`
       - `""` retrieves those without a schema.
       - `null` (default) indicates that the schema name is not used to narrow the search and that all table metadata is fetched, regardless of the schema.
       - Importance: high
       - Note:
         - If you leave this at the default null setting, the connector may time out and fail because of the large amount of table metadata being received. Make sure to set this parameter for large databases.
  10. `numeric.mapping`: Map NUMERIC values by precision and optionally scale to integral or decimal types.
      - Type: `string`
      - Default: `null`
      - Valid Values: [`none`, `precision_only`, `best_fit`, `best_fit_eager_double`]
        - Use `none` if all NUMERIC columns are to be represented by Connect’s DECIMAL logical type.
        - Use `best_fit` if NUMERIC columns should be cast to Connect’s INT8, INT16, INT32, INT64, or FLOAT64 based upon the column’s precision and scale.This option may still represent the NUMERIC value as Connect DECIMAL if it cannot be cast to a native type without losing precision. For example, a NUMERIC(20) type with precision 20 would not be able to fit in a native INT64 without overflowing and thus would be retained as DECIMAL.
        - Use `best_fit_eager_double` if, in addition to the properties of `best_fit` described above, it is desirable to always cast NUMERIC columns with scale to Connect FLOAT64 type, despite potential of loss in accuracy.
        - Use `precision_only` to map NUMERIC columns based only on the column’s precision assuming that column’s scale is 0.
        - The `none` option is the default, but may lead to serialization issues with Avro since Connect’s DECIMAL type is mapped to its binary representation. `best_fit` is often preferred since it maps to the most appropriate primitive type.
      - Importance: low
  11. `dialect.name`: The name of the database dialect that should be used for this connector. By default this is empty, and the connector automatically determines the dialect based upon the JDBC connection URL. Use this if you want to override that behavior and use a specific dialect. All properly-packaged dialects in the JDBC connector plugin can be used.
      - Type: `string`
      - Default: “”
      - Valid Values: [, `Db2DatabaseDialect`, `MySqlDatabaseDialect`, `SybaseDatabaseDialect`, `GenericDatabaseDialect`, `OracleDatabaseDialect` ,`SqlServerDatabaseDialect`, `PostgreSqlDatabaseDialect`, `SqliteDatabaseDialect`, `DerbyDatabaseDialect` , `SapHanaDatabaseDialect`, `MockDatabaseDialect`, `VerticaDatabaseDialect`]
      - Importance: low
  12. `mode`: The mode for updating a table each time it is polled. Options include:

      - Type: `string`
      - Default: “”
      - Valid Values: [, `bulk`, `timestamp`, `incrementing`, `timestamp+incrementing`]
        - `bulk`: perform a bulk load of the entire table each time it is polled
        - `incrementing`: use a strictly incrementing column on each table to detect only new rows. Note that this will not detect modifications or deletions of existing rows.
        - `timestamp`: use a timestamp (or timestamp-like) column to detect new and modified rows. This assumes the column is updated with each write, and that values are monotonically incrementing, but not necessarily unique.
        - `timestamp+incrementing`: use two columns, a timestamp column that detects new and modified rows and a strictly incrementing column which provides a globally unique ID for updates so each row can be assigned a unique stream offset.
      - Importance: high
      - Dependents: `incrementing.column.name`, `timestamp.column.name`, `validate.non.null`

  13. `incrementing.column.name`: The name of the strictly incrementing column to use to detect new rows. Any empty value indicates the column should be autodetected by looking for an auto-incrementing column. This column may not be nullable.
      - Type: `string`
      - Default: “”
      - Importance: medium
  14. `timestamp.column.name`: Comma-separated list of one or more timestamp columns to detect new or modified rows using the COALESCE SQL function. Rows whose first non-null timestamp value is greater than the largest previous timestamp value seen will be discovered with each poll. At least one column should not be nullable.
      - Type: `string`
      - Default: “”
      - Importance: medium
  15. `timestamp.initial`: The epoch timestamp (in milliseconds) used for initial queries that use timestamp criteria. Use `-1` to use the current time. If not specified, all data will be retrieved.
      - Type: `long`
      - Default: `null`
      - Importance: low
  16. `validate.non.null`: By default, the JDBC connector will validate that all incrementing and timestamp tables have NOT NULL set for the columns being used as their ID/timestamp. If the tables don’t, JDBC connector will fail to start. Setting this to false will disable these checks.
      - Type: `boolean`
      - Default: `true`
      - Importance: low
  17. `query`: If specified, `query` can select new or updated rows. Use this setting if you want to join tables, select subsets of columns in a table, or filter data. If used, the connector copies data using this query and whole-table copying is disabled.
      - Type: `string`
      - Default: “”
      - Importance: medium
  18. `quote.sql.identifiers`:
      - When to quote table names, column names, and other identifiers in SQL statements. For backward compatibility, the default is `always`.
      - Type: `string`
      - Default: `always`
      - Importance: medium
  19. `query.suffix`: Suffix to append at the end of the generated query.
      - Type: string
      - Default: “”
      - Importance: low
  20. `query.retry.attempts`: The number of times to retry SQL exceptions encountered when executing queries.
      - Type: `int`
      - Default: `-1`
      - Importance: low
  21. `transaction.isolation.mode`: The mode to control which transaction isolation level is used when running queries against the database. By default, no explicit transaction isolation mode is set. `SQL_SERVER_SNAPSHOT` will only work against a connector configured to write to SQL Server. Options include: `DEFAULT`, `READ_UNCOMMITTED`, `READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`, and `SQL_SERVER_SNAPSHOT`.
      - Type: `string`
      - Default: `DEFAULT`
      - Valid Values: [`DEFAULT`, `READ_UNCOMMITED`, `READ_COMMITED`, `REPEATABLE_READ`, `SERIALIZABLE`, `SQL_SERVER_SNAPSHOT`]
      - Importance: low
  22. `table.types`: By default, the **JDBC connector** will only detect tables with type `TABLE` from the source Database. This config allows a comma-separated list of table types to extract.
      - Type: `list`.
        - TABLE
        - VIEW
        - SYSTEM TABLE
        - GLOBAL TEMPORARY
        - LOCAL TEMPORARY
        - ALIAS
        - SYNONYM
      - In most cases it only makes sense to have either `TABLE` or `VIEW`.
      - Default: `TABLE`
      - Importance: low
  23. `poll.interval.ms`: Frequency in ms to poll for new data in each table.
      - Type: `int`
      - Default: `5000`
      - Importance: high
  24. `batch.max.rows`: Maximum number of rows to include in a single batch when polling for new data. This setting can be used to limit the amount of data buffered internally in the connector.
      - Type: `int`
      - Default: `100`
      - Importance: low
  25. `table.poll.interval.ms`: Frequency in ms to poll for new or removed tables, which may result in updated task configurations to start polling for data in added tables or stop polling for data in removed tables.
      - Type: `long`
      - Default: `60000`
      - Importance: low
  26. `topic.prefix`: Prefix to prepend to table names to generate the name of the **Apache Kafka topic** to publish data to, or in the case of a custom query, the full name of the topic to publish to.
      - Type: `string`
      - Importance: high
  27. `timestamp.delay.interval.ms`: After a row with a certain timestamp appears, this is the amount of time the connector waits to include it in the result. You can add a delay to allow transactions with an earlier timestamp to complete. The first execution fetches all available records (starting at timestamp 0) until the current time minus the delay. Each subsequent execution retrieves data from the last time you fetched until the current time minus the delay.
      - Type: `long`
      - Default: `0`
      - Importance: high
  28. `db.timezone`: The name of the JDBC timezone used in the connector when querying with time-based criteria. This should be the timezone of the database as well as all the columns being queried. The value set in `db.timezone` will also be used for timestamp columns while pushing the records to Kafka. Defaults to UTC.
      - Type: `string`
      - Default: `UTC`
      - Valid Values: Any valid JDK time zone
      - Importance: medium
  29. `timestamp.granularity`: Define the granularity of the Timestamp column. Options include:
      - Type: `string`
      - Default: `connect_logical`
      - Valid Values: [`connect_logical`, `nanos_long`, `nanos_string`, `nanos_iso_datetime_string`]
        - `connect_logical` (default): represents timestamp values using Kafka Connect’s built-in representations
        - `nanos_long`: represents timestamp values as nanos since epoch
        - `nanos_string`: represents timestamp values as nanos since epoch in string
        - `nanos_iso_datetime_string`: uses the iso format ‘yyyy-MM-dd’T’HH:mm:ss.n’
      - Importance: low
  30. `topic.creation.groups`: A list of group aliases that are used to define per-group topic configurations for matching topics. A `default` group always exists and matches all topics.
      - Type: List of String types
      - Default: empty
      - Possible Values: The values of this property refer to any additional groups. A `default` group is always defined for topic configurations.
  31. `topic.creation.$alias.replication.factor`: The **replication factor** for new topics created by the connector. This value must not be larger than the number of brokers in the Kafka cluster. If this value is larger than the number of Kafka brokers, an error occurs when the connector attempts to create a topic. This is a **required property** for the `default` group. This property is optional for any other group defined in `topic.creation.groups`. Other groups use the Kafka broker default value.
      - Type: `int`
      - Default: n/a
      - Possible Values: `>= 1` for a specific valid value or `-1` to use the Kafka broker’s default value.
  32. `topic.creation.$alias.partitions`: The number of topic **partitions** created by this connector. This is a **required property** for the `default` group. This property is optional for any other group defined in `topic.creation.groups`. Other groups use the Kafka broker default value.
      - Type: `int`
      - Default: n/a
      - Possible Values: `>= 1` for a specific valid value or `-1` to use the Kafka broker’s default value.
  33. `topic.creation.$alias.include`: A list of strings that represent regular expressions that match topic names. This list is used to include topics with matching values, and apply this group’s specific configuration to the matching topics. `$alias` applies to any group defined in `topic.creation.groups`. This property does not apply to the `default` group.
      - Type: List of String types
      - Default: empty
      - Possible Values: Comma-separated list of exact topic names or regular expressions.
  34. `topic.creation.$alias.exclude`: A list of strings representing regular expressions that match topic names. This list is used to exclude topics with matching values from getting the group’s specfic configuration. `$alias` applies to any group defined in `topic.creation.groups`. This property does not apply to the `default` group. Note that exclusion rules override any inclusion rules for topics.
      - Type: List of String types
      - Default: empty
      - Possible Values: Comma-separated list of exact topic names or regular expressions.
  35. `topic.creation.$alias.${kafkaTopicSpecificConfigName}`: Any of the [Changing Broker Configurations Dynamically](https://docs.confluent.io/platform/current/kafka/dynamic-config.html#changing-broker-configurations-dynamically) for the version of the Kafka broker where the records will be written. The broker’s topic-level configuration value is used if the configuration is not specified for the rule. `$alias` applies to the default group as well as any group defined in `topic.creation.groups`
      - Type: property values
      - Default: Kafka broker value
  36. `value.subject.name.strategy`: Determines how to construct the **subject** name under which the **value schema** is registered with **Schema Registry**.
      - Any implementation of `io.confluent.kafka.serializers.subject.strategy.SubjectNameStrategy` can be specified. By default, `<topic>-value` is used as **subject**. Specifying an implementation of `io.confluent.kafka.serializers.subject.SubjectNameStrategy` is deprecated as of `4.1.3` and if used may have some performance degradation.
      - Type: class
      - Default: `class io.confluent.kafka.serializers.subject.TopicNameStrategy`
      - Importance: medium
  37. `key.converter` and `value.converter`: These properties specify how the connector should serialize the key and value of the messages it produces.

  - Examle:You need to use the Avro Converter.

  10. `value.converter.schema.registry.url`: This points to the URL of the Schema Registry, allowing the connector to use registered schemas.
  11. `value.converter.value.subject.name.strategy`: This sets the naming strategy for the schema subjects (for values). By default, it uses the TopicNameStrategy, which registers the subject as topic-name-value (in this case, users.customers.avro.v1-value)

# Commands

1. **Command 1**: **Get Available Connector Plugins**

   - If you need to check the list of available **plugins** you should hit `localhost:8083/connector-plugins`:

     ```sh
        curl localhost:8083/connector-plugins
        # or
       curl localhost:8083/connector-plugins | json_pp
     ``

     ```

   - The `curl` command you ran is querying the **Kafka Connect** REST API to list the available **connector plugins** on your **Kafka Connect** instance.
   - Examle Output:

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

   - Here, the response indicates that several **connector plugins** are available, each identified by its class, type, and version.

     1. **JdbcSinkConnector** and **JdbcSourceConnector**:

        - `io.confluent.connect.jdbc.JdbcSinkConnector` (version 10.7.6): A **sink connector** that allows data to be written from **Kafka topics** into a relational database using **JDBC**.
        - `io.confluent.connect.jdbc.JdbcSourceConnector` (version 10.7.6): A **source connector** that allows data to be ingested from a relational database into **Kafka topics** using **JDBC**

     2. **MirrorMaker 2 Connectors**
        - `org.apache.kafka.connect.mirror.MirrorCheckpointConnector` (version 1): Part of **MirrorMaker 2**, this **connector** helps manage the **offsets** in the target cluster, allowing **consumers** to pick up where they left off after a failover.
        - `org.apache.kafka.connect.mirror.MirrorHeartbeatConnector` (version 1): Also part of **MirrorMaker 2**, this **connector** is used for monitoring and ensuring the health and consistency of the data replication process.
        - `org.apache.kafka.connect.mirror.MirrorSourceConnector` (version 1): This **connector** is responsible for replicating data from one **Kafka cluster** to another (cross-cluster mirroring).

2. **Command 2**: **Register Source Connector**

   - Register jdbc Postgres Source Connector by:

     ```sh
      curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @01-jdbc-postgresdb-source-connector-for-participants-surveys-with-protobuf.json
     ```

   - Example Output:

3. **Command 3**: **Get a List of all Connectors**

   - To get a list of connectors for your Apache Kafka® cluster:

     ```sh
       curl --location --request GET 'http://localhost:8083/connectors'
     ```

   - Example Output:
     ```sh
       ["jdbc-protobuf-connector-for-customers-postgresdb","jdbc-avro-connector-for-customers-postgresdb","jdbc-protobuf-connector-for-participants-surveys-postgresdb"]
     ```

4. **Command 4**: **Check the Connector Status**

   - Use the following command to check the status of your Kafka Connect connector

     ```sh
       curl -X GET http://localhost:8083/connectors/jdbc-avro-connector-for-customers-postgresdb/status
     ```

   - Example Output:

5. **Command 5**: **Pause a Connector**

   - Examle:
     ```sh
       curl -X PUT http://localhost:8083/connectors/jdbc-json-connector-for-customers-postgresdb/pause
     ```

6. **Command 6**: **Resume a Connector**

   - Example Output:

7. **Command 7**: **Update a Connector**

   - Example Output:

8. **Command 8**: **Delete a Connector**

   - Remove the **connectors** by:
     ```sh
       curl -X DELETE http://localhost:8083/connectors/jdbc-protobuf-connector-for-participants-surveys-postgresdb
     ```
   - Example Output:

# Resources and Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
2. [docs.confluent.ion - How to Use Kafka Connect - Get Started](https://docs.confluent.io/platform/current/connect/userguide.html)
3. [redpanda - Understanding Apache Kafka](https://www.redpanda.com/guides/kafka-tutorial-what-is-kafka-connect)
4. [cloud.google.com/iam/docs/keys-create-delete#console](https://cloud.google.com/iam/docs/keys-create-delete#console)
