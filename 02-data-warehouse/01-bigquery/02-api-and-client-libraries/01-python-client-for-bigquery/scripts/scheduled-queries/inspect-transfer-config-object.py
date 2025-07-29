from google.cloud import bigquery_datatransfer

client = bigquery_datatransfer.DataTransferServiceClient()

# Replace with your project ID and location
project_id = "<project_id>"
location = "europe-west4"
parent = f"projects/{project_id}/locations/{location}"

transfer_configs = client.list_transfer_configs(parent=parent)

for config in transfer_configs:
    print(config)
