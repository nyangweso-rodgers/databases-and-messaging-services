# query collections

from pymongo import MongoClient
from pprint import pprint

# connect to MongoDB
connection_string = ""
client = MongoClient(connection_string)
 # Specify the database and collection names
db = client["rodgers-users"]
collection = db['users']

# print one of the users matching a criteria
user = collection.find_one({"age": 20})
# pprint(user)

# print all the users
list_users = collection.find({})
for user in list_users:
    pprint(user)