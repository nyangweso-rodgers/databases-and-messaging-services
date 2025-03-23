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

## 2. ClickHouse Cloud

- The advantage of the hosted version, is that users won’t have to manage a complex database system themselves. The system will automatically handle **sharding**, **replication** and **upgrading**. Auto-scaling, too, is built into ClickHouse Cloud

## Data Types

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
