# Schema Registry

## List schema types currently registered in Schema Registry

```sh
  curl http://localhost:8081/schemas/types
```

- The response will be one or more of the following. If additional schema format plugins are installed, these will also be available.

  ```sh
    ["JSON", "PROTOBUF", "AVRO"]
  ```

##

```sh
    curl -X GET http://localhost:8081/schemas/ids/1
```

```sh
    curl -X GET http://localhost:8081/schemas/subjects/order-avro-value/versions/1
```

## Register a new version of a schema under the subject "`Kafka-key`"

```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-key/versions
```

- Example output:
  ```sh
    {"id":10}
  ```

## Register a new version of a schema under the subject "`Kafka-value`"

```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-value/versions
```

- Example output:
  ```sh
    {"id":10}
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

## List all schema versions registered under the subject "`Kafka-value`"

```sh
    curl -X GET http://localhost:8081/subjects/Kafka-value/versions
```

- Example output:
  ```sh
    [1]
  ```

## Check whether a schema has been registered under subject "`Kafka-key`"

```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-key
```

- Example output:
  ```sh
      {"subject":"Kafka-key","version":1,"id":1,"schema":"\"string\""}
  ```

# Register a Schema for a new topic, `test-kafka-topi`

- Step 1: Create a new kafka topic, `my-kafka` if it doesn't already exist
  ```sh
    docker exec -it kafka bash
    # Create a new kafka topic
    kafka-topics --create --bootstrap-server kafka:29092 --partitions 1 --replication-factor 1 --topic my-kafka
    # confirm the listed kafka Topics
    kafka-topics --list --bootstrap-server kafka:29092
  ```
- Step 2: Use the Schema Registry API to add a schema for the topic `my-kafka`.
  ```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\":\"record\",\"name\":\"Payment\",\"namespace\":\"my.examples\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"amount\",\"type\":\"double\"}]}"}' http://localhost:8081/subjects/my-kafka-value/versions
  ```
  - Example output:
    ```sh
      {"id":11}
    ```
- Step 3: Update compatibility requirements on a subject
  ```sh
    curl -X PUT -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"compatibility": "FULL"}' http://localhost:8081/config/my-kafka-value
  ```
  - Example output:
    ```sh
      {"compatibility":"FULL"}
    ```
- Step 4: Get compatibility requirements on a subject
  ```sh
    curl -X GET http://localhost:8081/config/my-kafka-value
  ```
  - Example output:
    ```sh
      {"compatibility":"FULL"}
    ```
- Step 5: Delete all schema versions registered under the subject “Kafka-value”
  ```sh
    curl -X DELETE http://localhost:8081/subjects/Kafka-value
  ```

# Resources

1. [docs.confluent.io/Schema Registry API Usage Examples for Confluent Platform](https://docs.confluent.io/platform/current/schema-registry/develop/using.html)
