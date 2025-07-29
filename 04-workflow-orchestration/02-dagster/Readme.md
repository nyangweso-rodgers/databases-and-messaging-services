# Dagster

## Table Of Contents

# Introduction to Dagster

- **Dagster** is an open-source data orchestrator designed for building, running, and observing **data pipelines** and **workflows**.

- **Features**:

  1. **Asset-Centric Approach**: Adopts an asset-centric model, where assets are first-class citizens. This allows you to define and track data assets directly, making it easier to manage and monitor the flow of data throughout your pipelines.
  2. **Scalability**: Dagster empowers users to scale their data workflows efficiently as their requirements evolve, making it a versatile choice for growing organizations needing to manage complex ML workflows.
  3. **Developer Productivity**: By focusing on enhancing developer productivity and debugging capabilities, Dagster streamlines the process of orchestrating complex data pipelines.
  4. **Observability and Monitoring**: Dagster provides built-in tools for observability, giving you detailed insights into the execution of your workflows. You can monitor pipeline runs, view logs, and track the status of individual components, ensuring greater transparency and control, especially for model training jobs.
  5. **Modular Architecture**: The highly modular design promotes reusability and flexibility. You can easily create reusable pipeline components, making it simpler to adapt and scale your workflows. While Prefect and Airflow support modular workflows, Dagster’s focus on modularity makes it particularly powerful for complex data engineering tasks.
  6. **Web UI**: It has Dagit, a web-based graphical interface that provides a real-time view of pipeline execution, configuration, and system health.
  7. **Error Handling**:
     - **Dagster** offers built-in support for error handling and retries within the pipeline definition. It provides mechanisms for specifying error boundaries and recovery strategies, enhancing pipeline robustness.
     - **Remark**: **Airflow** also supports **error handling** and retries, but it typically requires users to implement custom error handling logic within their Python code. While this provides flexibility, it may require more effort to implement and maintain.

- **Dagster vs. Airflow**

  1. **Abstraction Level**

     - **Dagster**: focuses on the concept of a **directed acyclic graph** (**DAG**) for defining data pipelines. **Dagster** emphasizes a more structured approach to pipeline development, with a strong emphasis on type safety and explicit dependencies between data assets.
     - **Airflow**, on the other hand, uses Python code to define workflows, giving users more flexibility and control over the execution logic. While it still uses **DAGs** to represent workflows, Airflow's approach is more code-centric.

  2. **Execution Model**:

     - **Dagster** separates the pipeline definition (the DAG) from the execution engine. It provides a unified framework for defining pipelines, managing dependencies, and executing tasks. Dagster also emphasizes data lineage and metadata management.
     - **Airflow** uses a distributed architecture with a scheduler, executor, and worker nodes. It supports parallel execution of tasks across multiple nodes, making it suitable for scaling out workflows. Airflow also provides built-in monitoring and alerting capabilities.

  3. **Error Handling**

     - **Dagster** offers built-in support for error handling and retries within the pipeline definition. It provides mechanisms for specifying error boundaries and recovery strategies, enhancing pipeline robustness.
     - **Airflow** also supports error handling and retries, but it typically requires users to implement custom error handling logic within their Python code. While this provides flexibility, it may require more effort to implement and maintain.

  4. **Community and Ecosystem**
     - **Dagster** is a newer entrant compared to **Airflow**, but it has been gaining traction, especially in organizations looking for a more structured approach to data engineering. It has a growing community and ecosystem of plugins and integrations.
     - **Airflow** has been around for longer and has a larger user base and ecosystem. It has extensive documentation, a rich set of integrations, and a vibrant community contributing plugins and extensions.

# Dagster Components

- **Dagster** has three main components that work together to schedule, execute, and monitor workflows:

  1. **Dagster Core**

     - This is the heart of **Dagster** that allows you to define and execute **DAGs** (**Directed Acyclic Graphs**), but with a more software engineering-friendly approach. Instead of defining tasks and dependencies manually (like in **Airflow**), **Dagster** uses solids (compute units) and graphs (workflow definitions).

  2. **Dagster Webserver** (`dagster-webserver`): This is the **UI** (**Dagit**) that provides:

     - A visualization of pipelines.
     - The ability to trigger runs.
     - Logs and monitoring.
     - Debugging tools.

  3. **Dagster Daemon** (`dagster-daemon`)
     - This is the **background worker** responsible for running schedules and sensors.
     - Unlike **Airflow**, where the **scheduler** is part of the main process, **Dagster** separates it.
     - It polls for scheduled runs and kicks off executions.

- **How they work together**:
  1. You define **pipelines** (**jobs**) in **Dagster**.
  2. The **webserver** (**Dagit**) lets you inspect and trigger jobs.
  3. The **daemon** handles scheduled jobs in the background.

# Resources and Further Reading

1. [Dagster Documentation](https://docs.dagster.io/?_gl=1*1bd3xxt*_ga*Nzc4MzMwNDcxLjE3MTcxNDc3OTM.*_ga_84VRQZG7TV*MTcxNzE0Nzc5My4xLjAuMTcxNzE0Nzc5My42MC4wLjA.*_gcl_au*MTcxOTE5MzIyMS4xNzE3MTQ3Nzk0)
