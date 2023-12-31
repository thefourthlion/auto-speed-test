const { FastAPI, SpeedUnits } = require('fast-api-speedtest');

const FastTest = new FastAPI({
    measureUpload: true,
    downloadUnit: SpeedUnits.MBps,
    timeout: 60000
});

FastTest.runTest().then(result => {
    console.log(`Ping: ${result.ping} ms`);
    console.log(`Download speed: ${result.downloadSpeed} ${result.downloadUnit}`);
    console.log(`Upload speed: ${result.uploadSpeed} ${result.uploadUnit}`);
}).catch(e => {
    console.error(e.message);
});