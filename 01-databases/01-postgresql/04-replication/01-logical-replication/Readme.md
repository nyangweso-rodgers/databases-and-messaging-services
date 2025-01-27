# Logical Replication

## Table Of Contents

# What is Logical Replication in Postgresql?

- **Logical replication** was introduced for use with **PostgreSQL v10.0**. **Logical replication** works by copying/replicating data objects and their changes based on their replication identity.
- The term **logical** is used to distinguish it from **physical replication**, which makes use of byte-by-byte replication and exact block addresses.
- **Logical replication** replicates specific messages (e.g. **insert**, **update**, **delete**, **truncate**) over the network in a mostly stable format. This allows us to replicate data between databases running different Postgres versions. You can also filter rows or columns when replicating.

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

# Setting up Logical Replication Using Docker Container

- **Task**:
  - Create a single table, `testdb1` with some records. We want those rows to end up in the same table in `testdb2`.

1. **Step 1**: **Connecting to a Postgres Docker Container**

- To connect to a **PostgreSQL** instance running within a **Docker container**, you can use the `docker exec` command combined with the `psql` command:
- Example:
  ```sh
    docker exec -it postgres-db psql -U postgres -d <database_name>
  ```

2. **Step 2**: **Create Tables**

   - We cannot replicate **DDL** with **logical replication** so we'll have to run the `CREATE TABLE` statement first on both databases.
     ```sh
      #psql
      CREATE TABLE primary_tb (name TEXT PRIMARY KEY, age INT);
      CREATE TABLE primary_tb_replica (name TEXT PRIMARY KEY, age INT);
     ```

3. **Step 3** : **Create a Publication on the Primary Database**

   - On the **primary database**, you need to create a **publication** to define which tables will be replicated.
   - **Example 1**: We need to tell `primary_tb ` (at port `5432`) to **publish** changes to `primary_tb_replica` table. We call the publication **pubTable1**.
     ```sh
     #psql
      CREATE PUBLICATION primary_tb_pub FOR TABLE primary_tb_replica;
     ```
   - **Example 2**: if you want to **replicate** the users table, use this SQL command:

     ```sh
      -- Connect to the primary database
      \c central_primary_db

      -- Create a publication for the `users` table or multiple table vai comma sepa.
      CREATE PUBLICATION primary_db_pub
        FOR TABLE
            users,
            train_schedules,
            tickets,
            payments,
            seat_reservations
        WITH (publish = 'insert, update, delete');
     ```

   - Verify the **publication** by:
     ```sh
      \dRp+
     ```

4. **Step 4** : **Create a Subscription on the Replica Database**

   - On the **replica database**, you need to create a **subscription** that connects to the **primary database** and starts receiving changes.
   - **Example 1**:
     ```sh
     #psql
      CREATE SUBSCRIPTION primary_tb_sub CONNECTION 'host=postgres port=5432 dbname=postgres user=postgres password=mypassword' PUBLICATION primary_tb_pub;
     ```
   - **Example 2**: Use this SQL command:

     ```sh
      -- Connect to the replica database
      \c replica_db

      -- Create a subscription to the primary database
      CREATE SUBSCRIPTION central_railway_system_sub CONNECTION 'host=<primary_ip> port=5432 dbname=primary_db user=replicator_user password=<secure_password> sslmode=require' PUBLICATION central_railway_system_pub
        WITH (
            copy_data = true,   -- Copy existing data to replica db.
            create_slot = true,
            enabled = true
          );
     ```

   - Replace <`primary_ip`> with the IP address of your **primary database**.
   - Once the **subscription** is created, the **replica** will start receiving real-time updates from the **primary**.

5. **Step 5**: **Testing Replication**

   - Insert some data into `primary_tb`

     ```sh
      #psql
      INSERT INTO primary_tb (name) VALUES ('Test Data');
     ```

   - Check if the data is replicated into `primary_tb_replica`
     ```sh
      #psql
      SELECT * FROM primary_tb_replica;
     ```

# Commands

1. **Command 1**: **Check Active Replication Slots**

   - Check the currently **active replication** slots in your **PostgreSQL** database.
     ```sql
       SELECT * FROM pg_replication_slots;
     ```
   - This will display information about the **active replication connections**, including the **lag** and **state** of each **replication slot**.
   - Sample Output:
   - Where:
     - `slot_name`: The name of the **replication slot**. e.g., in this case the `slot_name` is called `debezium`
     - `plugin`: The logical decoding output plugin used for this slot. In this case, `Pplugin: pgoutput` indicates the slot is configured for **logical replication** using the **pgoutput** plugin. **Logical replication** allows replicating specific data
     - `slot_type`: The type of **replication slot**, which can be **physical** or **logical**.
     - `datoid`: The OID of the database this slot is associated with.
     - `database`: The name of the database this slot is associated with
     - `temporary`: Indicates if the slot is **temporary**. e.g., `f` (false) implies that this slot is not **temporary** and will persist even after a server restart.
     - `active`: Indicates if the slot is currently active. E.g., the `active` column with a value of `f` indicates that the **replication slot** is currently not being used by any **consumer** to replicate data.
     - `active_pid`: The process ID of the backend which is currently using this slot.
     - `xmin`: The oldest transaction ID that might be needed by this slot.
     - `catalog_xmin`: The oldest transaction ID that might be needed by the logical replication slot.
     - `restart_lsn`: The log sequence number (LSN) from which streaming replication will start.
     - `confirmed_flush_lsn`: The LSN up to which the client has confirmed receiving data.
     - `wal_status`: The status of the **Write-Ahead Logging** (**WAL**).
     - `safe_wal_size`: The size of WAL segments that are considered safe.
     - `two_phase`: Indicates if the slot supports two-phase commit
     - `conflicting`: Indicates if there are conflicting transactions.

2. **Commnad 2**: **Identify Active Connections**

   - Identify **active replication** connections and their **PIDs** by:
     ```sql
       SELECT * FROM pg_stat_replication;
     ```

3. **Command 3**: **Terminate the Active Replication Slot**

   - If you find that the **replication slot** "debezium" is **active** and you need to terminate it, you can use the **PID** to terminate the session.
     ```sql
         SELECT pg_terminate_backend(10196);
     ```

# Resources and Further Reading
