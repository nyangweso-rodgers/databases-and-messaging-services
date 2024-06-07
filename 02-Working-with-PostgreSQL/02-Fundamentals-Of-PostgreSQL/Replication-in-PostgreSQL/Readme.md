# Replication in PostgreSQL

# What is replication?

- **Replication** is the process of keeping database copies in sync.
- There are two types of **replication** in **PostgreSQL**:
  1. Physical repication
  2. Logical replication

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

# Step 1: Setup Docker Compose

- Define postgreSQL instance:

  ```yml
  services:
    ############################################################################
    # postgres DB
    #
    postgres:
      image: postgres:latest
      container_name: postgres
      hostname: postgres
      restart: always
      ports:
        - "5432:5432"
      env_file:
        - .env
      environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      command: ["postgres", "-c", "wal_level=logical"]
      volumes:
        - postgres_volume:/var/lib/postgresql/data
      healthcheck:
      #test: ["CMD", "psql", "-U", "postgres", "-c", "SELECT 1"]
      test:
        [
          "CMD-SHELL",
          "PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -d ${POSTGRES_TEST_DB} -c 'SELECT 1'",
        ]
      interval: 10s
      timeout: 5s
      retries: 5
    ############################################################################
    # pgadmin
    #
    pgadmin:
      image: dpage/pgadmin4
      container_name: postgres-pgadmin
      ports:
        - "5050:80"
      env_file:
        - .env
      environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_DEFAULT_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_DEFAULT_PASSWORD}
      volumes:
        - pgadmin_volume:/var/lib/pgadmin
      depends_on:
        - postgres
    volumes:
      postgres_volume:
        name: postgres_volume
        driver: local
      pgadmin_volume:
        name: pgadmin_volume
        driver: local
  ```

- Where:
  - For `test: ["CMD-SHELL", "PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -d ${POSTGRES_TEST_DB} -c 'SELECT 1'"]` command:
    - `CMD-SHELL`: Allows running shell commands, which is necessary to set the `PGPASSWORD` environment variable inline.
    - `PGPASSWORD=${POSTGRES_PASSWORD}`: Sets the `PGPASSWORD` environment variable to the value of `POSTGRES_PASSWORD`, which is read by `psql` to authenticate without prompting for a password.
    - `psql -U ${POSTGRES_USER} -d ${POSTGRES_TEST_DB} -c 'SELECT 1'`: Runs the psql command to connect to the specified database as the specified user and execute a simple query (SELECT 1), which is a common way to check if the database is responding.
- Remarks:
- Check `wal_level`:

  ```sh
  #psql
  show wal_level;
  ```

# Steps to Logical Replication in PostgreSQL using `psql`

## Step 1: Create a new empty database

- Create a new empty target database where you want to replicate the specific tables.

# Display Information About Active Replication

```sh
  #psql
  SELECT * FROM pg_stat_replication;
```

- This will display information about the active replication connections, including the lag and state of each replication slot.
- When a **publication** is created, the **publication** information will be added to **pg_publication catalogue table**:
  ```sh
    #psql
    select * from pg_publication;
  ```
- Information about **table publication** is added to **pg_publication_rel catalog table**:
  ```sh
    #psql
    select * from pg_publication_rel;
  ```
- Information about **schema publications** is added to **pg_publication_namespace catalog table**:
  ```sh
    #psql
    select * from pg_publication_namespace;
  ```
- When a **subscription** is created, the **subscription** information will be added to the **pg_subscription catalog table**:
  ```sh
    #psql
    select * from pg_subscription;
  ```
- The **publication** relations will be added to the **pg_subscription_rel catalog tables**:
  ```sh
    #psql
    select * from pg_subscription_rel;
  ```
- The **subscriber** connects to the **publisher** and creates a replication slot, whose information is available in **pg_replication_slots**:
  ```sh
    #psql
    select * from pg_replication_slots;
  ```
- **Subscribers** add the **subscription** stats information to **pg_stat_subscription**
  ```sh
    #psql
    select * from pg_stat_subscription;
  ```
