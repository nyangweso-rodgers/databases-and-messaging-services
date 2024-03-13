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

- We use **Confluent Community Docker Image for Apache Kafka** and **Confluent Docker Image for Zookeeper** – both in version 7.2.1.

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

## Step #: Access the shell of the Kafka container

- Access the shell of the Kafka container by running the following command:
  ```sh
    #access kafka shell
    docker exec -it kafka bash
  ```
- **Inspect the contents of the directories**: Use the `ls` command to list the contents of these directories and look for Kafka-related files such as `kafka-topics.sh`, `kafka-console-producer.sh`, etc. by running:
  ```sh
    #
    ls /usr/bin
    #or
    ls /bin
  ```
- **Verify Kafka binaries**: Once you've located the Kafka binaries, you can verify their presence by listing them and checking their permissions.
  ```sh
    #
    ls -l /usr/bin | grep kafka
  ```

## Step #: Popular Shell Commands

### Commands for Kafka Topic Management

- **List Topics**: Use the `kafka-topics` command to list the topics in the Kafka cluster:
  ```sh
    #list available topics
    kafka-topics --bootstrap-server localhost:8098 --list
  ```
- **Create a new topic**: To create a topic in Kafka, you can use the kafka-topics command with the --create option.
  - Syntax:
    ```sh
      #syntax
      kafka-topics --bootstrap-server localhost:8098 --create --topic <topic_name> --partitions <num_partitions> --replication-factor <replication_factor>
    ```
  - Where:
    - `--bootstrap-server`: Specifies the bootstrap server (Kafka broker) address and port.
    - `--create`: Indicates that you want to create a new topic.
    - `--topic`: Specifies the name of the topic you want to create.
    - `--partitions`: Specifies the number of partitions for the topic.
    - `--replication-factor`: Specifies the replication factor for the topic.
  - Example:
    ```sh
      #example
      kafka-topics --bootstrap-server localhost:8098 --create --topic test-topic --partitions 3 --replication-factor 2
    ```
- **Describe Topics**: You can describe a specific topic or all topics in the cluster to get detailed information about them:
  ```sh
    kafka-topics --bootstrap-server localhost:8098 --describe
    #or
    kafka-topics --bootstrap-server localhost:8098 --describe --topic test-kafka-topic
  ```
- **Delete a topic**: To delete a topic in Apache Kafka, you can use the `kafka-topics` command with the `--delete` option.
  - Syntax:
    ```sh
      kafka-topics --bootstrap-server localhost:9092 --delete --topic <topic_name>
    ```
  - Example:
    ```sh
      kafka-topics --bootstrap-server localhost:9092 --delete --topic my-topic
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

## Step #: Docker Exec Commands

- We can also use the `docker exec` command to run shell commands inside the running Kafka container. This allows you to execute any commands that you could run inside the container, including Kafka command-line tools.
- Using `docker exec` allows you to interact with the container from the host machine's command line without needing to enter the container shell.

- **List Topics**: Use the `kafka-topics` command to list the topics in the Kafka cluster:
  ```sh
    docker exec -it kafka kafka-topics --list --bootstrap-server localhost:8098
  ```
- **Create a Kafka Topic**:

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
