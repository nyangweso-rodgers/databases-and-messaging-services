# Apache Kafka

## Table Of Contents

# What is Apache Kafka?

- Apache Kafka is an open-source distributed event streaming platform. i.e., it’s a platform widely used to work with real-time streaming data pipelines and to integrate applications to work with such streams. It’s mainly responsible for:
  - publishing/subscribing to the stream of records,
  - their real-time processing,
  - and their ordered storage

# Use Cases of Kafka

1. Real-time data processing and analytics
2. Log and event data aggregation
3. **Stream Processing in big data pipelines**:
   - Instead of piping Data to a certain storage downstream we mount a Stream Processing Framework on top of Kafka Topics.
   - The Data is filtered, enriched and then piped to the downstream systems to be further used according to the use case.
4. **Database Replication**:
   - Database Commit log is piped to a Kafka topic.

# Kafka Concepts

## Kafka Concept #!: Broker

- A single **Kafka Cluster** is made of **Brokers**. They handle **producers** and **consumers** and keeps data replicated in the cluster.

## Kafka Concept #2: Topics

- **Kafka** categorizes data into **topics**. A **topic** is a category or feed name to which records are published.
- **Producers** publish messages to a specific topic. The messages can be in any format, with `JSON` and `Avro` being popular options. **Consumers** subscribe to a topic to consume the records published by producers.

- **Features of Kafka Topics**
  - Different **topics** are identified by their names and will store different kinds of events. For example a social media application might have `posts`, `likes`, and `comments` **topics** to record every time a user creates a post, likes a post, or leaves a comment.
  - Multiple applications can write to and read from the same topic. An application might also read messages from one topic, filter or transform the data, and then write the result to another topic.
  - **topics** are append-only. When you write a message to a topic, it's added to the end of the log. Events in a topic are immutable. Once they're written to a topic, you can't change them.
  - **Topics** are durable, holding onto messages for a specific period (by default 7 days) by saving them to physical storage on disk.
  - You can configure topics so that messages expire after a certain amount of time, or when a certain amount of storage is exceeded. You can even store messages indefinitely as long as you can pay for the storage costs.

## Kafka Concept #3: Partitions

- In order to help Kafka to scale, **topics** can be divided into **partitions**. This breaks up the event log into multiple logs, each of which lives on a separate node in the Kafka cluster. This means that the work of writing and storing messages can be spread across multiple machines.
- When you create a **topic**, you specify the amount of **partitions** it has. The **partitions** are themselves numbered, starting at `0`. When a new event is written to a topic, it's appended to one of the topic's **partitions**.
- **Messages** that have the same key will always be sent to the same **partition**, and in the same order. The key is run through a hashing function which turns it into an integer. This output is then used to select a **partition**.
- **Messages** within each partition are guaranteed to be ordered. For example, all messages with the same `customer_id` as their key will be sent to the same partition in the order in which Kafka received them.

## Kafka Concept #4: Offsets

- Each **message** in a **partition** gets an id that is an incrementing integer, called an **offset**.
- **Offsets** start at 0 and are incremented every time Kafka writes a message to a partition. This means that each message in a given partition has a unique offset.
- **Offsets** are not reused, even when older messages get deleted. They continue to increment, giving each new message in the partition a unique id.
- When data is read from a **partition**, it is read in order from the lowest existing **offset** upwards.

## Kafka Concept #5: Zookeepr

- [Zookeeper](https://zookeeper.apache.org/) a service for managing and synchronizing distributed systems. It is a service used to manage Kafka clusters.
- Kafka uses Zookeeper to manage the brokers in a cluster, and requires Zookeeper even if you're running a Kafka cluster with only one broker.

# Setting up Apache Kafka

- Goal: install Kafka in a VM and use Linux Ubuntu as a distribution of choice

## Setting up Kafka on Docker

- With Docker, we don't have to install various tools manually, instead, we write a `docker-compose.yml` to manage containers.
- Some of the most popular **Docker Images** for the set up include:

  1. [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image
  2. [bitnami/kafka](https://hub.docker.com/r/bitnami/kafka) Docker Image for Kafka and Zookeeper
     - bitnami images for Kafka and Zookeeper is easier to setup and more actively maintained than the **wurstmeister images**
  3. [wurstmeister/zookeeper](https://hub.docker.com/r/wurstmeister/zookeeper/)
  4. [wurstmeister/kafka](https://hub.docker.com/r/wurstmeister/kafka/)

### Setting up Kafka on Docker with [confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka) Docker Image

- When
  ```yml
  #docker-compose.yml with
  version: "3"
  services:
    zookeeper:
      image: confluentinc/cp-zookeeper:7.2.1
      container_name: zookeeper
      environment:
        ZOOKEEPER_CLIENT_PORT: 2181
    kafka:
      image: confluentinc/cp-kafka:7.2.1
      container_name: kafka
      ports:
        - "8098:8098"
      depends_on:
        - zookeeper
      environment:
        KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
        KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:8098
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
  ```
- Here,we spin up two services, `zookeeper`, and `kafka`.
- The `container_name` will set specified names for our containers, instead of letting Docker generate them.
- the `depends_on` will make sure to start the `zookeeper` container before the `kafka`.
- **Required Zookeeper Settings**
  - the only environment we specified is `ZOOKEEPER_CLIENT_PORT`. This one instructs `Zookeeper` where it should listen for connections by clients- Kafka in our case.
  - Additionally, when running in **clustered mode**, we have to set the `ZOOKEEPER_SERVER_ID` (but it’s not the case here).
- **Required Confluent Kafka Settings**
  - When it comes to the Confluent Kafka Docker image, here is the list of the required environment variables:
    - `KAFKA_ZOOKEEPER_CONNECT` – instructing Kafka where it can find the `Zookeeper`
    - `KAFKA_ADVERTISED_LISTENERS` – specifying the advertised hostname, which clients can reach out to. Moreover, this value is sent to the `Zookeeper`
- Please keep in mind, that in order to run only one instance of Kafka (aka single-node cluster), we have to additionally specify `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR` set to `1`. Its default value is 3 and if we don’t do that, we will get into this error: `org.apache.kafka.common.errors.InvalidReplicationFactorException: Replication factor: 3 larger than available brokers: 1`

- Run the containers by `docker compose up -d` command.

  - The `-d` flag instructs the docker to run containers in a detached mode.
  - Verify that the container is running by `docker ps` command.

- **Create a Kafka Topic**:

  ```sh
    #create a topic
    docker exec -it kafka kafka-console-producer --bootstrap-server localhost:8098 --topic first-test-kafka-topic
  ```

  - the `kafka-topics` is a shell script that allows us to execute a `TopicCommand` tool. It’s a command-line tool that can manage and list topics in a Kafka cluster. Additionally, we have to specify the listener hostname (specified with `KAFKA_ADVERTISED_LISTENERS`) with `–bootstrap-server`

- **Run Kafka Producer**

  - Following, let’s run a console producer with the `kafka-console-producer`:
    ```sh
      #
      docker exec --interactive --tty kafka kafka-console-producer --bootstrap-server localhost:8098 --topic first-test-kafka-topic
    ```
  - Please keep in mind that this command will start the **producer** and it will wait for our input (and you should notice the `>` sign). Please specify a couple of messages and hit `Ctrl + D` after you finish:

- **Run Kafka Consumer**
  - As the last step, let’s run a console consumer with the `kafka-console-consumer` command:
    ```sh
      #
      docker exec --interactive --tty kafka kafka-console-consumer --bootstrap-server localhost:8098 --topic first-test-kafka-topic --from-beginning
    ```
  - This time, we should see that our messages are printed to the output successfully (and to finish please hit `Ctrl+ C`):

### Setting up Kafka on Docker with [bitnami/kafka](https://hub.docker.com/r/bitnami/kafka) Docker Image

- When using [bitnami/kafka](https://hub.docker.com/r/bitnami/kafka) **Docker Image**, create a `docker-compose.yml` file with the following:
  ```yml
  #docker-compose.yml with Bitmani
  version: "3"
  networks:
    myNetwork:
  services:
    zookeeper:
      image: "bitnami/zookeeper:latest"
      ports:
        - "2181:2181"
      environment:
        - ALLOW_ANONYMOUS_LOGIN=yes
      networks:
        - myNetwork
    kafka:
      image: "bitnami/kafka:latest"
      user: root
      ports:
        - "9092:9092"
      environment:
        - KAFKA_BROKER_ID=1
        - KAFKA_LISTENERS=PLAINTEXT://:9092
        - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092
        - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
        - ALLOW_PLAINTEXT_LISTENER=yes
      volumes:
        - ./Kafka:/bitnami/kafka
      networks:
        - myNetwork
      depends_on:
        - zookeeper
  ```
- **Remarks**:

  - This `docker-compose.yml` file defines two services, `Zookeeper` and `Kafka`, which will run within the same network, enabling seamless communication between them.
  - Note that even if you don't explicitly specify the network in your file, **Docker Compose** will create it by default.
  - We've mapped the ports for `Zookeeper` (`2181`) and `Kafka` (`9092`) between the local machine and the respective containers.
  - For the environment variables:
    - The use of the root user in the Kafka service is optional but can be used in case of permission issues
    - we've created a **volume** that will be mounted with `/bitnami/kafka` to ensure that **topics**, **partitions**, and **messages** persist even if the containers are deleted.
  - Run `docker compose up -d` command in the same path as the `docker-compose.yml` file.
    - The `-d` flag signifies that the containers will run in detached mode (in the background).
  - Using **Docker Desktop**, access the terminal for the **Kafka container** and execute the following command to check for existing topics:
    ```sh
      #check for existing topics
      kafka-topics.sh --bootstrap-server localhost:9092 --list
    ```
    - The above command will not display any output since there are no existing topics
    - Create the first **Kafka topic**. Using your local terminal or CMD in Windows, execute the following command:
      ```sh
        #create a kafka topic
        docker exec -it <your_container_id> kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 3 --topic test-tp
      ```
    - Running `kafka-topics.sh --bootstrap-server localhost:9092 --list` again will list `test-tp` as a topic.
    - Add some events to the `test-tp` topic:
      - Run this command in your first terminal. Note that before you begin writing messages, execute the next command in another terminal to monitor the events.
        ```sh
          #
          docker exec -it <your_container_id> kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test-tp
        ```
  - You can delete the images from the machine, run:
    ```sh
      #delete docker images
      docker rmi <image_name>:<tag>
    ```

# Kafka Serialization Schemes

- Common seroalization schemes for Kafka include:
  - Avro,
  - JSON, and
  - Protobuf
- Avro is an open source data serialisation system which marshals your data (and it’s appropriate schema) to a efficient binary format.

# Confluent Schema Registry

# Resources

1. [kafka.apache.org/intro](https://kafka.apache.org/intro)
2. [zookeeper.apache.org](https://zookeeper.apache.org/)
3. [kafka.apache.org/downloads](https://kafka.apache.org/downloads)
4. [How To Set Up Apache Kafka With Docker?](https://codersee.com/how-to-set-up-apache-kafka-with-docker/)
