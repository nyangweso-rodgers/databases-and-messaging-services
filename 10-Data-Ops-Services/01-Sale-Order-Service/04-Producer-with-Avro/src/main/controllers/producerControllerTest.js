import { Kafka, Partitioners } from "kafkajs";
import {
  //SchemaRegistry,
  //readAVSCAsync,
  //SchemaType,
  KafkaAvroSerializer
} from "@kafkajs/confluent-schema-registry";
import fs from "fs";

const TOPIC = "sales.sale_order.v1";

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

/*
// This function reads the AVSC schema file
const readSaleOrderAvroSchema = async () => {
  try {
    const schemaString = await fs.promises.readFile(
      "../../avro/saleOrderSchema.avsc",
      "utf-8"
    );
    const schema = JSON.parse(schemaString); // Parse AVSC schema string to JavaScript object
    
    const schema = await readAVSCAsync("../../avro/saleOrderSchema.avsc");
    console.log("Parsed schema:", schema); // Log the parsed schema
    return schema;
    //return JSON.parse(schema); // Parse AVSC schema string to JavaScript object
  } catch (error) {
    console.log(error);
    throw error; // Throw the error to handle it outside
  }
};

// This function registers the schema with the Schema Registry
const registerSaleOrderSchema = async () => {
  try {
    const schema = await readSaleOrderAvroSchema();
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
*/
/*
const registerSaleOrderSchema = async () => {
  try {
    const schema = await readAVSCAsync("../../avro/saleOrderSchema.avsc");
    const { id } = await registry.register(schema);
    console.log("Message Schema: ", schema);
    return id;
  } catch (error) {
    console.log(error);
  }
};
*/

let schemaId; // Variable to store retrieved schema ID

export const produceMessageToKafka = async (kafkaMessage) => {
  try {
    // Retrieve schema ID from Schema Registry (assuming it's already registered)
    schemaId = schemaId || (await getSchemaId());

    const validate = avro.parse(schemaId); // Use schema ID for validation
    const validMessage = validate(message); // Validates and returns validated data

    // Serialize message to Avro format
    const serializedMessage = avro.encode(schemaId, validMessage); // Use schema ID for encoding

    await producer.connect();
    //console.log("Producer connected to Kafka broker successfully.");

    //const versionInfo = await registry.getLatestVersion({ subject: TOPIC });
    const versionInfo = await registry.getSchemaById({ id: schemaId });
    const id = versionInfo.id;

    // Send the message to Kafka
    await producer.send({
      topic: TOPIC,
      messages: [
        {
          value: serializedMessage,
          key: schemaId, // Include schema ID for compatibility
        },
      ],
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

async function getSchemaId() {
  try {
    const { id } = await registry.getById(TOPIC); // Get schema ID by topic name
    console.log("Retrieved Schema ID:", id);
    return id;
  } catch (error) {
    console.error("Error retrieving schema ID:", error);
    throw error; // Re-throw to handle error in router
  }
}
