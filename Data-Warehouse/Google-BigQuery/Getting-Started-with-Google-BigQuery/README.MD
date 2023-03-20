# Getting Started with Google BigQuery

## Table Of Contents
- [Further Reading]()
  - [BigQuery 101: A Beginner's Guide to Google's Cloud Data Warehouse](https://airbyte.com/blog/bigquery-guide)
  - [Dev Community - BigQuery Runner for VSCode](https://dev.to/minodisk/bigquery-runner-for-vscode-3pia)

# Overview Of BigQuery
* One of the key advantages of __BigQuery__ is its __serverless design__, which allows for independent scaling of storage and compute on demand. 

# BigQuery Concepts
1. A __BigQuery slot__ is a _virtual CPU_ used by __BigQuery__ to execute SQL queries. BigQuery automatically calculates how many slots each query requires, depending on query size and complexity.  If too many complex queries run at the same time, query demands will exceed the slots you committed to.
# Features Of BigQuery

# Columnar storage
* Traditional relational databases, like __MySQL__, store information in a __row-based format__ known as __record-oriented storage__, which makes them well-suited for transactional updates and __online transaction processing (OLTP) applications__. In contrast, __BigQuery__ uses a __columnar storage__ method, storing each column in its own file block, making it an excellent choice for __online analytical processing (OLAP) applications__.

# Partition and clustering
* A __partitioned table__ in __BigQuery__ is divided into smaller units called __partitions__ to make data management and querying more efficient. You can create partitions based on a __TIMESTAMP/DATE__ column or an __INTEGER__ column.

* __Clustering__ in __BigQuery__ involves organizing the data in a table based on the contents of one or more columns in the table's schema. These columns are used to group similar data, and it is usually best to use high cardinality and non-temporal columns for clustering. The order of the clustered columns determines the sort order of the data.

# BigQuery in VSCode
