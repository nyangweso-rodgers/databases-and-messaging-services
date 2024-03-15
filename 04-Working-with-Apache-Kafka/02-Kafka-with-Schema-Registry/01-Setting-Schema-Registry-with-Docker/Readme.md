# Setting Schema Registry with Docker

## Table Of Contents

# Add Schema Registry to `docker-compose.yml` File

- Add the following to the `docker-compose.yml` file with `zookeeper` and `Kafka` defined:
  ```yml
  #docker-compose.yml
  version: "1"
  services:
    schema-registry:
    image: confluentinc/cp-schema-registry:7.3.0
    hostname: schema-registry
    container_name: schema-registry
    depends_on:
      - broker
    ports:
      - "8081:8081"
    environment:
      SCHEMA_REGISTRY_HOST_NAME: schema-registry
      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: "broker:29092"
      SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081
  ```

# Resources

1. [confluentinc/cp-schema-registry Docker Image](https://hub.docker.com/r/confluentinc/cp-schema-registry)
