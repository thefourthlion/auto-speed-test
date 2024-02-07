const mongoose = require("mongoose");
const InternalSpeedsSchema = new mongoose.Schema(
    {
        Ip: { type: String, required: [true, "Please provide Ip"] },
        name: { type: String },
        download: { type: [String], required: [true, "Please provide download"] },
        upload: { type: [String], required: [true, "Please provide upload"] },
        ping: { type: [String], required: [true, "Please provide ping"] },
        group: { type: String },
        package: { type: [String] },
        timestamp: { type: [String], required: [true, "Please provide timestamp"] },
      },
      { timestamps: true }
);
const InternalSpeeds = mongoose.model("InternalSpeeds", InternalSpeedsSchema);
module.exports = InternalSpeeds;
