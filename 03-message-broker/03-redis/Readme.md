# Redis

# What is Redis?

- **Redis**, which stands for **Remote Dictionary Server**, is a fast, open source, in-memory, key-value data store. **Redis** delivers sub-millisecond response times, enabling millions of requests per second for real-time applications in industries like gaming, ad-tech, financial services, healthcare, and IoT.

# Advantages of Redis

1. Ease of Access : It’s super easy to set up redis
2. It’s way fast that gives best response time
3. Data Structures : Redis supports almost every datastructure
4. We can store data as key value pairs
5. Downtime is negligible in terms of scaling
6. It’s open source and stable

# Uses Cases Of Using Redis

1. **Caching**: Redis is a good choice for implementing a highly available in-memory cache to decrease data access latency with disk or SSD, high throughput and ease the load of the database and application. Web page caching, Database query results caching, persistent session caching and caching of frequently used objects such as images, files, and metadata are popular examples of caching solutions with Redis.

2. **Session Store**: Session state is user-related data that captures the current status of user interaction with applications such as a website or a game. **Session state** is how applications remember user identity, login credentials, personalization information, recent actions, shopping cart details, and more.

3. **Chat and Messaging Applications**: Redis supports **Pub/Sub** with pattern matching and many different varieties of data structures such as lists, sorted sets, and hashes. This allows Redis to support high-performance chat rooms, real-time comment streams, social media feeds and server intercommunication.

4. **Gaming Leaderboard Applications**: Redis is a very popular choice among game developers looking to build real-time leaderboards or scoreboards. Redis Sorted Set data structure can be simply used to implement this use case, which provides uniqueness of elements while keeping the list sorted by users’ scores(points) associated with the key. Need to update the user’s score whenever it changes. We can also use Sorted Sets to handle time-series data by using timestamps as the score for ranking based on timestamps.
