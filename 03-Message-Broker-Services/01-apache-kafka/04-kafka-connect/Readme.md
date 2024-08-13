# Kafka Connect

## Table Of Contents

# What is Kafka Connect

- **Kafka Connect** is a component of **Apache Kafka** that’s used to perform streaming integration between **Kafka** and other systems such as **databases**, **cloud services**, **search indexes**, **file systems**, and **key-value stores**. It makes it simple to quickly define **connectors** that move large data sets in and out of **Kafka**.

# How Kafka Connect Works

- **Kafka Connect** runs in its own process, separate from the **Kafka brokers**. It is distributed, scalable, and fault tolerant, giving you the same features you know and love about Kafka itself.

# Types of Connectors

- **Kafka Connect** provides two types of connectors.

  1. **Source connectors**: poll data from external sources such as databases, message queues, or other applications. For instance, a Source Connector for a MySQL database reads changes in the database table and converts them into Connect Records, which are then sent to the Kafka cluster.
  2. **Sink connectors**: save data to the destination or sink, such as Hadoop Distributed File System (HDFS), Amazon Simple Storage Service (S3), or Elasticsearch.

- **Remarks**:
  - **Confluent** offers several [pre-built connectors](https://www.confluent.io/product/connectors/?_ga=2.113725121.770498573.1720359767-234518971.1709664712&_gl=1*1owcoes*_gcl_au*OTIxNjA2MDMuMTcxNzYxMTg4NA..*_ga*MjM0NTE4OTcxLjE3MDk2NjQ3MTI.*_ga_D2D3EGKSGD*MTcyMDM1OTc2Ny45NS4xLjE3MjAzNjAyMDAuNTkuMC4w) that can be used to stream data to or from commonly used systems, such as relational databases or HDFS. In order to efficiently discuss the inner workings of Kafka Connect, it is helpful to establish a few major concepts.

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

## 1. Using String Converter

- Here’s an example of using the **String converter**. Since it’s just a **string**, there’s no **schema** to the data, and thus it’s not so useful to use for the **value**:
  ```json
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
  ```

## 2. Using Avro Converter

- Some **converters** have additional configuration. For **Avro**, you need to specify the **Schema Registry**.
- When you specify converter-specific configurations, always use the `key.converter.` or `value.converter.` prefix. For example, to use **Avro** for the message payload, you’d specify the following:
  ```json
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "http://schema-registry:8081"
  ```

## 3. Using JSON Converter

- For **JSON**, you need to specify if you want **Kafka Connect** to embed the **schema** in the **JSON** itself.
- Whilst **JSON** does not by default support carrying a **schema**, **Kafka Connect** supports two ways that you can still have a declared **schema** and use **JSON**. The first is to use **JSON Schema** with the **Confluent Schema Registry**. If you cannot use the **Schema Registry** then your second (less optimal option) is to use **Kafka Connect’s** support of a particular structure of **JSON** in which the **schema** is embedded. The resulting data size can get large as the **schema** is included in every single message along with the **schema**.
- If you’re setting up a **Kafka Connect source** and want **Kafka Connect** to include the **schema** in the message it writes to **Kafka**, you’d set:
  ```json
    "value.converter":"org.apache.kafka.connect.json.JsonConverter",
    "value.converter.schemas.enable":true
  ```
- The resulting message to **Kafka** would look like the example below, with **schema** and **payload** top-level elements in the **JSON**:
  ```json
  {
    "schema": {
      "type": "struct",
      "fields": [
        {
          "type": "int64",
          "optional": false,
          "field": "registertime"
        },
        {
          "type": "string",
          "optional": false,
          "field": "userid"
        },
        {
          "type": "string",
          "optional": false,
          "field": "regionid"
        },
        {
          "type": "string",
          "optional": false,
          "field": "gender"
        }
      ],
      "optional": false,
      "name": "ksql.users"
    },
    "payload": {
      "registertime": 1493819497170,
      "userid": "User_1",
      "regionid": "Region_5",
      "gender": "MALE"
    }
  }
  ```
- **Note** the size of the message, as well as the proportion of it that is made up of the **payload** vs. the **schema**. Considering that this is repeated in every message, you can see why a serialisation format like **JSON Schema** or **Avro** makes a lot of sense, as the **schema** is stored separately and the message holds just the payload (and is compressed at that).
- **Remark**:
  - If you’re consuming **JSON** data from a **Kafka topic** into a **Kafka Connect sink**, you need to understand how the **JSON** was serialised. If it was with **JSON Schema serialiser**, then you need to set **Kafka Connect** to use the **JSON Schema converter** (`io.confluent.connect.json.JsonSchemaConverter`). If the **JSON** data was written as a plain **string**, then you need to determine if the data includes a nested **schema**. If it does—and it’s in the same format as above, not some arbitrary schema-inclusion format—then you’d set:
    ```json
      "value.converter":"org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable":true
    ```
  - However, if you’re consuming **JSON** data and it doesn’t have the **schema/payload** construct, such as this sample:
    ```json
    {
      "registertime": 1489869013625,
      "userid": "User_1",
      "regionid": "Region_2",
      "gender": "OTHER"
    }
    ```
  - …you must tell **Kafka Connect** not to look for a **schema** by setting `schemas.enable:false`:
    ```json
      "value.converter":"org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable":false
    ```
  - As before, remember that the **converter** configuration option (here, `schemas.enable`) needs the prefix of `key.converter` or `value.converter` as appropriate.

# Avro Schema

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
      key.converter=org.apache.kafka.connect.storage.StringConverter
      value.converter=io.confluent.connect.avro.AvroConverter
      value.converter.schema.registry.url=http://localhost:8081
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
