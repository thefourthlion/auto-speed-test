const mongoose = require("mongoose");
const PackagesSchema = new mongoose.Schema(
    {
        download: { type: String, required: [true, "Please provide download"] },
        upload: { type: String, required: [true, "Please provide upload"] },
    },
    { timestamps: true }
);
const Packages = mongoose.model("Packages", PackagesSchema);
module.exports = Packages;
