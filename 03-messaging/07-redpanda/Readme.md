# Redpanda

# Overview

- **Redpanda** was built from the ground up as a **streaming data platform** with **no virtual memory**, **no page cache**, and a **thread-per-core architecture** that squeezes all the potential out of today’s superscalar CPUs and network cards. This is software designed for microsecond writes versus the milliseconds of a decade ago.

- **Redpanda vs. Apache Kafka**

  - What makes **Redpanda** fundamentally different from Kafka?

    1. **Kafka** is overly complex to deploy and manage. **Kafka** is a “componentized solution” with software dependencies like the **JVM** and **Apache ZooKeeper** (or ZooKeeper’s successor, **KRaft**). As a result, running Kafka at scale comes with a lot of operational complexity and often requires teams of consultants.
    2. **Kafka was designed for old hardware**: Kafka’s distributed storage system was designed to exploit low-cost commodity spinning disks. This was a huge advantage in the early 2010s, when storage was the main performance bottleneck, but hardware has evolved — CPUs have more cores and cache; disks are 1,000 times faster and 100 times cheaper; and networks are 10 to 100 times faster.
    3. **Kafka is cost prohibitive when running at scale**. Kafka complexity is not just an issue for operational agility and performance: it also drives up cost. **Clusters** require infrastructure not just for the **Kafka brokers**, but for the additional components like **ZooKeeper** and **Schema Registry**. Add in Cruise Control to handle cluster rebalancing, plus the storage costs for historical data, and infrastructure costs quickly escalate for large production deployments.

  - **The Case for Redpanda**

    1. **Simplicity**

       - **Redpanda** is deployed as a self-contained, single binary. A typical **Kafka cluster** may consist of a set of data brokers, an auxiliary **ZooKeeper** cluster (or **KRaft** consensus plane), and separately deployed resources for **REST proxy** and **schema registry** services.
       - By contrast, with **Redpanda**, **schema registry**, **HTTP proxy**, and message broker capabilities are built-in, with no need for **JVM**, **ZooKeeper** and **KRaft** dependencies. This is easier to support and lowers infrastructure costs, whether Redpanda is running on your infrastructure or as a fully managed cloud service.
       - **Redpanda** also employs native anti-entropy mechanisms to maintain your cluster in its optimal state through data imbalances and node failures. It intelligently redistributes data partitions, a manual process in Kafka that normally involves writing out the partition reassignments for each topic, or using a separate set of tools to administer the cluster.
       - And because the best thing about **Kafka** is its robust ecosystem, **Redpanda** is fully Kafka API-compatible, so it works with the entirety of Kafka streaming apps and tools. plus a developer-first CLI, and simple but powerful web console for visibility into data streams.

    2. **Performance**.

       - Written from scratch in **C++**, with a completely different internal architecture than Apache Kafka, Redpanda is designed to keep latencies consistent and low.
       - Further, **Redpanda** uses an optimistic approach to the **Raft** consensus protocol for managing its replicated log, giving you sound primitives for configuration and data replication. This provides data safety at any scale, without sacrificing performance.

    3. **Lower total cost**:
       - Redpanda is between three to six times more cost-effective than running the equivalent Kafka infrastructure and team, while still delivering superior performance.
       - Redpanda Enterprise brings a number of features designed to make operating clusters easier, with Redpanda’s tiered storage delivering infrastructure savings of between $70,000 and $1.2 million, depending on the workload and size of the cluster. That means infrastructure savings of eight to nine times compared to Kafka.

# Resources and Further Reading

1. [Data Streaming: Where Redpanda Differs From Apache Kafka](https://thenewstack.io/data-streaming-when-is-redpanda-better-than-apache-kafka/?ref=dailydev)
