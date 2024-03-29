const mongoose = require("mongoose");
const InternalPingDataSchema = new mongoose.Schema(
    {
        link: { type: String, required: [true, "Please provide link"] },
        ping: { type: String, required: [true, "Please provide ping"] },
        timestamp: { type: String, required: [true, "Please provide timestamp"] },
    },
    { timestamps: true }
);
const InternalPingData = mongoose.model(
    "InternalPingData",
    InternalPingDataSchema
);
module.exports = InternalPingData;
