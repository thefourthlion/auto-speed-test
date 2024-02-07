from datetime import datetime
import pytz

# Set the timezone to US/Pacific, which represents Pacific Time
pst = pytz.timezone('US/Pacific')

# Get the current time in UTC and then convert it to PST
utc_now = datetime.now(pytz.utc)
pst_now = utc_now.astimezone(pst)

print("Current time in PST:", pst_now.strftime('%Y-%m-%d %H:%M:%S'))
