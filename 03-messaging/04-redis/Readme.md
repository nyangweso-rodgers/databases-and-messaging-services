# Redis

## Table Of Contents

# What is Redis?

- **Redis**, which stands for **Remote Dictionary Server**, is a fast, open source, in-memory, key-value data store. **Redis** delivers sub-millisecond response times, enabling millions of requests per second for real-time applications in industries like gaming, ad-tech, financial services, healthcare, and IoT.

- **Advantages of Redis**

  1. Ease of Access : It’s super easy to set up redis
  2. It’s way fast that gives best response time
  3. Data Structures : Redis supports almost every datastructure
  4. We can store data as key value pairs
  5. Downtime is negligible in terms of scaling
  6. It’s open source and stable

- **Uses Cases Of Using Redis**

  1. **Caching**: Redis is a good choice for implementing a highly available in-memory cache to decrease data access latency with disk or SSD, high throughput and ease the load of the database and application. Web page caching, Database query results caching, persistent session caching and caching of frequently used objects such as images, files, and metadata are popular examples of caching solutions with Redis.

  2. **Session Store**: Session state is user-related data that captures the current status of user interaction with applications such as a website or a game. **Session state** is how applications remember user identity, login credentials, personalization information, recent actions, shopping cart details, and more.

  3. **Chat and Messaging Applications**: Redis supports **Pub/Sub** with pattern matching and many different varieties of data structures such as lists, sorted sets, and hashes. This allows Redis to support high-performance chat rooms, real-time comment streams, social media feeds and server intercommunication.

  4. **Gaming Leaderboard Applications**: Redis is a very popular choice among game developers looking to build real-time leaderboards or scoreboards. Redis Sorted Set data structure can be simply used to implement this use case, which provides uniqueness of elements while keeping the list sorted by users’ scores(points) associated with the key. Need to update the user’s score whenever it changes. We can also use Sorted Sets to handle time-series data by using timestamps as the score for ranking based on timestamps.

# Redis Metrics: Monitoring, Performance

- **Why Monitoring Redis Matters**

  1.  Prevent downtime by catching issues before they escalate.
  2.  Optimize performance to ensure queries execute quickly.
  3.  Scale efficiently by understanding resource consumption.
  4.  Troubleshoot problems faster by identifying bottlenecks.

- **Redis Metrics to Track**

  1. **Memory Usage**

     - **Redis** is an **in-memory database**, so memory consumption is a big deal. Here are some key metrics:
       - `used_memory`: The total memory used by Redis.
       - `used_memory_peak`: The highest memory usage recorded.
       - `used_memory_rss`: The actual physical memory being used.
     - Why it matters: If `used_memory` keeps increasing, you might be dealing with memory leaks or inefficient key eviction policies. Keeping an eye on memory usage helps prevent out-of-memory crashes.

  2. **Evictions and Expirations**

     - **Redis** uses an `eviction` policy when memory is full, meaning older keys are removed.
       - `evicted_keys`: Number of keys forcibly removed.
       - `expired_keys`: Number of keys that naturally expired.
     - Why it matters: A high eviction rate might indicate that your memory is too small for your dataset, which can cause unexpected data loss.

  3. **Connected Clients**

     - This metric tells you how many clients are currently connected to Redis.
     - Why it matters: Too many connections can overload the Redis instance, leading to performance degradation or crashes.

  4. **Command Execution Latency**

     - **Latency** is a major performance factor in Redis. Two key metrics to monitor:
       - `latency`: The time it takes for Redis to process a command.
       - `commandstats`: A breakdown of command execution times.

  5. **Replication Lag**

     - If you're using **Redis replication**, monitoring replication lag is crucial.
       - `master_repl_offset`: The amount of data written to the master.
       - `slave_repl_offset`: How much of that data has been copied by replicas.
       - `repl_backlog_histlen`: The backlog of data available for syncing.
     - Why it matters: Replication lag can lead to stale reads or inconsistent data across replicas. If lag keeps increasing, it could mean slow network connections or resource contention.

  6. **CPU Usage**

     - CPU metrics help you understand how much processing power Redis is using.
       - `used_cpu_sys`: System CPU time consumed by Redis.
       - `used_cpu_user`: User-level CPU time.
       - `used_cpu_sys_children`: CPU time consumed by child processes (e.g., when running background tasks).
     - Why it matters: If **Redis** is consuming too much CPU, it might indicate inefficient queries or a need for more resources.

  7. **Shard Limit and Migration Metrics**
     - In **Redis Cluster mode**, data is distributed across multiple **shards**. Monitoring **shard limits** and migration metrics helps ensure proper data distribution and rebalancing.
       - `cluster_slots_assigned`: Number of slots assigned to the cluster.
       - `cluster_slots_ok`: Slots functioning normally.
       - `cluster_slots_fail`: Slots in failure state.
       - `migrating_slots`: Number of slots currently being moved between nodes.
       - `importing_slots`: Number of slots being imported into a node.
     - Why It Matters: If **Redis** reaches its shard limit, scaling may become difficult. Frequent slot migrations might indicate an imbalance in data distribution, affecting performance and stability.

- **Best Practices for Monitoring Redis**

  1. **Use Redis' Built-in Monitoring Tools**

     - Redis provides built-in commands to fetch metrics:
       - `INFO` — Displays general Redis statistics.
       - `MONITOR` — Shows real-time command execution (use with caution in production).
       - `SLOWLOG` — Identifies slow queries.

  2. **Set Up Alerts for Critical Metrics**

     - Use monitoring tools like **Prometheus**, **Datadog**, or **Redis Sentinel** to set up alerts for:
       - High memory usage
       - Increased command latency
       - Unusual client connections
       - Replication lag

  3. **Use External Monitoring Solutions**

     - If you're running Redis at scale, consider using tools designed for production monitoring:
       - Prometheus + Grafana
       - Last9
       - New Relic
       - AWS CloudWatch

  4. **Optimize Your Redis Configuration**
     - Some quick tweaks to improve performance:
       - Adjust `maxmemory` settings to prevent crashes.
       - Use appropriate eviction policies (`allkeys-lru`, `volatile-lru`, etc.).
       - Tune timeout and `tcp-keepalive` settings to avoid stale connections.

# Resources and Further Reading

1. [Last9.io - Redis Metrics: Monitoring, Performance, and Best Practices](https://last9.io/blog/redis-metrics-monitoring/?ref=dailydev)
