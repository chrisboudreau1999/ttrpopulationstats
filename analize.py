from pymongo import MongoClient
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use the non-interactive Agg backend
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

# Fetch all records
data = list(collection.find({}))

# Print the number of documents and sample data
num_documents = len(data)
print(f"Number of documents retrieved: {num_documents}")
print("Sample data:")
print(data[:5])  # Print the first 5 documents

# Create a DataFrame to organize the data
df = pd.DataFrame(data)

# Print columns and sample data to debug
print("Columns in DataFrame:", df.columns)
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
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=hourly_population)

    # Format x-axis to show 12-hour format
    plt.xticks(
        ticks=range(0, 24),
        labels=[f'{h%12 if h%12 != 0 else 12} {"AM" if h < 12 else "PM"}' for h in range(0, 24)],
        rotation=45,  # Rotate labels to avoid overlap
        fontsize=10    # Adjust font size for better readability
    )

    # Update the title to include the number of data points analyzed
    plt.title(f'Average Player Population by Hour of Day\nAnalyzed {num_documents} Data Points')
    plt.xlabel('Hour of Day')
    plt.ylabel('Average Population')
    plt.tight_layout()  # Adjust layout to prevent clipping of labels
    plt.savefig('population_plot.png')  # Save the plot to a file
    print("Plot saved as 'population_plot.png'")
else:
    print("The 'lastUpdated' column is missing from the DataFrame.")
