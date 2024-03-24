# Data Ops Services

## Table of Contents

# Project Setup

## Terminate the Kafka Environment

- Stop the producer and consumer clients with `Ctrl-C`
- Stop the Kafka broker with `Ctrl-C`.
- If you also want to delete any data of your local Kafka environment including any events you have created along the way, run the command:\
  ```sh
    rm -rf /tmp/kafka-logs /tmp/zookeeper /tmp/kraft-combined-logs
  ```

# Resources

1. [kafka.apache.org/documentation](https://kafka.apache.org/documentation/)
2. [UI for Apache Kafka](https://docs.kafka-ui.provectus.io/)
3. [UI for Apache Kafka - Configuration file](https://docs.kafka-ui.provectus.io/configuration/configuration-file)