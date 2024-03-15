# Producing and Consuming Kafka Messages with Python

## Table Of Contents

# Step #: Install the Python Kafka library, `kafka-python`

```sh
    pip install kafka-python
```

# Step #: Producing messages to a Kafka topic

- Create `producer.py` file with:
  ```py
    #producer.py
  ```
- Run `py producer.py` to send the message to the `test-topic` kafka topic

# Step #: Consuming messages from a Kafka topic

- Create a `consumer.py` file with:
  ```py
    #consumer.py
  ```
- Run `py consumer.py` to consume the message from the `test-topic` kafka topic.
- This code creates a new Kafka consumer, which is connected to the Kafka cluster specified by the `bootstrap_servers` parameter. The code then subscribes to the topic, `test-topic` and continuously polls for new messages. Each message received is printed to the console

# Step #:

# Resources

1. [kafka-python library](https://kafka-python.readthedocs.io/en/master/index.html)
2. [Kafka documentation](https://kafka.apache.org/)
3. [dev.to/Apache Kafka with Python](https://dev.to/hesbon/apache-kafka-with-python-laa)
