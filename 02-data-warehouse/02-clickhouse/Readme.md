# ClickHouse

## Table Of Contents

# Concepts

## ClickHouse Table Engines

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
