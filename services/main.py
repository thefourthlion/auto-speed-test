# -- packages --
# pip install speedtest-cli
import socket
import speedtest
import requests
import apiRequests as req
from datetime import datetime

# Getting the current date and time
current_date_and_time = datetime.now()

# Formatting the date and time in the specified format: "time-mm/dd/yr"
formatted_date_and_time = current_date_and_time.strftime("time-%m/%d/%Y")

print("Testing Speed...⏳")

# ---------- ip addr --------------------------------
ipAddr = socket.gethostbyname(socket.gethostname())
publicIp = requests.get('https://checkip.amazonaws.com').text.strip()
print(f"IP Address: {ipAddr}")
print(f"Public IP: {publicIp}")

# ---------- speed test --------------------------------
speedTest = speedtest.Speedtest()

downloadSpeed = speedTest.download()
downloadMbps = round(downloadSpeed / 1000000, 2)

uploadSpeed = speedTest.upload()
uploadMbps = round(uploadSpeed / 1000000, 2)

pingTime = round(speedTest.results.ping, 2)

print(f"Download Speed: {downloadMbps} Mbps" )
print(f"Upload Speed: {uploadMbps} Mbps" )
print(f"Ping: {pingTime} ms" )

# ---------- data entry --------------------------------
data = req.getData("http://localhost:3002/api/speeds/read")

# Check if the public IP is in the data
ip_in_data = any(entry for entry in data if entry['Ip'] == publicIp)

if ip_in_data:
    matching_entry = next((entry for entry in data if entry['Ip'] == publicIp), None)
    print("Editing existing data for IP:", publicIp)
    item_id = matching_entry['_id']
    item_name = matching_entry['name']
    req.updateData(publicIp, item_name, downloadMbps, uploadMbps, pingTime, formatted_date_and_time, item_id)

else:
    print("Creating new data for IP:", publicIp)
    name = ""
    req.postData(publicIp, name, downloadMbps, uploadMbps, pingTime, formatted_date_and_time)
