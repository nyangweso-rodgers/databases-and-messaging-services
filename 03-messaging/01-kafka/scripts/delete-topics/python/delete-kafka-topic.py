from kafka.admin import KafkaAdminClient, NewTopic

# Kafka Admin Client
admin_client = KafkaAdminClient(
    bootstrap_servers="localhost:9092",
    client_id="topic-deleter"
)

# Topic to delete
topic_name = "old-topic"

# Deleting the topic
try:
    admin_client.delete_topics([topic_name])
    print(f"Topic '{topic_name}' deleted successfully.")
except Exception as e:
    print(f"Failed to delete topic: {e}")

# Close the admin client
admin_client.close()