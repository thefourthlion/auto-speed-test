// important linux install 
// sudo apt-get install chromium-browser

// important windows install 
// npx @puppeteer/browsers install chrome@stable
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');
const axios = require("axios");
const os = require("os");

const getData = (callback) => {
    axios.get('http://10.49.48.150:3025/api/internalspeeds/read')
        .then(function (response) {
            callback(null, response.data);
        })
        .catch(function (error) {
            callback(error);
        });
}


const postData = (data) => {
    axios.post('http://10.49.48.150:3025/api/internalspeeds/create', data)
        .then(function (response) {
            // console.log(response.data);
            console.log("Created data")
        })
        .catch(function (error) {
            console.log(error);
        })
}

const updateData = (id, data) => {
    axios.post(`http://10.49.48.150:3025/api/internalspeeds/update/${id}`, data)
        .then(function (response) {
            // console.log(response.data);
            console.log("Updated data")
        })
        .catch(function (error) {
            console.log(error);
        })
}


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function runSpeedTest() {

    // { headless: false }
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'] });

    const page = await browser.newPage();

    await page.goto('http://10.49.48.151/');

    console.log(`Waiting for page to load 📃`)
    await delay(2000);

    await page.click('#startStopBtn');

    console.log(`Waiting for speed test to run ⌚`)
    await delay(24000);

    const download = await page.$eval('#dlText', el => el.textContent);
    const upload = await page.$eval('#ulText', el => el.textContent);
    const ping = await page.$eval('#pingText', el => el.textContent);

    const timestamp = moment().tz("America/Los_Angeles").format("MM-DD-YYYY HH:mm");

    const name = os.hostname();
    let ip = os.hostname();

    console.log(`Timestamp: ${timestamp}`);
    console.log(`Hostname: ${name}`);
    console.log(`IP Address: ${ip}`);
    console.log(`Download: ${download} Mbps`);
    console.log(`Upload: ${upload} Mbps`);
    console.log(`Ping: ${ping} ms`);

    const data = {
        "timestamp": timestamp,
        "upload": upload,
        "download": download,
        "ping": ping,
        "Ip": ip,
        "name": name
    };

    // Process data
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

    await browser.close();
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

setInterval(runSpeedTest, 3600000);
// one hour - 3600000

runSpeedTest();
