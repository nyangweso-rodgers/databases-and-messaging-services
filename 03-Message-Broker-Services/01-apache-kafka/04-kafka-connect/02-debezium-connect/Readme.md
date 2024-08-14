# Debezium

## Table Of Contents

# Use Cases for Publishing Database Changes to Kafka

1. **Real-Time Analytics**: Feeding database changes to a real-time analytics system to provide up-to-the-minute insights.
2. **Event-Driven Architecture**: Enabling services to react to database changes, triggering workflows or business processes.
3. **Cache Invalidation**: Automatically invalidating or updating cache entries based on database changes to ensure consistency.
4. **Data Replication**: Replicating data across different data stores or geographic regions for redundancy and high availability.
5. **Audit Logging**: Keeping a comprehensive audit log of all changes made to database for compliance and debugging purposes.

# What Is Change Data Capture (CDC)?

# Use-cases of CDC

1. OLAP (online analytical processing) systems use CDC to migrate data from transactional databases to analytical databases.
2. OLTP (online transactional processing) systems can also use CDC as an event bus to replicate data in a different data store. For example, from MySQL to Elasticsearch.

# What is Debezium?

- **Debezium** is an open-source, distributed system that enables users to capture real-time changes so that applications can notice such changes and react to them. It consists of **connectors** that record all real-time data changes and store them as events in **Kafka topics**.
- **Debezium** supports various databases, including **PostgreSQL**, **MySQL**, and **MongoDB**, making it a versatile choice for change data capture (CDC) needs.

# Docker Compose Setup

## Configure Debezium UI

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

# Remarks:

1. From version 2.0, **Confluent Avro converters** was removed from Docker image. Here is the ticket https://issues.redhat.com/browse/DBZ-4952

# Debezium Avro Integration

- **Debezium Avro Integration** demonstrates how to leverage **Debezium** for capturing changes in your databases in real-time and serializing the data using Avro format, which is not only compact but also supports schema evolution.
- The problem with **Debezium** and its integration with `AVRO` on version > 2 is that it is dependent to more libraries (JAR files) that are listed on its official documentation.
- **Debezium** version: 2.5 (January 2024) Based on its [documentation](https://debezium.io/documentation/reference/2.5/configuration/avro.html), it is mentions a few required **JAR** files. But they aren't sufficient. the required **JAR** files are as below:
  1. avro
  2. common-config
  3. common-utils
  4. commons-compress
  5. failureaccess
  6. guava
  7. jackson-annotations
  8. jackson-core
  9. jackson-databind
  10. jackson-dataformat-csv
  11. kafka-avro-serializer
  12. kafka-connect-avro-converter
  13. kafka-connect-avro-data
  14. kafka-schema-registry-client
  15. kafka-schema-serializer
  16. kafka-schema-converter
  17. logredactor
  18. logredactor-metrics
  19. minimal-json
  20. re2j
  21. slf4j-api
  22. snakeyaml
  23. swagger-annotations

# Steps

## Step 9: Register Source Connector with Kafka Connect

- Use `curl` to make a **POST** request to your **Kafka Connect REST API** to register the connector.
- Syntax:
- Example 1: (For `customers`)
  ```sh
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @users.customers.json
  ```

## Step 10: Test the Debezium Source Connector

### Step 10.1: Test the Source Connector By Listing Kafka Topics

- If there was no issue running the above steps we could confirm that our **connector** is working fine by checking if the **topic** is created for `customers` table by the **connector**.
  ```sh
    kafka-topics --bootstrap-server localhost:29092 --list
  ```

### Step 10.2: Test the Source Connector By Reading (Viewing) Data

- We can check that the data availability on the **topic**.
- There would be data present in the **topic** because when the **connector** starts it takes an initial snapshot of the database table. This is a default `config` named `snapshot.mode` which we didn't configure but is set to `initial` which means that the **connector** will do a snapshot on the initial run when it doesn't find the last known **offset** from the transaction log available for the database server.
  ```bash
    # kafka bash
    kafka-console-consumer --bootstrap-server localhost:29092 --topic users.public.customers --from-beginning
  ```

## Step : Delete the Debezium Source Connector

- Remove the **connectors** by:
  ```sh
    curl -X DELETE http://localhost:8083/connectors/postgresdb-connector-for-customers-v1
  ```

# Resources and Further Reading

1. [https://github.com/data-burst/debezium_avro_integration](https://github.com/data-burst/debezium_avro_integration)
