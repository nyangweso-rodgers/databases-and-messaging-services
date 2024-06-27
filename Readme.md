# Working with Databases

## Table Of Contents

# Database Scaling

- There are two main ways to scale a database: **vertically** and **horizontally**

## 1. Vertical Scaling (Scale-up)

- Involves adding more resources to your existing server to enhance its computational power. This could mean increasing the CPU power, RAM, SSD, or other hardware resources on your existing machine.
- **Advantages of Vertical Scaling** include:
  - Simplicity: Vertical scaling is usually simpler as it involves just increasing the server's power. There's no need for code changes or complex architecture designs.
  - Data Consistency: Since there's only one database, there's no issue of data consistency.
- **Disadvantages of Vertical Scaling** include:
  - Limited Growth: There's a limit to how much you can scale up a single server. At some point, you won't be able to add any more resources.
  - Downtime: To upgrade the server, you might need to face some downtime unless your system supports hot-swappable components.
  - Cost: High-end servers can become very expensive.

## 2. Horizontal Scaling (Scale-out)

- Involves adding more servers to your existing pool of **servers**. The load is distributed across multiple servers, thereby increasing the ability to handle more requests.
- **Advantages of Horizontal Scaling** include:
  - Greater Capacity: Horizontal scaling allows for virtually limitless scaling, as you can always add more servers to handle more traffic.
  - Redundancy: Having multiple servers can increase the availability of your application. If one server fails, the others can take over.
  - Cost-effective: Rather than investing in a high-end server, you can distribute the load across multiple cost-effective servers.
- **Disadvantages of Horizontal Scaling** include:
  - Complexity: Horizontal scaling introduces complexity into your system. Your application code needs to handle distributing data across multiple servers, and this could require significant re-architecting of your application.
  - Data Consistency: When data is distributed across multiple servers, it's harder to maintain consistency. This is especially important for databases, where you want to ensure that all users are seeing the same data.

# Database Replication

# What is Logical Replication?

- **Logical replication** is a method of replicating data objects and their changes, based upon their replication identity (usually a primary key). We use the term **logical** in contrast to **physical replication**, which uses exact block addresses and byte-by-byte replication.
- **Logical replication** allows fine-grained control over both data replication and security.
- **Logical replication** uses a **publish** and **subscribe** model with one or more **subscribers** subscribing to one or more publications on a publisher node. **Subscribers** pull data from the publications they subscribe to and may subsequently re-publish data to allow cascading replication or more complex configurations.
  - **Logical replication** of a table typically starts with taking a snapshot of the data on the publisher database and copying that to the **subscriber**. Once that is done, the changes on the **publisher** are sent to the **subscriber** as they occur in real-time. The subscriber applies the data in the same order as the publisher so that transactional consistency is guaranteed for publications within a single subscription. This method of data replication is sometimes referred to as transactional replication.

# ACID (Atomicity, Consistency, Isolation, & Durability) Properties in DMS (Database Management Systems)

- **ACID** properties ensure that a set of database operations (grouped together in a transaction) leave the database in a valid state even in the event of unexpected errors.
- **ACID** properties:
  - **Atomicity**
    - **Atomicity** guarantees that all of the commands that make up a transaction are treated as a single unit and either succeed or fail together.
    - This is important as in the case of an unwanted event, like a crash or power outage, we can be sure of the state of the database. The transaction would have either completed successfully or been rollbacked if any part of the transaction failed.
    - Example
      - money is deducted from the source and if any anomaly occurs, the changes are discarded and the transaction fails.
  - **Consistency**
    - **Consistency** guarantees that changes made within a transaction are consistent with database constraints. This includes all rules, constraints, and triggers. If the data gets into an illegal state, the whole transaction fails.
    - Example:
      - let’s say there is a constraint that the balance should be a positive integer. If we try to overdraw money, then the balance won’t meet the constraint. Because of that, the consistency of the ACID transaction will be violated and the transaction will fail.
  - **Isolation**
    - **Isolation** ensures that all transactions run in an isolated environment. That enables running transactions concurrently because transactions don’t interfere with each other.
    - Example:
      - let’s say that our account balance is $200. Two transactions for a $100 withdrawal start at the same time. The transactions run in isolation which guarantees that when they both complete, we’ll have a balance of $0 instead of $100.
  - **Durability**
    - **Durability** guarantees that once the transaction completes and changes are written to the database, they are persisted. This ensures that data within the system will persist even in the case of system failures like crashes or power outages.

# Resources

1. [MongoDB Basics - What are ACID Properties in Database Management Systems?](https://www.mongodb.com/basics/acid-transactions)
