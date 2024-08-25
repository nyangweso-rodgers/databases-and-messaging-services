# Kafka Connect

## Table Of Contents

# What is Kafka Connect

- **Kafka Connect** is a component of **Apache Kafka** that’s used to perform streaming integration between **Kafka** and other systems such as **databases**, **cloud services**, **search indexes**, **file systems**, and **key-value stores**. It makes it simple to quickly define **connectors** that move large data sets in and out of **Kafka**.

# Configuring Converters (`key` and `value` Converters)

- **Converters** are responsible for the **serialization** and **deserialization** of data flowing between **Kafka Connect** and **Kafka** itself.
- There are a ton of different **converters** available, but some common ones include:
  1. **Avro** - `io.confluent.connect.avro.AvroConverter`: use with **Schema Registry**
  2. **Protobuf** – `io.confluent.connect.protobuf.ProtobufConverter`: use with **Schema Registry**
  3. **String** – `org.apache.kafka.connect.storage.StringConverter`: simple string format
  4. **JSON** – `org.apache.kafka.connect.json.JsonConverter`: (without Schema Registry): use with structured data
  5. **JSON Schema** – `io.confluent.connect.json.JsonSchemaConverter`: use with **Schema Registry**
  6. **ByteArray** – `org.apache.kafka.connect.converters.ByteArrayConverter`: provides a “pass-through” option that does no conversion
- **Remark**:
  - Remember, **Kafka** messages are just pairs of **key/value** bytes, and you need to specify the **converter** for both **keys** and **value**, using the `key.converter` and `value.converter` configuration setting. In some situations, you may use different **converters** for the **key** and the **value**.
  - The `key.converter` and `value.converter` properties are where you specify the type of **converter** to use.

# Avro Schema

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
- **Step 1**: (**Save Your Avro Schema to a File**)
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
- **Step** :(**Register Schema Using Schema Registry REST API**)
  - You can use `curl` to register the schema. Assuming your Schema Registry is running locally on port `8081`, you can execute the following command:
    ```sh
      curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "'"$(cat customers-value.avsc)"'"}' http://localhost:8081/subjects/users.customers-value/versions
    ```
  - This command sends the schema to the Schema Registry and registers it under the **subject** `users.customers-value`.
- **Step** : (**Register Schema Using Python Script**):

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

- **Step** : (**Verify Registration**)
  - After running the script, you can verify that the schema was registered by listing the versions of the subject:
    ```sh
      curl -X GET http://localhost:8081/subjects/users.customers-value/versions
    ```
- **Step** : **Delete Schema**
  - Use a `DELETE` request to remove the old schema version.
  - Here’s an example using `curl`:
    ```sh
      curl -X DELETE http://localhost:8081/subjects/users.customers-value
    ```
  - Confirm that the schema has been deleted by listing the subjects:
    ```sh
      curl http://localhost:8081/subjects
    ```

# JSON Schema

- Example configuration using `JsonSchemaConverter` for the value converter and using `StringConverter` for the key:
  ```json
    key.converter=org.apache.kafka.connect.storage.StringConverter
    value.converter=io.confluent.connect.json.JsonSchemaConverter
    value.converter.schema.registry.url=http://localhost:8081
  ```

# Protobuf Schema

- Example configuration using `ProtobufConverter` for the value converter and using `StringConverter` for the key:
  ```json
    key.converter=org.apache.kafka.connect.storage.StringConverter
    value.converter=io.confluent.connect.protobuf.ProtobufConverter
    value.converter.schema.registry.url=http://localhost:8081
  ```

# Resources And Further Reading

1. [docs.confluent.io - Kafka Connect](https://docs.confluent.io/platform/current/connect/index.html)
