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

# What are Subjects

- **Subjects**: Logical groupings of **schemas**, usually corresponding to **Kafka topics**.

# How to use the schema registry

## Schema Registry and Protobuf

- **Schema Registry** provides a **serializer** and **deserializer** for **Protobuf**, called `KafkaProtobufSerializer` and `KafkaProtobufDeserializer`.
- The job of this **serializer** is to convert the Java object to a **protobuf** binary format before the producer writes the message to Kafka.
- The additional job of the **serialiser** is to check whether the **protobuf schema** exists in the **Schema Registry**. If not, it will write the **schema** to **Schema Registry** and it will write the schema id to the message (at the beginning of the message). Then, when the **Kafka** record reaches the consumer, the consumer will use KafkaProtobufDeserializer to fetch the schema from the Schema Registry based on the schema id from the message. Once the schema is fetched, the KafkaProtobufDeserializer will use it to deserialize the message. This way the consumer doesn’t need to know the schema in advance to be able to consume messages from Kafka.

# Resources and Further Reading

1. [docs.confluent.io - schema-registry](https://docs.confluent.io/platform/current/schema-registry/index.html)