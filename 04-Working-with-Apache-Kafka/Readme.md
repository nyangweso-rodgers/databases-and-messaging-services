# Apache Kafka

## Table Of Contents

# Objective

- Run a single-broker Kafka cluster in Docker via docker-compose to perform integration tests for a piece of code that involves publishing and consuming Kafka messages.

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

## Kafka Concept #1: Broker

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

## Kafka Concept #5: Producers

- **Producers** are applications that publish data to **Kafka topics**. They write messages to specific topics, and these messages are then stored in the **Kafka brokers**

## Kafka Concept #6: Consumers

- **Consumers** are applications that read data from **Kafka topics**. They subscribe to one or more topics and receive messages from the partitions of those topics.

## Kafka Concept #7: Consumer Groups

- **Consumers** can be organized into **consumer groups**, where each group consists of one or more consumers. Each message in a partition is delivered to only one consumer within a group, allowing parallel processing of data.

## Kafka Concept #8: Zookeepr

- [Zookeeper](https://zookeeper.apache.org/) a service for managing and synchronizing distributed systems. It is a service used to manage Kafka clusters.
- Kafka uses Zookeeper to manage the brokers in a cluster, and requires Zookeeper even if you're running a Kafka cluster with only one broker.

# Schema Management

- Applications that leverage Kafka fall into two categories: they are either **producers** or **consumers** (or both in some cases).

  - **Producers** generate messages or events which are then published to Kafka. These take the form of `key-value` records which the **producers** serialize into byte arrays and send to **Kafka brokers**. The brokers store these serialized records into designated **topics**.
  - **Consumers** subscribe to one or more **topics**, request the stored events, and process them. **Consumers** must be able to deserialize the bytes, returning them to their original record format.

- This creates an implicit contract between the two applications. There is an assumption from the **producer** that the **consumer** will understand the format of the message. Meanwhile, the **consumer** also assumes that the **producer** will continue to send the messages in the same format.
- A **schema** is a set of rules that establishes the format of the messages being sent. It outlines the structure of the message, the names of any fields, what data types they contain, and any other important details. This **schema** is a contract between the two applications. Both the **producer** and **consumer** are expected to support the **schema**.

# Schema Registry

- The **schema registry** is a service that records the various **schemas** and their different versions as they evolve. **Producer** and **consumer** clients retrieve **schemas** from the **schema registry** via `HTTPS`, store them locally in cache, and use them to **serialize** and **deserialize** messages sent to and received from Kafka. This schema retrieval occurs only once for a given schema and from that point on the cached copy is relied upon.

## Register a Schema

- When you register a schema you need to provide the `subject-name` and the schema itself. The `subject-name` is the name-space for the schema, almost like a key when you use a hash-map. The standard naming convention is `topic-name-key` or `topic-name-value`.
- Once **Schema Registry** receives the schema, it assigns it a unique ID number and a version number. The first time you register a schema for a given subject-name, it is assigned a version of 1.
- **Methods to Register a schema**:
  - Confluent CLI
  - Schema Registry REST API,
  - Confluent Cloud Console,
  - Maven and Gradle plugins

## Updating a Schema

- To update previously registered schemas, you will use the same methods that you used to first register the schema Provided you are making compatible changes.
- Schema Registry will simply assign a new ID to the schema and a new version number. The new ID is not guaranteed to be in sequential order. But the version number will always be incremented by one, hence it will be in sequential order.

# Kafka Serialization Schemas

- **Serialization** is the process of transforming data so it can be transferred, stored, or compared.
- Common serioalization schemes for **Kafka** include:
  - `Avro`,
  - `JSON`, and
  - `Protobuf`

## `Avro` Serialization

- `Avro` is an open source data serialisation system which marshals your data (and it’s appropriate schema) to a efficient binary format.
- Example:
  - An event that represent a `Sale Order` might look like this:
    ```json
    {
      "created_at": 1424849130111,
      "customer_id": 1234,
      "product_id": 5678,
      "amount": 100,
      "payment_method": "cash"
    }
    ```
  - It might have a schema like this that defines these five fields:
    ```avsc
    {
      "type": "record",
      "doc": "This event records the sale of a product",
      "name": "SaleOrderEvent",
      "fields": [
        { "name": "customer_id", "type": "int", "doc": "The customer" },
        { "name": "product_id", "int": "long", "doc": "The product" },
        { "name": "amount", "int": "int" }
      ]
    }
    ```
- The set of **primitive type** names is:
  - `null`: no value
  - `boolean`: a binary value
  - `int`: 32-bit signed integer
  - `long`: 64-bit signed integer
  - `float`: single precision (32-bit) IEEE 754 floating-point number
  - `double`: double precision (64-bit) IEEE 754 floating-point number
  - `bytes`: sequence of 8-bit unsigned bytes
  - `string`: unicode character sequence
- `Avro` supports six kinds of **Complex Types**:
  - records
  - enums
  - arrays
  - maps
  - unions
  - fixed
- The `Avro` **compatibility type.** Valid options:
  - `none` — New schema can be any valid `Avro` schema
  - `backward` —default — New schema can read data produced by the latest registered schema.
  - `backward_transitive` — New schema can read data produced by all previously registered schemas
  - `forward` — Latest registered schema can read data produced by the new schema
  - `forward_transitive` — All previously registered schemas can read data produced by the new schema
  - `full` — New schema is backward and forward compatible with latest registered schema
  - `full_transitive` — New schema is backward and forward compatible with all previously registered schemas

### How to Configi

# `Protobuf` Serialization

- `Protobuf` is a method of serializing structured data. A message format is defined in a `.proto` file and you can generate code from it in many languages. Unlike `Avro`, `Protobuf` does not serialize **schema** with the message. So, in order to deserialize the message, you need the schema in the consumer.
- Example of a `protobuf` schema:

  ```proto
      //protobuf schema
      syntax = "proto3";

      package com.codingharbour.protobuf;

      message SimpleMessage {
          string content = 1;
          string date_time = 2;
      }
  ```

- Besides scalar types, it is possible to use complex data types. Below we see two schemas, `Order` and `Product`, where Order can contain zero, one or more `Products`:

  ```proto
       //protobuf schema
       syntax = "proto3";

       package com.codingharbour.protobuf;

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

- Like with `Avro`, **Schema Registry** provides a **serializer** and **deserializer** for `Protobuf`, called `KafkaProtobufSerializer` and `KafkaProtobufDeserializer`. The job of this **serializer** is to convert the Java object to a `protobuf` binary format before the producer writes the message to Kafka.
- The additional job of the **serialiser** is to check whether the `protobuf` schema exists in the **Schema Registry**. If not, it will write the schema to **Schema Registry** and it will write the schema id to the message (at the beginning of the message). Then, when the Kafka record reaches the consumer, the consumer will use `KafkaProtobufDeserializer` to fetch the schema from the `Schema Registry` based on the schema id from the message. Once the schema is fetched, the `KafkaProtobufDeserializer` will use it to deserialize the message. This way the consumer doesn’t need to know the schema in advance to be able to consume messages from Kafka. This is why, when using `KafkaProtobuf(De)Serializer` in a producer or a consumer, we need to provide the URL of the **Schema Registry**.

# Resources

1. [kafka.apache.org/intro](https://kafka.apache.org/intro)
2. [zookeeper.apache.org](https://zookeeper.apache.org/)
3. [confluent.io - Kafka Listeners – Explained](https://www.confluent.io/blog/kafka-listeners-explained/)
4. [confluent.io - Introducing the Kafka Consumer: Getting Started with the New Apache Kafka 0.9 Consumer Client](https://www.confluent.io/blog/tutorial-getting-started-with-the-new-apache-kafka-0-9-consumer-client/)
5. [Schema Registry Documentation](https://docs.confluent.io/platform/current/schema-registry/index.html)
6. [developer.confluent.io - Managing Schemas](https://developer.confluent.io/courses/schema-registry/manage-schemas/#:~:text=When%20you%20register%20a%20schema,or%20topic%2Dname%2Dvalue.)
7. [Protocol Buffers Documentation](https://protobuf.dev/overview/#scalar)
8. [Apache avro](https://avro.apache.org/)
9. [confluentinc/cp-schema-registry Docker Image](https://hub.docker.com/r/confluentinc/cp-schema-registry)
