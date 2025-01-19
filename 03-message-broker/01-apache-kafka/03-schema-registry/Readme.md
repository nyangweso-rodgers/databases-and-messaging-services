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

# How Kafka Schema Registry works?

- A **Kafka schema registry** resides in a **Kafka cluster**. It can be plugged into the **Kafka** configuration. The configuration stores the schema and distributes it to the **producer** and **consumer** for **serialization** and **deserialization**. Hosting schemas like this allows **schema evolution**, making message transfer robust.
- Without **schemas**, there would be no easy way to establish a contract ensuring messages sent by the **producer** match the format expected by the **consumer**.

# Serialization & Deserialization

- _Serialization_ & **_Deserialization_** involves converting data into a byte format for transfer over the network or saving to disk (**serialization**) and converting it back into a usable format (**deserialization**).
- The **Kafka schema registry** supports three **serialization** formats:
  1. Avro (recommended for most use cases)
  2. JSON
  3. Google Protobuf

# Schema Compatibility

- You can configure different types of **schema compatibility**, which are applied to a **subject** when a new schema is registered. The Schema Registry supports the following compatibility types:
  1. `BACKWARD` (default) - **Consumers** using the new schema (for example, version 10) can read data from **producers** using the previous schema (for example, version 9).
  2. `BACKWARD_TRANSITIVE` - **Consumers** using the new schema (for example, version 10) can read data from **producers** using all previous schemas (for example, versions 1-9).
  3. `FORWARD` - **Consumers** using the previous schema (for example, version 9) can read data from **producers** using the new schema (for example, version 10).
  4. `FORWARD_TRANSITIVE` - **Consumers** using any previous schema (for example, versions 1-9) can read data from producers using the new schema (for example, version 10).
  5. `FULL` - A new schema and the previous schema (for example, versions 10 and 9) are both backward and forward compatible with each other.
  6. `FULL_TRANSITIVE` - Each schema is both backward and forward compatible with all registered schemas.
  7. `NONE` - No schema compatibility checks are done.
- Compatibility uses and constraints:
  1. A **consumer** that wants to read a topic from the beginning (for example, an AI learning process) benefits from backward compatibility. It can process the whole topic using the latest schema. This allows producers to remove fields and add attributes.
  2. A real-time consumer that doesn’t care about historical events but wants to keep up with the latest data (for example, a typical streaming application) benefits from forward compatibility. Even if producers change the schema, the consumer can carry on.
  3. Full compatibility can process historical data and future data. This is the safest option, but it limits the changes that can be done. This only allows for the addition and removal of optional fields.
- Remark:
  - To set the compatibility type for a subject, make a PUT request to `/config/<subject-name>` with the specific compatibility type:

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

# Use Schema Registry API with `curl` Commands

- Use `curl` Commands to interact with the Schema Registry [Schema Registry API](https://docs.confluent.io/platform/current/schema-registry/develop/api.html#schemaregistry-api)

## Command 1: List schema types currently registered in Schema Registry

- verify which **schema types** are currently registered with **Schema Registry** by:

  ```sh
    curl -X GET http://localhost:8081/schemas/types
  ```

- Example Result:
  ```sh
    ["JSON", "PROTOBUF", "AVRO"]
  ```

## Command 2: Register a New Version of a Schema under key or value subjects

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

## Command 3: Register a Schema for a new Kafka Topic

- Suppose we have a `users-customers-v1` topic already registered, we can use the [Schema Registry API]() to add a schema for the topic by:

  1. For **Avro**, register the schema using:
     ```sh
      curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\":\"record\",\"name\":\"Customers\",\"namespace\":\"my.examples\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"first_name\",\"type\":\"string\"}, {\"name\":\"last_name\",\"type\":\"string\"}, {\"name\":\"status\",\"type\":{\"type\":\"enum\",\"name\":\"StatusEnum\",\"symbols\":[\"TRUE\",\"FALSE\"]}}, {\"name\":\"created_by\",\"type\":\"string\"}, {\"name\":\"updated_by\",\"type\":\"string\"},{\"name\":\"created_at\",\"type\":\"long\"}, {\"name\":\"updated_at\",\"type\":\"long\"}]}"}' http://localhost:8081/subjects/users.customers.v1-value/versions
     ```
  2. For **Protobuf** register schema by:
     ```sh
      curl -X POST -H "Content-Type: application/json" http://localhost:8081/subjects/users.customers.protobuf.v1-value/versions -d '{"schemaType": "PROTOBUF","schema": "syntax = \"proto3\"; message Customers { string id = 1; string first_name = 2; string last_name = 3; bool status = 4; string created_by = 5; string updated_by = 6; google.protobuf.Timestamp created_at = 7; google.protobuf.Timestamp updated_at = 8; }"}'
     ```
  3. For **JSON Schema**

- Example output:
  ```sh
    {"id":1}
  ```

## Command 4: List all schema versions Registered under the key or value subject

- List all schema version registered under the **subject** "`users-customers-v1-value`" **value** by:

  ```sh
      curl -X GET http://localhost:8081/subjects/users-customers-v1-value/versions
  ```

  - Example output:
    ```sh
      [1]
    ```

- Check whether a **schema** has been registered under subject "`Kafka-key`" by:

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

## Command 5: List All Subjects

- The following API call lists all schema subjects.
  ```sh
    curl -X GET http://localhost:8081/subjects
  ```
- Example Result:
  ```sh
    ["users.customers-value","users.customers.v1-value","users.customers.v1-value-protobuf"]
  ```
- **Remark**:
  - You can use the `deleted` flag at the end of the request to list all **subjects**, including **subjects** that have been **soft-deleted** (`?deleted=true`).
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

## Step 5: Delete Schema

- Use a `DELETE` request to remove the old schema version.
- Example:
  ```sh
    curl -X DELETE http://localhost:8081/subjects/users.customers.v1-value
  ```
- **Remark**:
  - After deleting a schema, you confirm that the schema has been deleted by listing the **subjects**:
  ```sh
    curl http://localhost:8081/subjects
  ```
  - Delete Version 1 of Schema Registered under subject `users.customers.v2-value`
    ```sh
      curl -X DELETE http://localhost:8081/subjects/users.customers.v2-value/versions/1
    ```
  - Delete the most recently registered schema under subject `users.customers.v2-value`
    ```sh
      curl -X DELETE http://localhost:8081/subjects/users.customers.v2-value/versions/latest
    ```
  - Delete all schema versions registered under the subject `users.customers.v2-value`
    ```sh
      curl -X DELETE http://localhost:8081/subjects/users.customers.v2-value
    ```

# Resources and Further Reading

1. [docs.confluent.io - schema-registry](https://docs.confluent.io/platform/current/schema-registry/index.html)
2. [Schema Registry API Usage Examples for Confluent Platform](https://docs.confluent.io/platform/current/schema-registry/develop/using.html)
