# Setting Up Kafka Server on Docker

## Table of Contents

# Setting up Kafka on Docker

- With Docker, we don't have to install various tools manually, instead, we write a `docker-compose.yml` to manage containers.
- Some of the most popular **Docker Images** for the set up include:

  1. [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image
  2. [bitnami/kafka](https://hub.docker.com/r/bitnami/kafka) Docker Image for Kafka and Zookeeper
     - bitnami images for Kafka and Zookeeper is easier to setup and more actively maintained than the **wurstmeister images**
  3. [wurstmeister/zookeeper](https://hub.docker.com/r/wurstmeister/zookeeper/)
  4. [wurstmeister/kafka](https://hub.docker.com/r/wurstmeister/kafka/)

# Setting up Kafka on Docker with [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

- We use **Confluent Community Docker Image for Apache Kafka** and **Confluent Docker Image for Zookeeper** – both in version 7.2.1.

## Step #1: Create `docker-compose.yml` file

- create `docker-compose.yml` file with the following:

  ```yml
  #
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
    volumes:
      - C:\Services\kafka-data:/var/lib/kafka/data
    depends_on:
      - zookeeper
    restart: on-failure
  ```

- Here:

  - the `depends_on` will make sure to start the `zookeeper` container before the `kafka`.

### Remarks: Understanding Environment Variables for `zookeeper`

1. `ZOOKEEPER_CLIENT_PORT`:
   - This instructs `Zookeeper` where it should listen for connections by clients- Kafka in our case.
2. `ZOOKEEPER_SERVER_ID`
   - When running in **clustered mode**, we have to set the `ZOOKEEPER_SERVER_ID`.

### Remarks: Understanding Environment Variables for `kafka`

1. `KAFKA_ZOOKEEPER_CONNECT`:
   – instructing Kafka where it can find the `Zookeeper`
2. `KAFKA_ADVERTISED_LISTENERS`:
   – specifying the advertised hostname, which clients can reach out to. Moreover, this value is sent to the `Zookeeper`
3. `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR`
   - Please keep in mind, that in order to run only one instance of Kafka (aka single-node cluster), we have to additionally specify `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` set to `1`.
   - Its default value is `3` and if we don’t do that, we will get into this error: `org.apache.kafka.common.errors.InvalidReplicationFactorException: Replication factor: 3 larger than available brokers: 1`
4. `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`:
   - Defines key/value pairs for the security protocol to use, per listener name.

## Step #2: Start `zookeeper` and `kafka` Container

- start the zookeeper and kafka containers by:
  ```sh
    docker-compose up -d
  ```
- This command will start a new container named "`kafka`" and map port `29092` of the host machine to port '`29092`' of the container. It also links the "`kafka`" container to the "`zookeeper`" container, so that the `Kafka` container can connect to the `zookeeper` container.
- Check the logs to see the zookeeper container has booted up successfully:
  ```sh
    docker logs zookeeper
  ```
- Check the logs to see the kafka server has booted up successfully
  ```sh
    docker logs kafka
  ```

### Commands for Kafka Broker

- **View Broker Information**: You can also view information about the brokers in the cluster:
  ```sh
    #
    kafka-broker-api-versions --bootstrap-server localhost:8098
  ```
- **Describe Broker Configuration**: Use `kafka-configs` to describe the configuration parameters of a Kafka broker:
  ```sh
    kafka-configs --bootstrap-server localhost:8098 --entity-type brokers --describe
  ```
- **List Topics Hosted on a Broker**: Use `kafka-topics` to list the topics hosted on a specific broker:
  ```sh
    kafka-topics --bootstrap-server localhost:9092 --describe --topic <topic_name>
  ```
- **List Brokers in the Cluster**: Use `kafka-broker-api-versions` or `kafka-configs` to list all brokers in the Kafka cluster:
  ```sh
    kafka-broker-api-versions --bootstrap-server localhost:9092
  ```
- **Describe Consumer Groups Associated with a Broker**: Use `kafka-consumer-groups` to describe the consumer groups associated with a broker:
  ```sh
    kafka-consumer-groups --bootstrap-server localhost:9092 --list
  ```

# Resources
