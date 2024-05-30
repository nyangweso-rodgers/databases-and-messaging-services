# Kafka Connect

## Table Of Contents

# Kafka Connect

- **Kafka Connect** is a tool for scalably and reliably streaming data between **Apache Kafka** and other data systems. It makes it simple to quickly define connectors that move large data sets in and out of Kafka. **Kafka Connect** can ingest entire databases or collect metrics from all your application servers into **Kafka topics**, making the data available for **stream processing** with low latency.

# How Kafka Connect Works

- You can deploy **Kafka Connect** as a standalone process that runs jobs on a single machine (for example, log collection), or as a distributed, scalable, fault-tolerant service supporting an entire organization.

# Run Debezium Kafka Connect using Docker

```yml
# debezium connector
kconnect:
  image: debezium/connect:1.9
  ports:
    - 8083:8083
  environment:
    CONFIG_STORAGE_TOPIC: my_connect_configs
    OFFSET_STORAGE_TOPIC: my_connect_offsets
    STATUS_STORAGE_TOPIC: my_connect_statuses
    BOOTSTRAP_SERVERS: kafka:29091,kafka2:29093
  links:
    - zookeeper
    - postgres
  depends_on:
    - kafka
    - zookeeper
    - postgres
    - mongo
```

# Resources and Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
