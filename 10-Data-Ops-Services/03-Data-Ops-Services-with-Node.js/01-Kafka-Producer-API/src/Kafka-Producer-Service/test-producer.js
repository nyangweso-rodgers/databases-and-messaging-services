//import kafkaNode from "kafka-node";
import kafka from "kafka-node";

const kafkaClient = new kafka.KafkaClient({ kafkaHost: "kafka:29092" });
const producer = new kafka.Producer(kafkaClient);

producer.on("ready", () => {
  console.log("Kafka producer is ready.");
});

producer.on("error", (err) => {
  console.error("Error in Kafka producer:", err);
});

//module.exports = producer;
export default producer;