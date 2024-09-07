# jdbc Source Connector

## Table Of Contents

# Configuration Properties for the JDBC Connector:

1. `key.converter` and `value.converter`: These properties specify how the connector should serialize the key and value of the messages it produces.
   - Examle:You need to use the Avro Converter.
2. `value.converter.schema.registry.url`: This points to the URL of the Schema Registry, allowing the connector to use registered schemas.
3. `value.converter.value.subject.name.strategy`: This sets the naming strategy for the schema subjects (for values). By default, it uses the TopicNameStrategy, which registers the subject as topic-name-value (in this case, users.customers.avro.v1-value)
