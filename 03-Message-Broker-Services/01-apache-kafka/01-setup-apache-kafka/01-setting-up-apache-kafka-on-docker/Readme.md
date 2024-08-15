# Setting Up Kafka Server on Docker

## Table of Contents

# Setting up Kafka on Docker

- With **Docker**, we don't have to install various tools manually, instead, we write a `docker-compose.yml` to manage **containers**.

# Configure Zookeeper Docker Container

- [Zookeeper](https://zookeeper.apache.org/) is a **service** for managing and synchronizing distributed systems. It is a service used to manage **Kafka clusters**.
- **Kafka** uses **Zookeeper** to manage the **brokers** in a **cluster**, and requires **Zookeeper** even if you're running a **Kafka cluster** with only one **broker**.

## Step 1: Configure Zookeeper

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

# Configure Kafka Docker Container

## Step 1: How to Configure Kafka

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

- Understanding the **Kafka Docker Container Configurations**:

  1.  `depends_on` will make sure to start the **zookeeper** container before the **kafka**.
  2.  `KAFKA_BROKER_ID`: Unique identifier for the **Kafka broker** within the **cluster**. Each broker must have a unique ID.
  3.  `KAFKA_ZOOKEEPER_CONNECT`: Specifies the **Zookeeper** connection string, listing the **Zookeeper** instances that manage **Kafka** metadata and coordinate brokers. i.e., `KAFKA_ZOOKEEPER_CONNECT` instructs **Kafka** where it can find the **Zookeeper**.
  4.  `KAFKA_ADVERTISED_LISTENERS`:
      - Specifies the listeners that the **Kafka broker** advertises to other components in the **cluster**. These listeners define the network interfaces and ports on which the broker listens for communication. i.e., `ADVERTISED_LISTENERS` are how **clients** can connect.
      - Why this is Important?
        - **Client Discovery**: When other components like **producers**, **consumers**, **Schema Registry**, or **Kafka UI** need to connect to the **Kafka broker**, they rely on the **advertised listeners** to discover the broker's address.
        - **Inter-Broker Communication**: **Kafka brokers** use **advertised listeners** to communicate with each other for tasks like leader election and replication.
      - For configuring this correctly, you need to understand that **Kafka brokers** can have multiple **listeners**. A **listener** is a combination of: **Host/IP**, **Port**, and **Protocol**
      - **Example**: `KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092` - In this case, it uses **plaintext** communication over ports `29092`.
      - Defines how **Kafka brokers** communicate with **clients**.
  5.  `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR`: Sets the replication factor for the internal **offsets** topic, which tracks **consumer offsets**. A higher replication factor increases fault tolerance.
  6.  `KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR`: Sets the **replication factor** for the transaction state log, ensuring that transaction data is replicated for durability.
  7.  `KAFKA_TRANSACTION_STATE_LOG_MIN_ISR`: Minimum in-sync replicas required for the transaction state log, ensuring high availability
  8.  `KAFKA_DEFAULT_REPLICATION_FACTOR: '2'`" In **Kafka**, a **topic** can be replicated across multiple **brokers** for redundancy and fault toleranc. The **replication factor** specifies the number of replicas for each **partition** of the **topic**. In this case, with a replication factor of `2`, each **partition** will be copied to two **brokers**.The common default value for this configuration is `2`. This ensures some level of redundancy for user-created topics.
  9.  `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1`: This configuration specifically targets the **replication factor** for the internal **Kafka offsets topic**. This **topic** is used by **Kafka** to store information about consumer offsets (positions within topics). The default value for this configuration is usually `1`. Since the **offsets topic** stores metadata and is less critical for data integrity compared to user topics, a single replica might be sufficient.
  10. `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`: Defines `key/value` pairs for the security protocol to use, per listener name.
  11. `CONFLUENT_METRICS_ENABLE`
      - **Enables metrics collection**: This configuration turns on the collection of metrics for the **Kafka cluster**. These metrics provide insights into the Kafka cluster's performance, such as **throughput**, **latency**, and **error rates**.
      - **Confluent Platform**: This configuration is typically used in Confluent Platform environments, where it enables the collection of metrics for Confluent-specific components.
      - Example: `CONFLUENT_METRICS_ENABLE: "true"`
  12. `CONFLUENT_SUPPORT_CUSTOMER_ID`
      - **Use Case**: This should be used if you have a support subscription with Confluent and need to specify your customer ID. This allows Confluent to provide better support and track usage associated with your account.
      - Example: `CONFLUENT_SUPPORT_CUSTOMER_ID: "anonymous"`

# Configure Schema Registry Docker Container

## Step 1: How to Configure Schema Registry

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

- **Schema Registry Environment Variables** incldue:
  1.  `depends_on`: Specifies that the **Schema Registry** service depends on **Zookeeper** and **Kafka** services to be up and running. This ensures that **Schema Registry** starts only after its dependencies are available.
  2.  `8081:8081`: Exposes port `8081`, which is the default port for the Schema Registry’s RESTful API.
  3.  `SCHEMA_REGISTRY_HOST_NAME`: Sets the hostname for the Schema Registry service.
  4.  `SCHEMA_REGISTRY_KAFKASTORE_CONNECTION_URL`: Defines the connection URL for **Zookeeper** instances that the **Schema Registry** will use to manage **Kafka** metadata.
  5.  `SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS`: Lists the **Kafka bootstrap servers** for the **Schema Registry** to connect to.

# Web UIs for managing Apache Kafka

## 1. UI for Apache Kafka

- **Kafka UI** —or, as its developer **Provectus** calls it, **UI for Apache Kafka** — is a free, open source web UI that stands out for being lightweight and easy to use.

## Step 1: How to Configure Kafka UI

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

## 2. Conduktor

- **Conduktor** for Apache Kafka is a comprehensive platform that enables users to easily manage, monitor, and analyze their Kafka clusters. It provides a powerful user interface to manage Kafka resources, perform analytics, and monitor tasks with built-in tools. Furthermore, Conduktor includes enterprise-grade features such as **data masking**, cold storage, multitenancy, audit logs, message encryption, and many other features that make it an excellent solution for large enterprises that must meet strict compliance and governance regulations.

## 3. Redpanda Console

# Configure Kafka REST Proxy Docker Container

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

- List of the configurations include:
  1. `depends_on`: Specifies that the Kafka **REST Proxy service** depends on **Zookeeper**, **Kafka**, and **Schema Registry** services to be up and running. This ensures that the **REST Proxy** starts only after its dependencies are available.
  2. `8082:8082`: Exposes port `8082`, which is the default port for the Kafka REST Proxy’s RESTful API.
  3. `KAFKA_REST_HOST_NAME`: Sets the **hostname** for the **Kafka REST Proxy** service.
  4. `KAFKA_REST_BOOTSTRAP_SERVERS`: Lists the **Kafka bootstrap servers** for the **REST Proxy** to connect to. This enables the proxy to communicate with the Kafka cluster.
  5. `KAFKA_REST_LISTENERS`: Defines the address and port on which the REST Proxy will listen for HTTP requests. In this case, it listens on all network interfaces (0.0.0.0) on port 8082.

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
5. [https://towardsdev.com/implementing-change-data-capture-cdc-with-docker-postgresql-mongodb-kafka-and-debezium-a-c49b2b38a88c](https://towardsdev.com/implementing-change-data-capture-cdc-with-docker-postgresql-mongodb-kafka-and-debezium-a-c49b2b38a88c)
