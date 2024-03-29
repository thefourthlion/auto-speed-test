const mongoose = require("mongoose");
const GroupsSchema = new mongoose.Schema(
    { name: { type: String, required: [true, "Please provide name"] } },
    { timestamps: true }
);
const Groups = mongoose.model("Groups", GroupsSchema);
module.exports = Groups;
