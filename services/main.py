# -- packages --
# pip install speedtest-cli
import socket
import speedtest
import requests
import apiRequests as req
from datetime import datetime
import pytz
import time
import platform
import externalping as ping

# displaying the hostname of the device
# using the platform.node()python
print("The hostname of this device is = ", platform.node())


def speedTest():
    # ---------- get date and time -----------------------
    pst = pytz.timezone('US/Pacific')

    utc_now = datetime.now(pytz.utc)
    pst_now = utc_now.astimezone(pst)
    date_and_time = pst_now.strftime('%m-%d-%Y %H:%M')

    # ---------- ip addr --------------------------------
    ipAddr = socket.gethostbyname(socket.gethostname())
    publicIp = platform.node()
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
    data = req.getData("http://localhost:3025/api/speeds/read")

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
        req.updateData(publicIp, item_name, item_download,
                       item_upload, item_ping, item_time, item_id)

    else:
        print("Creating new data for IP:", publicIp)
        name = ""
        req.postData(publicIp, name, downloadMbps,
                     uploadMbps, pingTime, date_and_time)


# ---------- code timer --------------------------------
while True:
    ping.externalping()
    start_time = time.time()
    speedTest()
    end_time = time.time()
    execution_time = end_time - start_time
    time.sleep(max(1 - execution_time, 0))
