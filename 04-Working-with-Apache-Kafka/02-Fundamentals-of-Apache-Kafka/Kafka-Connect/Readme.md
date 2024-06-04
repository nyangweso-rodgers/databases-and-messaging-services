# Kafka Connect

## Table Of Contents

# Kafka Connect

- **Kafka Connect** is a tool for scalably and reliably streaming data between **Apache Kafka** and other data systems. It makes it simple to quickly define connectors that move large data sets in and out of Kafka. **Kafka Connect** can ingest entire databases or collect metrics from all your application servers into **Kafka topics**, making the data available for **stream processing** with low latency.

# How Kafka Connect Works

- You can deploy **Kafka Connect** as a standalone process that runs jobs on a single machine (for example, log collection), or as a distributed, scalable, fault-tolerant service supporting an entire organization.

# What is Logical Replication?

- **Logical replication** is a method of replicating data objects and their changes, based upon their replication identity (usually a primary key). We use the term **logical** in contrast to **physical replication**, which uses exact block addresses and byte-by-byte replication.
- **Logical replication** allows fine-grained control over both data replication and security.
- **Logical replication** uses a **publish** and **subscribe** model with one or more **subscribers** subscribing to one or more publications on a publisher node. **Subscribers** pull data from the publications they subscribe to and may subsequently re-publish data to allow cascading replication or more complex configurations.
  - **Logical replication** of a table typically starts with taking a snapshot of the data on the publisher database and copying that to the **subscriber**. Once that is done, the changes on the **publisher** are sent to the **subscriber** as they occur in real-time. The subscriber applies the data in the same order as the publisher so that transactional consistency is guaranteed for publications within a single subscription. This method of data replication is sometimes referred to as transactional replication.

# What is Debezium?

- **Debezium** is built upon the **Apache Kafka** project and uses **Kafka** to transport the changes from one system to another. The most interesting aspect of **Debezium** is that at the core it is using **Change Data Capture** (CDC) to capture the data and push it into **Kafka**. The advantage of this is that the source database remains untouched in the sense that we don’t have to add triggers or log tables. This is a huge advantage as triggers and log tables degrade performance.

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
2. [runchydata.com/blog - postgresql-change-data-capture-with-debezium](https://www.crunchydata.com/blog/postgresql-change-data-capture-with-debezium)
