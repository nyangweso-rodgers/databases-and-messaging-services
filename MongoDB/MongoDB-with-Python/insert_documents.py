# create a collection in MongoDB
from pymongo import MongoClient
#print(dir(MongoClient))

# Step 1: Connect to MongoDB - Change connection string as needed
connection_string = ""
client = MongoClient(connection_string)
db = client["rodgers-users"]
collection = db['users']

# Step 2: prepare sample data
full_name_lists = ["Rodgers Nyangweso", "Wilson Oyare", "Robert Okoth"]
gender_lists = ["Male", "Male", "Male"]
age_lists = [30, 50, 20]


# Step 3: insert sample data
for idx in range(0, 3):
    list_users = {
        'full_name': full_name_lists[idx],
        'gender': gender_lists[idx],
        'age': age_lists[idx]
    }

    # Step 4: Insert users objectby using MongoDB isnert_one
    result = collection.insert_one(list_users)

    # Step 5: Pring ObjectID of the new document
    print(f'Created {idx+1} of 4 as {result.inserted_id}')

print('Finished creating users')