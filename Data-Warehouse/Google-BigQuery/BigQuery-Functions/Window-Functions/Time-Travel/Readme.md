# Time Travel

## Table Of Contents
- [Further Reading]()
    1. [Medium - Hidden Gems of BigQuery — P6 — Time-traveling and clones](https://medium.com/google-cloud/hidden-gems-of-bigquery-p6-time-traveling-and-clones-4474fecb63c2)
    2. [cloud.google.com - docs - time-travel ](https://cloud.google.com/bigquery/docs/time-travel)

# Description - Time travel
* You can access data from any point within the __time travel__ window, which covers the past __seven days__ by default. Time travel lets you:
  * query data that was _updated_ or _deleted_, 
  * restore a table that was deleted, or 
  * restore a table that expired.

* You can set the duration of the time travel window, from a minimum of two days to a maximum of seven days. Seven days is the default. 
* You set the time travel window at the dataset level, which then applies to all of the tables within the dataset.
* __NOTE__:
  * You can only access data within the time travel window, which covers the past seven days by default.
  *  if my data was deleted over seven days ago, is all hope lost? No, because there is also a fail-safe period!

# Query Syntax
```sql
    --
    select * from `dataset_name.table_name`
    for SYSTEM_TIME AS OF TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
    limit 1000
```