from google.cloud import bigquery_datatransfer
#print(dir(bigquery_datatransfer))

# Initialize the client
client = bigquery_datatransfer.DataTransferServiceClient()

# Replace with your project ID and location
project_id = "<project-id>"
location = "europe-west4" # replace location

# Parent resource
parent = f"projects/{project_id}/locations/{location}"

# List all transfer configs
transfer_configs = client.list_transfer_configs(parent=parent)

print("All Scheduled Queries:")
for config in transfer_configs:
    print(f"- Name: {config.name}")
    print(f"  Display Name: {config.display_name}")
    print(f"  Owner Email: {config.owner_info.email}")
    print(f"  Data Source ID: {config.data_source_id}")
    print(f"  State: {config.state}")
    print()