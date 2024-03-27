import { Kafka, Partitioners } from "kafkajs";
import { SchemaRegistry, SchemaType } from "@kafkajs/confluent-schema-registry";

const kafkaClient = new Kafka({
  brokers: ["localhost:9101"],
  connectionTimeout: 5000, // Increase timeout to 5 seconds (optional)
});
// Connect to Schema Registry container
const schemaRegistry = new SchemaRegistry({
  host: "http://localhost:8081", // Replace with your Schema Registry URL
});
// Define your message schema:
const userSchema = {
  type: "object",
  properties: {
    fullName: { type: "string" },
  },
  required: ["fullName"],
};

//Register the schema with Schema Registry:
const userSchemaId  = await schemaRegistry.register({
  type: SchemaType.JSON,
  userSchema,
  //schema: JSON.stringify(userSchema), // The schema needs to be a string
});

const testMessage = "Test Name";
//Create a producer with a custom partitioner:
const producer = kafkaClient.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

//Produce a message with schema encoding:
await producer.send({
  topic: "test-topic",
  messages: [{ value: testMessage }],
  key: userSchemaId, // Important for retrieving the schema later
});
