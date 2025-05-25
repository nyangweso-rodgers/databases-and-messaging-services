# Setup Apache Airflow on Docker

## Table Of Contents

# Docker Setup For Airflow

## Requirements

1. **Metadata Database**

   - **Airflow** uses a **relational database** (referred to as the **metadata database**) to store information about:

     1. **DAGs** (**Directed Acyclic Graphs**): **Definitions**, **schedules**, and **configurations** of your workflows.
     2. **Task Instances**: Execution history, status (e.g., running, success, failed), and retry information for each task.
     3. **Variables and Connections**: Key-value pairs and connection credentials (e.g., to databases, APIs) used in your workflows.
     4. **Scheduler State**: Information about when tasks should run and their dependencies.
     5. **XComs** (cross-communication data between tasks)
     6. **User Data**: Details about **users** and **roles** (e.g., your admin user) if authentication is enabled.

   - **Database Options**

     1. **PostgreSQL** (most recommended for production)
        - Best performance and reliability for production workloads
        - Excellent for high-concurrency environments
        - Well-tested with Airflow

   - Database Update Frequency: The metadata database is continuously updated as Airflow operates:

     - Task states change (running, success, failed)
     - DAG runs are scheduled and executed
     - Variables are modified
     - Connection information changes

   - Heavy workloads can generate significant database traffic, especially with:

     - Many DAGs with frequent schedules
     - DAGs with many tasks
     - High concurrency settings

   - **Best Practices**:

     1. **Sizing and Resources**

        - Allocate sufficient CPU, memory, and disk space based on workload
        - Monitor database performance metrics
        - Implement connection pooling

     2. **Backup and Recovery**:

        - Regular automated backups (daily recommended)
        - Test restoration procedures
        - Consider point-in-time recovery for production

     3. **Scaling**

        - For large deployments, consider database replication
        - Implement proper indexing based on query patterns
        - Consider database sharding for extreme scale

     4. **Maintenance**

        - Schedule regular vacuum/analyze operations (PostgreSQL)
        - Monitor and clean up task logs
        - Purge old task history data periodically

     5. **Security**
        - Use strong authentication
        - Restrict network access
        - Encrypt sensitive data

2. **Dockerfile**

   - Custom Airflow image with additional dependencies and an initialization script.

3. **Init Script** (`init-airflow.sh`)
   - Handles **database creation**, **schema initialization**, and **admin** user setup.

## Steps

1. **Step 1**: Create `Dockerfile`

   - Create a Dockerfile with the following configuration:

     ```Dockerfile
     # Use the official Airflow image as a base
     FROM apache/airflow:2.8.1

     # Switch to airflow user (default in the image)
     USER airflow

     # Install additional Python dependencies (if needed)
     RUN pip install --no-cache-dir \
         pandas \
         sqlalchemy

     # Copy your DAGs or custom files (optional)
     COPY ./dags /opt/airflow/dags
     ```

   - **Remarks**:

     - **Base Image**: `apache/airflow:2.8.1` is the latest stable version as of now (March 29, 2025).
     - **Dependencies**: Add any Python packages your **DAGs** need (e.g., `pandas`, `sqlalchemy`).
       - `sqlalchemy` is a python library (an ORM and SQL toolkit) that **Airflow** uses to interact with its **metadata database**. It abstracts database operations, allowing **Airflow** to work with various database backends (**PostgreSQL**, **MySQL**, **SQLite**, etc.) without changing its core code.
     - **DAGs**: Optionally copy your **DAG** files into the container.

2. **Step 2**: Create a `docker-compose.yaml`

   - Create the `docker-compose.yaml` file with the following configurations:

     ```yml
     version: "3"

     services:
     ```

   - **Environment Variables**:

     1. `AIRFLOW__DATABASE__SQL_ALCHEMY_CONN`: defines the connection string for Apache Airflow’s **metadata database**. This database stores all the essential data **Airflow** needs to manage workflows, **track task execution**, and **maintain its state**. This database is accessed via **SQLAlchemy**, a Python ORM (Object-Relational Mapping) library that **Airflow** uses to interact with the database in a database-agnostic way. The connection string tells **Airflow** how to connect to this database. Example:
        ```sh
        AIRFLOW__DATABASE__SQL_ALCHEMY_CONN: postgresql+psycopg2://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres-db:5432/apache_airflow
        ```

   - **Remarks**:
   - `airflow` is the database name **Airflow** will use — create this in your Postgres instance if it doesn’t exist yet.
     - Connect to Postgres
     ```sh
         docker exec -it postgres-db psql -U ${POSTGRES_USER}
     ```
     - Create Database and User:
     ```sh
         CREATE DATABASE apache_airflow;
     ```

3. **Step 3**: **Start Docker Containers**

   - **Remarks**:

   - When you start **Airflow** containers, you will notice that `__pycache__/01-dummy-dag.cpython-38.pyc` file is automatically created because Python compiles your **DAG** file (e.g., `01-dummy-dag.py`) into bytecode for faster execution.

     - When Python imports a module (like your `DAG` file), it compiles the `.py` file into bytecode (`.pyc`) and caches it in `__pycache__/`.
     - This makes subsequent imports faster since Python doesn't need to re-parse the source code.
     - Add `__pycache__/ `to your `.gitignore`

   - **Airflow's Behavior**
     - **Airflow** scans and imports your DAG files every few seconds (default: 30s).
     - Each scan triggers Python's import system, generating the .pyc file.

4. **Step 4**: **Testing**

   - List **DAGS**:
     ```sh
       docker exec airflow-webserver airflow dags list
     ```

## Project Structure

- airflow-project/

  - .env # Environment variables (gitignored)
  - .env.example # Example env file (committed)
  - .gitignore # Git ignore file
  - docker-compose.yml # Main docker-compose file
  - Dockerfile # Main Airflow Dockerfile
  - Makefile # Helper commands for common operations
  - README.md # Documentation
  - requirements/ # Split requirements by purpose
    - base.txt # Core dependencies
    - dev.txt # Development dependencies
    - prod.txt # Production dependencies
  - config/ # Configuration files
    - airflow.cfg # Custom Airflow config
    - webserver_config.py # Webserver config for RBAC
    - constraints.txt # Python dependency constraints
  - scripts/ # Utility scripts
    - entrypoint.sh # Docker entrypoint
    - init.sh # Initialization script
    - healthcheck.sh # Container health checks
  - tests/ # Test suite
    - dags/ # DAG tests
    - plugins/ # Plugin tests
  - logs/ # Log directory (gitignored)
  - dags/ # DAG definition files
    - common/ # Shared DAG utilities
      - `__init__.py`
      - constants.py # Constants shared across DAGs
    - data_pipelines/ # Organized by business domain
    - etl_workflows/
    - monitoring/
  - include/ # Additional files needed by DAGs
    - sql/ # SQL scripts
    - configs/ # DAG-specific configs
  - plugins/ # Custom plugins
    - `__init__.py` # Plugin registration
    - hooks/ # Custom connection hooks
      - `__init__.py`
      - clickhouse_hook.py
      - postgres_hook.py
    - operators/ # Custom operators
      - `__init__.py`
    - sensors/ # Custom sensors
      - `__init__.py`
    - utils/ # Utility modules
      - `__init__.py`
      - constants.py # Default arguments, common constants
      - file_utils.py # SQL and YAML file loading
      - sync_utils.py # Sync-related utilities
  - dbt/ # DBT project files
    - models/
    - macros/
    - profiles/
  - data/ # Persistent volumes (gitignored)
    - postgres/ # Metadata DB persistence
    - secrets/ # Secrets storage

- Remarks:
  1. `plugins/` Directory
     - This is the root for custom Airflow plugins, which can include **hooks**, **operators**, **sensors**, and more.
  2. `hooks/` Directory
     - Stores custom hooks like `PostgresHook` and `ClickhouseHook`
     - **Hooks** are reusable classes that abstract connection logic for specific systems (e.g., PostgreSQL, ClickHouse).
  3. `operators/` Directory
     - Reserved for custom operators, which encapsulate task logic (e.g., a `PostgresSyncOperator` that uses `PostgresHook` to sync data).
     - Operators are useful when you want to abstract entire tasks, not just connections.
  4. `sensors/` Directory
     - For custom sensors, which wait for external conditions (e.g., a `PostgresTableSensor` to check if a table exists before proceeding).
  5. `utils/` Directory
     - Stores utility modules like `constants.py`, which defines shared constants (`CONNECTION_IDS`, `DEFAULT_ARGS`, `LOG_LEVELS`).

# Resources and Further Reading

1. [Medium - How to easily install Apache Airflow on Windows?](https://vivekjadhavr.medium.com/how-to-easily-install-apache-airflow-on-windows-6f041c9c80d2)
2. [Medium - Getting started with Apache AirFlow for Data Workflows](https://archive.ph/uqajQ#selection-1527.0-1531.90)
