# Debezium

# What is Debezium?

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

# Resources and Further Reading

1. [official tutorial for Debezium UI ](https://debezium.io/blog/2021/08/12/introducing-debezium-ui/)
