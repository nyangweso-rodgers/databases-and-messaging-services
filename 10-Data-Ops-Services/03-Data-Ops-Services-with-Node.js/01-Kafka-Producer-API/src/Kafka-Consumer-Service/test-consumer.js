
//import kafkaNode from "kafka-node";
import kafka from "kafka-node";

const kafkaClient = new kafka.KafkaClient({ kafkaHost: "kafka:29092" });

const consumer = new kafka.Consumer(kafkaClient, [
  { topic: "test-topic", partition: 0 },
]);

consumer.on("message", (message) => {
  console.log("Received message from Kafka:", message.value);
});

consumer.on("error", (err) => {
  console.error("Error in Kafka consumer:", err);
});

//module.exports = consumer;
export default consumer;