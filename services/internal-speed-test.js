// very important
// npx @puppeteer/browsers install chrome@stable

const puppeteer = require('puppeteer');
const axios = require("axios")

(async () => {
    // Launch a new browser instance

    const browser = await puppeteer.launch({headless: false});

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto('http://10.49.48.151/');

    console.log(`Waiting for page to load 📃`)
    await page.waitForTimeout(3000);

    // Click the start/stop button to begin the test
    await page.click('#startStopBtn');

    // Wait for 25 seconds to let the test complete
    console.log(`Waiting for speed test to run ⌚`)
    await page.waitForTimeout(25000);

    // Extract the download, upload, and ping values
    const download = await page.$eval('#dlText', el => el.textContent);
    const upload = await page.$eval('#ulText', el => el.textContent);
    const ping = await page.$eval('#pingText', el => el.textContent);

    // Print the extracted values
    console.log(`Download: ${download} Mbps`);
    console.log(`Upload: ${upload} Mbps`);
    console.log(`Ping: ${ping} ms`);

    // Close the browser
    await browser.close();
})();
