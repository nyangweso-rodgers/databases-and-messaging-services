# Use Schema Registry API with Python

## Table Of Contents

## Command 1: Query supported schema formats

- verify which **schema types** are currently registered with **Schema Registry** by:

  ```py
    import requests
    import json

    def pretty(text):
      print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.get(f'{base_uri}/schemas/types').json()
    pretty(res)
  ```

- Example output:
  ```sh
    [
    "JSON",
    "PROTOBUF",
    "AVRO"
  ]
  ```

## Command 2: Register a schema

- A **schema** is registered in the registry with a **subject**, which is a name that is associated with the **schema** as it evolves. **Subjects** are typically in the form `<topic-name>-key` or `<topic-name>-value`.
- To register the `users.customers` schema, make a `POST` request to the `/subjects/users.customers-value/versions` endpoint with the Content-Type `application/vnd.schemaregistry.v1+json`:

  ```py
    import requests
    import json

    def pretty(text):
      print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    customers_schema = {
      "type": "record",
      "name": "customers",
      "fields": [
        {"name": "id", "type": "string"},
        {"name": "first_name", "type": "string"},
        {"name": "last_name", "type": "string"}
        ]
      }

    res = requests.post(
        url=f'{base_uri}/subjects/users.customers.v2-value/versions',
        data=json.dumps({
          'schema': json.dumps(customers_schema)
        }),
        headers={'Content-Type': 'application/vnd.schemaregistry.v1+json'}).json()
    pretty(res)
  ```

- Example output:
  ```sh
    {"id": 8}
  ```

## Command 3: Retrieve a schema

- To retrieve a registered schema from the registry, make a `GET` request to the `/schemas/ids/<id>` endpoint:

  ```py
    import requests
    import json

    def pretty(text):
      print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.get(f'{base_uri}/schemas/ids/8').json()
    pretty(res)
  ```

- Example output:
  ```sh
    {
      "schema": "{\"type\":\"record\",\"name\":\"customers\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"first_name\",\"type\":\"string\"},{\"name\":\"last_name\",\"type\":\"string\"}]}"
    }
  ```

## Command 4: List Registry Subjects

```py
  import requests
  import json

  def pretty(text):
    print(json.dumps(text, indent=2))

  base_uri = "http://localhost:8081"

  res = requests.get(f'{base_uri}/subjects').json()
  pretty(res)
```

- Example output:
  ```sh
    [
    "users.customers-value",
    "users.customers.v1-value",
    "users.customers.v1-value-protobuf"
  ]
  ```

## Command 5: Retrieve schema versions of a subject

- To query the schema versions of a **subject**, make a `GET` request to the `/subjects/<subject-name>/versions` endpoint.
- For example, to get the schema versions of the `users.customers.v2-value` subject:

  ```py
    import requests
    import json

    def pretty(text):
      print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.get(f'{base_uri}/subjects/users.customers.v2-value/versions').json()
    pretty(res)
  ```

- Example output:
  ```sh
    [
    1
  ]
  ```

## Command 6: Retrieve a Schema of a Subject

- To retrieve a schema associated with a subject, make a `GET` request to the `/subjects/<subject-name>/versions/<version-id>` endpoint:

  ```py
    import requests
    import json

    def pretty(text):
      print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.get(f'{base_uri}/subjects/users.customers.v1-value/versions/1').json()
    pretty(res)
  ```

- Example output:
  ```sh
    {
    "subject": "users.customers.v1-value",
    "version": 1,
    "id": 6,
    "schema": "{\"type\":\"record\",\"name\":\"Customers\",\"namespace\":\"my.examples\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"first_name\",\"type\":\"string\"},{\"name\":\"last_name\",\"type\":\"string\"},{\"name\":\"status\",\"type\":{\"type\":\"enum\",\"name\":\"StatusEnum\",\"symbols\":[\"TRUE\",\"FALSE\"]}},{\"name\":\"created_by\",\"type\":\"string\"},{\"name\":\"updated_by\",\"type\":\"string\"},{\"name\":\"created_at\",\"type\":\"long\"},{\"name\":\"updated_at\",\"type\":\"long\"}]}"
  }
  ```
- To get the **latest version**, use latest as the version ID:

  ```py
    import requests
    import json

    def pretty(text):
      print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.get(f'{base_uri}/subjects/users.customers.v1-value/versions/latest').json()
    pretty(res)
  ```

- Example output:
  ```sh
    {
    "subject": "users.customers.v1-value",
    "version": 1,
    "id": 6,
    "schema": "{\"type\":\"record\",\"name\":\"Customers\",\"namespace\":\"my.examples\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"first_name\",\"type\":\"string\"},{\"name\":\"last_name\",\"type\":\"string\"},{\"name\":\"status\",\"type\":{\"type\":\"enum\",\"name\":\"StatusEnum\",\"symbols\":[\"TRUE\",\"FALSE\"]}},{\"name\":\"created_by\",\"type\":\"string\"},{\"name\":\"updated_by\",\"type\":\"string\"},{\"name\":\"created_at\",\"type\":\"long\"},{\"name\":\"updated_at\",\"type\":\"long\"}]}"
  }
  ```
- To get only the **schema**, append `/schema` to the endpoint path:

  ```py
    import requests
    import json

    def pretty(text):
      print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.get(f'{base_uri}/subjects/users.customers.v1-value/versions/latest').json()
    pretty(res)
  ```

- Example output:
  ```sh
    {
      "type": "record",
      "name": "Customers",
      "namespace": "my.examples",
      "fields": [
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "first_name",
          "type": "string"
        },
        {
          "name": "last_name",
          "type": "string"
        },
        {
          "name": "status",
          "type": {
            "type": "enum",
            "name": "StatusEnum",
            "symbols": [
              "TRUE",
              "FALSE"
            ]
          }
        },
        {
          "name": "created_by",
          "type": "string"
        },
        {
          "name": "updated_by",
          "type": "string"
        },
        {
          "name": "created_at",
          "type": "long"
        },
        {
          "name": "updated_at",
          "type": "long"
        }
      ]
    }
  ```

## Command 7: Delete a Schema

- The [Schema Registry API]() provides DELETE endpoints for deleting a single schema or all schemas of a subject:
  1. `/subjects/<subject>/versions/<version>`
  2. `/subjects/<subject>`
- Schemas cannot be deleted if any other schemas reference it.
- A schema can be **soft deleted** (impermanently) or **hard deleted** (permanently), based on the boolean query parameter `permanent`. A soft deleted schema can be retrieved and re-registered. A hard deleted schema cannot be recovered.
- To **soft delete** a schema, make a `DELETE` request with the subject and version ID (where `permanent=false` is the default parameter value):

  ```py
    import requests
    import json

    def pretty(text):
        print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.delete(f'{base_uri}/subjects/users.customers.v2-value/versions/2').json()
    pretty(res)
  ```

  - Example output
    ```sh
      2
    ```
  - Doing a soft delete for an already deleted schema returns an error:

- Remark:

  - To list **subjects** of **soft-deleted schemas**, make a `GET` request with the deleted parameter set to `true`, `/subjects?deleted=true`:

    ```py
      import requests
      import json

      def pretty(text):
          print(json.dumps(text, indent=2))

      base_uri = "http://localhost:8081"

      payload = { 'deleted' : 'true' }
      res = requests.get(f'{base_uri}/subjects', params=payload).json()
      pretty(res)
    ```

    - Example output:
      - This returns all subjects, including deleted ones:

- To **hard delete** a schema, make two `DELETE` requests with the second request setting the permanent parameter to `true` (`/subjects/<subject>/versions/<version>?permanent=true`):

  ```py
    import requests
    import json

    def pretty(text):
        print(json.dumps(text, indent=2))

    base_uri = "http://localhost:8081"

    res = requests.delete(f'{base_uri}/subjects/users.customers.v2-value/versions/2').json()
    pretty(res)
    payload = { 'permanent' : 'true' }
    res = requests.delete(f'{base_uri}/subjects/users.customers.v2-value/versions/2', params=payload).json()
    pretty(res)
  ```

# Resources and Further Reading

1. [redpanda.com - Use the Schema Registry API](https://docs.redpanda.com/current/manage/schema-reg/schema-reg-api/#tabs-1-curl)
