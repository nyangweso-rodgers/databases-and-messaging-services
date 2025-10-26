# Prefect

## Table Of Contents

# Prefect

- **Prefect** offers a **data orchestration** platform to set up, deploy, and manage pipelines at scale. We can build tasks on **Prefect** using Python scripts.
- **Features**
  1. **Cloud-Native Workflows**: **Prefect** is designed to seamlessly integrate with cloud platforms like **AWS** and **Google Cloud**, offering scalability and performance optimization tailored for modern cloud environments, especially for deploying models in production.
  2. **Dynamic Workflow Management**: **Prefect** excels in handling dynamic workflows with changing requirements, providing users with a lightweight yet powerful solution for orchestrating their data processes.
  3. **Powerful API and Programmatic Control**: **Prefect** offers a robust API that lets you programmatically control executions, interact with the scheduler, and manage workflows, providing greater automation and control over your data pipelines.
  4. **Flexible Scheduling**: Prefect allows you to schedule workflows with ease, supporting both time-based schedules and event-driven triggers. This flexibility ensures that your workflows can run exactly when needed, whether on a fixed schedule or in response to specific events.

# Components of Prefect

## Flow

- In **Prefect**, a **flow** is the core building block of workflows. It's essentially a Python function decorated with `@flow` that orchestrates a series of tasks, handles data passing, manages states (e.g., success, failure, retry), and enables features like caching, parallelism, and error handling. Flows turn simple Python code into resilient, observable pipelines without requiring complex YAML or DSLs—everything is pure Python.
- **How to create a Flow**

  - Example:

    - Here's a simple `test_flow.py` flow:

      ```py
        from prefect import flow, task

        @task
        def add_numbers(a: int, b: int):
            return a + b

        @flow(name="Simple Addition Flow")
        def addition_flow(x: int, y: int):
            result = add_numbers(x, y)
            print(f"Result: {result}")
            return result

        if __name__ == "__main__":
            addition_flow(1, 2)  # For local testing
      ```

    - Run locally: `python file.py` (executes immediately).
    - This creates a flow that can be deployed for scheduled or remote execution.

## Deployments in Prefect

- **Deployment Options**

  1. **CLI-Based Deployments** (Simplest for Single Flows)

     - Run from the project root.
     - E.g.,
       ```sh
        prefect deploy flows/test_flow.py:test_flow -n "test-flow-production" -p "local-pool" --tag "production"
       ```
     - This creates a deployment, registers it with the server, and makes the flow visible/runable in the UI. No script needed.
     - **Pros**: Quick for testing.
     - **Cons**: Manual; not scalable for multiple flows.

  2. **Python Script Deployment** (Like a `deploy.py` file)

     - Use `flow.deploy()` directly on the flow function:
     - E.g.,

       ```py
        # deployments/deploy.py
        from flows.test_flow import test_flow

        def deploy_all_flows():
            test_flow.deploy(
                name="test-flow-production",
                work_pool_name="local-pool",
                tags=["production", "test"]
            )
            print("✅ Test flow deployed")

        if __name__ == "__main__":
            deploy_all_flows()
       ```

     - Run: `python deployments/deploy.py`
     - **Pros**: Automatable (e.g., in CI/CD).
     - **Cons**: Requires path setup (e.g., `sys.path.append` for container runs)

  3. **YAML-Based Deployment** (`prefect.yaml`)
     - Define multiple deployments in a YAML file (recommended for scalability)
     - E.g.,
       ```yml
       # prefect.yaml
       deployments:
         - name: test-flow-production
           entrypoint: flows/test_flow.py:test_flow
           work_pool:
             name: local-pool
           tags: ["production", "test"]
           schedule:
             interval: 3600 # Every hour
       ```
     - Deploy: `prefect deploy -n test-flow-production`
     - **Pros**:
       - Versionable,
       - supports build/push/pull (e.g., to S3 for cloud).
     - **Cons**: Less dynamic than Python scripts
  4. **UI-Based Deployment**
     - In the Prefect UI (http://localhost:4200/deployments/create), upload/select your flow file, configure settings, and deploy.
     - **Pros**: Visual, no code needed.
     - **Cons**: Manual; not for automation.
  5. **Serve Mode** (`flow.serve()`)
     - For long-running, event-driven flows (e.g., API-triggered): `test_flow.serve(name="test-deployment", tags=["prod"])`.
     - Runs a web server for the flow.
     - **Pros**: Always-on.
     - **Cons**: Not for scheduled batch jobs.

- **Choosing an Options**
  - **Production/Scaling**: Integrate with CI/CD (e.g., GitHub Actions) to deploy on code changes, pushing to remote storage for EC2/ECS workers.

# Resources and Further Reading
