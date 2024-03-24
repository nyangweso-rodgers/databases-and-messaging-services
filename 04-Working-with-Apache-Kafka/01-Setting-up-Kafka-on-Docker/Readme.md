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
- Understanding `kafka` **Environment Variables**:

  1. `KAFKA_ZOOKEEPER_CONNECT`:
     – instructing Kafka where it can find the `Zookeeper`
  2. `KAFKA_ADVERTISED_LISTENERS`:
     – specifying the advertised hostname, which clients can reach out to. Moreover, this value is sent to the `Zookeeper`
  3. `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR`
     - Please keep in mind, that in order to run only one instance of Kafka (aka single-node cluster), we have to additionally specify `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` set to `1`.
     - Its default value is `3` and if we don’t do that, we will get into this error: `org.apache.kafka.common.errors.InvalidReplicationFactorException: Replication factor: 3 larger than available brokers: 1`
  4. `KAFKA_LISTENER_SECURITY_PROTOCOL_MAP`:
     - Defines key/value pairs for the security protocol to use, per listener name.

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
  ```

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
