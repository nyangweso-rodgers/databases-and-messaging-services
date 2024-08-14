# Running Kafka Connect in Docker

## Table Of Contents

# Kafka Connect Images on Docker Hub

- **Confluent** maintains its own image for **Kafka Connect**, `cp-kafka-connect-base`, which provides a basic **Connect** worker to which you can add your desired JAR files for sink and source connectors, single message transforms, and converters.

# Image Details

- For example, these are the bare minimum variables necessary to get a Connect Distributed Server running, but assumes it is connected to Kafka cluster with at least three brokers (replication factor for the three Connect topics). Additional variables for replication factor of the three Connect topics can be added, as described below for testing against less than three brokers.
  1. `CONNECT_BOOTSTRAP_SERVERS`
  2. `CONNECT_GROUP_ID`
  3. `CONNECT_KEY_CONVERTER`
  4. `CONNECT_VALUE_CONVERTER`
  5. `CONNECT_CONFIG_STORAGE_TOPIC`
  6. `CONNECT_OFFSET_STORAGE_TOPIC`
  7. `CONNECT_STATUS_STORAGE_TOPIC`

## Step 3 Get available Connector Plugins

```sh
    curl localhost:8083/connector-plugins | json_pp
```

- If you need to check the list of available **plugins** you should hit `localhost:8083/connector-plugins`
  ```sh
      curl localhost:8083/connector-plugins
  ```

## Step : Get Ative Connectors

- `localhost:8083/connectors`, will give you the list of active connectors.
  ```sh
      curl localhost:8083/connectors
  ```

## Resources and Further Reading
