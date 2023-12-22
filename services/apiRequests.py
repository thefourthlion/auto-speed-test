import requests

api_url = "https://jsonplaceholder.typicode.com/todos/1"

def postData(Ip, name, download, upload, ping):
    data = {"IP": Ip, "name": name, "download": download, "upload": upload, "ping": ping}
    response = requests.post(api_url, json=data)

def getData(api_url):
    response = requests.get(api_url)
    return response.json()
    
    
print(getData(api_url))