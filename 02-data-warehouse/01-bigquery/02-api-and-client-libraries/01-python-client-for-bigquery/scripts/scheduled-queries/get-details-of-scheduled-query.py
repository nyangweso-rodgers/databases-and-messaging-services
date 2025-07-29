from google.cloud import bigquery_datatransfer
from google.protobuf.json_format import MessageToDict
import json

# Initialize the client
client = bigquery_datatransfer.DataTransferServiceClient()

# Replace with your project ID, location, and config ID
project_id = "<project-id>"
location = "europe-west4"
config_id = "<config-id>"

# Properly format the config_name
config_name = f"projects/{project_id}/locations/{location}/transferConfigs/{config_id}"

# Get detailed config information
config_details = client.get_transfer_config(name=config_name)

# Convert Protobuf object to a dictionary using raw_pb
config_dict = MessageToDict(config_details._pb)

# Format as JSON with indentation for readability
config_json = json.dumps(config_dict, indent=4)

# Print the JSON
print(config_json)