const moment = require('moment-timezone');
const axios = require("axios");
const cron = require('node-cron');

console.log("🟢🟢🟢🟢🟢")

const getData = () => {
    axios.get('http://10.49.48.150:3025/api/speeds/read')
        .then(function (response) {
            const speedsData = response.data;
            const currentTimestamp = moment().tz("America/Los_Angeles").format("MM-DD-YYYY HH:mm");
            const currentHour = moment().tz("America/Los_Angeles").format("HH");

            speedsData.forEach(item => {
                const ip = item.Ip;
                const id = item._id;
                const lastTimestamp = item.timestamp[item.timestamp.length - 1];
                const lastHour = lastTimestamp.split(" ")[1].split(":")[0];

                // Determine if the client needs an update
                if (!(parseInt(currentHour) == parseInt(lastHour))) {

                    if (!(ip == "test-pc" || ip == "grv-raboul-psu")) {
                        console.log(`Client ${ip} needs an update.`);
                        // Prepare the data to be appended
                        const updatedData = {
                            download: [...item.download, "0"], // Replace "0" with actual new data
                            upload: [...item.upload, "0"], // Replace "0" with actual new data
                            ping: [...item.ping, "0"], // Replace "0" with actual new data
                            timestamp: [...item.timestamp, currentTimestamp], // Append the new timestamp
                        };

                        // Call updateData to update the client with appended data
                        console.log(
                            {
                                "id": id,
                                "UpdatedData": updatedData
                            })
                        updateData(id, updatedData);
                    }
                    console.log(`Client ${ip} is up to date.`);
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

const updateData = (id, data) => {
    axios.post(`http://10.49.48.150:3025/api/speeds/update/${id}`, data)
        .then(function (response) {
            console.log(`Updated data for ID: ${id}`);
        })
        .catch(function (error) {
            console.log(error);
        });
};

getData();

// Schedule getData to run at the 59th minute of every hour
cron.schedule('59 * * * *', () => {
    console.log('Running getData at the 59th minute of the hour');
    getData();
});