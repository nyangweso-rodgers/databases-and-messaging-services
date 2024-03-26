import { Kafka, Partitioners } from "kafkajs";
import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";

const kafkaClient = new Kafka({
  brokers: ["localhost:9101"],
});

const schemaRegistry = new SchemaRegistry({
  host: "http://localhost:8081",
});

const producer = kafkaClient.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const run = async () => {
  await producer.connect();
  
  const schema = {
    type: "record",
    name: "MyMessage",
    fields: [
      { name: "value", type: "string" },
    ],
  };

  // Register the schema and get back an ID
  const { id: schemaId } = await schemaRegistry.register({
    subject: "test-topic-value",
    schema: JSON.stringify(schema),
  });

  // Encode the message using the schema ID
  const encodedMessage = await schemaRegistry.encode(schemaId, { value: "Message with schema!" });

  await producer.send({
    topic: "test-topic",
    messages: [{ value: encodedMessage }],
  });

  console.log("Message sent successfully!");

  await producer.disconnect();
};

run().catch(console.error);