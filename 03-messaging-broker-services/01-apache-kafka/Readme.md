# Apache Kafka

## Table Of Contents

# What is Apache Kafka?

- **Apache Kafka** is an **open-source distributed event streaming platform**. i.e., it’s a platform widely used to work with real-time streaming data pipelines and to integrate applications to work with such streams. It’s mainly responsible for:
  - publishing/subscribing to the stream of records,
  - their real-time processing,
  - and their ordered storage

## How does Kafka work?

- **Data Ingestion**: **Producers** send messages to **Kafka brokers**. **Producers** can choose to send messages **synchronously** or **asynchronously**.
- **Storage**: **Messages** are stored in **partitions** within **Kafka brokers**. Each **partition** is an **ordered**, **immutable** sequence of messages.
- **Replication**: **Kafka** provides fault tolerance through data **replication**. Each **partition** has **one leader** and **multiple replicas**. The **leader** handles **read** and **write operations**, while the **replicas** act as backups. If a broker fails, one of its replicas can be promoted as the new leader.
- **Retention**: Kafka allows you to configure a retention period for each topic, determining how long messages are retained in the system. Older messages are eventually purged, making Kafka suitable for both real-time and historical data processing.
- **Consumption**: Consumers subscribe to one or more topics and read messages from **partitions**. Consumers can process data in real time or store it in a database for later analysis.

## Why Kafka is a Good Message Queue

1. **High Throughput**:
   - Kafka can handle high volumes of data with low latency, making it suitable for real-time data processing.
   - Its architecture allows for efficient handling of large streams of messages with minimal performance degradation.
2. **Scalability**
   - Kafka scales horizontally by adding more brokers to a cluster.
   - Topics can be partitioned and distributed across multiple brokers, enabling parallel processing and increased throughput.
3. **Durability**
   - Kafka stores messages on disk and replicates them across multiple brokers, ensuring data durability and fault tolerance.
   - Even in the event of hardware failures, Kafka can recover without data loss.
4. **Fault Tolerance**:
   - Kafka’s replication feature ensures that data is available even if some brokers fail.
   - Leader-follower architecture allows for seamless failover and recovery.
5. **High Availability**:
   - Kafka is designed to be highly available with no single point of failure.
   - Zookeeper coordinates and manages the cluster, ensuring that the system remains operational even during maintenance.
6. **Stream Processing**:
   - Kafka integrates seamlessly with **Kafka Streams** and other stream processing frameworks like **Apache Flink** and **Apache Spark**.
   - This allows for real-time processing and transformation of data streams.
7. **Strong Ordering Guarantees**:
   - Kafka guarantees the order of messages within a partition.
   - This is crucial for applications that require strict message processing order.
8. **Support for Multiple Consumers**:
   - Kafka supports multiple consumer groups, allowing different applications or services to consume the same data independently.
   - Each consumer group processes messages in parallel, enhancing performance.
9. **Flexible Data Retention**:
   - Kafka allows configurable retention policies, which can be based on time or size.
   - This ensures that data can be retained for as long as needed for replaying or auditing purposes.
10. **Efficient Storage**:
    - Kafka uses a commit log for message storage, which is highly efficient for both write and read operations.
    - This model also supports replaying and time-travel capabilities, allowing consumers to reprocess historical data.

## Use Cases of Kafka

1. Real-time data processing and analytics
2. Log and event data aggregation
3. **Stream Processing in big data pipelines**:
   - Instead of piping Data to a certain storage downstream we mount a Stream Processing Framework on top of Kafka Topics.
   - The Data is filtered, enriched and then piped to the downstream systems to be further used according to the use case.
4. **Database Replication**:
   - Database Commit log is piped to a Kafka topic.

# Kafka Messaging Strategies And How To Choose The Right One

- What should be the next step after publishing an event? It turns out there are 3 options we could choose from:
  1. Fire and Forget
  2. Synchronous Send
  3. Asynchronous Send

## 1. Fire and Forget

- In this strategy, we send a message to the Kafka broker and forget about it. We simply don’t care what happens to it.
- Since Kafka is highly available, it will likely arrive on the other side successfully. In case of a minor issue, the Producer will retry sending the message automatically.
- **Fire and forget** means that messages can and will get lost. Also, the application won’t get any information or exceptions about these lost messages.

# Understanding Kafka’s Coordination: ZooKeeper and the Transition to KRaft

- In distributed systems like **Kafka**, managing coordination between nodes is critical. This ensures consistency, leader election, and fault tolerance across the system. **ZooKeeper** has historically been used for this purpose in Kafka, serving as the external distributed coordination service.
- Why Kafka use **Zookeeper**?: **ZooKeeper** helps ensure that Kafka operates as a distributed system, providing consistent state and coordination across brokers. It handles:

  - **Leader Election**: Ensures a broker is elected as the leader for each partition, responsible for reading/writing data.
  - **Metadata Management**: Maintains an updated view of the cluster, including available brokers and topic configurations.
  - **Broker** Failover: Detects failed brokers and helps reassign partition leaders.
  - **Challenges**: While reliable, running ZooKeeper adds operational complexity and can become a bottleneck as Kafka scales.

- To simplify Kafka’s architecture and improve scalability, **KRaft** was introduced. **KRaft** replaces **ZooKeeper** by using Kafka’s internal **Raft consensus algorithm**, allowing Kafka brokers to handle their own coordination tasks.
  - No External Dependency: **KRaft** eliminates the need for ZooKeeper, reducing complexity.
  - Better Scalability: With KRaft, Kafka brokers manage metadata and leader elections directly, enabling better performance at scale.
  - Simplified Operations: No separate ZooKeeper cluster to maintain.
- In short, **KRaft** transitions Kafka from using an external coordination service (ZooKeeper) to handling coordination internally, making Kafka more efficient and scalable.

# Kafka Concepts (Architecture)

## 1. Kafka Cluster

- **Kafka Cluster** is a collection of **Kafka brokers**.

## 2. Kafka Broker

- A **broker** is a Kafka server that stores data and handles requests to write (**produce**) and read (**consume**) messages. Kafka is a distributed system, meaning it usually runs on multiple brokers. Brokers work together to manage and store messages, and they communicate with producers and consumers.
- **Kafka Brokers** store data that is sent from the **producer** and keep data in both **cache** and **disk**. The default data retention on **disk** is **7 days** but we can configure for more or less.
- Example:
  - A **Kafka cluster** could have 3 brokers. One broker stores partition 1 of the “payments” topic, another broker stores partition 2, and so on.

## 3. Replication

- **Replication** is the process of copying data from one **Kafka broker** to another to ensure that it is safely stored. Each partition can have multiple copies (called replicas), and these replicas are stored on different brokers.

## 4. Producers

- **Producers** are **applications** that publish data to **Kafka topics**. They write messages to specific **topics**, and these messages are then stored in the **Kafka brokers**
- **Producers** can be a web service, an application, or any system that generates data. Producers don’t care who consumes the data — they just publish messages to the topic.
- Key concepts for producers:
  - **Key-Value Pair**: Each message in Kafka is a **key-value** pair, where the **key** is optional and used to determine which partition the message should go to. The **value** is the actual data being sent (e.g., a log entry, a payment transaction, or an event).
  - **Partitioning**: Kafka distributes messages across partitions for parallelism and load balancing. Producers can control the partitioning strategy by providing a key. Messages with the same key will go to the same partition, ensuring message order.
  - **Batching and Compression**: **Producers** can batch multiple messages into a single request to improve throughput. They can also compress messages using formats like **gzip** or **snappy**, reducing network overhead.
  - **Acks** (**Acknowledgments**): Kafka producers have different levels of acknowledgment for message delivery:
    - acks=0: The producer sends the message and does not wait for any acknowledgment, leading to the highest throughput but the lowest reliability (messages might be lost).
    - acks=1: The producer waits for the leader of the partition to acknowledge the message, ensuring it is stored on the leader, but it may not be replicated yet.
    - acks=all: The producer waits for all in-sync replicas to acknowledge the message, ensuring the highest level of durability and reliability.

## 5. Consumers

- **Consumers** are **applications** that read data from **Kafka topics**. They **subscribe** to one or more **topics** and receive messages from the **partitions** of those **topics**.
- The following are associated with Consumers:
  1. **Consumer Group**
     - **Consumers** can be organized into **consumer groups**, where each group consists of one or more **consumers** who work together to consume messages from one or more topics. Each message in a **partition** is delivered to only one **consumer** within a group, allowing parallel processing of data.
     - Example:
       - Let’s consider an example where we have a **Kafka topic** named `orders` with 3 partitions. We create a **consumer group** named `orderProcessors` with two **consumer** instances (`consumer-1` and `consumer-2`). **Kafka** automatically assigns partitions to these consumers as follows:
         - `consumer-1` -> partitions 0, 2
         - `consumer-2` -> partition 1
       - Now, each **consumer** instance within the `orderProcessors` group processes messages from its assigned partitions concurrently, allowing efficient and parallel message processing.
  2. `GroupId`:
     - The `GroupId` identifies a **consumer group**, which is a logical collection of **consumer** instances that work together to consume messages from one or more topics.
     - **Consumers** within the same `GroupId` coordinate to process messages from assigned partitions, ensuring parallelism and fault tolerance.
  3. `ConsumerId`:
     - The `ConsumerId` uniquely identifies an individual **consumer** instance within a **consumer group**
     - Each **consumer** instance in a group has a distinct `ConsumerId`, which helps Kafka track its progress and state in consuming messages.
  4. `ClientId`:
     - The `ClientId` is an identifier assigned to a **Kafka client application** (**producer** or **consumer**).
     - Multiple **consumer** instances or **producers** can share the same `ClientId` if they belong to the same application

## 6. Topics

- **Kafka** categorizes data into **topics**. A **topic** is a category or feed name to which records are published.
- **Producers** publish messages to a specific **topic**. The messages can be in any format, with `JSON` and `Avro` being popular options. **Consumers** subscribe to a **topic** to consume the records published by producers.

- **Features** of a **Kafka Topics**:
  - Different **topics** are identified by their names and will store different kinds of events. For example a social media application might have `posts`, `likes`, and `comments` **topics** to record every time a user creates a post, likes a post, or leaves a comment.
  - Multiple applications can write to and read from the same topic. An application might also read messages from one topic, filter or transform the data, and then write the result to another topic.
  - **topics** are append-only. When you write a message to a topic, it's added to the end of the log. Events in a topic are **immutable**. Once they're written to a topic, you can't change them.
  - **Topics** are durable, holding onto messages for a specific period (by default 7 days) by saving them to physical storage on disk.
  - You can configure topics so that messages expire after a certain amount of time, or when a certain amount of storage is exceeded. You can even store messages indefinitely as long as you can pay for the storage costs.

## 7. Partitions

- In order to help **Kafka** to scale, **topics** can be divided into **partitions**. This breaks up the event log into multiple logs, each of which lives on a separate node in the **Kafka cluster**. This means that the work of writing and storing messages can be spread across multiple machines.
- When you create a **topic**, you specify the amount of **partitions** it has. The **partitions** are themselves numbered, starting at `0`. When a new event is written to a **topic**, it's appended to one of the topic's **partitions**.
- **Messages** that have the same `key` will always be sent to the same **partition**, and in the same order. The `key` is run through a hashing function which turns it into an integer. This output is then used to select a **partition**.
- **Messages** within each **partition** are guaranteed to be ordered. For example, all messages with the same `customer_id` as their `key` will be sent to the same partition in the order in which **Kafka** received them.
- Example:
  - If you have 1 million payment records in the “payments” topic, **Kafka** can split these across 10 partitions. This way, 10 consumers can read from each partition in parallel, speeding up the processing.

## 8. Offsets

- Each **message** in a **partition** gets an `id` that is an incrementing integer, called an **offset**.
- **Offsets** start at `0` and are incremented every time **Kafka** writes a message to a **partition**. This means that each message in a given **partition** has a unique **offset**.
- **Offsets** are not reused, even when older messages get deleted. They continue to increment, giving each new message in the **partition** a unique id.
- When data is read from a **partition**, it is read in order from the lowest existing **offset** upwards.
- Example:
  - If a consumer reads 100 messages from partition 1 of the “payments” topic, its offset will be 100. The next time it reads from that partition, it will start at offset 101.

# Resources and Further Reading

1. [kafka.apache.org/intro](https://kafka.apache.org/intro)
2. [zookeeper.apache.org](https://zookeeper.apache.org/)
