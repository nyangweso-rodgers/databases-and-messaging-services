from google.cloud import bigquery_datatransfer
#print(dir(bigquery_datatransfer))

# Initialize the client
client = bigquery_datatransfer.DataTransferServiceClient()

# Replace with your project ID and location
project_id = "kyosk-prod"
location = "europe-west4"
your_email = "rodgers.nyangweso@kyosk.app"

# Parent resource
parent = f"projects/{project_id}/locations/{location}"

# List all transfer configs
transfer_configs = client.list_transfer_configs(parent=parent)

# Filter and display configs owned by you
print("Scheduled Queries owned by you:")
for config in transfer_configs:
    # Check if your email is the owner
    if config.owner_info.email == your_email:
        print(f"- Name: {config.name}")
        print(f"  Display Name: {config.display_name}")
        print(f"  Data Source ID: {config.data_source_id}")
        print(f"  State: {config.state}")
        print()