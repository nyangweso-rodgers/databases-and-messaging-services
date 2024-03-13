from kafka import KafkaAdminClient 

# Kafka broker configuration
bootstrap_servers = 'localhost:8098'

# Create a Kafka admin client
admin_client = KafkaAdminClient(bootstrap_servers=bootstrap_servers)

# Get metadata from the Kafka cluster
cluster_metadata = admin_client.describe_cluster()

# Get the IDs of active brokers
active_brokers = cluster_metadata["brokers"]
for broker_info in active_brokers:
    print(broker_info)  # Print out the entire dictionary for each broker_info