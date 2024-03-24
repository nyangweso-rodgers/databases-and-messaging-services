# Setting Schema Registry with Docker

## Table Of Contents

# Add Schema Registry to `docker-compose.yml` File

- Add the following to the `docker-compose.yml` file with `zookeeper` and `Kafka` defined:
  ```yml
  #docker-compose.yml
  version: "1"
  services:
    schema-registry:
    image: confluentinc/cp-schema-registry:7.3.0
    #hostname: schema-registry
    container_name: schema-registry
    depends_on:
      - kafka
    ports:
      - "8081:8081"
    environment:
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: "kafka:8098"
      #SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081
  ```

# Setting Kafka Producer with Schema Registry

# Setting Kafka Producer with Schema Registry using Node.js and `kafkajs`

## Step #1: Setting up the Dependencies

- Install the following Dependencies in the project root directory:
  ```sh
    npm i kafkajs @kafkajs/confluent-schema-registry
  ```

## Step #2: Configuring Kafka and Schema Registry

- set up the Kafka client and the **Schema Registry**. Import the required dependencies and define the Kafka client and Schema Registry configurations:

  ```js
  //
  const { Kafka } = require("kafkajs");
  const { SchemaRegistry } = require("@kafkajs/confluent-schema-registry");

  const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:29092"], // Replace with your Kafka broker(s) configuration
  });

  const registry = new SchemaRegistry({
    host: "http://localhost:8081", // Replace with your Schema Registry URL
  });
  ```

## Step #3: Creating the Kafka Producer

- Create Kafka Producer using the configured Kafka client:
  ```sh
    const producer = kafka.producer();
  ```
- The producerobject will be used to send messages to Kafka.

## Step #4: Sending Messages to Kafka

- Let’s add a new `sendMessage` method that sends a message to a Kafka topic:

# Resources

1. [confluentinc/cp-schema-registry Docker Image](https://hub.docker.com/r/confluentinc/cp-schema-registry)
