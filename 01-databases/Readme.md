# Tranasactional Databases

# Table of Contents

# Database Concepts

# OLTP (online transactional processing) versus OLAP databases

- **OLTP databases** are designed for processing transactions. The most common transactions are: (i) read, (ii) insert, (iii) update and (iv) delete.

# Database Concepts

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
