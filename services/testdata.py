import requests
import random
import pytz
import time
from datetime import datetime


# Generate a random whole number between 100 and 700
random_download = random.randint(100, 700)
random_upload = random.randint(15, 20)
random_ping = random.randint(10, 20)

# # Get date and time in PST
# pst = pytz.timezone('US/Pacific')
# utc_now = datetime.now(pytz.utc)
# pst_now = utc_now.astimezone(pst)
# timestamp = pst_now.strftime('%Y-%m-%d %H:%M:%S')

update_url = f"http://localhost:3025/api/speeds/update/{id}"
get_url = f"http://localhost:3025/api/speeds/read"

download_min = 100
download_max = 200
upload_min = 100
upload_max = 250
ping_min = 35
ping_max = 40

host_name = "test-pc"

def postData(Ip, name, download, upload, ping, timestamp):
    api_url = "http://localhost:3025/api/speeds/create"
    data = {
        "Ip": Ip,
        "name": name,
        "download": download,
        "upload": upload,
        "ping": ping,
        "timestamp": timestamp
    }
    # print(data)
    response = requests.post(api_url, json=data)
    
def updateData(Ip, name, download, upload, ping, timestamp, id):
    api_url = f"http://localhost:3025/api/speeds/update/{id}"
    data = {"Ip": Ip, "name": name, "download": download,
            "upload": upload, "ping": ping, "timestamp": timestamp}
    # print(data)
    response = requests.post(api_url, json=data)
    
def updateTestData(hour, download, upload, ping):
    Ip = "test-pc"
    name = "test-pc"
    download = random_download
    upload = random_upload
    ping = random_ping
    date = "2024-02-02"
    timestamp = f"{date} {hour}:00"
    
    matching_entry = next((entry for entry in existing_data if entry['Ip'] == host_name), None)
    Id = matching_entry['_id']
    
    item_id = matching_entry['_id']
    item_name = matching_entry['name']
    item_download = matching_entry['download']
    item_download.append(f'{download}')
    item_upload = matching_entry['upload']
    item_upload.append(f'{upload}')
    item_time = matching_entry['timestamp']
    item_time.append(f'{timestamp}')
    item_ping = matching_entry['ping']
    item_ping.append(f'{ping}')
    
    updateData(
        Ip, 
        item_name, 
        item_download,
        item_upload, 
        item_ping, 
        item_time, 
        item_id)
        
    # update(Ip, name, download, upload, ping, timestamp)


def postTestData(hour, download, upload, ping):
    Ip = "test-pc"
    name = "test-pc"
    download = random_download
    upload = random_upload
    ping = random_ping
    date = "2024-02-02"
    timestamp = f"{date} {hour}:00"
    postData(Ip, name, download, upload, ping, timestamp)
    

hour = 1
data_count = 0

max_iterations = None  # You can set this to a specific number if you want the loop to stop after a certain count

iteration_count = 0  # Keep track of how many times we've iterated

while True:
    response = requests.get(get_url)
    existing_data = response.json()
    
    random_download = random.randint(download_min, download_max)
    random_upload = random.randint(upload_min, upload_max)
    random_ping = random.randint(ping_min, ping_max)
    
    download = random_download
    upload = random_upload
    ping = random_ping

    # print(existing_data)

    # Check if data already exists for the website
    hostname_in_data = any(entry for entry in existing_data if entry['name'] == host_name)
    # print({"✅":hostname_in_data})
    if hostname_in_data: 
        updateTestData(hour, download, upload, ping)
        
    else:
        postTestData(hour, download, upload, ping)
        
    # if hour == 24:
    #     time.sleep(3)   

    # print(hour)
    hour += 1  # Increment the current value
    
    # Reset to 1 if it reaches 25
    if hour == 25:
        hour = 1
    
    # Increment iteration count
    iteration_count += 1
    data_count += 1
    
    print(f"✅ Data Updated {data_count}")
    
    # Check if we've reached the maximum number of iterations (if specified)
    if max_iterations is not None and iteration_count >= max_iterations:
        break  # Exit the loop