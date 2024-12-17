from google.cloud import bigquery_datatransfer

transfer_client = bigquery_datatransfer.DataTransferServiceClient()

project_id = "kyosk-prod"
location = "europe-west4"  # Replace with your location
parent = f"projects/{project_id}/locations/{location}"

configs = transfer_client.list_transfer_configs(parent=parent)
print("Got the following configs:")
for config in configs:
    print(f"\tID: {config.name}, Schedule: {config.schedule}")