# Databases

## Table Of Contents

- [SQL Databases]()
  - [PosgreSQL]()
- [NoSQL Databases](https://github.com/nyangweso-rodgers/My-Databases/tree/main/NoSQL-Databases)

  1. [MongoDB](https://github.com/nyangweso-rodgers/My-Databases/tree/main/MongoDB)

  2. [Redis](https://github.com/nyangweso-rodgers/My-Databases)

- [Data Warehousing](https://github.com/nyangweso-rodgers/My-Databases/tree/main/Data-Warehouse)
  - [Dimensional Modeling in Data Wareousing](https://github.com/nyangweso-rodgers/My-Databases/tree/main/Data-Warehouse/Dimensional-Modeling-in-Data-Warehousing)
  - [Google BigQuery](https://github.com/nyangweso-rodgers/My-Databases/tree/main/Data-Warehouse/Google-BigQuery)
  - [MongoDB Basics - What are ACID Properties in Database Management Systems?](https://www.mongodb.com/basics/acid-transactions)

# Introduction to Databases

- **Database**: application that allow one to store and access data. _a database is a collection of data that is organized in a manner that facilitates ease of access, as well as efficient management and tracking._. a database is made up of **tables** that store relevant information.

# Definition of Terms in Databases

1. **Database Table** : a table stores and displays data in a structtured format consisting of columns and rows. web applications use them to provide dynamic functions to users e.g., displaying products, content management, and user management.

2. **Primary Key**: field in the table that uniquely identifies the table records. _Features if a Primary Key include_:
   - it must contain a unique value for each row
   - it cannot contain NULL values
3. **Database Management System** (**DBMS**) : software to create, define and manage database. e.g., _Microsoft_, _Oracle_, _IBM_, _Apache_, _SQLServer_, _DB2_, _Cassandra_, _Firebind, \_MongoDB_, _FileMaker_, _MySQL_, _PostgreSQL_.

# ACID Properties in DMS (Database Management Systems)

- **ACID** is an acronym that stands for **atomicity**, **consistency**, **isolation**, and **durability**.
- Together, these **ACID** properties ensure that a set of database operations (grouped together in a transaction) leave the database in a valid state even in the event of unexpected errors.
- **ACID** properties:
  - **Atomicity**
    - **Atomicity** guarantees that all of the commands that make up a transaction are treated as a single unit and either succeed or fail together.
    - This is important as in the case of an unwanted event, like a crash or power outage, we can be sure of the state of the database. The transaction would have either completed successfully or been rollbacked if any part of the transaction failed.
    - Example
      - money is deducted from the source and if any anomaly occurs, the changes are discarded and the transaction fails.
  - **Consistency**
    - **Consistency** guarantees that changes made within a transaction are consistent with database constraints. This includes all rules, constraints, and triggers. If the data gets into an illegal state, the whole transaction fails.
    - Example:
      - let’s say there is a constraint that the balance should be a positive integer. If we try to overdraw money, then the balance won’t meet the constraint. Because of that, the consistency of the ACID transaction will be violated and the transaction will fail.
  - **Isolation**
    - **Isolation** ensures that all transactions run in an isolated environment. That enables running transactions concurrently because transactions don’t interfere with each other.
    - Example:
      - let’s say that our account balance is $200. Two transactions for a $100 withdrawal start at the same time. The transactions run in isolation which guarantees that when they both complete, we’ll have a balance of $0 instead of $100.
  - **Durability**
    - **Durability** guarantees that once the transaction completes and changes are written to the database, they are persisted. This ensures that data within the system will persist even in the case of system failures like crashes or power outages.
