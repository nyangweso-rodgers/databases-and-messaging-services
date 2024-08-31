# Schema Registry

## Table Of Contents

# Why do we need schemas

- **Schemas** represents a contract between the participants in communication, just like an API represents a contract between a service and its consumers.
- **Schemas** describe the structure of the data by:
  - specifying which fields are in the message
  - specifying the data type for each field and whether the field is mandatory or not

# What is a Schema Registry?

- A **schema registry** is a centralized repository for storing and managing data schemas. It runs as a standalone server process on an external machine.
- The primary purpose of a **schema registry** is to maintain a database of **schemas**, ensuring consistency and compatibility of data formats across different systems and services within an organization.

# When to use Kafka schema registry

1. The schema is likely to change in the future
2. When schema is expected to change in the future
3. The data can be serialized with the formats supported by Kafka schema registry

# How Kafka schema registry works

- A **Kafka schema registry** resides in a **Kafka cluster**. It can be plugged into the Kafka configuration. The configuration stores the schema and distributes it to the producer and consumer for serialization and deserialization. Hosting schemas like this allows schema evolution, making message transfer robust.
- Without **schemas**, there would be no easy way to establish a contract ensuring messages sent by the **producer** match the format expected by the **consumer**.

# Serialization & Deserialization

- _Serialization_ & **_Deserialization_** involves converting data into a byte format for transfer over the network or saving to disk (**serialization**) and converting it back into a usable format (**deserialization**).

# Choosing a serialization format for Kafka schema registry

- The **Kafka schema registry** supports three serialization formats:
  1. Avro (recommended for most use cases)
  2. JSON
  3. Google Protobuf

# Compatibility

- The Schema Registry server can enforce certain compatibility rules when new schemas are registered in a subject. These are the compatibility types:
  1. **BACKWARD**:
     - This is the default.
     - **consumers** using the new schema can read data written by **producers** using the latest registered schema
  2. **FORWARD**
     - **consumers** using the latest registered schema can read data written by **producers** using the new schema
  3. FULL
  4. **NONE**
     - schema compatibility checks are disabled

# Content Types

- The **Schema Registry** REST server uses **content types** for both **requests** and **responses** to indicate the serialization format of the data as well as the version of the API being used. Currently, the only serialization format supported is `JSON` and the only version of the API is `v1`. However, to remain compatible with future versions, you should specify preferred content types in requests and check the content types of responses.
- The preferred format for content types is `application/vnd.schemaregistry.v1+json`, where `v1` is the **API version** and `json` is the **serialization format**. However, other less specific content types are permitted, including `application/vnd.schemaregistry+json` to indicate no specific API version should be used (the most recent stable version will be used), `application/json`, and `application/octet-stream`. The latter two are only supported for compatibility and ease of use.
- Your requests should specify the most specific format and version information possible via the HTTP `Accept` header:
  ```http
    Accept: application/vnd.schemaregistry.v1+json
  ```

# What is Schema Evolution?

- **Schema evolution** is the process of managing changes to the structure of data over time. In **Kafka**, it means handling the modifications to the format of the messages being produced and consumed in **Kafka topics**.
- As applications and business requirements evolve, the data they generate and consume also change, necessitating updates to the **schema**. These changes must be managed carefully to ensure compatibility between **producers** and **consumers** of the data.

# What are Subjects

- **Subjects**: Logical groupings of **schemas**, usually corresponding to **Kafka topics**.
- When working with **Kafka**, each message consists of a **key** and a **value**. **Kafka Schema Registry** can manage **schemas** for both these components, and this is where **key subjects** and **value subjects** come into play.

## Value Subjects

- The **value subject** is associated with the **schema** that defines the structure of the message's **value**.
- Examples:
  - For a topic named `users`, the **value subject** would typically be named `users-value`.
  - `user-v1`, `user-v2` (representing different versions of the user schema)
- Use Case:
  - This is the most common scenario where you register and validate the schema of the actual data (e.g., user details, transaction records) being passed in the value part of the Kafka messages.

## Key Subjects

- The **key subject** is associated with the **schema** that defines the structure of the message's **key**.
- Examples:
  - For the same `users` topic, the **key subject** would be named `users-key`.
  - `user-id` (representing the schema for the user's ID)
- Use Case:
  - This is used when the **key** of your Kafka message has a specific structure or schema that needs to be enforced (e.g., a composite key made up of multiple fields). It's less common than value subjects but crucial in scenarios where the key carries meaningful structured data.

# Common Schema Registry API Usage (Schema Registry `curl` Commands)

- Use `curl` Commands to interact with the Schema Registry [Schema Registry API](https://docs.confluent.io/platform/current/schema-registry/develop/api.html#schemaregistry-api)

## Command 1: List schema types currently registered in Schema Registry

```sh
  curl -X GET http://localhost:8081/schemas/types
```

- Example Result:
  ```sh
    ["JSON", "PROTOBUF", "AVRO"]
  ```

## Command 2: Register a New Version of a Schema under key and value subjects

- Examples:
  1. Register a new version of a **schema** under the **subject** “**Kafka-key**”
     ```sh
       curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-key/versions
     ```
     - Example output:
       ```sh
         ["id": 1]
       ```
  2. Register a new version of a **schema** under the subject “**Kafka-value**”
     ```sh
      curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-value/versions
     ```
     - Example output:
       ```sh
        ["id": 1]
       ```

## Command 3: Register a schema for a new Kafka Topic

- Suppose we have a `users-customers-v1` topic already registered, we can use the [Schema Registry API]() to add a schema for the topic by:

  1. For **Avro**, register the schema using:
     ```sh
      curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\":\"record\",\"name\":\"Customers\",\"namespace\":\"my.examples\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"first_name\",\"type\":\"string\"}, {\"name\":\"last_name\",\"type\":\"string\"}, {\"name\":\"status\",\"type\":{\"type\":\"enum\",\"name\":\"StatusEnum\",\"symbols\":[\"TRUE\",\"FALSE\"]}}, {\"name\":\"created_by\",\"type\":\"string\"}, {\"name\":\"updated_by\",\"type\":\"string\"},{\"name\":\"created_at\",\"type\":\"long\"}, {\"name\":\"updated_at\",\"type\":\"long\"}]}"}' http://localhost:8081/subjects/users.customers.v1-value/versions
     ```
  2. For **Protobuf** register schema by:
     ```sh
      curl -X POST -H "Content-Type: application/vnd.schemaregistry+protobuf" --data '{"schema": "syntax = \"proto3\"; package my.examples; import \"google/protobuf/timestamp.proto\"; message Customers { string id = 1; string first_name = 2; string last_name = 3; bool status = 4; string created_by = 5; string updated_by = 6; google.protobuf.Timestamp created_at = 7; google.protobuf.Timestamp updated_at = 8; }"}' http://localhost:8081/subjects/users.customers.v1-value/versions
     ```
  3. For JSON Schema

- Example output:
  ```sh
    {"id":1}
  ```

## Command 4: List all schema versions registered under the key or value subject

- List all schema version registered under the "`users-customers-v1-value`" value by:

  ```sh
      curl -X GET http://localhost:8081/subjects/users-customers-v1-value/versions
  ```

  - Example output:
    ```sh
      [1]
    ```

- Check whether a schema has been registered under subject "`Kafka-key`" by:

  ```sh
      curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-key
  ```

  - Example output:
    ```sh
        {"subject":"Kafka-key","version":1,"id":1,"schema":"\"string\""}
    ```

## Command 5: Register an existing schema to a new subject name

- Use case: there is an existing schema registered to a subject called `Kafka1`, and this same schema needs to be available to another subject called `Kafka2`. The following one-line command reads the existing schema from `Kafka1-value` and registers it to `Kafka2-value`. It assumes the tool `jq` is installed on your machine.
  ```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data "{\"schema\": $(curl -s http://localhost:8081/subjects/Kafka1-value/versions/latest | jq '.schema')}" http://localhost:8081/subjects/Kafka2-value/versions
  ```
- Example Result:
  ```sh
    ["id": 1]
  ```
- Remark:
  - You do not need to use the `AvroConverter` for topic replication or schema management, even if the topic is **Avro** format. The `ByteArrayConverter` retains the “magic byte”, which is the schema ID. When a replicator is created, messages are replicated with the schema ID. You do not need to create a schema subject. A best practice is to avoid the use of **Avro** due to the overhead, as there is no real value to it in this context.

## Command 5: List all subjects

- The following API call lists all schema subjects.
  ```sh
    curl -X GET http://localhost:8081/subjects
  ```
- Example Result:
  ```sh
    ["Kafka-value","Kafka-key"]
  ```
- Remark:
  - You can use the `deleted` flag at the end of the request to list all **subjects**, including **subjects** that have been soft-deleted (`?deleted=true`).
    ```sh
      curl -X GET http://localhost:8081/subjects?deleted=true
    ```

## Command 6: List all subjects associated with a given ID

- To find subjects associated with a given ID, use [GET /schemas/ids/{int: id}/versions]().

## Command 7: Fetch a schema by globally unique ID 1

```sh
  curl -X GET http://localhost:8081/schemas/ids/1
```

- Example result:
  ```sh
    {"schema":"\"string\""}
  ```

## 7. List all schema versions registered under the subject “Kafka-value”

```sh
  curl -X GET http://localhost:8081/subjects/Kafka-value/versions
```

- Example result:
  ```sh
    [3]
  ```

## 8. Fetch Version 1 of the schema registered under subject “Kafka-value”

```sh
  curl -X GET http://localhost:8081/subjects/Kafka-value/versions/1
```

- Example result:
  ```sh
    {"subject":"Kafka-value","version":1,"id":1,"schema":"\"string\""}
  ```
- Remark:
  - If the schema type is **JSON Schema** or **Protobuf**, the response will also include the schema type. If the schema type is **Avro**, which is the default, the schema type is not included in the response, per the above example.

## 9. Delete Version 1 of the schema registered under subject “Kafka-value”

```sh
  curl -X DELETE http://localhost:8081/subjects/Kafka-value/versions/1
```

- Example result:
  ```sh
    1
  ```

## 10. Delete the most recently registered schema under subject “Kafka-value”

```sh
  curl -X DELETE http://localhost:8081/subjects/Kafka-value/versions/latest
```

- Example result:
  ```sh
    2
  ```

## Delete all schema versions registered under the subject “Kafka-value”

```sh
  curl -X DELETE http://localhost:8081/subjects/Kafka-value
```

- Example result:
  ```sh
    1
  ```

# Resources and Further Reading

1. [docs.confluent.io - schema-registry](https://docs.confluent.io/platform/current/schema-registry/index.html)
2. [Schema Registry API Usage Examples for Confluent Platform](https://docs.confluent.io/platform/current/schema-registry/develop/using.html)
