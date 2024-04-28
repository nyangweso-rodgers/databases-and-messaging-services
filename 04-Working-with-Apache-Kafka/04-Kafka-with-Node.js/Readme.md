# Kafka with Node.js

## Table Of Contents

# Kafka with Node.js

# Configure Kafka Connection with `kafkajs`

## Step #: Import Dependencies

```js
import { Kafka, Partitioners } from "kafkajs";
import {
  SchemaRegistry,
  readAVSCAsync,
  SchemaType,
} from "@kafkajs/confluent-schema-registry";

const TOPIC = "my_topic";

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
