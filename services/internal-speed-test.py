from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import time

# Configure Selenium to use Chrome in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")
s = Service('/path/to/chromedriver')  # Update this path
driver = webdriver.Chrome(service=s, options=chrome_options)

try:
    # Open OpenSpeedTest in the browser
    driver.get("http://localhost:3000")

    # Start the speed test - adjust the selector as necessary
    start_button = driver.find_element(By.ID, "startButton")  # Update this selector
    start_button.click()

    # Wait for the test to complete; time depends on your setup
    time.sleep(60)  # Adjust this wait time as necessary

    # Scrape the results - adjust the selectors as necessary
    download_speed = driver.find_element(By.ID, "downloadSpeed").text  # Update this selector
    upload_speed = driver.find_element(By.ID, "uploadSpeed").text  # Update this selector
    ping = driver.find_element(By.ID, "ping").text  # Update this selector

    print(f"Download Speed: {download_speed}")
    print(f"Upload Speed: {upload_speed}")
    print(f"Ping: {ping}")

finally:
    driver.quit()
