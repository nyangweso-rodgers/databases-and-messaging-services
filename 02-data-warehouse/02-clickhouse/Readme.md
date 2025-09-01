# ClickHouse

## Table Of Contents

# Overview Of ClickHouse

- **ClickHouse** is an open-source column-oriented database management system developed by **Yandex** in 2009 to power **Yandex**. It is designed to provide high performance for analytical queries. Released as open-source software in 2016, it has rapidly become one of the fastest-growing and most celebrated databases, processing over 13 trillion records and handling more than 20 billion events daily.

- **Featutes**: **ClickHouse** stands out as a powerful columnar database management system designed for **online analytical processing** (**OLAP**) workloads.
  1. Columnar Storage and Compression
  2. Real-Time Analytics Capabilities
  3. Vectorized Query Execution
  4. Scalability and Distributed Architecture
  5. SQL Compatibility and Ecosystem Integration

# Architecture Of ClickHouse

1. **Columnar Storage Format**

   - Unlike traditional row-oriented databases, **ClickHouse** stores data by **columns** rather than **rows**. This approach offers several advantages:
     - Reduced I/O: Only the necessary columns for a query are read from storage, minimizing disk operations.
     - Improved Compression: Column-wise storage allows for better data compression, as similar data types are grouped together
     - Efficient Analytical Queries: Columnar format is optimized for aggregations and scans over large datasets.

2. **Vectorized Query Execution**

   - ClickHouse employs vectorized query execution, processing data in batches or chunks:
     - Multiple rows are processed simultaneously, leveraging modern CPU capabilities
     - This approach minimizes the overhead of handling individual values and maximizes CPU efficiency through SIMD (Single Instruction, Multiple Data) operations.

3. **Distributed Query Processing**

   - **ClickHouse’s** architecture supports distributed query execution:

     1. Query Analysis: The system analyzes the query structure and identifies relevant tables and sections.
     2. Query Parsing: The query is divided into optimal fragments.
     3. Query Optimization: The system selects the most efficient execution plan.
     4. Query Routing: Query fragments are routed to relevant nodes holding the required.
     5. Parallel Execution: Query fragments are processed in parallel across nodes
     6. Data Aggregation: Results from different nodes are merged to produce the final output.

   - Query Flow:

     1. Client submits a query through one of the entry points.
     2. The query is routed through the load balancer to an available ClickHouse node.
     3. The Query Parser interprets the SQL statement.
     4. The Query Optimizer creates an efficient execution plan.
     5. For distributed setups, the Distributed Query Planner splits the query across nodes.
     6. The Vectorized Execution Engine retrieves data from Columnar Storage via Storage Engines.
     7. Data Processors apply operations on the retrieved data.
     8. Results are aggregated in the Result Aggregator.
     9. The final result is sent back to the client.

   - Component details :
     1. Client Entry Points (HTTP/TCP/CLI): These are the interfaces through which clients can interact with ClickHouse. Supported protocols include HTTP, native TCP, and command-line interface (CLI).
     2. Load Balancer/Router: Distributes incoming queries across multiple ClickHouse nodes for better performance and high availability.
     3. Query Parser: Analyzes and interprets the incoming SQL queries.
     4. Query Optimizer: Creates an efficient execution plan for the parsed query.
     5. Distributed Query Planner: Determines how to split and execute the query across multiple nodes in a distributed setup.
     6. Columnar Storage: The underlying data storage format optimized for analytical workloads.
     7. Storage Engines: Manage how data is physically stored and retrieved (e.g., MergeTree family).
     8. Vectorized Execution Engine: Processes data in batches (vectors) for improved CPU efficiency.
     9. Data Processors: Handle operations like filtering, aggregation, and transformations on the data.
     10. Result Aggregator: Combines partial results from different nodes or processors into the final output.

# ClickHouse Concepts

## 1. ClickHouse Table Engines

- **ClickHouse** provides multiple **table engines**, each designed to address different data storage and processing requirements:

  1. **MergeTree**

     - **MergeTree** is the default **table engine** in **ClickHouse**. It's designed for inserting a very large amount of data into a table. The data is written to the table part by part, then rules are applied for merging the parts in the background. This method is much more efficient than continually rewriting the data in storage during insert.
     - **MergeTree tables** are sorted by a **primary key**, and data is stored in sorted order, enabling high-performance range queries and efficient data compression.
     - MergeTree limitations for production clusters
       - The **MergeTree engine** can't synchronize data between **replicas**.
       - If you want to use replication in your cluster, use the **ReplicatedMergeTree** engine. It's specifically designed to handle data replication and synchronization within **shards**, thus providing better performance and fault tolerance.
     - To set up this table engine, use the following syntax in your `CREATE TABLE` query:
       ```sql
        -- sql
        ENGINE = MergeTree()
       ```

  2. **ReplicatedMergeTree**

     - **ReplicatedMergeTree** is an extension of the **MergeTree engine** designed to optimize data **replication** and fault tolerance. It's used when high availability and durability are essential. **ReplicatedMergeTree** creates multiple replicas per shard, ensuring data redundancy and automatic synchronization across replicas.
     - Remark: Recommended option for multi-replica sharded clusters
     - Every **MergeTree** family table engine has a replicated version
     - To set up this table engine, use the following syntax in your `CREATE TABLE` query:
       ```sql
        ENGINE = ReplicatedMergeTree()
       ```

  3. **ReplicatedAggregatingMergeTree**

     - **ReplicatedAggregatingMergeTree** is an extension of the **MergeTree engine** designed for pre-aggregated data storage. It combines the benefits of **ReplicatedMergeTree** with automatic pre-aggregation, allowing you to store and query pre-computed aggregate data efficiently. It's commonly used for time-series data analysis or reporting applications.
     - To set up this table engine, use the following syntax in your `CREATE TABLE` query:
       ```sql
        -- sql
        ENGINE = ReplicatedAggregatingMergeTree()
       ```

  4. **ReplicatedCollapsingMergeTree**

     - **ReplicatedCollapsingMergeTree** is an extension of the **ReplicatedMergeTree** engine used to store and query time-series data with collapsing capability. It allows you to efficiently collapse duplicate or redundant rows in a dataset, reducing storage requirements.
     - To set up this table engine, use the following syntax in your `CREATE TABLE` query:
       ```sql
        -- sql
        ENGINE = ReplicatedCollapsingMergeTree()
       ```

  5. **ReplicatedSummingMergeTree**
     - **ReplicatedSummingMergeTree** is used for efficient storage and retrieval of data with pre-computed sum values. It's suitable for scenarios where aggregating and retrieving the sum of certain columns is a frequent operation.
     - To set up this table engine, use the following syntax in your `CREATE TABLE` query:
       ```sql
        -- sql
        ENGINE = ReplicatedSummingMergeTree()
       ```

## 2. Primary Key

- **ClickHouse** indexes are based on **Sparse Indexing**, an alternative to the **B-Tree index** utilized by traditional **DBMSs**. In **B-tree**, every row is indexed, which is suitable for locating and updating a single row, also known as **pointy-queries** common in OLTP tasks. This comes with the cost of poor performance on high-volume insert speed and high memory and storage consumption. On the contrary, the **sparse index** splits data into multiple parts, each group by a fixed portion called **granules**. **ClickHouse** considers an index for every **granule** (**group of data**) instead of every row, and that’s where the **sparse index** term comes from. Having a query filtered on the primary keys, **ClickHouse** looks for those **granules** and loads the matched **granules** in parallel to the memory. That brings a notable performance on range queries common in OLAP tasks. Additionally, as data is stored in **columns** in multiple files, it can be compressed, resulting in much less storage consumption.
- The nature of the **spars-index** is based on **LSM trees** allowing you to insert high-volume data per second. All these come with the cost of not being suitable for pointy queries, which is not the purpose of the **ClickHouse**.

## 3. Partition Key

- Create a table by specifying **partition key**:

  ```sql
    CREATE TABLE default.projects_partitioned
    (

        `project_id` UInt32,

        `name` String,

        `created_date` Date
    )
    ENGINE = MergeTree
    PARTITION BY toYYYYMM(created_date)
    PRIMARY KEY (created_date, project_id)
    ORDER BY (created_date, project_id, name)
  ```

  - Here, **ClickHouse** partitions data based on the **month** of the `created_date`:

## 4. Materialized View in Clickhouse

- **Definitions and purpose**:

  - **Materialized views** in **ClickHouse** are a powerful feature that can significantly enhance query performance and data processing efficiency.
  - A **materialized view** in **ClickHouse** is essentially a trigger that runs a query on blocks of data as they are inserted into a source table.
  - The results of this query are then stored in a separate “target” table.
  - This allows for precomputation of aggregations, transformations, or complex calculations, shifting the computational burden from query time to insert time.

- **Features**:

  - Unlike traditional **materialized views** in some databases, **ClickHouse materialized views** are updated in real-time as data flows into the source table.
  - By querying **materialized views** instead of raw data, resource-intensive calculations are offloaded to the initial view creation process.
  - This can drastically reduce query execution time, especially for complex analytical queries.

- **Use Cases**:

  1. Materialized views are particularly useful for real-time analytics dashboards, where instant insights from large volumes of data are required.
  2. They can precompute aggregations, perform data transformations, or filter data for specific use cases.

- **Considerations**:

  - While **materialized views** offer significant performance benefits, they do consume additional CPU, memory, and disk resources as data is processed and written into the new form.

- **Types of Materialized Views in ClickHouse**: ClickHouse offers several types of materialized views based on different storage engines:

  1. **AggregatingMergeTree**

     - Best for aggregation operations
     - Maintains running totals and counts
     - Example:
       ```sql
        CREATE MATERIALIZED VIEW view_name
        ENGINE = AggregatingMergeTree()
        ORDER BY key_column
        AS SELECT
            key_column,
            aggregateFunction(value_column)
        FROM source_table
        GROUP BY key_column;
       ```

  2. **SummingMergeTree**:

     - Optimized for summing operations
     - Automatically combines rows with the same primary key
     - Example:
       ```sql
        CREATE MATERIALIZED VIEW view_name
        ENGINE = SummingMergeTree()
        ORDER BY key_column
        AS SELECT
            key_column,
            sum(value_column) as total
        FROM source_table
        GROUP BY key_column;
       ```

  3. **ReplacingMergeTree**
     - Keeps only the latest version of each row
     - Useful for deduplication
     - Example:
       ```sql
        CREATE MATERIALIZED VIEW view_name
        ENGINE = ReplacingMergeTree(version_column)
        ORDER BY key_column
        AS SELECT * FROM source_table;
       ```

## 5. System Tables

- **ClickHouse** has a lot of tables with internal information or meta data.
- Show all **system tables** by:
  ```sql
    SHOW TABLES FROM system
  ```

## 6. ClickHouse Cloud

- The advantage of the hosted version, is that users won’t have to manage a complex database system themselves. The system will automatically handle **sharding**, **replication** and **upgrading**. Auto-scaling, too, is built into ClickHouse Cloud

## 7. ETL Tools for ClickHouse

1. Airbyte
2. Apache NiFi
3. Debezium
4. dbt (Data Build Tool)
5. Custom Python Scripts
6. Kafka Connect with ClickHouse Sink
7. pg2ch
8. Flink
9. ClickHouse’s Built-in MySQL and PostgreSQL Engines
10. Logstash
11. Metabase (for Ad-hoc ETL)
12. Custom Shell Scripts
    - You can use shell scripts with tools like `mysqldump`, `pg_dump`, and `curl` to extract data and load it into ClickHouse.

# Data Types

1. `Int` and `UInt`
2. `Float32`, `Float64`, and `BFloat16`
3. `Decimal`
4. `String`
5. `FixedString(N)`
6. `Date`
7. `Date32`
8. `DateTime`
9. `DateTime64`
10. `Enum`
11. `Bool`
12. `UUID`
13. `Object Data Type`
14. `IPv4`
15. `IPv6`
16. `Array(T)`
17. `Tuple(T1, T2, ...)`
18. `Map(K, V)`
19. `Variant(T1, T2, ...)`
20. `LowCardinality(T)`
21. `Nullable(T)`
22. `AggregateFunction`
23. `SimpleAggregateFunction`
24. `Geometric`
25. Special Data Types
    1. Expression
    2. Set
    3. Nothing
    4. Interval
26. Data types binary encoding specification
27. Domains
28. Nested
29. Dynamic
30. JSON

# Resources abd Further Reading

1. [clickhouse.com - MergeTree](https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree)
