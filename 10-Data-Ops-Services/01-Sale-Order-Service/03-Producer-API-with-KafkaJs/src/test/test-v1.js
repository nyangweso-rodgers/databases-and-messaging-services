import { Kafka, Partitioners } from "kafkajs";
import {
  SchemaRegistry,
  readAVSCAsync,
  SchemaType,
} from "@kafkajs/confluent-schema-registry";
import fs from "fs";

const TOPIC = "sales.sale_order.v1";

const kafkaBrokers = ["localhost:29092"];

// configure Kafka broker
const kafka = new Kafka({
  //clientId: "some-client-id",
  brokers: kafkaBrokers,
  //brokers: ["kafka:9101"],
  connectionTimeout: 5000, // Increase timeout to 5 seconds (optional)
});

// If we use AVRO, we need to configure a Schema Registry which keeps track of the schema
const registry = new SchemaRegistry({
  host: "http://localhost:8081",
});

// create a producer which will be used for producing messages
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

// This function reads the AVSC schema file
const readSchemaFile = async () => {
  try {
    const schemaString = await fs.promises.readFile(
      "../avro/schema.avsc",
      "utf-8"
    );
    const schema = JSON.parse(schemaString); // Parse AVSC schema string to JavaScript object
    console.log("Parsed schema:", schema); // Log the parsed schema
    return schema;
    //return JSON.parse(schema); // Parse AVSC schema string to JavaScript object
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to handle it outside
  }
};

// This function registers the schema with the Schema Registry
const registerSchema = async () => {
  try {
    const schema = await readSchemaFile();
    const { id } = await registry.register({
      subject: TOPIC,
      schema: JSON.stringify(schema), // Convert schema object to JSON string
      type: SchemaType.AVRO,
    });
    return id;
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to handle it outside
  }
};

// register a schema
/*
(async () => {
  try {
    await producer.connect();
    console.log("Producer connected to Kafka broker successfully.");

    const schemaId = await registerSchema();
    console.log("Schema registered successfully with ID:", schemaId);

    // Produce messages here using the registered schema

    await producer.disconnect();
    console.log("Producer disconnected from Kafka broker.");
  } catch (error) {
    console.error("Error:", error);
  }
})();
*/

// push the actual message to kafka
const produceMessageToKafka = async (message) => {
  try {
    await producer.connect();
    console.log("Producer connected to Kafka broker successfully.");

    const schemaId = await registerSchema();
    console.log("Schema registered successfully with ID:", schemaId);

    const outgoingMessage = {
      key: message.id,
      value: await registry.encode(schemaId, message),
    };

    await producer.send({
      topic: TOPIC,
      messages: [outgoingMessage],
    });

    console.log("Message successfully produced to Kafka topic:", TOPIC);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // disconnect the producer
    await producer.disconnect();
    console.log("Producer disconnected from Kafka broker.");
  }
};

// Prepare test data
const testSaleOrderData = {
  customer_id: 10,
  product_id: 89,
  amount: 108,
};

// Call the test function
produceMessageToKafka(testSaleOrderData);
