# -- packages --
# pip install speedtest-cli

import speedtest

print("Testing Speed...⏳")

speedTest = speedtest.Speedtest()

downloadSpeed = speedTest.download()
downloadMbps = round(downloadSpeed / 1000000, 2)

uploadSpeed = speedTest.upload()
uploadMbps = round(uploadSpeed / 1000000, 2)

pingTime = round(speedTest.results.ping, 2)


print(f"Download Speed: {downloadMbps} Mbps" )
print(f"Upload Speed: {uploadMbps} Mbps" )
print(f"Ping: {pingTime} ms" )
