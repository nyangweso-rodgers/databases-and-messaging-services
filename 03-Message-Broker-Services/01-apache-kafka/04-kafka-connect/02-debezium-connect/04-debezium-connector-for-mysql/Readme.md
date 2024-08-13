# Debezium Connector for MySQL

# Why use Debezium and Kafka Connect?

- **Debezium** and **Kafka Connect** are open-source platforms that provide a powerful solution for streaming data changes in real-time between systems. That real-time interaction allows you to keep your data in sync and easily accessible for various use cases such as real-time analytics, data warehousing, and data pipeline integrations.

#

## Step:

- Below our **docker-compose** file to deploy all the required services locally:
  ```yml
  version: "2"
  services:
    zookeeper:
    kafka:
    mysql:
      image:
      container_name: msql
      ports:
        - 3306:3306
      environment:
        - MYSQL_ROOT_PASSWORD=debezium
        - MYSQL_USER=mysqluser
        - MYSQL_PASSWORD=mysqlpw
    debezium:
  ```
- Check if **Debezium** is running with Kafka Connect API.

  ```sh
      curl -i -X GET -H "Accept:application/json" localhost:8083/connectors
  ```

  - An empty array in response shows that there are no **connectors** currently registered with **Kafka Connect**.

- We also have **MySQL** running with an example database inventory. You can check what tables are there by running:
  ```sh
    docker exec -it mysql mysql -uroot -pdebezium -D inventory -e "SHOW TABLES;"
  ```

## Step : Configure Debezium to start syncing MySQL to Kafka

- Create a new file (“mysql-connector.json”) with these configurations:
  ```json
  {
    "name": "mysql-connector",
    "config": {
      "connector.class": "io.debezium.connector.mysql.MySqlConnector",
      "tasks.max": "1",
      "database.hostname": "mysql",
      "database.port": "3306",
      "database.user": "root",
      "database.password": "debezium",
      "database.server.id": "184054",
      "topic.prefix": "debezium",
      "database.include.list": "inventory",
      "schema.history.internal.kafka.bootstrap.servers": "kafka:9092",
      "schema.history.internal.kafka.topic": "schemahistory.inventory"
    }
  }
  ```
- To register the connector, run the following command :
  ```sh
      curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @mysql-connector.json
  ```
- To check the **topics** created by Debezium connector, run :
  ```sh
    docker exec -it kafka bash bin/kafka-topics.sh --list  --bootstrap-server kafka:9092
  ```
- Now let’s check the debezium CDC events on a specific table :
  ```sh
     docker exec -it kafka bash bin/kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic debezium.inventory.addresses --from-beginning
  ```
- We see a list of dictionaries containing all the operations performed on a specific table. The most important attribute to check is `“op”`. It’s a mandatory string that describes the type of operation. In an update event value, the `op` field value is `u`, signifying that this row changed because of an update, `c` for **create**, `t` for **truncate** and `d` for **delete**.

## Step : Syncing data to Google BigQuery

- Now, we will **register** a **Kafka connector** to sink data based on the events streamed into the **Kafka topics**. We will achieve this by using a JSON configuration file named “bigquery-connector.json’”:
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
- Where:

  - `name`: Globally-unique name to use for this connector.
  - `tasks.max`: Maximum number of tasks to use for this connector. The default is `1`. Each task replicates exclusive set of partitions assigned to it.
  - `topics.regex`: A Java regular expression of topics to replicate. For example: specify .`*` to replicate all available **topics** in the cluster. Applicable only when Use regular expressions is selected.
  - `keyfile`: A `JSON` key with **BigQuery** service account credentials.
  - `project`: The BigQuery project to which topic data will be written.
  - `defaultDataset`: The default Google BigQuery dataset to be used.
  - `autoCreateTables`: Automatically create BigQuery tables if they don’t already exist. If the table does not exist, then it is created based on the record schema.
  - `topic2TableMap`: Map of topics to tables. Format: comma-separated tuples, for example `topic1:table1,topic2:table2`.
  - `allowNewBigQueryFields`: If `true`, new fields can be added to BigQuery tables during subsequent schema updates.
  - `allowBigQueryRequiredFieldRelaxation`: If `true`, fields in the BigQuery schema can be changed from `REQUIRED` to `NULLABLE`.
  - `upsertEnabled`: Enables upsert functionality on the connector
  - `deleteEnabled`: Enable delete functionality on the connector.
  - `kafkaKeyFieldName`: The name of the BigQuery table field for the Kafka key. Must be set when upsert or delete is enabled.
  - `timePartitioningType`: The time partitioning type to use when creating tables.
  - `bigQueryRetry`: The number of retry attempts made for each BigQuery request that fails with a backend or quota exceeded error.
  - `bigQueryRetryWait`: The minimum amount of time, in milliseconds, to wait between BigQuery backend or quota exceeded error retry attempts.
  - `errors.tolerance`: Error tolerance response during connector operation. Default value is `none` and signals that any error will result in an immediate connector task failure. Value of `all` changes the behavior to skip over problematic records.
  - `errors.deadletterqueue.topic.name`: The name of the **topic** to be used as the **dead letter queue** (DLQ) for messages that result in an error when processed by this **sink connector**, its transformations, or converters. The **topic name** is blank by default, which means that no messages are recorded in the DLQ.
  - `errors.deadletterqueue.topic .replication.factor`: Replication factor used to create the dead letter queue topic when it doesn’t already exist.
  - `errors.deadletterqueue.context .headers.enable`: When `true`, adds a header containing error context to the messages written to the dead letter queue. To avoid clashing with headers from the original record, all error context header keys, start with `__connect.errors`.
  - `value.converter`: The format of the value in the Redpanda topic. The default is `JSON`.

- **Note**:

  - Make sure to replace the dataset “defaultDataset” with the name of the desired dataset in your Bigquery project. If your remove this field, Kafka connector will keep the same name of the source database.
  - You need also to provide a service account key to the connector with Bigquery/DataEditor role on the target dataset.
  - If your kafka connect is deployed in **kubernetes** or a compute engine, you can remove the attribute “keyfile” and use directly workload identity.

- Now let’s **register** the **Bigquery sink**:
  ```sh
    curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @bigquery-connector.json
  ```

# Resources and Further Reading

1. [Debezium documentation](https://debezium.io/documentation/)
2. [Kafka Connect Documentation](https://docs.confluent.io/platform/current/connect/index.html)
3. [BigQuery Connect Documentation](https://docs.confluent.io/kafka-connectors/bigquery/current/overview.html)
