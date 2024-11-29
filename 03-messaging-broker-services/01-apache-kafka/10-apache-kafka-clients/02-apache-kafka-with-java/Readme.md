# Apache Kafka with Java

# Integrating Kafka in a Spring Boot Application

# Objectives

1. Create a Spring boot application with Kafka dependencies.
2. Setup and run a local Kafka broker using an inbuilt docker-compose module.
3. Configure Kafka properties for message producer and listener
4. Use `KafkaTemplate` to send messages to a topic
5. Use `@KafkaListener` to listen to messages sent to the topic in real-time

# Java APIs Overview

## Step 1. Adding Kafka Dependency:

### 1.1 Maven Dependency

- If you’re using **Maven**, you can add the following dependency to your `pom.xml` file:
  ```xml
    <dependencies>
      <dependency>
          <groupId>org.apache.kafka</groupId>
          <artifactId>kafka-clients</artifactId>
          <version>3.0.0</version> <!-- Make sure to use the latest stable version -->
      </dependency>
  </dependencies>
  ```

### 1.2 Gradle Dependency

- If you’re using **Gradle**, you can add the following dependency to your `build.gradle` file:
  ```gradle
    dependencies {
      implementation 'org.apache.kafka:kafka-clients:3.0.0' // Make sure to use the latest stable version
  }
  ```

## Step 2. KafkaProducer API

## Step 3. KafkaConsumer API

## Step: Docker Compose File Kafka Broker

```yml
version: "3"
services:
  zookeeper:
  kafka:
```

## Step : Kafka Configuration

### Step .1: Minual Configuration

- The **Kafka** configuration is controlled by the configuration properties with the prefix `spring.kafka.*`. For example, add the following property so Spring boot auto-configuration will create a KafkaTemplate and other necessary beans.
  ```yml
  #application.yml
  spring.kafka.bootstrap-servers=localhost:29092
  ```

## Step : Add Spring Kafka Dependency

- To start integrating **Apache Kafka** with your **Spring Boot** application, the first step is to include the necessary **Spring Kafka** library in your project. Add the `spring-kafka` dependency to the `build.gradle` file.
  ```gradle
    #build.gradle
    implementation 'org.springframework.kafka:spring-kafka'
  ```
- This line includes the **spring-kafka** library, providing with the necessary tools and APIs to interact with **Kafka**.

## Step : Configure Kafka Producer Properties

- After adding the **Spring Kafka** dependency, the next step is to configure the **Kafka producer**. Create a new `YAML` file.
  ```yml
  spring:
    kafka:
      producer:
        bootstrap-servers: kafka:9092
        key-serializer: org.apache.kafka.common.serialization.StringSerializer
        value-serializer: org.apache.kafka.common.serialization.StringSerializer
      template:
        default-topic: test-java-topic
  ```

### Step .2: Create a New Topic

- To handle topic creation in **Kafka**, you generally have two options:

  1. Create the topic programmatically in your **Kafka producer** code.
  2. Use a separate utility or configuration to create the topic.

#### Step .2.1: Option 2: Use a Separate Utility or Configuration

- You can create the **topic** using Kafka command-line tools or a separate **Java class** specifically for topic creation. This approach separates concerns, making your producer code cleaner.
- If we want to create a new **Topic** in the **Kafka broker**, if it does not exist, we can provide the topic configuration as follows:
  ```java
    @configuration
    public class KafkaConfig {
      @Bean
      public NewTopic taskTopic() {
        return TopicBuilder.name("task-topic")
          .partitions(1)
          .replicas(1)
          .build();
      }
    }
  ```

# Setting Up Your Spring Boot Project

- To get started, we’ll create a new **Spring Boot** project with the following **dependencies**:
  1. Spring for Apache Kafka
  2. Spring Boot Starter Web
- We create the project using [Spring Initializr](), or you can manually add these dependencies in your **Maven** `pom.xml` or **Gradle** `build.gradle` file.
- For **Maven**:
  ```xml
    <dependencies>
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
  </dependencies>
  ```
- For **Gradle**:
  ```gradle
    dependencies {
        implementation 'org.springframework.kafka:spring-kafka'
        implementation 'org.springframework.boot:spring-boot-starter-web'
    }
  ```

## Step : Configuring Kafka in Spring Boot

- Next, we need to configure **Kafka** in our **Spring Boot** application. We’ll start by adding the following properties to the `application.properties` file:
  ```properties
    spring.kafka.bootstrap-servers=localhost:9092
    spring.kafka.consumer.group-id=my-group-id
  ```
- Here, `spring.kafka.bootstrap-servers` specifies the address of your **Kafka broker**, and `spring.kafka.consumer.group-id` specifies the consumer group ID for your application.

## Step : Create a Java Class

## Step : Creating a Kafka Producer

- To send messages to **Kafka**, we need to create a **Kafka producer**. First, create a new package called `com.example.kafka.producer` and then add the following `KafkaProducerConfig` class:

  ```java
    package app.data_ops.spring_boot_data_pipeline.kafka.producer;

    import org.apache.kafka.clients.producer.ProducerConfig;
    import org.apache.kafka.common.serialization.StringSerializer;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.kafka.core.DefaultKafkaProducerFactory;
    import org.springframework.kafka.core.KafkaTemplate;
    import org.springframework.kafka.core.ProducerFactory;

    import java.util.HashMap;
    import java.util.Map;

    @Configuration
    public class KafkaProducerConfig {}
  ```

- Packages include:
  1. `import org.apache.kafka.clients.producer.ProducerConfig;`:
     - This imports the `ProducerConfig` class from the `apache-kafka-clients` library. This class defines various configuration properties for **Kafka producers**, like bootstrap servers, retries, and acks.
  2. `import org.apache.kafka.common.serialization.StringSerializer;`:
     - This imports the `StringSerializer` class from the `apache-kafka-common` library. This is used to convert your data (presumably strings) into a format that Kafka understands (byte arrays) before sending them to the topic.
  3. `import org.springframework.context.annotation.Bean;`
     - This imports the `@Bean` annotation from **Spring**. It's used to define a method that returns a bean (an object managed by **Spring**).
  4. `import org.springframework.context.annotation.Configuration;`
     - This import marks the class as a **Spring** configuration class.
  5. `import org.springframework.kafka.core.DefaultKafkaProducerFactory;`:
     - This imports the `DefaultKafkaProducerFactory` class from Spring Kafka. It's used to create a factory for Kafka producers, providing configuration and serialization details.
  6. `import org.springframework.kafka.core.KafkaTemplate;`:
     - This imports the `KafkaTemplate` class from **Spring Kafka**. This class provides a convenient way to send messages to **Kafka topics**.
  7. `import org.springframework.kafka.core.ProducerFactory;`:
     - This package provides an interface for creating **Kafka producers**.
     - `ProducerFactory` is used by `KafkaTemplate` to create new Kafka producer instances. It abstracts the creation and configuration of Kafka producers.
  8. `import java.util.HashMap;`:
     - This package provides the `HashMap` class, part of the Java Collections Framework.
     - `HashMap` is used to store key-value pairs and is often used for configuration settings, such as Kafka producer properties.
  9. `import java.util.Map;`:
     - This package provides the `Map` interface, part of the Java Collections Framework.
     - `Map` is a collection that maps keys to values. It is used in this context to hold Kafka producer configuration settings.

## Step : Creating a Kafka Consumer

- We can consume messages in two ways:
  1. using containers of message listeners,
  2. or by providing a class with `@KafkaListener` annotation.
- Let's create a **Kafka consumer** to receive messages from the **Kafka topic**. Create a new package called `com.example.kafka.consumer` and add the following `KafkaConsumerConfig` class:

  ```java
    package app.data_ops.spring_boot_data_pipeline.kafka.consumer;

    import org.apache.kafka.clients.consumer.ConsumerConfig;
    import org.apache.kafka.common.serialization.StringDeserializer;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
    import org.springframework.kafka.core.ConsumerFactory;
    import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

    import java.util.HashMap;
    import java.util.Map;

    @Configuration
    public class KafkaConsumerConfig {}
  ```

## Step: Run Application

- Run your **Spring Boot application** and use a tool like **Postman** or **curl** to send a `POST` request to http://localhost:8080/send?message=Hello_Kafka. The message will be sent to the **Kafka topic**, and the **consumer** will receive and print the message to the console.

# Json Schema

- The first thing we need to do is to create a schema describing a , e.g., `movie`. Create a file called `src/main/resources/json-schema.json` with the schema for our record (Kafka message):
  ```json
  {
    "$id": "https://example.com/person.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Movie",
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "The movie's title."
      },
      "yeay": {
        "type": "integer",
        "description": "The movie's year."
      }
    }
  }
  ```
- Note that auto-generating the Java class from the JSON Schema definition is not possible. Therefore, you must define the **Java class** as follows so it can be used by the serialization process:

  ```java
    package org.acme.kafka;

    public class Movie {

        private String title;
        private Integer year;

        public Movie() {
        }

        public Movie(String title, Integer year) {
            this.title = title;
            this.year = year;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Integer getYear() {
            return year;
        }

        public void setYear(Integer year) {
            this.year = year;
        }
    }
  ```

# Step : Clean the Project with Gradle

- clean the project to remove any previous build outputs, ensuring that we’re starting from a clean state.
  ```sh
    ./gradlew clean
  ```

# Step : Build the Project with Gradle

```sh
  ./gradlew build
```

# Step : Containerizing the Kafka Producer with Docker

- To deploy the application in a containerized environment, we need a `Dockerfile`. This file contains instructions for Docker on how to build the image.

  ```Dockerfile
    # Use an official OpenJDK runtime as a parent image
    FROM openjdk:21-jdk-slim

    # Set the working directory in the container
    WORKDIR /app

    # Copy the project’s jar file into the container at /app
    COPY build/libs/spring-boot-data-pipeline-0.0.1-SNAPSHOT.jar /app/spring-boot-data-pipeline.jar

    # Make port 8080 available to the world outside this container
    EXPOSE 9093

    # Run the jar file
    ENTRYPOINT ["java", "-jar", "spring-boot-data-pipeline.jar"]
  ```

- Where:
  1. `FROM openjdk:21`: This line specifies the base image.
  2. `COPY build/libs/producer-0.0.1-SNAPSHOT.jar app.jar`: This line copies the application's jar file from the build directory (`build/libs/producer-0.0.1-SNAPSHOT.jar`) into the image as `app.jar`.
  3. `EXPOSE 9093`: Tells Docker to expose port `9093`.
  4. `ENTRYPOINT ["java","-jar","/app.jar"]`: is the command that will be executed when the Docker container starts. It runs the application.

# Step : Build Docker Images Using Docker Compose

- After building the JAR file, the next step is to build the Docker images using Docker Compose. This step uses the `Dockerfile` to build an image for the **Spring Boot application** and pulls the images for **Kafka** and **Zookeeper** as specified in the `docker-compose.yml` file.

# Step : Sending an Event to the Kafka Broker Using `cURL`

- To interact with our **Kafka producer** application and send an event, we can use a `cURL` command (a powerful command-line tool used to transfer data with various protocols).
- We use `cURL` to make a `POST` request to our **Spring Boot** application, which will then send the event to the **Kafka broker**.
  ```sh
    curl -X POST http://localhost:8080/events -H "Content-Type: application/json" -d '{"title": "Test title","description": "test description","startTime": "2023-12-15 10:00:00","endTime": "2023-12-15 11:00:00","location": "Sala de conferencias'
  ```
- Remarks:
  - To monitor the application logs in real-time, you can utilize the command
    ```sh
      docker-compose logs -f
    ```

# Resources and Further Reading

1. [https://medium.com/@abhishekranjandev/a-comprehensive-guide-to-integrating-kafka-in-a-spring-boot-application-a4b912aee62e](https://medium.com/@abhishekranjandev/a-comprehensive-guide-to-integrating-kafka-in-a-spring-boot-application-a4b912aee62e)
