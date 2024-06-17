# Kafka `curl` Commands

# Schema Commands

## List schema types currently registered in Schema Registry

```sh
  curl http://localhost:8081/schemas/types
```

- The response will be one or more of the following. If additional **schema** format plugins are installed, these will also be available.

  ```sh
    ["JSON", "PROTOBUF", "AVRO"]
  ```

## Register a new version of a schema under the subject "`Kafka-key`"

```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-key/versions
```

- Example output:
  ```sh
    {"id":10}
  ```

## Check whether a schema has been registered under subject "`Kafka-key`"

```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-key
```

- Example output:
  ```sh
      {"subject":"Kafka-key","version":1,"id":1,"schema":"\"string\""}
  ```

## Register a new version of a schema under the subject "`Kafka-value`"

```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-value/versions
```

- Example output:
  ```sh
    {"id":10}
  ```

## List all schema versions registered under the subject "`Kafka-value`"

```sh
    curl -X GET http://localhost:8081/subjects/Kafka-value/versions
```

- Example output:
  ```sh
    [1]
  ```

## List all `subjects`

```sh
    curl -X GET http://localhost:8081/subjects
```

- Example output:
  ```sh
    ["Kafka-key","Kafka-value"]
  ```

## Fetch a schema by globally unique ID

```sh
    curl -X GET http://localhost:8081/schemas/ids/10
```

- Example output:
  ```sh
    {"schema":"\"string\""}
  ```

# Register a Schema for a New Kafka Topic

- Use the **Schema Registry** API to add a schema for the topic `test-kafka-topic`.
  ```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\":\"record\",\"name\":\"Payment\",\"namespace\":\"my.examples\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"amount\",\"type\":\"double\"}]}"}' http://localhost:8081/subjects/my-kafka-value/versions
  ```
  - Example output:
    ```sh
      {"id":11}
    ```

# Resources and Further Reading

1. [docs.confluent.io/Schema Registry API Usage Examples for Confluent Platform](https://docs.confluent.io/platform/current/schema-registry/develop/using.html)
