# Replica Set in MongoDB

# What is Replication?

- **Replication** is the process of creating multiple copies of the same data to increase the availability and stability. Technically, if a node is down, we can forward the incoming requests to another node while making the previous one back to life. Replication prevents data loss since you always have a copy of your data somewhere; it can be in the same physical server or distributed across many regions.

# Replica in MongoDB

- In **MongoDB**, A **replica** set is a group of **mongod** processes that maintain the same data set. It follows a specific structure where we have a first node called **primary** that receives the that then, these data are synced between the others node called **secondary**.

# Requirements

- A **replica set** requires a minimum of two voting members to function properly. These members can elect a primary if one fails.

# Create a Replica Set with Docker compose

- Create a `docker-compose.yml` file with the following:
  ```yml
  version: "1"
  ```
- Here, We created three **Docker containers** from **MongoDB images**.
