import socket
import speedtest
import requests
from datetime import datetime
import pytz
import time
import platform
import pythonping
import os

# Define hostname at the top of the script
hostname = platform.node()

# Display the hostname of the device
print("The hostname of this device is =", hostname)

api_url = "http://127.0.0.1:3025/api/speeds/read"

def postData(Ip, name, download, upload, ping, timestamp):
    api_url = "http://127.0.0.1:3025/api/speeds/create"
    data = {"Ip": Ip, "name": name, "download": download,
            "upload": upload, "ping": ping, "timestamp": timestamp}
    response = requests.post(api_url, json=data)

def updateData(Ip, name, download, upload, ping, timestamp, id):
    api_url = f"http://127.0.0.1:3025/api/speeds/update/{id}"
    data = {"Ip": Ip, "name": name, "download": download,
            "upload": upload, "ping": ping, "timestamp": timestamp}
    response = requests.post(api_url, json=data)

def getData(api_url):
    response = requests.get(api_url)
    data = response.json()
    return data

def externalping():
    print("⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛")  # Loading message for external ping check

    try:
        websites = getData("http://127.0.0.1:3025/api/externalping/read")
    except Exception as e:
        print(f"Failed to get website data: {e}")
        return

    # URL for posting ping data to another database
    api_url = "http://127.0.0.1:3025/api/externalpingdata/create"
    get_url = "http://127.0.0.1:3025/api/externalpingdata/read"

    # Get date and time in PST
    pst = pytz.timezone('US/Pacific')
    utc_now = datetime.now(pytz.utc)
    pst_now = utc_now.astimezone(pst)
    timestamp = pst_now.strftime('%m-%d-%Y %H:%M')

    for website in websites:
        target = website.get('link')
        packet_size_bytes = 32  # 32B

        try:
            response = pythonping.ping(target, count=4, size=packet_size_bytes)
            ping_avg = response.rtt_avg_ms
            print(f"Name: {website['name']}, Ping time: {ping_avg} ms")

            get_data = {'link': website.get('name')}
            response = requests.get(get_url, params=get_data)
            if response.status_code != 200:
                raise ValueError(
                    f"API request failed with status code: {response.status_code}")

            existing_data = response.json()
            if existing_data is None:
                raise ValueError(f"No data returned from API for {target}")

            # Check if data already exists for the website
            website_in_data = any(
                entry for entry in existing_data if entry['hostname'] == hostname and entry['link'] == website.get('name'))

            if website_in_data:
                website_and_hostname_matching_entry = next((entry for entry in existing_data if entry['link'] == website.get(
                    'name') and entry['hostname'] == hostname), None)
                if website_and_hostname_matching_entry:
                    print(f"Data already exists for {website['name']}")

                    item_id = website_and_hostname_matching_entry['_id']
                    item_ping = website_and_hostname_matching_entry.get(
                        'ping', [])
                    item_timestamp = website_and_hostname_matching_entry.get(
                        'timestamp', [])

                    item_ping.append(str(ping_avg))
                    item_timestamp.append(timestamp)

                    data = {
                        "_id": item_id,
                        "hostname": hostname,
                        "link": website.get('name'),
                        "ping": item_ping,
                        "timestamp": item_timestamp
                    }

                    update_response = requests.post(
                        f"http://127.0.0.1:3025/api/externalpingdata/update/{item_id}", json=data)
                    if update_response.status_code != 200:
                        print(
                            f"Failed to update data for {website.get('name')}")
            else:
                print(f"Don't have data for {website['name']}")
                data = {
                    "hostname": hostname,
                    'link': website.get('name'),
                    'ping': [str(ping_avg)],
                    'timestamp': [timestamp]
                }

                post_response = requests.post(api_url, json=data)
                if post_response.status_code != 200:
                    print(f"Failed to post new data for {website.get('name')}")
                print(f"Data sent to update database for {website['name']}")

        except Exception as e:
            print(f"Failed to process {website.get('name')}: {e}")

def speedTest():
    # ---------- get date and time -----------------------
    pst = pytz.timezone('US/Pacific')

    utc_now = datetime.now(pytz.utc)
    pst_now = utc_now.astimezone(pst)
    date_and_time = pst_now.strftime('%m-%d-%Y %H:%M')

    # ---------- ip addr --------------------------------
    ipAddr = socket.gethostbyname(socket.gethostname())
    publicIp = hostname
    print(f"IP Address: {ipAddr}")
    print(f"Public IP: {publicIp}")

    print("Running Speed test...⏲️")
    # ---------- speed test --------------------------------
    speedTest = speedtest.Speedtest(secure=True)

    downloadSpeed = speedTest.download()
    downloadMbps = round(downloadSpeed / 1000000, 2)

    uploadSpeed = speedTest.upload()
    uploadMbps = round(uploadSpeed / 1000000, 2)

    pingTime = round(speedTest.results.ping, 2)

    print(f"Download Speed: {downloadMbps} Mbps")
    print(f"Upload Speed: {uploadMbps} Mbps")
    print(f"Ping: {pingTime} ms")

    # ---------- data entry --------------------------------
    data = getData("http://127.0.0.1:3025/api/speeds/read")

    # Check if the public IP is in the data
    ip_in_data = any(entry for entry in data if entry['Ip'] == publicIp)

    if ip_in_data:
        matching_entry = next(
            (entry for entry in data if entry['Ip'] == publicIp), None)
        print("Editing existing data for IP:", publicIp)
        item_id = matching_entry['_id']
        item_name = matching_entry['name']
        item_download = matching_entry['download']
        item_download.append(f'{downloadMbps}')
        item_upload = matching_entry['upload']
        item_upload.append(f'{uploadMbps}')
        item_time = matching_entry['timestamp']
        item_time.append(f'{date_and_time}')
        item_ping = matching_entry['ping']
        item_ping.append(f'{pingTime}')
        updateData(publicIp, item_name, item_download, item_upload, item_ping, item_time, item_id)

    else:
        print("Creating new data for IP:", publicIp)
        name = ""
        postData(publicIp, name, downloadMbps, uploadMbps, pingTime, date_and_time)

def reset_if_outage():
    url = f'http://127.0.0.1:3025/api/externalpingdata/read/name/{hostname}'

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
                os.system('sudo reboot')
                print("💣 All last four download speeds are 0. Performing the desired action.")
            else:
                print("The last four download speeds are not all 0.")
        else:
            print("Not enough download speeds available in the data.")
    else:
        print(f"Failed to get data from {url}. Status code: {response.status_code}")

# ---------- code timer --------------------------------
while True:
    start_time = time.time()
    externalping()
    speedTest()
    reset_if_outage()
    end_time = time.time()
    execution_time = end_time - start_time
    time.sleep(max(3600 - execution_time, 0))
