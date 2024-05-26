# Kafka Shell Commands

# Kafka Shell

- **Kafka shell** currently supports a lot of most popular Kafka command line tools, such as `Kafka-topics`, `kafka-console-consumer`, and more.
  - `kafka-topics`:
    - the `kafka-topics` is a **shell script** that allows us to execute a `TopicCommand` tool. It’s a command-line tool that can manage and list topics in a Kafka cluster. Additionally, we have to specify the listener hostname (specified with `KAFKA_ADVERTISED_LISTENERS`) with `–bootstrap-server`
  - kafka-configs
  - kafka-console-consumer
  - kafka-console-producer
  - kafka-broker-api-versions
  - kafka-consumer-groups
  - kafka-delete-records
  - kafka-log-dirs
  - kafka-dump-log
  - kafka-acls
  - ksql

# What is `docker exec` Commands?

- Using `docker exec` allows you to interact with the container from the host machine's command line without needing to enter the container shell.

# Access Kafka Shell of the Kafka Container

- Access the shell of the **Kafka container** by running the following command:

  ```sh
    #access kafka shell
    docker exec -it kafka bash

    #or,
    docker-compose exec -it kafka bash
  ```

# Check Version

- To check the version of the kafka, run:
  ```sh
    kafka-topics --version
  ```

# Inspect the contents of the Directories

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

# Topics

## List Available Kafka Topics

- Use the `kafka-topics` command to list the topics in the **Kafka cluster**:
  ```sh
    docker exec -it kafka bash
    # confirm the listed kafka Topics
    kafka-topics --list --bootstrap-server kafka:29092
  ```
- If no topics exists, the following will be returned:
  ```sh
    __consumer_offsets
    _schemas
  ```

## Create a New Kafka Topic

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

- Create a new **kafka topic**, `test-kafka-topic` with `docker exec` command
  ```sh
    docker exec -it kafka bash
    # Create a new kafka topic
    kafka-topics --create --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic test-kafka-topic
  ```
- **Remarks**:

  - `--partitions` - **Kafka topics** are **partitioned** i.e the data of **topics** are spread across multiple brokers for scalability.
  - `--replication-factor` - To make data in a topic fault-tolerant and highly-available, every topic can be replicated, so that there are always multiple brokers that have a copy of the data.

  - **Kafka**'s information are stored in **log files**, which are divided as:

    - `00000000000000000000.index`: This file is where we can find `offsets` and the position of that event on the `*.log` file. While yes, we could search a specific event on the `*.log` file, due its nature of storing events, it will get larger and larger to the point where finding an event there could take a long time; whereas the `.index `file contains exclusive the `offset` and the position of the message, meaning it is faster to find the offset we're looking for.
    - `00000000000000000000.log`: This file is where every event is located, in our case this is where we'll find our `test-topic`
    - `00000000000000000000.timeindex`: This file is similar to `*.index` the difference being it's used to find events by the timestamp.

  - This sequence of numbers `00000000000000000000` in **index**, **log** and **timeindex** files, is the segment. The segment is - to put it simply - a file that we're using to store events. Kafka divides the events into multiple files, each of which is referred to as a **segment**. Each **segment** has a default maximum value of 1 GB, meaning that if we reach 1 GB of logs new files will be created for that partition.

## Describe Kafka Topics

- You can describe a specific topic or all topics in the cluster to get detailed information about them:
  ```sh
    kafka-topics --bootstrap-server localhost:29092 --describe
    #or
    kafka-topics --bootstrap-server localhost:29092 --describe --topic test-kafka-topic
  ```

## Delete Kafka Topic

- To delete a topic use the `kafka-topics` command with the `--delete` option.
  - Syntax:
    ```sh
      kafka-topics --bootstrap-server localhost:29092 --delete --topic <topic_name>
    ```
- Example:
  ```sh
    kafka-topics --bootstrap-server localhost:29092 --delete --topic test-kafka-topic
  ```

# Kafka Broker Commands

- It is the `broker` responsability to storage and manage the kafka topics. It receives and ensures it will be storage in the required topic, it also is responsible for producing the messages that the consumers will read.
- When combined, the **brokers** form a **cluster**, and they work together in various ways.

## List Brokers in the Cluster

- Use `kafka-broker-api-versions` or `kafka-configs` to list all brokers in the Kafka cluster:
  ```sh
    kafka-broker-api-versions --bootstrap-server localhost:29092
  ```

## View Broker Information

- You can also view information about the brokers in the cluster:

  ```sh
    #
    kafka-broker-api-versions --bootstrap-server localhost:29092
  ```

## Describe Broker Configuration

- Use `kafka-configs` to describe the configuration parameters of a Kafka broker:
  ```sh
    kafka-configs --bootstrap-server localhost:29092 --entity-type brokers --describe
  ```

## List Topics Hosted on a Broker

- Use `kafka-topics` to list the topics hosted on a specific broker:
  ```sh
    kafka-topics --bootstrap-server localhost:29092 --describe --topic <topic_name>
  ```

# Kafka Messages

- Once we have the **topic** created, we can start sending messages to the **topic**. A **Message** consists of `headers`, a `key`, and a `value`.

  1. **Headers**: are `key-value` pairs and give the ability to add some metadata about the kafka message.
  2. **Key**: for the kafka message. The `key-value` can be `null`. Randomly chosen keys (i.e. serial numbers and UUID) are the best example of message keys.
  3. **Value**: Actual data to be stored in **kafka**. Could be a `string`, `json`, `Protobuf`, or `AVRO` data format.

# Kafka Producer

## Run Kafka Producer

- Let’s run a **console producer** with the `kafka-console-producer`:
  ```sh
    docker exec --interactive --tty kafka kafka-console-producer --bootstrap-server localhost:9101 --topic test-kafka-topic
  ```
- **Note**:
  - this command will start the **producer** and it will wait for our input (and you should notice the `>` sign). Please specify a couple of messages and hit `Ctrl + D` after you finish:

## Writing to a Kafka Topic with `kafka-console-producer`

- **Kafka** provides a [Producer API](https://docs.confluent.io/platform/current/clients/producer.html) to send a message to the **Kafka topic**. This API is available in `java` with [kafka-clients](https://kafka.apache.org/33/javadoc/index.html?org/apache/kafka/clients/producer/KafkaProducer.html) library and `python` with [kafka-python](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaProducer.html) package.

- **Kafka** also comes with an out of box script `kafka-console-producer` that allows us to write data to a **kafka topic**.

  - Example:
    ```sh
      #write a message to kafka topic
      kafka-console-producer --bootstrap-server localhost:9101 --topic test-kafka-topic
    ```
  - The command should return `>` after which, you can enter a `JSON` message like:
    ```sh
      {"user": [{"first_name": "Rodgers 1", "age": 1}, {"first_name": "Rodgers 2", "age": 2}, {"first_name": "Rodgers 3", "age": 3}]}
    ```
  - Enter `Control + C` to stop the script.

- **Remarks**:
  - Note that **kafka messages** are randomly distributed to the `partitions` when the **producer** sends them. A way to ensure that messages will always go to a specific `partition` through the use of message `keys`. **Example**:
    ```sh
      kafka-console-producer --bootstrap-server localhost:29092 --topic test-topic --property parse.key=true --property key.separator=,
    ```

# Kafka Consumer

## Run Kafka Consumer

- Let’s run a **console consumer** with the `kafka-console-consumer` command:
  ```sh
    docker exec --interactive --tty kafka kafka-console-consumer --bootstrap-server localhost:8098 --topic first-test-kafka-topic --from-beginning
  ```
- This time, we should see that our messages are printed to the output successfully (and to finish please hit `Ctrl+ C`):

## Reading from a Kafka Topic

- **Kafka** provides a [Consumer API](https://docs.confluent.io/platform/current/clients/consumer.html) to read messages from a **Kafka topic**. This API is available in `java` with [kafka-clients]() library and `python` with [kafka-python](https://kafka-python.readthedocs.io/en/master/apidoc/KafkaConsumer.html) package.

- **Kafka** also, comes with an out of box script `kafka-console-consumer` to read messages from the **kafka topic**:
  ```sh
    kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic
  ```
- However, this command only prints the values of the **kafka message**.

  - To print the `key` and `headers`, we have to set the properties `print.headers`, `print.key` to `true`.
  - We can also print the timestamp of the message with the property `print.timestamp`.
    ```sh
      kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic --property print.headers=true --property print.key=true --property print.timestamp=true
    ```
  - There is other information such as **partition** and **offset**, they can be printed by setting the properties `--property print.offset=true` and `--property print.partition=true`.

- **Remarks**:

  - Everytime we read from the a **kafka topic**, **Kafka** keeps track of the last **offset** the **consumer** read from and allows you to read from that point next time, however we can always read from the beginning using the `arguments --from-beginning`.

    ```sh
      kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic --from-beginning
    ```

  - To always read from a **kafka topic** from the beginning with `headers` and `keys`

    ```sh
      kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic --from-beginning --property print.headers=true --property print.key=true --property print.timestamp=true
    ```

  - **Note**: when you get the **messages**, it is not retrieved in order. Order is not guaranteed if you have multiple **partitions**. This is because when the **producer** send messages to the **topic**, the messages are distributed across the **partitions**. You can have a guaranteed ordering of messages retrieved if you have a single-partition topic.

### Reading Messages from specific partitions and offsets

- We can also specify the **partition** that we want to read by adding the `--partition` parameter followed the partition number. For example, to read messages sent to `partition 0`:
  ```sh
    kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic --partition 0 --from-beginning
  ```
- Similarly, we can read the messages in the same `partition` but starting from a particular `offset`. Note that if you want to specify an `offset`, remove the `--from-beginning` parameter:
  ```sh
    kafka-console-consumer --bootstrap-server localhost:29092 --topic test-topic --partition 0 --offset 2
  ```

## `JSON` Command Line Consumer

- to start the `JSON` Schema command line **consumer**:
  ```sh
    #start a json command line consumer
    kafka-json-schema-console-consumer --bootstrap-server localhost:29092 --topic test-topic
  ```

## Running Multiple Consumers

- Two, or more, **consumers** subscribed to the same **topic** we'll receive the same messages that's being sent by the **producers**. It's not really doing any parallel consumption since each **consumer** is treated as an entirely different application.

## Consumer Groups

- If we have multiple **producers** sending messages to a single **consumer**, the rate of incoming messages may overwhelm the **consumer** and the **consumer** may not be able to keep up and fall behind. To resolve this, we can split the data between two **consumers** that are both subscribed to the same **topic**.
- Messages that arrives at the **consumer groups** are load-balanced between the **consumers**. **Consumers** registered to the same **consumer group** will have the same **group id**.
- If there are two **consumers** with the same `group-id`, meaning both are part of the same **consumer group**, then the topic's partitions are balanced between the two.

## Register Consumer to a Consumer Group

- To register **consumers** to a **consumer group**, we can use the parameter `--group` when we run **consumers**.
  ```sh
    kafka-console-consumer --bootstrap-server localhost:29092 --topic test-kafka-topic --group test-consumer-group
  ```

### List Consumer Groups with `kafka-consumer-group`

- To list the **consumer groups**:
  ```sh
   kafka-consumer-groups --bootstrap-server localhost:9092 --list
  ```

### Describe Consumer Groups

- To get the details of the **consumer groups**, append with `--describe` and specify the group.
  ```sh
   kafka-consumer-groups --bootstrap-server localhost:9092 --group test-consumer-group --describe
  ```
- You will notice the column for lag. This specifies how many messages in the specific `partition` that are still not retrieved and processed by the **consumer group**.
- To make sure the **consumer group** is caught up with all the messages, run the `kafka-console-consumer` again.

## View and Reset Consumer offsets

- The `__consumer_offsets` **topic** stores the message `offset` that each **consumer group** should consume next. In the **broker** container run the following to get a look at where each **consumer group** is at for each topic `partition`.
  ```sh
    kafka-consumer-groups --bootstrap-server localhost:29092 --describe --all-groups
  ```
- or, for a specific group like `test-consumer-group`, run:
  ```sh
     kafka-consumer-groups --bootstrap-server localhost:29092 --describe --group test-consumer-group
  ```

# Schema Registry CLI Commands

## Exec into `schema-registry` Container

```sh
    docker exec -it schema-registry bash
```

## `JSON` Command Line Producer

- to start the `JSON` Schema command line **producer**:
  ```sh
    #start a json command line producer
    kafka-json-schema-console-producer --bootstrap-server localhost:29092 --topic test-kafka-topic --property value.schema='{"type":"object","properties":{"f1":{"type":"string"}}
  ```

# Resources and Further Reading

1. [Kafka CLI Cheat Sheet](https://thecodinginterface.com/blog/kafka-cli-cheat-sheet/)
