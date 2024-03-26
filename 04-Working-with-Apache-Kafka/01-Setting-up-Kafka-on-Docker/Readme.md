# Setting Up Kafka Server on Docker with [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

## Table of Contents

# Setting up Kafka on Docker

- With Docker, we don't have to install various tools manually, instead, we write a `docker-compose.yml` to manage containers.
- Some of the most popular **Docker Images** for the set up include:

  1. [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

# Setting up Kafka on Docker with [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

## Step #1: Create `docker-compose.yml` file and define `zookeeper`, `kafka`, `schema-registry`, and `kafka-ui` Services

```yml
version: "1"
services:
  zookeeper:
  kafka:
  schema-registry:
  kafka-ui:
```

## Step #2: Define `zookeeper` Service

- Add configurations for `zookeeper` service
  ```yml
  version: "1"
  services:
    zookeeper:
      image: confluentinc/cp-zookeeper:7.2.1
      container_name: zookeeper
      ports:
        - "2181:2181"
      restart: on-failure
      environment:
        - ZOOKEEPER_CLIENT_PORT:2181
        - ZOOKEEPER_TICK_TIME:2000
    kafka:
    schema-registry:
    kafka-ui:
  ```
- Understanding **Environment Variables** for `zookeeper`

  1. `ZOOKEEPER_CLIENT_PORT`:
     - This instructs `Zookeeper` where it should listen for connections by clients- Kafka in our case.
  2. `ZOOKEEPER_SERVER_ID`
     - When running in **clustered mode**, we have to set the `ZOOKEEPER_SERVER_ID`.

## Step #3: Define `kafka` Service

### Connecting to Kafka on Docker

- To run within Docker, you will need to configure two listeners for Kafka:

  1. **Communication within the Docker network**
     - This could be inter-broker communication (i.e., between brokers) and between other components running in Docker, such as **Kafka Connect** or third-party clients or producers.For these comms, we need to use the hostname of the Docker container(s). Each Docker container on the same Docker network will use the hostname of the Kafka broker container to reach it.
  2. **Non-Docker network traffic**:
     - This could be clients running locally on the Docker host machine, for example. The assumption is that they will connect on localhost to a port exposed from the Docker container.

- Add configurations for `kafka` service
  ```yml
  version: "1"
  services:
    zookeeper:
      #
    kafka:
      image: confluentinc/cp-kafka:7.2.1
      container_name: kafka
      ports:
        - "8098:8098"
      environment:
        KAFKA_BROKER_ID: 1
        KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
        KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:8098
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
        KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
        KAFKA_DEFAULT_REPLICATION_FACTOR: "2"
      volumes:
        - C:\Services\kafka-data:/var/lib/kafka/data
      depends_on:
        - zookeeper
      restart: on-failure
    schema-registry:
      #
    kafka-ui:
      #
  ```
- the `depends_on` will make sure to start the `zookeeper` container before the `kafka`.

### Understanding `kafka` Environment Variables

#### 1. `KAFKA_ZOOKEEPER_CONNECT`

- instructing Kafka where it can find the `Zookeeper`

#### 2. `KAFKA_ADVERTISED_LISTENERS`

- What is `KAFKA_ADVERTISED_LISTENERS`

  - This environment variable or configuration property in **Kafka** specifies the listeners that the Kafka broker advertises to other components in the cluster. These listeners define the network interfaces and ports on which the broker listens for communication.
  - `ADVERTISED_LISTENERS` are how clients can connect.
  - For configuring this correctly, you need to understand that **Kafka brokers** can have multiple **listeners**. A **listener** is a combination of:
    1. Host/IP
    2. Port
    3. Protocol

- **Why is it Important**?

  - Client Discovery: When other components like **producers**, **consumers**, **Schema Registry**, or **Kafka UI** need to connect to the Kafka broker, they rely on the advertised listeners to discover the broker's address.
  - Inter-Broker Communication: Kafka brokers use advertised listeners to communicate with each other for tasks like leader election and replication.

- Let's break down the **syntax** and understand each part:

  1. **Listener Type**: Each entry in the `KAFKA_ADVERTISED_LISTENERS` configuration specifies a listener type. Listener types define how clients can connect to the Kafka broker. Common listener types include `PLAINTEXT`, `SSL`, `SASL_SSL`, etc. In our examples, `PLAINTEXT` is used, which means **unencrypted connections**.
  2. **Endpoint Configuration**: Each listener type is followed by the endpoint configuration, which includes the hostname and port where clients should connect. The format is `listener_type://hostname:port`. In our examples, `kafka` refers to the hostname of the Kafka broker container, and `localhost` refers to the localhost of the host machine running Docker. The port specified here should be the port on which the Kafka broker is running inside the container.
  3. **Multiple Listeners**: You can specify multiple listeners by separating them with commas. This allows clients to connect to the Kafka broker using different protocols or network configurations. For example, in one configuration, you might expose Kafka to the internal Docker network (`kafka:29092`), while in another configuration, you might expose Kafka to the host machine's localhost (`localhost:9101`).
  4. **Listener Names**: Optionally, you can also specify a listener name, which allows you to differentiate between listeners when configuring security settings or client connections.

- **Examples**:
  1. `KAFKA_LISTENERS`
     - is a comma-separated list of listeners and the host/IP and port to which Kafka binds to for listening. For more complex networking, this might be an IP address associated with a given network interface on a machine. The default is 0.0.0.0, which means listening on all interfaces.
  2. `KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092`
     - This configuration advertises a single listener using the `PLAINTEXT` protocol on port `29092`.
     - The hostname used is "`kafka`," which likely refers to the container name for the `Kafka` broker service in a `docker-compose.yml`.
     - This setup exposes the broker only internally within the Docker network.
     - Why? This might be suitable for a simple setup where all components (`Zookeeper`, `Schema Registry`, `Kafka UI`) reside within the same Docker network and use the container name for discovery.
  3. `KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9101`
     - This configuration advertises two listeners
       - `PLAINTEXT` on port `29092` with hostname "`kafka`" (internal).
       - `PLAINTEXT` on port `9101` with hostname "`localhost`" (external)
     - This setup exposes an internal listener for components within the Docker network and an external listener accessible from the host machine (assuming Docker is running on the host).
     - Why? This allows external **producers** and **consumers** to send messages to the broker using "`localhost:9101`". Internal components can still use "`kafka:29092`".
  4. `KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9101,PLAINTEXT_INTERNAL://kafka:29092`
     - This configuration prioritizes the external listener. It advertises:
       - `PLAINTEXT` on port `9101` with hostname "`localhost`" (external)
       - `PLAINTEXT` on port `29092` with a custom name "`kafka`" (internal, might not be discoverable by other services).
     - Why? This setup might be useful if you primarily need to access the broker from the host machine (external) and only use internal components for specific tasks. However, the internal listener with a custom name might require additional configuration for other services to connect using "`kafka:29092`".

#### 3. `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR`

- Please keep in mind, that in order to run only one instance of Kafka (aka single-node cluster), we have to additionally specify `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` set to `1`.
- Its default value is `3` and if we don’t do that, we will get into this error: `org.apache.kafka.common.errors.InvalidReplicationFactorException: Replication factor: 3 larger than available brokers: 1`

#### 4. `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`:

- Defines key/value pairs for the security protocol to use, per listener name.

#### 5. `KAFKA_DEFAULT_REPLICATION_FACTOR: '2'`

- In **Kafka**, a **topic** can be replicated across multiple brokers for redundancy and fault tolerance. The replication factor specifies the number of replicas for each partition of the topic. In this case, with a replication factor of 2, each partition will be copied to two brokers.
- The common default value for this configuration is `2`, as seen in this example. This ensures some level of redundancy for user-created topics.

#### 6. `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1`

- This configuration specifically targets the replication factor for the internal Kafka offsets topic. This topic is used by Kafka to store information about consumer offsets (positions within topics).
- The default value for this configuration is usually `1`. Since the offsets topic stores metadata and is less critical for data integrity compared to user topics, a single replica might be sufficient.

### Bonus:

####

## Step #4: Define `schema-registry` Service

- Add configurations for `schema-registry` service
  ```yml
  version: "1"
  services:
    zookeeper:
      #
    kafka:
      #
    schema-registry:
      image: confluentinc/cp-schema-registry:7.3.0
      #hostname: schema-registry
      container_name: schema-registry
      depends_on:
        - kafka
      ports:
        - "8081:8081"
      environment:
        SCHEMA_REGISTRY_HOST_NAME: schema-registry
        SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: "kafka:8098"
        #SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081
    kafka-ui:
      #
  ```

## Step #5: Define `kafka-ui` Service

- `kafka-ui` is an application that will give us a nice UI to view our cluster.
- Add configurations for `kafka-ui` service

  ```yml
  version: "1"
  services:
    zookeeper:
      ##
    kafka:
      ##
    schema-registry:
      ###
    kafka-ui:
      container_name: kafka-ui
      image: provectuslabs/kafka-ui:latest
      ports:
        - 8080:8080
      depends_on:
        - kafka
      environment:
        DYNAMIC_CONFIG_ENABLED: true
        KAFKA_CLUSTERS_0_NAME: wizard_test
        KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
        KAFKA_CLUSTERS_0_SCHEMA_REGISTRY: http://schema-registry:8081
      #volumes:
      #- ~/kui/config.yml:/etc/kafkaui/dynamic_config.yaml
  ```

- `kafka-ui` Configinition Properties:
  1. `KAFKA_CLUSTERS_0_NAME: xxxxxx`:
     - This is the Cluster name. In this case, the cluster name will be `wizard_test`
  2. `KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS:`
     - This Address where to connect
  3. `KAFKA_CLUSTERS_0_SCHEMAREGISTRY`: for SchemaRegistry's address
  4.

## Step #6: Start `zookeeper`, `kafka`, `schema-registry`, and `kafka-ui` Containers

- start the containers by:
  ```sh
    docker-compose up -d
  ```
- This command will start a new containers named "`kafka`" and map port `29092` of the host machine to port '`29092`' of the container. It also links the "`kafka`" container to the "`zookeeper`" container, so that the `Kafka` container can connect to the `zookeeper` container.
- Check the logs to see the zookeeper container has booted up successfully:
  ```sh
    docker logs zookeeper
  ```
- Check the logs to see the kafka server has booted up successfully
  ```sh
    docker logs kafka
  ```

# Resources

1. [cp-demo/docker-compose.yml](https://github.com/confluentinc/cp-demo/blob/5.0.0-post/docker-compose.yml)
2. [provectus/kafka-ui](https://github.com/provectus/kafka-ui/tree/master?tab=readme-ov-file)
3. [How To Set Up Apache Kafka With Docker?](https://codersee.com/how-to-set-up-apache-kafka-with-docker/)
4. [Kafka Listeners – Explained](https://www.confluent.io/blog/kafka-listeners-explained/)
