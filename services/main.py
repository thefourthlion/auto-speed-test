# -- packages --
# pip install speedtest-cli
import socket
import speedtest
import requests

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
