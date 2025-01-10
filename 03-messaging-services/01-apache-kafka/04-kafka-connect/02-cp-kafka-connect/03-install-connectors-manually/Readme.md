# Install Connectors Manually

## Table Of Contents

# Manual Installation

- Download the **JAR** file (usually from [Confluent Hub](https://www.confluent.io/hub/)) and place it in a folder on your **Kafka Connect** worker (directory specified by the CONNECT_PLUGIN_PATH environment variable). This method offers granular control but requires manual intervention on each node.
- Key Components of the downloaded folder are:
  1.  `lib/`: This directory holds the core JAR file containing the connector implementation. This is the essential part for your **Docker image**.
  2.  `assets/`, `doc/`, `etc/`: These directories contain additional resources like configuration examples, documentation, and other supporting files. While not strictly required for the connector to function, they can be useful for reference and troubleshooting.
- Step 2: Create a `cp-kafka-connect/` for the downloaded connectors. Here is how my directory looks like:
  - cp-kafka-connect/
    - Dockerfile
    - plugins
      - debezium-debezium-connector-postgres-2.5.4
        - assets/
        - doc/
        - etc/
        - lib/
        - manifest.json
- Step 3: create a `Dockerfile` and configure the files:
  - **Example** (for debezium Postgres CDC Source Connector):
    ```Dockerfile
        #FROM confluentinc/cp-kafka-connect-base:5.5.0
        FROM confluentinc/cp-kafka-connect:7.7.0
        ENV CONNECT_PLUGIN_PATH="/usr/share/java,/usr/share/confluent-hub-components"
        RUN confluent-hub install --no-prompt jcustenborder/kafka-connect-spooldir:2.0.43
    ```
