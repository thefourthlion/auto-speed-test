const mongoose = require("mongoose");
const InternalPingSchema = new mongoose.Schema(
    {
        link: { type: String, required: [true, "Please provide link"] },
        name: { type: String, required: [true, "Please provide name"] },
        timestamp: { type: String, required: [true, "Please provide timestamp"] },
    },
    { timestamps: true }
);
const InternalPing = mongoose.model("InternalPing", InternalPingSchema);
module.exports = InternalPing;
