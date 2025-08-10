# Tranasactional Databases

# Table of Contents

# Database Concepts

# OLTP (online transactional processing) versus OLAP databases

- **OLTP databases** are designed for processing transactions. The most common transactions are: (i) read, (ii) insert, (iii) update and (iv) delete.

# Database Concepts

## Database Management Systems (DBMS)

- A **database management system** is software that allows users to formulate, manage, and interact with databases.

## SQL vs. NoSQL DBs

- **When to Choose NoSQL over SQL**

  - From backend point of view, question like:
    1.  Do I need to update multiple related pieces of data at once and guarantee consistency?
    2.  Is my data highly structured, or does it evolve with product requirements?
    3.  Are my queries mostly write-heavy, read-heavy, or mixed?
    4.  Will this system need to scale horizontally across regions or availability zones?
    5.  Is it more important to serve fast reads or guarantee strong data integrity?
  - When you frame it this way, you start seeing **SQL** and **NoSQL** not as competitors, but as different answers to different architectural constraints.
  - **Considerations for NoSQL over SQL include**:

    1. **Evolving Schemas Without Losing Sleep**

       - One of the quiet realities of backend development is how often our data structures change, not because of bad design, but because the product evolves. Think about user **profiles**. You start with a `name`, `email`, and maybe a `preferences` JSON. Over time, preferences grow into a monster: notification settings, language choices, privacy toggles, A/B test participation flags, third-party integrations. In a relational schema, this becomes a nightmare. Either you add dozens of nullable columns, or stuff everything into a JSONB field and lose the ability to query effectively.
       - In a **NoSQL** model, particularly with document stores, this evolution feels more natural. Each user document can carry only the fields that matter for that user. You don’t need to worry about updating thousands of rows when a new preference is introduced. You just start writing it into new documents. Your application logic is still responsible for validation but let’s be honest, you’re probably validating most of this stuff at the app layer anyway.
         ```json
          {
            "_id": ObjectId("..."),
            "email": "john@example.com",
            "name": "John Doe",
            "preferences": {
              "language": "en",
              "notifications": {
                "email": true,
                "sms": false
              },
              "beta_access": true
            }
          }
         ```
       - Now, new preferences are added as needed without modifying existing documents or running migrations. The key here is that **NoSQL** gives you schema flexibility without migrations. That’s not always good, it also means you need to be disciplined about what your documents look like. But when you’re iterating fast, or letting users define their own custom fields like in CMS platforms or form builders, this flexibility is a huge win.

    2. **Write-Heavy, Scale-Crushing Workloads, Where NoSQL Shines**
       - Imagine you’re running the backend for an IoT platform. Devices send temperature and humidity readings every few seconds. You’re ingesting millions of write operations per minute, and you need to store and query them efficiently. **SQL** can do this but it’s not built for this kind of brute-force ingestion at scale. You’ll eventually hit **write amplification issues**, **disk I/O bottlenecks**, and struggle with **partitioning** and **retention**. In SQL, appending billions of rows becomes painful.
       - Here, time-series optimized **NoSQL** systems like **InfluxDB** or wide-column stores like **Cassandra** can shine. These are built for high-throughput writes and efficient compaction. You can configure data expiration (TTL), shard by time windows, and store years of data in a footprint SQL can’t match. You sacrifice transactional guarantees, but for sensor data ingestion, that’s usually acceptable. You care more about availability and throughput than about consistency.
       - If you've ever tried to scale **PostgreSQL** to handle a billion rows of append-only data across multiple regions, you’ll appreciate what these systems are optimized for.

- **Trade-Offs when Choosing NoSQL over SQL**:

  - Choosing **NoSQL** doesn’t mean you get to skip thinking about **data modeling**, it just means the constraints are different. You need to plan your **indexes** up front. You need to think about access patterns ahead of time, because querying across non-indexed fields is expensive or outright unsupported. You don’t get joins, so you’ll often need to **duplicate** data across documents and you’ll be responsible for keeping it in sync when things change.
  - You also need to wrestle with eventual consistency. In systems like **DynamoDB** or **Couchbase**, it’s entirely possible for two users to see different values briefly, depending on replica sync. If you’re working on a banking or invoicing system, that’s probably unacceptable. But for a product catalog or a blog feed, it’s a small price to pay for scale and availability.

- **Choosing Both NoSQL and SQL**:
  - In practice, most mature backends don’t use just **SQL** or just **NoSQL**. You’ll see teams using **PostgreSQL** for transactional data like orders and payments, **MongoDB** for `product` metadata, **Redis** for ephemeral caching, and Elasticsearch for search queries. This is what we call **polyglot persistence**, using multiple storage technologies in the same system, each tuned to its specific use case.
  - It’s powerful, but it comes with its own complexity. You now have to maintain data across multiple systems. You may need to sync between them, eventually or in real time. Your team needs to be fluent in more than one database model. But when done right, this approach gives you the best of both worlds: transactional safety where you need it, and speed and flexibility where you don’t.

## Relational Databases

- For relational database scaling, you can throw more hardware at the problem (**vertical scaling**) or split data across machines (**horizontal scaling**). Both options come with cost and complexity. Scaling decisions also affect your reliability, performance, and how much your team can actually maintain long term. Say your PostgreSQL instance starts timing out during peak hours. **Replication**? **Indexing**? **Sharding**?
- **How to scale a relational database**

  1. **Vertical scaling: the obvious but limited option**

     - **Vertical scaling** is simple. Add more **CPU**, **memory**, or **SSDs** to your database server. It usually works—until it doesn’t.
     - If **CPU** is maxed, bump the instance size. If IOPS are the problem, switch to provisioned volumes. The upside: no app changes. The downside: there's always a ceiling. And the bill is more expensive each time.
     - Use vertical scaling early on. But as traffic grows or your dataset gets larger, it becomes a temporary band-aid rather than a long-term fix.

  2. **Indexing: the low-hanging fruit of performance**

     - **Indexes** are often the fastest way to fix performance without touching code. They work by creating shortcuts in how the DB finds data.
     - Options: **B-tree** (default), **hash**, **GIN** for full-text search, **BRIN** for time-series data, partial indexes to cover specific cases
     - But there’s no free lunch. **Indexes** slow down writes and increase storage. They also need maintenance.
     - Use **indexes** when read latency is your problem and the access pattern is predictable. Avoid blindly indexing every column—monitor query plans first.

  3. **Replication: scaling reads and ensuring high availability**

     - **Replication** lets you offload reads and improve availability. You copy data from a primary to one or more replicas. There are different modes—async, sync, semi-sync—and they each trade consistency for performance.
     - **Replication** helps in read-heavy workloads and HA setups. Just remember: writes still go to the primary, and **replication lag** can lead to stale reads. Design accordingly.

  4. **Caching: reducing DB pressure with faster intermediaries**

     - If replication handles read scale, caching handles read frequency. It’s about storing hot data closer to the user, often in memory with **Redis**, **Memcached**, or **AWS DAX**.
     - This is where you want to know if you have more reads or writes. If you are read-heavy, you can cache this data because it barely changes.
     - But caching is a trap if you don’t think through invalidation. You could end up with user-facing bugs because the TTLs weren’t tuned or updates didn’t invalidate correctly.
     - Use caching when the data changes slowly and read throughput matters. Be explicit about how it gets refreshed, and what happens on cache misses.

  5. **Denormalization: trading purity for performance**

     - **Denormalization** is about duplicating data across tables so you avoid joins at read time. It’s a tradeoff: speed in exchange for data duplication.
     - This works well for **analytics**, **dashboards**, or anything where performance matters more than consistency. But you have to think through update paths carefully.

  6. **Materialized views: precomputing expensive queries**

     - When you keep hitting expensive aggregations, materialized views are a win. You compute a complex query once and reuse the result.
     - It’s fast and predictable. But it can get stale if not refreshed correctly. You need a clear strategy for when and how to refresh, especially if data comes from many sources.

  7. **Partitioning: breaking large tables into smaller, manageable chunks**

     - **Partitioning** splits large tables into logical pieces based on a column like **date** or **region**. It’s a must for time-series data, logs, or anything that grows linearly.
     - Imagine having a logs table with over a billion rows. Once you partition it by month, queries drop from minutes to seconds. Archiving old data also became trivial. You can move them out of your database into a cold storage infrastructure, like **AWS S3 Glacier**.
     - But it adds schema complexity. You have to manage partition creation and avoid uneven data distribution.
     - Use partitioning when table size hurts query performance or cleanup. Especially when queries are scoped to recent data, and you keep old data for compliance and not for a customer's feature.

  8. **Sharding: horizontal write scaling with distributed data**

     - **Sharding** is the final boss of DB scaling. You split data across instances, often by a hash of a key like `user_id`. Each shard is like a smaller independent DB.
     - This scales writes and isolates load. But it comes with huge costs. No global transactions. No joins across shards. Complex migrations. You need smart query routing and automation.
     - Use sharding only when a single write node is the bottleneck and your data naturally segments.

  9. **Archiving: keep the hot path lean**

     - You don’t need all data online. **Archiving** moves cold data to slower, cheaper storage. It keeps your main DB fast and lean.
     - For example, archive orders older than two years to S3 or a separate database. The live DB stays fast. Archived data is still available if needed—just slower to access.
     - At Amazon, this comes up a lot. Teams often ignore cleanup, and databases get bloated. However, when a team configures a cold storage and some lifecycle rules to move data automatically, their bill becomes much cheaper.
     - Archive when you have clear retention rules and infrequent access. Build rehydration paths early to avoid surprises.

  10. **Connection Pooling**

      - **Connection pooling** is basic hygiene. Without it, your app will kill itself by opening new connections every request. Always pool.

  11. **Query Optimization**

      - Query optimization means using `EXPLAIN` oftne to identify the data access patterns, fixing bad joins, and rewriting slow queries.

  12. **Read-AfterWrite Patterns**
      - Read-after-write patterns matter if you use caching or replicas. If your app reads stale data after writing, try write-through caching or wait until replicas catch up. You can't think about a database without thinking in the application using it.

## 1. Columnar vs. Row-Oriented Database

- **Row-Oriented Databases**

  - **Row-oriented databases** store data one row at a time, making them ideal for **transactional workloads** (**online transaction processing** - **OLTP**). Each row represents a complete record, which means retrieving an entire entity—like a customer order or a financial transaction—is quick and efficient.
  - **Features**:

    1. **Data Sotorage**: Data is stored in rows, where each row represents a complete record, and each column stores a specific attribute of that record.

    2. **Query Performance**: Can be slower for read-heavy workloads as the entire row might need to be scanned for access. However, it's faster for write-heavy workloads as updates are limited to a single row.

    3. **Compression**: The presence of multiple data types in a row makes compression less efficient compared to **columnar databases**

    4. **Flexibility**: Flexible for schema changes.

  - **Examples**: The majority of popular solutions — MySQL, Postgres, SQLite — are all row-based. In each of these, data / objects are stored as rows, like a phone book.

- **Columnar Database**:

  - **Columnar databases** store data by **field**, grouping values from the same column together. This format excels in **analytical workloads** (online** analytical processing** - **OLAP**) because queries that involve aggregations or filtering across large datasets can scan only the necessary columns, avoiding unnecessary I/O.
  - **Features**:

    1. **Data Sotorage**: Data is stored by columns, with all the values of a particulr column grouped across different rows.

    2. **Query Performance**: Performs well for read-heavy workloads but slower for write-heavy workloads.

    3. **Compression**: Support efficient compression techniques like run-length encoding for repetitive values, reducing storage requirements.

    4. **Flexibility**: Less flexible for schema changes.

## 2. Database Locks

- In database management, **locks** are mechanisms that prevent concurrent access to data to ensure data integrity and consistency.
- Here are the common types of locks used in databases:
  1. Shared Lock (S Lock)
     - It allows multiple transactions to read a resource simultaneously but not modify it. Other transactions can also acquire a shared lock on the same resource.
  2. Exclusive Lock (X Lock)
     - It allows a transaction to both read and modify a resource. No other transaction can acquire any type of lock on the same resource while an exclusive lock is held.
  3. Update Lock (U Lock)
     - It is used to prevent a deadlock scenario when a transaction intends to update a resource.
  4. Schema Lock
     - It is used to protect the structure of database objects.
  5. Bulk Update Lock (BU Lock)
     - It is used during bulk insert operations to improve performance by reducing the number of locks required.
  6. Key-Range Lock
     - It is used in indexed data to prevent phantom reads (inserting new rows into a range that a transaction has already read).
  7. Row-Level Lock
     - It locks a specific row in a table, allowing other rows to be accessed concurrently.
  8. Page-Level Lock
     - It locks a specific page (a fixed-size block of data) in the database.
  9. Table-Level Lock
     - It locks an entire table. This is simple to implement but can reduce concurrency significantly.

## 3. Database Replication

- **Replication** is the process of keeping database copies in sync.
- There are two types of **replication** in **PostgreSQL**:
  1. Physical repication
  2. Logical replication

## 4. Database Indexing

- **Indexing** is a technique used in database management systems to improve the speed and efficiency of data retrieval operations. An **index** is a **data structure** that provides a quick way to look up rows in a table based on the values in one or more columns. **Database indexes** allow you to find specific data without searching through the entire database.
- Technically, an **index** is a **data structure** (usually a **B-tree** or a **hash table**) that stores the values of one or more columns in a way that allows for quick **searches**, **sorting**, and **filtering**. The **index** provides pointers to the actual rows in the database table where the data resides.

- **How Do Indexes Work?**

  - When you create an **index** on a column (or set of columns), the database creates a separate structure that contains two things:
    1. The values from the indexed column(s)
    2. Pointers to the corresponding rows in the table
  - This structure is sorted, which allows for fast searching, usually through an algorithm like **Binary Search**.
  - **Example**:
    - Let's use our **Books** table as an example. Say we frequently search for books by their publication **year**. Without an index, if we wanted to find all books published in 1997, the database would need to check the `PublicationYear` of every single book in the **Books** table. With millions of books, this could take a long time.

- **Types of Indexes**:

  1. **Primary Index** (**Unique Indexes**)

     - Automatically created when a **primary key** is defined. It uniquely identifies each row in the table.
     - For example, To define a **primary index** in a **Spring Boot application**, you need to annotate the **primary key** field in your entity class with the `@Id` annotation. This indicates that the field is the **primary key**, and most relational databases will automatically create an index on this column to optimize searches based on the primary key.
     - **Example**:
       - The primary key of a table automatically has a unique index.
       ```sql
         CREATE UNIQUE INDEX idx_unique_isbn ON Books (ISBN);
       ```
       - This prevents any two books from having the same ISBN, which makes sense as ISBN is supposed to be unique for each book.

  2. **Secondary Index**:

     - Created on columns that are not unique or are frequently used in queries for **filtering** or **sorting**.
     - For example, `@Table(indexes = @Index(...))` creates a **secondary index** on the `email` column with the name `idx_user_email`. This index will speed up queries that filter or sort by the email field.
       ```java
         @Entity
         @Table(
            name = "users",
            indexes = @Index(name = "idx_user_email", columnList = "email")
         )
         public class User {
            @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
            private Long id;
            private String name;
            private String email;
            // Getters and Setters
         }
       ```

  3. **Single-Column Indexes**:

     - These are created on just one column.
     - Example: An index on `PublicationYear` is a single-column index.

       ```sql
        CREATE INDEX idx_publication_year ON Books (PublicationYear);
       ```

     - This is useful when you frequently search or sort by this one column.

  4. **Multi-Column Indexes**:

     - These are created on two or more columns. They're useful for queries that frequently filter or sort by multiple columns.
     - Example:
       ```sql
        CREATE INDEX idx_author_year ON Books (AuthorID, PublicationYear);
       ```
     - This index would be useful for queries like:
       ```sql
        SELECT * FROM Books WHERE AuthorID = 1 AND PublicationYear > 2000;
       ```

  5. **Partial Indexes**:

     - These **index** only a subset of a table's data. They're useful when you frequently query for a specific subset of your data.
     - Example:

       ```sql
        CREATE INDEX idx_recent_books ON Books (PublicationYear) WHERE PublicationYear > 2000;
       ```

     - This index only includes books published after 2000. It's useful if you often query for recent books but rarely for older ones.

  6. **Clustered Index**

     - Sorts and stores the data rows of the table based on the **index key**. A table can have only one **clustered index** because the data rows can be sorted in only one order.
     - In many databases, the **primary key** is clustered by default, so if you want to cluster on a different column, you would need to use a specific SQL statement during database setup or use a custom annotation if your database supports it.
     - Custom SQL to Create a **Clustered Index** (For a **clustered index** on a non-primary key column, you’d usually execute a SQL script. Here’s how you might do it for a **MySQL** database)
       ```sql
         CREATE TABLE users (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255)
         );
         CREATE INDEX idx_users_name ON users(name);
         ALTER TABLE users DROP PRIMARY KEY, ADD PRIMARY KEY(name);
       ```
     - You can run this SQL script during your application startup using a `schema.sql` file in your `resources` directory, or manually in your database.

  7. **Non-clustered Index**
     - Contains a sorted list of values along with pointers to the data rows where the values are found. A table can have multiple **non-clustered indexes**.
     - Example: Create a Non-Clustered Index on the `name` column in a `User` entity.
       - `@Table(indexes = @Index(...))` annotation creates a **non-clustered index** on the `name` column, which will improve the performance of queries that filter or sort by the `name` field.
         ```java
            @Entity
            @Table(
               name = "users",
               indexes = @Index(name = "idx_user_name", columnList = "name")
            )
            public class User {
               @Id
               @GeneratedValue(strategy = GenerationType.IDENTITY)
               private Long id;
               private String name;
               private String email;
               // Getters and Setters
            }
         ```

- **How Indexing Improves Query Performance**:

  - **Faster data retrieval**: Indexex significantly speeds up data retrieval operations by reducing the amount of data the DBMS needs to scan.
  - **Efficient sorting and filtering**: indexes helps in quickly sorting and filtering data based on the index columns, which is especially useful for `ORDER BY`, `GROUP BY`, and `WHERE` clauses.
  - **Improved query performance**: properly indexed columns results in faster query execution times, leading to a more responsive application.
  - **Reduced I/O operations**: Indexes minimize the number of I/O operations needed to fetch data, as the DBMS can quickly narrow the location of the disired data without scaning the entire table.
  - **Better resource utilization**: By reducing the time taken to execute queries, indexes lead to a better utilization of server resources (CPU, memory) allowing the system to handle more queries and users simultaneously.
  - **Support for constraints**: Indexes are used to enforce unique constraints (like primary keys) in databases ensuring data integrity.
  - **Optimized data access patterns**: indexes enable the database to optimize complex queries, especially in large datasets, by efficiently managing data access patterns.

- **Creating an Index In PostgreSQL**

  - You create an index in SQL using the `CREATE INDEX` statement.
  - **Syntax**:
    ```sql
      CREATE INDEX index_name ON table_name (column1, column2, ...);
    ```
  - **Example 1**: Single Column Index on Year
    ```sql
      CREATE INDEX idx_customers_country on customers (country_code)
    ```
  - **Example 2**: Multi-column index
    ```sql
      CREATE INDEX idx_customers_country on customers (country_code, year)
    ```

- **The Cost of Indexes**: While **indexes** can dramatically speed up data retrieval, they come with some costs:

  1. **Storage**: Each index requires additional storage space. It's essentially creating a copy of the indexed data plus the row pointers. For large tables, this can add up to a significant amount of extra storage.
  2. **Write Performance**: When you `insert`, `update`, or `delete` data in an **indexed column**, the database also needs to update the index. This means write operations (`INSERT`, `UPDATE`, `DELETE`) can be slower on tables with many indexes.
  3. **Maintenance**: As your data changes over time, **indexes** may become fragmented or unbalanced, which can reduce their effectiveness. Periodically, indexes may need to be rebuilt or reorganized to maintain their efficiency.
  4. **Query Optimizer Overhead**: The database's query optimizer must consider all available indexes when planning to execute a query. Having too many indexes can actually slow down this planning phase.

- **When to Use Indexes**:

  1. **Columns used in `WHERE` clauses**:

     - If you often search for books by their publication year, indexing the PublicationYear column can help.
     - For example:
       ```sql
        SELECT * FROM Books WHERE PublicationYear = 2023;
       ```
     - With the `idx_books_year` index, this query can quickly find the relevant rows without scanning the entire table.

  2. **Columns used in `JOIN` conditions**:

     - If you frequently join the `Books` and `Authors` tables on `AuthorID`, indexing this column in both tables can speed up these operations.
     - For example:
       ```sql
        SELECT Books.Title, Authors.Name
        FROM Books
        JOIN Authors ON Books.AuthorID = Authors.AuthorID;
       ```
     - Having indexes on `Books.AuthorID` and `Authors.AuthorID` can significantly speed up this join operation.

  3. **Columns used in `ORDER BY` clauses**:

     - If you often sort books by price, an index on the Price column can help.
     - For example:

       ```sql
        SELECT * FROM Books ORDER BY Price DESC;
       ```

     - An index on `Price` would allow the database to retrieve the rows in sorted order without having to perform a separate sorting operation.

  4. **Columns with a high degree of uniqueness**:

     - Indexing a column like ISBN, or any unique IDs for each book, can be very effective. Searches on this column can quickly narrow down to a single row:
       ```sql
        SELECT * FROM Books WHERE ISBN = '9780747532743';
       ```

  5. **Foreign key columns**:
     - These are often used in joins, so indexing them can improve performance.

- **Remarks**:
  - Don't create indexes on columns that are updated frequently. The overhead of updating the index might outweigh the benefits.
  - Small tables (less than a few hundred rows) might not benefit much from indexing, as a full table scan might be just as fast.
  - An index might not be helpful if a column has very low selectivity (i.e., most queries retrieve a large percentage of the rows). For example, if you have a Gender column with only 'M' and 'F' values, an index probably won't help much.

## 5. Database Sharding

- **Sharding** is the process of scaling a database by spreading out the data across multiple servers, or **shards**. **Sharding** is the go-to database scaling solution for many large organizations managing data at petabyte scale

- **Basics of sharding**:

  - Most small-scale web applications will have one or more **application servers** that connect to a single, monolithic database server. The applications store all persistent data on this single server, and send queries to it to meet application needs. This includes user account information and whatever other data the application needs in order to operate.This kind of architecture works well for low-demand systems that only need to make a few hundred or a few thousand queries per second.
  - However, popular software apps often have hundreds of thousands of concurrent users. In some cases, these applications need to store petabytes of information in the database and process millions of queries per second at peak hours. Such huge workloads demand **spreading out our database across many servers**, rather than just one. **Sharding** is a popular solution to this problem.
  - In a **sharded database**, we will have multiple separate database servers, each with a portion of the total data.
  - With this setup, the code running on the application server has to be aware of all of the **shards**, know which rows are stored where, and keep a connection open to each. This is not a huge problem with only two **shards**, but it becomes complex when there are hundreds of them. Storing this logic in the application code can quickly become messy and difficult to maintain.
  - A better option is to have the **app servers** connect to an intermediary server that we call a **proxy**. When an **application server** needs to use the database, it will send queries to a **proxy**. The **proxy** is then responsible for routing the query to the correct **shard server**

- **Types of Sharding** (**Logical vs Physical Sharding**):

  - When you start with **sharding**, you generally start with **logical shards** (also known as **partitions**). Most databases have out-of-the-box support for partitioning.
  - **Logical shards** are horizontal partitions of your data based on some strategy. They sit on the same database instance or server. However, when a single database instance is not able to handle the workload even after partitioning, you need to go for **physical sharding**.
  - In **physical sharding**, each shard is hosted on a different node or server instance. However, a **physical shard** can contain one or more **logical shards**.

- **Sharding Strategy** (How does the data get sharded?):

  - The **sharding strategy** is the set of rules used to determine which rows of data go to which **shards**.
  - Typically, your **sharding strategy** will involve selecting a **shard key**: the **column**(s) that you use to determine where each row will reside. The **sharding strategy** and shard key you choose have a huge impact on how evenly the data is distributed across **shards** as well as query performance.
  - Options includes:

    1. **Range sharding** (**Range-Based Sharding**):

       - In a **Range sharding strategy**, the **proxy** layer decides where each row should go based on pre-defined ranges of values.
       - For example, say we have **4 shards** and want to use the `user_id` (the number in the first column of each row) as our **sharding key**. In such a setup, we could say that all rows with ID 1-25 go to the **first shard**, 26-50 to the **second shard**, 51-75 to the **third shard**, and 76-100 to the **fourth**.
       - Using naive range-based sharding with IDs is generally a bad idea if our IDs are monotonically increasing.

    2. **Hash sharding** (**Key-Based Sharding**)

       - This is One of the most popular sharding strategies.
       - Here, we choose a column to be our **shard key** and we generate a cryptographic hash of this value for each row that needs to be inserted. Each **shard** is responsible for storing the rows for a range of hashes, and this process is controlled by the **proxy servers**.
       - For example, let's say we will run the **shard key** column through a simple algorithm that always produces a hash between 0 and 100. Hashes 0 - 25 go to the **first shard**, 26-50 go to the second, 51-75 to the third, and 76-100 to the fourth. The nice thing about hashes is that similar inputs can produce very different outputs. We might pass in the name "`joseph`" and get hash 45, but the name "`josephine`" produces 28. Similar names, completely different hashes. This means similar values may end up on totally different servers, a good property to help the data get evenly spread out.
       - This seems to work well, but is it optimal? With **hash sharding**, how do we know what column to choose as our **shard key**?
       - Ideally, we want something with high **cardinality**. The `name` column is not the ideal choice. There may be very popular names, and even with hashing we might end up with hotter servers than others.
       - Often a column like `user_id` is a good choice because each value is unique. We also get the added benefit of hash speed. It's faster to hash a fixed-size integer as compared to a variable-width name string.
       - A very simple hash function might look as below:
         ```js
         function shardNumber(num, numShards) {
           const shardSize = Math.ceil(num / numShards);
           return Math.floor(num / shardSize);
         }
         ```
       - Designing Hash Function (Few things to keep in mind while designing a hash function for sharding)
         - Try to make the hash function fast and efficient.
         - The hash function should result in a uniform distribution of keys.
         - Make the hash function deterministic. i.e., it should always produce the same output for a given input.

    3. **Directory-Based Sharding**:
       - In this strategy, you perform **sharding** based on a **lookup table**.
       - Think of this table as a directory (similar to an address book) that holds the relation between the data and the specific shard where you can find it. Hence, the name **directory-based sharding**.
       - Data from the **shard key** is written to a lookup table that maps the key to a particular shard.
       - The main benefit of **directory-based sharding** is higher flexibility when compared to the other strategies.

- **Benefits of Sharding**:

  - Sharding helps you achieve horizontal scaling or scaling out of the database.
  - With sharding, you can reduce query response times since the queries run on a smaller set of data.
  - Sharding also helps make an application more reliable. Even if a **shard** goes down, the entire application does not stop functioning.

- **Drawbacks of Sharding**:

  - Sharding makes your application quite complex. Instead of one place, the data is scattered across multiple servers.
  - Even after you have implemented a great sharding strategy, the shards can get unbalanced over time resulting in hotspots.
  - With sharding, you can practically say goodbye to joining data across multiple shards.

- **Considerations for Sharding**:
  - Some key considerations you should have before you decide to use **sharding**:
  - When to go for sharding?
    - At the bare minimum, you should not go for premature sharding.
    - Sharding is a complex business and it should never be the first option on the table when your application faces problems with database scalability.
    - You should look at sharding only when you have exhausted other options like proper **indexing**, **replication**, and **partitioning**.
  - **Choosing a Strategy Based on Type of Requests**:
    - If reads are more important, you should go for a sharding strategy that prioritizes query performance. One approach to support this is to use a range-based sharding strategy that results in more efficient range queries and results in faster query execution.
    - If writes are more important, your sharding strategy should prioritize write throughput and data consistency. i.e., you can choose a shard key that distributes writes evenly across shards and minimizes the likelihood of hotspots. A **hash-based sharding strategy** can help with this.
    - Another approach can be to use a time-based sharding strategy where data is partitioned based on time intervals such as hours or days. This can help distribute write operations evenly. Discord uses this time-based sharding strategy to handle trillions of messages.

# Query Optimization Techniques

1. **Use Specific Column Names**

   - Instead of using `SELECT *`, specify only the columns you need. This reduces the amount of data that needs to be retrieved and transmitted.

     ```sql
      -- Less efficient
      SELECT * FROM <table_name> WHERE <field_name> = 1;

      -- More efficient
      SELECT col1, col2 FROM <table_name> WHERE <field_name> = 1;
     ```

2. **Optimize JOINs**

   - **Joins** can be expensive operations, especially when dealing with large tables. Here are some tips for optimizing joins:
     1. Use appropriate join types: Make sure you're using the right type of join for your query. `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN` all have different use cases.
     2. **Join** on **indexed columns**: Ensure that the columns you're joining on are indexed in both tables.
     3. **Consider the order of joins**: In complex queries with multiple joins, the order of the joins can affect performance. Generally, start with the largest tables and join to progressively smaller ones.

3. **Use LIMIT to Restrict Results**

   - If you don't need all results, use LIMIT to restrict the number of rows returned. This can significantly reduce the amount of data processed and returned.

4. **Use `EXISTS` Instead of `IN` for Subqueries**

   - Generally, `EXISTS` is more efficient than `IN` for large datasets. `EXISTS` stops when it finds a match, while `IN` evaluates the entire subquery.

     ```sql
      -- Less efficient for large datasets
      SELECT * FROM Authors WHERE AuthorID IN (SELECT AuthorID FROM Books WHERE Price > 20);

      -- More efficient for large datasets
      SELECT * FROM Authors WHERE EXISTS (SELECT 1 FROM Books WHERE Books.AuthorID = Authors.AuthorID AND Price > 20);
     ```

5. **Avoid Correlated Subqueries**

   - Correlated subqueries can be slow because they must be re-executed for each row in the main query. Often, they can be rewritten as joins.

     ```sql
      -- Correlated subquery (less efficient)
      SELECT Title FROM Books b
      WHERE Price > (SELECT AVG(Price) FROM Books WHERE AuthorID = b.AuthorID);

      -- Join (more efficient)
      SELECT b.Title
      FROM Books b
      JOIN (SELECT AuthorID, AVG(Price) as AvgPrice FROM Books GROUP BY AuthorID) a
      ON b.AuthorID = a.AuthorID
      WHERE b.Price > a.AvgPrice;
     ```

6. **Optimize `GROUP BY` Queries**

   - When using `GROUP BY`, ensure you have indexes on the grouped columns.
   - Also, if you're grouping by multiple columns, the order of columns in your index should match the order in your `GROUP BY` clause for optimal performance.

     ```sql
      CREATE INDEX idx_author_genre ON Books (AuthorID, Genre);

      SELECT AuthorID, Genre, AVG(Price) as AvgPrice
      FROM Books
      GROUP BY AuthorID, Genre;
     ```

# Resources and Further Reading

1. [daily.dev - How Indexing Enhances Query Performance](https://digma.ai/how-indexing-enhances-query-performance/?ref=dailydev)
2. [daily.dev - Database Sharding](https://planetscale.com/blog/database-sharding?ref=dailydev)
3. [daily.dev - Database Sharding](https://newsletter.systemdesigncodex.com/p/database-sharding?ref=dailydev)
4. [daily.dev - Indexing and Performance Optimization](https://www.codu.co/articles/indexing-and-performance-optimization-fqpwri3y?ref=dailydev)
5. [daily.dev - How to scale a relational database](https://strategizeyourcareer.com/p/how-to-scale-a-relational-database?ref=dailydev)
6. [When to Choose NoSQL Over SQL](https://hevalhazalkurt.com/blog/when-to-choose-nosql-over-sql/?ref=dailydev)
