# Apache Airflow

## Table Of Contents

# What is Apache Airflow

- **Airflow** is not a **data processing tool** itself. It’s an **orchestration software**. We can imagine **Airflow** as some kind of spider in a web. Sitting in the middle, pulling all the strings and coordinating the workload of our data pipelines.
- A **data pipeline** typically consists of several tasks or actions that need to be executed in a specific order. **Apache Airflow** models such a pipeline as a **DAG** (directed acyclic graph). A **graph** with directed edges or tasks without any loops or cycles. This approach allows us to run independent **tasks** in parallel, saving time and money. Moreover, we can split a **data pipeline** into several smaller **tasks**. If a job fails, we can only rerun the failed and the downstream tasks, instead of executing the complete workflow all over again.
- Airflow is composed of three main components:
  1. Airflow **Scheduler** – the "heart" of Airflow, that parses the **DAGs**, checks the scheduled intervals, and passes the tasks over to the workers.
  2. Airflow **Worker** – picks up the tasks and actually performs the work.
  3. Airflow **Webserver** – provides the main user interface to visualize and monitor the DAGs and their results.

# Apache Airflow Components

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

## 2. Operators

- In a **DAG** the tasks are executed through **Operators**, in **Airflow** multiple **Operators** together form a workflow and we can also define the execution order of various Operators.
- There are various in-built **Operators** in **Airflow** for performing specific tasks like:

  1. `PythonOperator` which can be used to run a Python function
  2. `SimpleHTTPOperator` can be used to invoke a REST API and handle responses
  3. `EmailOperator` used to send an email
  4. `MySQLOperator` for MySQL
  5. `SqlliteOperator` to interact with SQLite
  6. `PostgresOperator`
  7. `OracleOperator`.

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

# Resources and Further Reading
