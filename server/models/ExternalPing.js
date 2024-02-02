const mongoose = require("mongoose");
const ExternalPingSchema = new mongoose.Schema(
    {
        link: { type: String, required: [true, "Please provide link"] },
        name: { type: String, required: [true, "Please provide name"] },
        timestamp: { type: String, required: [true, "Please provide timestamp"] },
    },
    { timestamps: true }
);
const ExternalPing = mongoose.model("ExternalPing", ExternalPingSchema);
module.exports = ExternalPing;
