# Logical Replication

# What is Logical Replication?

- The **PostgreSQL logical replication** follows the **publish/subscribe** model. The **publisher** node creates a **publication**, which is also called a **change set** or a **replication set**. The **publication** is simply a set of changes from one or more tables. The **subscriber** node creates a **subscription**, with the capability to **subscribe** to either one or more **publications**.

# Use Cases of Postgres Logical Replication

1. Sending incremental changes in a single database or a subset of a database to subscribers as they occur.
2. Firing triggers for individual changes as they arrive on the subscriber.
3. Consolidating multiple databases into a single one (e.g., for analytical purposes). Replicating between different major versions of PostgreSQL.
4. Replicating between PostgreSQL instances on different platforms (e.g., Linux to Windows)
5. Giving access to replicated data to different groups of users.
6. Sharing a subset of the database between multiple databases.

# How to set up PostgreSQL logical replication environment using Docker Compose

- Here s what we aim to achieve:
  - **Create Three PostgreSQL Instances**: Using **Docker Compose**, we will spin up three separate PostgreSQL instances. This setup will serve as the backbone of our replication environment, providing a practical insight into managing multiple databases in a contained ecosystem.
  - **Configure Logical Replication**: All instances will be configured to support **logical replication**. This involves setting one database as the master (publisher) and the other two as replicas (subscribers), establishing a real-time data synchronization framework.
  - **Schema Synchronization**: We'll ensure that all three databases start with the same schema, laying the foundation for seamless data replication across our setup.
  - **Data Manipulation and Replication**: Through a series of data manipulation, we'll demonstrate how changes made to the master database are immediately reflected in the replica databases. This includes adding data and simulating a replica downtime.
  - **Failover and Recovery Scenarios**: We'll simulate a failover scenario by killing the master instance and promoting a replica to be the new master. This part of the project will highlight the resilience and flexibility of **logical replication** in handling unexpected database failures.
  - **Data Consistency Checks**: At various stages, we'll verify that data remains consistent across all instances, demonstrating the reliability of PostgreSQL's logical replication mechanism.
  - **Role Reversal and Recovery**: Finally, we'll bring the original master back online as a replica, completing our exploration of logical replication dynamics and ensuring all databases are synchronized.

## Check Active Replication Slots

- Check the currently active replication slots in your PostgreSQL database.
  ```sql
    SELECT * FROM pg_replication_slots;
  ```
- - This will display information about the **active replication connections**, including the **lag** and **state** of each **replication slot**.

## Identify Active Connections

- Identify active replication connections and their PIDs by:
  ```sql
    SELECT * FROM pg_stat_replication;
  ```

## Terminate the Active Replication Slot

- If you find that the replication slot "debezium" is active and you need to terminate it, you can use the PID to terminate the session.
  ```sql
      SELECT pg_terminate_backend(10196);
  ```

# Resources and Further Reading
