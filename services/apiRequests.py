import requests

api_url = "http://localhost:3002/"

def postData(Ip, name, download, upload, ping):
    data = {"IP": Ip, "name": name, "download": download, "upload": upload, "ping": ping}
    response = requests.post(api_url, json=data)

def getData(api_url):
    response = requests.get(api_url)
    data = response.json()
    # app = data["app"]
    return data


print(getData(api_url))
