# Apache Kafka

## Table Of Contents

# Use Cases of Kafka

1. Real-time data processing and analytics
2. Log and event data aggregation
3. Stream processing in big data pipelines

# Kafka Concepts

## Kafka Concept #: Topics

- Kafka categorizes data into **topics**. A **topic** is a category or feed name to which records are published.
- **Producers** publish messages to a specific topic. The messages can be in any format, with `JSON` and `Avro` being popular options. **Consumers** subscribe to a topic to consume the records published by producers.

## Kafka Concept #: Broker

- A single **Kafka Cluster** is made of **Brokers**. They handle **producers** and **consumers** and keeps data replicated in the cluster.

## Kafka Concept# Kafka Zookeepr

- [Zookeeper](https://zookeeper.apache.org/) a service for managing and synchronizing distributed systems. It is a service used to manage Kafka clusters.
- Kafka uses Zookeeper to manage the brokers in a cluster, and requires Zookeeper even if you're running a Kafka cluster with only one broker.

# Setting up Apache Kafka

- Goal: install Kafka in a VM and use Linux Ubuntu as a distribution of choice

## Setting up Kafka on Docker

- With Docker, we don't have to install various tools manually, instead, we write a `docker-compose.yml` to manage containers.
- We will need, two **Docker Images** for the set up:

  1. [wurstmeister/zookeeper](https://hub.docker.com/r/wurstmeister/zookeeper/)
  2. [wurstmeister/kafka](https://hub.docker.com/r/wurstmeister/kafka/)

- Create a `docker-compose.yml` file with the following contents:

  ```yml
  #docker-compose.yml
  version: "3"

  services:
    zookeeper:
      image: wurstmeister/zookeeper
      container_name: zookeeper
      ports:
        - "2181:2181"
    kafka:
      image: wurstmeister/kafka
      container_name: kafka
      ports:
        - "9092:9092"
      environment:
        KAFKA_ADVERTISED_HOST_NAME: localhost
        KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
  ```

- In the above `docker-compose.yml` file, we have defined the following services:

  - `zookeeper`: Kafka depends on `Zookeeper` to store metadata about the topics and partitions. For development purposes, you don't need to interact with it and you can safely ignore it for the time being.

- Execute the following command to pull the images and create containers: `docker-compose -f docker-compose.yml up -d`. The `-d` means both `Zookeeper` and `Kafka` will run in the background, so you’ll have access to the Terminal after they start.
- Run the `docker-compose.yml` file by `docker-compose up -d` command.
- And that’s it! You can use the `docker ps` command to verify both are running:

# Install Kafka

- Check [kafka.apache.org/downloads](https://kafka.apache.org/downloads) to see various versions of Kafka for download.

## Install Kafka on Windows (WSL2) and Linux

- Kafka isn't natively supported on Windows, so you will need to use either WSL2 or Docker.
- To set up WSL2 on Widows, follow [the instructions in the official docs](https://learn.microsoft.com/en-us/windows/wsl/install)

## Step 2: Install Java

- First, install Java 11 by running the following commands:

  ```sh
    wget -O- https://apt.corretto.aws/corretto.key | sudo apt-key add -

    sudo add-apt-repository 'deb https://apt.corretto.aws stable main'

    sudo apt-get update; sudo apt-get install -y java-11-amazon-corretto-jdk
  ```

- Then, run:
  ```sh
    java --version
  ```
- From the root directory, download Kafka by:
  ```sh
    wget wget https://archive.apache.org/dist/kafka/3.7.0/kafka_2.13-3.7.0.tgz
  ```
- Extract the contents of the download with:
  ```sh
    tar xzf kafka_2.13-3.7.0.tgz
  ```
- if you run `ls` you should see `kafka_2.13-3.7.0` in the root directory.
- To make it easier to work with Kafka, you can add Kafka to the `PATH` environment variable. Open your `~/.bashrc` (if using `Bash`) and add the following line, replacing `USERNAME` with your username:
  ```sh
    PATH="$PATH:home/USERNAME/kafka_2.13-3.3.1/bin"
  ```
- You'll need to close your terminal for this change to take effect.
- Now, if you run `echo $PATH` you should see that the Kafka bin directory has been added to your path.
- Run `kafka-topics.sh --version` in a terminal and you should see 3.3.1. If you do, you're all set.

# Setting Up Kafka with Docker Image

## Step 1: Get the Docker Image

```sh
    docker pull apache/kafka:3.7.0
```

# Resources

1. [zookeeper.apache.org](https://zookeeper.apache.org/)
2. [kafka.apache.org/downloads](https://kafka.apache.org/downloads)
3. [freecodecamp - The Apache Kafka Handbook – How to Get Started Using Kafka](https://www.freecodecamp.org/news/apache-kafka-handbook/)
