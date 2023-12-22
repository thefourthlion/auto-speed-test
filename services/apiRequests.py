import requests
from datetime import datetime

# Getting the current date and time
current_date_and_time = datetime.now()

# Formatting the date and time in the specified format: "time-mm/dd/yr"
formatted_date_and_time = current_date_and_time.strftime("time-%m/%d/%Y")


api_url = "http://localhost:3002/api/speeds/read"

def postData(Ip, name, download, upload, ping, timestamp):
    api_url = "http://localhost:3002/api/speeds/create"
    data = {"Ip": Ip, "name": name, "download": download, "upload": upload, "ping": ping, "timestamp":timestamp}
    response = requests.post(api_url, json=data)

# postData("192.168.1.1", "everett_pc", "850", "20", "22", formatted_date_and_time)

def getData(api_url):
    response = requests.get(api_url)
    data = response.json()
    # app = data["app"]
    return data


# print(getData(api_url))
