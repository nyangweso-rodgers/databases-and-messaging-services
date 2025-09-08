# Data Build Tool (dbt)

## Tbale Of Contents

# dbt

- **dbt** is an open source analytics engineering framework that enables teams to transform raw data that has been loaded into a warehouse like **Snowflake**, **BigQuery**, **Redshift**, or **Databricks** using SQL-based workflows.
- **dbt** is available in two main forms:
  1. **dbt Core**, the free and open source CLI tool, and
  2. **dbt Cloud**, a managed platform that adds scheduling, UI support, collaboration tools, and native integrations.
- Both options enable teams to introduce software engineering best practices—such as **version control**, **automated testing**, **data lineage tracking**, **documentation generation**, and **CI/CD**—to the analytics workflow. Its model dependency graphs ensure that transformations are executed in the correct order, while built-in testing and assertions help catch data quality issues early.

- **How it works**:
  - **dbt** allows data teams to write modular, testable SQL transformations that run directly in modern data warehouses.
  - Using **Jinja** templating, **dbt** enables developers to inject logic such as **loops**, **conditionals**, and environment-aware parameters into their SQL models, reducing duplication and making code more reusable across datasets and environments. **dbt** handles compiling, dependency resolution, and execution, ensuring models run in the correct order. For example, a team might use dbt to transform raw event logs into structured, analytics-ready tables by applying consistent business logic across pipelines.
  - To support **data quality**, **dbt** includes built-in testing for critical fields, such as checking for **null values**, **uniqueness**, or **valid categories**. These automated tests catch bad data before it reaches dashboards or downstream processes. For example, running a uniqueness test on a `customer_id` field can prevent silent duplication in user-level reporting. Additionally, dbt supports freshness blocks to validate whether a data source has been recently updated, flagging pipelines that may be running on stale data.
  - **dbt** also brings visibility to transformation pipelines with automatic dependency tracking and lineage graphs, which can be generated with the command dbt docs generate. These graphs help teams audit data flows—such as tracing a marketing dashboard metric all the way back to raw event ingestion—improving transparency and reducing the surface area for debugging.
  - Finally, **dbt** integrates with **CI/CD** platforms like **GitHub Actions**, **GitLab CI**, and **Apache Airflow** to validate and deploy data pipelines through version control. This makes it easier for data teams to collaborate on shared models, review changes, and enforce testing before deployment, lowering the technical barrier to modern pipeline development and bringing software engineering best practices to analytics workflows.

# Best practices for getting the most value from dbt

- **dbt** encourages a layered approach to modeling, typically broken into three logical tiers: **staging**, **intermediate**, and **marts**. Each layer serves a distinct purpose in the transformation pipeline, helping teams apply consistent practices as their analytics workflows grow in complexity.

## 1. Staging: normalize raw data

- The **staging layer** is the foundation of any **dbt** project. These models are lightweight wrappers around raw tables—such as data from Salesforce, Stripe, or internal databases—and serve to clean and prepare source-conformed concepts for downstream usage.
- To optimize the staging layer of dbt projects, organizations should:
  - **Keep logic simple and single-purpose**. Use staging models to **rename columns**, **cast data types**, **perform basic unit conversions** (e.g., cents to dollars), and apply simple categorization. Avoid joins or aggregations here to improve modularity and debuggability. When each model has a clear, narrow responsibility, it becomes easier to trace how data changes over time, write focused tests, and isolate issues when they occur. This also creates a strong foundation for reuse in downstream layers, ensuring transformations are auditable.
  - **Organize by source system**. Group models into folders based on their data origin (e.g., **Stripe** or **Salesforce**), not by team or business logic, so that they mirror the structure of your data warehouses, making it easier to find and maintain models. This practice also keeps business logic out of the staging layer, so the models stay reusable across teams and use cases. This improves clarity, reduces duplication, and supports a cleaner project structure as your dbt repo grows.
  - **Use consistent naming**: Follow the `stg_<source>__<entity>s.sql` convention to clearly link models to their source tables. This makes your project easier to navigate, helps enforce a shared mental model across teams, and ensures that naming reflects both the origin and purpose of each model.
  - **Materialize as views**: This ensures the freshest data for each run while conserving storage, since staging models are often not queried directly. Define one staging model per source. Doing so creates a clean entry point for lineage tracking and simplifies downstream debugging.

## 2. Intermediate: apply business logic

- The **intermediate layer** transforms **staging data** into more business-ready forms by applying **joins**, **filters**, and **calculated metrics**. These models often represent relationships (e.g., `orders` joined to `customers`), key transformations (e.g., deriving `active_users`), or custom metrics (e.g., `most_recent_subscription`).
- Best practices for intermediate models in dbt include:
  - **Structure by domain**: Organize folders based on business groupings—like billing or growth—to reflect how stakeholders think about data. This alignment makes models easier for cross-functional teams to find, understand, and reuse, since the folder structure matches how they conceptualize business problems and KPIs. It also promotes clearer ownership and collaboration, reducing friction when analysts, engineers, and decision-makers work together on shared metrics or reporting logic.
  - **Name with purpose**: Since these models are diverse in logic, use verbs to describe their transformation (e.g., `int_orders_joined`, `int_users_aggregated_to_session`, `int_sessions_fanned_out_by_quantity`). This makes it clear what each model is doing, improves readability, speeds up onboarding for new team members, and reduces cognitive load. It also encourages modularity and reuse by making each model’s role more self-evident.
  - **Choose appropriate materializations**: Selecting the right materialization strategy helps optimize both performance and resource usage across your dbt project. Use **ephemeral** for lightweight logic that doesn’t need to be saved and is used by only a few downstream models. In addition, use views in a custom schema if you want the data platform to manage refresh logic for transformations that don’t need to be persisted as tables. It’s also best to use incremental models for large or event-style datasets that are slow to rebuild fully and can be updated in chunks. Making smart choices here ensures your pipelines run faster, consume less storage, and remain easier to reason about as your project scales.
  - **Re-grain strategically**: Fan out or collapse data to shift granularity by, for example, converting session-level events into user-level summaries. This allows downstream models to operate at the appropriate level of detail for their use case, improving query performance, reducing unnecessary joins, and making metrics easier to interpret and compare.
  - **Isolate complexity**: Break apart heavy logic into multiple layers to improve modularity and downstream reusability. This makes models easier to test and maintain, reduces the risk of performance bottlenecks in large transformations, and enables faster iteration by letting developers focus on smaller, composable pieces of logic.

## 3. Marts: deliver business-ready models

- The **marts** layer contains final models that are used directly by analysts, dashboards, and machine learning pipelines. These models should be stable, trusted, and aligned with key business entities like `customers`, `orders`, or `revenue_events`.
- To keep **marts** clean and maintainable, teams should:
  - **Group by stakeholder needs**: Organize files and folders based on department or area of concern (e.g., **finance**, **marketing**) so that models are easier to navigate and ownership is clear.
  - **Avoid duplicating business logic**: Don’t create separate versions of the same model for different teams—like `finance_orders` and `marketing_orders—as` this can lead to metric drift. Use clear naming conventions. Align model names with business terms to improve discoverability and encourage reuse.
  - **Materialize strategically**: Use tables or incremental models when performance or scale requires it. In addition, it’s best to use wide, denormalized tables where needed to support BI tools or reduce dashboard complexity.
  - **Minimize joins at the mart layer**: Push complexity into intermediate models to keep marts performant and easy to reason about.

# Resources and Further Reading

1. [datagog - Understanding dbt: basics and best practices](https://www.datadoghq.com/blog/understanding-dbt/?utm_source=tldrdevops)
