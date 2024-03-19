import os as os
import time
from time import sleep
import random
import json
from kafka import KafkaProducer

#KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS","localhost:29092")
KAFKA_TOPIC_TEST = os.environ.get("KAFKA_TOPIC_TEST", "test-topic") # Provide a default value
KAFKA_API_VERSION = os.environ.get("KAFKA_API_VERSION", "7.6.0")

# Kafka producer initialization
producer = KafkaProducer(
    #bootstrap_servers=[KAFKA_BOOTSTRAP_SERVERS],
    bootstrap_servers=["localhost:29092"],
    api_version=KAFKA_API_VERSION,
)

# Message production loop
i = 0
while i <= 30:
    producer.send(
        KAFKA_TOPIC_TEST,
        json.dumps({"message": f"Test Message {i}"}).encode("utf-8"),
    )
    i += 1
    time.sleep(random.randint(1, 5))

# Flush the producer to ensure all messages are sent
producer.flush()