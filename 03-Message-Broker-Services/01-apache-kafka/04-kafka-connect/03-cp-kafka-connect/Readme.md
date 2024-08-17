# cp-kafka-connect

## Table Of Contents

# Introduction to Confluent's `cp-kafka-connect` Image

- Confluent's `cp-kafka-connect`, [confluentinc/cp-kafka-connect](https://hub.docker.com/r/confluentinc/cp-kafka-connect), is a **Docker image** that provides a scalable and distributed data integration tool to stream data between **Kafka** and other systems in real-time. The image includes essential components like:
  1. Kafka Connect,
  2. Schema Registry, and other dependencies.
- **Kafka Connect** (which is part of **Apache Kafka**) supports pluggable [connectors](https://www.confluent.io/hub/), enabling you to stream data between **Kafka** and numerous types of system, including to mention just a few:
  1. Databases
  2. Message Queues
  3. Flat files
  4. Object stores
- The appropriate **plugin** for the technology which you want to integrate can be found on [Confluent Hub](https://www.confluent.io/hub/). You need to install the **plugin** on each **Kafka Connect** worker in the **Kafka Connect** cluster. After installing the **plugin**, you must restart the **Kafka Connect** worker.

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

1. [docs.confluent.io - How to Use Kafka Connect - Get Started](https://docs.confluent.io/platform/current/connect/userguide.html#configuring-key-and-value-converters)
