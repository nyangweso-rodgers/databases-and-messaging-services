# Protobuf Schema

## Table Of Contents

# Protobuf

- **Protobuf** is optimized for high performance, using a binary encoding that omits the **schema** within the serialized data. This approach minimizes the data payload size if your bandwidth is limited. **Protobuf**'s binary format is less readable, but it supports a broader range of programming languages, offering a more versatile solution for multi-language environments.
- It's worth noting that while **Protobuf** supports more languages, the level of tooling and ecosystem support may vary. A significant feature of **Protobuf** is its native support for **gRPC**, an integration that allows for easy implementation of efficient, scalable microservices.
- Here’s an example of a **Protobuf schema** containing one message type

  ```proto
    syntax = "proto3";

    package com.codingharbour.protobuf;

    message SimpleMessage {
        string content = 1;
        string date_time = 2;
    }
  ```

  - Each field is assigned a so-called field number, which has to be unique in a message type. These numbers identify the fields when the message is serialized to the Protobuf binary format. Google suggests using numbers 1 through 15 for most frequently used fields because it takes one byte to encode them.

- **Protobuf** supports common scalar types like:
  1. `string`,
  2. `int32`,
  3. `int64` (long),
  4. `double`,
  5. `bool` etc.
- Besides **scalar types**, it is possible to use complex data types. Below we see two schemas, **Order** and **Product**, where **Order** can contain zero, one or more Products:

  ```proto
    message Order {
        int64 order_id = 1;
        int64 date_time = 2;
        repeated Product product = 3;
    }

    message Product {
        int32 product_id = 1;
        string name = 2;
        string description = 3;
    }
  ```

# Resources and Further Reading

1. [Protobuf Documentation](https://protobuf.dev/overview/#scalar)
