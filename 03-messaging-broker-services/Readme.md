# Message Broker Services

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
  - RabbitMQ
  - Kafka
  - Redis
