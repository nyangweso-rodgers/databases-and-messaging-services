# Debezium

# What is Debezium?

- **Debezium** is a set of **source connectors** for **Kafka Connect**. We can use it to capture changes in our databases so that your applications can respond to them in real-time.
- **Debezium** is built upon the **Apache Kafka** project and uses **Kafka** to transport the changes from one system to another. The most interesting aspect of **Debezium** is that at the core it is using **Change Data Capture** (CDC) to capture the data and push it into **Kafka**. The advantage of this is that the source database remains untouched in the sense that we don’t have to add triggers or log tables. This is a huge advantage as triggers and log tables degrade performance.

# Run Debezium Kafka Connect using Docker

```yml
# debezium connector
debezium:
  #image: debezium/connect:1.9
  image: debezium/connect:latest
  ports:
    - 8083:8083
  environment:
    CONFIG_STORAGE_TOPIC: my_connect_configs
    OFFSET_STORAGE_TOPIC: my_connect_offsets
    STATUS_STORAGE_TOPIC: my_connect_statuses
    BOOTSTRAP_SERVERS: kafka:29092
  links:
    - zookeeper
    - postgres
  depends_on:
    - kafka
    - zookeeper
    - postgres
    - mongo
```

- Where:
  - `BOOTSTRAP_SERVERS: kafka:29092` - The **Kafka broker** to connect to.
  - `GROUP_ID: 1`: - Consumer group ID assigned to Kafka Connect consumer.
  - `CONFIG_STORAGE_TOPIC` - Topic to store connector configuration.
  - `OFFSET_STORAGE_TOPIC` - Topic to store connector offsets.
  - `STATUS_STORAGE_TOPIC` - Topic to store connector status.

# Resources and Further Reading

1. [official tutorial for Debezium UI ](https://debezium.io/blog/2021/08/12/introducing-debezium-ui/)
