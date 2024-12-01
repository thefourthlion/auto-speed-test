const moment = require('moment-timezone');
const puppeteer = require('puppeteer');
const axios = require("axios");
const os = require("os");

const getData = (callback) => {
    axios.get('http://localhost:4001/api/internalspeeds/read')
        .then(response => callback(null, response.data))
        .catch(error => callback(error));
}

const postData = (data) => {
    axios.post('http://localhost:4001/api/internalspeeds/create', data)
        .then(response => console.log("Created data"))
        .catch(error => console.log(error));
}

const updateData = (id, data) => {
    axios.post(`http://localhost:4001/api/internalspeeds/update/${id}`, data)
        .then(response => console.log("Updated data"))
        .catch(error => console.log(error));
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function runSpeedTest() {
    const browser = await puppeteer.launch({ 
        headless: false, 
        executablePath: '/usr/bin/chromium-browser', 
        args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'] 
    });

    const page = await browser.newPage();

    try {
        console.log('Navigating to URL...');
        await page.goto('http://10.49.48.151/', { timeout: 60000, waitUntil: 'networkidle2' });
        console.log('Page loaded successfully 📃');
        
        await delay(2000);
        await page.click('#startStopBtn');
        
        console.log('Waiting for speed test to run ⌚');
        await delay(24000);
        
        const download = await page.$eval('#dlText', el => el.textContent);
        const upload = await page.$eval('#ulText', el => el.textContent);
        const ping = await page.$eval('#pingText', el => el.textContent);

        const timestamp = moment().tz("America/Los_Angeles").format("MM-DD-YYYY HH:mm");
        const name = os.hostname();
        const ip = os.hostname();

        console.log(`Timestamp: ${timestamp}`);
        console.log(`Hostname: ${name}`);
        console.log(`IP Address: ${ip}`);
        console.log(`Download: ${download} Mbps`);
        console.log(`Upload: ${upload} Mbps`);
        console.log(`Ping: ${ping} ms`);

        const data = {
            timestamp,
            upload,
            download,
            ping,
            Ip: ip,
            name
        };

        getData((err, responseData) => {
            if (err) {
                console.error('Failed to get data:', err);
                return;
            }

            const existingEntry = responseData.find(entry => entry.Ip === ip);
            if (existingEntry) {
                const updatedData = {
                    download: [...existingEntry.download, download],
                    upload: [...existingEntry.upload, upload],
                    ping: [...existingEntry.ping, ping],
                    timestamp: [...existingEntry.timestamp, timestamp],
                };
                updateData(existingEntry._id, updatedData);
            } else {
                postData(data);
            }
        });

    } catch (error) {
        console.error('Error during navigation:', error);
    } finally {
        await browser.close();
    }
}

setInterval(runSpeedTest, 3600 * 1000); // 3600 seconds * 1000 milliseconds
runSpeedTest();
