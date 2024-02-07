import asyncio
from pyppeteer import launch

async def run_test():
    browser = await launch()  # Launch the browser
    page = await browser.newPage()  # Open a new browser page
    await page.goto('http://10.49.48.151/')  # Navigate to the specified URL

    # Click the start/stop button to begin the test
    await page.click('#startStopBtn')

    # Wait for 25 seconds to let the test complete
    await asyncio.sleep(25)

    # Extract the download, upload, and ping values
    download = await page.querySelectorEval('#dlText', 'element => element.textContent')
    upload = await page.querySelectorEval('#ulText', 'element => element.textContent')
    ping = await page.querySelectorEval('#pingText', 'element => element.textContent')

    # Close the browser
    await browser.close()

    # Print the extracted values
    print(f'Download: {download} Mbps')
    print(f'Upload: {upload} Mbps')
    print(f'Ping: {ping} ms')

# Run the async function using asyncio's event loop
asyncio.get_event_loop().run_until_complete(run_test())
