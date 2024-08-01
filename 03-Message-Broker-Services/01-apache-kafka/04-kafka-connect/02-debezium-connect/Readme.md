# Debezium

## Table Of Contents

# Use Cases for Publishing Database Changes to Kafka

1. **Real-Time Analytics**: Feeding database changes to a real-time analytics system to provide up-to-the-minute insights.
2. **Event-Driven Architecture**: Enabling services to react to database changes, triggering workflows or business processes.
3. **Cache Invalidation**: Automatically invalidating or updating cache entries based on database changes to ensure consistency.
4. **Data Replication**: Replicating data across different data stores or geographic regions for redundancy and high availability.
5. **Audit Logging**: Keeping a comprehensive audit log of all changes made to database for compliance and debugging purposes.

# What is Debezium?

- **Debezium** is an open-source, distributed system that enables users to capture real-time changes so that applications can notice such changes and react to them. It consists of **connectors** that record all real-time data changes and store them as events in **Kafka topics**.
- **Debezium** supports various databases, including **PostgreSQL**, **MySQL**, and **MongoDB**, making it a versatile choice for change data capture (CDC) needs.

# Resources and Further Reading
