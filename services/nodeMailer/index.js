const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const axios = require("axios");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const clientListURL = `http://192.168.0.66:4001/api/reportslist/read`;
const speedsURL = `http://192.168.0.66:4001/api/speeds/read`;

const oneWeek = 168;
const oneMonth = 672;

let avgDataHTML;
let clientCount;
let downClientCount;

const getSpeedsAvg = async (numPoints, skipPoints, timescale) => {
    try {
        const response = await axios.get(speedsURL);
        const clients = response.data;

        return clients.map(client => {
            const calcAvg = (data) => {
                const validData = data.slice(-numPoints).filter(value => parseFloat(value) > 0);
                const sum = validData.reduce((acc, value) => acc + parseFloat(value), 0);
                return validData.length > 0 ? (sum / validData.length).toFixed(2) : "0";
            };

            const avgData = {
                name: client.Ip,
                avgUpload: calcAvg(client.upload),
                avgDownload: calcAvg(client.download),
                avgPing: calcAvg(client.ping),
            };

            const calcOldAvg = (data, skipPoints) => {
                // Adjust the starting point based on skipPoints
                const startPoint = data.length - skipPoints - numPoints;
                const validData = data.slice(startPoint, startPoint + numPoints).filter(value => parseFloat(value) > 0);
                const sum = validData.reduce((acc, value) => acc + parseFloat(value), 0);
                return validData.length > 0 ? (sum / validData.length).toFixed(2) : "0";
            };

            const avgOldData = {
                name: client.Ip,
                avgUpload: calcOldAvg(client.upload, skipPoints),
                avgDownload: calcOldAvg(client.download, skipPoints),
                avgPing: calcOldAvg(client.ping, skipPoints),
            };

            avgDataHTML = `
        <div>
            <a style="color:black" href="http://10.49.48.150:3000/client?id=${client._id}">
                <h2>${avgData.name}</h2>
            </a>
    
            <p>${timescale}ly avg download
                <span style="font-weight:bold ;">
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">
                        ${avgData.avgDownload} mbps
                    </a>
                    / Last ${timescale}
                    <a style="color:black"
                        href=" http://10.49.48.150:3000/speeds?id=${client._id}">${avgOldData.avgDownload} mbps</a>
                </span>
            </p>
            <p>${timescale}ly avg upload
                <span style="font-weight:bold;">
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">
                        ${avgData.avgUpload} mbps
                    </a>
                    / Last ${timescale}
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">${avgOldData.avgUpload} mbps</a>
                </span>
            </p>
            <p>${timescale}ly avg ping
                <span style="font-weight:bold;">
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">
                        ${avgData.avgPing} ms
                    </a>
                    / Last ${timescale}
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">${avgOldData.avgPing} ms</a>
                </span>
            </p>
        </div>
            `;

            // console.log(avgDataHTML);
            return avgDataHTML;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const checkForOfflineClients = async (numPoints) => {
    try {
        const response = await axios.get(speedsURL); // Make sure speedsURL is correctly defined
        const clients = response.data;
        clientCount = clients.length;
        return clients.map(client => {
            // Function to check for "0" values in the data arrays
            const hasZeroValue = (data) => data.slice(-numPoints).some(value => parseFloat(value) === 0);

            // Construct the HTML message based on the presence of "0" values
            let clientStatusHTML = [];
            if (hasZeroValue(client.upload) || hasZeroValue(client.download) || hasZeroValue(client.ping)) {
                clientStatusHTML.push(
                    `
                    <div>
                        <h2>
                            <a style="color:black" href="http://10.49.48.150:3000/client?id=${client._id}">${client.Ip} </a>
                            went
                            <span style="color:red;"> offline </span>
                        </h2>
                    </div>
                    `);
            } else {
                return
            }
            downClientCount = clientStatusHTML.length
            return clientStatusHTML;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const getReportsList = async () => {
    try {
        const response = await axios.get(clientListURL);
        // console.log('Data fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const sendWeeklyEmail = async () => {
    outageHeader = "<h1>Outages</h1><hr/>";
    averageWeeklyHeader = "<h1>Clients Weekly Averages</h1><hr/>";

    // this weeks avg
    const avgWeeklyHTMLArray = await getSpeedsAvg(oneWeek, oneWeek, "Week");
    const avgWeeklyDataHTML = avgWeeklyHTMLArray.join('');

    // this weeks outages
    const weeklyOutageArray = await checkForOfflineClients(oneWeek);
    const weeklyOutageHTML = weeklyOutageArray.join('');

    // calc percentage of outage
    let upCount = clientCount - downClientCount;
    let percentage = (upCount / clientCount) * 100;
    percentage = parseFloat(percentage.toFixed(2));

    // weekly
    let weeklyPercent = `<h2><span style="color:green;">${percentage}%</span> of the network stayed up this week.</h2>`
    const weeklyCombinedHTML = weeklyPercent + outageHeader + weeklyOutageHTML + averageWeeklyHeader + avgWeeklyDataHTML;

    const clients = await getReportsList();
    clients.forEach(client => {
        const weeklyMailOptions = {
            from: process.env.HOST_EMAIL,
            to: client.email,
            subject: '🚀 SPEED TEST | Weekly Update',
            html: weeklyCombinedHTML
        };

        transporter.sendMail(weeklyMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
};

const sendMonthlyEmail = async () => {
    outageHeader = "<h1>Outages</h1><hr/>";
    averageMonthlyHeader = "<h1>Clients Monthly Averages</h1><hr/>";

    // this months avg
    const avgMonthlyHTMLArray = await getSpeedsAvg(oneMonth, oneMonth, "Month");
    const avgMonthlyDataHTML = avgMonthlyHTMLArray.join('');

    // this months outages
    const monthlyOutageArray = await checkForOfflineClients(oneMonth);
    const monthlyOutageHTML = monthlyOutageArray.join('');

    // calc percentage of outage
    let upCount = clientCount - downClientCount;
    let percentage = (upCount / clientCount) * 100;
    percentage = parseFloat(percentage.toFixed(2));

    // monthly
    let monthlyPercent = `<h2><span style="color:green;">${percentage}%</span> of the network stayed up this month.</h2>`
    const monthlyCombinedHTML = monthlyPercent + outageHeader + monthlyOutageHTML + averageMonthlyHeader + avgMonthlyDataHTML;

    const clients = await getReportsList();
    clients.forEach(client => {
        const monthlyMailOptions = {
            from: process.env.HOST_EMAIL,
            to: client.email,
            subject: '🚀 SPEED TEST | Monthly Update',
            html: monthlyCombinedHTML
        };

        transporter.sendMail(monthlyMailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
};

console.log("✉ Email service is running")

schedule.scheduleJob({ hour: 9, minute: 0, dayOfWeek: 1 }, function () {
    console.log('Running weekly email job...');
    sendWeeklyEmail();
});

schedule.scheduleJob({ hour: 9, minute: 0, dayOfMonth: 1 }, function () {
    console.log('Running monthly email job...');
    sendMonthlyEmail();
});

// testing
// sendWeeklyEmail();
