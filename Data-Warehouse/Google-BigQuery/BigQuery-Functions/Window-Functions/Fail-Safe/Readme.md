# Fail-safe

## Table Of Contents
- [Further Reading]()
    1. [cloud.google.com - docs - fail-sefe](https://cloud.google.com/bigquery/docs/time-travel#fail-safe)
    2. [Medium - Hidden Gems of BigQuery — P6 — Time-traveling and clones](https://medium.com/google-cloud/hidden-gems-of-bigquery-p6-time-traveling-and-clones-4474fecb63c2)

# Description - fail-safe
* During the __fail-safe__ period, deleted data is automatically retained for an additional seven days after the time travel window so that the data is available for emergency recovery. Data is recoverable at the table level. The fail-safe period is not configurable.
* __Note__: 
  * __fail-safe__ is not really an extension of the __time travel window__ cause there are lots of differences and, specifically, limitations of fail-safe:
    * There is no way to query data in fail-safe storage.
    * There is no way to recover data yourself, and you must contact the Cloud Customer Care team.
    * Fail-safe retains deleted data, while with time travel, you also see earlier versions of updated records.
  * So, fail-safe is there for you in cases of emergency only.