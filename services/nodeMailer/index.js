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

const htmlEmail = `
    <div>
        <h2>Hey admin,</h2>
        <p>This is a weekly report on speed tests.</p>
    </div>
`;

const clientListURL = `http://127.0.0.1:3025/api/reportslist/read`;
const speedsURL = `http://127.0.0.1:3025/api/speeds/read`;

const twelveHours = 12;
const oneDay = 24;
const oneWeek = 168;
const oneMonth = 672;
const sixMonth = 4032;
const oneYear = 8760;

let avgDataHTML;
let clientCount;
let downClientCount;

const getSpeedsAvg = async (numPoints) => {
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


            avgDataHTML = `
            <div>
            <a style="color:black" href="http://10.49.48.150:3000/client?id=${client._id}">
                <h2>${avgData.name}</h2>
            </a>
    
            <p>This is the weekly avg download
                <span style="font-weight:bold ;">
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">
                        ${avgData.avgDownload} mbps
                    </a>
                </span>
            </p>
            <p>This is the weekly avg upload
                <span style="font-weight:bold;">
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">
                        ${avgData.avgUpload} mbps
                    </a>
                </span>
            </p>
            <p>This is the weekly avg ping
                <span style="font-weight:bold;">
                    <a style="color:black" href=" http://10.49.48.150:3000/speeds?id=${client._id}">
                        ${avgData.avgPing} ms
                    </a>
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
            // console.log(clientStatusHTML)


            downClientCount = clientStatusHTML.length



            return clientStatusHTML;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// console.log(checkForOfflineClients(twelveHours))

// console.log(getSpeedsAvg(twelveHours))


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

getReportsList()


const sendEmails = async () => {



    const avgDataHTMLArray = await getSpeedsAvg(twelveHours);

    const avgDataHTML = avgDataHTMLArray.join('');

    const outageArray = await checkForOfflineClients(twelveHours);
    const outageHTML = outageArray.join('');

    outageHeader = "<h1>Outages</h1><hr/>";
    overageHeader = "<h1>Clients Weekly Averages</h1><hr/>";

    let upCount = clientCount - downClientCount;
    let percentage = (upCount / clientCount) * 100;
    percentage = parseFloat(percentage.toFixed(2));

    console.log(`${typeof percentage}% of the network stayed up this week`)

    if (percentage > 60) {
        let percent = `<h2><span style="color:green;">${percentage}%</span> of the network stayed up this week.</h2>`
        const combinedHTML = percent + outageHeader + outageHTML + overageHeader + avgDataHTML;

    } else {
        let percent = `<h2><span style="color:red;">${percentage}%</span> of the network stayed up this week.</h2>`
        const combinedHTML = percent + outageHeader + outageHTML + overageHeader + avgDataHTML;
    }

    let b1 = `<body style="background:white; color:black; ">`
    let b2 = `</body>`

    let percent = `<h2><span style="color:green;">${percentage}%</span> of the network stayed up this week.</h2>`
    const combinedHTML = b1 + percent + outageHeader + outageHTML + overageHeader + avgDataHTML + b2;


    const clients = await getReportsList();
    clients.forEach(client => {
        const weeklyMailOptions = {
            from: process.env.HOST_EMAIL,
            to: client.email,
            subject: '🚀 SPEED TEST | Weekly Update',
            html: combinedHTML
        };

        const monthlyMailOptions = {
            from: process.env.HOST_EMAIL,
            to: client.email,
            subject: '🚀 SPEED TEST | Monthly Update',
            html: combinedHTML
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

// schedule.scheduleJob({hour: 9, minute: 0, dayOfWeek: 1}, function(){
console.log('Running weekly email job...');
sendEmails();
// });
