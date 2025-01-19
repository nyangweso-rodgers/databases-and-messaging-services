# jdbc Source Connector

## Table Of Contents

# Configure Source Connectors

- You can download connectors from [https://www.confluent.io/hub/](https://www.confluent.io/hub/)

# [JDBC Source Connector](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc)

- The [Kafka Connect JDBC Source connector]() allows you to import data from any relational database with a **JDBC** driver into an **Apache Kafka topic**. This **connector** can support a wide variety of databases.
- We add both the [Avro Converter](https://www.confluent.io/hub/confluentinc/kafka-connect-avro-converter) and [JDBC Source/Sink](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) plugins to our **Docker image**.

# Limitations Of JDBC Connector

1. The geometry column type isn’t supported for the **JDBC Source connector**.
2. The **connector** does not support the array data type.
3. If the **connector** makes numerous parallel insert operations in a large source table, insert transactions can commit out of order; this is typical and means that a greater auto_increment ID (for example, 101) is committed earlier and a smaller ID (for example, 100) is committed later. The time difference may only be a few milliseconds, but the commits are out of order nevertheless.

# Features of jdbc Connector

- The **JDBC Source connector** includes the following **features**:
  1. **At least once delivery**: This **connector** guarantees that records are delivered to the **Kafka topic** at least once. If the **connector** restarts, there may be some duplicate records in the **Kafka topic**.
  2. **Supports one task**: The **JDBC Source connector** can read one or more tables from a single task. In query mode, the **connector** supports running only one task.
  3. Incremental query modes

## 4. Message Key Feature

- Kafka messages are **key**/**value** pairs. For a **JDBC connector**, the **value** (payload) is the contents of the table row being ingested. However, the **JDBC connector** does not generate the **key** by default.
- Message **keys** are useful in setting up partitioning strategies. **Keys** can direct messages to a specific **partition** and can support downstream processing where joins are used. If no message **key** is used, messages are sent to partitions using round-robin distribution.
- To set a message **key** for the **JDBC connector**, you use two **Single Message Transformations** (**SMTs**): the [ValueToKey](https://docs.confluent.io/platform/current/connect/transforms/valuetokey.html) **SMT** and the [ExtractField](https://docs.confluent.io/platform/current/connect/transforms/extractfield.html) **SMT**. You add these two SMTs to the **JDBC connector** configuration. **Example** (the following shows a snippet added to a configuration that takes the `id` column of the `accounts` table to use as the message key):

  ```json
  {
    "name": "jdbc_source_mysql_01",
    "config": {
      "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
      "connection.url": "jdbc:mysql://mysql:3306/test",
      "connection.user": "connect_user",
      "connection.password": "connect_password",
      "topic.prefix": "mysql-01-",
      "poll.interval.ms": 3600000,
      "table.whitelist": "test.accounts",
      "mode": "bulk",

      "transforms": "createKey,extractInt",
      "transforms.createKey.type": "org.apache.kafka.connect.transforms.ValueToKey",
      "transforms.createKey.fields": "id",
      "transforms.extractInt.type": "org.apache.kafka.connect.transforms.ExtractField$Key",
      "transforms.extractInt.field": "id"
    }
  }
  ```

## 5. jdbc Connector Modes

- The **Kafka JDBC Source Connector** supports several **modes** that determine how data is captured from a **relational database** and streamed to **Kafka topics**. Each **mode** serves a different purpose, depending on the nature of your data and the requirements of your streaming application.
- Following Modes are suported:

  1. `bulk` (**Bulk Mode**): In **bulk mode**, the **connector** loads the entire content of the specified tables at each poll interval.Use cases include:

     - Suitable for use cases where the entire table data needs to be replicated periodically.
     - Ideal when data is relatively small or when the table is static (rarely changes).
     - Not efficient for large, frequently changing tables because it reloads all the data every time.
     - Examle:
       ```json
       {
         "mode": "bulk"
       }
       ```
     - Common Use Cases for `bulk` Mode:
       1. **Initial Data Load**: When you want to bootstrap your Kafka topics with the entire dataset from a database table.
       2. **Periodic Batch Processing**: If your use case requires periodic full synchronization of data (e.g., every night or every few hours), bulk mode can fetch the full dataset to ensure the topic is fully up-to-date.
       3. **Stateless Data Pipelines**: When your pipeline doesn't require tracking changes over time, and you only care about the full dataset being replicated periodically.
       4. **Data Archiving**: If you want to archive or snapshot your entire database table to a Kafka topic for downstream processing, bulk mode is suitable.
       5. **Testing and Debugging**: Useful for testing Kafka Connect configurations by quickly populating topics with large amounts of data.

  2. `incrementing` (**Incrementing Mode**): The **connector** identifies new records based on an **incrementing column**, typically a **primary key** or auto-incrementing ID. It tracks the maximum value of this column seen so far and only fetches rows with a greater value. Use cases include:
     - Suitable when records are only inserted, and the ID column is guaranteed to increment monotonically.
     - Commonly used for tables with an auto-incremented primary key.
     - Not suitable if rows can be updated, as updates won't be captured.
     - Examle:
       ```json
       {
         "mode": "incrementing",
         "incrementing.column.name": "id"
       }
       ```
  3. `timestamp` (**Timestamp Mode**): The **connector** tracks changes by monitoring a `timestamp` column. It queries only rows where the timestamp is greater than the last recorded timestamp. Use Cases include:
     - Ideal for tables where records can be updated, and the timestamp column captures the last modified time.
     - Suitable when records are inserted and updated, but no deletions occur.
     - Requires a reliable timestamp column that is updated with every change.
     - Example:
       ```json
       {
         "mode": "timestamp",
         "timestamp.column.name": "updated_at"
       }
       ```
  4. `timestamp+incrementing` (**Timestamp + Incrementing Mode**): This **mode** combines **timestamp** and **incrementing modes**. It ensures that both new and updated records are captured. The **connector** uses the timestamp column to track updates and the incrementing column to ensure unique identification of records, especially in case of multiple updates within the same timestamp. Use Cases:
     - Ideal for tables where both inserts and updates occur frequently.
     - Ensures that no updates are missed, even if multiple updates happen within the same timestamp.
     - Requires both a reliable timestamp and an incrementing column.
     - Example:
       ```json
       {
         "mode": "timestamp+incrementing",
         "timestamp.column.name": "updated_at",
         "incrementing.column.name": "id"
       }
       ```
  5. `query` (**Custom Query Mode**): In this mode, you can define a custom SQL query to fetch data. The **connector** executes this query at each poll interval. It's useful when you need to filter or join tables in a specific way. Use Cases include:
     - Best when you need more control over what data is captured, such as filtering specific rows, joining multiple tables, or using complex SQL logic.
     - Allows for flexibility in handling various use cases that standard modes cannot cover.
     - Requires manual management of change tracking within the query.
     - Example:
       ```json
       {
         "mode": "query",
         "query": "SELECT * FROM customers WHERE updated_at > ?"
       }
       ```

## 1.1. JDBC Source Connector with with Single Message Transformations (SMTs) -> Key:`Long` and Value:`JSON`

## 1.2. JDBC Source Connector with SpecificAvro -> Key:String(null) and Value:`SpecificAvro`

# Steps

## Command : Register Source Connector

- Register jdbc Postgres Source Connector by:

  ```sh
   curl -X POST --location "http://localhost:8083/connectors" -H "Content-Type: application/json" -H "Accept: application/json" -d @01-jdbc-postgresdb-source-connector-for-participants-surveys-with-protobuf.json
  ```

- Example Output:

## Command : Get a List of all Connectors

- To get a list of connectors for your Apache Kafka® cluster:

  ```sh
    curl --location --request GET 'http://localhost:8083/connectors'
  ```

- Example Output:
  ```sh
    ["jdbc-protobuf-connector-for-customers-postgresdb","jdbc-avro-connector-for-customers-postgresdb","jdbc-protobuf-connector-for-participants-surveys-postgresdb"]
  ```

## Command : Check the Connector Status

- Use the following command to check the status of your Kafka Connect connector
  ```sh
    curl -X GET http://localhost:8083/connectors/jdbc-avro-connector-for-customers-postgresdb/status
  ```
- Example Output:

## Command : Get Detailed Information on a Connector

- Example Output:

## Command : Pause a Connector

- Example Output:

## Command : Resume a Connector

- Example Output:

## Command : Update a Connector

- Example Output:

## Command : Delete a Connector

- Remove the **connectors** by:
  ```sh
    curl -X DELETE http://localhost:8083/connectors/jdbc-protobuf-connector-for-participants-surveys-postgresdb
  ```
- Example Output:

# Configuration Properties for the JDBC Connector:

1. `connection.url`: JDBC connection URL.
   - Examples:
     - MySQL: `jdbc:mysql://localhost/db_name`
     - SQL Server: `jdbc:sqlserver://localhost;instance=SQLEXPRESS;databaseName=db_name`
2. `connection.user`: JDBC connection user.
3. `connection.password`: JDBC connection password.
4. `connection.attempts`: Maximum number of attempts to retrieve a valid JDBC connection. Must be a positive integer.
   - Default: 3
5. `connection.backoff.ms`: Backoff time in milliseconds between connection attempts.
   - Type: long
   - Default: 10000
6. `catalog.pattern`: Catalog pattern to fetch table metadata from the database.
   - Type: string
   - Default: `null`
     - `""` retrieves those without a catalog
     - `null` (default) indicates that the schema name is not used to narrow the search and that all table metadata is fetched, regardless of the catalog.
     - Importance: medium
7. `table.whitelist`: List of tables to include in copying. If specified, `table.blacklist` may not be set. Use a comma-separated list to specify multiple tables (for example, `table.whitelist`: `"User, Address, Email"`).
   - Type: list
   - Default: “”
   - Importance: medium
8. `table.blacklist`: List of tables to exclude from copying. If specified, `table.whitelist` may not be set. Use a comma-separated list to specify multiple tables (for example, `table.blacklist`: `"User, Address, Email"`).
   - Type: `list`
   - Default: “”
   - Importance: medium
9. `schema.pattern`: Schema pattern to fetch table metadata from the database.
   - Type: string
   - Default: `null`
     - `""` retrieves those without a schema.
     - `null` (default) indicates that the schema name is not used to narrow the search and that all table metadata is fetched, regardless of the schema.
     - Importance: high
     - Note:
       - If you leave this at the default null setting, the connector may time out and fail because of the large amount of table metadata being received. Make sure to set this parameter for large databases.
10. `numeric.mapping`: Map NUMERIC values by precision and optionally scale to integral or decimal types.
    - Type: `string`
    - Default: `null`
    - Valid Values: [`none`, `precision_only`, `best_fit`, `best_fit_eager_double`]
      - Use `none` if all NUMERIC columns are to be represented by Connect’s DECIMAL logical type.
      - Use `best_fit` if NUMERIC columns should be cast to Connect’s INT8, INT16, INT32, INT64, or FLOAT64 based upon the column’s precision and scale.This option may still represent the NUMERIC value as Connect DECIMAL if it cannot be cast to a native type without losing precision. For example, a NUMERIC(20) type with precision 20 would not be able to fit in a native INT64 without overflowing and thus would be retained as DECIMAL.
      - Use `best_fit_eager_double` if, in addition to the properties of `best_fit` described above, it is desirable to always cast NUMERIC columns with scale to Connect FLOAT64 type, despite potential of loss in accuracy.
      - Use `precision_only` to map NUMERIC columns based only on the column’s precision assuming that column’s scale is 0.
      - The `none` option is the default, but may lead to serialization issues with Avro since Connect’s DECIMAL type is mapped to its binary representation. `best_fit` is often preferred since it maps to the most appropriate primitive type.
    - Importance: low
11. `dialect.name`: The name of the database dialect that should be used for this connector. By default this is empty, and the connector automatically determines the dialect based upon the JDBC connection URL. Use this if you want to override that behavior and use a specific dialect. All properly-packaged dialects in the JDBC connector plugin can be used.
    - Type: `string`
    - Default: “”
    - Valid Values: [, `Db2DatabaseDialect`, `MySqlDatabaseDialect`, `SybaseDatabaseDialect`, `GenericDatabaseDialect`, `OracleDatabaseDialect` ,`SqlServerDatabaseDialect`, `PostgreSqlDatabaseDialect`, `SqliteDatabaseDialect`, `DerbyDatabaseDialect` , `SapHanaDatabaseDialect`, `MockDatabaseDialect`, `VerticaDatabaseDialect`]
    - Importance: low
12. `mode`: The mode for updating a table each time it is polled. Options include:

    - Type: `string`
    - Default: “”
    - Valid Values: [, `bulk`, `timestamp`, `incrementing`, `timestamp+incrementing`]
      - `bulk`: perform a bulk load of the entire table each time it is polled
      - `incrementing`: use a strictly incrementing column on each table to detect only new rows. Note that this will not detect modifications or deletions of existing rows.
      - `timestamp`: use a timestamp (or timestamp-like) column to detect new and modified rows. This assumes the column is updated with each write, and that values are monotonically incrementing, but not necessarily unique.
      - `timestamp+incrementing`: use two columns, a timestamp column that detects new and modified rows and a strictly incrementing column which provides a globally unique ID for updates so each row can be assigned a unique stream offset.
    - Importance: high
    - Dependents: `incrementing.column.name`, `timestamp.column.name`, `validate.non.null`

13. `incrementing.column.name`: The name of the strictly incrementing column to use to detect new rows. Any empty value indicates the column should be autodetected by looking for an auto-incrementing column. This column may not be nullable.
    - Type: `string`
    - Default: “”
    - Importance: medium
14. `timestamp.column.name`: Comma-separated list of one or more timestamp columns to detect new or modified rows using the COALESCE SQL function. Rows whose first non-null timestamp value is greater than the largest previous timestamp value seen will be discovered with each poll. At least one column should not be nullable.
    - Type: `string`
    - Default: “”
    - Importance: medium
15. `timestamp.initial`: The epoch timestamp (in milliseconds) used for initial queries that use timestamp criteria. Use `-1` to use the current time. If not specified, all data will be retrieved.
    - Type: `long`
    - Default: `null`
    - Importance: low
16. `validate.non.null`: By default, the JDBC connector will validate that all incrementing and timestamp tables have NOT NULL set for the columns being used as their ID/timestamp. If the tables don’t, JDBC connector will fail to start. Setting this to false will disable these checks.
    - Type: `boolean`
    - Default: `true`
    - Importance: low
17. `query`: If specified, `query` can select new or updated rows. Use this setting if you want to join tables, select subsets of columns in a table, or filter data. If used, the connector copies data using this query and whole-table copying is disabled.
    - Type: `string`
    - Default: “”
    - Importance: medium
18. `quote.sql.identifiers`:
    - When to quote table names, column names, and other identifiers in SQL statements. For backward compatibility, the default is `always`.
    - Type: `string`
    - Default: `always`
    - Importance: medium
19. `query.suffix`: Suffix to append at the end of the generated query.
    - Type: string
    - Default: “”
    - Importance: low
20. `query.retry.attempts`: The number of times to retry SQL exceptions encountered when executing queries.
    - Type: `int`
    - Default: `-1`
    - Importance: low
21. `transaction.isolation.mode`: The mode to control which transaction isolation level is used when running queries against the database. By default, no explicit transaction isolation mode is set. `SQL_SERVER_SNAPSHOT` will only work against a connector configured to write to SQL Server. Options include: `DEFAULT`, `READ_UNCOMMITTED`, `READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`, and `SQL_SERVER_SNAPSHOT`.
    - Type: `string`
    - Default: `DEFAULT`
    - Valid Values: [`DEFAULT`, `READ_UNCOMMITED`, `READ_COMMITED`, `REPEATABLE_READ`, `SERIALIZABLE`, `SQL_SERVER_SNAPSHOT`]
    - Importance: low
22. `table.types`: By default, the **JDBC connector** will only detect tables with type `TABLE` from the source Database. This config allows a comma-separated list of table types to extract.
    - Type: `list`.
      - TABLE
      - VIEW
      - SYSTEM TABLE
      - GLOBAL TEMPORARY
      - LOCAL TEMPORARY
      - ALIAS
      - SYNONYM
    - In most cases it only makes sense to have either `TABLE` or `VIEW`.
    - Default: `TABLE`
    - Importance: low
23. `poll.interval.ms`: Frequency in ms to poll for new data in each table.
    - Type: `int`
    - Default: `5000`
    - Importance: high
24. `batch.max.rows`: Maximum number of rows to include in a single batch when polling for new data. This setting can be used to limit the amount of data buffered internally in the connector.
    - Type: `int`
    - Default: `100`
    - Importance: low
25. `table.poll.interval.ms`: Frequency in ms to poll for new or removed tables, which may result in updated task configurations to start polling for data in added tables or stop polling for data in removed tables.
    - Type: `long`
    - Default: `60000`
    - Importance: low
26. `topic.prefix`: Prefix to prepend to table names to generate the name of the **Apache Kafka topic** to publish data to, or in the case of a custom query, the full name of the topic to publish to.
    - Type: `string`
    - Importance: high
27. `timestamp.delay.interval.ms`: After a row with a certain timestamp appears, this is the amount of time the connector waits to include it in the result. You can add a delay to allow transactions with an earlier timestamp to complete. The first execution fetches all available records (starting at timestamp 0) until the current time minus the delay. Each subsequent execution retrieves data from the last time you fetched until the current time minus the delay.
    - Type: `long`
    - Default: `0`
    - Importance: high
28. `db.timezone`: The name of the JDBC timezone used in the connector when querying with time-based criteria. This should be the timezone of the database as well as all the columns being queried. The value set in `db.timezone` will also be used for timestamp columns while pushing the records to Kafka. Defaults to UTC.
    - Type: `string`
    - Default: `UTC`
    - Valid Values: Any valid JDK time zone
    - Importance: medium
29. `timestamp.granularity`: Define the granularity of the Timestamp column. Options include:
    - Type: `string`
    - Default: `connect_logical`
    - Valid Values: [`connect_logical`, `nanos_long`, `nanos_string`, `nanos_iso_datetime_string`]
      - `connect_logical` (default): represents timestamp values using Kafka Connect’s built-in representations
      - `nanos_long`: represents timestamp values as nanos since epoch
      - `nanos_string`: represents timestamp values as nanos since epoch in string
      - `nanos_iso_datetime_string`: uses the iso format ‘yyyy-MM-dd’T’HH:mm:ss.n’
    - Importance: low
30. `topic.creation.groups`: A list of group aliases that are used to define per-group topic configurations for matching topics. A `default` group always exists and matches all topics.
    - Type: List of String types
    - Default: empty
    - Possible Values: The values of this property refer to any additional groups. A `default` group is always defined for topic configurations.
31. `topic.creation.$alias.replication.factor`: The **replication factor** for new topics created by the connector. This value must not be larger than the number of brokers in the Kafka cluster. If this value is larger than the number of Kafka brokers, an error occurs when the connector attempts to create a topic. This is a **required property** for the `default` group. This property is optional for any other group defined in `topic.creation.groups`. Other groups use the Kafka broker default value.
    - Type: `int`
    - Default: n/a
    - Possible Values: `>= 1` for a specific valid value or `-1` to use the Kafka broker’s default value.
32. `topic.creation.$alias.partitions`: The number of topic **partitions** created by this connector. This is a **required property** for the `default` group. This property is optional for any other group defined in `topic.creation.groups`. Other groups use the Kafka broker default value.
    - Type: `int`
    - Default: n/a
    - Possible Values: `>= 1` for a specific valid value or `-1` to use the Kafka broker’s default value.
33. `topic.creation.$alias.include`: A list of strings that represent regular expressions that match topic names. This list is used to include topics with matching values, and apply this group’s specific configuration to the matching topics. `$alias` applies to any group defined in `topic.creation.groups`. This property does not apply to the `default` group.
    - Type: List of String types
    - Default: empty
    - Possible Values: Comma-separated list of exact topic names or regular expressions.
34. `topic.creation.$alias.exclude`: A list of strings representing regular expressions that match topic names. This list is used to exclude topics with matching values from getting the group’s specfic configuration. `$alias` applies to any group defined in `topic.creation.groups`. This property does not apply to the `default` group. Note that exclusion rules override any inclusion rules for topics.
    - Type: List of String types
    - Default: empty
    - Possible Values: Comma-separated list of exact topic names or regular expressions.
35. `topic.creation.$alias.${kafkaTopicSpecificConfigName}`: Any of the [Changing Broker Configurations Dynamically](https://docs.confluent.io/platform/current/kafka/dynamic-config.html#changing-broker-configurations-dynamically) for the version of the Kafka broker where the records will be written. The broker’s topic-level configuration value is used if the configuration is not specified for the rule. `$alias` applies to the default group as well as any group defined in `topic.creation.groups`
    - Type: property values
    - Default: Kafka broker value
36. `value.subject.name.strategy`: Determines how to construct the **subject** name under which the **value schema** is registered with **Schema Registry**.
    - Any implementation of `io.confluent.kafka.serializers.subject.strategy.SubjectNameStrategy` can be specified. By default, `<topic>-value` is used as **subject**. Specifying an implementation of `io.confluent.kafka.serializers.subject.SubjectNameStrategy` is deprecated as of `4.1.3` and if used may have some performance degradation.
    - Type: class
    - Default: `class io.confluent.kafka.serializers.subject.TopicNameStrategy`
    - Importance: medium
37. `key.converter` and `value.converter`: These properties specify how the connector should serialize the key and value of the messages it produces.

- Examle:You need to use the Avro Converter.

10. `value.converter.schema.registry.url`: This points to the URL of the Schema Registry, allowing the connector to use registered schemas.
11. `value.converter.value.subject.name.strategy`: This sets the naming strategy for the schema subjects (for values). By default, it uses the TopicNameStrategy, which registers the subject as topic-name-value (in this case, users.customers.avro.v1-value)

# Resources and Further Reading

1. [Configuration Reference for JDBC Source Connector for Confluent Platform](https://docs.confluent.io/kafka-connectors/jdbc/current/source-connector/source_config_options.html)
