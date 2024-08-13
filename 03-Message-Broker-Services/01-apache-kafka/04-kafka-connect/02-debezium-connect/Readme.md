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

# Resources and Further Reading

1. [https://github.com/data-burst/debezium_avro_integration](https://github.com/data-burst/debezium_avro_integration)
