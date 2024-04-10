// important linux install 
// sudo apt-get install chromium-browser

// important windows install 
// npx @puppeteer/browsers install chrome@stable
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');
const axios = require("axios");
const os = require("os");

const getData = (callback) => {
    axios.get('http://192.168.0.66:4001/api/speeds/read')
        .then(function (response) {
            callback(null, response.data);
        })
        .catch(function (error) {
            callback(error);
        });
}


const postData = (data) => {
    axios.post('http://192.168.0.66:4001/api/speeds/create', data)
        .then(function (response) {
            // console.log(response.data);
            console.log("Created data")
        })
        .catch(function (error) {
            console.log(error);
        })
}

const updateData = (id, data) => {
    axios.post(`http://192.168.0.66:4001/api/speeds/update/${id}`, data)
        .then(function (response) {
            // console.log(response.data);
            console.log("Updated data")
        })
        .catch(function (error) {
            console.log(error);
        })
}

const startCountdown = (seconds) => {
    let counter = seconds;
    console.clear();
    const intervalId = setInterval(() => {
        console.clear();
        console.log(`⏳: ${counter}sec...`);

        counter -= 1;
        if (counter < 0) {
            clearInterval(intervalId);
            console.log('Countdown finished!');
        }
    }, 1000);
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function runSpeedTest() {

    // { headless: false }
    const browser = await puppeteer.launch( /* { headless: false } */);
    // const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote'] });

    const page = await browser.newPage();

    await page.goto('https://fast.com/');

    console.log(`Waiting for download to run ⌚`)

    // speed test takes 14sec-30sec
    const downloadTime = 30000;
    // startCountdown(downloadTime / 1000);
    await delay(downloadTime);

    await page.click('#show-more-details-link');

    console.log(`Waiting for upload to run ⌚`)

    // speed test takes 16sec-32sec
    const uploadTime = 30000;
    // startCountdown(uploadTime / 1000);
    await delay(uploadTime);

    const download = await page.$eval('#speed-value', el => el.textContent);
    const upload = await page.$eval('#upload-value', el => el.textContent);
    const ping = await page.$eval('#bufferbloat-value', el => el.textContent);

    const timestamp = moment().tz("America/Los_Angeles").format("MM-DD-YYYY HH:mm");
    const currentHour = moment().tz("America/Los_Angeles").format("HH");


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
            const lastTimestampHour = moment.tz(existingEntry.timestamp[existingEntry.timestamp.length - 1], "MM-DD-YYYY HH:mm", "America/Los_Angeles").format("HH");

            // Compare the hours
            if (currentHour === lastTimestampHour) {
                console.log("Current hour matches the last entry's hour. Skipping update.");
                return; // Skip updating if hours match
            } else {
                const updatedData = {
                    download: [...existingEntry.download, download],
                    upload: [...existingEntry.upload, upload],
                    ping: [...existingEntry.ping, ping],
                    timestamp: [...existingEntry.timestamp, timestamp],
                };
                updateData(existingEntry._id, updatedData);
            }

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
