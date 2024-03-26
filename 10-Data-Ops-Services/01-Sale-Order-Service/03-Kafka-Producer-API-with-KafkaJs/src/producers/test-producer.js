import { Kafka, Partitioners } from "kafkajs";

const kafkaClient = new Kafka({
  brokers: ["localhost:9101"],
  connectionTimeout: 5000, // Increase timeout to 5 seconds (optional)
});
const producer = kafkaClient.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
//const consumer = kafkaClient.consumer({ groupId: "test-group" });
//const messages = [{ value: "Message 1" }, { value: "Message 2" }];
const message = "Another Test message with KafkaJs!";
const run = async () => {
  try {
    await producer.connect();
    console.log("Connected to Kafka broker successfully.");

    await producer.send({
      topic: "test-topic",
      messages: [{ value: message }],
    });
    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error connecting or sending message:", error);
  } finally {
    await producer.disconnect();
  }
};

run().catch(console.error);
