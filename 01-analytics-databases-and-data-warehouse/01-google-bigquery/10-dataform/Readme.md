# Dataform

- **Dataform** allows developers to use SQLX to write transformations within a data warehouse and create workflows using DAGS, which is helpful for taking data from a raw data zone in a data lake, to a more curated and refined reporting layer.

# Dataform Version Control Capabilities

- Dataform Version Control Capabilities allow a team of data engineers to collaborate on data pipelines and provide a central definition for data transformations.

# Key Concepts Of Dataform

## 1. Repository

## 2. Workspace

## 3. Files

- Files Include:
  1. Config Files
  2. Definitions
  3. Includes

## 4. From SQL to SQLX

- Open source extension of SQL

# Workflow Execution Scheduling Options

## 1. Workflow Configuration in Dataform

## 2. Workflows and Cloud Scheduler

## 3. Cloud Composer

# Setting Up Dataform in GCP & Establishing GitHub Integration

# Exploring Dataform Capabilities

# Steps

## Step 1: Create a Github Repository and a Personal Access Token

- Go to [github.com](https://github.com/) and create a [free account](https://github.com/) if you do not already have one.
- [Create a public remote repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories)
- Create a personal access token for authentication. DO NOT LOSE ACCESS TOKEN
  1. In the upper-right corner of any page, click your profile photo, then click Settings.
  2. In the left sidebar, click Developer settings.
  3. In the left sidebar, under Personal access tokens, click Fine-grained tokens.
  4. Click Generate new token.
  5. Under Token name, enter a name for the token.
  6. Under Expiration, select an expiration for the token.
  7. Optionally, under Description, add a note to describe the purpose of the token.
  8. Under Resource owner, select a resource owner. The token will only be able to access resources owned by the selected resource owner. Organizations that you are a member of will not appear unless the organization opted in to fine-grained personal access tokens.
  9. Optionally, if the resource owner is an organization that requires approval for fine-grained personal access tokens, below the resource owner, in the box, enter a justification for the request.
  10. Under Repository access, select which repositories you want the token to access. In practice, you should choose the minimal repository access that meets your needs. Tokens always include read-only access to all public repositories on GitHub. For our demo, make sure to grant full permissions to the repo.
  11. If you selected Only select repositories in the previous step, under the Selected repositories dropdown, select the repositories that you want the token to access.
  12. Under Permissions, select which permissions to grant the token. Depending on which resource owner and which repository access you specified, there are repository, organization, and account permissions. You should choose the minimal permissions necessary for your needs.
  13. Click Generate token. DO NOT LOSE TOKEN

## Step 2: Define set up directory and definitions

# Dataform Sample Scripts

## 1. Creating Tables

- Creating a **view**:

  - The following code sample shows definition of a **view** called `new_view` in the `definitions/new_view.sqlx` file:

    ```sqlx
      config { type: "view" }

      SELECT * FROM source_data
    ```

- Creating a **materialized view**:

  - The following code sample shows definition of a materialized view called `new_materialized_view` in the `definitions/new_materialized_view.sqlx` file:

    ```sqlx
      config {
        type: "view",
        materialized: true
      }

      SELECT * FROM source_data
    ```

- Creating a 

# Resources and Further Reading

1. []()
