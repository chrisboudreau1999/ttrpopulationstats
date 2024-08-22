from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

client = MongoClient(MONGO_URI)

# List all databases
databases = client.list_database_names()
print("Databases:", databases)

# Choose the first database (or the one you expect)
db = client[databases[0]]

# List all collections in the chosen database
collections = db.list_collection_names()
print("Collections in database '{}':".format(databases[0]), collections)

