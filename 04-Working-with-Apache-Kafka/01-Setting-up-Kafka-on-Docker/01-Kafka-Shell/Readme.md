# Kafka Shell

## Table Of Contents

# Commands for Kafka Topics Management

# Access Kafka Shell of the Kafka Container

- Access the shell of the Kafka container by running the following command:
  ```sh
    #access kafka shell
    docker exec -it kafka bash
  ```
  - or,
  ```sh
    #access kafka shell
    docker-compose exec -it kafka bash
  ```

## Inspect the contents of the directories

- Use the `ls` command to list the contents of these directories and look for Kafka-related files such as `kafka-topics.sh`, `kafka-console-producer.sh`, etc. by running:
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

## List Kafka Topics

- Use the `kafka-topics` command to list the topics in the Kafka cluster:
  ```sh
    #list available topics
    kafka-topics --bootstrap-server localhost:8098 --list
  ```

## Create New Kafka Topics

- To create a topic in Kafka, you can use the `kafka-topics` command with the `--create` option.
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
  - Example: create a `test-topic` topic:
    ```sh
      #example
      kafka-topics --bootstrap-server localhost:8098 --create --topic test-topic --partitions 3 --replication-factor 1
    ```
- **Remarks**:
  - `--partitions` - Kafka topics are partitioned i.e the data of topics are spread across multiple brokers for scalability.
  - `--replication-factor` - To make data in a topic fault-tolerant and highly-available, every topic can be replicated, so that there are always multiple brokers that have a copy of the data.

## Describe Kafka Topics

- You can describe a specific topic or all topics in the cluster to get detailed information about them:
  ```sh
    kafka-topics --bootstrap-server localhost:8098 --describe
  ```
- or,

  ```sh
      kafka-topics --bootstrap-server localhost:8098 --describe --topic test-kafka-topic
  ```

## Delete Kafka Topic

- To delete a topic use the `kafka-topics` command with the `--delete` option.
  - Syntax:
    ```sh
      kafka-topics --bootstrap-server localhost:9092 --delete --topic <topic_name>
    ```
- Example:
  ```sh
    kafka-topics --bootstrap-server localhost:9092 --delete --topic my-topic
  ```

# Kafka Messages

- Once we have the topic created, we can start sending messages to the topic. A **Message** consists of **headers**, a **key**, and a **value**.

  1. **Headers**: are key-value pairs and give the ability to add some metadata about the kafka message.
  2. **Key**: for the kafka message. The key value can be null. Randomly chosen keys (i.e. serial numbers and UUID) are the best example of message keys.
  3. **Value**: Actual data to be stored in kafka. Could be a `string`, `json`, `Protobuf`, or `AVRO` data format.

## Writing to a Kafka Topic

- Kafka provides a [Producer API](https://docs.confluent.io/platform/current/clients/producer.html) to send a message to the **Kafka topic**.
- This API is available in java with [kafka-clients](https://kafka.apache.org/33/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html) library and python with [kafka-python](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaProducer.html) package.
- Kafka also comes with an out of box script `kafka-console-producer` that allows us to write data to a **kafka topic**.
  - Example:
    ```sh
      #write a message to kafka topic
      kafka-console-producer --bootstrap-server localhost:8098 --topic test-topic
    ```
  - The command should return `>` after which, you can enter a `JSON` message like:
    ```sh
      {"tickers": [{"name": "Test 1", "price": 1902}, {"name": "Test 2", "price": 107}, {"name": "Test 3", "price": 215}]}
    ```
  - Enter `Control + C` to stop the script.

## Reading from a Kafka Topic

- Kafka provides a [Consumer API](https://docs.confluent.io/platform/current/clients/consumer.html) to read messages from a Kafka topic. This API is available in java with [kafka-clients]() library and python with [kafka-python](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaConsumer.html) package.
- Kafka also, comes with an out of box script `kafka-console-consumer` to read messages from the kafka topic:
  ```sh
    kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic
  ```
- However, this command only prints the values of the kafka message. To print the `key` and `headers`, we have to set the properties `print.headers`, `print.key` to `true`. We can also print the timestamp of the message with the property `print.timestamp`.
  ```sh
    kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic --property print.headers=true --property print.key=true --property print.timestamp=true
  ```
- There is other information such as **partition** and **offset**, they can be printed by setting the properties `--property print.offset=true` and `--property print.partition=true`.
- **Remarks**:
  - Everytime we read from the a kafka topic, Kafka keeps track of the last offset the consumer read from and allows you to read from that point next time, however we can always read from the beginning using the `arguments --from-beginning`.
  - To always read from a kafka topic from the beginning:
    ```sh
      kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic --from-beginning --property print.headers=true --property print.key=true --property print.timestamp=true
    ```

# Resources
