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

## Step #: Create a Kafka Topic

```sh
   #create a topic
   docker exec -it kafka kafka-console-producer --bootstrap-server localhost:8098 --topic test-kafka-topic
```

- the `kafka-topics` is a shell script that allows us to execute a `TopicCommand` tool. It’s a command-line tool that can manage and list topics in a Kafka cluster. Additionally, we have to specify the listener hostname (specified with `KAFKA_ADVERTISED_LISTENERS`) with `–bootstrap-server`

## Step #: Run Kafka Producer

- Following, let’s run a console producer with the `kafka-console-producer`:
  ```sh
    #
    docker exec --interactive --tty kafka kafka-console-producer --bootstrap-server localhost:8098 --topic test-kafka-topic
  ```
- Please keep in mind that this command will start the **producer** and it will wait for our input (and you should notice the `>` sign). Please specify a couple of messages and hit `Ctrl + D` after you finish:

## Run Kafka Consumer

- As the last step, let’s run a console consumer with the `kafka-console-consumer` command:
  ```sh
    #
    docker exec --interactive --tty kafka kafka-console-consumer --bootstrap-server localhost:8098 --topic first-test-kafka-topic --from-beginning
  ```
- This time, we should see that our messages are printed to the output successfully (and to finish please hit `Ctrl+ C`):

# Resources
