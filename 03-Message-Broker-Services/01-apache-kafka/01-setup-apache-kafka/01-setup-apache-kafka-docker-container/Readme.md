# Setting Up Kafka Server on Docker with [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

# Setting up Kafka on Docker

- With Docker, we don't have to install various tools manually, instead, we write a `docker-compose.yml` to manage **containers**.
- Some of the most popular **Docker Images** for **Apache Kafka** include:

  1. [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

## Step 1: Create `docker-compose.yml` file and configure the Services

- Configure the following services:
  - `zookeeper`,
  - `kafka`,
  - `schema-registry`, and
  - `kafka-ui`

## Step 2: Configure `zookeeper` Service

- [Zookeeper](https://zookeeper.apache.org/) is a **service** for managing and synchronizing distributed systems. It is a service used to manage **Kafka clusters**.
- **Kafka** uses **Zookeeper** to manage the **brokers** in a **cluster**, and requires **Zookeeper** even if you're running a **Kafka cluster** with only one broker.
- Here, we use [confluentinc/cp-zookeeper](https://hub.docker.com/r/confluentinc/cp-zookeeper) **Docker image** for deploying and running **Zookeeper**
- Add configurations for `zookeeper` service

  ```yml
  services:
    zookeeper:
  ```

- Where:
  - `ZOOKEEPER_CLIENT_PORT`: instructs `Zookeeper` where it should listen for connections by clients- **Kafka** in our case.
  - `ZOOKEEPER_SERVER_ID`: When running in **clustered mode**, we have to set the `ZOOKEEPER_SERVER_ID`.

## Step 3: Configure `kafka` Service

- We use [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) **Docker image** for deploying and running the _Community Version_ of **Kafka** packaged with the Confluent Community download.

- Add configurations for `kafka` service
  ```yml
  services:
    kafka:
  ```

### Remarks: Understanding Kafka Environment Variables

#### Kafka Environment Variables 1: `depends_on`

- `depends_on` will make sure to start the **zookeeper** container before the **kafka**.

#### Kafka Environment Variables: `KAFKA_ZOOKEEPER_CONNECT`

- `KAFKA_ZOOKEEPER_CONNECT`: intructs **Kafka** where it can find the **Zookeeper**.

#### Kafka Environment Variables: `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`

- `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`: Defines `key/value` pairs for the security protocol to use, per listener name.

#### Kafka Environment Variables: `KAFKA_DEFAULT_REPLICATION_FACTOR: '2'`

- In **Kafka**, a **topic** can be replicated across multiple **brokers** for redundancy and fault tolerance. The **replication factor** specifies the number of replicas for each **partition** of the **topic**. In this case, with a replication factor of `2`, each **partition** will be copied to two **brokers**.
- The common default value for this configuration is `2`. This ensures some level of redundancy for user-created topics.

#### Kafka Environment Variables: `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1`

- This configuration specifically targets the **replication factor** for the internal **Kafka offsets topic**. This **topic** is used by **Kafka** to store information about consumer offsets (positions within topics). The default value for this configuration is usually `1`. Since the **offsets topic** stores metadata and is less critical for data integrity compared to user topics, a single replica might be sufficient.

#### Kafka Environment Variables: `KAFKA_ADVERTISED_LISTENERS`

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

## Step 4: Configure `schema-registry` Service

- Add configurations for `schema-registry` service

  ```yml
  services:
    schema-registry:
  ```

# Web UIs for managing Apache Kafka

## Web UIs for managing Apache Kafka 1: UI for Apache Kafka

- **Kafka UI** —or, as its developer **Provectus** calls it, **UI for Apache Kafka** — is a free, open source web UI that stands out for being lightweight and easy to use.

### Step 5: Configure `kafka-ui`

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

## Web UIs for managing Apache Kafka 2: Conduktor

- **Conduktor** for Apache Kafka is a comprehensive platform that enables users to easily manage, monitor, and analyze their Kafka clusters. It provides a powerful user interface to manage Kafka resources, perform analytics, and monitor tasks with built-in tools. Furthermore, Conduktor includes enterprise-grade features such as **data masking**, cold storage, multitenancy, audit logs, message encryption, and many other features that make it an excellent solution for large enterprises that must meet strict compliance and governance regulations.

## Web UIs for managing Apache Kafka 3: Redpanda Console

## Step 6: Start `zookeeper`, `kafka`, `schema-registry`, and `kafka-ui` Containers

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
