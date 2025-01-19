# Message Broker Services

## Table Of Contents

# What is a Message Queue?

- A **message queue** is a form of **asynchronous** service-to-service communication used in **serverless** and **microservices architectures**. In a **message queue**, messages (data) are stored until they are processed and consumed by a receiving service. This decouples the production of messages from their consumption, allowing services to operate independently.

## Basic Architecture of a Message Queue

- A **message queue** is a durable component stored in memory that supports **asynchronous communication**. It serves as a buffer and **distributes asynchronous requests**.
- The basic architecture of a **message queue** is simple. Input services, called **producers** or **publishers**, create and publish messages to a **message queue**. Other services, called **consumers** or **subscribers**, connect to the queue and perform actions defined by the messages.
- In a real-world scenario, there can be many apps writing to the queue and many servers reading from the queue.

- **Features of Message Queues**:

  1. **Asynchronous Communication**: **Producers** and **consumers** interact with the queue at their own pace without waiting for each other.
  2. **Decoupling**: **Producers** and **consumers** are decoupled, making the system more modular and easier to manage and scale.
  3. **Load Balancing**: Messages can be distributed across multiple consumers, balancing the workload.
  4. **Scalability**: Easily handles varying loads by scaling consumers up or down based on the volume of messages.
  5. **Reliability**: Ensures that messages are not lost even if the system crashes, through persistent storage.

- **Benefits of using Message Queues**:

  1. The main advantage is that we **decouple** these events, and this message queue will allow us to process these events **asynchronously**. We can queue them until we can process them. With the **message queue**, the **producer** can post a message to the **queue** when the consumer is unavailable to process it. Also, the **consumer** can read messages from the **queue** even when the **producer** is unavailable.
  2. Another great benefit is that they are **durable**. If the queue crashes, that data will not be lost as it’s not stored in **RAM** but in **Disk**. If a worker crashes while processing a message, no problem! The message is still in the queue and will be picked up by another worker.
  3. Message queues also provide **scalability**. If you receive a flood of orders, the queue will just get longer. You can add more workers to handle the extra load without affecting the website.

- **Queue Types**: Most common message queues are:
  1. **FIFO** (First-In-First-Out): Just like a regular line, messages are processed in the order they arrive. This is important for things like payment processing.
  2. **Priority Queues**: Some messages might be more important than others. You can prioritize these so they get processed sooner.

# Introduction to Event Driven Architecture

- In an Event Driven Architecture, systems reacts based on the event instead of the regular making request and waiting for a response sequence. This allows systems to communicate with one another asynchronously and reliably. Even when the system is down it’s still able to process the request when it comes back online.
- In order to implement this architecture, we have to use **Message Broker** or **Messaging Oriented Middleware** aka **MOM**. There are many message brokers out there in the market but ActiveMQ, RabbitMQ and Apache Kafka are the most popular.
- What separates **Apache Kafka** from the rest of message brokers is that Apache Kafka is massively scalable because it allows data to be distributed across multiple servers, and it’s extremely fast because it decouples data streams, which results in low latency. Let’s dive into more detail.

# Synchronous vs. Asynchronous Microservice Communication

- In a **Synchronous communication**, the **caller** waits for a **response** before sending the next message, and it operates as a **REST protocol** on top of **HTTP**. On the contrary, in **Asynchronous communication**, the **messages** are sent without waiting for a **response**. This is suited for distributed systems and usually requires a **message broker** to manage the messages.

- The type of communication you choose should consider different parameters, such as how you structure your Microservices, what infrastructure you have in place, latency, scale, dependencies and the purpose of the communication. **Asynchronous communication** may be more complicated to establish and requires adding more components to the stack, but the advantages of using **Asynchronous communication** for Microservices outweigh the cons.

# Advantages Of Asynchronous Communication

- **asynchronous communication** is non-blocking by definition. It also supports better scaling than Synchronous operations.
- in the event of Microservice crashes, **Asynchronous communication** mechanisms provide various recovery techniques and are generally better at handling errors pertaining to the crash
- In addition, when using **brokers** instead of a **REST protocol**, the services receiving communication don’t really need to know each other. A new service can even be introduced after an old one has been running for a long time, i.e better decoupling services.
- when choosing Asynchronous operations, you increase your capability of creating a central discovery, monitoring, load balancing, or even policy enforcer in the future. This will provide you with abilities for flexibility, scalability and more capabilities in your code and system building.

# Overview Of Broker Service

- **Broker Service**: When using **asynchronous communication** for **Microservices**, it is common to use a **message broker**. A **broker** ensures communication between different **microservices** is reliable and stable, that the **messages** are managed and monitored within the system and that messages don’t get lost. There are a few message brokers you can choose from, varying in scale and data capabilities. e.g.,
  1. RabbitMQ
  2. Kafka
  3. Redis
  4. Amazon SQS (Simple Queue Service): A fully managed cloud-based queue service offered by AWS. It’s scalable and reliable, with features like delay queues and dead-letter queues.

# Resources and Further Reading

1. [Medium - Message Queues in System Design](https://levelup.gitconnected.com/message-queues-in-system-design-0440a1221023)
2. [Medium - How Did LinkedIn Handle 7 Trillion Messages Daily With Apache Kafka?](https://blog.det.life/how-did-linkedin-handle-7-trillion-messages-daily-with-apache-kafka-07a167f1a949)
