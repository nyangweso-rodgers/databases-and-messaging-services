# JSON Schema

## Table Of Contents

- **JSON** has the advantage of being a human-readable, non-binary format. However, it comes with negative performance impacts because **JSON** is not compact.

# How to Register a JSON Schema

## Step 1: Create JSON Schema

- Create a **JSON schema** file (e.g., schema.json):
  ```json
  {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "User",
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "name": {
        "type": "string"
      },
      "email": {
        "type": "string"
      }
    },
    "required": ["id", "name", "email"]
  }
  ```

## Step 2: Register JSON Schema

- Syntax:
  ```sh
    curl -v -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "$(cat my_schema.json)", "schemaType": "JSON"}' http://<schema-registry-host>:<port>/subjects/<subject-name>/versions
  ```
- Example:
  ```sh
    curl -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"$schema\": \"http://json-schema.org/draft-07/schema#\", \"title\": \"User\", \"type\": \"object\", \"properties\": {\"id\": {\"type\": \"integer\"}, \"name\": {\"type\": \"string\"}, \"email\": {\"type\": \"string\"}}, \"required\": [\"id\", \"name\", \"email\"]}"}' http://localhost:8081/subjects/User-value/versions
  ```
- or:
- Remark:
  - Ensure that the Content-Type header is set to `application/vnd.schemaregistry.v1+json`.
  - The JSON string within the --data parameter should escape the double quotes.
  - Replace `User-value` with the desired subject name. The convention is to use `{TopicName}-value` for the value schema and `{TopicName}-key` for the key schema if you're registering a schema for a **Kafka topic**.
  - Adjust the URL http://localhost:8081 if your Schema Registry is running on a different host or port.s

# Resources and Further Reading
