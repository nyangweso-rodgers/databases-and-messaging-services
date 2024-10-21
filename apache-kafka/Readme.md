# Apache Kafka

## Table Of Contents

# Schema Management

- Applications that leverage **Kafka** fall into two categories: they are either **producers** or **consumers** (or both in some cases).

  - **Producers** generate messages or events which are then published to **Kafka**. These take the form of `key-value` records which the **producers** serialize into byte arrays and send to **Kafka brokers**. The brokers store these serialized records into designated **topics**.
  - **Consumers** subscribe to one or more **topics**, request the stored events, and process them. **Consumers** must be able to deserialize the bytes, returning them to their original record format.

- This creates an implicit contract between the two applications. There is an assumption from the **producer** that the **consumer** will understand the format of the message. Meanwhile, the **consumer** also assumes that the **producer** will continue to send the **messages** in the same format.

- A **schema** is a set of rules that establishes the format of the messages being sent. It outlines the structure of the message, the names of any fields, what data types they contain, and any other important details. This **schema** is a contract between the two applications. Both the **producer** and **consumer** are expected to support the **schema**.

# Schema Registry

- The **schema registry** is a service that records the various **schemas** and their different versions as they evolve. **Producer** and **consumer** clients retrieve **schemas** from the **schema registry** via `HTTPS`, store them locally in cache, and use them to **serialize** and **deserialize** messages sent to and received from **Kafka**. This **schema** retrieval occurs only once for a given **schema** and from that point on the cached copy is relied upon.

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


1. [confluent.io - Kafka Listeners – Explained](https://www.confluent.io/blog/kafka-listeners-explained/)
2. [confluent.io - Introducing the Kafka Consumer: Getting Started with the New Apache Kafka 0.9 Consumer Client](https://www.confluent.io/blog/tutorial-getting-started-with-the-new-apache-kafka-0-9-consumer-client/)
3. [Schema Registry Documentation](https://docs.confluent.io/platform/current/schema-registry/index.html)
4. [developer.confluent.io - Managing Schemas](https://developer.confluent.io/courses/schema-registry/manage-schemas/#:~:text=When%20you%20register%20a%20schema,or%20topic%2Dname%2Dvalue.)
5. [Protocol Buffers Documentation](https://protobuf.dev/overview/#scalar)
6. [Apache avro](https://avro.apache.org/)
7. [confluentinc/cp-schema-registry Docker Image](https://hub.docker.com/r/confluentinc/cp-schema-registry)
