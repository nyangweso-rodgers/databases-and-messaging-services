# Kafka Connect JDBC

## Table of Contents

- **Kafka Connect JDBC** can be used either as a **source** or a **sink connector** to **Kafka**, supports any database with **JDBC driver**.
- You can use the **Kafka Connect JDBC source connector** to import data from any relational database with a **JDBC driver** into **Apache Kafka topics**. You can use the **JDBC sink connector** to export data from **Kafka topics** to any relational database with a **JDBC driver**. The **JDBC connector** supports a wide variety of databases without requiring custom code for each one.

# Difference Between Debezium and JDBC Connector

1. **Debezium** is used only as a **Kafka source** and **JDBC Connector** can be used as **Kafka source** and **sink**.
2. **JDBC Connector** doesn't support syncing deleted records, while **Debezium** does.
3. **JDBC Connector** queries the database every fixed interval, which is not very scalable solution, while **CDC** has higher frequency, streaming from the database transaction log.
4. **Debezium** provides records with more information about the database changes, and **JDBC Connector** provides records which are more focused about converting the database changes into simple insert/upsert commands.

# Setup

## Create a JDBC Sink Connector

- Here’s a sample configuration `JSON` for the **JDBC Sink Connector**:
  ```json
  {
    "name": "JdbcSinkConnector-<TopicName>",
    "config": {
      "name": "JdbcSinkConnector-<TopicName>",
      "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
      "tasks.max": 1,
      "key.converter": "org.apache.kafka.connect.storage.StringConverter",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": true,
      "errors.tolerance": "all",
      "errors.log.enable": true,
      "errors.log.include.messages": true,
      "topics": "<topic-name>",
      "connection.url": "jdbc:mysql://<mysql-ip>:<mysql-port>/confluent-platform?useSSL=false",
      "connection.user": "<db-username>",
      "connection.password": "<db-password>",
      "insert.mode": "UPSERT",
      "table.name.format": "<db-table-name>",
      "db.timezone": "Asia/Kuala_Lumpur",
      "pk.mode": "record_value",
      "pk.fields": "<primary-key-column-name>",
      "dialect.name": "MySqlDatabaseDialect"
    }
  }
  ```
- Replace placeholders in the configuration with appropriate values and save it as `jdbcsink-connector-config.json` in `./connectors` directory.

## Step : `POST` Configuration Using `curl` Command

- Post this configuration using the following `curl` command:
  ```sh
      curl -X POST --location 'http://localhost:8083/connectors?expand=status&expand=info' --header 'Content-Type: application/json' --header 'Accept: application/json' --data '@./connectors/jdbcsink-connector-config.json'
  ```

## Step : Check Connector Status

```sh
    curl -X GET --location 'http://localhost:8083/connectors/<connector-name>/status'
```

# Resources and Further Reading
