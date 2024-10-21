# test a successful MongoDB connection

from pymongo import MongoClient
#print(dir(MongoClient))

# Replace the following with your actual MongoDB connection string
connection_string = ""
client = MongoClient(connection_string)

# Specify the database and collection names
db = client["rodgers-users"]
collection = db['users']

# Check connection status using server_info()
try:
    info = client.server_info()
    print("Successfully Connected to MongoDB")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")