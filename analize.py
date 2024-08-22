import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('TkAgg')  # Use TkAgg for interactive plotting
import matplotlib.pyplot as plt


from pymongo import MongoClient
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Retrieve variables from .env file
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
COLLECTION_NAME = os.getenv('COLLECTION_NAME')

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]
print("connected")

# Fetch all records
data = list(collection.find({}))

# Create a DataFrame to organize the data
df = pd.DataFrame(data)

print("Sample data:")
print(df.head())

# Ensure 'lastUpdated' exists before converting
if 'lastUpdated' in df.columns:
    # Convert the 'lastUpdated' field to datetime
    df['lastUpdated'] = pd.to_datetime(df['lastUpdated'], unit='s')
    
    # Extract hour of the day
    df['hour'] = df['lastUpdated'].dt.hour
    
    # Calculate the mean population for each hour
    hourly_population = df.groupby('hour')['totalPopulation'].mean()

    # Plot the data
    plt.figure(figsize=(10, 6))
    sns.lineplot(x=hourly_population.index, y=hourly_population.values)
    plt.title('Average Player Population by Hour of Day')
    plt.xlabel('Hour of Day')
    plt.ylabel('Average Population')
    plt.grid(True)
    plt.show()
else:
    print("The 'lastUpdated' column is missing from the DataFrame.")
