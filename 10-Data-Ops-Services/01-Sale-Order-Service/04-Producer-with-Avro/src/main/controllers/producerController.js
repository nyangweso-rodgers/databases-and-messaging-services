import { Kafka, Partitioners } from "kafkajs";

import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

const TOPIC = "my-kafka";

const kafkaBrokers = ["kafka:29092", "localhost:9101"];

// configure Kafka broker
const kafka = new Kafka({
  //clientId: "some-client-id",
  brokers: kafkaBrokers,
  connectionTimeout: 5000, // Increase timeout to 5 seconds (optional)
});

// Initialize Schema Registry
const registry = new SchemaRegistry({
  host: "http://localhost:8081",
});

// create a producer which will be used for producing messages
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

// Retrieve schema ID from the Schema Registry
const getSchemaId = async () => {
  try {
    const subject = "my-kafka-value"; // The subject name associated with your schema
    const { id } = await registry.register({ subject });
    return id;
  } catch (error) {
    console.log("Error registering schema:", error);
    throw error;
  }
};

// Validate data against the retrieved schema
const validateData = async () => {
  try {
    // Retrieve the schema ID
    const schemaId = await getSchemaId();
    console.log("Retrieved schema ID:", schemaId);

    // Your validation logic here using the retrieved schema ID and the message data
    // For example, you can use a library like avro-js or avsc to validate the message against the schema
    // If the validation fails, throw an error

    // If validation is successful, return true
    return true;
  } catch (error) {
    console.error("Error validating data:", error);
    throw error;
  }
};

// Publish message to Kafka topic
export const produceMessageToKafka = async (message) => {
  try {
    // Validate data against the schema
    const isValid = await validateData(message);
    if (!isValid) {
      throw new Error("Data validation failed");
    }

    // Connect to Kafka
    await producer.connect();
    console.log("Producer connected to Kafka broker successfully.");

    // Publish message to Kafka topic
    await producer.send({
      topic: TOPIC,
      messages: [{ value: message }],
    });

    console.log("Message successfully produced to Kafka topic:", TOPIC);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Disconnect the producer
    await producer.disconnect();
    console.log("Producer disconnected from Kafka broker.");
  }
};
