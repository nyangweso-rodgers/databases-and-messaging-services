# Apache Kafka

# What is Apache Kafka?

- **Apache Kafka** is an **open-source distributed event streaming platform**. i.e., it’s a platform widely used to work with real-time streaming data pipelines and to integrate applications to work with such streams. It’s mainly responsible for:
  - publishing/subscribing to the stream of records,
  - their real-time processing,
  - and their ordered storage

# How does Kafka work?

- **Data Ingestion**: **Producers** send messages to **Kafka brokers**. **Producers** can choose to send messages **synchronously** or **asynchronously**.
- **Storage**: **Messages** are stored in **partitions** within **Kafka brokers**. Each **partition** is an **ordered**, **immutable** sequence of messages.
- **Replication**: **Kafka** provides fault tolerance through data **replication**. Each **partition** has **one leader** and **multiple replicas**. The **leader** handles **read** and **write operations**, while the **replicas** act as backups. If a broker fails, one of its replicas can be promoted as the new leader.
- **Retention**: Kafka allows you to configure a retention period for each topic, determining how long messages are retained in the system. Older messages are eventually purged, making Kafka suitable for both real-time and historical data processing.
- **Consumption**: Consumers subscribe to one or more topics and read messages from **partitions**. Consumers can process data in real time or store it in a database for later analysis.

# Use Cases of Kafka

1. Real-time data processing and analytics
2. Log and event data aggregation
3. **Stream Processing in big data pipelines**:
   - Instead of piping Data to a certain storage downstream we mount a Stream Processing Framework on top of Kafka Topics.
   - The Data is filtered, enriched and then piped to the downstream systems to be further used according to the use case.
4. **Database Replication**:
   - Database Commit log is piped to a Kafka topic.

# Kafka Architecture

## 1. Kafka Cluster

- **Kafka Cluster** is a collection of **Kafka brokers**.

## 2. Kafka Broker

- **Kafka Brokers** store data that is sent from the **producer** and keep data in both **cache** and **disk**. The default data retention on **disk** is **7 days** but we can configure for more or less.

# Kafka Concepts

## Kafka Concept 2: Producers

- **Producers** are **applications** that publish data to **Kafka topics**. They write messages to specific **topics**, and these messages are then stored in the **Kafka brokers**

## Kafka Concept 3: Consumers

- **Consumers** are **applications** that read data from **Kafka topics**. They **subscribe** to one or more **topics** and receive messages from the **partitions** of those **topics**.

### Kafka Concept 3.1: Consumer Groups

- **Consumers** can be organized into **consumer groups**, where each group consists of one or more **consumers** who work together to consume messages from one or more topics. Each message in a **partition** is delivered to only one **consumer** within a group, allowing parallel processing of data.
- Example:
  - Let’s consider an example where we have a **Kafka topic** named `orders` with three partitions. We create a **consumer group** named `orderProcessors` with two **consumer** instances (`consumer-1` and `consumer-2`). **Kafka** automatically assigns partitions to these consumers as follows:
    - `consumer-1` -> partitions 0, 2
    - `consumer-2` -> partition 1
  - Now, each **consumer** instance within the `orderProcessors` group processes messages from its assigned partitions concurrently, allowing efficient and parallel message processing.

### Kafka Concept 3.2: `GroupId`

- The `GroupId` identifies a **consumer group**, which is a logical collection of **consumer** instances that work together to consume messages from one or more topics.
- **Consumers** within the same `GroupId` coordinate to process messages from assigned partitions, ensuring parallelism and fault tolerance.

### Kafka Concept 3.3: `ConsumerId`

- The `ConsumerId` uniquely identifies an individual **consumer** instance within a **consumer group**.
- Each **consumer** instance in a group has a distinct `ConsumerId`, which helps Kafka track its progress and state in consuming messages.

### Kafka Concept 3.4: `ClientId`

- The `ClientId` is an identifier assigned to a **Kafka client application** (**producer** or **consumer**).
  - Multiple **consumer** instances or **producers** can share the same `ClientId` if they belong to the same application

## Kafka Concept 4: Topics

- **Kafka** categorizes data into **topics**. A **topic** is a category or feed name to which records are published.
- **Producers** publish messages to a specific **topic**. The messages can be in any format, with `JSON` and `Avro` being popular options. **Consumers** subscribe to a **topic** to consume the records published by producers.

- **Features** of a **Kafka Topics**:
  - Different **topics** are identified by their names and will store different kinds of events. For example a social media application might have `posts`, `likes`, and `comments` **topics** to record every time a user creates a post, likes a post, or leaves a comment.
  - Multiple applications can write to and read from the same topic. An application might also read messages from one topic, filter or transform the data, and then write the result to another topic.
  - **topics** are append-only. When you write a message to a topic, it's added to the end of the log. Events in a topic are **immutable**. Once they're written to a topic, you can't change them.
  - **Topics** are durable, holding onto messages for a specific period (by default 7 days) by saving them to physical storage on disk.
  - You can configure topics so that messages expire after a certain amount of time, or when a certain amount of storage is exceeded. You can even store messages indefinitely as long as you can pay for the storage costs.

## Kafka Concept 5: Partitions

- In order to help **Kafka** to scale, **topics** can be divided into **partitions**. This breaks up the event log into multiple logs, each of which lives on a separate node in the **Kafka cluster**. This means that the work of writing and storing messages can be spread across multiple machines.
- When you create a **topic**, you specify the amount of **partitions** it has. The **partitions** are themselves numbered, starting at `0`. When a new event is written to a **topic**, it's appended to one of the topic's **partitions**.
- **Messages** that have the same `key` will always be sent to the same **partition**, and in the same order. The `key` is run through a hashing function which turns it into an integer. This output is then used to select a **partition**.
- **Messages** within each **partition** are guaranteed to be ordered. For example, all messages with the same `customer_id` as their `key` will be sent to the same partition in the order in which **Kafka** received them.

## Kafka Concept 6: Offsets

- Each **message** in a **partition** gets an `id` that is an incrementing integer, called an **offset**.
- **Offsets** start at `0` and are incremented every time **Kafka** writes a message to a **partition**. This means that each message in a given **partition** has a unique **offset**.
- **Offsets** are not reused, even when older messages get deleted. They continue to increment, giving each new message in the **partition** a unique id.
- When data is read from a **partition**, it is read in order from the lowest existing **offset** upwards.

# Resources and Further Reading

1. [kafka.apache.org/intro](https://kafka.apache.org/intro)
2. [zookeeper.apache.org](https://zookeeper.apache.org/)
