import pythonping
import time
from datetime import datetime
import apiRequests as req
import requests
import pytz

# Define your list of websites
websites = req.getData("http://localhost:3024/api/externalping/read")


# Define the URL for the POST request to update another database
api_url = "http://localhost:3024/api/externalpingdata/create"

get_url = "http://localhost:3024/api/externalpingdata/read"


#---------- get date and time -----------------------
pst = pytz.timezone('US/Pacific')

utc_now = datetime.now(pytz.utc)
pst_now = utc_now.astimezone(pst)
timestamp = pst_now.strftime('%m-%d-%Y %H:%M')

while True:
    for website in websites:
        target = website['link']
        packet_size_bytes = 32   # 32B

        try:
            ping = pythonping.ping(target, packet_size_bytes).rtt_avg_ms
            print(f"Name: {website['name']}, Ping time: {ping} ms")
            
                        # Check if data already exists for the website
            get_data = {
                'link': website['name']
            }
            
            existing_data = requests.get(get_url, params=get_data).json()
            name_in_data = any(entry for entry in existing_data if entry['link'] == website['name'])

            # print(existing_data)
            print(get_data)
            if name_in_data:
                print(f"Data already exists for {website['name']}")
                matching_entry = next((entry for entry in existing_data if entry['link'] == website['name']), None)

                item_id = matching_entry['_id']
                item_link = matching_entry['link']
                item_ping = matching_entry['ping']
                item_ping.append(f'{ping}')
                
                data = {
                    "_id":item_id,
                    "link":item_link,
                    "ping":item_ping,
                    "timestamp":timestamp
                }
                
                requests.post(f"http://localhost:3024/api/externalpingdata/update/{item_id}", json=data)
        
        
            else:
                print(f"Dont have data for {website['name']}")
                # Create a data object to send in the POST request
                data = {
                    'link': website['name'],
                    'ping': ping,
                    'timestamp': timestamp
                }

                requests.post(api_url, json=data)
                print(f"Data sent to update database for {website['name']}")
            

        except Exception as e:
            print(f"Failed to ping {website['name']}: {e}")

    # Sleep for 30 minutes (1800 seconds)
    time.sleep(1800)
