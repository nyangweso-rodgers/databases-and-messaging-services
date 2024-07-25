# Avro Schema

## Table Of Contents

# Avro

- **Avro** is flexible due to its support for dynamic typing. It does not require regenerating and recompiling code with every schema update, although doing so can optimize performance.
- One of **Avro's** strengths lies in its ecosystem, especially around languages like Java, where it offers extensive libraries and tools that integrate seamlessly with Java applications.
- Another advantage of **Avro** is its human-readable schema format, which significantly aids in debugging and maintaining the codebase by making it easier to understand the data structures in use. Avro supports native Remote Procedure Call (RPC) mechanisms, enabling efficient and direct communication between different components in a distributed system without needing an additional layer for RPC handling.

# How to Register an Avro Schema

## Step 1: Define Avro Schema

- Create an **Avro schema** file (e.g., `schema.avsc`):
  ```avsc
  {
    "type": "record",
    "name": "User",
    "namespace": "com.example",
    "fields": [
      { "name": "id", "type": "int" },
      { "name": "name", "type": "string" },
      { "name": "email", "type": "string" }
    ]
  }
  ```
- **Remarks**:
  - In **Avro schema** definitions, the **namespace** attribute is used to organize and uniquely identify the **schemas** within a larger system. It is similar to the concept of **namespaces** in programming languages like Java or C#. The **namespace** helps to avoid naming conflicts by providing a context for the schema name.

## Step 2.1: Register Avro Schema Using `curl` Command

- Example:

  ```sh
    curl -v -X POST -H "Content-Type: application/vnd.schemaregistry.v1+json" --data '{"schema": "{\"type\": \"record\", \"name\": \"delegatesSurvey\", \"namespace\": \"com.example\", \"fields\": [{ \"name\": \"id\", \"type\": \"string\" }] }"}' http://localhost:8081/subjects/Delegates-Survey/versions
  ```

## Step 2.2: Register Avro Schema Using Python Script

- If your **schema** is very complex, using a Python script can be more manageable:

  ```py
    import json
    import requests

    # Read the schema file
    with open('../schema/delegates-survey.avsc', 'r') as file:
        schema = file.read()

    # Create the payload
    payload = {
        "schema": schema
    }

    # Send the request
    response = requests.post(
        'http://localhost:8081/subjects/Delegates-Survey/versions',
        headers={'Content-Type': 'application/vnd.schemaregistry.v1+json'},
        data=json.dumps(payload)
    )

    print(response.status_code, response.text)
  ```

- The code will work as long as the `delegates-survey.avsc` file exists in the same directory as your Python script and contains a valid **Avro schema** definition.
- To run the script, save it as `register_schema.py` and use the following command:
  ```sh
    python register_schema.py
  ```

# Resources and Further Reading
