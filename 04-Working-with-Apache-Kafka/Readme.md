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

# Kafka Serialization Schemes

- **serialization** is the process of transforming data so it can be transferred, stored, or compared.
- Common seroalization schemes for Kafka include:
  - Avro,
  - JSON, and
  - Protobuf
- Avro is an open source data serialisation system which marshals your data (and it’s appropriate schema) to a efficient binary format.
- Here's how a {hello: "world"} object looks like in JSON versus Protobuf:

  - in `json` ((17 bytes)):
    ```json
    { "hello": "world" }
    ```
  - in Protobuf (7 bytes):

    ```proto
      // interpreting the bytes as Unicode characters...
      \n\u0005world

      // reading them as a sequence of bytes in raw hexadecimal form...
      0A 05 77 6F 72 6C 64

      // or as binary...
      00001010 00000101 01110111 01101111 01110010 01101100 01100100
    ```

## Working with Protobuf in Kafka

- `Protobuf` is a method of serializing structured data. A message format is defined in a `.proto` file and you can generate code from it in many languages. Unlike `Avro`, `Protobuf` does not serialize schema with the message. So, in order to deserialize the message, you need the schema in the consumer.
- Here’s an example of a `Protobuf` **schema** containing one message type:

  ```proto
    syntax = "proto3"

    message SimpleMessage {
    string content = 1;
    string date_time = 2;
  }
  ```

  - `SimpleMessage` message type defines two string fields: `content` and `date_time`
  - Each field is assigned a so-called **field number**, which has to be unique in a message type. These numbers identify the fields when the message is serialized to the Protobuf binary format. Google suggests using numbers 1 through 15 for most frequently used fields because it takes one byte to encode them.

- Protobuf supports common scalar types like `string`, `int32`, `int64` (long), `double`, `bool` etc. For the full list of all scalar types in Protobuf check the [Protobuf documentation](https://protobuf.dev/overview/#scalar).
- Besides scalar types, it is possible to use complex data types. Below we see two schemas, `Order` and `Product`, where Order can contain zero, one or more Products:

  ```proto
    syntax = "proto3"

    message Order {
      int64 order_id = 1;
      int64 date_time = 2;
      repeated Product product = 3;
  }

  message Product {
      int32 product_id = 1;
      string name = 2;
      string description = 3;
  }
  ```

# Confluent Schema Registry and Protobuf

- **Schema Registry** is a service for storing a versioned history of schemas used in Kafka. It also supports the evolution of schemas in a way that doesn’t break producers or consumers.
- Like with Avro, **Schema Registry** provides a **serializer** and **deserializer** for Protobuf, called **KafkaProtobufSerializer** and **KafkaProtobufDeserializer**.
- The job of this **serializer** is to convert the Java object to a protobuf binary format before the producer writes the message to Kafka.
- The additional job of the **serialiser** is to check whether the protobuf schema exists in the **Schema Registry**. If not, it will write the schema to **Schema Registry** and it will write the schema id to the message (at the beginning of the message). Then, when the Kafka record reaches the consumer, the consumer will use **KafkaProtobufDeserializer** to fetch the schema from the **Schema Registry** based on the schema id from the message. Once the schema is fetched, the **KafkaProtobufDeserializer** will use it to deserialize the message. This way the consumer doesn’t need to know the schema in advance to be able to consume messages from Kafka.
- This is why, when using **KafkaProtobuf**(De)**Serializer** in a producer or a consumer, we need to provide the URL of the **Schema Registry**.

# Resources

1. [kafka.apache.org/intro](https://kafka.apache.org/intro)
2. [zookeeper.apache.org](https://zookeeper.apache.org/)
3. [kafka.apache.org/downloads](https://kafka.apache.org/downloads)
4. [How To Set Up Apache Kafka With Docker?](https://codersee.com/how-to-set-up-apache-kafka-with-docker/)
5. [Official Documentation - Protocol Buffers Documentation](https://protobuf.dev/overview/)
