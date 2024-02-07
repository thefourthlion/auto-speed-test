import asyncio
from pyppeteer import launch


async def navigate_click_and_fetch(url, button_selector, selectors):
    # Launch the browser
    # Set headless=False to see the browser
    browser = await launch(headless=False)
    # Open a new page
    page = await browser.newPage()
    # Navigate to the URL
    await page.goto(url)
    # Wait for the button to be loaded
    await page.waitForSelector(button_selector)
    # Click the button
    await page.click(button_selector)
    # Wait for 35 seconds
    await asyncio.sleep(35)

    # Fetch and store the desired information
    results = {}
    for key, selector in selectors.items():
        # Check if the element exists
        element_exists = await page.querySelector(selector)
        if element_exists:
            # Depending on what you want from the element, adjust the following:
            # For text, use: results[key] = await page.evaluate('(element) => element.textContent', element_exists)
            # For an attribute value, replace 'attributeName' with the actual attribute name:
            # results[key] = await page.evaluate('(element) => element.getAttribute("attributeName")', element_exists)
            results[key] = await page.evaluate('(element) => element.textContent', element_exists)
        else:
            results[key] = 'Element not found'

    print(results)
    # Close the browser
    await browser.close()

# Usage example
url = 'http://192.168.0.66:3333/'
button_selector = '#startButtonDesk'
selectors = {
    'download': '#UI-Desk > use:nth-child(23)',
    'upload': '#UI-Desk > use:nth-child(24)',
    'ping': '#UI-Desk > use:nth-child(25)'
}

asyncio.get_event_loop().run_until_complete(
    navigate_click_and_fetch(url, button_selector, selectors))
