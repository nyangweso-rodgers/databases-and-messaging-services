# Setup ClickHouse Cloud

## Table of Contents


# Costs

1. **vCPUs** (**Virtual CPUs**)

   - **vCPUs** represent the amount of **compute power** allocated to your ClickHouse Cloud service.
   - In **ClickHouse Cloud**, **compute resources** are measured in **compute units**, where **1 compute unit** typically corresponds to a specific amount of **RAM and vCPUs** (e.g., **8 GiB of RAM and 2 vCPUs**, though this can vary slightly depending on the tier or configuration).
   - Each **vCPU** is a **virtualized CPU core** that can execute tasks and queries.

   - How **vCPUs** Impact Costs

     - **Higher vCPUs**: More compute power, which improves query performance and allows you to handle larger workloads.
     - **Lower vCPUs**: Less compute power, which is cost-effective but may lead to slower query performance for large datasets or high query loads.

   - When to Increase **vCPUs**
     1. If your queries are slow or timing out.
     2. If you have a high volume of concurrent queries.
     3. If you’re working with large datasets that require significant processing.

2. **Replicas**

   - **Replicas** are copies of your data stored on different nodes in a **ClickHouse cluster**.
   - Each **replica** contains the same data, providing **high availability** and **fault tolerance**.

   - How Replicas **Impact Costs**

     - **1 Replica**: Only one copy of your data exists. If the node storing your data fails, your database becomes unavailable until the issue is resolved.
     - **2 Replicas**: Two copies of your data exist on separate nodes. If one node fails, the other can continue serving queries, ensuring high availability.
     - **3 Replicas**: Three copies of your data exist, providing even higher fault tolerance.

   - When to Increase Replicas:

     - If you need **high availability** (e.g., for mission-critical applications).
     - If you want to ensure **data durability** in case of hardware failures.
     - If you’re running a **distributed setup** where replicas are required for fault tolerance.

   - Cost Impact:
     - Increasing replicas **almost doubles** (**or triples**) your costs because you’re storing and processing multiple copies of your data.
     - For example:
       - **1 Replica**: You pay for **storage and compute** for one copy of your data.
       - **2 Replicas**: You pay for **storage and compute** for two copies of your data.
       - **3 Replicas**: You pay for **storage and compute** for three copies of your data.

# Resources and Further Reading
