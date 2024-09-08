# How to Configure Sink Connectors

## Table Of Contents

# Limitations Of BigQuery Sink connector

1. The connector doesn’t support schemas with recursion.
2. The connector doesn’t support schemas having float fields with `NaN` or `+Infinity` values.
3. When the connector is configured with `upsertEnabled` or `deleteEnabled`, it does not support **Single Message Transformations** (SMTs) that modify the topic name. Additionally, the following transformations are not allowed:
   1. `io.debezium.transforms.ByLogicalTableRouter`
   2. `io.debezium.transforms.outbox.EventRouter`
   3. `org.apache.kafka.connect.transforms.RegexRouter`
   4. `org.apache.kafka.connect.transforms.TimestampRouter`
   5. `io.confluent.connect.transforms.MessageTimestampRouter`
   6. `io.confluent.connect.transforms.ExtractTopic$Key`
   7. `io.confluent.connect.transforms.ExtractTopic$Value`

- **Note**:

  - When the connector is not configured with `upsertEnabled` or `deleteEnabled`, these **SMTs** can be used without any issue.

- **Remark**:

  - Streaming into BigQuery is not available with the Google Cloud free tier. If you try to use streaming without enabling billing, you receive the following error: `BigQuery: Streaming insert is not allowed in the free tier.`. For more details, see [Streaming data into BigQuery](https://cloud.google.com/bigquery/docs/streaming-data-into-bigquery)

# Setup

## Step 1: Configure BigQuery (BigQuery prerequisites)

- The following prerequisites are required before setting up the **BigQuery connector**.
  1. An active Google Cloud account with authorization to create resources.
  2. A BigQuery project. You can create the project using the [Google Cloud Console](https://console.cloud.google.com/welcome?project=general-364419)
  3. A [BigQuery dataset](https://cloud.google.com/bigquery/docs/datasets) in the project
  4. A service account that can access the BigQuery project containing the dataset. You can create this service account in the [Google Cloud Console](https://console.cloud.google.com/welcome?project=general-364419)
  5. The service account must have access to the BigQuery project containing the dataset. You create and download a key when creating a service account. You must download the key as a JSON file as shown in the following example:
- Folow the following steps to retrieve the keyfile:
  1. In the [Google Cloud console](), go to the [Service accounts page](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?walkthrough_id=iam--create-service-account-keys&start_index=1&_ga=2.20857274.380216664.1724589020-457635835.1696958253&supportedpurview=project#step_index=1)
  2. Select a project
  3. Click the email address of the service account that you want to create a key for.
  4. Click the **Keys** tab.
  5. Click the **Add key** drop-down menu, then select **Create new key**.
  6. Select **JSON** as the **Key type** and click **Create**.
  7. Clicking **Create** downloads a service account key file. After you download the key file, you cannot download it again.
  8. The downloaded key has the following format, where `PRIVATE_KEY` is the private portion of the public/private key pair:
     ```json
     {
       "type": "service_account",
       "project_id": "PROJECT_ID",
       "private_key_id": "KEY_ID",
       "private_key": "-----BEGIN PRIVATE KEY-----\nPRIVATE_KEY\n-----END PRIVATE KEY-----\n",
       "client_email": "SERVICE_ACCOUNT_EMAIL",
       "client_id": "CLIENT_ID",
       "auth_uri": "https://accounts.google.com/o/oauth2/auth",
       "token_uri": "https://accounts.google.com/o/oauth2/token",
       "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
       "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/SERVICE_ACCOUNT_EMAIL"
     }
     ```

## Step 2: Install the BigQuery Connector

- Verify the **BigQuery Sink Connector plugin** has been installed correctly and recognized by the plugin loader:
  ```sh
    curl -sS localhost:8083/connector-plugins | jq .[].class | grep BigQuerySinkConnector
  ```

## Step 3: Configure the BigQuery Sink Connector

- Create the file register-kcbd-connect-bigquery.json to store the connector configuration.
  ```json
  {
    "name": "inventory-connector-bigquery",
    "config": {
      "connector.class": "com.wepay.kafka.connect.bigquery.BigQuerySinkConnector",
      "tasks.max": "1",
      "consumer.auto.offset.reset": "earliest",
      "topics.regex": "debezium.inventory.*",
      "sanitizeTopics": "true",
      "autoCreateTables": "true",
      "keyfile": "/bigquery-keyfile.json",
      "schemaRetriever": "com.wepay.kafka.connect.bigquery.retrieve.IdentitySchemaRetriever",
      "project": "my-gcp-project-id",
      "defaultDataset": "kafka_dataset",
      "allBQFieldsNullable": true,
      "allowNewBigQueryFields": true,
      //"transforms": "regexTopicRename,extractAfterData",
      "transforms": "regexTopicRename,extractAfterData",
      "transforms.regexTopicRename.type": "org.apache.kafka.connect.transforms.RegexRouter",
      "transforms.regexTopicRename.regex": "debezium.inventory.(.*)",
      "transforms.regexTopicRename.replacement": "$1",
      "transforms.extractAfterData.type": "io.debezium.transforms.ExtractNewRecordState"
    }
  }
  ```

## Step 4 : Register BigQuery Sink Connector

```sh
    curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @bigquery-avro-sink-connector-for-customers.json
```

## Step 5: Check Status of BigQuery Sink Connector

- Verify the status of the **connector** to ensure it is running without errors:
  ```sh
    curl -X GET http://localhost:8083/connectors/bigquery-avro-connector-for-customers/status
  ```

## Step 6: Validate the connector configuration to see if there are any misconfigurations

```sh
    curl -X PUT -H "Content-Type: application/json" http://localhost:8083/connector-plugins/com.wepay.kafka.connect.bigquery.BigQuerySinkConnector/config/validate -d @bigquery-avro-sink-connector-for-customers.json
```

## Step 7: Delete BigQuery Sink Connector

- Delete the existing **connector** by:
  ```sh
    curl -X DELETE http://localhost:8083/connectors/bigquery-avro-connector-for-customers
  ```

# BigQuery Sink Connector Properties

1. `name`: Globally-unique name to use for this connector.
2. `tasks.max`: Maximum number of tasks to use for this connector. The default is `1`. Each task replicates exclusive set of partitions assigned to it.
3. `topics.regex`: A Java regular expression of topics to replicate. For example: specify .`*` to replicate all available **topics** in the cluster. Applicable only when Use regular expressions is selected.
4. `keyfile`:
   - A `JSON` key with **BigQuery** service account credentials.
   - `keyfile` can be either a string representation of the Google credentials file or the path to the Google credentials file itself. The string representation of the Google credentials file is supported in BigQuery sink connector version 1.3 (and later).
   - Type: string
   - Default: null
5. `keySource`
   - Determines whether the keyfile configuration is the path to the credentials JSON file or to the JSON itself. Available values are `FILE` and `JSON`. This property is available in BigQuery sink connector version 1.3 (and later).
   - Type: string
   - Default: FILE
6. `project`:
   - The BigQuery project to which topic data will be written.
   - Type: `string`
7. `defaultDataset`:
   - The default Google BigQuery dataset to be used.
   - Typs is `string`
8. `topics`:
   - A list of **Kafka topics** to read from.
9. `sanitizeTopics`:
   - Designates whether to automatically sanitize topic names before using them as table names. If not enabled, topic names are used as table names.
   - Type: boolean
   - Default: `false`
10. `includeKafkaData`:
    - Whether to include an extra block containing the Kafka source topic, offset, and partition information in the resulting BigQuery rows.
    - Type: boolean
    - Default: false
11. `schemaRetriever`:
    - A class that can be used for automatically creating tables and/or updating schemas. Note that in version 2.0.0, `SchemaRetriever` API changed to retrieve the schema from each SinkRecord, which will help support multiple schemas per topic. `SchemaRegistrySchemaRetriever` has been removed as it retrieves schema based on the topic.
    - Type: class
    - Default: `com.wepay.kafka.connect.bigquery.retrieve.IdentitySchemaRetriever`
12. `autoCreateTables`:
    - Create **BigQuery** tables if they don’t already exist. This property should only be enabled for Schema Registry-based inputs: **Avro**, **Protobuf**, or **JSON Schema** (JSON_SR). Table creation is not supported for **JSON** input.
    - Type: boolean
    - Default: `false`
13. `topic2TableMap`:
    - Map of **topics** to **tables** (optional). Format: comma-separated tuples, e.g. <topic-1>:<table-1>,<topic-2>:<table-2>,.. Note that **topic name** should not be modified using regex SMT while using this option. Also note that `SANITIZE_TOPICS_CONFIG` would be ignored if this config is set.
    - Lastly, if the `topic2table` map doesn’t contain the topic for a record, a table with the same name as the topic name would be created.
    - Type: `string`
    - Default: “”
14. `allowNewBigQueryFields`: If `true`, new fields can be added to BigQuery tables during subsequent schema updates.
15. `allowBigQueryRequiredFieldRelaxation`: If `true`, fields in the BigQuery schema can be changed from `REQUIRED` to `NULLABLE`.
16. `upsertEnabled`:
    - Enables upsert functionality on the connector
    - Enable upsert functionality on the connector through the use of record keys, intermediate tables, and periodic merge flushes. Row-matching will be performed based on the contents of record keys. This feature won’t work with SMTs that change the name of the topic and doesn’t support JSON input.
    - Type: boolean
    - Default: `false`
17. `deleteEnabled`:
    - Enable delete functionality on the connector through the use of record keys, intermediate tables, and periodic merge flushes. A delete will be performed when a record with a null value (that is–a tombstone record) is read. This feature will not work with **SMTs** that change the name of the topic and doesn’t support JSON input.
    - Type: boolean
    - Default: `false`
18. `kafkaKeyFieldName`:
    - The name of the BigQuery table field for the Kafka key. Must be set when **upsert** or **delete** is enabled.
    - The Kafka key field name. The default value is `null`, which means the **Kafka Key** field will not be included.
    - Type: `string`
    - Default: `null`
19. `kafkaDataFieldName`:
    - The **Kafka data field name**. The default value is `null`, which means the **Kafka Data** field will not be included.
    - Type: `string`
    - Default: `null`
20. `timePartitioningType`:
    - The time partitioning type to use when creating tables. Existing tables will not be altered to use this partitioning type.
    - Type: string
    - Default: DAY
    - Valid Values: (case insensitive) [MONTH, YEAR, HOUR, DAY]
21. `bigQueryRetry`:
    - The number of retry attempts made for each BigQuery request that fails with a backend or quota exceeded error.
    - Type: `int`
    - Default: 0
    - Valid Values: [0,…]
22. `bigQueryRetryWait`:
    - The minimum amount of time, in milliseconds, to wait between BigQuery backend or quota exceeded error retry attempts.
    - Type: long
    - Default: 1000
    - Valid Values: [0,…]
23. `allowNewBigQueryFields`:
    - If `true`, new fields can be added to BigQuery tables during subsequent schema updates.
    - Type: boolean
    - Default: `false`
24. `allowBigQueryRequiredFieldRelaxation`:
    - If true, fields in BigQuery Schema can be changed from `REQUIRED` to `NULLABLE`. Note that `allowNewBigQueryFields` and `allowBigQueryRequiredFieldRelaxation` replaced the `autoUpdateSchemas` parameter of older versions of this connector.
    - Type: boolean
    - Default: `false`
25. `bigQueryMessageTimePartitioning`:
    - Whether or not to use the message time when inserting records. Default uses the connector processing time.
    - Type: `boolean`
    - Default: false
26. `allowSchemaUnionization`:
    - If `true`, the existing table schema (if one is present) will be unionized with new record schemas during schema updates. If false, the record of the last schema in a batch will be used for any necessary table creation and schema update attempts.
    - Type: boolean
    - Default: false
27. `bigQueryPartitionDecorator`:
    - Whether or not to append partition decorator to BigQuery table name when inserting records.
    - Default is `true`. Setting this to `true` appends partition decorator to table name (e.g. table$yyyyMMdd depending on the configuration set for `bigQueryPartitionDecorator`).
    - Setting this to `false` bypasses the logic to append the partition decorator and uses raw table name for inserts.
28. `timestampPartitionFieldName`:
    - The name of the field in the value that contains the timestamp to partition by in BigQuery and enable timestamp partitioning for each table. Leave this configuration blank, to enable ingestion time partitioning for each table.
    - Type: `string`
    - Default: null
29. `allBQFieldsNullable`:
    - If `true`, no fields in any produced BigQuery schema are REQUIRED. All non-nullable `Avro` fields are translated as NULLABLE (or REPEATED, if arrays).
    - Type: boolean
    - Default: `false`
30. `intermediateTableSuffix`:
    - A suffix that will be appended to the names of destination tables to create the names for the corresponding intermediate tables. Multiple intermediate tables may be created for a single destination table, but their names will always start with the name of the destination table, followed by this suffix, and possibly followed by an additional suffix.
    - Type: `string`
    - Default: “tmp”
31. `mergeIntervalMs`:
    - How often (in milliseconds) to perform a merge flush, if upsert/delete is enabled. Can be set to -1 to disable periodic flushing.
    - Type: `long`
    - Default: 60_000L
32. `mergeRecordsThreshold`:
    - How many records to write to an intermediate table before performing a merge flush, if upsert/delete is enabled. Can be set to `-1` to disable record count-based flushing.
    - Type: long
    - Default: -1
33. `clusteringPartitionFieldNames`:
    - Comma-separated list of fields where data is clustered in BigQuery.
    - Type: `list`
    - Default: null
34. `avroDataCacheSize`
    - The size of the cache to use when converting schemas from Avro to Kafka Connect.
    - Type: int
    - Default: 100
    - Valid Values: [0,…]
35. `enableBatchLoad`:
    - **Beta Feature** Use with caution. The sublist of topics to be batch loaded through GCS.
    - Type: list
    - Default: “”
36. `batchLoadIntervalSec`:
    - The interval, in seconds, in which to attempt to run GCS to BigQuery load jobs. Only relevant if `enableBatchLoad` is configured.
    - Type: `int`
    - Default: 120
37. `convertDoubleSpecialValues`
    - Designates whether +Infinity is converted to Double.MAX_VALUE and whether -Infinity and NaN are converted to Double.MIN_VALUE to ensure successfull delivery to BigQuery.
    - Type: boolean
    - Default: `false`
38. `errors.tolerance`: Error tolerance response during connector operation. Default value is `none` and signals that any error will result in an immediate connector task failure. Value of `all` changes the behavior to skip over problematic records.
39. `errors.deadletterqueue.topic.name`: The name of the **topic** to be used as the **dead letter queue** (DLQ) for messages that result in an error when processed by this **sink connector**, its transformations, or converters. The **topic name** is blank by default, which means that no messages are recorded in the DLQ.
40. `errors.deadletterqueue.topic .replication.factor`: Replication factor used to create the dead letter queue topic when it doesn’t already exist.
41. `errors.deadletterqueue.context .headers.enable`: When `true`, adds a header containing error context to the messages written to the dead letter queue. To avoid clashing with headers from the original record, all error context header keys, start with `__connect.errors`.
42. `value.converter`: The format of the value in the Redpanda topic. The default is `JSON`.
43. `autoCreateBucket`:
    - Whether to automatically create the given bucket, if it does not exist.
    - Type: boolean
    - Default: `true`
44. `gcsBucketName`:
    - The maximum size (or -1 for no maximum size) of the worker queue for **BigQuery** write requests before all topics are paused. This is a soft limit; the size of the queue can go over this before topics are paused. All topics resume once a flush is triggered or the size of the queue drops under half of the maximum size.
    - Type: `long`
    - Default: -1
    - Valid Values: [-1,…]
    - Importance: high
45. `threadPoolSize`:
    - The size of the BigQuery write thread pool. This establishes the maximum number of concurrent writes to BigQuery.
    - Type: `int`
    - Default: 10
    - Valid Values: [1,…]

# Resources and Further Reading

1. [docs.confluent.io/kafka-connectors - bigquery/current/kafka_connect_bigquery_config](https://docs.confluent.io/kafka-connectors/bigquery/current/kafka_connect_bigquery_config.html)
