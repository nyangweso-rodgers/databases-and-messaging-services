# create a collection in MongoDB
from pymongo import MongoClient
#print(dir(MongoClient))

# Step 1: Connect to MongoDB - Change connection string as needed
client = MongoClient(port=27017)
db = client.booksdb

# Step 2: prepare sample data
users = ["Rodgers Nyangweso", "Wilson Oyare", "Robert Okoth"]
gender = ["Male", "Male", "Male"]


# Step 3: insert sample data