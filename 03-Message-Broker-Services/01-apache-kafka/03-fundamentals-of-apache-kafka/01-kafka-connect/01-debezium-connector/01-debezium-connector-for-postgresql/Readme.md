# Debezium connector for PostgreSQL

## Table Of Contents

# What is Change data capture?

# Steps



### Step 5.2: Register Postgres connector using HTTP API (Register Debezium Connector(s) using `curl` Commands)

- We need to register the **Postgres connector** using **HTTP API** so that **debezium** could read the transaction logs from the server.


  ```sh
    curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @register-postgresdb-source-connector-for-customer-v1.json
  ```





























# Resources and Further Reading

1. [runchydata.com/blog - postgresql-change-data-capture-with-debezium](https://www.crunchydata.com/blog/postgresql-change-data-capture-with-debezium)
2. [www.iamninad.com - docker-compose-for-your-next-debezium-and-postgres-project](https://www.iamninad.com/posts/docker-compose-for-your-next-debezium-and-postgres-project/)
3. [docs.confluent.io/kafka-connectors - bigquery/current/kafka_connect_bigquery_config](https://docs.confluent.io/kafka-connectors/bigquery/current/kafka_connect_bigquery_config.html)

```

```
