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

### Task assignment

- Each **task** processes a subset of the data for a **connector**. For example, if the source system is a database table, you may assign each task a partition of the table data based on some criteria like a column value.
- Some ways in which **tasks** can be assigned partitions:
  1. Round-robin for non-partitioned tables
  2. Hash partitioning based on the hash of the primary key column
  3. Time-based date or timestamp ranges
  4. Custom like any application-specific logic
- If there are no natural partitions, **Kafka Connect** distributes partitions across tasks randomly using round-robin.

### Task configuration

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

## 5. Transforms

- **Connectors** can be configured with **transformations** to make simple and lightweight modifications to individual messages.
- A **transform** is a simple function that accepts one record as an input and outputs a modified record. All transforms provided by Kafka Connect perform simple but commonly useful modificationss

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
  - If you're using a pre-built image, you generally don't need to install the Avro plugin separately. The image should already contain the necessary components.

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

- Build a `Dockerfile`

- Remarks:
  1. [Kafka Connect Neo4j Connector](https://neo4j.com/docs/kafka/current/quickstart-connect/)

## Step 3.2: Adding Connectors to a Container (Install using Docker at Runtime)

- Typically, you will add **connector** instances once the worker process is running by manually submitting the configuration or via an external automation.
- When a **Docker container** is run, it uses the `Cmd` or `EntryPoint` that was defined when the image was built. [Confluent’s Kafka Connect image](https://hub.docker.com/r/confluentinc/cp-kafka-connect-base) will—as you would expect—launch the **Kafka Connect** worker.
  ```sh
    docker inspect --format='{{.Config.Cmd}}' confluentinc/cp-kafka-connect-base:5.5.0
  ```
- We can override that at runtime to install the **plugins** first. In **Docker Compose** this looks like this:
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

## Step 3.3: Manual Installation

- Download the **JAR** file (usually from [Confluent Hub](https://www.confluent.io/hub/)) and place it in a folder on your **Kafka Connect** worker (directory specified by the CONNECT_PLUGIN_PATH environment variable). This method offers granular control but requires manual intervention on each node.
- Key Components of the downloaded folder are:
  1.  `lib/`: This directory holds the core JAR file containing the connector implementation. This is the essential part for your **Docker image**.
  2.  `assets/`, `doc/`, `etc/`: These directories contain additional resources like configuration examples, documentation, and other supporting files. While not strictly required for the connector to function, they can be useful for reference and troubleshooting.
- Step 2: Create a `cp-kafka-connect/` for the downloaded connectors. Here is how my directory looks like:
  - cp-kafka-connect/
    - Dockerfile
    - plugins
      - debezium-debezium-connector-postgres-2.5.4
        - assets/
        - doc/
        - etc/
        - lib/
        - manifest.json
- Step 3: create a `Dockerfile` and configure the files:
  - **Example** (for debezium Postgres CDC Source Connector):
    `Dockerfile
  #FROM confluentinc/cp-kafka-connect-base:5.5.0
  FROM confluentinc/cp-kafka-connect:7.7.0
  ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"
  RUN confluent-hub install --no-prompt jcustenborder/kafka-connect-spooldir:2.0.43
`
    ######################### ----------------------------------- #############################################

## Step 4: Get Available Connector Plugins

```sh
  curl localhost:8083/connector-plugins | json_pp
```

- If you need to check the list of available **plugins** you should hit `localhost:8083/connector-plugins`
  ```sh
      curl localhost:8083/connector-plugins
  ```

## Step 5: Connector Configuration

- To set up a **connector**, you need to create a JSON configuration file that specifies details such as:
  1. Connector class name
  2. External system connection parameters
  3. Topics to publish data to or consume data from
  4. Number of tasks
  5. Converters for serialization
  6.
- Example:

  - MySQL Connector:

    ```json
    {
      "name": "mysql-source-connector",

      "config": {
        "connector.class": "MySqlSourceConnector",

        "connection.url": "jdbc:mysql://localhost:3306/mydatabase",

        "table.whitelist": "users",

        "tasks.max": 2,

        "topic.prefix": "mysql-topic-",

        "key.converter": "org.apache.kafka.connect.json.JsonConverter",

        "value.converter": "org.apache.kafka.connect.json.JsonConverter"
      }
    }
    ```

  - PostgreSQL Connector:
    ```json
    {
      "name": "mysql-source-connector"
    }
    ```

## Step 6: Test Your Connect Server

```sh
  curl --location --request GET 'http://localhost:8083/connectors'
```

# Examples

- You can download connectors from [https://www.confluent.io/hub/](https://www.confluent.io/hub/)

## Example 1: [JDBC Source Connector](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc)

- We will use [JDBC Source Connector](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) that publishes any new table rows onto a **Kafka Topic**.
- We add both the [Avro Converter](https://www.confluent.io/hub/confluentinc/kafka-connect-avro-converter) and [JDBC Source/Sink](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) plugins to our **Docker image**.
- `Dockerfile` for **Kafka Connect** with **plugins**:

  ```Dockerfile
    FROM confluentinc/cp-kafka-connect-base:6.2.1

    # Install Avro & JDBC plugins
    RUN confluent-hub install --no-prompt confluentinc/kafka-connect-avro-converter:5.5.4
    RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.1.1
  ```

- Once all the above is up and running we’re ready to create our new **JDBC Source connector** to produce database records onto **Kafka**.

## Example 2: [Debezium PostgreSQL CDC Source Connector](https://www.confluent.io/hub/debezium/debezium-connector-postgresql)

- Download [Debezium PostgreSQL CDC Source Connector](https://www.confluent.io/hub/debezium/debezium-connector-postgresql)

## Step 2: Add **connector** "example JDBC" from [Confluent Hub](https://www.confluent.io/hub)

```Dockerfile
  FROM confluentinc/cp-kafka-connect
  ENV MYSQL_DRIVER_VERSION 5.1.39
  RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.5.0
  RUN curl -k -SL "https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${MYSQL_DRIVER_VERSION}.tar.gz" \
      | tar -xzf - -C /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib \
      --strip-components=1 mysql-connector-java-5.1.39/mysql-connector-java-${MYSQL_DRIVER_VERSION}-bin.jar
```

# Resources and Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
2. [docs.confluent.ion - How to Use Kafka Connect - Get Started](https://docs.confluent.io/platform/current/connect/userguide.html)
3. [redpanda - Understanding Apache Kafka](https://www.redpanda.com/guides/kafka-tutorial-what-is-kafka-connect)
