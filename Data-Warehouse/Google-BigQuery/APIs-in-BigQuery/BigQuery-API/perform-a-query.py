from google.cloud import bigquery

# check for the methods
# print(dir(bigquery))

# Instantiate the bigquery.Client class to create the BigQuery client.
client = bigquery.Client()

# Perform a sample query
QUERY = (
    'SELECT name FROM `bigquery-public-data.usa_names.usa_1910_2013`'
    'WHERE state = "TX" '
    'LIMIT 100'
)

query_job = client.query(QUERY) # API request
rows = query_job.result() # Waits for query to finish

for row in rows:
    print(row.name)