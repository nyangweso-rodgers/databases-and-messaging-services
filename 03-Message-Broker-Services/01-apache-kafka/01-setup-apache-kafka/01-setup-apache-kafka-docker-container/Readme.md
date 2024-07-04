# Setting Up Kafka Server on Docker

## Table of Contents

# Setting up Kafka on Docker

- With **Docker**, we don't have to install various tools manually, instead, we write a `docker-compose.yml` to manage **containers**.

# 1. Zookeeper

- [Zookeeper](https://zookeeper.apache.org/) is a **service** for managing and synchronizing distributed systems. It is a service used to manage **Kafka clusters**.
- **Kafka** uses **Zookeeper** to manage the **brokers** in a **cluster**, and requires **Zookeeper** even if you're running a **Kafka cluster** with only one **broker**.

## How to Configure Zookeeper

- Add configurations for `zookeeper` service

  ```yml
  services:
    zookeeper:
      environment:
        ZOOKEEPER_CLIENT_PORT: 2181
        ZOOKEEPER_TICK_TIME: 2000
        ZOOKEEPER_SERVER_ID: 2
  ```

- Where:
  - `ZOOKEEPER_CLIENT_PORT`: instructs `Zookeeper` where it should listen for connections by clients- **Kafka** in our case.
  - `ZOOKEEPER_SERVER_ID`: When running in **clustered mode**, we have to set the `ZOOKEEPER_SERVER_ID`.

# 2. Kafka

## How to Configure Kafka

- Add configurations for `kafka` service
  ```yml
  services:
    kafka:
      depends_on:
        - zookeeper
      environment:
        KAFKA_BROKER_ID: 1
        KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
        KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 2
        KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 2
        KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 2
  ```
- Where:
  - `depends_on` will make sure to start the **zookeeper** container before the **kafka**.

## Kafka Environment Variables

### Kafka Environment Variables 1: Kafka Broker ID

- `KAFKA_BROKER_ID`: Unique identifier for the **Kafka broker** within the **cluster**. Each broker must have a unique ID.

### Kafka Environment Variables 2: Zookeeper Connection

- `KAFKA_ZOOKEEPER_CONNECT`: Specifies the **Zookeeper** connection string, listing the **Zookeeper** instances that manage **Kafka** metadata and coordinate brokers. i.e., `KAFKA_ZOOKEEPER_CONNECT` instructs **Kafka** where it can find the **Zookeeper**.

### Kafka Environment Variables 3: Listeners

- `KAFKA_ADVERTISED_LISTENERS`: Defines how **Kafka brokers** communicate with **clients**. In this case, it uses **plaintext** communication over ports `29092`.

### Kafka Environment Variables 4: Replication Factors

- `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR`: Sets the replication factor for the internal **offsets** topic, which tracks **consumer offsets**. A higher replication factor increases fault tolerance.
- `KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR`: Sets the **replication factor** for the transaction state log, ensuring that transaction data is replicated for durability.
- `KAFKA_TRANSACTION_STATE_LOG_MIN_ISR`: Minimum in-sync replicas required for the transaction state log, ensuring high availability.

### Kafka Environment Variables 5: `KAFKA_DEFAULT_REPLICATION_FACTOR: '2'`

- In **Kafka**, a **topic** can be replicated across multiple **brokers** for redundancy and fault tolerance. The **replication factor** specifies the number of replicas for each **partition** of the **topic**. In this case, with a replication factor of `2`, each **partition** will be copied to two **brokers**.
- The common default value for this configuration is `2`. This ensures some level of redundancy for user-created topics.

#### Kafka Environment Variables 6: `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1`

- This configuration specifically targets the **replication factor** for the internal **Kafka offsets topic**. This **topic** is used by **Kafka** to store information about consumer offsets (positions within topics). The default value for this configuration is usually `1`. Since the **offsets topic** stores metadata and is less critical for data integrity compared to user topics, a single replica might be sufficient.

#### Kafka Environment Variables 7: `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`

- `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`: Defines `key/value` pairs for the security protocol to use, per listener name.

#### Kafka Environment Variables 8: `KAFKA_ADVERTISED_LISTENERS`

- `KAFKA_ADVERTISED_LISTENERS` environment variable specifies the listeners that the **Kafka broker** advertises to other components in the **cluster**. These listeners define the network interfaces and ports on which the broker listens for communication. i.e., `ADVERTISED_LISTENERS` are how **clients** can connect.
- For configuring this correctly, you need to understand that **Kafka brokers** can have multiple **listeners**. A **listener** is a combination of:
  1. Host/IP
  2. Port
  3. Protocol
- Why is it Important?

  - **Client Discovery**: When other components like **producers**, **consumers**, **Schema Registry**, or **Kafka UI** need to connect to the **Kafka broker**, they rely on the **advertised listeners** to discover the broker's address.
  - **Inter-Broker Communication**: **Kafka brokers** use **advertised listeners** to communicate with each other for tasks like leader election and replication.

- `KAFKA_ADVERTISED_LISTENERS` **Syntax**:
  - `Listener Type`: Each entry in the `KAFKA_ADVERTISED_LISTENERS` configuration specifies a **listener type** which define how **clients** can connect to the **Kafka broker**. Common listener types include `PLAINTEXT`, `SSL`, `SASL_SSL`, etc. In our examples, `PLAINTEXT` is used, which means **unencrypted connections**.
  - `Endpoint Configuration`: Each **listener type** is followed by the endpoint configuration, which includes the `hostname` and `port` where clients should connect. The format is `listener_type://hostname:port`. In our examples, `kafka` refers to the `hostname` of the **Kafka broker** container, and `localhost` refers to the `localhost` of the host machine running **Docker**. The `port` specified here should be the `port` on which the **Kafka broker** is running inside the container.
  - `Multiple Listeners`: You can specify multiple listeners by separating them with commas. This allows clients to connect to the **Kafka broker** using different protocols or network configurations. For example, in one configuration, you might expose **Kafka** to the internal Docker network (`kafka:29092`), while in another configuration, you might expose **Kafka** to the host machine's localhost (`localhost:9101`).
  - `Listener Names`: Optionally, you can also specify a **listener name**, which allows you to differentiate between listeners when configuring security settings or client connections.
- **Examples**:

  - `KAFKA_LISTENERS`: is a comma-separated list of listeners and the **host/IP** and port to which Kafka binds to for listening. For more complex networking, this might be an IP address associated with a given network interface on a machine. The default is 0.0.0.0, which means listening on all interfaces.
  - `KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092`:This configuration advertises a single listener using the `PLAINTEXT` protocol on port `29092`.
    - The **hostname** used is "`kafka`," which likely refers to the container name for the `Kafka` broker service in a `docker-compose.yml`.
    - This setup exposes the broker only internally within the Docker network.
    - Why? This might be suitable for a simple setup where all components (`Zookeeper`, `Schema Registry`, `Kafka UI`) reside within the same Docker network and use the container name for discovery.
  - `KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9101`: This configuration advertises two listeners:

    - `PLAINTEXT` on port `29092` with hostname "`kafka`" (internal).
    - `PLAINTEXT` on port `9101` with hostname "`localhost`" (external)
    - This setup exposes an internal listener for components within the Docker network and an external listener accessible from the host machine (assuming Docker is running on the host).
    - Why? This allows external **producers** and **consumers** to send messages to the broker using "`localhost:9101`". Internal components can still use "`kafka:29092`".

  - `KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9101,PLAINTEXT_INTERNAL://kafka:29092`: This configuration prioritizes the external listener. It advertises:

    - `PLAINTEXT` on port `9101` with hostname "`localhost`" (external)
    - `PLAINTEXT` on port `29092` with a custom name "`kafka`" (internal, might not be discoverable by other services).
    - Why? This setup might be useful if you primarily need to access the broker from the host machine (external) and only use internal components for specific tasks. However, the internal listener with a custom name might require additional configuration for other services to connect using "`kafka:29092`".

# 3. Schema Registry

- **Schema Registry** is a service that provides a RESTful interface for managing and validating **Avro schemas**. It serves as a central repository for schemas and ensures that data produced and consumed in **Kafka topics** adhere to a consistent format. This helps in maintaining data compatibility and evolution.
- Key Components include:
  - **Schemas**: Define the structure of data records. **Avro schemas** are the most commonly used format.
  - **Subjects**: Logical groupings of schemas, usually corresponding to **Kafka topics**.
  - **Compatibility Checks**: Ensures new schema versions are compatible with previous versions according to defined compatibility rules.

## How to Configure Schema Registry

- Add configurations for `schema-registry` service

  ```yml
  services:
    schema-registry:
      image: confluentinc/cp-schema-registry:latest
      hostname: schema-registry
      container_name: schema-registry
      depends_on:
        - zookeeper
        - kafka
      ports:
        - "8081:8081"
      environment:
        SCHEMA_REGISTRY_HOST_NAME: schema-registry
        SCHEMA_REGISTRY_KAFKASTORE_CONNECTION_URL: zookeeper:2181
        SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka:29092
      restart: unless-stopped
      healthcheck:
        start_period: 10s
        interval: 10s
        retries: 20
        test: curl --user superUser:superUser --fail --silent --insecure http://localhost:8081/subjects --output /dev/null || exit 1
  ```

## Schema Registry Configuration Explanation

### 3.1 Dependencies

- `depends_on`: Specifies that the **Schema Registry** service depends on **Zookeeper** and **Kafka** services to be up and running. This ensures that **Schema Registry** starts only after its dependencies are available.

### 3.2 Ports

- `8081:8081`: Exposes port `8081`, which is the default port for the Schema Registry’s RESTful API.

### 3.3 Environment Variables

- `SCHEMA_REGISTRY_HOST_NAME`: Sets the hostname for the Schema Registry service.
- `SCHEMA_REGISTRY_KAFKASTORE_CONNECTION_URL`: Defines the connection URL for **Zookeeper** instances that the **Schema Registry** will use to manage **Kafka** metadata.
- `SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS`: Lists the **Kafka bootstrap servers** for the **Schema Registry** to connect to.

# 4. Web UIs for managing Apache Kafka

## 4.1 Web UIs for managing Apache Kafka: UI for Apache Kafka

- **Kafka UI** —or, as its developer **Provectus** calls it, **UI for Apache Kafka** — is a free, open source web UI that stands out for being lightweight and easy to use.

## How to Configure Kafka UI

- [provectuslabs/kafka-ui](https://hub.docker.com/r/provectuslabs/kafka-ui) is a Free, open-source web UI to monitor and manage Apache Kafka **clusters**.
- `kafka-ui` is an application that will give us a UI to view our **cluster**.

  ```yml
  services:
    kafka-ui:
  ```

- Where:
  - `KAFKA_CLUSTERS_0_NAME: xxxxxx`: is the **Cluster name**. In this case, the cluster name will be `local`
  - `KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS:` is the Address where to connect
  - `KAFKA_CLUSTERS_0_SCHEMAREGISTRY`: for SchemaRegistry's address

## 4.2 Web UIs for managing Apache Kafka: Conduktor

- **Conduktor** for Apache Kafka is a comprehensive platform that enables users to easily manage, monitor, and analyze their Kafka clusters. It provides a powerful user interface to manage Kafka resources, perform analytics, and monitor tasks with built-in tools. Furthermore, Conduktor includes enterprise-grade features such as **data masking**, cold storage, multitenancy, audit logs, message encryption, and many other features that make it an excellent solution for large enterprises that must meet strict compliance and governance regulations.

## 4.3 Web UIs for managing Apache Kafka: Redpanda Console

# 5. Kafka REST Proxy

- **Kafka REST Proxy** provides a RESTful interface to interact with **Apache Kafka clusters**, allowing applications to produce and consume messages via HTTP. This is particularly useful for clients that do not have a native Kafka library or require an HTTP-based interface for simplicity.

## Kafka REST Proxy Service Configuration

```yml
services:
  rest-proxy:
    image: confluentinc/cp-kafka-rest:latest
    depends_on:
      - zookeeper
      - kafka
      - schema-registry
    ports:
      - "8082:8082"
    hostname: rest-proxy
    container_name: rest-proxy
    environment:
      KAFKA_REST_HOST_NAME: rest-proxy
      KAFKA_REST_BOOTSTRAP_SERVERS: "kafka:29092"
      KAFKA_REST_LISTENERS: "http://0.0.0.0:8082"
```

## Kafka REST Proxy Configuration Explanation

### 5.1 Dependencies:

- `depends_on`: Specifies that the Kafka **REST Proxy service** depends on **Zookeeper**, **Kafka**, and **Schema Registry** services to be up and running. This ensures that the **REST Proxy** starts only after its dependencies are available.

### 5.2 Ports

- `8082:8082`: Exposes port `8082`, which is the default port for the Kafka REST Proxy’s RESTful API.

### 5.3 Environment Variables

- `KAFKA_REST_HOST_NAME`: Sets the **hostname** for the **Kafka REST Proxy** service.
- `KAFKA_REST_BOOTSTRAP_SERVERS`: Lists the **Kafka bootstrap servers** for the **REST Proxy** to connect to. This enables the proxy to communicate with the Kafka cluster.
- `KAFKA_REST_LISTENERS`: Defines the address and port on which the REST Proxy will listen for HTTP requests. In this case, it listens on all network interfaces (0.0.0.0) on port 8082.

# 6. Kafka Connect(debezium)

- **Kafka Connect** is a framework for integrating **Kafka** with various data sources and **sinks**. It enables you to stream data between **Kafka** and other systems, such as **databases**, key-value stores, search indexes, and file systems, without writing any code. **Kafka Connect** is highly scalable and fault-tolerant, making it ideal for building robust data pipelines.

## Kafka Connect Service Configurations

```yml
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

## Kafka Connect Configuration Explanation

### 6.1 Dependencies

- `depends_on`: Specifies that the **Kafka Connect service** depends on **Kafka brokers** (kafka). This ensures **Kafka Connect** starts only after the brokers are available.

### 6.2 Ports

- `8083:8083`: Exposes port `8083`, which is the default port for the Kafka Connect REST API.

### 6.3 Environment Variables

- `BOOTSTRAP_SERVERS`: Lists the Kafka bootstrap servers for Kafka Connect to communicate with.
- `GROUP_ID`: Sets the consumer group ID for Kafka Connect.
- `CONFIG_STORAGE_TOPIC`: The **topic** where connector configurations are stored.
- `OFFSET_STORAGE_TOPIC`: The **topic** where **offsets** are stored, tracking the progress of each connector.
- `STATUS_STORAGE_TOPIC`: The topic where the status of connectors and tasks are stored.
- `CONFIG_STORAGE_REPLICATION_FACTOR`, `OFFSET_STORAGE_REPLICATION_FACTOR`, `STATUS_STORAGE_REPLICATION_FACTOR`: Set the replication factors for the respective **topics**, ensuring fault tolerance.
- `CONNECT_KEY_CONVERTER` and `CONNECT_VALUE_CONVERTER`: Specify the converters used for keys and values. In this case, the JsonConverter is used.
- `CONNECT_KEY_CONVERTER_SCHEMAS_ENABLE` and `CONNECT_VALUE_CONVERTER_SCHEMAS_ENABLE`: Disable schema support for the converters, using plain JSON instead.
- `KEY_CONVERTER` and `VALUE_CONVERTER`: Set the converters for keys and values.
- `ENABLE_DEBEZIUM_SCRIPTING`: Enables scripting support for Debezium connectors, allowing custom transformations.

# 7. ksqlDB Server

- **ksqlDB** is a streaming SQL engine that allows you to create real-time data processing and analytics applications using SQL. It builds on top of **Kafka Streams**, providing an easy-to-use SQL interface for stream processing. With **ksqlDB**, you can define stream transformations, aggregations, joins, windowing, and more using familiar SQL syntax.
- **Key Components** of **ksqlDB** include:
  - **Streams**: Represent unbounded, continuous data flowing from a **Kafka topic**.
  - **Tables**: Represent stateful, aggregated views of streams or other tables.
  - **Queries**: SQL statements that define how to process, transform, and analyze the data.
- Example:

  ```SQL
    -- Create a stream with raw data
    CREATE STREAM raw_data (
        before STRUCT<id INT, value STRING>,
        after STRUCT<id INT, value STRING>,
        source STRUCT<version STRING, connector STRING, name STRING, ts_ms BIGINT, snapshot STRING, db STRING, sequence ARRAY<STRING>, schema STRING, table STRING, txId INT, lsn BIGINT, xmin INT>,
        op STRING,
        ts_ms BIGINT,
        transaction STRUCT<id STRING, total_order BIGINT, data_collection_order BIGINT>
    )
    WITH (KAFKA_TOPIC='<topic name>', VALUE_FORMAT='JSON');


    -- Create a new stream with transformed data
    CREATE STREAM transformed_data AS
    SELECT after->id AS id,
          UCASE(after->value) AS value
    FROM raw_data
    WHERE after IS NOT NULL
    EMIT CHANGES;
  ```

## ksqlDB Server Service Configuration

```yml
services:
  ksqldb-server:
    image: confluentinc/cp-ksqldb-server:latest
    depends_on:
      - kafka
    ports:
      - "8088:8088"
    environment:
      KSQL_CONFIG_DIR: "/etc/ksqldb"
      KSQL_LISTENERS: http://0.0.0.0:8088
      KSQL_BOOTSTRAP_SERVERS: kafka:9092
      KSQL_KSQL_LOGGING_PROCESSING_STREAM_AUTO_CREATE: "true"
      KSQL_KSQL_LOGGING_PROCESSING_TOPIC_AUTO_CREATE: "true"
      KSQL_KSQL_SCHEMA_REGISTRY_URL: "http://schema-registry:8081"
      KSQL_HOST_NAME: ksqldb-server
      KSQL_CONNECT_URL: "http://connect:8083"
```

## ksqlDB Server Configuration Explanation

### 7.1 Dependencies

- `depends_on`: Specifies that the **ksqlDB server** depends on **Kafka brokers** (**kafka**). This ensures that the **ksqlDB server** starts only after the brokers are available.

### 7.2 Ports:

- `8088:8088`: Exposes port `8088`, which is the default port for the ksqlDB server’s REST API.

### 7.3 Environment Variables

- `KSQL_CONFIG_DIR`: Specifies the directory where **ksqlDB** configuration files are stored.
- `KSQL_LISTENERS`: Defines the address and port on which the ksqlDB server will listen for HTTP requests. In this case, it listens on all network interfaces (0.0.0.0) on port 8088.
- `KSQL_BOOTSTRAP_SERVERS`: Lists the Kafka bootstrap servers for the ksqlDB server to connect to. This enables the ksqlDB server to communicate with the Kafka cluster.
- `KSQL_KSQL_LOGGING_PROCESSING_STREAM_AUTO_CREATE` and `KSQL_KSQL_LOGGING_PROCESSING_TOPIC_AUTO_CREATE`: Automatically create logging processing streams and topics.
- `KSQL_KSQL_SCHEMA_REGISTRY_URL`: Specifies the URL for the **Schema Registry**, which is used for schema validation and management.
- `KSQL_HOST_NAME`: Sets the hostname for the ksqlDB server.
- `KSQL_CONNECT_URL`: Specifies the URL for Kafka Connect, enabling the ksqlDB server to interact with Kafka Connect for integration purposes.

# 8. Graphical user interfaces

## 8.1 Debezium UI

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

## 8.2 AKHQ

- **AKHQ** (formerly known as **KafkaHQ**) is an open-source web interface for managing and monitoring Apache Kafka clusters. It provides features like topic inspection, consumer group management, and real-time data browsing.

- Setup:
  ```yml
  services:
    akhq:
      image: tchiotludo/akhq:latest
      depends_on:
        - kafka
      ports:
        - "8080:8080"
      environment:
        AKHQ_CONFIGURATION: |
          akhq:
          connections:
            kafka-cluster:
              properties:
                bootstrap.servers: "kafka1:9092,kafka2:9092"
              schema-registry:
                url: "http://schema-registry:8081"
              connect:
                - name: "connect"
                  url: "http://connect:8083"
  ```
- Alternatives
  - **Kafka Manager** (Open Source): A web-based management tool for Kafka clusters, providing insights into broker stats, topics, and partitions.
  - **Confluent Control Center** (Enterprise): An enterprise-grade monitoring and management solution for **Kafka**, offering advanced features like end-to-end monitoring, client performance metrics, and more.

## 8.3 ksqlDB UI

- **ksqlDB UI** is accessible via the Confluent Control Center and provides a graphical interface for interacting with **ksqlDB**. This UI allows users to write and execute **ksqlDB** queries, manage streams and tables, and visualize real-time data flows. The **ksqlDB UI** simplifies the process of developing and managing stream processing applications by offering features like inline autocompletion, schema inspection, and query visualization.

- Setup:
  ```yml
  services:
    ksqldb-cli:
      image: confluentinc/cp-ksqldb-cli:latest # usage -> docker-compose exec ksqldb-cli ksql http://ksqldb-server:8088
      depends_on:
        - ksqldb-server
      volumes:
        - ./sql:/tmp
      entrypoint: /bin/sh
      tty: true
  ```
- Alternatives
  - **Confluent Control Center** (Enterprise): Offers a comprehensive UI for managing **ksqlDB**, along with other components of the Kafka ecosystem, providing robust tools for developing, monitoring, and scaling stream processing applications.
  - **DBVisualizer** (Open Source and Commercial): A universal database tool that can connect to various databases and offers advanced SQL querying, though not specifically tailored for stream processing like **ksqlDB**.

# 9. Start The Containers

- start the containers by:
  ```sh
    docker-compose up -d
  ```
- This command will start a new containers named "`kafka`" and map port `29092` of the host machine to port '`29092`' of the container. It also links the "`kafka`" container to the "`zookeeper`" container, so that the `Kafka` container can connect to the `zookeeper` container.
- Check the logs to see the **zookeeper** container has booted up successfully:
  ```sh
    docker logs zookeeper
  ```
- Check the logs to see the kafka server has booted up successfully
  ```sh
    docker logs kafka
  ```

# Resources and Further Reading

1. [github.com/cp-demo - docker-compose.yml](https://github.com/confluentinc/cp-demo/blob/5.0.0-post/docker-compose.yml)
2. [github.com/provectus - kafka-ui](https://github.com/provectus/kafka-ui/tree/master?tab=readme-ov-file)
3. [How To Set Up Apache Kafka With Docker?](https://codersee.com/how-to-set-up-apache-kafka-with-docker/)
4. [Kafka Listeners – Explained](https://www.confluent.io/blog/kafka-listeners-explained/)
5. [avro.apache.org/docs](https://avro.apache.org/docs/1.11.1/specification/_print/)
6. [developer.confluent.io/Schema compatibility](https://developer.confluent.io/courses/schema-registry/schema-compatibility/)
7. [https://towardsdev.com/implementing-change-data-capture-cdc-with-docker-postgresql-mongodb-kafka-and-debezium-a-c49b2b38a88c](https://towardsdev.com/implementing-change-data-capture-cdc-with-docker-postgresql-mongodb-kafka-and-debezium-a-c49b2b38a88c)
