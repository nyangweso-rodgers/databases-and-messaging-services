# Avro Schema

## Table Of Contents

# Avro

- **Avro** is flexible due to its support for dynamic typing. It does not require regenerating and recompiling code with every schema update, although doing so can optimize performance.
- One of **Avro's** strengths lies in its ecosystem, especially around languages like Java, where it offers extensive libraries and tools that integrate seamlessly with Java applications.
- Another advantage of **Avro** is its human-readable schema format, which significantly aids in debugging and maintaining the codebase by making it easier to understand the data structures in use. **Avro** supports native Remote Procedure Call (RPC) mechanisms, enabling efficient and direct communication between different components in a distributed system without needing an additional layer for RPC handling.

## Understanding Avro Encoding

- **Avro** serialization encodes data in a compact binary format. This is efficient for storage and transmission, but it’s not human-readable. To interpret this data correctly, you need to deserialize it using Avro deserialization tools or libraries.

## How to Handle Avro Data

- To work with **Avro** data, you have a few options:
  1. **Use Avro Tools**: **Avro** provides command-line tools to convert **Avro** data to a readable format. You can use the Avro tools jar to convert Avro files to JSON. Here’s a basic command:
     ```sh
      java -jar avro-tools.jar tojson yourfile.avro
     ```
  2. **Use a Schema Registry Client**: If you’re using a Schema Registry, you can write code to deserialize **Avro** data using the schema. For example, you can use the Confluent Avro library in Java or Python to deserialize Avro messages.
- To use the `AvroConverter` with **Schema Registry**, you specify the `key.converter` and `value.converter` properties in the worker configuration. You must also add a converter property that provides the Schema Registry URL.
- The following example shows the `AvroConverter` key and value properties that are added to the configuration:
  ```json
    key.converter=io.confluent.connect.avro.AvroConverter
    key.converter.schema.registry.url=http://localhost:8081
    value.converter=io.confluent.connect.avro.AvroConverter
    value.converter.schema.registry.url=http://localhost:8081
  ```
- The **Avro** **key** and **value** converters can be used independently from each other. For example, you may want to use a `StringConverter` for **keys** and the `AvroConverter` or `JsonConverter` for **values**. Independent **key** and **value** properties are shown in the following example:
  ```json
      "key.converter":"org.apache.kafka.connect.storage.StringConverter",
      "value.converter":"io.confluent.connect.avro.AvroConverter",
      "value.converter.schema.registry.url":"http://localhost:8081"
  ```

## How to Handle Avro with Kafka in Python

1. Install Required Packages:
   - You should install `confluent-kafka` for Kafka client functionality.
   - You should also install `fastavro` or `avro-python3` for **Avro** serialization/deserialization.
     ```sh
      pip install confluent-kafka fastavro
     ```
   - Or:
     ```sh
       pip install confluent-kafka avro-python3
     ```
2. Using `confluent-kafka` with **Avro**:
   - The `confluent-kafka` package provides **Kafka producer** and **consumer** functionality.
   - For **Avro** schema management, you typically use `fastavro` or `avro-python3` in conjunction with `confluent-kafka`.

# Setup

## 1. Define Avro Schema

- First, save your Avro schema to a file named `customers-value.avsc`:
  ```avsc
  {
    "type": "record",
    "name": "Customers",
    "namespace": "com.example",
    "fields": [
      { "name": "id", "type": "string" },
      { "name": "first_name", "type": "string", "default": "" },
      { "name": "last_name", "type": "string", "default": "" },
      {
        "name": "StatusEnum",
        "type": {
          "type": "enum",
          "name": "StatusEnum",
          "symbols": ["TRUE", "FALSE"]
        },
        "default": "TRUE"
      },
      { "name": "created_by", "type": "string", "default": "" },
      { "name": "updated_by", "type": "string", "default": "" },
      {
        "name": "created_at",
        "type": {
          "type": "long",
          "logicalType": "timestamp-micros"
        }
      }
    ]
  }
  ```
- **Remarks**:
  - In **Avro schema** definitions, the **namespace** attribute is used to organize and uniquely identify the **schemas** within a larger system. It is similar to the concept of **namespaces** in programming languages like Java or C#. The **namespace** helps to avoid naming conflicts by providing a context for the schema name.


# Resources and Further Reading

1. [avro.apache.org/docs](https://avro.apache.org/docs/1.11.1/specification/_print/)
