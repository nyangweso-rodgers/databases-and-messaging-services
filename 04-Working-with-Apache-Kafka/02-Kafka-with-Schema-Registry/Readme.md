# Kafka With Schema Registry

## Table Of Contents

# Kafka Serialization Schemas

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

# Understanding Schemas

- **Schemas** epresents a contract between communicating applications just like an API represents a contract between a service and its consumers.
- And just as REST APIs can be described using OpenAPI (Swagger) so the messages in **Kafka** can be described using `Avro`, `Protobuf` or `Avro` **schemas**.
- **Schemas** describe the structure of the data by:
  - specifying which fields are in the message
  - specifying the data type for each field and whether the field is mandatory or not
- In addition, together with **Schema Registry**, **schemas** prevent a **producer** from sending poison messages – malformed data that consumers cannot interpret. **Schema Registry** will detect if breaking changes are about to be introduced by the producer and can be configured to reject such changes. An example of a breaking change would be deleting a mandatory field from the **schema**.

# `Protobuf`

- `Protobuf` is a method of serializing structured data. A message format is defined in a `.proto` file and you can generate code from it in many languages including Java, Python, C++, C#, Go and Ruby. Unlike `Avro`, `Protobuf` does not serialize **schema** with the message. So, in order to deserialize the message, you need the schema in the consumer.
- Example:

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

  - In the first line, we define that we’re using `protobuf` `version 3`. Our message type called `SimpleMessage` defines two `string` fields: `content` and `date_time`. Each field is assigned a so-called field number, which has to be unique in a message type. These numbers identify the fields when the message is serialized to the `Protobuf` binary format. Google suggests using numbers 1 through 15 for most frequently used fields because it takes one byte to encode them.

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

# Schema Registry and Protobuf

- **Schema Registry** is a service for storing a versioned history of schemas used in Kafka. It also supports the evolution of schemas in a way that doesn’t break producers or consumers.
- Like with `Avro`, **Schema Registry** provides a serializer and deserializer for `Protobuf`, called `KafkaProtobufSerializer` and `KafkaProtobufDeserializer`. The job of this serializer is to convert the Java object to a `protobuf` binary format before the producer writes the message to Kafka.
- The additional job of the serialiser is to check whether the `protobuf` schema exists in the **Schema Registry**. If not, it will write the schema to **Schema Registry** and it will write the schema id to the message (at the beginning of the message). Then, when the Kafka record reaches the consumer, the consumer will use `KafkaProtobufDeserializer` to fetch the schema from the `Schema Registry` based on the schema id from the message. Once the schema is fetched, the `KafkaProtobufDeserializer` will use it to deserialize the message. This way the consumer doesn’t need to know the schema in advance to be able to consume messages from Kafka. This is why, when using `KafkaProtobuf(De)Serializer` in a producer or a consumer, we need to provide the URL of the **Schema Registry**.

# Create `Avro` Schema

- We use [Apache avro](https://avro.apache.org/) as a data format for our messages.
- Add simpe message definition to `src/main/avro/msg-schema.avsc`
  ```avsc
  {
    "type": "record"
    "name": "SMessage",
    "namespace": "com.lda.test.kafka.schema",
    "fields": [
    {
      "name": "idMsg",
      "type": "int"
    },
    {
      "name": "msgBody",
      "type": "string"
    }
  ]
  }
  ```
- Execute build and class SMessage should be generated. Can be used in code from now.

# Schema Management

- Applications that leverage Kafka fall into two categories: they are either producers or consumers (or both in some cases).
  - **Producers** generate messages or events which are then published to Kafka. These take the form of key-value records which the producers serialize into byte arrays and send to Kafka brokers. The brokers store these serialized records into designated topics.
  - **Consumers** subscribe to one or more topics, request the stored events, and process them. Consumers must be able to deserialize the bytes, returning them to their original record format.
- This creates an implicit contract between the two applications. There is an assumption from the producer that the consumer will understand the format of the message. Meanwhile, the consumer also assumes that the producer will continue to send the messages in the same format.
- A schema is a set of rules that establishes the format of the messages being sent. It outlines the structure of the message, the names of any fields, what data types they contain, and any other important details. This schema is a contract between the two applications. Both the producer and consumer are expected to support the schema.
- . The schema registry is a service that records the various schemas and their different versions as they evolve. Producer and consumer clients retrieve schemas from the schema registry via HTTPS, store them locally in cache, and use them to serialize and deserialize messages sent to and received from Kafka. This schema retrieval occurs only once for a given schema and from that point on the cached copy is relied upon.

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

# Resources

1. [Schema Registry Documentation](https://docs.confluent.io/platform/current/schema-registry/index.html)
2. [confluentinc/cp-schema-registry Docker Image](https://hub.docker.com/r/confluentinc/cp-schema-registry)
3. [Apache avro](https://avro.apache.org/)
4. [Protocol Buffers Documentation](https://protobuf.dev/overview/#scalar)
5. [developer.confluent.io - Managing Schemas](https://developer.confluent.io/courses/schema-registry/manage-schemas/#:~:text=When%20you%20register%20a%20schema,or%20topic%2Dname%2Dvalue.)
