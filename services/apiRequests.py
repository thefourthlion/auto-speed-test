import requests

api_url = "http://localhost:3002/api/speeds/read"

def postData(Ip, name, download, upload, ping, timestamp):
    api_url = "http://localhost:3002/api/speeds/create"
    data = {"Ip": Ip, "name": name, "download": download, "upload": upload, "ping": ping, "timestamp":timestamp}
    response = requests.post(api_url, json=data)
    
def updateData(Ip, name, download, upload, ping, timestamp, id):
    api_url = f"http://localhost:3002/api/speeds/update/{id}"
    data = {"Ip": Ip, "name": name, "download": download, "upload": upload, "ping": ping, "timestamp":timestamp}
    response = requests.post(api_url, json=data)

# postData("192.168.1.1", "everett_pc", "850", "20", "22", formatted_date_and_time)

def getData(api_url):
    response = requests.get(api_url)
    data = response.json()
    # app = data["app"]
    return data

# print(getData(api_url))
