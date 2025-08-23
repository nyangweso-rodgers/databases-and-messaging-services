# Apache Kafka with Node.js

## Table Of Contents

## Step : Setting up the Dependencies

- Install the necessary dependencies:
  ```sh
      npm install kafkajs @kafkajs/confluent-schema-registry
  ```

## Step : Configuring Kafka and Schema Registrys

## Step : Creating Kafka Producer and Send Messages to Kafka

### Step .1: Avro Producer

- Create a `customers-avro-producer.js` file with the following:

  ```js
  // customers-avro-producer.js
  import { Kafka, Partitioners } from "kafkajs";
  import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

  const kafka = new Kafka({
    clientId: "customers-avro-producer",
    brokers: ["kafka:29092"],
  });

  const registry = new SchemaRegistry({
    host: "http://schema-registry:8081",
  });

  // Creating the Kafka Producer
  const customerProducer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner, // Use the legacy partitioner
  });

  // Sending Messages to Kafka
  export async function sendCustomerMessage() {
    try {
      const customerMessage = {
        id: "abc", // String
        first_name: "Rodgers", // String
        last_name: "Omondi", // String
        status: "true", // String, not boolean
        created_at: 1724763954000, // Timestamp in milliseconds, should be a long
        updated_at: 1724763954000, // Timestamp in milliseconds, should be a long
        created_by: "Rodgers", // String
        updated_by: "Rodgers", // String
      };
      console.log("Sending Customer Avro Nessage:", customerMessage);

      const topic = "users.customers";
      const id = await registry.getLatestSchemaId("users.customers-value"); // Replace with your schema name
      const encodedMessage = await registry.encode(id, customerMessage);

      const result = await customerProducer.send({
        topic: topic,
        messages: [
          {
            key: "message-key",
            value: encodedMessage,
          },
        ],
      });
      console.log("Customer Message successfully sent to kafka:", result);
    } catch (error) {
      console.error("Error sending customer message to kafka:", error);
    }
  }
  // Connect and Disconnect functions
  export async function connectProducer() {
    await customerProducer.connect();
  }

  export async function disconnectProducer() {
    await customerProducer.disconnect();
  }
  ```

- Update `app.js` File:

  ```js
  // app.js
  import express from "express";
  import dotenv from "dotenv";
  //import "./src/app/consumer/customers-avro-consumer.js";
  import {
    sendCustomerMessage,
    connectProducer,
    disconnectProducer,
  } from "./src/app/producer/customers-avro-producer.js";

  // Load environment variables from .env file
  dotenv.config();

  const app = express();

  // Middleware to parse JSON
  app.use(express.json());

  // start the server
  const port = process.env.APP_PORT || 3004;

  const start = async () => {
    try {
      // Connect to the producer and send the message when the server starts
      await connectProducer();
      console.log("Kafka Producer Connected");
      await sendCustomerMessage();

      // Start the server
      app.listen(port, () => {
        console.log(
          `Node.js Kafka Server is running on http://localhost:${port}`
        );
      });

      // Disconnect the producer when the server stops
      process.on("SIGINT", async () => {
        await disconnectProducer();
        process.exit();
      });
    } catch (error) {
      console.log("Error Starting Node.js Kafka Server:", error);
    }
  };

  start();
  ```

## Step : Creating Kafka Consumer

### Step : Avro Consumer

- Create `customers-avro-consumer.js` to consumer Kafka Avro Messages:

  ```js
  // customers-avro-consumer.js
  import { Kafka } from "kafkajs";
  import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

  const kafka = new Kafka({
    clientId: "customers-avro-consumer",
    brokers: ["kafka:29092"],
  });

  const registry = new SchemaRegistry({
    host: "http://schema-registry:8081",
  });

  // Creating the Kafka Consumer
  const customerConsumer = kafka.consumer({
    groupId: "customers-avro-group",
  });

  export const runConsumer = async () => {
    try {
      await customerConsumer.connect();
      console.log("Kafka Consumer connected");

      // Subscribe to the relevant topic
      await customerConsumer.subscribe({
        topic: "users.customers",
        fromBeginning: true,
      });

      // Consume messages from the topic
      await customerConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            // Decode the Avro message using the Schema Registry
            const decodedValue = await registry.decode(message.value);
            console.log(`Received message: ${JSON.stringify(decodedValue)}`);
          } catch (error) {
            console.error("Error decoding message:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error in Kafka Consumer:", error);
    }
  };
  ```

- Update `app.js` file:

  ```js
  // app.js
  import express from "express";
  import dotenv from "dotenv";

  import { runConsumer } from "./src/app/consumer/customers-avro-consumer.js";

  // Load environment variables from .env file
  dotenv.config();

  const app = express();

  // Middleware to parse JSON
  app.use(express.json());

  // start the server
  const port = process.env.APP_PORT || 3004;

  const start = async () => {
    try {
      // Start the server
      // Start the Kafka Consumer
      runConsumer();
      app.listen(port, () => {
        console.log(
          `Node.js Kafka Server is running on http://localhost:${port}`
        );
      });
    } catch (error) {
      console.log("Error Starting Node.js Kafka Server:", error);
    }
  };

  start();
  ```

# Resources and Further Reading

1. [Medium - Building a Kafka Producer with Confluent Kafka and Schema Registry Integration using Node.js and KafkaJS](https://tenusha.medium.com/building-a-kafka-producer-with-confluent-kafka-and-schema-registry-integration-using-node-js-ad571b1ccb)
