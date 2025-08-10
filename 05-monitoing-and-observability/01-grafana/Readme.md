# Grafana

## Table Of Contents

# Overview of Grafana

# Grafana Concepts

- Use Cases:

  1. Visualize key business metrics
  2. Track system performance

- **Grafana Open Source**

  - Limitationa:
    1. No scheduled reports: Grafana OSS does not support automated PDF, CSV, or Excel exports.
    2. No email report delivery/ distribution: Reports cannot be sent to teams or clients on a scheduled basis.
    3. Time-consuming manual exports: Users often report taking manual screenshot of dashboards to export data in form of a report and, wasting valuable time not just once but every time an updated report is required.

- **Grafana Enterprise**
  - One of the biggest reasons teams upgrade to **Grafana Enterprise** is to get **automated PDF** and **CSV reports** and distribute them.
  - **Pricing Factors**:
    1. Per-user licensing: Costs increase as more users need access to Enterprise features.
    2. Annual licensing fees: Many organizations report annual costs between $40,000 and $100,000, depending on the number of users and required features.
    3. Additional costs: Features like role-based access control (RBAC), LDAP integration, and advanced alerting add to the total cost.

# How to Monitor and Manage Grafana Memory

- Memory can spike quickly, especially with complex dashboards and multiple data sources.

- **Why Grafana’s Memory Use Can Get Out of Hand**

  - **Grafana** isn’t just showing charts, it’s constantly querying data sources, processing results, caching data, and managing real-time connections.
  - You might start with a simple dashboard using around 100MB of memory. Then you add more panels, create alerts, and connect extra data sources, and suddenly, **Grafana** is using several gigabytes.
  - The issue gets worse when multiple users access different dashboards at the same time. Each user session keeps its state, so with many panels and users, memory use grows quickly.

- **How to Monitor Grafana’s Memory Use**

  - The first step is to keep an eye on how much memory **Grafana** is using. **Grafana** exposes detailed metrics you can check anytime at the `/metrics` endpoint.
  - Here’s a quick way to get a snapshot of your Grafana server’s memory usage:
    ```sh
      curl http://<your-grafana-instance>:3000/metrics | grep memory
    ```
  - Running this command will return output like this:
    ```sh
      go_memstats_alloc_bytes 2.5165824e+08
      go_memstats_sys_bytes 7.3400328e+08
      process_resident_memory_bytes 4.1234432e+08
    ```
  - i.e., :
    - `go_memstats_alloc_bytes`: This shows how much memory **Grafana** has currently allocated and is actively using—in this example, about 251 MB. Consider it as the working set of memory that **Grafana** needs to keep things running.
    - `go_memstats_sys_bytes`: This is the total amount of memory **Grafana** has requested from the OS, which here is roughly 734 MB. It includes both the actively used memory and some overhead reserved for future needs.
    - `process_resident_memory_bytes`: This tells you how much physical RAM the Grafana process is holding at this moment—about 412MB in the example. This number can fluctuate depending on workload and garbage collection.
  - **Remarks**:
    - If you want to keep a continuous eye on these numbers, you can set up **Prometheus** to scrape the `/metrics` endpoint and create alerts when memory usage crosses a threshold. This way, you’ll catch spikes early—before your dashboards go down or slow to a crawl.

- **Grafana Memory vs System Memory: What’s the Difference?**:

  - Tracking Grafana’s memory is important, but you also need to monitor the system’s total memory usage and how much is free for applications like **Grafana**.
  - If you’re using **Prometheus** with `node_exporter`, you can collect system-level metrics alongside Grafana-specific ones.
  - Here are a few **PromQL queries** to give you a fuller picture:

    1. Show how much of the system's memory is in use, acorss all processes

       ```sh
        # Total system memory usage as a percentage
        (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)
        / node_memory_MemTotal_bytes * 100
       ```

    2. This is more useful than just looking at MemFree since it accounts for memory used in disk caches that the system can reclaim if needed.

       ```sh
        # Memory still available for user-space applications
        node_memory_MemAvailable_bytes
       ```

    3. This gives you the memory footprint of Grafana itself—what it’s holding in physical RAM.
       ```sh
        # Memory used by the Grafana process
        process_resident_memory_bytes{job="grafana"}
       ```

- **How to Set Basic Alerts to Track Memory Usage**

  - Here’s an example of how to define memory-related alerts for **Grafana** using **Prometheus** alerting rules:

    ```yml
    groups:
      - name: grafana_memory
        rules:
          - alert: GrafanaHighMemoryUsage
            expr: process_resident_memory_bytes{job="grafana"} > 1e+09 # 1GB
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Grafana memory usage is high"

          - alert: GrafanaMemoryGrowth
            expr: increase(process_resident_memory_bytes{job="grafana"}[1h]) > 1e+08 # 100MB increase in 1h
            for: 15m
            labels:
              severity: critical
            annotations:
              summary: "Grafana memory usage is growing rapidly"
    ```

  - These two alerts work together: one catches when memory use crosses a hard threshold, and the other warns you when usage is steadily increasing, often a sign of memory leaks or dashboards that are getting too heavy.
  - But to understand behavior, you need to observe how memory changes over time. **Prometheus** makes this easy:

    1. Use this to spot slow, creeping memory growth that might not trigger alerts but could lead to problems later.

       ```sh
        # Average memory usage over the past hour
        avg_over_time(process_resident_memory_bytes{job="grafana"}[1h])
       ```

    2. This is Great for detecting long-term trends or load-related spikes

       ```sh
        # How fast memory usage is changing over 24 hours
        rate(process_resident_memory_bytes{job="grafana"}[24h]
       ```

    3. This helps you answer questions like: Has Grafana ever crossed 1.5GB? If so, when?
       ```sh
        # Highest memory usage in the last day
        max_over_time(process_resident_memory_bytes{job="grafana"}[24h])
       ```

- **Advanced Memory Monitoring Techniques**

  - Basic memory stats show how much **Grafana** is using, but not why or when usage increases. To get the full picture, you need to look at container memory, Grafana’s activity, and overall system memory.
  - **If You're Running Grafana in a Container**

    - If **Grafana** runs in a container (**Docker** or **Kubernetes**), it doesn’t have access to the full system memory. The container has limits, and if **Grafana** crosses them, it can get killed even if the host system has RAM to spare.
    - Here is how to keep an eye on that:

      ```sh
        # Memory Grafana is using inside the container
        container_memory_usage_bytes{name="grafana"}

        # Memory limit assigned to the container
        container_spec_memory_limit_bytes{name="grafana"}

        # Usage as a percentage of the limit
        (container_memory_usage_bytes{name="grafana"} / container_spec_memory_limit_bytes{name="grafana"}) * 100

        # Memory actively in use, excluding page cache
        container_memory_working_set_bytes{name="grafana"}
      ```

    - If you're close to the limit (say 90% or more), it's time to consider increasing the limit or trimming down the workload, especially if you're seeing OOM kills.

- **What’s Contributing to Memory Growth?**

  - **Grafana** doesn’t give a detailed memory breakdown by feature, but its activity can be a strong signal. If your dashboards are querying a lot, running alerts, or loading multiple panels, that adds up fast.
  - Here are some useful proxy metrics:

    ```sh
      # Tracks number of queries to data sources
      grafana_datasource_request_total

      # Total number of dashboards loaded
      grafana_dashboards

      # Number of times alert rules were evaluated
      grafana_alerting_rule_evaluations_total
    ```

  - If memory usage rises alongside spikes in these metrics, there’s your clue. For example, an alert rule with a wide query range or high frequency can use a surprising amount of memory.
  - The Usual Suspects Behind High Memory Use

    1. **Dashboards with Too Many Panels**

       - Let’s say you’ve built a big "overview" dashboard: **CPU**, **memory**, **disk**, **network**, **app health**, all in one place. Sounds useful, right? But now you’ve got 40+ panels, and each one is firing off its query every 30 seconds.

    2. **Heavy Queries That Pull Too Much Data**

       - Even if you don’t have many panels, a single expensive query can hog memory fast.

    3. **Misconfigured Data Source Connections**
       - Here’s the issue: the data source itself may be leaking memory because of bad connection settings.
       - Example config with an issue:
         ```yml
         database:
           max_open_conns: 1000
           max_idle_conns: 1000
           conn_max_lifetime: 0 # Never closes connections
         ```
       - Each open connection uses memory, even idle ones. If Grafana keeps hundreds or thousands of them open with no timeout, memory usage grows continuously. This especially hurts when dashboards pull from multiple sources (e.g., Prometheus, PostgreSQL, Elastic, etc.) at once.

# Loki

- **Loki** was designed to optimize for storage cost and to help sift through logs quickly and easily, regardless of the format.So while most databases use **indexes** based on specific structures to help categorize data, **Loki** lets you send your logs in any format. You define a few labels (container name, environment, host name) and **Loki** then indexes those labels, rather than the whole log line, which makes it much more flexible. When you run a query on that data, you don’t have to worry about relying on a very large, heavily structured **index**. Instead, **Loki** only searches and retrieves the chunks that match the **labels** provided in the query. This is usually done in parallel processes, which makes it faster and more cost-effective.
- Two deployment models:
  1. **Monolithic**. This is the best place to start for beginners. It runs everything as a single binary or Docker image. **Monolithic** mode can even be scaled to multiple replicas to act as a middle-ground option.
  2. **Microservices**. Designed for Kubernetes deployment, you can run components as entirely separate services. This is the most scalable, flexible, and reliable option, but it’s also the most complex.

# Resources and Further Reading

1. [last9.io - How to Monitor and Manage Grafana Memory](https://last9.io/blog/grafana-memory-usage/?ref=dailydev)
