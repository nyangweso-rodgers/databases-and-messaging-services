# PostgreSQL

## Table Of Contents

# Introduction to PostgreSQL

- **PostgreSQL** is an free open-source database system that supports both relational (SQL) and non-relational (JSON) queries.

# A Brief History

- It began in 1986 as a research project at the University of California, Berkeley. The project aimed to create a database system that could handle complex data and relationships more effectively than existing systems.
- In 1995, the project added support for SQL, a standard language for working with databases, and was renamed PostgreSQL.

# How PostgreSQL Stores Data

- **Postgres** stores all its data in a directory sensibly called `/var/lib/postgresql/data`
- Example:

  - Let's spin up an empty Postgres installation with Docker and mount the data directory in a local folder so that we can see what’s going on in there
    ```sh
      docker run --rm -v ./pg-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=password postgres:16
    ```
  - Files created include:
    - When you start up a fresh Postgres server, **Postgres** will automatically create 3 databases for you. i.e.,:
      1. `postgres` – when you connect to a server, you need the name of a database to connect to, but you don’t always know what the name is. This is also true of database management tools. While it’s not strictly necessary, you can almost always rely on the postgres database existing – once you’ve connected to this empty, default database, you can list all the other databases on the server, create new databases, and so on.
      2. `template0`, `template1` – as the name suggests, these databases are templates used to create future databases.

# Troubleshooting Query Performance Issues in PostgreSQL

1. **Step 1**: Identify Slow Queries

   1. **Check the PostgreSQL Logs**

      - If query logging is enabled (`log_min_duration_statement`), you can find slow queries in logs.
        ```sh
          SHOW log_min_duration_statement;
        ```
      - If disabled, enable it in `postgresql.conf`:
        ```sh
          log_min_duration_statement = 1000  # Logs queries taking more than 1 second
        ```

   2. Use `pg_stat_statements` (Tracks Query Execution Stats)
      - Enable the `pg_stat_statements` extension (if not already enabled):
        ```sh
          CREATE EXTENSION pg_stat_statements;
        ```
      - Check the most time-consuming queries:
        ```sql
          SELECT query, calls, total_exec_time, mean_exec_time
          FROM pg_stat_statements
          ORDER BY total_exec_time DESC
          LIMIT 5;
        ```
      - What to Look For?
        - Queries with **high total execution time**
        - Queries **executed frequently** (**high calls count**)
        - Queries with **slow mean execution time**

2. **Step 2**: Analyze Query Execution Plan

   1. Use `EXPLAIN ANALYZE` to Understand Query Execution
      ```sql
        EXPLAIN ANALYZE
        SELECT * FROM orders WHERE status = 'pending';
      ```
      - Key Insights from the Output:
        - `Seq Scan` (Sequential Scan) → Bad for large tables
        - `Index Scan` → Better than sequential scan
        - `Bitmap Index Scan` → Optimal for large result sets
        - `Nested Loop` → Bad for large joins, consider indexing
        - `Sort` → Check if an index can avoid sorting
      - Example output: `Seq Scan on orders (cost=0.00..35000.00 rows=500000 width=100)`
      - Solution: Add an index on `status`: `CREATE INDEX idx_orders_status ON orders (status);`

3. **Step 3**: **Check Index Usage**

   1. Verify Index Usage with `pg_stat_user_indexes`
      - Find out if an index is being used:
        ```sql
          SELECT relname AS table_name, indexrelname AS index_name, idx_scan, idx_tup_read
          FROM pg_stat_user_indexes
          WHERE idx_scan = 0;
        ```
      - If `idx_scan = 0`, the index is not used, consider dropping it.
      - If reads (`idx_tup_read`) are high, the index is helping queries.

4. **Step 4**: **Check for Blocking Queries & Deadlocks**

   1. **Find Long-Running Queries**

      ```sql
        SELECT pid, age(clock_timestamp(), query_start) AS duration, query
        FROM pg_stat_activity
        WHERE state = 'active'
        ORDER BY duration DESC;
      ```

      - If a query is stuck for too long, consider:
        ```sql
          SELECT pg_terminate_backend(<PID>);
        ```

   2. **Check for Deadlocks**
      ```sql
        -- sql
        SELECT * FROM pg_locks WHERE granted = false;
      ```
      - Solution:
        - Reduce contention on frequently updated rows.
        - Use `FOR UPDATE SKIP LOCKED` to avoid waiting for locked rows.

5. **Step 5**: **Optimize PostgreSQL Performance**

   1. **Tune Work Memory for Better Sorting & Joins**

      - Check current `work_mem`
        ```sql
          -- sql
          SHOW work_mem;
        ```
      - Increase it for complex queries:
        ```sql
          --- sql
          SET work_mem = '64MB';  -- Adjust based on RAM
        ```

   2. **Vacuum & Analyze for Table Health**
      - PostgreSQL does not automatically reclaim dead tuples. Run:
        ```sql
          VACUUM ANALYZE;
        ```
      - Or for a specific table:
        ```sql
          VACUUM ANALYZE orders;
        ```

# PostgreSQL Best Practices

## 1. Database Design

1.  **Naming Conventions**

    - Consistent naming conventions make databases more maintainable and reduce confusion.
    - Here are recommended naming practices:
      - Tables Object Type:
        - Convention: Plural, snake_case
        - Examples: `users`, `order_items`
      - Columns Object Type:
        - Convention: Singular, snake_case
        - Examples: `first_name`, `created_at`
      - Primary Keys:
        - Convention: id or table_id
        - Examples: `id`, `user_id
      - Foreign Keys
        - Convention: referenced_table_singular_id
        - Examples: `user_id`, `order_id`
      - Indexes:
        - Convention: table_columns_idx
        - Example: `users_email_idx`
      - Functions:
        - Convention: verb_noun
        - Example: `calculate_total`

2.  **Schema Design**
    - Use appropriate data types (e.g., `UUID`, `JSONB`, `ARRAY`) to leverage Postgres features
    - Implement proper constraints (`NOT NULL`, `UNIQUE`, `CHECK`) to maintain data integrity
    - Consider partitioning large tables for better performance
    - Use schema namespacing to organize related tables (e.g., `auth.users`, `billing.invoices`)

## 2. Performance Optimization

1. **Indexing Strategies**: Proper indexing is crucial for query performance:

   1. Create indexes for frequently queried columns
   2. Use partial indexes for filtered queries
   3. Implement composite indexes for multi-column queries
   4. Consider covering indexes for frequently accessed columns
   5. Regularly analyze index usage and remove unused indexes

2. **Query Optimization**: Write efficient queries to maximize performance:
   1. Use `EXPLAIN ANALYZE` to understand query execution plans
   2. Avoid `SELECT *` and only retrieve needed columns
   3. Implement batch processing for large datasets
   4. Use materialized views for complex, frequently-accessed queries
   5. Leverage CTEs for better query organization

## 3. Security

1. **Access Control**: Implement proper access control measures:

   1. Use role-based access control (RBAC)
   2. Follow the principle of least privilege
   3. Implement row-level security when needed
   4. Regularly audit database access
   5. Use connection pooling with SSL encryption
   6. Use connection pooling with SSL encryption

      ```sql
        -- Enable row level security
        ALTER TABLE customer_data ENABLE ROW LEVEL SECURITY;

        -- Create policy
        CREATE POLICY customer_isolation_policy ON customer_data
            FOR ALL
            TO authenticated_users
            USING (organization_id = current_user_organization_id());
      ```

2. **Password Policies**: Enforce strong authentication:
   1. Use strong password hashing (e.g., SCRAM-SHA-256)
   2. Implement password rotation policies
   3. Store sensitive data encrypted
   4. Regularly audit user access and permissions
   5. Use SSL/TLS for all connections

## 4. Backup and Recovery

1. **Backup Strategy**: Implement a comprehensive backup strategy:

   1. Use `pg_dump` for logical backups
   2. Implement WAL archiving for point-in-time recovery
   3. Maintain multiple backup copies
   4. Regularly test backup restoration
   5. Document recovery procedures
   6. Example backup script:
      ```bash
        #!/bin/bash
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        pg_dump -Fc -d mydb -f "backup_${TIMESTAMP}.dump"
      ```

2. **Recovery Testing**: Regular recovery testing ensures business continuity:
   1. Test full database restoration quarterly
   2. Verify point-in-time recovery capabilities
   3. Document recovery time objectives (RTO)
   4. Train team members on recovery procedures
   5. Maintain updated recovery playbooks

## 5. Maintenance and Monitoring

1.  **Regular Maintenance**: Implement routine maintenance procedures:

    - Schedule regular VACUUM and ANALYZE operations
    - Monitor and manage table bloat
    - Archive or delete old data
    - Update statistics regularly
    - Monitor and manage index bloat

2.  **Monitoring Metrics**: Key metrics to monitor:

    1.  **Performance**:

        1. Query execution time,
        2. cache hit ratio,
        3. TPS

    2.  **Resource Usage**

        1.  CPU,
        2.  memory,
        3.  disk I/O,
        4.  connection count

    3.  **Database Size**:

        1. Table growth,
        2. index size,
        3. WAL size

    4.  **Replication**

        1.  Replication lag,
        2.  WAL generation rate

    5.  **Errors**
        1.  Failed connections,
        2.  deadlocks,
        3.  errors

## 6. Development Practices

1. **Version Control**: Maintain database changes in version control:

   - Use migration tools (e.g., Flyway, Liquibase)
   - Document schema changes
   - Include rollback procedures
   - Test migrations in staging
   - Maintain change history
   - Example migration file:

     ```sql
      -- V1.0.1__Add_user_status.sql
      ALTER TABLE users ADD COLUMN status varchar(50) DEFAULT 'active';
      CREATE INDEX users_status_idx ON users(status);

      -- Rollback
      -- ALTER TABLE users DROP COLUMN status;
     ```

2. **Code Organization**: Organize database code effectively:
   - Use stored procedures for complex logic
   - Implement proper error handling
   - Document functions and procedures
   - Use appropriate schema organization
   - Maintain consistent coding style

## 7. High Availability

1. **Replication Setup**: Configure proper replication:

   - Implement streaming replication
   - Consider logical replication for specific use cases
   - Monitor replication lag
   - Plan failover procedures
   - Test failover regularly
   - Example replication configuration:

     ```sql
      # primary postgresql.conf
      wal_level = replica
      max_wal_senders = 10
      max_replication_slots = 10

      # replica postgresql.conf
      hot_standby = on
      hot_standby_feedback = on
     ```

2. **Load Balancing**: Implement effective load balancing:
   - Use connection pooling (e.g., `PgBouncer`)
   - Configure read replicas
   - Implement service discovery
   - Monitor connection distribution
   - Plan for scaling

# Resources and Further Reading

1. [daily.dev - How Postgres stores data on disk – this one's a page turner](https://drew.silcock.dev/blog/how-postgres-stores-data-on-disk/?ref=dailydev)
2. [Speak Data Science - 7 Crucial PostgreSQL Best Practices](https://speakdatascience.com/postgresql-best-practices/?ref=dailydev)
