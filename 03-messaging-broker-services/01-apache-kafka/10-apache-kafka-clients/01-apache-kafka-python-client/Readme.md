# Apache Kafka for Python

## Table Of Contents

# Apache Kafka Python Client

- The Python client provides a high-level **producer**, **consumer**, and **AdminClient** that are compatible with **Kafka brokers** (version 0.8 or later), Confluent Cloud, and Confluent Platform.

# Python Client Installation

- The client is available on [PyPI](https://pypi.org/project/confluent-kafka/) and can be installed using `pip`. Install the Apache Kafka Python client library:
  ```sh
    pip install confluent-kafka
  ```

# The Python AdminClient Class

- Complete simple Kafka cluster administrative tasks using the Python `AdminClient` class

## Use AdminClient to Create a Topic and Alter its Configuration

- A **topic** is an **immutable**, append-only log of events. Usually, a topic is comprised of the same kind of events.
- use the `AdminClient` class to create a new Kafka topic and alter one of its configuration properties.
- Create and open a called `admin.py` file.
- Add Required Imports
  ```py
    from confluent_kafka.admin import (AdminClient, NewTopic, ConfigResource)
    from config import config
  ```
- Check if Kafka Topic Exists (Add a function that uses `list_topics()` to check to see if a specific topic already exists)
  ```py
    # return True if topic exists and False if not
    def topic_exists(admin, topic):
        metadata = admin.list_topics()
        for t in iter(metadata.topics.values()):
            if t.topic == topic:
                return True
        return False
  ```
- Create a New Kafka Topic (Add a function using a NewTopic instance and the create_topics() function to create a topic)
  ```py
    # create new topic and return results dictionary
    def create_topic(admin, topic):
        new_topic = NewTopic(topic, num_partitions=6, replication_factor=3)
        result_dict = admin.create_topics([new_topic])
        for topic, future in result_dict.items():
            try:
                future.result()  # The result itself is None
                print("Topic {} created".format(topic))
            except Exception as e:
                print("Failed to create topic {}: {}".format(topic, e))
  ```

## Use AdminClient to Describe the New Kafka Topic

- Create a function that uses a `ConfigResource` instance and the `describe_configs()` function:
  ```py
    # get max.message.bytes property
    def get_max_size(admin, topic):
        resource = ConfigResource('topic', topic)
        result_dict = admin.describe_configs([resource])
        config_entries = result_dict[resource].result()
        max_size = config_entries['max.message.bytes']
        return max_size.value
  ```

## Use AdminClient to Set a Kafka Topic Configuration Property Value

- Now add a function using the `alter_configs()` function to set the `max.message.bytes` property:
  ```py
    # set max.message.bytes for topic
    def set_max_size(admin, topic, max_k):
        config_dict = {'max.message.bytes': str(max_k*1024)}
        resource = ConfigResource('topic', topic, config_dict)
        result_dict = admin.alter_configs([resource])
        result_dict[resource].result()
  ```

# Kafka Producer

## Step : Initialization

- The **Producer** is configured using a dictionary.
- Example:

  ```py
    from confluent_kafka import Producer

    conf = {'bootstrap.servers': 'host1:9092,host2:9092',
        'client.id': socket.gethostname()}

    producer = Producer(conf)
  ```

- Remark:

  - If you are connecting to a Kafka cluster in [Confluent Cloud](https://www.confluent.io/confluent-cloud/tryfree/?session_ref=https://www.google.com/&_gl=1*kbuk79*_gcl_au*MTg5NDExNjczNi4xNzI1NDQwMjc5*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyNTczMzA1OC4xOTcuMS4xNzI1NzMzNzkyLjU0LjAuMA..&_ga=2.32438142.1350022208.1723832910-234518971.1709664712), you need to provide credentials for access. The example below shows using a cluster API key and secret.

    ```py
        from confluent_kafka import Producer
        import socket

        conf = {'bootstrap.servers': 'pkc-abcd85.us-west-2.aws.confluent.cloud:9092',
                'security.protocol': 'SASL_SSL',
                'sasl.mechanism': 'PLAIN',
                'sasl.username': '<CLUSTER_API_KEY>',
                'sasl.password': '<CLUSTER_API_SECRET>',
                'client.id': socket.gethostname()}

        producer = Producer(conf)
    ```

- Create function to produce to `hello_topic` kafka topic:

# Produce Events with JSON Schema

- Define a `JSON` schema and then produce events using a **Producer**, a `JSONSerializer` and **Schema Registry**.
- Step : Create a `temp_readings` kafka topic
- Step :
  - The Python packages `jsonschema` and `requests` are required by the `JSONSerializer` so we need to install them so the corresponding import statements can be satisfied. Run the following commands:
    ```sh
        pip install jsonschema
        pip install requests
    ```
- Step : Add Configurations
  - Add the following dictionary:
  ```py
    sr_config = {
        'url': '<schema.registry.url>',
        'basic.auth.user.info':'<SR_API_KEY>:<SR_API_SECRET>'
    }
  ```
- Step : Create and open a new file called `json_producer.py`.
- Step : Add Required Imports
  ```py
    from confluent_kafka import Producer
    from confluent_kafka.serialization import SerializationContext, MessageField
    from confluent_kafka.schema_registry import SchemaRegistryClient
    from confluent_kafka.schema_registry.json_schema import JSONSerializer
    from config import config, sr_config
    import time
  ```

# Kafka Consumer

## Step : Initialization

- The **Consumer** is configured using a dictionary.

  ```py
    from confluent_kafka import Consumer

    conf = {'bootstrap.servers': 'host1:9092,host2:9092',
            'group.id': 'foo',
            'auto.offset.reset': 'smallest'}

    consumer = Consumer(conf)
  ```

- Remark:
  - If you are connecting to a **Kafka cluster** in [Confluent Cloud](https://www.confluent.io/confluent-cloud/tryfree/?session_ref=https://www.google.com/&_gl=1*kbuk79*_gcl_au*MTg5NDExNjczNi4xNzI1NDQwMjc5*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyNTczMzA1OC4xOTcuMS4xNzI1NzMzNzkyLjU0LjAuMA..&_ga=2.32438142.1350022208.1723832910-234518971.1709664712), you need to provide credentials for access.

# Using `kafka-python`

- [kafka-python](https://kafka-python.readthedocs.io/en/2.0.1/usage.html) library can implement Kafka-Consumer and Kafka-Producer.
- Install `kafka-python` by:
  ```sh
    pip install kafka-python
  ```



# Setting Up a Kafka Producer in Python

## Prerequisites

1. Python (3.6 or higher)
2. `kafka-python` library using:
   ```sh
    pip install kafka-python
   ```

## Step-by-Step Guide

### Step 1: Import Kafka Producer

```py
    from kafka import KafkaProducer
```

### Step 2: Create a Producer Instance

```py
    producer = KafkaProducer(bootstrap_servers='localhost:9092')
```

- Here, we create an instance of the `KafkaProducer` class. The `bootstrap_servers` parameter defines the Kafka broker address (e.g., `'localhost:9092'`) that the producer will connect to.

### Step 3: Sending a Message

```py
    # Sending a simple string message
    producer.send('my_topic', b'Hello, Kafka!')

    # Ensure all messages are sent before exiting
    producer.flush()
```

### Step 4: Sending Messages with Keys

- **Kafka** allows sending messages with `keys` for **partitioning**.
  ```py
    # Sending a message with a key
    producer.send('my_topic', key=b'my_key', value=b'Some message')
  ```

# Consume Events with JSON Schema

- Use the `JSONDeserializer` to turn events into objects we can work with in our Python application.
- Step : Add Required Imports
  - Add the following import statements to the top of the `json_consumer.py` file:
    ```py
        from confluent_kafka import Consumer
        from confluent_kafka.serialization import SerializationContext, MessageField
        from confluent_kafka.schema_registry.json_schema import JSONDeserializer
        from config import config
    ```

# Resources and Further Reading

1. [confluent.io/blog - kafka-python-developer-guide](https://www.confluent.io/blog/kafka-python-developer-guide/?ref=dailydev)
2. [confluent_kafka API documentation](https://docs.confluent.io/platform/current/clients/confluent-kafka-python/html/index.html)