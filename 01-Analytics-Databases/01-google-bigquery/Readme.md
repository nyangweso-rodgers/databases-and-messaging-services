# Google BigQuery

## Table Of Contents

# What is BigQuery ?

- **BigQuery** is a **serverless**, cost-effective and multicloud data warehouse designed to help you turn big data into valuable business insights.
- One of the key advantages of **BigQuery** is its **serverless design**, which allows for independent scaling of **storage** and **compute** on demand.

# Featres Of BigQuery

## BigQuery Slot

- A **BigQuery slot** is a **virtual CPU** used by **BigQuery** to execute SQL queries. **BigQuery** automatically calculates how many slots each query requires, depending on query size and complexity. If too many complex queries run at the same time, query demands will exceed the slots you committed to.

## Columnar storage

- Traditional relational databases, like **MySQL**, store information in a **row-based format** known as **record-oriented storage**, which makes them well-suited for transactional updates and **online transaction processing (OLTP) applications**. In contrast, **BigQuery** uses a **columnar storage** method, storing each column in its own file block, making it an excellent choice for **online analytical processing (OLAP) applications**.

## Partition and clustering

- A **partitioned table** in **BigQuery** is divided into smaller units called **partitions** to make data management and querying more efficient. You can create partitions based on a **TIMESTAMP/DATE** column or an **INTEGER** column.

- **Clustering** in **BigQuery** involves organizing the data in a table based on the contents of one or more columns in the table's schema. These columns are used to group similar data, and it is usually best to use high cardinality and non-temporal columns for clustering. The order of the clustered columns determines the sort order of the data.

# Resources
