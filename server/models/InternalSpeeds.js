const mongoose = require("mongoose");
const InternalSpeedsSchema = new mongoose.Schema(
    {
        Ip: { type: String, required: [true, "Please provide Ip"] },
        name: { type: String, required: [true, "Please provide name"] },
        download: { type: String, required: [true, "Please provide download"] },
        upload: { type: String, required: [true, "Please provide upload"] },
        ping: { type: String, required: [true, "Please provide ping"] },
        group: { type: String, required: [true, "Please provide group"] },
        package: { type: String, required: [true, "Please provide package"] },
        timestamp: { type: String, required: [true, "Please provide timestamp"] },
    },
    { timestamps: true }
);
const InternalSpeeds = mongoose.model("InternalSpeeds", InternalSpeedsSchema);
module.exports = InternalSpeeds;
