# PostgreSQL

## Table Of Contents

# Introduction to PostgreSQL

- **PostgreSQL** is an free open-source database system that supports both relational (SQL) and non-relational (JSON) queries.
- **Brief History**
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

- **PostgreSQL vs. MySQL**

  - **PostgreSQL** shines for complex, write-heavy workloads, rich data types, and ACID compliance. **MySQL** is fast, lightweight, and perfect for read-heavy web apps and MVPs.
  - **MySQL** is purely relational, and it prioritizes simplicity and speed above all else. It’s worth noting, however, that JSON support gives it semi-structured capabilities. **PostgreSQL** is more complex and primarily an object-relational database. Because it’s incredibly feature-rich and extensible, **PostgreSQL** is often preferred when handling complex queries and write-intensive workloads.
  - **Core Features and Capabilities**:

    1. **Standard Compliance**

       - Among all open-source **RDBMS**, **PostgreSQL** is arguably the most SQL compliant. Not only does it adhere strictly to **ANSI SQL** standards, but it also natively supports advanced SQL features like **window functions**, **recursive queries**, **partial indexes**, and **full-text search**.
       - While extremely popular, **MySQL** is known to make trade-offs on SQL compliance for performance and ease of use. Recent versions have had significant improvements, but there’s still a noticeable lack of support for quite a few advanced SQL constructs. This is especially apparent when using **non-InnoDB engines**.

    2. **Extensibility**

       - Extensibility is PostgreSQL’s beating heart. Want to define custom data types, operators, indexing methods, and even load extensions like PostGIS for spatial data? It's easy.
       - **MySQL** is a little less extensible in comparison. While there are plugins, creating and deploying them requires deeper internal knowledge and might even limit you to built-in syntax and storage engines.

    3. **Indexing Options**:

       - **PostgreSQL** supports diverse index types, including:
         - B-tree (default)
         - GIN (generalized inverted index)
         - GiST, BRIN, SP-GiST
         - Partial indexes and expression-based indexes
       - **MySQL** supports two popular indexes: **B-tree** and **full-text** indexes ( e.g., **InnoDB supports FULLTEXT**). The latter might have some limitations, though, depending on the storage engine used.

    4. **Views**

       - Does **PostgreSQL** support both **regular** and **materialized views**? The answer is a resounding yes. Both are pre-computed and stored for swift read access. Because you can refresh them on demand, they’re particularly ideal for expensive joins or aggregations.
       - As for **MySQL**, it only supports non-materialized access. That means query execution is on access.

    5. **ACID Compliance and Transaction Support**:

       - **PostgreSQL** takes compliance seriously. It’s no different for **ACID** principles (**atomicity**, **consistency**, **isolation**, **durability**). This means, regardless of an error or failure, **PostgreSQL** will facilitate full transaction isolation. Yes, even serializable for the most demanding use cases—think financial systems, compliance-heavy environments, and enterprise-grade audit trails.
       - **MySQL** also supports **ACID** transactions using the **InnoDB storage engine**. Its **MyISAM engine**, however, is not ACID-compliant, which can confuse users if switched. When it comes to MySQL’s default configurations, they tend to lean more toward speed over strict isolation

    6. **Architecture and Design Philosophy**:
       - **PostgreSQL** follows a process-based architecture, where each connection spawns a new **OS process**. It might sound rather complex, but the upside of PostgreSQL’s design is the level of stability it provides. Put differently, a faulty connection cannot crash the server whatsoever. The only downside is the high memory it’ll require.
       - **MySQL** is built on a **thread-based architecture**. This scales well for thousands of lightweight connections. Because MySQL’s design consumes less memory per connection, it’s a perfect fit for web apps with multiple concurrent users.

  - **Key Differences Between PostgreSQL and MySQL**:

    1. **Data Types and Storage Options**

       - **PostgreSQL** has the upper hand because it supports a wider range of data types, both native and custom:
         - **JSON** and **JSONB** (binary JSON with indexing support)
         - **Arrays**, **HSTORE** (key-value store), UUID, XML, IP address types
         - Custom types and domains for schema-specific validation
       - Does that mean **MySQL’s** options are limited? Not really. In fact, it supports most common types (INT, VARCHAR, DATE, etc.). It recently introduced JSON in version 5.7 as well. That said, it falls short in two key areas: indexing JSON and supporting array data types natively.

    2. **Query Processing and Optimization**

       - **PostgreSQL** utilizes a powerful, do-it-all query planner and optimizer. This optimizer supports everything from **CTEs** and **windows functions** to custom indexing (such as **GIN**, **GiST**, **BRIN**).
       - **MySQL’s** query optimizer, in comparison, works well for simpler queries and benefits from consistent schema usage. However, as the table grows, it might struggle with more complex joins.
       - I.e., **PostgreSQL** handles complex analytical workloads better, while **MySQL** is best suited to straightforward, no-frills **online transaction processing** (**OLTP**).

    3. **Concurrent Control Methods**:
       - Both use **multi-version concurrency control** (**MVCC**). However, there are noteworthy differences in their implementation.
       - **PostgreSQL’s MVCC** is incredibly robust. It supports not just fine-grained row-level locks and snapshot isolation, but more advanced control over deadlocks and transaction consistency as well.
       - **MySQL’s MVCC** (via **InnoDB**) thrives on undo logs, but its isolation levels are quite limited compared to its counterpart.

  - **Performance Comparison and Benchmarks**

    1. **Read vs. Write Operations**:

       - When it comes to R/W, MySQL’s speed is blazingly fast. It performs especially well for read-heavy applications like CMSs, forums, and dashboards with high query volumes and low data write rates.
       - For write-heavy workloads, **PostgreSQL** is the clear winner. Compared to **MySQL**, it handles complex transactions, indexing, and triggers much better.

    2. **Complex Query Handling**

       - PostgreSQL's execution engine and optimizer are miles ahead when dealing with:
         - Recursive queries
         - Multi-level joins
         - Subqueries and nested SELECTs
         - Materialized views
       - For **MySQL** to reach similar performance levels, it typically requires **denormalization** or application-layer workarounds.

    3. **Resource Utilization Metrics**
       - **PostgreSQL** might be consuming more memory per process due to its intricate architecture, but its process isolation more than makes up for it. How? By increasing stability.
       - **MySQL**, to its credit, has a much smaller memory footprint. That makes it ideal for shared hosting or containers with limited resources.

  - **Database Features and Capabilities**:

    1. **JSON and NoSQL Support**:

       - **PostgreSQL’s JSONB** is as good as binary-formatted data types get. It's so versatile that it doubles up as a document store on top of being a hybrid RDBMS. With it, you can:
         - Index deeply nested keys
         - Run JSONPath queries
         - Store logs, telemetry, or user settings without schema changes
       - **MySQL’s** JSON support is improving, but it still lacks native indexing and advanced query capabilities.

    2. **Stored Procedures and Functions**

       - **PostgreSQL** supports stored procedures in a bevy of languages, including:
         - PL.pgSQL
         - Python
         - JavaScript
         - C
         - SQL
       - While **MySQL** supports stored functionality in SQL, it’s often with limited functionality and language support.
       - So, **PostgreSQL** has the edge when it comes to advanced logic encapsulation inside the database layer.

    3. **Replication and High Availability**
       - **PostgreSQL** shines here yet again. It supports **streaming replication**, **logical replication**, and **hot standby**. It enables multi-master setups and zero-downtime schema changes as well. PostgreSQL’s multi-master does require third-party tooling like BDR or Citus.
       - **MySQL** facilitates **group replication**, **multi-source replication**, and **read replicas**, but it tends to fall short on the **logical replication front**. The latter is somewhat limited in scope.
       - I.e., both **PostgreSQL** vs **MySQL** can clock high levels of availability. But it’s PostgreSQL that allows for more granular control.

  - **Scalability and Enterprise Readiness**:

    1. **Horizontal vs. Vertical Scaling**:

       - **PostgreSQL** can be called upon when you want support for **table partitioning**, **sharding** (via **Citus** or native features), and parallel queries.
       - **MySQL** is a worthwhile selection to execute horizontal scaling with read replicas and clustering (MySQL Cluster). However, multi-writer setups are more complex.

    2. **Cloud Platform Integration**

       - Both **PostgreSQL** and **MySQL** enjoy full support from AWS, Azure, and GCP through managed services like **RDS**, **Cloud SQL**, and **Aurora**.
       - **PostgreSQL** stands out for better standards compliance and integration with cloud-native tooling like **Kubernetes** and **Terraform**.
       - **MySQL** isn’t any less impressive, providing strong support for LAMP stacks and lightweight cloud deployments.

    3. **AWS Aurora Compatibility**
       - Both **PostgreSQL** and **MySQL** are compatible with **AWS Aurora**.
       - If you want a managed version of **PostgreSQL** with superior performance output, that’d be **Aurora PostgreSQL**. **Aurora MySQL**, on the other hand, is renowned for enhanced replication and quicker failovers.
       - Do both support high availability out-of-the-box? Yes, but there’s a caveat: PostgreSQL’s feature set in Aurora is closer to vanilla PostgreSQL than MySQL’s Aurora is to stock MySQL.

  - **Framework Integration and Support**

    1.  **Django Database Backend**

        - **PostgreSQL** boasts such a feature-rich SQL dialect that it’s now become the default and recommended backend for Django.
        - While Django does support MySQL, the relationship is not without hiccups. Some ORM features require PostgreSQL to function fully.

    2.  **Laravel Application Development**

        - **Laravel** supports both effectively. However, **PostgreSQL** slightly edges MySQL due to the fact that it enables more eloquent ORM capabilities and better handling of JSON and constraints.

    3.  **Popular ORM Compatibility**
        - Both PostgreSQL vs MySQL enjoy ample, unrelenting support across:
          - SQLAlchemy
          - Hibernate
          - Doctrine
          - Prisma

  - **Security Features Comparison**

    1. **Authentication Methods**:

       - **PostgreSQL**: Password, LDAP, Kerberos, SSL certs, and more
       - **MySQL**: Password, LDAP (Enterprise), PAM

    2. **Access Control Systems**:

       - **PostgreSQL**: Granular roles, row-level security, policy enforcement
       - **MySQL**: User privileges at schema/table level

    3. **Encryption Capabilities**
       - PostgreSQL: SSL in transit; at-rest via file system or extensions
       - MySQL: SSL in transit; at-rest encryption available only in Enterprise edition

  - **When to Choose PostgreSQL vs MySQL**:

    1. **Choose PostgreSQL when**:

       - Handling applications that demand stringent ACID compliance and strong data consistency
       - Looking for support for sophisticated queries, JSON/NoSQL data, or geospatial analytics
       - Using a tech stack that includes Django, Rails, or advanced analytics tools that could greatly benefit from PostgreSQL’s extensibility

    2. **Choose MySQL when**:
       - Prioritizing performance for read-heavy workloads like CMS platforms, blogs, or e-commerce
       - Requiring simplicity and quick setup, such as when you're developing an MVP or launching a startup
       - Using applications heavily dependent on the LAMP stack or widely used tools such WordPress

  - **Industry-Specific Requirements**:

    - Fintech and insurance often opt for PostgreSQL for its strict consistency and auditing features.
    - Healthcare organizations deeply value PostgreSQL’s support for its above-part encryption and **row-level security** (**RLS**).
    - Government and public sector organizations need open-source transparency, fine-grained access controls, and robust disaster recovery —the exact areas where PostgreSQL thrives.
    - Media and retail companies prefer MySQL for speed and simplicity at scale.
    - Startups and SaaS companies need fast, simple, and lightweight solutions for MVPs or transactional apps, all MySQL strongholds.
    - Marketing and ad tech teams gravitate toward MySQL because of how well it supports high-traffic dashboards and real-time reporting systems.

# PostgreSQL Concepts

## 1. Postgres Schema

- **PostgreSQL schemas** are **namespaces** within a **single database** — and they allow you to organize **database objects** (like **tables**, **views**, **functions**) logically, without needing to create multiple databases.
- By default, **PostgreSQL** creates a `public` schema in every database, and everything goes there unless you say otherwise. But in a production data stack, grouping by schema improves **clarity**, **security**, and **manageability**. For example, we might have:

  1. `raw`: Contains raw ingested data from sources like MySQL, APIs, etc.
  2. `staging`: Cleaned or lightly transformed data for modeling.
  3. `analytics`: Final curated datasets for BI dashboards.
  4. `internal_ops`: Back-office operational data.

- **Examples**:
  1. Create `finance` schema:
     - If you want to create schemas manually, run:
       ```sql
        CREATE SCHEMA sales;
       ```
     - Then create a table in one:
       ```sql
        CREATE TABLE finance.invoices (
          invoice_id SERIAL PRIMARY KEY,
          amount NUMERIC,
          issued_at TIMESTAMP
       );
       ```
     - You can now access it like:
       ```sql
        SELECT * FROM finance.invoices;
       ```

## 2. Views vs Materialized views

- A **view** is a saved query. It is not stored on the disk. It dynamically fetches data from the underlying tables whenever queried. Since views do not have their own storage, views cannot have **indexes**.
- **Materialized views** do not dynamically fetch data from underlying tables- they are stored on disk - and must be explicitly refreshed to update the contents. This makes them ideal for scenarios involving complex queries or frequent access to relatively static datasets. Because they can be stored on disk, materialized views can be indexed.

- **Examplaes** (**Building a materialized view with indexes**):

  1. **Example 1** (**shows recent product sales by sku**):

     - Suppose we have `products`, `orders`, `product_orders` database tables, We’d like to show how often this product has been purchased. This is helpful for marketing the product but we don’t need to recalculate this from the database every time a product is displayed. So static information in a materialized view is perfect for this use case. Pre-joining tables and having this ready to go will make queries to the sku really easy.
       ```sql
         -- sql
         CREATE MATERIALIZED VIEW recent_product_sales AS
         SELECT
             p.sku,
             SUM(po.qty) AS total_quantity
         FROM
             products p
             JOIN product_orders po ON p.sku = po.sku
             JOIN orders o ON po.order_id = o.order_id
         WHERE
             o.status = 'Shipped'
         GROUP BY
             p.sku
         ORDER BY
             2 DESC;
       ```
     - We will likely be looking this up by sku, so we can add a simple **b-tree index**, calling out the materialized view like we would a table.
       ```sql
         -- sql
         CREATE INDEX sku_index ON recent_product_sales (sku);
       ```
     - Creating indexes for materialized views works exactly like it does with tables. Postgres supports all the major index types, **B-tree**, **hast**, **GiST**, **GIN**, **BRIN**, and others on materialized views.

- **Refreshing our materialized view and indexes**: Materialized views are static, so to add new data, we have to refresh it. There’s two ways Postgres can refresh a materialized view. A regular refresh and one done concurrently.

  1. **Non-Concurrent (locking) refresh**

     - This refresh completely replaces the content of the materialized view. The index you built prior to this remain and Postgres will recreate the index with the refreshed data.
     - Postgres acquires an exclusive lock on the materialized view during this refresh, preventing any reads or writes. This is the fastest option but it often won’t work for production systems with live reads coming in.
       ```sql
        -- sql
        REFRESH MATERIALIZED VIEW recent_product_sales;
       ```
     - In addition to building the materialized view, Postgres will have to rebuild the index from scratch. Depending on data size, this can be a pretty long operation.

  2. **Concurrent (non-locking) refresh**
     - This refresh will update the materialized view without locking the table, letting you read currently while the refresh is happening. This utilizes the Postgres reindex concurrently too if you’re familiar with that feature. Postgres will reindex everything as the data is refreshed. This is normally slower than a regular refresh due to the incremental approach but allowing reads during the process makes it the favorable option for production databases.
     - Concurrent refresh **requires a unique index** on the materialized view to function. The unique index ensures that each row in the materialized view can be uniquely identified. The b-tree index we added earlier has not been explicitly declared as unique, so we can add a new unique index and drop the old one.
       ```sql
        -- sql
        CREATE UNIQUE INDEX unique_idx_recent_product_sales ON recent_product_sales(sku);
        DROP INDEX sku_index ON recent_product_sales(sku);
       ```
     - Now we can do our concurrent refresh:
       ```sql
        -- sql
        REFRESH MATERIALIZED VIEW CONCURRENTLY recent_product_sales;
       ```
     - Materialized views that generate columns with non-unique values cannot use unique indexes - and cannot use the concurrent refresh option. In that case, you’ll have to work around it with the regular refresh.

## 3. Indexing in PostgreSQL

- **Index Types in PostgreSQL**:

  1. **B-Tree Index**

     - **Data Structure**: The **B - Tree** (balanced multi-way search tree) is a self-balanced tree structure. Each node in it can have multiple child nodes (multi-way). Usually, a **B - Tree node** contains multiple key-value pairs and pointers to child nodes. For example, an m-order **B - Tree** node can have at most m child nodes, and at least ⌈m/2⌉ child nodes (except for the root node).
     - **Principle**: The **B - Tree index** is the most commonly used index type and is suitable for most data types. With its balanced tree structure, it can efficiently perform range queries, equality queries, and sorting operations. When performing a query, it starts from the root node, and recursively searches downward according to the size relationship of the key values until the target node is found or it is determined that the target does not exist.
     - **Application Scenarios**:
       1. **Equality Query (=)**: When you need to find a specific value, the **B - Tree** can quickly locate the node containing that value. For example, in the user table, find the user with user ID 100.
       2. **Range Query (>, <, >=, <=)**: For queries that need to find values within a certain range, the **B - Tree** can use its orderliness to efficiently locate the start and end nodes of the range, and then traverse these nodes to obtain the results. For instance, find users whose age is between 20 and 30.
       3. **Sorting Operation (ORDER BY)**: Since the key values in the **B - Tree** are stored in an ordered manner, the index can be directly used for sorting, avoiding additional sorting operations on the data and improving the sorting efficiency.
     - Creation Statement
       ```sql
        CREATE INDEX idx_btree ON table_name (column_name);
       ```

  2. **Hash Index**

     - **Data Structure**: The **Hash index** uses a hash table structure. It maps the key values to a slot in the hash table through a hash function. The hash table is usually an array, and each slot can store one or more key-value pairs. When a hash conflict occurs, the linked list method or open addressing method is usually used to handle it.
     - **Principle**: The **Hash index** converts the key values into a fixed-length hash code through the **hash function**, and then finds the corresponding slot according to the hash code. It is only suitable for equality queries because the hash function cannot guarantee the order of the key values, so it does not support range queries and sorting operations.
     - **Application Scenarios**:
       1. **Equality Query (=)**: When you need to precisely match a certain value, the **Hash index** can quickly calculate the slot through the **hash function**, thereby locating the target data. For example, in the cache table, find the value corresponding to a specific cache key.
     - Creation Statement
       ```sql
        CREATE INDEX idx_hash ON table_name USING hash (column_name);
       ```

  3. **GiST Index**
     - **Data Structure**: **GiST** (**Generalized Search Tree**) is a general search tree structure. Its nodes can store different types of data and operator classes. Each node usually contains multiple key-value pairs and pointers to child nodes, and can perform customized splitting and merging operations according to different data types and operators.
     - **Principle**: The **GiST index** is a general index structure that supports multiple data types and operator classes. It organizes the data into a tree structure by recursively dividing the data space, thus achieving efficient queries. When performing a query, according to the query conditions and operator classes, it starts from the root node and recursively searches downward until the nodes that meet the conditions are found.
     - **Application Scenarios**:
       1. **Full-text Search**: Text data can be tokenized, and then the **GiST index** can be used to store and query these tokens. For example, perform keyword search in the article table.
       2. **Geometric Data Query**: For geometric data such as points, lines, and planes, the GiST index can efficiently handle spatial queries such as containment and intersection. For instance, find all the points of interest within a certain area in a map application.
       3. **Multidimensional Data Query**: It is suitable for handling multidimensional data such as multidimensional arrays and vectors. For example, query high-dimensional feature vectors in a machine learning application.
     - Creation Statement
       ```sql
        CREATE INDEX idx_gist ON table_name USING gist (column_name);
       ```
  4. **SP - GiST Index**

     - **Data Structure**: **SP - GiST** (**Space - Partitioned GiST**) is a space-partitioned **GiST index**. It organizes the data into a tree structure by partitioning the data space. Each node contains multiple partitions and pointers to child nodes, and the partitions can be dynamically adjusted according to the distribution of the data.
     - **Principle**: The **SP - GiST index** is suitable for handling unbalanced data distribution. It partitions the data space and evenly distributes the data to different nodes, thereby improving the query efficiency. When performing a query, according to the query conditions and partition information, it starts from the root node and recursively searches downward until the nodes that meet the conditions are found.
     - **Application Scenarios**:
       1. **Multidimensional Data Query**: For multidimensional data such as **multidimensional arrays** and **vectors**, the **SP - GiST index** can partition the data according to the distribution of the data, improving the query efficiency. For example, query multidimensional geographical data in a geographic information system.
       2. **Sparse Data Query**: When there is a large amount of sparse data in the dataset, the SP - GiST index can effectively handle this data and avoid the performance problems of traditional indexes when dealing with sparse data.
     - Creation Statement
       ```sql
        CREATE INDEX idx_spgist ON table_name USING spgist (column_name);
       ```

  5. **GIN Index**

     - **Data Structure**: **GIN** (**Generalized Inverted Index**) is an inverted index. It records the occurrence positions of each key value in a list. Specifically, it maintains a mapping from key values to a list of document IDs, where the document IDs represent the records that contain that key value.
     - **Principle**: The **GIN index** is suitable for multi-valued columns and full-text search. It achieves efficient queries by recording the occurrence positions of each key value. When performing a query, according to the query conditions, it finds the corresponding key value, and then obtains the list of document IDs that contain that key value, thereby locating the target data.
     - **Application Scenarios**:
       1. **Array Query**: When a certain column in the table is of array type, the **GIN index** can efficiently query arrays that contain specific elements. For example, find products that contain specific tags in the product table.
       2. **JSON Data Query**: For **JSON data**, the **GIN index** can index the key-value pairs in **JSON**, thereby achieving efficient JSON data queries. For example, find users with specific attributes in the user table.
       3. **Full-text Search**: The GIN index can tokenize text data and then record the occurrence positions of each token, achieving efficient full-text search. For example, perform keyword search in the news table.
     - Creation Statement
       ```sql
        CREATE INDEX idx_gin ON table_name USING gin (column_name);
       ```

  6. **BRIN Index**

     - **Data Structure**: **BRIN** (**Block Range INdex**) is a block range index. It reduces the size of the index by storing the minimum and maximum values of each data block. The index file is composed of a series of block range entries, and each entry contains the starting block number, ending block number, minimum value, and maximum value of a data block.
     - **Principle**: The **BRIN index** is suitable for very large tables. By storing the minimum and maximum values of each block range, when performing a query, it can quickly determine whether a data block may contain data that meets the query conditions, thereby reducing the number of data blocks that need to be scanned. However, since it only records the boundary information of the block range, the query performance is relatively low.
     - **Application Scenarios**:
       1. **Very Large Tables**: When the table has a large amount of data, using the **BRIN index** can significantly reduce the storage space of the index and improve the maintenance efficiency of the index. For example, store a large number of log records in the log table.
       2. **Data Inserted in Order**: If the data is inserted in order, the data in adjacent data blocks has a certain order, and the BRIN index can play a better role. For example, in time series data, data inserted in chronological order can be efficiently queried using the **BRIN index**.
     - Creation Statement
       ```sql
        CREATE INDEX idx_brin ON table_name USING brin (column_name);
       ```

  7. **Bitmap Index**

     - **Data Structure**: The **Bitmap index** uses a bitmap structure. For each different key value, it maintains a bitmap, and each bit of the bitmap corresponds to a record. If a bit is 1, it means that the corresponding record contains that key value; if it is 0, it means it does not contain it.
     - **Principle**: The **Bitmap index** is suitable for columns with **low cardinality** (i.e., there are few different values in the column). It realizes efficient combined queries of multiple conditions through bit operations of the bitmap. When performing a query, according to the query conditions, it finds the corresponding bitmap, then performs bit operations to obtain the bitmap of the records that meet the conditions, and finally locates the target data according to the bitmap.
     - **Application Scenarios**:
       1. **Low Cardinality Columns**: When there are few different values in the column, using the Bitmap index can significantly reduce the storage space of the index and improve the query efficiency. For example, in the gender column, there are only two values, "male" and "female".
       2. **Combined Queries of Multiple Conditions**: The **Bitmap index** is very effective for combined queries of multiple conditions because it can quickly merge the bitmaps of multiple conditions through bit operations to obtain the final query result. For example, in the user table, find users who are female and whose age is between 20 and 30.
     - Creation Statement
       ```sql
        -- PostgreSQL itself does not have a direct syntax for creating a Bitmap index, but a similar effect can be achieved by combining B - Tree indexes
        CREATE INDEX idx_bitmap ON table_name (column_name);
       ```

  8. **Partial Index**

     - **Data Structure**: The data structure of the **Partial index** is the same as that of a **common index**, except that it only creates an index for a part of the data in the table. It only includes the data that meets the condition by adding a conditional expression.
     - **Principle**: The **Partial index** reduces the size and maintenance cost of the **index** by only creating an index for part of the data, and improves the efficiency of the index. When performing a query, only the data that meets the conditions will be indexed, thereby reducing unnecessary index scans.
     - **Application Scenarios**:
       1. **Index Only a Part of the Data**: When you only need to index a part of the data in the table, you can use the Partial index. For example, in the user table, only index active users.
       2. **Improve Index Efficiency**: By reducing the amount of data in the index, the Partial index can improve the query and maintenance efficiency of the index. For example, in the log table, only index the logs of the most recent month.
     - Creation Statement
       ```sql
        CREATE INDEX idx_partial ON table_name (column_name) WHERE condition;
       ```

  9. **Unique Index**
     - Data Structure
       - The data structure of the **Unique index** is the same as that of a common index, and usually uses a **B - Tree** or other suitable index structure.
       - Its characteristic is to ensure that all values in the index column are unique.
     - **Principle**: The **Unique index** checks whether the values in the index column are unique when inserting or updating data to ensure that all values in the index column are unique. If the uniqueness constraint is violated, the operation will be rejected.
     - **Application Scenarios**
       1. **Primary Key Constraint**: The **Unique index** can be used to implement the **primary key** constraint to ensure that each row in the table has a unique identifier. For example, use the user ID as the primary key in the user table.
       2. **Unique Constraint**: When you need to ensure that the values in a certain column are unique but it is not the primary key, you can use the Unique index. For example, use the email address as a unique constraint in the email table.
     - Creation Statement
       ```sql
        CREATE UNIQUE INDEX idx_unique ON table_name (column_name);
       ```

## 3. Postgres Extensions

1. `PostGIS`

   - **What it does**: Transforms PostgreSQL into a database system that can efficiently handle **spatial data**. It introduces additional data types such as `geometry`, `geography`, `raster`, and more, along with a suite of functions, operators, and indexing capabilities tailored to these spatial types.
   - **Use case**: IoT applications, location-based services, and geospatial analysis.
   - Installation:
     ```sql
      CREATE EXTENSION postgis;
     ```
   - **PostGIS sample query** (We want to know: “How many taxis picked up passengers within 400 meters of Times Square on New Year’s Day 2016?”):
     ```sql
      -- How many taxis picked up rides within 400m of Times Square on New Years Day?
      -- Times Square coordinates: (40.7589, -73.9851)
      SELECT time_bucket('30 minutes', pickup_datetime) AS thirty_min, COUNT(*) AS near_times_sq
      FROM rides
      WHERE ST_Distance(pickup_geom, ST_Transform(ST_SetSRID(ST_MakePoint(-73.9851,40.7589),4326),2163)) < 400
      AND pickup_datetime < '2016-01-01 14:00'
      GROUP BY thirty_min ORDER BY thirty_min
      LIMIT 5;
     ```

2. `pg_stat_statements`

   - **What it does**: Tracks execution statistics for all queries executed by a Postgres database. It'll help you debug queries, identify slow queries, and generally give you deeper information about how your queries are running.
   - **Use Case**: Performance tuning and identifying slow queries.
   - Installation:
     ```sql
      CREATE EXTENSION pg_stat_statements;
     ```
   - **Pg_stat_statements sample query** (What are the top 5 I/O-intensive SELECT queries?)
     ```sql
      SELECT query, calls, total_time, rows, shared_blks_hit, shared_blks_read
      FROM pg_stat_statements
      WHERE query LIKE 'SELECT%'
      ORDER BY shared_blks_read DESC, calls DESC
      LIMIT 5;
     ```

3. `pgcrypto`

   - **What it does**: Adds cryptographic functions to PostgreSQL for encryption, hashing, and more.
   - **Use Case**: Secure storage of sensitive data and password management.
   - Installation:
     ```sql
      CREATE EXTENSION pgcrypto;
     ```
   - **Pgcrypto sample query** (Here’s how you might use `pgcrypto` to encrypt and decrypt data. Let’s say you want to store encrypted user passwords. First, you would encrypt a password when inserting it into a table:)
     ```sql
      INSERT INTO users (username, password) VALUES ('john_doe', crypt('my_secure_password', gen_salt('bf')));
     ```
   - In this statement, `crypt` is a function provided by `pgcrypto` that encrypts the password using the **Blowfish algorithm**, which is indicated by `gen_salt`('`bf`')
   - Next, to authenticate a user, you would compare a stored password against one provided during login:
     ```sql
      SELECT username FROM users WHERE username = 'john_doe' AND password = crypt('input_password')
     ```

4. `pg_partman`

   - **What it does**: Simplifies the creation and management of **table partitions**. Partitioning is a key database technique that involves splitting a large table into smaller, more manageable pieces while allowing you to access the data as if it were one table.
   - **Use Case**: This automation is particularly useful for large, time-series datasets that can grow rapidly.
   - Installation:
     ```sql
      CREATE EXTENSION pg_partman;
     ```
   - **Pg_partman sample query** (Consider a scenario where you have a large table of IoT device data that you want to partition by day. Here’s how you might set up a daily partition scheme for a table called device_data using `pg_partman`:)

     ```sql
      -- Create a parent table
      CREATE TABLE device_data (
          time timestamptz NOT NULL,
          device_id int NOT NULL,
          data jsonb NOT NULL
      );

      -- Set up pg_partman to manage daily partitions of the device_data table
      SELECT partman.create_parent('public.device_data', 'time', 'partman', 'daily');
     ```

   - In this setup, `create_parent` is a function provided by pg_partman that takes the parent table name and the column to partition on (time), as well as the schema (partman) and the partition interval (daily).

5. `postgres_fdw`

   - **What it does**: Allows you to use a **Foreign Data Wrapper** to access tables on remote Postgres servers (hence the name "fdw"). A **Foreign Data Wrapper** lets you create proxies for data stored in other Postgres databases to query them as if they were coming from a table in the current database.
   - **Use Case**: Distributed databases and multi-server setups.
   - Installation:
     ```sql
      CREATE EXTENSION postgres_fdw;
     ```
   - **Postgres_fdw sample query** (**Here’s how you create a connection to your foreign server:**)
     ```sql
      CREATE SERVER myserver FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '123.45.67.8', dbname ‘postgres’, port '5432');
     ```
   - This query connects to a database hosted on IP address `123.45.67.8`, with the name `postgres` at port `5432`. Now, create a user mapping so that users on your database can access the foreign server:
     ```sql
      CREATE USER MAPPING FOR postgres
      SERVER myserver
      OPTIONS (user 'postgres', password 'password');
     ```

6. `pgvector`

   - **What it does**: Adds support for vector operations in Postgres—enabling similarity search, nearest-neighbor search, and more.
   - **Use Case**: Applications like recommendation systems, image retrieval, and semantic search.
   - Installation:
     ```sql
      CREATE EXTENSION vector;
     ```
   - **Pgvector sample query** (Say you want to find the most similar images to a given feature vector. Here’s how you might use `pgvector` to perform a nearest-neighbor search:)

     ```sql
      -- Assuming we have a table with image features stored as vectors
      -- Table: image_features
      -- Columns: id (integer), features (vector)

      -- Given a query vector, find the 5 most similar images
      SELECT id, features
      FROM image_features
      ORDER BY features <-> 'query_vector'::vector
      LIMIT 5;
     ```

   - This query orders the results by the distance between the query_vector and the features column, effectively returning the closest matches

7. `hstore`

   - **What it does**: A key-value store within Postgres, that stores sets of key/value pairs in a single Postgres data type.
   - **Use Case**: Semi-structured data with varying attributes that need fast indexing and flexible schema requirements without table alterations.
   - Installation:
     ```sql
      CREATE EXTENSION hstore;
     ```
   - **Hstore sample query** (Here’s an example of how you might use `hstore` to store and query product data with varying attributes:)

     ```sql
      -- Create a table with an hstore column for storing product attributes
      CREATE TABLE products (
          id serial PRIMARY KEY,
          name text NOT NULL,
          attributes hstore
      );

      -- Insert a product with attributes into the table
      INSERT INTO products (name, attributes)
      VALUES ('Smartphone', 'color => "black", storage => "64GB", battery => "3000mAh"');

      -- Query to find products with a specific attribute
      SELECT name
      FROM products
     ```

8. `pgcre`
   - **What it does**: Integrates Perl Compatible Regular Expressions (PCRE) into PostgreSQL, providing advanced string-matching functionality beyond PostgreSQL's built-in regex capabilities.
   - **Use Case**: Applications requiring sophisticated text analysis with complex pattern-matching needs like parsing logs, searching text, or validating string formats with advanced regex features.
   - Installation:
     ```sql
      CREATE EXTENSION pgpcre
     ```
   - **pgpcre sample query** (If you want to search for email addresses in a column of unstructured text, you might use a PCRE pattern for matching emails as follows:)
     ```sql
      -- Assuming we have a table named messages with a column named content
      -- Table: messages
      -- Column: content (text)
      -- Use pgpcre to match email addresses within the content
      SELECT content, pcre_match('^\S+@\S+$', content) AS email
      FROM messages
      WHERE pcre_match('^\S+@\S+$', content) IS NOT NULL;
     ```

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
3. [crunchydata.com - Indexing Materialized Views in Postgres](https://www.crunchydata.com/blog/indexing-materialized-views-in-postgres?ref=dailydev)
4. [dev.to - 8 Postgres Extensions You Need to Know](https://dev.to/timescale/8-postgres-extensions-you-need-to-know-2mj3?ref=dailydev)
5. [strongdm - PostgreSQL vs. MySQL: Differences for Tech Leaders & Teams](https://www.strongdm.com/blog/postgresql-vs-mysql?ref=dailydev)
6. [leapcell.ion - A Complete Guide to PostgreSQL’s 9 Index Types](https://leapcell.io/blog/complete-guide-postgresql-9-index-types?ref=dailydev)
