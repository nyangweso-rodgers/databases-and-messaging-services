# Docker Exec Commands

## Table Of Contents

# Docker Exec Commands

- We can also use the `docker exec` command to run shell commands inside the running Kafka container. This allows you to execute any commands that you could run inside the container, including Kafka command-line tools.
- Using `docker exec` allows you to interact with the container from the host machine's command line without needing to enter the container shell.

## List Kafka Topics

- Use the `kafka-topics` command to list the topics in the Kafka cluster:
  ```sh
    docker exec -it kafka kafka-topics --list --bootstrap-server localhost:8098
  ```

## Create a Kafka Topic

```sh
  #create a topic
  docker exec -it kafka kafka-console-producer --bootstrap-server localhost:8098 --topic test-kafka-topic
```

- the `kafka-topics` is a shell script that allows us to execute a `TopicCommand` tool. It’s a command-line tool that can manage and list topics in a Kafka cluster. Additionally, we have to specify the listener hostname (specified with `KAFKA_ADVERTISED_LISTENERS`) with `–bootstrap-server`

## Run Kafka Producer

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
