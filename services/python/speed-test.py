# -- packages --
# pip install speedtest-cli
import socket
import speedtest
import requests
from datetime import datetime
import pytz
import time
import requests
import json
import os


api_url = "http://localhost:4001/api/speeds/read"

def postData(Ip, name, download, upload, ping, timestamp):
    api_url = "http://localhost:4001/api/speeds/create"
    data = {"Ip": Ip, "name": name, "download": download,
            "upload": upload, "ping": ping, "timestamp": timestamp}
    response = requests.post(api_url, json=data)


def updateData(Ip, name, download, upload, ping, timestamp, id):
    api_url = f"http://localhost:4001/api/speeds/update/{id}"
    data = {"Ip": Ip, "name": name, "download": download,
            "upload": upload, "ping": ping, "timestamp": timestamp}
    response = requests.post(api_url, json=data)


def getData(api_url):
    response = requests.get(api_url)
    data = response.json()
    # app = data["app"]
    return data


def testSpeed():
    # ---------- get date and time -----------------------
    pst = pytz.timezone('US/Pacific')

    utc_now = datetime.now(pytz.utc)
    pst_now = utc_now.astimezone(pst)
    date_and_time = pst_now.strftime('%m-%d-%Y %H:%M')
    current_hour = pst_now.strftime('%H')  


    # ---------- ip addr --------------------------------
    ipAddr = socket.gethostbyname(socket.gethostname())
    publicIp = requests.get('https://checkip.amazonaws.com').text.strip()
    print(f"IP Address: {ipAddr}")
    print(f"Public IP: {publicIp}")

    print("Running Speed test...⏲️")
    # ---------- speed test --------------------------------
    speedTest = speedtest.Speedtest()

    downloadSpeed = speedTest.download()
    downloadMbps = round(downloadSpeed / 1000000, 2)

    uploadSpeed = speedTest.upload()
    uploadMbps = round(uploadSpeed / 1000000, 2)

    pingTime = round(speedTest.results.ping, 2)

    print(f"Download Speed: {downloadMbps} Mbps")
    print(f"Upload Speed: {uploadMbps} Mbps")
    print(f"Ping: {pingTime} ms")

    # ---------- data entry --------------------------------
    data = getData("http://localhost:4001/api/speeds/read")

    # Check if the public IP is in the data
    ip_in_data = any(entry for entry in data if entry['Ip'] == publicIp)

    if ip_in_data:
        matching_entry = next(
            (entry for entry in data if entry['Ip'] == publicIp), None)
        
        last_timestamp = matching_entry['timestamp'][-1]  # Get the last timestamp
        last_hour = datetime.strptime(last_timestamp, '%m-%d-%Y %H:%M').strftime('%H')
        
        # if current_hour == last_hour:
        #     print("Current hour matches the last entry's hour. Skipping update.")
        #     return

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
    url = 'http://localhost:4001/api/speeds/read'

    # Make the GET request
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        
        # Check if the "download" key exists and has at least 4 values
        # if "download" in data[0] and len(data[0]["download"]) >= 4:
        #     # Get the last 4 download speeds
        #     last_four_downloads = data[0]["download"][-4:]
            
        #     # Check if all last four download speeds are "0"
        #     if all(speed == "0" for speed in last_four_downloads):
        #         # os.system('sudo reboot')

        #         print("💣 All last four download speeds are 0. Performing the desired action.")
        #     else:
        #         print("The last four download speeds are not all 0.")
        # else:
        #     print("Not enough download speeds available in the data.")
    else:
        print(f"Failed to get data from {url}. Status code: {response.status_code}")

    


# ---------- code timer --------------------------------
while True:
    start_time = time.time()
    testSpeed()
    reset_if_outage()
    end_time = time.time()
    execution_time = end_time - start_time
    time.sleep(max(5 - execution_time, 0))
