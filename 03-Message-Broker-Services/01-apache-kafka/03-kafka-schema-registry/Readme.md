# Schema Registry

## Table Of Contents

# Why do we need schemas

- **Schemas** represents a contract between the participants in communication, just like an API represents a contract between a service and its consumers.
- **Schemas** describe the structure of the data by:
  - specifying which fields are in the message
  - specifying the data type for each field and whether the field is mandatory or not

# When to use Kafka schema registry

1. The schema is likely to change in the future
2. When schema is expected to change in the future
3. The data can be serialized with the formats supported by Kafka schema registry

# How Kafka schema registry works

- A **Kafka schema registry** resides in a **Kafka cluster**. It can be plugged into the Kafka configuration. The configuration stores the schema and distributes it to the producer and consumer for serialization and deserialization. Hosting schemas like this allows schema evolution, making message transfer robust.
- Without **schemas**, there would be no easy way to establish a contract ensuring messages sent by the **producer** match the format expected by the **consumer**.

# Choosing a serialization format for Kafka schema registry

- The **Kafka schema registry** supports three serialization formats:
  1. Avro (recommended for most use cases)
  2. JSON
  3. Google Protobuf

## 1. Avro

- **Avro** is flexible due to its support for dynamic typing. It does not require regenerating and recompiling code with every schema update, although doing so can optimize performance.
- One of **Avro's** strengths lies in its ecosystem, especially around languages like Java, where it offers extensive libraries and tools that integrate seamlessly with Java applications.
- Another advantage of **Avro** is its human-readable schema format, which significantly aids in debugging and maintaining the codebase by making it easier to understand the data structures in use. Avro supports native Remote Procedure Call (RPC) mechanisms, enabling efficient and direct communication between different components in a distributed system without needing an additional layer for RPC handling.

## How to Register an Avro Schema

### Step 1: Define Avro Schema

- Create an **Avro schema** file (e.g., `schema.avsc`):
  ```avsc
  {
    "type": "record",
    "name": "User",
    "namespace": "com.example",
    "fields": [
      { "name": "id", "type": "int" },
      { "name": "name", "type": "string" },
      { "name": "email", "type": "string" }
    ]
  }
  ```
- Remarks:
  - In **Avro schema** definitions, the **namespace** attribute is used to organize and uniquely identify the **schemas** within a larger system. It is similar to the concept of **namespaces** in programming languages like Java or C#. The **namespace** helps to avoid naming conflicts by providing a context for the schema name.

### Step 2: Register Avro Schema Using `curl` Command

- Example:

  ```sh
    curl -v -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"record\", \"name\": \"delegatesSurvey\", \"namespace\": \"com.example\", \"fields\": [{ \"name\": \"id\", \"type\": \"string\" }] }"}' http://localhost:8081/subjects/Delegates-Survey/versions
  ```

## Step 2.2: Register Avro Schema Using Python Script

- If your schema is very complex, using a Python script can be more manageable:

  ```py
    import json
    import requests

    # Read the schema file
    with open('delegates-survey.avsc', 'r') as file:
        schema = file.read()

    # Create the payload
    payload = {
        "schema": schema
    }

    # Send the request
    response = requests.post(
        'http://localhost:8081/subjects/Delegates-Survey/versions',
        headers={'Content-Type': 'application/vnd.schemaregistry.v1+json'},
        data=json.dumps(payload)
    )

    print(response.status_code, response.text)
  ```

- The code will work as long as the `delegates-survey.avsc` file exists in the same directory as your Python script and contains a valid **Avro schema** definition.
- To run the script, save it as `register_schema.py` and use the following command:
  ```sh
    python register_schema.py
  ```

## 2. Protobuf

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

## 3. JSON

- **JSON** has the advantage of being a human-readable, non-binary format. However, it comes with negative performance impacts because **JSON** is not compact.

## How to Register a JSON Schema

### Step 1: Create JSON Schema

- Create a **JSON schema** file (e.g., schema.json):
  ```json
  {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "User",
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "name": {
        "type": "string"
      },
      "email": {
        "type": "string"
      }
    },
    "required": ["id", "name", "email"]
  }
  ```

### Step 2: Register JSON Schema

- Syntax:
  ```sh
    curl -v -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "$(cat my_schema.json)", "schemaType": "JSON"}' http://<schema-registry-host>:<port>/subjects/<subject-name>/versions
  ```
- Example:
  ```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"$schema\": \"http://json-schema.org/draft-07/schema#\", \"title\": \"User\", \"type\": \"object\", \"properties\": {\"id\": {\"type\": \"integer\"}, \"name\": {\"type\": \"string\"}, \"email\": {\"type\": \"string\"}}, \"required\": [\"id\", \"name\", \"email\"]}"}' http://localhost:8081/subjects/User-value/versions
  ```
- or:
- Remark:
  - Ensure that the Content-Type header is set to `application/vnd.schemaregistry.v1+json`.
  - The JSON string within the --data parameter should escape the double quotes.
  - Replace `User-value` with the desired subject name. The convention is to use `{TopicName}-value` for the value schema and `{TopicName}-key` for the key schema if you're registering a schema for a **Kafka topic**.
  - Adjust the URL http://localhost:8081 if your Schema Registry is running on a different host or port.

# How to use the schema registry

## Schema Registry and Protobuf

- **Schema Registry** provides a **serializer** and **deserializer** for **Protobuf**, called `KafkaProtobufSerializer` and `KafkaProtobufDeserializer`.
- The job of this **serializer** is to convert the Java object to a **protobuf** binary format before the producer writes the message to Kafka.
- The additional job of the **serialiser** is to check whether the **protobuf schema** exists in the **Schema Registry**. If not, it will write the **schema** to **Schema Registry** and it will write the schema id to the message (at the beginning of the message). Then, when the **Kafka** record reaches the consumer, the consumer will use KafkaProtobufDeserializer to fetch the schema from the Schema Registry based on the schema id from the message. Once the schema is fetched, the KafkaProtobufDeserializer will use it to deserialize the message. This way the consumer doesn’t need to know the schema in advance to be able to consume messages from Kafka.

# `curl` Commands For Schema Registry

## 1. Verify registered schema types.

- verify which schema types are currently registered with Schema Registry by:
  ```sh
    curl http://localhost:8081/schemas/types
  ```
- The response will be one or more of the following. If additional schema format plugins are installed, these will also be available.
  ```sh
    # output
    ["JSON","PROTOBUF","AVRO"]
  ```

# Resources and Further Reading

1. [docs.confluent.io - schema-registry](https://docs.confluent.io/platform/current/schema-registry/index.html)
2. [Protobuf Documentation](https://protobuf.dev/overview/#scalar)
