# Hosting PostgreSQL Database

## Table Of Contents

# Connect to a Remote PostgreSQL Database

- Before trying to access a remote PostgreSQL database, confirm that:
  1. You've installed PostgreSQL on your machine, and it's properly running (same as the server).
  2. You've installed **pgAdmin**, **psql**, or any third-party tool that supports the connection
  3. You have all the required access credentials, such as the:
     - **database name**,
     - **hostname**,
     - **port**,
     - **username**, and
     - **password**.

## 1. Using psql

- This method leverages the following command syntax:
  ```sh
    psql -h <hostname> -p <port> -U <username> -d <database>
  ```
- When you press "Enter," you'll receive a prompt to enter your password for authentication.

## 2. Using pgAdmin

- Launch **pgAdmin** from your computer and click the "Add New Server" option.
- Fill in the required information on the "Connection" tab at the top of the server screen.
- Click "Save."

## 3. Using 3rd-Party Clients (e.g., DBeaver)

- Launch the **DBeaver** application, select "Database," and then choose "New Database Connection."
- Choose "PostgreSQL," and then enter the connection credentials.
- Click "Test Connection" to verify the connection, then "Finish," and the application will connect you to the database.

## 4. Connecting With Different Programming Languages

- Python

  - Establish a connection by:
    ```py
        import psycopg2
        conn = psycopg2.connect(
                host="remote_host",
                database="db_name",
                user="username",
                password="password"
        )
    ```

- Node.js

  - Establish a connection by:
    ````js
        const { Client } = require('pg');
        const client = new Client({
        host: 'remote_host',
        database: 'db_name',
        user: 'username',
        password: 'password',
        });
        client.connect();
            ```
    ````

- Java
  - To connect to PostgreSQL, you need the **PostgreSQL JDBC driver**. Therefore, include it as a dependency in your project.
  - Using **Gradle**, add this to your `build.gradle` file:
    ```gradle
        implementation 'org.postgresql:postgresql:42.6.0' // Use the latest version
    ```
  - Establish connection by:
    ```java
     Connection connection = DriverManager.getConnection(
        "jdbc:postgresql://remote_host:5432/db_name", "username", "password");
    ```

# Resources and Further Reading
