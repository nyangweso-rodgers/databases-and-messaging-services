# Kafka with Node.js

## Table Of Contents

# Node.js Libraries for Apache Kafka

- `Kafka-node` and `KafkaJS` are both popular libraries for interacting with **Apache Kafka** in Node.js environments.

# `kafka-node` for Kafka

- `kafka-node` is a popular Node.js **Kafka client** for providing a high-level API for both **producing** and **consuming messages**.

## Step #1: Create and Initialize a Node.js Project

```sh
  mkdir my-project
  cd my-project
  npm init -y
```

## Step #2: Install `kafka-node` using `npm`

```sh
  npm i kafka-node
```

## Step #3: Setup a Connection to Kafka

- Create an `index.js` file with the following:

  - Establish a connection to Kafka using `kafka-node`

  ```javascript
  import Kafka from "kafka-node";

  const user = new kafka.KafkaClient({
    kafkaHost: "kafka:29092",
  });

  user.on("ready", () => {
    console.log("Kafka connected");
  });

  user.on("error", (error) => {
    console.error("Error connecting to Kafka:", error);
  });
  ```

- Here:
  - we initiate a `KafkaClient` object and pass it the connection details for our **Kafka broker**. The `kafkaHost` parameter states the `hostname` and `port` of the broker we want to connect with.
  - We also add two event listeners to the `user` object. The ready event is emitted when the `user` establishes a connection to **Kafka**, the error event is emitted when an error happens when connecting to Kafka.

## Step #4: Publishing Messages to Kafka using the `publish()` method

- Publishing messages to **Kafka** entails setting up a **Kafka producer** and sending messages to a **Kafka topic**. **Producers** publish messages to **topics**, and **consumers** subscribe to topics to receive messages in Kafka.
- To publish messages to **Kafka** using `kafka-node`, you use the `Producer` class and its `send()` method.

  ```javascript
  // producer with kafka-node

  import Kafka from "kafka-node";

  const user = new Kafka.KafkaClient({
    kafkaHost: "kafka:29092",
  });

  user.on("ready", () => {
    console.log("Kafka connected successfully");
  });

  const producer = new Kafka.Producer(user);

  producer.on("ready", () => {
    const payload = [{ topic: "test-kafka-topic", messages: "Test message" }];

    producer.send(payload, (error, data) => {
      if (error) {
        console.error("Error in publishing message:", error);
      } else {
        console.log("Message successfully published:", data);
      }
    });
  });

  user.on("error", (error) => {
    console.error("Error connecting to Kafka:", error);
  });

  // Exporting user for potential use in other files
  export { user };
  ```

## Step #: Consuming Messages from Kafka

- Consuming messages from **Kafka** involves configuring a **consumer**, subscribing to topics, polling for messages, processing them, and also committing offsets.
- Consumer configuration includes properties such as `bootstrap servers`, group ID, auto offset reset, and deserializers.
- The `subscribe()` method is used to subscribe to topics, and the `poll()` method is used to get messages. Once received, messages can be processed and the offsets can be committed either manually or automatically.

## Step #: Using the `consume()` method to consume messages from Kafka

- The `consume()` method is an important function in the **Kafka Consumer API** used to fetch messages from a **Kafka topic**. It is used commonly in Node.js to consume messages from a Kafka topic in a stream-like fashion.
- Example:

  ```javascript
  import Kafka from "kafka-node";

  // Configure Kafka consumer
  const consumer = new Kafka.Consumer(
    new kafka.KafkaClient({ kafkaHost: "kafka:29092" }),
    [{ topic: "test-kafka-topic" }]
  );

  // Consume messages from Kafka broker
  consumer.on("message", function (message) {
    // Display the message
    console.log(message.value);
  });
  ```

- Here:
  - the `consume()` method is used to retrieve messages continuously from the Kafka broker till the consumer stops.
  - The `on()` method is used to register an event handler for the message event, which is fired each time a new message is retrieved from the Kafka broker.
  - The message object contains the `key-value` pair representing the key and value of the message, along with additional metadata such as the **topic**, **partition**, and **offset**.
- **Note** that the `consume()` method is a blocking method that will wait eternally till a new message is available for consumption. You can use the `poll()` method instead If you need to consume messages asynchronously. The `poll()` method lets you define a timeout value and returns a list of messages, where each message is associated with its corresponding topic partition.

## Step #: Handling received messages in a callback function

- When consuming messages from a **Kafka topic** using Node.js, it is common to handle the received messages in a callback function. This function is registered with the consumer and called each time a new message is retrieved from the Kafka broker.
- Example:

  ```javascript
  import Kafka from "kafka-node";

  // Set up the Kafka consumer
  const consumer = new Kafka.Consumer(
    new kafka.KafkaClient({ kafkaHost: "kafka:29092" }),
    [{ topic: "test-kafka-topic" }]
  );

  // Callback function to handle messages received
  function processMessage(message) {
    // output the message
    console.log(message.value);
  }

  // Register the callback function with the consumer
  consumer.on("message", processMessage);
  ```

- The `processMessage()` function here is defined to handle received messages. It simply prints the message to the console and based on the content of the message, it could perform a number of actions. The `on()` method on the other hand is used to register the consumer with the Kafka topic as well as associate the `processMessage()` function as the callback function to process the received messages.

# `kafkajs` for Apache Kafka

## Step #1: Import Dependencies

```js
import { Kafka, Partitioners } from "kafkajs";
import {
  SchemaRegistry,
  readAVSCAsync,
  SchemaType,
} from "@kafkajs/confluent-schema-registry";

const TOPIC = "test-kafka-topic";

// configure Kafka broker
const kafka = new Kafka({
  clientId: "some-client-id",
  brokers: ["localhost:29092"],
});

// If we use AVRO, we need to configure a Schema Registry which keeps track of the schema
const registry = new SchemaRegistry({
  host: "http://localhost:8081",
});

// create a producer which will be used for producing messages
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
```

## Step #: Define an `Avro` Schema

- We need to make sure we can encode messages in `AVRO`. Therefore we need to be able to read a schema from a file and register it in the **schema registry**.
- Create a `sales.sale_order.v1` Kafka Topic
- Define a `sales.sale_order.v1-value` Kafka Schema in the Schema Registry of `Avro` Type with the following:
  ```avsc
  {
    "type": "record",
    "name": "SaleOrderEvent",
    "namespace": "com.my.company",
    "doc": "Kafka JS example schema",
    "fields": [
      { "name": "customer_id", "type": "long", "doc": "The customer" },
      { "name": "product_id", "type": "long", "doc": "The product" },
      { "name": "amount", "type": "int" }
    ]
  }
  ```

## Step #: Register an `Avro` Schema

- Define a function to read an `Avro` schema from a file and register it in the **schema registry**.

  ```js
  // This will create an AVRO schema from an .avsc file
  import { Kafka, Partitioners } from "kafkajs";
  import {
    SchemaRegistry,
    readAVSCAsync,
    SchemaType,
  } from "@kafkajs/confluent-schema-registry";
  import fs from "fs";

  const TOPIC = "sales.sale_order.v1";

  // configure Kafka broker
  const kafka = new Kafka({
    clientId: "some-client-id",
    brokers: ["localhost:29092"],
  });

  // If we use AVRO, we need to configure a Schema Registry which keeps track of the schema
  const registry = new SchemaRegistry({
    host: "http://localhost:8081",
  });

  // create a producer which will be used for producing messages
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  // This function reads the AVSC schema file
  const readSchemaFile = async () => {
    try {
      const schemaString = await fs.promises.readFile(
        "../avro/schema.avsc",
        "utf-8"
      );
      const schema = JSON.parse(schemaString); // Parse AVSC schema string to JavaScript object
      console.log("Parsed schema:", schema); // Log the parsed schema
      return schema;
      //return JSON.parse(schema); // Parse AVSC schema string to JavaScript object
    } catch (error) {
      console.log(error);
      throw error; // Throw the error to handle it outside
    }
  };

  // This function registers the schema with the Schema Registry
  const registerSchema = async () => {
    try {
      const schema = await readSchemaFile();
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

  // register a schema
  (async () => {
    try {
      await producer.connect();
      console.log("Producer connected to Kafka broker successfully.");

      const schemaId = await registerSchema();
      console.log("Schema registered successfully with ID:", schemaId);

      // Produce messages here using the registered schema

      await producer.disconnect();
      console.log("Producer disconnected from Kafka broker.");
    } catch (error) {
      console.error("Error:", error);
    }
  })();
  ```

## Step #: Produce a message using the `AVRO` schema

- since you now have a separate function `registerSchema` that registers the schema and is called within your `produceMessageToKafka` function, you can remove the immediately invoked function expression (IIFE) that registers the schema.

# Resources

1. [avro.apache.org/docs](https://avro.apache.org/docs/1.11.1/specification/_print/)
2. [dev.to - Integrating Kafka with Node.js](https://dev.to/ndulue/integrating-kafka-with-nodejs-104g)
