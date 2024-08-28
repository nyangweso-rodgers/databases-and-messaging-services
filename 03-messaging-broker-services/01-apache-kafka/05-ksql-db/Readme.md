# ksqdb

## Table Of Contents

# ksqdb

- [ksqlDB](https://ksqldb.io/) is a real-time event-streaming database built on top of **Apache Kafka**. It combines powerful stream processing with a relational database model using SQL syntax. It can connect multiple **Apache Kafka** instances at the same time, providing an alternative to manipulate the data streams with almost no code.

# Use Cases Of ksqdb

- The main use cases for adopting **ksqlDB** are the following:
  1. Materialized caches
  2. Streaming ETL pipelines
  3. Event-driven microservices

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

## 8.3 ksqlDB UI

- **ksqlDB UI** is accessible via the **Confluent Control Center** and provides a GUI for interacting with **ksqlDB**. This UI allows users to write and execute **ksqlDB** queries, manage streams and tables, and visualize real-time data flows. The **ksqlDB UI** simplifies the process of developing and managing stream processing applications by offering features like inline autocompletion, schema inspection, and query visualization.

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

# Resources and Further Reading

1. [ksqldb.io](https://ksqldb.io/)
