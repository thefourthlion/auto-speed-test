import pythonping
import time
from datetime import datetime
import apiRequests as req
import requests
import pytz
import platform


def externalping():
    # Define your list of websites
    try:
        websites = req.getData("http://localhost:3025/api/externalping/read")
    except Exception as e:
        print(f"Failed to get website data: {e}")
        return

    # Define the URL for the POST request to update another database
    api_url = "http://localhost:3025/api/externalpingdata/create"
    get_url = "http://localhost:3025/api/externalpingdata/read"

    host_name = platform.node()

    # Get date and time in PST
    pst = pytz.timezone('US/Pacific')
    utc_now = datetime.now(pytz.utc)
    pst_now = utc_now.astimezone(pst)
    timestamp = pst_now.strftime('%m-%d-%Y %H:%M')

    for website in websites:
        target = website.get('link')
        packet_size_bytes = 32  # 32B

        try:
            response = pythonping.ping(target, count=4, size=packet_size_bytes)
            ping_avg = response.rtt_avg_ms
            print(f"Name: {website['name']}, Ping time: {ping_avg} ms")

            get_data = {'link': website.get('name')}
            response = requests.get(get_url, params=get_data)
            if response.status_code != 200:
                raise ValueError(
                    f"API request failed with status code: {response.status_code}")

            existing_data = response.json()
            if existing_data is None:
                raise ValueError(f"No data returned from API for {target}")

            # Check if data already exists for the website
            website_in_data = any(
                entry for entry in existing_data if entry['hostname'] == host_name and entry['link'] == website.get('name'))

            if website_in_data:
                website_and_hostname_matching_entry = next((entry for entry in existing_data if entry['link'] == website.get(
                    'name') and entry['hostname'] == host_name), None)
                if website_and_hostname_matching_entry:
                    print(f"Data already exists for {website['name']}")

                    item_id = website_and_hostname_matching_entry['_id']
                    item_ping = website_and_hostname_matching_entry.get(
                        'ping', [])
                    item_timestamp = website_and_hostname_matching_entry.get(
                        'timestamp', [])

                    item_ping.append(str(ping_avg))
                    item_timestamp.append(timestamp)

                    data = {
                        "_id": item_id,
                        "hostname": host_name,
                        "link": website.get('name'),
                        "ping": item_ping,
                        "timestamp": item_timestamp
                    }

                    update_response = requests.post(
                        f"http://localhost:3025/api/externalpingdata/update/{item_id}", json=data)
                    if update_response.status_code != 200:
                        print(
                            f"Failed to update data for {website.get('name')}")
            else:
                print(f"Don't have data for {website['name']}")
                data = {
                    "hostname": host_name,
                    'link': website.get('name'),
                    'ping': [str(ping_avg)],
                    'timestamp': [timestamp]
                }

                post_response = requests.post(api_url, json=data)
                if post_response.status_code != 200:
                    print(f"Failed to post new data for {website.get('name')}")
                print(f"Data sent to update database for {website['name']}")

        except Exception as e:
            print(f"Failed to process {website.get('name')}: {e}")

# while True:
#     externalping()
#     time.sleep(5)
#     print("Sleeping for next round...💤💤💤")
