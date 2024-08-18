# cp-kafka-connect

## Table Of Contents

# What is Kafka Connect

- **Kafka Connect** is a tool for scalably and reliably streaming data between **Apache Kafka** and other data systems. It makes it simple to quickly define **connectors** that move large data sets in and out of **Kafka**. **Kafka Connect** can ingest entire databases or collect metrics from all your application servers into **Kafka topics**, making the data available for stream processing with low latency. An export **connector** can deliver data from **Kafka topics** into secondary indexes like Elasticsearch, or into batch systems–such as Hadoop for offline analysis.

# Benefits of Kafka Connect

# kafka Connect Concepts

## 1. Connectors

- **Kafka Connect** includes two types of connectors:
  1. **Source Connector**: ingest entire databases and stream table updates to **Kafka topics**. **Source connectors** can also collect metrics from all your application servers and store the data in Kafka topics–making the data available for stream processing with low latency.
  2. **Sink Connector**: deliver data from **Kafka topics** to secondary indexes, such as Elasticsearch, or batch systems such as Hadoop for offline analysis.
- Remark:
  - Confluent offers several [pre-built connectors](https://www.confluent.io/product/connectors/?session_ref=https://www.google.com/&_ga=2.266203727.1350022208.1723832910-234518971.1709664712&_gl=1*ss8h9o*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyMzk5MDkzNi4xNDQuMS4xNzIzOTkxOTE1LjQ4LjAuMA..) that can be used to stream data to or from commonly used systems.

## 2. Task

## 3. Workers

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

# Running Kafka Connect in Docker

## Kafka Connect Images on Docker Hub

- [Confluent]() maintains its own image for **Kafka Connect**,[confluentinc/cp-kafka-connect](https://hub.docker.com/r/confluentinc/cp-kafka-connect), which provides a basic Connect worker to which you can add your desired **JAR files** for **sink** and **source connectors**, single message **transforms**, and **converters**.

## Adding Connectors to a Container

- You can use [Confluent Hub]() to add your desired **JARs**, either by installing them at runtime or by creating a new Docker image. Of course, there are pros and cons to either of these options, and you should choose based on your individual needs.

## Adding Connectors to a Container (By Build a New Container Image)

- One opton to add dependencies, and the option probably most often used in production deployments, is to build a new image.
- Make sure to use the correct Confluent base image version and also check the specific documentation for each of your **connectors**.
  ```Dockerfile
    FROM confluentinc/cp-kafka-connect:7.1.0-1-ubi8
    ENV CONNECT_PLUGIN_PATH: "/usr/share/java,/usr/share/confluent-hub-components"
    RUN confluent-hub install --no-prompt neo4j/kafka-connect-neo4j:2.0.2
  ```

## Adding Connectors to a Container (Add Connector Instance at Container Launch)

- Typically, you will add **connector** instances once the worker process is running by manually submitting the configuration or via an external automation. However, you may find—perhaps for demo purposes—that you want a self-sufficient container that also adds the connector instance when it starts. To do this, you can use a launch script that looks like this:

# How to Use Kafka Connect

## Step 1: Install a Connect plugin

- A **Kafka Connect plugin** is a set of **JAR files** containing the implementation of one or more **connectors**, **transforms**, or **converters**. **Connect** isolates each **plugin** from one another so libraries in one **plugin** are not affected by the libraries in any other **plugins**. This is very important when mixing and matching **connectors** from multiple providers.
- A **Kafka Connect plugin** can be any one of the following:
  1. A directory on the file system that contains all required **JAR files** and third-party dependencies for the **plugin**. This is most common and is preferred.
  2. A single uber JAR containing all the class files for a plugin and its third-party dependencies.
- To install a **plugin**, you must place the **plugin directory** in a directory already listed in the plugin path.
- To find the components that fit your needs, check out the [Confluent Hub](https://www.confluent.io/hub/?session_ref=https://www.google.com/&_gl=1*1sogvi8*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyMzk5MDkzNi4xNDQuMS4xNzIzOTkzMjEzLjYwLjAuMA..&_ga=2.28774524.1350022208.1723832910-234518971.1709664712) page-it has an ecosystem of connectors,transforms, and converters. For a full list of supported connectors, see [Supported Self-Managed Connectors](https://docs.confluent.io/platform/current/connect/supported.html)

# Introduction to Confluent's `cp-kafka-connect` Image

- Confluent's `cp-kafka-connect`, [confluentinc/cp-kafka-connect](https://hub.docker.com/r/confluentinc/cp-kafka-connect), is a **Docker image** that provides a scalable and distributed data integration tool to stream data between **Kafka** and other systems in real-time. The image includes essential components like:
  1. Kafka Connect,
  2. Schema Registry, and other dependencies.
- **Kafka Connect** (which is part of **Apache Kafka**) supports pluggable [connectors](https://www.confluent.io/hub/), enabling you to stream data between **Kafka** and numerous types of system, including to mention just a few:
  1. Databases
  2. Message Queues
  3. Flat files
  4. Object stores

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

## Step 1: Set up Postgres database

## Step 2: Set up local Kafka Cluster

## Step 3: Confluent Schema Registry

## Step 4: Kafka Connect

- **Confluent** maintains its own image for **Kafka Connect**, `cp-kafka-connect-base`, which provides a basic **Connect** worker to which you can add your desired **JAR files** for **sink** and **source connectors**, **single message transforms**, and **converters**.
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

## Connectors and Plugins

## Avro Plugin

- The **Avro converter** is a **plugin** that allows **Kafka Connect** to handle data in the **Avro format**. It's typically included in pre-built **Kafka Connect** images like `confluentinc/cp-kafka-connect`.
- Remark:
  - If you're using a pre-built image, you generally don't need to install the Avro plugin separately. The image should already contain the necessary components.

## Step 5: Installing Connectors

- [Since Confluent Platform 6.0 connectors are no longer bundled](https://docs.confluent.io/platform/current/release-notes/index.html#connectors), and need to be installed separately. You can [build your own image](https://docs.confluent.io/platform/current/installation/docker/development.html#create-a-docker-image-containing-c-hub-connectors) based on **cp-kafka-connect-base**, or install **connectors** at runtime by overwriding the image command.
- Understanding the process:
  1. **Choose a connector**: **Connectors** can easily be installed through [the Connector Hub](https://www.confluent.io/hub/)
     - Example:
       - For **Postgres** to **Kafka**, the **Debezium Postgres connector** is a popular choice.
  2. **Obtain the JAR**: Download the connector's JAR file from the respective repository or build it from source if necessary.
  3. **Configure the Connector**: Create a JSON configuration file specifying the connector's properties (e.g., database connection details, target topic).
  4. **Mount the JAR**: Add the **JAR** file to a directory on your local machine and mount it to the container's plugin path.
  5. **Set the Plugin Path**: Configure the `CONNECT_PLUGIN_PATH` environment variable to point to the mounted directory.

## Step 5.1: JDBC Source Connector

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

# How to Install Connector Plugins in Kafka Connect

## 1. Manual Installation

- Download the **JAR** file (usually from [Confluent Hub](https://www.confluent.io/hub/)) and place it in a folder on your **Kafka Connect** worker (directory specified by the CONNECT_PLUGIN_PATH environment variable). This method offers granular control but requires manual intervention on each node.

- Your directory should look like this:

## 2. Install Connector Plugin using Docker

- With **Docker** it can be a bit more tricky because you need to install the **plugin** before the worker starts. If you try to install it in the **Docker container** and then restart the worker, the **container** restarts and you lose the **JAR** that you installed. There are two approaches to use.

## 2.1: Install using Docker at Runtime

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

## 2.2: Install using `Dockerfile`

- For any non-trivial **Docker** deployment you’re going to want to build and curate your own **Docker image** with the **connector plugin**(s) that you require for your environment.
- Best for production environments where you need reproducibility, version control, and consistent deployments.
- To do this:

1. Step 1: Download connector from [https://www.confluent.io/hub/](https://www.confluent.io/hub/)
   - Example:
     - Download [Debezium PostgreSQL CDC Source Connector](https://www.confluent.io/hub/debezium/debezium-connector-postgresql)
   - Key Components of the downloaded folder are:
     1. `lib/`: This directory holds the core JAR file containing the connector implementation. This is the essential part for your **Docker image**.
     2. `assets/`, `doc/`, `etc/`: These directories contain additional resources like configuration examples, documentation, and other supporting files. While not strictly required for the connector to function, they can be useful for reference and troubleshooting.
2. Step 2: Create a `cp-kafka-connect/` for the downloaded connectors. Here is how my directory looks like:
   - cp-kafka-connect/
     - Dockerfile
     - plugins
       - debezium-debezium-connector-postgres-2.5.4
         - assets/
         - doc/
         - etc/
         - lib/
         - manifest.json
3. Step 2: create a `Dockerfile` and configure the files:
   - **Example** (for debezium Postgres CDC Source Connector):
   ```Dockerfile
     #FROM confluentinc/cp-kafka-connect-base:5.5.0
     FROM confluentinc/cp-kafka-connect:7.7.0
     ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"
     RUN confluent-hub install --no-prompt jcustenborder/kafka-connect-spooldir:2.0.43
   ```

- and then build it:
  ```sh
    docker build -t kafka-connect-spooldir .
  ```

## Step 2: Add **connector** "example JDBC" from [Confluent Hub](https://www.confluent.io/hub)

```Dockerfile
  FROM confluentinc/cp-kafka-connect
  ENV MYSQL_DRIVER_VERSION 5.1.39
  RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.5.0
  RUN curl -k -SL "https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${MYSQL_DRIVER_VERSION}.tar.gz" \
      | tar -xzf - -C /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib \
      --strip-components=1 mysql-connector-java-5.1.39/mysql-connector-java-${MYSQL_DRIVER_VERSION}-bin.jar
```

## Step 3: Build the docker image

```sh
  docker build . -t my-kafka-connect-jdbc:1.0.0
```

## Step 6: Test your Connect server:

```sh
  curl --location --request GET 'http://localhost:8083/connectors'
```

### Step 1.3: Get available Connector Plugins

```sh
  curl localhost:8084/connector-plugins | json_pp
```

- If you need to check the list of available **plugins** you should hit `localhost:8083/connector-plugins`
  ```sh
      curl localhost:8084/connector-plugins
  ```

# Resources and Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
