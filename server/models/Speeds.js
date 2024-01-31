const mongoose = require("mongoose");
const SpeedsSchema = new mongoose.Schema({
  Ip: { type: String, required: [true, "Please provide Ip"] },
  name: { type: String },
  download: { type: [String], required: [true, "Please provide download"] },
  upload: { type: [String], required: [true, "Please provide upload"] },
  ping: { type: [String], required: [true, "Please provide ping"] },
  timestamp: { type: [String], required: [true, "Please provide timestamp"] },
}, { timestamps: true });
const Speeds = mongoose.model("Speeds", SpeedsSchema);
module.exports = Speeds;