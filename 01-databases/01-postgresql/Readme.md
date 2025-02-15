# PostgreSQL

## Table Of Contents

# Introduction to PostgreSQL

- **PostgreSQL** is an free open-source database system that supports both relational (SQL) and non-relational (JSON) queries.

# A Brief History

- It began in 1986 as a research project at the University of California, Berkeley. The project aimed to create a database system that could handle complex data and relationships more effectively than existing systems.
- In 1995, the project added support for SQL, a standard language for working with databases, and was renamed PostgreSQL.

# How PostgreSQL Stores Data

- Postgres stores all its data in a directory sensibly called `/var/lib/postgresql/data`
- Example:
  - Let's spin up an empty Postgres installation with Docker and mount the data directory in a local folder so that we can see what’s going on in there
    ```sh
      docker run --rm -v ./pg-data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=password postgres:16
    ```
  - Files created include:
    - When you start up a fresh Postgres server, **Postgres** will automatically create 3 databases for you. i.e.,:
      1. `postgres` – when you connect to a server, you need the name of a database to connect to, but you don’t always know what the name is. This is also true of database management tools. While it’s not strictly necessary, you can almost always rely on the postgres database existing – once you’ve connected to this empty, default database, you can list all the other databases on the server, create new databases, and so on.
      2. `template0`, `template1` – as the name suggests, these databases are templates used to create future databases.

# Why PostgreSQL for Web Development?

1. It's Reliable and Keeps Your Data Safe
2. It Can Handle Growth
3. It's Fast
4. It's Flexible
   - Web applications often need to handle different types of data. You might need to store simple text, numbers, dates, or more complex data like geographic locations or custom data types.
   - Its powerful extension system allows you to add new features and capabilities to the database. This is like having a customizable toolbox where you can add specialized tools as your needs grow. Here are some popular extensions to give you an idea of some additional powers you can add (if your project needs it):
     - **PostGIS**: This extension adds support for geographic objects, allowing you to run location queries in SQL. It's incredibly useful for applications that work with maps or location data, like a store locator or a real estate website.
     - **pg_cron**: This extension allows you to schedule PostgreSQL commands to run periodically, similar to cron jobs in Unix systems. It's great for routine database maintenance tasks or regular data updates.
     - \*pgcrypto: This extension provides cryptographic functions, allowing you to perform encryption operations directly in the database. It's useful for applications that need to store sensitive data securely.
     - **full_text_search**: While PostgreSQL has built-in text search capabilities, this extension enhances them further, providing more advanced search features like stemming and ranking.
5. It's Free and Well-Supported

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

# Resources and Further Reading

1. [daily.dev - How Postgres stores data on disk – this one's a page turner](https://drew.silcock.dev/blog/how-postgres-stores-data-on-disk/?ref=dailydev)
