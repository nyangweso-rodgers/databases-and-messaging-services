import smtplib
from pymongo import MongoClient

# Replace these with your own email and MongoDB connection details
sender_email = "myemail@example.com"
receiver_email = "otheremail@example.com"
mongodb_uri = "mongodb://localhost:27017"

# Connect to MongoDB
client = MongoClient(mongodb_uri)

# Check the status of the server
server_status = client.server_info()

# Set the subject and body of the email based on the server statusif "ok" in server_status and server_status["ok"] == 1.0:
subject = "MongoDB status: OK"
body = "The MongoDB server is running and responding to requests."
else:
subject = "MongoDB status: ERROR"
body = "There was a problem connecting to the MongoDB server."