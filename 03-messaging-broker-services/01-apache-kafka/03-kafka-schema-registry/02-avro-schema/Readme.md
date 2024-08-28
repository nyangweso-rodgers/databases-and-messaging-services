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

## Step 2.1. Verify Registered Schema Types.

- verify which **schema types** are currently registered with **Schema Registry** by:
  ```sh
    curl http://localhost:8081/schemas/types
  ```
- The response will be one or more of the following. If additional schema format plugins are installed, these will also be available.
  ```sh
    # output
    ["JSON","PROTOBUF","AVRO"]
  ```

## Step 2.2: Register Schema Using Schema Registry REST API

- You can use `curl` to register the schema. Assuming your Schema Registry is running locally on port `8081`, you can execute the following command:
  ```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "'"$(cat customers-value.avsc)"'"}' http://localhost:8081/subjects/users.customers-value/versions
  ```
- This command sends the schema to the Schema Registry and registers it under the **subject** `users.customers-value`.

## Step 2.3: Register Schema Using Python Script

- Create a python script to register the schema by:

  ```py
    import json
    import requests

    # Read the schema file
    with open('../../../schema/customers-avro.avsc', 'r') as file:
        schema = file.read()

    # Create the payload
    payload = {
        "schema": schema
    }

    # Send the request
    response = requests.post(
        'http://localhost:8081/subjects/users.customers-value/versions',
        headers={'Content-Type': 'application/vnd.schemaregistry.v1+json'},
        data=json.dumps(payload)
    )

    print(response.status_code, response.text)
  ```

## Step 3: Verify Registration

- After running the script, you can verify that the schema was registered by listing the versions of the subject:
  ```sh
    curl -X GET http://localhost:8081/subjects/users.customers-value/versions
  ```

## 4. Fetch a chema by globally Unique ID

- You can fetch a schema by global unique id by:

  ```sh
      curl -X GET http://localhost:8081/schemas/ids/10
  ```

## Step 5: Delete Schema

- Use a `DELETE` request to remove the old schema version.
- Here’s an example using `curl`:
  ```sh
    curl -X DELETE http://localhost:8081/subjects/users.customers-value
  ```
- Confirm that the schema has been deleted by listing the subjects:
  ```sh
    curl http://localhost:8081/subjects
  ```

# Resources and Further Reading

1. [avro.apache.org/docs](https://avro.apache.org/docs/1.11.1/specification/_print/)
