#!/bin/bash

# Kafka Broker Details
BOOTSTRAP_SERVER="localhost:9092"

# List of topics to delete
TOPICS=("old-topic1" "old-topic2" "deprecated-topic")

# Loop through each topic and delete it
for TOPIC in "${TOPICS[@]}"; do
    echo "Deleting topic: $TOPIC"
    bin/kafka-topics.sh --bootstrap-server $BOOTSTRAP_SERVER --delete --topic $TOPIC
done

echo "Topic deletion completed!"