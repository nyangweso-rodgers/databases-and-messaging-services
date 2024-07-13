# Debezium

# What Is Change Data Capture (CDC)?

# Use-cases of CDC

1. OLAP (online analytical processing) systems use CDC to migrate data from transactional databases to analytical databases.
2. OLTP (online transactional processing) systems can also use CDC as an event bus to replicate data in a different data store. For example, from MySQL to Elasticsearch.

# What is Debezium?

- **Debezium** works on top of **kafka connect**. **Kafka Connect** is a framework for streaming data between multiple systems. When deployed, it provides REST APIs to manage connectors.
- **Debezium** is a set of **source connectors** for **Kafka Connect**. We can use it to capture changes in our databases so that your applications can respond to them in real-time.
- **Debezium** is built upon the **Apache Kafka** project and uses **Kafka** to transport the changes from one system to another. The most interesting aspect of **Debezium** is that at the core it is using **Change Data Capture** (CDC) to capture the data and push it into **Kafka**. The advantage of this is that the source database remains untouched in the sense that we don’t have to add triggers or log tables. This is a huge advantage as triggers and log tables degrade performance.

# Run Debezium Kafka Connector Using Docker

```yml
version: "1"
###########################################################################
# zookeeper
#
zookeeper:
  #image: confluentinc/cp-zookeeper:5.3.0
  #image: confluentinc/cp-zookeeper:latest
  #image: confluentinc/cp-zookeeper:7.3.0
  #image: quay.io/debezium/zookeeper
  image: confluentinc/cp-zookeeper:7.6.1
  container_name: zookeeper
  ports:
    - "2181:2181"
  environment:
    ZOOKEEPER_SERVER_ID: 1
    ZOOKEEPER_CLIENT_PORT: 2181
    ZOOKEEPER_TICK_TIME: 2000
  volumes:
    - zookeeper_volume:/var/lib/zookeeper/data
    #- zookeeper-data:/var/lib/zookeeper/data
  #restart: on-failure
  healthcheck:
    test: echo srvr | nc zookeeper 2181 || exit 1
    #test: curl -s localhost:2181 || exit 1 # using curl to query the Zookeeper server status:
    start_period: 10s
    retries: 20
    interval: 10s
############################################################################
# kafka
#
kafka:
  # An important note about accessing Kafka from clients on other machines:
  # -----------------------------------------------------------------------
  #
  # The config used here exposes port 9092 for _external_ connections to the broker
  #i.e. those from _outside_ the docker network. This could be from the host machine
  # running docker, or maybe further afield if you've got a more complicated setup.
  # If the latter is true, you will need to change the value 'localhost' in
  # KAFKA_ADVERTISED_LISTENERS to one that is resolvable to the docker host from those
  # remote clients
  #
  # For connections _internal_ to the docker network, such as from other services and components, use kafka:29092.
  #
  # See https://rmoff.net/2018/08/02/kafka-listeners-explained/ for details
  #
  #image: confluentinc/cp-kafka:7.3.1
  image: confluentinc/cp-kafka:7.6.1
  #image: confluentinc/cp-kafka:latest
  hostname: kafka
  container_name: kafka
  depends_on:
    zookeeper:
      condition: service_healthy
  ports:
    - "29092:29092"
    - "9101:9101"
    - "9092:9092"
  environment:
    KAFKA_BROKER_ID: 1
    KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    #KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:29092,PLAINTEXT_HOST://0.0.0.0:9101,PLAINTEXT_INTERNAL://0.0.0.0:29091
    #KAFKA_LISTENERS: PLAINTEXT://kafka:29092, PLAINTEXT_HOST://localhost:9101
    KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:29092

    #KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9101
    #KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9101,PLAINTEXT_INTERNAL://kafka:29091
    #KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:8098
    #KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092
    #KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092

    KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"

    KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT, PLAINTEXT_HOST:PLAINTEXT
    #KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT

    KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
    #KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT_INTERNAL

    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

    #KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
    KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 100
    KAFKA_DEFAULT_REPLICATION_FACTOR: "2"
    KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
    KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1

    KAFKA_JMX_PORT: 9092
    KAFKA_JMX_HOSTNAME: localhost

    #KAFKA_CONFLUENT_LICENSE_TOPIC_REPLICATION_FACTOR: 1
    #KAFKA_CONFLUENT_BALANCER_TOPIC_REPLICATION_FACTOR: 1

    #KAFKA_CONFLUENT_SCHEMA_REGISTRY_URL: http://schema-registry:8081
    #KAFKA_METRIC_REPORTERS: io.confluent.metrics.reporter.ConfluentMetricsReporter
    CONFLUENT_METRICS_REPORTER_BOOTSTRAP_SERVERS: kafka:29092
    CONFLUENT_METRICS_REPORTER_ZOOKEEPER_CONNECT: zookeeper:2181
    CONFLUENT_METRICS_REPORTER_TOPIC_REPLICAS: 1

    CONFLUENT_METRICS_ENABLE: "true"
    #CONFLUENT_METRICS_ENABLE: 'false'

    CONFLUENT_SUPPORT_CUSTOMER_ID: "anonymous"
  #restart: on-failure
  volumes:
    #- kafka-data:/var/lib/kafka/data
    - kafka_volume:/var/lib/kafka/data
  healthcheck:
    test: nc -z localhost 9092 || exit -1
    start_period: 15s
    interval: 5s
    timeout: 10s
    retries: 10
############################################################################
# kafka-ui
#
kafka-ui:
  #image: provectuslabs/kafka-ui:0.7.2 #not found
  image: provectuslabs/kafka-ui:latest
  container_name: kafka-ui
  ports:
    - 8080:8080
  depends_on:
    - kafka
  environment:
    DYNAMIC_CONFIG_ENABLED: "true"
    KAFKA_CLUSTERS_0_NAME: local
    KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
    KAFKA_CLUSTERS_0_SCHEMA_REGISTRY: http://schema-registry:8081
    KAFKA_CLUSTERS_0_ZOOKEEPER=zookeeper: 2181
  #volumes:
  #- ~/kui/config.yml:/etc/kafkaui/dynamic_config.yaml
############################################################################
# debezium
#
debezium:
  image: debezium/connect:latest #https://hub.docker.com/r/debezium/connect
  #restart: always
  container_name: debezium
  hostname: debezium
  depends_on:
    postgres:
      condition: service_healthy
    kafka:
      condition: service_healthy
  ports:
    - "8083:8083"
  environment:
    #BOOTSTRAP_SERVERS: kafka:9092
    BOOTSTRAP_SERVERS: kafka:29092
    GROUP_ID: 1
    #CONFIG_STORAGE_TOPIC: kafka_connect_configs
    CONFIG_STORAGE_TOPIC: connect_configs

    #STATUS_STORAGE_TOPIC: kafka_connect_statuses
    STATUS_STORAGE_TOPIC: connect_statuses

    #OFFSET_STORAGE_TOPIC: kafka_connect_offsets
    OFFSET_STORAGE_TOPIC: connect_offsets

    KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    ENABLE_DEBEZIUM_SCRIPTING: "true"
    #CONNECT_KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    #CONNECT_VALUE_CONVERTER: org.apache.kafka.connect.json.JsonConverter
    #CONNECT_KEY_CONVERTER_SCHEMAS_ENABLE: "false"
    #CONNECT_VALUE_CONVERTER_SCHEMAS_ENABLE: "false"
  healthcheck:
    test:
      [
        "CMD",
        "curl",
        "--silent",
        "--fail",
        "-X",
        "GET",
        "http://localhost:8083/connectors",
      ]
    start_period: 10s
    interval: 10s
    timeout: 5s
    retries: 5
############################################################################
# debezium-ui
#
debezium-ui:
  image: debezium/debezium-ui:latest
  restart: always
  container_name: debezium-ui
  hostname: debezium-ui
  depends_on:
    debezium:
      condition: service_healthy
  ports:
    - "8082:8080"
    #- "8082:8082"
  environment:
    KAFKA_CONNECT_URIS: http://debezium:8083
############################################################################
# schema-registry
#
schema-registry:
  #image: confluentinc/cp-schema-registry:7.3.1
  image: confluentinc/cp-schema-registry:7.6.1
  #image: confluentinc/cp-schema-registry:latest
  container_name: schema-registry
  hostname: schema-registry
  depends_on:
    kafka:
      condition: service_healthy
    zookeeper:
      condition: service_started
  ports:
    - "8081:8081"
  environment:
    SCHEMA_REGISTRY_HOST_NAME: schema-registry
    #SCHEMA_REGISTRY_HOST_NAME: localhost

    #SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9101
    SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka:29092

    #SCHEMA_REGISTRY_BOOTSTRAP_SERVERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9101

    #SCHEMA_REGISTRY_LISTENERS: http://schema-registry:8081
    SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081

    #SCHEMA_REGISTRY_KAFKASTORE_CONNECTION_URL: zookeeper:2181
    #SCHEMA_REGISTRY_KAFKASTORE_TOPIC_REPLICATION_FACTOR: 1
    SCHEMA_REGISTRY_DEBUG: "true"
  healthcheck:
    start_period: 10s
    interval: 10s
    retries: 20
    test: curl --user superUser:superUser --fail --silent --insecure http://localhost:8081/subjects --output /dev/null || exit 1
```

- Where:
  - `BOOTSTRAP_SERVERS: kafka:29092` - The **Kafka broker** to connect to.
  - `GROUP_ID: 1`: - Consumer group ID assigned to Kafka Connect consumer.
  - `CONFIG_STORAGE_TOPIC` - Topic to store connector configuration.
  - `OFFSET_STORAGE_TOPIC` - Topic to store connector offsets.
  - `STATUS_STORAGE_TOPIC` - Topic to store connector status.

# Properties

1. `database.server.name`
   - This property is not a connection property to the database, but rather the name used to keep this connection uniquely identified. It is used in the topic name generated for the CDC process against the source database. My suggestion is to not pick the type of database as the name (e.g. postgres or mysql). Picking a name like this could cause those maintaining the code to believe this name needs to align to the type of the database.
2. `io.debezium.transforms.ExtractNewRecordState`
   - By default, **Debezium** provides nested elements of **before**, **after**, and **operation**. For most use-cases, extracting just the **after** state is sufficient, and **Debezium** provides a **Single Message Transform** (SMT) to do just that. Nested elements can be tricky if you are not writing stream applications; so allowing the data to be flattened with one simple SMT is very helpful. Using this SMT makes it easier to pull data into ksqlDB for enrichment.
3. `database.history`
   - Many connectors allow for metadata related to the connector to be sourced to a different Kafka cluster. This flexibility leads to confusion, especially to developers new to Kafka Connector and a specific Connector.
   - Debezium's database history, is designed this way. You need to set-up bootstrap server, protocol, and any other connection to the kafka cluster to maintain this information, even if it is the same cluster. For enterprise deployments, this flexibility is critical. For proof-of-concepts, development, and trying to get something up and running quickly it is a lot of duplicate configuration.
4. `decimal.handling.mode`
   - Setting this to `string` can address **sink connector** issues that cannot handle the decimal logical type.
5. `snapshot.mode`
   - There are different **modes** of **snapshots**.The most used modes are:
     - `initial` used when you need the schema changes and the row level changes from the beginning. Schema changes are written to schema history and schema change topics and the data changes are written to `<topic.prefix>.<table_name>`
     - `schema_only` takes the **snapshot** of only schema. This is useful if you don't want the entire data of the tables instead you only need the data from the moment you deployed. This mode is used if your tables contain dynamic data in an OLTP system.
     - `when_needed` takes the **snapshot** whenever it's necessary i.e. when the binlogs are deleted or the schema history topic is deleted etc...

# Snapshots

- **Debezium** stores the **snapshots** of the database to provide high fault tolerance. In order to perform a snapshot, the connector first tries to get the global read lock that blocks the writes by the other clients and then reads the schema of all the tables and releases the lock. Acquiring a lock is very important because it helps in maintaining consistency as it blocks writes during that period. In case the global read lock is not possible, then it acquires table-level locks.

# Resources and Further Reading

1. [official tutorial for Debezium UI ](https://debezium.io/blog/2021/08/12/introducing-debezium-ui/)
