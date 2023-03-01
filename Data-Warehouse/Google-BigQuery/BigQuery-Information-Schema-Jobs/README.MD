# JOBS view

## Table Of Contents
- [Further Reading]()
  - [JOBS view](https://cloud.google.com/bigquery/docs/information-schema-jobs)

# JOBS view
* The __INFORMATION_SCHEMA.JOBS__ view contains the real-time metadata about all BigQuery jobs in the current project.

# Load job history
* lists all users or service accounts that submitted a batch load job for a given project. Because no time boundary is specified, this query scans all available history (for example, the last 30 days).

# Example: Bytes processed per user identity
* To show  the total bytes billed for query jobs per user.

# Query jobs per table
* To show how many times each table queried in a project was referenced by a query job:

# Most expensive queries by project
* lists the most expensive queries in a project by slot usage time: