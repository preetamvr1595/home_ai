from pymongo import MongoClient
import sys

MONGO_URI = "mongodb+srv://preetamvr962002_db_user:GBcmInDAVPupOTyL@cluster0.cjg9ry8.mongodb.net/?appName=Cluster0"

try:
    print("Connecting to MongoDB...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    client.admin.is_master()
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    sys.exit(1)
