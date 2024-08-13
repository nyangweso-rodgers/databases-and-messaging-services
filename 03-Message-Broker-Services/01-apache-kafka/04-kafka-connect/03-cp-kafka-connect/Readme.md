# cp-kafka-connect

## Table Of Contents

```yml
cp-kafka-connect:
  image: confluentinc/cp-server-connect:${KAFKA_VERSION}
  container_name: connect
  depends_on:
    - kafka
    - schema-registry
  environment:
    CONNECT_BOOTSTRAP_SERVERS: "kafka:9092"
    CONNECT_REST_ADVERTISED_HOST_NAME: connect
    CONNECT_GROUP_ID: compose-connect-group
    CONNECT_CONFIG_STORAGE_TOPIC: docker-connect-configs
    CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR: 1
    CONNECT_OFFSET_FLUSH_INTERVAL_MS: 10000
    CONNECT_OFFSET_STORAGE_TOPIC: docker-connect-offsets
    CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR: 1
    CONNECT_STATUS_STORAGE_TOPIC: docker-connect-status
    CONNECT_STATUS_STORAGE_REPLICATION_FACTOR: 1
    CLASSPATH: /usr/share/java/monitoring-interceptors/monitoring-interceptors-7.2.1.jar
    CONNECT_PRODUCER_INTERCEPTOR_CLASSES: "io.confluent.monitoring.clients.interceptor.MonitoringProducerInterceptor"
    CONNECT_CONSUMER_INTERCEPTOR_CLASSES: "io.confluent.monitoring.clients.interceptor.MonitoringConsumerInterceptor"
    CONNECT_PLUGIN_PATH: "/usr/share/java,/usr/share/confluent-hub-components"
    CONNECT_LOG4J_LOGGERS: org.apache.kafka.connect=DEBUG,org.apache.kafka.connect.runtime.rest=DEBUG,org.apache.zookeeper=ERROR,org.I0Itec.zkclient=ERROR,org.reflections=ERROR
    CONNECT_REST_PORT: 8083
    CONNECT_KEY_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_KEY_CONVERTER_SCHEMA_REGISTRY_URL: http://schema-registry:8081
    CONNECT_VALUE_CONVERTER: io.confluent.connect.avro.AvroConverter
    CONNECT_VALUE_CONVERTER_SCHEMA_REGISTRY_URL: http://schema-registry:8081
    #CONNECT_LOG4J_ROOT_LOGLEVEL: "INFO"
    #CONNECT_LOG4J_LOGGERS: "org.apache.kafka.connect.runtime.rest=WARN,org.reflections=ERROR"
  volumes:
    - ./data/connect/data:/var/lib/kafka/data
  command:
    - /bin/bash
    - -c
    - |
      echo "Installing Connectors"
      confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.7.4

      # JDBC Drivers
      # ------------
      # Informix
      mkdir -p /usr/share/confluent-hub-components/debezium-connector-informix
      cd /usr/share/confluent-hub-components/debezium-connector-informix/
      curl https://repo1.maven.org/maven2/com/ibm/informix/jdbc/4.50.8/jdbc-4.50.8.jar --compressed --output informix-jdbc-4.50.8.jar

      # changestream
      curl https://repo1.maven.org/maven2/com/ibm/informix/ifx-changestream-client/1.1.3/ifx-changestream-client-1.1.3.jar --compressed --output ifx-changestream-client-1.1.3.jar

      # Debezium 2.5 informix
      #mkdir -p /usr/share/confluent-hub-components/debezium-connector-informix
      curl https://repo1.maven.org/maven2/io/debezium/debezium-connector-informix/2.5.0.Final/debezium-connector-informix-2.5.0.Final-plugin.tar.gz | \
      tar xvfz - --strip-components=1 --directory /usr/share/confluent-hub-components/debezium-connector-informix

      # Now launch Kafka Connect
      sleep infinity &
      /etc/confluent/docker/run
```
