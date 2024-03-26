import { Kafka, Partitioners } from "kafkajs";

//const TOPIC = "sales.sale_order.v1";
const TOPIC = "test-topic";
const kafkaBrokers = ["kafka:29092"];

// configure Kafka broker
const kafka = new Kafka({
  //clientId: "some-client-id",
  brokers: kafkaBrokers,
  connectionTimeout: 5000, // Increase timeout to 5 seconds (optional)
});

// create a producer which will be used for producing messages
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

// push the actual message to kafka
export const produceMessageToKafka = async (message) => {
  try {
    console.log("Message to be sent to Kafka: ", message); //TODO: for validation only use

    await producer.connect();
    console.log("Producer connected to Kafka broker successfully.");

    await producer.send({
      topic: TOPIC,
      messages: [{ value: message }],
    });

    console.log("Message to be sent:", message);
    console.log("Message successfully produced to Kafka topic:", TOPIC);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // disconnect the producer
    await producer.disconnect();
    console.log("Producer disconnected from Kafka broker.");
  }
};
