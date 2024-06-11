import requests
import json
import os

# URL to make the GET request to
url = 'http://127.0.0.1:3025/api/speeds/read'

# Make the GET request
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()
    
    # Check if the "download" key exists and has at least 4 values
    if "download" in data[0] and len(data[0]["download"]) >= 4:
        # Get the last 4 download speeds
        last_four_downloads = data[0]["download"][-4:]
        
        # Check if all last four download speeds are "0"
        if all(speed == "0" for speed in last_four_downloads):
            # os.system('sudo reboot')

            print("💣 All last four download speeds are 0. Performing the desired action.")
        else:
            print("The last four download speeds are not all 0.")
    else:
        print("Not enough download speeds available in the data.")
else:
    print(f"Failed to get data from {url}. Status code: {response.status_code}")
