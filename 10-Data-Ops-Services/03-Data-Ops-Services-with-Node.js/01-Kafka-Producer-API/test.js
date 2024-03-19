import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-producer",
  brokers: ["kafka:29092"], // Use container name or hostname
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });
};

run().catch(console.error);