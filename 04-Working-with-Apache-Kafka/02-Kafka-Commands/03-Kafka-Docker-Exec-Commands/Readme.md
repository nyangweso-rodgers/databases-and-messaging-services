# Kafka `docker exec` Commands

# What is `docker exec` Commands?

- Using `docker exec` allows you to interact with the container from the host machine's command line without needing to enter the container shell.
- Remark:
  - the `kafka-topics` is a **shell script** that allows us to execute a `TopicCommand` tool. It’s a command-line tool that can manage and list topics in a Kafka cluster. Additionally, we have to specify the listener hostname (specified with `KAFKA_ADVERTISED_LISTENERS`) with `–bootstrap-server`

# Topics

## List Available Kafka Topics

- Use the `kafka-topics` command to list the topics in the **Kafka cluster**:
  ```sh
    docker exec -it kafka bash
    # confirm the listed kafka Topics
    kafka-topics --list --bootstrap-server kafka:29092
  ```

## Create a New Kafka Topic

- Create a new **kafka topic**, `test-kafka-topic` with `docker exec` command
  ```sh
    docker exec -it kafka bash
    # Create a new kafka topic
    kafka-topics --create --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic test-kafka-topic
  ```

# Kafka Producer

## Run Kafka Producer

- Let’s run a **console producer** with the `kafka-console-producer`:
  ```sh
    docker exec --interactive --tty kafka kafka-console-producer --bootstrap-server localhost:8098 --topic test-kafka-topic
  ```
- **Note**:
  - this command will start the **producer** and it will wait for our input (and you should notice the `>` sign). Please specify a couple of messages and hit `Ctrl + D` after you finish:

# Kafka Consumer

## Run Kafka Consumer

- Let’s run a **console consumer** with the `kafka-console-consumer` command:
  ```sh
    docker exec --interactive --tty kafka kafka-console-consumer --bootstrap-server localhost:8098 --topic first-test-kafka-topic --from-beginning
  ```
- This time, we should see that our messages are printed to the output successfully (and to finish please hit `Ctrl+ C`):

# Resources and Further Reading
