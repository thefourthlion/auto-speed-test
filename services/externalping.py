import pythonping
import time
import apiRequests as req

# print(req.getData("http://localhost:3024/api/externalping/read"))

# print(ping('www.google.com'))


# Define the target IP address or hostname
target = "google.com"

# Define the packet size in bytes (50MB)
packet_size_bytes = 1 * 1024 * 1024  # 50MB


ping = pythonping.ping(target, 1024*1024).rtt_avg_ms




print(f"Ping time: {ping}")
