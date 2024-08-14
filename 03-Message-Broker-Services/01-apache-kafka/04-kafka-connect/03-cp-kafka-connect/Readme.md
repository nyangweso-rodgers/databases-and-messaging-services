# cp-kafka-connect

## Table Of Contents

# Kafka Connect Images on Docker Hub

- You can get **kafka-connect image** from [confluentinc/cp-kafka-connect](https://hub.docker.com/r/confluentinc/cp-kafka-connect).
- **Confluent** maintains its own image for **Kafka Connect**, `cp-kafka-connect-base`, which provides a basic **Connect** worker to which you can add your desired JAR files for sink and source connectors, single message transforms, and converters.
- For example, these are the bare minimum variables necessary to get a Connect Distributed Server running, but assumes it is connected to **Kafka** cluster with at least three brokers (replication factor for the three Connect topics). Additional variables for replication factor of the three Connect topics can be added, as described below for testing against less than three brokers.
  1. `CONNECT_BOOTSTRAP_SERVERS`
  2. `CONNECT_GROUP_ID`
  3. `CONNECT_KEY_CONVERTER`
  4. `CONNECT_VALUE_CONVERTER`
  5. `CONNECT_CONFIG_STORAGE_TOPIC`
  6. `CONNECT_OFFSET_STORAGE_TOPIC`
  7. `CONNECT_STATUS_STORAGE_TOPIC`

# Connectors For Kafka Connect

- According to the [Confluent documentation](), this docker image comes with pre-installed **connector plugins** including:
  1. Elastic
- [Since Confluent Platform 6.0 connectors are no longer bundled](https://docs.confluent.io/platform/current/release-notes/index.html#connectors), and need to be installed separately. You can [build your own image](https://docs.confluent.io/platform/current/installation/docker/development.html#create-a-docker-image-containing-c-hub-connectors) based on **cp-kafka-connect-base**, or install connectors at runtime by overwriding the image command.

```yml
cp-kafka-connect:
  #image: confluentinc/cp-server-connect:${KAFKA_VERSION}
  image: confluentinc/cp-kafka-connect-base:6.0.0
  container_name: cp-kafka-connect
  ports:
    - "8083:8083"
  depends_on:
    - kafka
    - schema-registry
  environment:
    CONNECT_BOOTSTRAP_SERVERS: "kafka:29092"
    CONNECT_REST_ADVERTISED_HOST_NAME: connect
    CONNECT_GROUP_ID: compose-connect-group
    # kafka
    CONNECT_CONFIG_STORAGE_TOPIC: _kafka-connect-group-configs
    CONNECT_OFFSET_STORAGE_TOPIC: _kafka-connect-offsets
    CONNECT_STATUS_STORAGE_TOPIC: _kafka-connect-status
    CONNECT_CONFIG_STORAGE_REPLICATION_FACTOR: 1
    CONNECT_OFFSET_STORAGE_REPLICATION_FACTOR: 1
    CONNECT_STATUS_STORAGE_REPLICATION_FACTOR: 1

    CONNECT_KEY_CONVERTER: org.apache.kafka.connect.json.JsonConverter

    CONNECT_OFFSET_FLUSH_INTERVAL_MS: 10000

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

- If you need install a **Connector**, you can go to the [confluent.io/hub/](https://www.confluent.io/hub) select your specific **connector**. Then, you can create your **DockerImage** of specific **Kafka Connect** server.

# kafka-connect-jdbc library with Dockerfile

```Dockerfile
    FROM docker.arvancloud.ir/confluentinc/cp-kafka-connect:latest

    RUN confluent-hub install confluentinc/kafka-connect-jdbc:10.7.6 --no-prompt
```

## Step 1: Write `Dockerfile`

```Dockerfile
  FROM confluentinc/cp-kafka-connect
```

## Step 2: Add **connector** "example JDBC" from [Confluent Hub](https://www.confluent.io/hub)

```Dockerfile
  FROM confluentinc/cp-kafka-connect
  ENV MYSQL_DRIVER_VERSION 5.1.39
  RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:10.5.0
  RUN curl -k -SL "https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${MYSQL_DRIVER_VERSION}.tar.gz" \
      | tar -xzf - -C /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib \
      --strip-components=1 mysql-connector-java-5.1.39/mysql-connector-java-${MYSQL_DRIVER_VERSION}-bin.jar
```

## Step 3: Build the docker image

```sh
  docker build . -t my-kafka-connect-jdbc:1.0.0
```

## Step 4: Edit `docker-compose.yml` File Configuration

```yml
#docker-compose.yml
image: my-kafka-connect-jdbc:1.0.0
```

## Step 5: Stop and Start your Confluent Platform local environment

```sh
  docker-compose down
  docker-compose up
```

## Step 6: Test your Connect server:

```sh
  curl --location --request GET 'http://localhost:8083/connectors'
```

# How to install connectors to the docker image of apache kafka connect

## Solution without using Confluent Hub

### Step 1.1: Build your own Kafka-Connect image

- Your directory should look like this:
  - my-directory /
    - Dockerfile
    - plugins /
      - my-connector /
        - <connector-jars>
- `Dockerfile`
  ```Dockerfile
    FROM confluentinc/cp-kafka-connect-base:latest
    USER root:root
    COPY ./plugins/ /opt/kafka/plugins/
    ENV CONNECT_PLUGIN_PATH="/opt/kafka/plugins"
    USER 1001
  ```
- Run the following
  ```sh
    cd /my-directory
    docker build . -t my-connector-image-name
  ```

### Step 1.2: Use the created image for your kafka-connect container

```yml
#docker-compose.yml
version: "3"
services:
  zookeeper:
  kafka:
  cp-kafka-connect:
    image: "my-connector-image-name:latest"
    container_name: "kafka-connect"
    ports:
      - "8083:8083"
    environment: CONNECT_BOOTSTRAP_SERVERS=kafka:29092
```

### Step 1.3: Get available Connector Plugins

```sh
  curl localhost:8084/connector-plugins | json_pp
```

- If you need to check the list of available **plugins** you should hit `localhost:8083/connector-plugins`
  ```sh
      curl localhost:8084/connector-plugins
  ```

# Resources and Further Reading
