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

# ACID Properties in Databases

- **ACID** Stands for **Atomicity**, **Consistency**, **Isolation**, **Durability**.
- **ACID** properties ensure that a set of database operations (grouped together in a transaction) leave the database in a valid state even in the event of unexpected errors.

## 1. Atomicity

- **Atomicity** guarantees that all of the commands that make up a transaction are treated as a single unit and either succeed or fail together.
- This means that a transaction either happens entirely or doesn’t happen at all. If any part of the transaction fails, the entire transaction is canceled, and the database remains unchanged.
- This is important as in the case of an unwanted event, like a crash or power outage, we can be sure of the state of the database. The transaction would have either completed successfully or been rollbacked if any part of the transaction failed.
- Example
  - money is deducted from the source and if any anomaly occurs, the changes are discarded and the transaction fails.
  - Consider a banking transaction where $100 is transferred from Account A to Account B. This transaction involves two operations:
    - Debiting $100 from Account A.
    - Crediting $100 to Account B.
    - **Atomicity** ensures that either both operations are completed successfully, or neither operation is performed, preventing any partial updates to the database.

## 2. Consistency

- **Consistency** guarantees that changes made within a transaction are consistent with database constraints. This includes all rules, constraints, and triggers. If the data gets into an illegal state, the whole transaction fails.
- Example:
  - let’s say there is a constraint that the balance should be a positive integer. If we try to overdraw money, then the balance won’t meet the constraint. Because of that, the consistency of the ACID transaction will be violated and the transaction will fail.

## 3. Isolation

- **Isolation** ensures that all transactions run in an isolated environment. That enables running transactions concurrently because transactions don’t interfere with each other.
- Example:
  - let’s say that our account balance is $200. Two transactions for a $100 withdrawal start at the same time. The transactions run in isolation which guarantees that when they both complete, we’ll have a balance of $0 instead of $100.

## 4. Durability

- **Durability** guarantees that once the transaction completes and changes are written to the database, they are persisted. This ensures that data within the system will persist even in the case of system failures like crashes or power outages.
- Example:
  - After successfully transferring $100 from account A to account B, the changes are saved to the database. If the system crashes immediately after, durability ensures that the $100 transfer is still recorded and not lost.

# Dabase Performance and Scaling

- **Factors** which might affect the performance of a database include:
  1. **Item Size**: The average payload size of an item stored in the database determines whether the workload is **CPU-bound** or **storage-bound**.
  2. **Item Type**: The type of item directly impacts the kind of compression that is possible. For example, if you’re storing text, you can take advantage of a high compression ratio. Not so much when you store images, videos, or encrypted data.
  3. **Total Dataset Size**: This one directly impacts the infrastructure options and whether you’d need to go for **replication** and **sharding**.
  4. **Throughput and Latency Requirements**: Just saying “high throughput” is not enough. It’s critical to know the target throughput for choosing the optimal database type and infrastructure.

# Database Performance Improvement Techniques

## 1. Indexing

- In databases, an index acts as a "table of contents" for your data.
- It allows the database to quickly locate and retrieve specific information without scanning through every single record. Without an index, the database would have to scan the entire table to find matching records.
- For example, if you have a "Customers" table with columns like "ID", "Name", "Email", and "City". In case you often search for customers by email, creating an index on the "Email" column can make a huge difference.
- Key benefits of indexing are:
  1. Faster queries
  2. Reduced resource usage
  3. Increased concurrency
- The trade-offs are as follows:
  1. Extra disk space for each indexed column
  2. More work during write operations to update the index.

## 2. Materialized Views

- A **materialized view** is like a snapshot of a query result, stored separately from the original data.
- It's derived from one or more tables or views and is maintained independently. Think of it as a pre-calculated summary that you can quickly access whenever you need it.
- This materialized view can be refreshed periodically to keep the data up to date.
- **benefits** of **materialized views** are:
  1. No need to run complex and time-consuming queries in the user request flow.
  2. Reduced load
- The trade-offs are as follows:
  1. Extra storage
  2. Higher refresh time and inconsistent data in the view

## 3. Denormalization

- **Denormalization** involves duplicating data across multiple tables to optimize query performance. The goal is to reduce the number of joins and computations required to retrieve data, making queries faster and more scalable.
- Example:
  - Imagine an e-commerce store with a "Customers" table and an "Orders" table. In a normalized design, the "Orders" table would only store a reference to the "Customers" table.
  - To get the customer details with the order information, you'd need to join the two tables. However, as the number of orders grows, the join operation can become a performance bottleneck.
  - By storing a field like the “CustomerName” directly in the "Orders" table, you can retrieve the details along with order information in a single query
  - That's where denormalization comes in handy.
- **Benefits** of **Denormalization**:
  1. Faster queries
  2. Reduced overhead
  3. Improved read performance
- The trade-offs are as follows:
  1. Data redundancy.
  2. Complex updates since redundant data may need to be kept in sync across multiple tables.
  3. Potential inconsistency.

## 4. Vertical Scaling (Scaling Up)

- **Vertical scaling** is a technique that focuses on increasing the hardware resources of a single server.
- It's all about making your database server bigger, stronger, and faster.
- A few easy ways to do so are:
  1. Upgrading to a faster CPU
  2. Adding more memory to your server
  3. Switching to high-performance storage devices like SSDs.
- **benefits** of **Vertical Scaling**:
  1. Better performance
  2. Simplified management
  3. Reduced latency
- **Limitations** of **Vertical Scaling** include:
  1. There’s a limit to how much you can vertically scale a server before hitting some cost constraints.
  2. A single server failure can bring down your database.
  3. Upgrading hardware can be expensive.

## 5. Caching

- **Caching** is a technique that involves storing frequently accessed data in a high-speed storage layer, separate from the primary database.
- When an application receives a request for data, it first checks the cache. If the data is found (a cache hit), it's quickly retrieved without bothering the database. If the data is not found (a cache miss), the application fetches it from the database and stores a copy in the cache for future requests.
- **Benefits** of **caching** include:
  1. Reduced database load
  2. Improved read performance
- There are some trade-offs as well:
  1. Additional complexity
  2. Extra cost
  3. Chances of stale data

## 6. Replication

- **Replication** is a technique used in database systems to create and maintain multiple copies of data across different **servers** or **nodes**.
- In a typical leader-follower replication model, one node is designated as the leader, while the others are followers.
- The **leader** handles all the **write** operations ensuring consistency and integrity. The changes are automatically shared with the follower nodes whenever a write operation is performed on the leader node. The leader can also handle critical read operations where high consistency is required.
- The follower nodes, in turn, handle read operations and help distribute the workload to improve performance.
- The **benefits** of **Replication** are as follows:
  1. Improved Read Performance
  2. High Availability
  3. Durability
- There are also some trade-offs:
  1. Introduces some delay in data synchronization known as replication lag
  2. Increased complexity

## 7. Sharding

- Database **sharding** is a technique that partitions a single large database into smaller, more manageable units called **shards**.
- In a sharded database architecture, data is distributed across multiple shards based on a specific sharding key. The choice of the sharding key determines how the data is allocated to different shards.
- Common **sharding strategies** include:
  1. **Range-based Sharding**: Data is partitioned based on a range of values of the sharding key.
  2. **Hash-based Sharding**: A hash function is applied to the sharding key to determine the target shard.
  3. **Directory-based Sharding**: A separate lookup table is maintained to map the sharding key to the corresponding shard.
- The **benefits** of **Sharding** are as follows:
  1. Sharding allows for horizontal scaling of the database.
  2. Queries and write operations are processed in parallel.
  3. Reduced hardware costs when compared to vertical scaling.
- However, there are also trade-offs:
  1. Sharding introduces additional complexity.
  2. Rebalancing data across shards can be a complex and time-consuming process.
  3. Joining data across shards can be challenging.

# Resources

1. [MongoDB Basics - What are ACID Properties in Database Management Systems?](https://www.mongodb.com/basics/acid-transactions)
2. [newsletter.systemdesigncodex.com - 7-techniques-for-database-performance?ref=dailydev](https://newsletter.systemdesigncodex.com/p/7-techniques-for-database-performance?ref=dailydev)