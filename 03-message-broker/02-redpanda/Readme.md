# Redpanda

## Table Of Contents

- How **Redpanda** Differs from **Kafka**:

  1. Peformance

     - **Redpanda** is written in **C++** (instead of **Java** like **Kafka**), which gives it better performance and lower latency.
     - It leverages modern hardware, such as NVMe disks, and uses kernel bypass techniques for faster I/O.

  2. Simplified Operations

     - No ZooKeeper: Redpanda doesn’t require ZooKeeper for metadata management, which simplifies deployment and maintenance.
     - Easier to run locally and in production with fewer moving parts.

  3. Lower Resource Requirements

     - Redpanda is lightweight and optimized to use less CPU and memory than Kafka, making it suitable for resource-constrained environments.

  4. Built-in Features

     - Redpanda has a built-in schema registry and Web UI, removing the need to deploy additional components.
     - Time travel with data replay for debugging or reprocessing historical data.

  5. Resilience

     - Redpanda implements a single binary architecture, reducing points of failure and simplifying scaling.

  6. Cost-Effectiveness
     - Requires fewer resources to achieve high performance, reducing operational costs.

# Resources and Further Reading
