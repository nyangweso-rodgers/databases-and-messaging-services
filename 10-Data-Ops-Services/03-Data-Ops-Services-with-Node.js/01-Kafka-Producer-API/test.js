import { Partitioners, Kafka } from "kafkajs";

const kafka = new Kafka({
  //clientId: "my-producer",
  brokers: ["kafka:9101"], // Use container name or hostname
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Test message 1" }],
    //key: "message-key",
  });
};

run().catch(console.error);
