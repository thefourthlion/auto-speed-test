const mongoose = require("mongoose");
const ExternalPingDataSchema = new mongoose.Schema(
    {
        hostname: { type: String, required: [true, "Please provide hostname"] },
        link: { type: String, required: [true, "Please provide link"] },
        ping: { type: [String], required: [true, "Please provide ping"] },
        timestamp: { type: [String], required: [true, "Please provide timestamp"] },
    },
    { timestamps: true }
);
const ExternalPingData = mongoose.model(
    "ExternalPingData",
    ExternalPingDataSchema
);
module.exports = ExternalPingData;
