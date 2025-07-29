# BigQuery CLI

## Table Of Contents

# Step 1: Install Google Cloud SDK

- Helpful for managing your Google Cloud environment.
- Visit the [official Google Cloud SDK download page](https://cloud.google.com/sdk/downloads) and download the appropriate installer for your operating system.
- After installation, open a new terminal window to ensure the environment variables are updated correctly.
- Run the following command to verify the installation:
  ```bash
    #verify the installation
    gcloud --version
  ```

# Step 2: Authenticate with the Service Account

- Use the `gcloud auth activate-service-account` command to authenticate with your service account:
  ```sh
    gcloud auth activate-service-account --key-file /path/to/your/bigquery-keyfile.json
  ```
- Replace `/path/to/your/bigquery-keyfile.json` with the actual path to your key file.

# Step 3: Create a Dataset

- Use the `bq mk` command to create the `kafka_dataset` dataset if it doesn't exist:
  ```sh
    bq mk --dataset kafka_dataset
  ```

## Step 4: Create the Table

- Use the `bq mk` command to create the table within the `kafka_dataset` dataset. Replace `table_name` with your desired table name and adjust the schema as needed:
  ```sh
    bq mk --table kafka_dataset.table_name --schema='fields=name:STRING,age:INTEGER'
  ```

# Working with Scheduled Queries using command Line

## List BigQuery Scheduled Queries

- Syntax: Use the following command can be used to list scheduled queries

  ```sh
    bq ls --transfer_config --transfer_location=LOCATION --filter='dataSourceIds:scheduled_query'
  ```

  - Replace LOCATION with the region you want to inspect, for example "us".

- **Example**:
  - Lists Scheduled Queries from `europe-west4`
    ```sh
      bq ls --transfer_config --transfer_location=europe-west4 --filter='dataSourceIds:scheduled_query'
    ```
```sh
  bq show --format=json --transfer_config <transfer_config_name>
```
```sh
  bq show --format=json --transfer_config stock_replenishment
```
```sh
  bq ls \
--transfer_config \
--transfer_location=europe-west4 \
--project_id=kyosk-prod \
--max_results=10 \
--filter=dataSourceIds:stock_replenishment
```
```sh```
# Resources and Further Reading
