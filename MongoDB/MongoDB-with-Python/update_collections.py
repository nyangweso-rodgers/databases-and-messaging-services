# update collections in MongoDB

from pymongo import MongoClient
from pprint import pprint

# connect to MongoDB
connection_string = "" # specify the connection string
client = MongoClient(connection_string)
 # Specify the database and collection names
db = client["rodgers-users"]
collection = db['users']

# find a document
user = collection.find_one({"full_name": "Robert Okoth"})
pprint(user)

# update the document
result = collection.update_one({ "_id": user.get("_id") }, { "$set": {"first_name": "Robert" }})
print('Number of documents modified : ' + str(result.modified_count))

# print updated document
updated_user = collection.find_one({'_id': user.get('_id')})
print("This is the updated document:")
pprint(updated_user)