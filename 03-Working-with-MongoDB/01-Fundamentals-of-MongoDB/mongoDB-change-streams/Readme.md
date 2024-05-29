# MongoDB Change Streams

## Table Of Contents

- **Change streams** allow applications a direct interface in real time to deal with change in database collections, with powerful features to custom **event-driven architectures**. These streams offer a unified interface to subscribe to various types of changes, including document insertions, updates, deletions, and database and collection–level events.

# What are MongoDB Change Streams?

- **MongoDB** change streams provide a way to watch changes occurring in a MongoDB database in real–time. It allows applications to react to these changes as they happen, making it an ideal tool for building real-time event-driven systems.

#

- **Change streams** are available in **MongoDB** when a **replica set environment is configured**. To utilize **change streams** in a local development environment, we configure a replica set using **Docker Compose**.

# Prerequisites

- In order to use **Change Streams**, one must use a distributed database, referred to as the **replica set**, which is very well facilitated in **MongoDB**.

# Where to Use Change Streams?

1. Real-time Analytics: Change Streams are valuable for real-time data analysis, allowing immediate response to data changes.
2. Data Replication: They can be used to replicate data changes across multiple systems or databases in real-time.
3. Synchronization Across Distributed Systems: Change Streams help keep distributed systems synchronized by propagating changes instantly.
4. Building Event-Driven Architectures: They are essential for building event-driven systems where actions are triggered based on database changes.
5. Immediate Notification Systems: Change Streams are useful for applications requiring immediate notification or action based on database changes

# MongoDB Change Streams Features

1. Change Stream Aggregation: MongoDB Change Streams return a stream of change events in a format that resembles MongoDB aggregation pipelines. This allows developers to apply powerful transformations and filters to the incoming change events.
2. Resumability: Change Streams maintain a resume token, which allows applications to resume listening for changes from the point where they left off. This ensures fault tolerance and consistency in event processing.
3. Scalability: MongoDB Change Streams are designed to scale efficiently, making them suitable for high-throughput applications. They can be deployed in a sharded cluster environment, distributing the load across multiple nodes.
4. Integration Flexibility: Change Streams can be seamlessly integrated with various programming languages and frameworks through MongoDB drivers, enabling developers to build event-driven architectures in their preferred tech stack.

# How to Use Change Streams?

- Setting Up a Pipeline: Involves creating a pipeline to monitor changes in MongoDB.
- Reacting to Changes: Requires implementing code to respond to those changes in the application.
- APIs for Managing Change Streams: MongoDB drivers offer APIs for establishing and managing change streams.
- Subscription to Relevant Changes: Developers can subscribe to specific changes based on their application’s requirements.
- Processing Changes: Developers can process these changes as needed in their application logic.

# Application

## Objective

- Build a **real-time application** using **MongoDB Change Streams**. The `Node.js` Application should listens for changes in a **MongoDB** collection and triggers notifications for new document insertions.

## Step 1: Connect to MongoDB

- Establish a connection to our MongoDB database using the appropriate driver for Node.js.

  ```js
  //src/app/utils/mongo-db-connection.js
  import { MongoClient } from "mongodb";
  import dotenv from "dotenv";

  // Load environment variables from .env file
  dotenv.config();

  const MONGO_URI = process.env.MONGO_URI_FOR_SURVEY_SERVICE;

  // Define an asynchronous function to connect to MongoDB
  const connectToMongoDB = async () => {
    const mongoClient = new MongoClient(MONGO_URI);

    try {
      // Attempt to connect to the MongoDB server
      await mongoClient.connect();

      // Log a success message if connected
      console.log("Connected to MongoDB");

      // Return the database object from the client
      return mongoClient.db("myDatabase");
    } catch (error) {
      // Log an error message if connection fails
      console.error("Error connecting to MongoDB:", error);
    }
  };

  // Call the connectToMongoDB function and assign the returned database object to 'db'
  const db = await connectToMongoDB();

  export default db;
  ```

## Step 2: Create a Change Stream

- create a change stream to monitor the desired collection for insertions.

  ```js
  //src/app/index.js
  import db from "./utils/mongo-db-connection.js";

  // Access the 'notifications' collection from the connected database
  const collection = db.collection("participants_survey");

  // Create a change stream on the 'notifications' collection
  const changeStream = collection.watch();
  ```

- We access, `participants_survey` collection from the connected MongoDB database using `db.collection` method. It then creates a change stream on the `participants_survey` collection using the ‘`watch`‘ method. This **change stream** will allow the application to listen for changes in the `participants_survey` collection in real-time.

## Step 3: Listen for Changes

- Now, listen for changes in the **change stream** and handle new document insertions.

  ```js
  //src/app/index.js

  // Listen for changes in the change stream
  changeStream.on("change", (change) => {
    // Check if the change is an insertion
    if (change.type === "insert") {
      // Extract the new document from the change event
      const newParticipantSurvey = change.fullDocument;

      // Log the new notification to the console
      console.log("New Participant Survey Response", newParticipantSurvey);
    }
  });
  ```

- Here, we setup a listener for changes in the **change stream**. When a change event occurs, it checks if the operation type is an insertion (`insert`). If it is, it extracts the new document from the change event and logs it to the console as a new notification

## Step 4: Run the Application

# Resources and Further Reading

1. [geeksforgeeks.org - how-to-use-mongodb-change-streams-as-a-powerful-event-driven-engine](https://www.geeksforgeeks.org/how-to-use-mongodb-change-streams-as-a-powerful-event-driven-engine/)
