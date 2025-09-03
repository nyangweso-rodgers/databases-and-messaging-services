# Redis (Remote Dictionary Server)

## Table Of Contents

# What is Redis?

- **Redis**, is a fast, open source, in-memory, key-value data store. **Redis** delivers sub-millisecond response times, enabling millions of requests per second for real-time applications in industries like gaming, ad-tech, financial services, healthcare, and IoT.
- It is used as a **database**, **cache**, and **message broker**. **Redis** supports various data structures including **strings**, **hashes**, **lists**, **sets**, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries, and streams.
- **What does this key-value store mean?**

  - A **key-value database** (**key-value store**), utilizes a simple key-value pair method to store data. These databases consist of a unique string (the key) and a large data field (the value). This makes them a simple option for data storage, easy to design and implement. **Key-value databases** differ significantly from relational databases, which organize data into tables and define relationships between those tables.

- **When to use a key-value database**

  - Your application might become unstable if it needs to handle a large number of small, constant read and write operations. **Key-value databases** provide fast, in-memory access.
  - They are used for storing webpages with the URL as the key and the webpage as the value, fundamental data such as customer information, and preserving the contents of shopping carts, product categories, and e-commerce product information. These databases are suitable for programs that do not require frequent updates or support for complex queries.

- **Advantages of Redis**

  1. Ease of Access : It’s super easy to set up redis
  2. It’s way fast that gives best response time
  3. Data Structures : Redis supports almost every datastructure
  4. We can store data as key value pairs
  5. Downtime is negligible in terms of scaling
  6. It’s open source and stable

- **Features of Redis**:

  1.  It’s a NoSQL database, which means it does not have structures like tables, rows, and columns, or use statements like SELECT, UPDATE, INSERT, and DELETE, unlike MySQL and Oracle databases.
  2.  Redis utilizes various data structures to store data, including primary ones like String, Lists, Sets, Sorted Sets, and Hashes, as well as additional data structures such as Bitmaps, HyperLogLogs, and Geospatial Indexes.
  3.  Interaction with the data is command-based.

- **Uses Cases Of Using Redis**

  1. **Caching**: Redis is a good choice for implementing a highly available in-memory cache to decrease data access latency with disk or SSD, high throughput and ease the load of the database and application. Web page caching, Database query results caching, persistent session caching and caching of frequently used objects such as images, files, and metadata are popular examples of caching solutions with Redis.

  2. **Session Store**: Session state is user-related data that captures the current status of user interaction with applications such as a website or a game. **Session state** is how applications remember user identity, login credentials, personalization information, recent actions, shopping cart details, and more.

  3. **Chat and Messaging Applications**: Redis supports **Pub/Sub** with pattern matching and many different varieties of data structures such as lists, sorted sets, and hashes. This allows Redis to support high-performance chat rooms, real-time comment streams, social media feeds and server intercommunication.

  4. **Gaming Leaderboard Applications**: Redis is a very popular choice among game developers looking to build real-time leaderboards or scoreboards. Redis Sorted Set data structure can be simply used to implement this use case, which provides uniqueness of elements while keeping the list sorted by users’ scores(points) associated with the key. Need to update the user’s score whenever it changes. We can also use Sorted Sets to handle time-series data by using timestamps as the score for ranking based on timestamps.

# Key Concepts in Redis

## Redis Pipeline

- **Redis pipeline** allows you to send multiple commands to the server without waiting for individual responses. Instead of this back-and-forth ping-pong of requests and responses, you bundle commands together, fire them off in one go, and then receive all responses simultaneously.
- Without **pipelining**, each **Redis** command creates a full TCP roundtrip:
  - Client sends command
  - Server processes command
  - Server sends response
- Client above pattern creates latency – the sneaky performance killer that adds up quickly, especially over networks.

- **Implementing Redis in Python**

  - Example code:

    ```py
      import redis

      r = redis.Redis(host='localhost', port=6379, db=0)

      # Start a pipeline
      pipe = r.pipeline()

      # Queue up commands (these don't execute yet)
      pipe.set("user:1:name", "Alex")
      pipe.set("user:1:email", "alex@example.com")
      pipe.incr("user:1:visits")
      pipe.expire("user:1:sessions", 3600)

      # Execute all commands in a single roundtrip
      results = pipe.execute()

      # Results is an array of responses in the same order as commands
      print(results)  # [True, True, 1, True]
    ```

  - **Explanation**:
    - This code creates a pipeline object that acts as a command buffer. Each method call (`.set()`, `.incr()`, etc.) doesn't actually send anything to Redis yet – it just queues the command.
    - When `.execute()` is called, all commands are sent to **Redis** in a single network operation, and all results are returned together as an array. The order of responses matches the order of commands, so `results[0]` corresponds to the first command, `results[1]` to the second, and so on.

- **Node.js Implementation with ioredis**

  - Example Code:

    ```js
    const Redis = require("ioredis");
    const redis = new Redis({
      host: "localhost",
      port: 6379,
    });

    // Create pipeline
    const pipeline = redis.pipeline();

    // Queue commands
    pipeline.set("product:1234:views", 0);
    pipeline.incr("product:1234:views");
    pipeline.get("product:1234:views");

    // Execute pipeline
    pipeline.exec((err, results) => {
      if (err) {
        console.error("Pipeline failed:", err);
        return;
      }

      // Each result is [err, response]
      console.log(results); // [[null, 'OK'], [null, 1], [null, '1']]

      // Access individual results
      const viewCount = results[2][1];
      console.log(`Product view count: ${viewCount}`);
    });
    ```

  - **Explanation**:
    - In ioredis, the pipeline pattern is similar, but the response format is slightly different. Each result in the array is itself an array with two elements: `[error, response]`.
    - This allows for per-command error handling. If a command succeeds, its error value is `null`. The second example also shows how to use the results – accessing the third command's response (`results[2][1]`) to get the view count.

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
2. [Last9.io - How to Make the Most of Redis Pipeline](https://last9.io/blog/how-to-make-the-most-of-redis-pipeline/?ref=dailydev)
