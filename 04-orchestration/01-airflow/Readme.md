# Apache Airflow

## Table Of Contents

# What is Apache Airflow

- **Airflow** is not a **data processing tool** itself. It’s an **orchestration software**. We can imagine **Airflow** as some kind of spider in a web. Sitting in the middle, pulling all the strings and coordinating the workload of our data pipelines.
- A **data pipeline** typically consists of several tasks or actions that need to be executed in a specific order. **Apache Airflow** models such a pipeline as a **DAG** (directed acyclic graph). A **graph** with directed edges or tasks without any loops or cycles. This approach allows us to run independent **tasks** in parallel, saving time and money. Moreover, we can split a **data pipeline** into several smaller **tasks**. If a job fails, we can only rerun the failed and the downstream tasks, instead of executing the complete workflow all over again.

- **Advantages**:

  1. It is flexible, allowing users to define workflows as code.
  2. Workflows are defined in Python.
  3. It allows scaling horizontally on multiple machines.
  4. It provides a web-based UI that makes it easy to visualize pipelines running in production, monitor progress, and troubleshoot issues
  5. It benefits from a strong community that contributes a wealth of plugins and integrations.

- **Use Cases of Apache Airflow**:

  1. Batch data processing (ETL workflows).
  2. Scheduling machine learning model training.
  3. Running scripts or jobs on a regular basis.
  4. Coordinating tasks across multiple systems.

- **Airflow Architecture**

  - **Apache Airflow** features a modular architecture that is built around the concept of a **scheduler**, **executor**, and **workers** that execute tasks defined in **DAGs**.
  - **Web Server**: Provides the web-based UI built using **Flask**. It allows users to monitor and manage their **workflows**, **view logs**, and track the progress and history of **DAGs**.
  - **Scheduler**: The heart of **Airflow**, responsible for **scheduling tasks**. It continuously polls the state of tasks and **DAGs**, and triggers task instances whose dependencies have been met. The **scheduler** is designed to ensure that the right tasks run at the right time or in response to an external trigger.
  - **Metadata Database**: **Airflow** uses a backend database to store **state** and **metadata** about the **workflows**. Common databases used include PostgreSQL and MySQL. This database records credentials, connections, history, and job states.
  - **Executor**: Responsible for running the tasks that the scheduler pushes to it. There are different types of executors in Airflow:

    1. **LocalExecutor**: Executes tasks with parallelism on the same machine.
    2. **CeleryExecutor**: Uses Celery, a distributed task queue, to distribute tasks across multiple workers.
    3. **KubernetesExecutor**: Runs each task in a separate pod in a Kubernetes cluster, providing dynamic scaling and isolation.
    4. **SequentialExecutor**: A simpler executor that runs one task at a time. Useful for development and testing.

  - **Workers**: These are the processes that actually execute the logic of tasks once they are scheduled. Their nature depends on the type of executor used.

# Apache Airflow Concepts (Features)

## 1. Directed Acyclic Graph (DAG)

- In the **DAG** each node represents tasks, and it should not have any loop in it. The **DAG** for real-world scenarios would be, to "Download File", "Transform it using Pandas", "Make a DB insert" and "Emailing that process is completed".
- **Writing a DAG**

  - The airflow data pipeline is a Python script that contains the DAG object. The first step is to import modules required for developing the DAG and Operators.
    ```py
      from airflow import DAG
      with DAG() as dag:
    ```
  - **DAG parameters**:

    1. `dagid`: every **dag** inside the airflow will be identified by a unique id.
    2. `start_date`: represents the **DAG** start date. 3.
    3. `schedule_interval`: using `schedule_interval` the jobs can be run at specified intervals.

  - **DAG scheduling**
    - The **DAG** can run at regular intervals we need to configure the interval through the `schedule_interval` argument.
    - By default, the value of `schedule_interval` is `None` which means the **DAG** will not be scheduled and can only be run through **Airflow UI**.
    - In **Airflow** there are various convenient cron presets that can be used for **DAG scheduling**, they are:
      1. `@once` - will execute only once
      2. `@hour` - run once an hour
      3. `@daily` - once at midnight
      4. `@weekly` - once a week at midnight
      5. `@monthly` - once a month at midnight
      6. `@yearly` - run once a year midnight of January 1.
  - The **DAG** can also be scheduled using cron-based intervals

- **DAG Best Practices**

  1. **DAG as configuration file**

     - Keep the **DAGs** light, more like a configuration file. As a step forward it will be a good choice to have a YAML/JSON-based definition of workflow and then generate the **DAG**, based on that. This has a double advantage.
       1. DAGs, since are getting generated programmatically will be consistent and reproducible anytime.
       2. Non-python users will also be able to use it.
     - We can separate non-configuration-related code blocks outside the DAG definition and use the template_searchpath attribute to add those. For example, if you are trying to connect to an RDS and execute some SQL command, that SQL command should be loaded from a file. And the location of the file should be mentioned in the template_searchpath. Similarly with Hive queries(.hql).

  2. **Invest in Airflow plugin system**

     - Custom **Hooks** and **Operators** are great ways in making your pipelines easier to maintain, easier to debug, and easier to create.
     - So it is good to have a proper plugin repo and maintain it to author custom plugins needed as per the organization’s requirement. While creating a plugin, be generic so that it is reusable across use cases. This helps in versioning as well as it helps in keeping workflows clean and mostly configuration details as opposed to implementation logic. Also, don’t perform heavy work/operation while initializing the class, push operations (like getting variable & connections) inside the execution method.

  3. **Do not perform data processing in DAG files**

     - Since **DAGs** are python-based, we will definitely be tempted to use **pandas** or similar stuff in **DAG**, but we should not. **Airflow** is an **orchestrator**, not an **execution framework**. All computation should be delegated to a specific target system. Follow the fire and track approach. Use the **operator** to start the **task** and the **sensor** to track the completion. **Airflow** is not designed for long-running tasks.

  4. **Delegate API or DB calls to operators**

     - This is somewhat similar to the first point. API call or DB connection made at top-level code in DAG files overloads the scheduler & webserver. These call defined outside of the operator is called on every heartbeat. So it is advisable to have these pushed down to a util/common (can be a python operator) operator.

  5. **Use single variable per DAG**

     - Every time we access DAG variables it creates a connection to metadata DB. It may overload the Db if we are having multiple DAGs running with multiple variables being called. It's better to use a single variable per DAG with a JSON object. This will create a single connection. We can parse the JSON to get the desired key-value pair.
       ```py
        # Combining SSM keys in one
        dag_specific_variable = '{
          "variable_1" : "value_1",
          "variable_2" : "value_2",
          "variable_3" : "value_3"
        }'
        # Single call to get all three varaibles
        dag_specific_params =  Variable.get("dag_specific_variable", deserialize_json=True)
        # Using these in DAG
        {{ var.json.dag_specific_params.variable_1 }}
       ```

  6. **Tag the DAG**: Having Tags in **DAG** helps in filtering and grouping DAGs. Make it consistent with your infrastructure’s current tagging system. Like tag based on BU, Project, App Category, etc.
  7. **Don’t Abuse XCom**: **XCom** acts as a channel between tasks for sharing data. It uses backend DB to do so. Hence we should not pass a huge amount of data using this, as with a bigger amount of data the backend DB will get overloaded.
  8. **Use intermediate storage between tasks**

     - If the data, to be shared between two **tasks**, is huge store it in an intermediate storage system. And pass the reference of it to the downstream task. We can even leverage an `xcom_custom_backend`. Remember Airflow is not a data storage solution.
     - Note: When using `KubernetesPodOperator` use `@task.kubernetes` since it encapsulates the xcom logic, else we need to use script in the docker file to get the templated task xcom (e`nv_vars = { "INPUT_DATA" : '''{{ti.xcom_pull(task_ids="extract_data",key="return_value")}}'''}`) and write results in JSON for the sidecar container to read and populate db.

  9. **Limit the use of PythonOperator**

     - Limit the use of `PythonOperator`, prefer built-in operators. If **Operator** is not available then use `KubernetesPodOperator`. This will ensure that your operations are performed in a consistent and isolated environment, which can improve the performance and scalability of your pipeline.

  10. **Use the power of Jinja templating**
      - Many of the operators support template_fields. This tuple object defines which fields will get jinjaified.
        ```py
          class PythonOperator(BaseOperator):
            template_fields = ('templates_dict', 'op_args', 'op_kwargs')
        ```
      - While writing your custom operator overrides this template_fields attribute.
        ```py
          class CustomBashOperator(BaseOperator):
            template_fields = ('file_name', 'command', 'dest_host')
        ```
      - The above example is the fields ‘file_name’, ‘command’, ‘dest_host’ will be available for jinja templating.
      - You can access variables as well with the template.
        ```py
          {{ var.value.key_name }}
        ```
      - Params can also be templatized like below:
        ```py
          # Define param
          params={
            "param_key_1": "param_value_1",
            "param_key_2": "param_value_2"
          }
          # access param using template
          {{ params.param_key_1 }}
        ```
  11. **Implement DAG Level Access control**: Leverage Flask App Builder views to have DAG level access control. Set the DAG owner to correct Linux user. Create a custom role to decide who can take DAG/Task actions.
  12. **Use static start_date**: Static DAG start date helps in, correctly populating DAG runs and schedule.
  13. **Rename DAGs in case of structural change**: Till the time the DAG versioning feature is implemented, in case of any structural change in DAG rename the DAG on changes. This will create a new DAG and all DAG history of the previous run for the old DAG version will be there without any inconsistency.
  14. **Use AsyncOperators in newer versions**: **Operators** consume worker slots during the run of the triggered task. If the task is long-running then airflow will run out of slots although airflow itself is not doing much work. To avoid this scenario we should use the Async Operators. These operators do not consume worker slots for long.

## 2. Operators

- **Operators** are the building blocks of a **DAG**; they represent a single, ideally idempotent, unit of work. Each **operator** in **Airflow** is designed to do one specific thing, and they can be extended to handle virtually any type of job, whether it involves running a **Python function**, **executing a SQL query**, **managing a Docker container**, **sending an email**, or more.

- **Categories of Operators**:

  1. **Action Operators**

     - Perform a specific action, like:
       - `PythonOperator` for executing Python code
       - `BashOperator` for running **Bash scripts**
       - `EmailOperator` for sending emails.

  2. **Transfer Operators**

     - Move data from one system to another, such as:
       1. `S3ToRedshiftOperator`, which copies data from **Amazon S3** to a **Redshift database**.

  3. **Sensor Operators**
     - Wait for a certain condition or event before proceeding, like:
       1. `HttpSensor` that waits for a specific **HTTP** endpoint to return a certain result before moving forward.

- There are various in-built **Operators** in **Airflow** for performing specific tasks like:

  1. `SimpleHTTPOperator` can be used to invoke a REST API and handle responses
  2. `MySQLOperator` for MySQL
  3. `SqlliteOperator` to interact with SQLite
  4. `PostgresOperator`
  5. `OracleOperator`.

- **Types of Operators**: **Operators** in **Airflow** fall under three categories:

  1. **Action Operator**

     - The **Action Operators** are the **Operators** which are used to perform some action, like trigger HTTP request using `SimpleHTTPOperator` or execute a Python function using `PythonOperator` or trigger an email using the `EmailOperator`. The naming convention in `Airflow` is very clean, simply by looking at the name of **Operator** we can identify under what category the **Operator** is. The action operators reside under the module `airflow.operators`
     - An example of **Action Operator** is `SimpleHTTPOperator`, let’s invoke a REST service and handle the response

       ```py
        with DAG('getitems', start_date=datetime(2022, 1, 1), schedule_interval="*/5 * * * *") as dag:
          task = SimpleHttpOperator(
              task_id='items',
              method='GET',
              http_conn_id='get_items',
              endpoint='/items',
              headers={"Content-Type": "application/json"},
              response_check= lambda response: True if 200 in response.status_code else  False, dag=dag)

        task
       ```

  2. **Transfer Operator**

     - The main function of **Transfer Operator** is used to transfer from Source to Destination, like for transferring S3 to Redshift `S3ToRedshiftOperator` can be used, for transferring data from S3 to Google Cloud Storage `S3ToGCSOperator` can be used, similarly from transferring data from Oracle to GCS `OracleToGCSOperator` should be used. For transferring data from the Local file system to GCS `LocalFilesystemToGCSOperator` can be utilized.
       ```py
        with DAG(‘s3redshift’, start_date=datetime(2022, 1, 1), schedule_interval=" 0 15 * 12 *") as dag:
          task = S3ToRedshiftOperator(
                  s3_bucket=S3_BUCKET_CONFIG,
                  s3_key=S3_KEY_CONFIG,
                  schema="PUBLIC",
                  table=Test,
                  copy_options=['csv'],
                  task_id='s3ToRedshitTask',
              )
          task
       ```

  3. **Sensor**

     - The **sensor** is designed to wait for a successful response to receive or wait until retries time out, it’s like a blocking call we cannot move to the next task until the sensor execution is completed.
     - **Examples**:

       1. `SqlSensor` executes SQL Statement repeatedly say every 30 seconds until the condition is satisfied.
       2. `HttpSensor` waits until the response from the Rest API is received.

          ```py
            with DAG('getitems', start_date=datetime(2022, 1, 1), schedule_interval="*/5 * * * *") as dag:
              task = HttpSensor(
                  task_id='items',
                  method='GET',
                  http_conn_id='get_items',
                  endpoint='/items',
                  poke_interval = 10,
                  response_check= lambda response: True if 200 in response.status_code else  False, dag=dag)
          task
          ```

- The **nodes** in the **DAGs** are **tasks** like Download, Aggregate, Upload, etc. These **tasks** are executed as **Operators**.
- In **Airflow** there are various ready to use **Operators** which can be leverage

- **Example Operators**:

  1. **Postgres Operator**

     - In **Airflow-2.0**, the Apache **Airflow Postgres Operator** class can be found at `airflow.providers.postgres.operators.postgres`. Internally, **Airflow Postgres Operator** passes on the cumbersome tasks to `PostgresHook`.
     - To leverage the **Airflow Postgres Operator**, you need two parameters: `postgres_conn_id` and `sql`. These two parameters are finally sent to the `PostgresHook` object that directly makes contact with the PostgreSQL database.
     - How to Use the **Airflow Postgres Operator** for Database Operations?

       1. Creating a Postgres Database Table
       2. Inserting Data into said Postgres Database Table
       3. Querying/Fetching Data from Postgres Database Tables

     - **How to Create a Postgres Database Table?**

       - **Step 1**: Execute the following code snippet:

         ```py
          import datetime

          from airflow import DAG
          from airflow.providers.postgres.operators.postgres import PostgresOperator

          # create_user_table, populate_user_table, get_all_user, and get_birth_date are examples of tasks created by
          # instantiating the Postgres Operator

          with DAG(
              dag_id="postgres_operator_dag",
              start_date=datetime.datetime(2020, 2, 2),
              schedule_interval="@once",
              catchup=False,
          ) as dag:
              create_pet_table = PostgresOperator(
                  task_id="create_user_table",
                  sql="""
                      CREATE TABLE IF NOT EXISTS users (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR NOT NULL,
                      type VARCHAR NOT NULL,
                      birth_date DATE NOT NULL,
                      OWNER VARCHAR NOT NULL);
                    """,
              )
         ```

       - **Step 2**: Unloading SQL statements within your **Airflow Postgres Operator** isn’t the most effective solution and might cause maintainability pains in the future. **Airflow** comes to the rescue with an elegant solution. All you need to do is create a directory within the **DAG** folder known as `sql` and then place all the SQL files that contain your SQL queries inside it. This is what your `dags/sql/test_schema.sql` might look like:
         ```sql
          -- create user table
          CREATE TABLE IF NOT EXISTS user (
              id SERIAL PRIMARY KEY,
              name VARCHAR NOT NULL,
              type VARCHAR NOT NULL,
              birth_date DATE NOT NULL,
              OWNER VARCHAR NOT NULL);
         ```
       - **Step 3**: Finally, you need to refactor `create_user_table` within your **DAG** as follows:
         ```py
          create_user_table = PostgresOperator(
            task_id="create_user_table",
            postgres_conn_id="postgres_default",
            sql="sql/test_schema.sql",
         )
         ```

     - **How to Insert Data into Postgres Tables?**
     - **How to Fetch/Query Data from Postgres Tables?**
       - Querying or Fetching data from your Postgres Tables while leveraging **Airflow Postgres Operators** can be as done using the following code snippet:
         ```py
          get_all_users = PostgresOperator(
            task_id="get_all_pets",
            postgres_conn_id="postgres_default",
            sql="SELECT * FROM pet;",
         )
         ```

  2. **MySQLOperator**
  3. **SlackOperator**

## 3. Executor

- An **executor** in **Apache Airflow** is a component that is responsible for running **tasks**.
- Two types of **executors**:

  1. **Local executors**

     - This is the simplest type of executor, but it is not scalable. The `LocalExecutor` runs **tasks** directly on the machine where the **scheduler** is deployed. It allows multiple **tasks** to be run in parallel by spawning dedicated processes for each task. It is the prime example of a local executor.

  2. **Remote Executors**
     - **Remote executors** run tasks on remote machines. This allows for scalability and fault tolerance.
     - [Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html), [Dask](https://www.dask.org/), and [Kubernetes](https://kubernetes.io/) are all tools that can be used for distributed computing and are capable of running tasks in parallel on multiple machines.
       - **Celery** is a task queue that allows tasks to be distributed across multiple workers. It is often used to run asynchronous applications, such as web applications that send emails or process payments.
       - **Dask** is a parallel computing library that can be used to speed up data analysis and machine learning tasks. It works by breaking your data into smaller chunks that can be processed in parallel on multiple machines.
       - **Kubernetes** is a container orchestration system that can be used to manage and deploy applications across a cluster of machines.
     - **Airflow** can take advantage of all of those tools thanks to **remote executors** such as the `CeleryExecutor`, the `DaskExecutor`, and the `KubernetesExecutor`.
       1. The `KubernetesExecutor`
          - Pros:
            - Using `KubernetesExecutor`, **Airflow** runs each **task** in its own dedicated **pod**. This leads to the first major advantage over other execution modes — resource usage is strictly on demand.
            - Another big advantage of the `KubernetesExecutor` is the ability to dynamically scale resources. You can configure how many CPUs and how much memory **Airflow** has to request from **Kubernetes** to execute each **task** in contrast to the `LocalExecutor`, which must always allocate enough resources for the most demanding task.
            - Another benefit of `KubernetesExecutor` is that tasks are separated from each other. As `KubernetesExecutor` runs tasks in separate **pods**, it allows the use of different Docker images for each task. This makes it simple to use various Python versions, alternative interpreters, for example, PyPy or Jython, other things like PySpark or even tasks not related to Python.
          - Cons:
            - The disadvantages of the `KubernetesExecutor` are related to the complexity of the configuration. You need to have a working Kubernetes cluster, configure manifests of core Airflow components and task pods, set up remote logging, and enable synchronization with a `git`-based repository using `git-sync`.

## 3. Tasks

- **Tasks** are instances of **operators**; they represent the application of an operator’s logic to a specific set of input parameters or configurations. When you define a task in a **DAG**, you’re specifying what **operator** to use and configuring it to perform its function in a particular way, tailored to your workflow.

## 4. Connections

- **Connections** are **Airflow’s** way of storing and managing credentials and configuration details for external systems in a centralized, reusable manner. Instead of hardcoding things like **database hostnames**, **usernames**, or **passwords** in your **DAGs**, you define them once as a **Connection** and reference them by a unique identifier (`conn_id`). This keeps your code clean, secure, and easy to update.

- A **Connection** is a record with these key fields:

  1. **Conn ID**: Unique name (e.g., `postgres_default`).
  2. **Conn Type**: Type of system (e.g., `Postgres`, `HTTP`, `AWS`).
  3. **Host**: Server address (e.g., `postgres-db`).
  4. **Schema**: Database name (e.g., `apache_airflow`, `users`).
  5. **Login**: Username (e.g., `postgres`).
  6. **Password**: Password
  7. **Port**: Port number (e.g., `5432`).
  8. **Extra**: Optional JSON for additional settings (e.g., `{"sslmode": "require"}`).

- **Example Connections**:

  1. **MySQL Connection**
     - Install MySQL Connector
       ```sh
        pip install apache-airflow-providers-mysql
       ```
     - Configure MySQL Connection in Airflow
       - Open the Airflow UI (`http://localhost:8080`)
       - Go to **Admin** → **Connections**
       - Click + **Add Connection**
       - Enter the following details:
         - **Connection Id**: `mysql_default` (or any unique name)
         - **Connection Type**: `MySQL`
         - **Host**: `your-mysql-host` (e.g., localhost, mysql-server in Docker or an IP address)
         - **Schema**: `your_database_name`
         - **Login**: `your_username`
         - **Password**: `your_password`
         - **Port**: `3306` (default MySQL port)
         - **Extra**: Add path for your SSL Certificate(if required)
       - Click **Save**
       - Method 2: Using Airflow CLI
         ```sh
          airflow connections add 'mysql_default' \
            --conn-type 'mysql' \
            --conn-host 'your-mysql-host' \
            --conn-schema 'your_database_name' \
            --conn-login 'your_username' \
            --conn-password 'your_password' \
            --conn-port '3306'
         ```
       - Test the MySQL Connection
         ```sh
          airflow connections get mysql_default
         ```

- **Managing Connections**

  1. **Via UI**

     - Go to `http://localhost:8086` > **Admin** > **Connections**.
     - Click `+` to add or edit existing ones.

  2. **Via CLI**

     - Add a Connection:
       ```sh
        docker exec -it apache-airflow-webserver airflow connections add \
          --conn-id postgres_users_db \
          --conn-type postgres \
          --conn-host postgres-db \
          --conn-schema <database_name> \
          --conn-login <user> \
          --conn-password <password> \
          --conn-port 5432
       ```
     - List Connections:
       ```sh
         docker exec -it apache-airflow-webserver airflow connections list
       ```

  3. **Via Environment Variables**
     - Define a **Connection** as a JSON string in `.env`
     ```env
       AIRFLOW_CONN_POSTGRES_USERS_DB=postgresql://postgres:<password>@postgres-db:5432/<database_name>
     ```
     - **Airflow** loads it on startup. Useful for automation but less flexible than UI/CLI.

- **How Airflow Uses Connections**

  1. **Metadata Storage**: **Connections** are encrypted (using the `FERNET_KEY`) and stored in the `connection` table in `apache_airflow` db. Check it by:
     ```sh
      docker exec -it postgres-db psql -U postgres -d apache_airflow -c "SELECT * FROM connection;"
     ```
  2. **Hooks**: `PostgresHook` fetches the **Connection** by `conn_id`, decrypts it, and builds the connection string.
  3. **Operators**: Some operators (e.g., `PostgresOperator`) also use Connections directly.

- **Best Practices**

  1. **Naming**: Use descriptive `conn_ids` (e.g., `postgres_users_db` > `my_db`).
  2. **Separation**: Keep metadata (`postgres_default`) separate from app data (`postgres_users_db`).
  3. **Secrets**: For production, use Airflow’s Secrets Backend (e.g., **HashiCorp Vault**) instead of storing passwords in **Connections**.
  4. **Testing**: Always test Connections in the UI to catch typos early.

## 5. Variables

- **Airflow Variables** are key-value pairs stored in the Airflow metadata database. They allow you to:

  1. Dynamically configure DAGs without hardcoding values.
  2. Centralize reusable configurations for multiple workflows.
  3. Safely store secrets and credentials.

- **Creating and Managing Variables**

  1. **Using the Airflow UI**

     - Go to **Admin** → **Variables** in the Airflow UI.
     - Click + **Add A New Record**
     - Provide:
       - **Key**: The variable name (e.g., `db_connection_string`)
       - **Value**: The variable value (e.g., `mysql://user:pass@localhost/db`).
       - Save the variable.
     - Now You can See the New Variable created under the List Variable Section.

  2. **Using the Airflow CLI**

     - You can manage variables directly via the command line:
     - Ser variable by:
       ```sh
        airflow variables set <key> <value>
       ```
     - Get a variable:
       ```sh
         airflow variables get <key>
       ```
     - List all variables
       ```sh
         airflow variables list
       ```

  3. **Using Code in Python**
     - Airflow provides a built-in `Variable` class for managing variables programmatically.
     - Set a **Variable**:
       ```py
        from airflow.models import Variable
        Variable.set("key_name", "value")
       ```
     - Get a **variable**
       ```py
         my_var = Variable.get("key_name")
         print(my_var)
       ```

- Best Practices for Managing Variables
  1. Use Secrets for Sensitive Data: Avoid storing sensitive data (e.g., passwords, API keys) directly in variables. Use a secrets backend like AWS Secrets Manager, HashiCorp Vault, or Azure Key Vault.
  2. Organize Variables Logically: Use prefixes or naming conventions for variables, e.g., `prod_db_url`, `dev_api_key`, etc.
  3. Set Defaults: Always use `default_var` when fetching variables to handle missing values gracefully.
  4. Secure Variable Access: Limit access to variables by configuring user roles and permissions in the Airflow UI.

## Hooks

- **Hooks** are interfaces to external platforms and databases like Hive, S3, MySQL, Postgres, HDFS, and Pig. Hooks implement a common interface when possible, and act as a building block for operators.

## XComs

- **XComs** allows information sharing between **tasks**. We can use **XCom** to pass data or messages from one **task** to another by using `xcom_push()` and `xcom_pull()` functionalities.

## 6. Configurations

- The **Configurations** page in the Airflow UI (under **Admin** > **Configurations**) is meant to display the contents of `airflow.cfg` (**Airflow’s main configuration file**) and **environment variables** used by **Airflow**. It allows admins to view settings like database connections, scheduler options, or SMTP details
- `airflow.cfg` and environment variables may contain sensitive data, such as
  1. Database credentials.
  2. SMTP passwords
  3. API keys, tokens, or other secrets.
- Exposing these in the UI could allow anyone with admin access to view them, posing a security risk, especially in multi-user or public-facing setups.

## 7. Providers

- The **Providers** page in the Airflow UI (**Admin** > **Providers**) lists all installed **Airflow provider packages**, which are modular extensions that add functionality like **hooks**, **operators**, and **connections** for external systems (e.g., PostgreSQL, ClickHouse). Unlike the **Configurations** page, which is restricted by `expose_config`, the **Providers** page is always accessible to admin users because it doesn’t expose sensitive data—just metadata about installed packages. It shows the following:

  1. **Package Name**

     - The name of the provider package, e.g., `apache-airflow-providers-postgres`, `apache-airflow-providers-http`.
     - Each package corresponds to a specific integration (e.g., `postgres` for your `postgres_users_db`, `http` for ClickHouse’s HTTP interface).

  2. **Version**

     - The installed version of the provider, e.g., `5.8.0` for `apache-airflow-providers-postgres`.
     - Matches the version installed in the Docker container (via `pip` or Airflow’s constraints).

  3. **Description**
     - A brief summary of the provider’s purpose, e.g., “PostgreSQL provider for Apache Airflow” or “HTTP provider for Apache Airflow”.
     - Helps identify what each package enables.

- Examples

  1. `apache-airflow-providers-postgres`: Enables `PostgresHook` for connecting to Postgres server
     ```py
      from airflow.providers.postgres.hooks.postgres import PostgresHook
     ```
  2. `apache-airflow-providers-http`

     - Listed as `apache-airflow-providers-http`

  3. `apache-airflow-providers-common-sql`
     - Provides base SQL functionality for `PostgresHook`.
     - Listed as `apache-airflow-providers-common-sql`.

## 8. Pools

- The **Pools** page in the Airflow UI (**Admin** > **Pools**) allows you to view and manage resource pools, which are used to limit the number of tasks that can run concurrently for specific resources or DAGs. **Pools** help control parallelism, preventing overloading of systems like databases or external services.
- When you click **Admin** > **Pools**, you typically see a table with columns:
  1. **Pool**: The name of the pool (e.g., `default_pool`).
  2. **Slots**: The total number of slots (task instances) allowed to run concurrently.
  3. **Used Slots**: How many slots are currently in use (running tasks).
  4. **Queued Slots**: How many tasks are waiting for a slot.
  5. **Open Slots**: Available slots (`Slots - Used Slots - Queued Slots`).
  6. **Description** (optional): A note about the pool’s purpose.

## 9. TaskFlow API

- The **TaskFlow API** was introduced in **Airflow 2.0** and is a wonderful alternative to `PythonOperator`.
- Benefits of `TaskFlow API` over the traditional `PythonOperator`:

  1. Reduced boilerplate code
  2. **Automatic XCom handling**: Function return values are automatically stored in **XCom**.
  3. Intuitive data transfer between DAGs
  4. No unnecessary code for explicit dependency chain
  5. **Supports parameterized tasks**: You can pass arguments between tasks easily.

- **Example**:

  ```py
    from airflow.decorators import dag, task
    from airflow.utils.dates import days_ago
    from datetime import timedelta
    import pandas as pd

    # Define default arguments
    default_args = {
        "owner": "Md. Anower Hossain",                # The owner of the DAG
        "start_date": days_ago(1),                     # The start date for the DAG
        "retries": 1,                                  # Number of retries in case of failure
        "retry_delay": timedelta(minutes=5),           # Time delay between retries
        "catchup": False                               # Prevent running backlogged DAGs
    }

    @dag(schedule_interval="@daily", default_args=default_args, catchup=False)
    def etl_taskflow():

        @task
        def extract():
            """Simulating data extraction from an API"""
            data = {"name": ["Anower", "Hossain"], "age": [25, 30]}
            return data  # Automatically stored in XCom

        @task
        def transform(data: dict):
            """Transform data: Convert to DataFrame and add a new column"""
            df = pd.DataFrame(data)
            df["age_category"] = df["age"].apply(lambda x: "Adult" if x >= 26 else "Minor")
            return df.to_dict(orient="records")  # Return transformed data

        @task
        def load(transformed_data: list):
            """Simulating loading data into a database"""
            print(f"Loading data into DB: {transformed_data}")

        # Task dependencies
        raw_data = extract()
        transformed_data = transform(raw_data)
        load(transformed_data)

    etl_dag = etl_taskflow()
  ```

  - where:
    - `@dag` decorator: Defines the DAG function.
    - `@task` decorator: Converts functions into tasks.
    - **Task dependencies** are defined dynamically by calling functions (`extract() -> transform() -> load()`).
    - **XCom is handled automatically**, passing data between tasks.

# Running Apache Airflow

- Running **Apache Airflow**:

  1. Docker Container

  2. Google Cloud - **Cloud Composer**

     - Fully managed workflow orchestration service built on Apache Airflow that enables you to author, schedule, and monitor pipelines.

  3. Microsoft Azure

     - Microsoft Azure does not fully offer managed Airflow service yet unlike GCP's Composer or AWS MWAA
     - You can manually deploy **Airflow** on **Azure Kubernetes Service** (**AKS**), **Azure Container Instances**, or **Azure VMs**.

  4. **Amazon Web Services** (**AWS**)
     - AWS offers **Amazon Managed Workflows for Apache Airflow** (**MWAA**), a Fully managed **Airflow** service by **AWS**.
     - **MWAA** offers Seamless integration with:
       - Amazon S3 (DAGs, logs)
       - Amazon RDS (metadata DB)
       - CloudWatch (monitoring)
       - IAM roles (security)
     - Just upload your DAGs to S3 and define environment settings.

# Integrating Airflow with dbt

- **dbt** (**Data Build Tool**) is an open-source tool that allows you to build and manage data transformation pipelines in your data warehouse. **dbt** makes it easy to write modular, testable, and reusable SQL code that can be easily maintained and updated over time.

- Four Key Problems Posed By Data Transformations:

  1. Dependency management
  2. Dynamic code
  3. Materialization
  4. Testing - Data quality and code validation

- **Key Advantages of Using**

  1. **Modularity and Scalability**: **dbt** encourages breaking down SQL transformations into modular pieces. This modularity improves scalability, making it easier to maintain and expand transformations as data volumes grow.
  2. **Software Engineering Best Practices**: **dbt** brings version control, automated testing, and CI/CD pipelines to the transformation layer, allowing data teams to adopt software engineering practices. This approach leads to more reliable data workflows and facilitates collaboration.
  3. **Automated Documentation**: **dbt** generates documentation for every transformation model, making **data lineage** and model dependencies transparent. This is especially valuable for large data teams and complex projects, where understanding data flow is essential.
  4. **Data Quality Control**: With **dbt**, you can create data tests to validate assumptions about your data, improving data quality by catching potential issues early in the pipeline.

- **dbt Architecture**

  1. **dbt-core**: responsible for user interface such as CLI
  2. **dbt-adapters**: Abstraction layer in charge of connecting to the DWH
  3. specific **adapters** such as `dbt-bigquery`: concrete implementations that inherit from dbt-adapters

- **dbt Project Structure**

  - dbt_project/
    - dbt_project.yml # Project-level config (name, models path, etc.)
    - models/ # SQL models go here (transformation logic)
      - <domain>/ # Grouped by business area or data source
        - staging/ # Cleaned, renamed raw data
        - intermediate/ # Joins, enrichments
        - marts/ # Final output models for BI / analytics
      - schema.yml # Model metadata (docs, tests, descriptions)
    - macros/ # Custom Jinja logic
    - snapshots/ # For tracking slowly changing dimensions
    - seeds/ # Static CSV files to load into db
    - `tests/` # Custom data tests
    - profiles.yml # (Outside the project folder, defines db creds)

- `dbt_project.yml`

  - This is the project config file, like the `package.json` of **dbt**:

    ```yml
    name: ccs_dbt_project
    version: "1.0"
    config-version: 2

    profile: ccs_dbt_project # links to profiles.yml

    model-paths: ["models"]
    seed-paths: ["seeds"]
    snapshot-paths: ["snapshots"]
    macro-paths: ["macros"]
    test-paths: ["tests"]

    models:
      ccs_dbt_project:
        +materialized: view # default for all models
    ```

- `profiles.yml` File

  - Stored in `~/.dbt/profiles.yml` (or in your Airflow container under `/opt/airflow/dbt/profiles.yml`).
    ```yml
    ccs_dbt_project:
      target: dev
      outputs:
        dev:
          type: postgres
          host: ...
          user: ...
          dbname: ...
          schema: analytics
          threads: 4
    ```
  - Each output is an environment (`dev`, `prod`). You can switch with `dbt run --target prod`.

- `models/` Folder

  - Contains SQL models, typically organized into **staging**, **intermediate**, and **marts**.
  - Here’s a best-practice folder layout:
    - models/
      - sources/
        - api_source/
          - staging/
          - marts/
          - schema.yml
        - mysql_source/
          - staging/
          - marts/
          - schema.yml
      - schema.yml # optional fallback

- `schema.yml` File

  - These describe and test models.

    ```yml
    version: 2

    models:
      - name: stg_api_data
        description: "Staging cleaned API response data"
        columns:
          - name: id
            description: "Primary key"
            tests:
              - unique
              - not_null

      - name: mart_api_summary
        description: "Aggregated API metrics for reporting"
    ```

  - Each subfolder (e.g. `api_source/`) should ideally have its own `schema.yml`.

- `snapshots/`: Track historical changes in records (like SCD Type 2)
- `macros/` Folder: Reusable Jinja macros for your SQL transformations.
- `seeds/` Folder: CSV files that can be loaded into your data warehouse.
- `tests/` Folder: Custom data tests to ensure data quality
- `analyses/` Folder: Ad-hoc analyses that aren't part of your core models.

# Running Data Build Tool (dbt) in Airflow

- **Apache Airflow** does not ship with **dbt** or dbt dependencies out of the box. **Airflow** is a workflow orchestrator, while **dbt** is a transformation tool that needs to be installed separately.
- We can run **dbt** commands (e.g., `dbt run`, `dbt test`) within **Airflow tasks** using operators like `BashOperator` or `PythonOperator`, but you must ensure **dbt** is installed in the Airflow environment.
- Installing **dbt** in **Airflow Docker Container**

  - Update your `Dockerfile` to install `dbt-core` and the `dbt-postgres` adapter, which is needed for **PostgreSQL**.

- **Set Up a dbt Project**

  - **Step** : Install `dbt` Command Line Tool Locally

    - Use `pip` to install `dbt-core` and `dbt-postgres`
    - Check that `dbt` is installed and accessible by running:
      ```sh
        dbt --version
      ```

  - Step : Initialize dbt Project
  - Step : Configure dbt Profiles
    - **dbt** uses a `profiles.yml` file to store database connection details

## Configure dbt for PostgreSQL Integration

## Configuring dbt for BigQuery Integration

- Step 1: Install dbt-core with BigQuery adapter

  ```sh
    pip install dbt-core==1.7.18 dbt-bigquery==1.7.9
  ```

- Step 2: Initialize a new dbt project:

  - To initialize the dbt project, run the command below:
    ```sh
      dbt init dbt_bigquery_project
    ```

- Step 4: Configure profiles.yml for BigQuery using a service account JSON key file

# Resources and Further Reading

1. [Medium - Airflow DAG — Best Practices](https://medium.com/swlh/airflow-dag-best-practices-716ac95b82d1)
