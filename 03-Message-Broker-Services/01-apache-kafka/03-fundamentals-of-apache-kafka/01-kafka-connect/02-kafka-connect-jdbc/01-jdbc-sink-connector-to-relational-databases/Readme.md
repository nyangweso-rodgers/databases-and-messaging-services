# Streaming Data to RDBMS via Kafka JDBC Sink Connector

## Table Of Contents

- Remark:
  - The biggest difficulty with the **JDBC sink connector** is that it requires knowledge of the **schema** of data that has already landed on the **Kafka topic**. **Schema Registry** must, therefore, be integrated as a separate component with the exiting **Kafka cluster** in order to transfer the data into the **RDBMS**. Therefore, to sink data from the **Kafka topic** to the **RDBMS**, the **producers** must publish messages/data containing the **schema**. The **schema** defines the structure of the data format. If the schema is not provided, the **JDBC sink connector** would not be able to map the messages with the database table’s columns after consuming messages from the topic.
  - By leveraging **Schema Registry**, we can avoid sending schema every time with messages/payloads from the producers because **Schema Registry** stores (or registers) schemas in `_schemas` **topic** and bind accordingly with the configured/mentioned topic name as defined in the JDBC sink connector’s properties file.

# Resources and Further Reading
