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

## Setting up Kafka on Docker with [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

### Step #1: Create `docker-compose.yml` file

- create `docker-compose.yml` file with the following:

  ```yml
  #
  version: "1"
  services:
    zookeeper:
        image:confluentinc/cp-zookeeper:latest
        container:zookeeper
        environment:
            ZOOKEEPER_CLIENT_PORT: 2181
            ZOOKEEPER_TICK_TIME: 2000
        ports:
        - 22181:2181
        restart: on-failure
    kafka:
        image: confluentinc/cp-kafka:latest
        container_name: kafka
        depends_on:
            - zookeeper
        ports:
            - 29092:29092
        environment:
            KAFKA_BROKER_ID: 1
            KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
            KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092
            KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
            KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
            KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
        restart: on-failure
  ```

- Here:
  - the `depends_on` will make sure to start the `zookeeper` container before the `kafka`.
- Understanding **Environment Variables** for `zookeeper`:
  - the only environment we specified is `ZOOKEEPER_CLIENT_PORT`. This one instructs `Zookeeper` where it should listen for connections by clients- Kafka in our case.
  - Additionally, when running in **clustered mode**, we have to set the `ZOOKEEPER_SERVER_ID` (but it’s not the case here).
- Understanding **Environment Variables** for `kafka`:
  - `KAFKA_ZOOKEEPER_CONNECT` – instructing Kafka where it can find the `Zookeeper`
  - `KAFKA_ADVERTISED_LISTENERS` – specifying the advertised hostname, which clients can reach out to. Moreover, this value is sent to the `Zookeeper`
  - Please keep in mind, that in order to run only one instance of Kafka (aka single-node cluster), we have to additionally specify `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` set to `1`. Its default value is 3 and if we don’t do that, we will get into this error: `org.apache.kafka.common.errors.InvalidReplicationFactorException: Replication factor: 3 larger than available brokers: 1`

## Step #: Start `zookeeper` and `kafka` Container

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

# Resources
