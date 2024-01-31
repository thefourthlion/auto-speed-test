const express = require("express");
const router = express.Router();
const { createInternalPingData, readInternalPingData, readInternalPingDataFromID, updateInternalPingData, deleteInternalPingData, } = require("../controllers/InternalPingData");
router.route("/create").post(createInternalPingData);
router.route("/read").get(readInternalPingData);
router.route("/read/:id").get(readInternalPingDataFromID);
router.route("/update/:id").post(updateInternalPingData);
router.route("/delete/:id").delete(deleteInternalPingData);
module.exports = router;