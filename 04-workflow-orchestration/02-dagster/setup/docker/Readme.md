# Dagster Docker Setup

## Table Of Contents

# Setup

- my-dagster-project/
  - Readme.md
  - .env
  - .env.example
  - .gitignore
  - requirements.txt
  - docker-compose.yml
  - Dockerfile
  - setup.py
  - pyproject.toml
  - dagster.yml
  - workspace.yml
  - my-dagster-project/
    - `__init__.py `
    - definitions.py
    - assets/
      - `__init__.py `
      - raw_data.py
      - transformed_data.py
      - analytics.py
    - jobs/
      - `__init__.py `
      - data_pipeline.py
    - ops/
      - `__init__.py `
      - extract.py
      - transform.py
      - load.py
    - resources/
      - `__init__.py `
      - database.py
      - s3.py
      - apis.py
  - sensors/
    - `__init__.py `
    - file_sensors.py
  - schedules/
    - `__init__.py `
    - daily_pipeline.py
  - partitions/
    - `__init__.py `
    - date_partitions.py
  - utils/
    - `__init__.py `
    - helpers.py
  - tests/
    - `__init__.py `
    - test_assets.py
    - test_ops.py
    - test_resources.py
  - deployment/
    - k8s/
    - terraform/
    - helm/
  - scripts/
    - setup_db.py
    - migrate.py
    - deploy.sh

# Dagster Project Structure

- `.env` and `.env.example`

  - **Purpose**: Keeps secrets out of version control while documenting required config
  - `.env`: Contains actual sensitive values (database passwords, API keys)
  - `.env.example`: Template showing what environment variables are needed

- `dagster.yaml` - Istance Configuration

  - **What it does**: Tells **Dagster** how to connect to databases, where to store logs, how to run jobs
  - **Sections**:
    1. `storage`: Where to store metadata (PostgreSQL config)
    2. `run_launcher`: How to execute jobs (local, Docker, Kubernetes)
    3. `compute_logs`: Where to store execution logs (local files, S3, etc.)
    4. `run_coordinator`: How to queue and coordinate job runs

- `workspace.yaml` - Code Discovery

  - **Purpose**: Tells Dagster where to find your code definitions
  - **Options**: Can load from Python packages, files, or even remote repositories

- `requirements.txt` - Python Dependencies

  - **Purpose**: Lists all Python packages your project needs
  - **Organized by**: Core Dagster, data processing, database connectors, development tools

- `docker-compose.yml` - Local Development Environment

  - **Purpose**: Spins up all services needed for local development
  - **Includes**: PostgreSQL database, Dagster web UI, daemon for schedules/sensors

- **Core Python Package**: `my_dagster_project/`

  - This is your main code package where all Dagster logic lives.
  - `definitions.py` - The Entry Point
    - **Purpose**: Single place where you register all your Dagster components
    - **Contains**: References to all **assets**, **jobs**, **schedules**, **sensors**, **resources**

- **Data Components Folders**

  1. `assets/` - Data Assets

     - What are assets?
       - Represent data files, tables, or any data artifacts
       - Show dependencies between data (clean_customer_data depends on customer_data)
       - Materialization = "create this data"
     - File organization:
       - `raw_data.py`: Data extraction from external sources
       - `transformed_data.py`: Data cleaning and transformation
       - `analytics.py`: Final analytical outputs, reports

  2. `ops/` - Reusable Operations

     - What are ops?
       - Individual steps/functions in your data pipeline
       - Reusable building blocks for jobs
       - Lower-level than assets, more focused on individual operations
     - File organization:
       - `extract.py`: Operations for getting data from external systems
       - `transform.py`: Data transformation and cleaning operations
       - `load.py`: Operations for storing data in databases/files

  3. `jobs/` - Orchestrated Workflows
     - What are jobs?
       - Collections of ops or assets that run together
       - Define execution order and dependencies
       - Can be triggered manually or by schedules/sensors

- **Automation & Triggers**

  1. `schedules/` - Time-Based Triggers

     - Purpose: Automatically run jobs at specific times
     - Examples: Daily data refreshes,Weekly reports, Monthly cleanup tasks

  2. `sensors/` - Event-Based Triggers

     - **Purpose**: React to external events
     - **Examples**:
       - New files uploaded to cloud storage
       - Database changes
       - API webhooks
       - Failed job retries

  3. `partitions/` - Data Slicing
     - **Purpose**: Process data in chunks (by date, region, customer, etc.)
     - **Benefits**:
       - Process historical data incrementally
       - Parallel processing
       - Easier debugging and reprocessing

- **Infrastructure & Configuration**

  1. `resources/` - External System Connections

     - **Purpose**: Manage connections to external systems
     - **Examples**:
       - Database connections (PostgreSQL, MongoDB)
       - Cloud storage (S3, GCS, Azure Blob)
       - APIs (REST APIs, GraphQL)
       - Message queues (Kafka, RabbitMQ)
     - Benefits
       - Reusable across multiple assets/ops
       - Environment-specific configuration
       - Connection pooling and management

  2. `utils/` - Helper Functions
     - **Purpose**: Shared utility functions used across your project
     - **Examples**: Data validation, notifications, formatting, common calculations

- **Testing**:

  1. `tests/` - Test Suite
     - Testing approaches:
       - Unit tests: Test individual ops/assets in isolation
       - Integration tests: Test with real external systems
       - Pipeline tests: Test entire job execution

- **Deployment & Infrastructure**

  1. `deployment/` - Production Setup

  2. `deployment/k8s/` - Kubernetes Manifests

     - **Purpose**: Deploy Dagster to Kubernetes clusters
     - **Components**:
       - Webserver deployment
       - Daemon deployment
       - PostgreSQL database
       - Load balancers and services

  3. `deployment/terraform/` - Infrastructure as Code

     - **Purpose**: Define cloud infrastructure (AWS, GCP, Azure)
     - **Manages**:
       - Databases (RDS, Cloud SQL)
       - Compute instances (ECS, GKE)
       - Storage buckets
       - Networking and security

  4. `dep**loyment/helm/` - Helm Charts

     - **Purpose**: Package Kubernetes deployments for easy installation
     - **Benefits**: Templated, reusable, version-controlled deployments

  5. `scripts/` - Automation Scripts
     - **Purpose**: Automation for setup, deployment, maintenance
     - **Examples**:
       - Database initialization
       - Data migration
       - Deployment scripts
       - Backup and restore

# Database

- The following database tables are created when we use **Postgres** for its **run/event/schedule storage** (instead of local **SQLite**). They’re part of Dagster’s instance schema, which is how it tracks all metadata about **runs**, **assets**, **schedules**, **sensors**, etc.

  1. **Core Tables**

     1. `alembic_version`: Tracks the schema migration version (managed by Alembic). Dagster upgrades run migrations here.
     2. `instance_info`: Metadata about the **Dagster** instance (version, etc.).
     3. `kvs`: A key-value store used internally for persisting misc. state.
     4. `secondary_index`: Used by **Dagster** to track whether certain indexes (on logs/events) have been built.

  2. **Runs and Executions**

     1. `runs`: The central table storing metadata about each run (**status**, **run_id**, **job name**, etc.).
     2. `pending_steps`: Steps inside a run that are queued but not yet executed.
     3. `run_tags`: Key-value tags associated with runs (e.g., partition key, environment, custom labels).
     4. `event_logs`: The big one — stores all events emitted during runs (step start, success, failure, materializations, logs, etc.).

  3. **Assets**

     1. `asset_keys`: All known asset keys in your instance.
     2. `asset_event_tags`: Tags attached to asset-related events.
     3. `asset_check_executions`: Tracks executions of asset checks (Dagster’s way of validating asset health).
     4. `asset_daemon_asset_evaluations`: State/history of asset daemon evaluations (if you use auto-materialization policies).

  4. **Jobs, schedules, and sensors**

     1. `jobs`: Stores job/sensor/schedule definitions known to the instance.
     2. `job_ticks`: Execution ticks for schedules/sensors (each time the scheduler/daemon “wakes up”).
     3. `instigators`: State of schedules and sensors (active/inactive, cursor state, etc.).

  5. **System-level**
     1. `daemon_heartbeats`: Tracks the health of Dagster daemons (scheduler, sensor daemon, etc.) by recording their periodic heartbeats.
     2. `bulk_actions`: Metadata about bulk operations triggered in Dagit (like clearing runs).
     3. `concurrentcy_slots`: Tracks concurrency limits for jobs/assets if you configure them.
     4. `dynamic_partitions`: Stores partitions added dynamically (instead of statically defined).
     5. `snapshots`: Historical snapshots of pipeline/job/asset definitions (so Dagster can run old runs even if code changes).

# Resources and Further Reading
