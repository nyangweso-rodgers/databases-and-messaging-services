# Protobuf Schema

## Table Of Contents

# Protobuf

- **Protobuf** is optimized for high performance, using a binary encoding that omits the **schema** within the serialized data. This approach minimizes the data payload size if your bandwidth is limited. **Protobuf**'s binary format is less readable, but it supports a broader range of programming languages, offering a more versatile solution for multi-language environments.
- It's worth noting that while **Protobuf** supports more languages, the level of tooling and ecosystem support may vary. A significant feature of **Protobuf** is its native support for **gRPC**, an integration that allows for easy implementation of efficient, scalable microservices.
- Here’s an example of a **Protobuf schema** containing one message type

  ```proto
    syntax = "proto3";

    package com.codingharbour.protobuf;

    message SimpleMessage {
        string content = 1;
        string date_time = 2;
    }
  ```

  - Each field is assigned a so-called field number, which has to be unique in a message type. These numbers identify the fields when the message is serialized to the Protobuf binary format. Google suggests using numbers 1 through 15 for most frequently used fields because it takes one byte to encode them.

- **Protobuf** supports common scalar types like:
  1. `string`,
  2. `int32`,
  3. `int64` (long),
  4. `double`,
  5. `bool` etc.
- Besides **scalar types**, it is possible to use complex data types. Below we see two schemas, **Order** and **Product**, where **Order** can contain zero, one or more Products:

  ```proto
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

# How to use the schema registry

## Schema Registry and Protobuf

- **Schema Registry** provides a **serializer** and **deserializer** for **Protobuf**, called `KafkaProtobufSerializer` and `KafkaProtobufDeserializer`.
- The job of this **serializer** is to convert the Java object to a **protobuf** binary format before the producer writes the message to Kafka.
- The additional job of the **serialiser** is to check whether the **protobuf schema** exists in the **Schema Registry**. If not, it will write the **schema** to **Schema Registry** and it will write the schema id to the message (at the beginning of the message). Then, when the **Kafka** record reaches the consumer, the consumer will use KafkaProtobufDeserializer to fetch the schema from the Schema Registry based on the schema id from the message. Once the schema is fetched, the KafkaProtobufDeserializer will use it to deserialize the message. This way the consumer doesn’t need to know the schema in advance to be able to consume messages from Kafka.

# Protobuf schema compatibility rules

# Commands

## 1. Examine Subjects Used In Schema

- Use the REST endpoints to examine the **schemas** that were registered. First, you can see which **subjects** were used by using the following command.

  ```sh
    curl http://localhost:8081/subjects
  ```

- Test Output:
  ```sh
  ["users.customers-value"]
  ```

# Protobuf using Kafka REST interface

# Register Protobuf Schema Using Python Script

# Using Protocol Buffers with Python

- Steps 1:

  - Install the Protocol Buffers compiler (protoc) on your system, which is essential for compiling `.proto` files into language-specific code.
  - This compiler can be downloaded from the Protocol Buffers GitHub releases page or installed via package managers like `apt-get`, `brew`, or `choco`, depending on your operating system
  - Once installed, you can define your data structure using the Protocol Buffers language syntax in a `.proto` file. For example, a `person.proto` file might define fields like `name`, `id`, and `email` for a Person message.

    ```proto
      syntax = "proto3";

      message Person {
        string name = 1;
        int32 id = 2;
        string email = 3;
      }
    ```

  - After defining your `.proto` file, you use the protoc compiler to generate Python code from it. This step creates Python classes (e.g., `person_pb2.py`) that correspond to your defined message types.
    ```sh
      protoc --python_out=. person.proto
    ```

- Step:
  - Install protobuf Python package via pip.
    ```sh
      pip install protobuf
    ```
- With this package, you can import the generated Python classes (person_pb2) into your application code.

  ```py
    from person_pb2 import Person

    # Create a new Person message
    person = Person()
    person.name = "Alice"
    person.id = 123
    person.email = "alice@example.com"
  ```

- This allows you to create instances of your Protocol Buffers messages, set values for their fields, and serialize them into a compact binary format using methods like `SerializeToString()`. This binary format is efficient for storage and transmission, making data handling more streamlined and performant.
  ```py
    # Serialize to binary format
    serialized_person = person.SerializeToString()
  ```
- To complete the cycle, you can deserialize binary data back into structured messages using methods like `ParseFromString()`, enabling your applications to read and manipulate data according to the original schema.

  ```py
    # Deserialize from binary format
    new_person = Person()
    new_person.ParseFromString(serialized_person)

    print(new_person)
  ```

# Resources and Further Reading

1. [Protobuf Documentation](https://protobuf.dev/overview/#scalar)
