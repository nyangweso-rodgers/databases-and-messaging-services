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

## Register a new version of a schema under the subject "`Kafka-value`"

```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"string\"}"}' http://localhost:8081/subjects/Kafka-value/versions
```

## List all subjects

```sh
    curl -X GET http://localhost:8081/subjects
```

- output:
  ```sh
    ["Kafka-key","Kafka-value"]
  ```

## List all schema versions registered under the subject "`Kafka-value`"

```sh
    curl -X GET http://localhost:8081/subjects/Kafka-value/versions
```

- output:
  ```sh
    [1]
  ```
