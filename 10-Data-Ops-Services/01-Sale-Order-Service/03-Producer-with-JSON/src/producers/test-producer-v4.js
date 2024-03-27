import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({ brokers: ["localhost:9101"] }); // Replace with your Kafka broker URL
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const topic = "test-topic"; // Use the same topic name
const userSchemaId = user.v1;/* Schema ID from schema-registry.js */; // Replace with actual ID

const testMessage = "Test Name";

(async () => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: testMessage }],
      key: userSchemaId, // Important for retrieving the schema later
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    await producer.disconnect();
  }
})();
