# Workflow Orchestration

## Table Of Contents

# Data Orchestration Tools

1. Apache Airflow
   - when you need task scheduling only (no data awareness)
2. Dagster
   - when you foresee higher-level data engineering problems.
   - Dagster has more abstractions as they grew from first principles with a holistic view in mind from the very beginning.
   - They focus heavily on **data integrity**, **testing**, **idempotency**, **data assets**, etc.
3. Prefect
   - if you need a fast and dynamic modern orchestration with a straightforward way to scale out.
   - They recently revamped the prefect core as **Prefect 2.0** with a new second-generation orchestration engine called **Orion**. It has several abstractions that make it a Swiss army knife for general task management.
   - With the new engine Orion they built in Prefect 2.0, they’re very similar to Temporal and support fast low latency application orchestration
4. Temporal
5. Mage AI
6. orchest.io
7. Kestra
8. Maestro
9. Argo Workflows

# Resources and Further Reading

1. [Argo vs Airflow vs Prefect: How Are They Different](https://neptune.ai/blog/argo-vs-airflow-vs-prefect-differences?ref=dailydev)
