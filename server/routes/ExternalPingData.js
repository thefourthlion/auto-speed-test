const express = require("express");
const router = express.Router();
const { createExternalPingData, readExternalPingData, readExternalPingDataFromID, updateExternalPingData, deleteExternalPingData, } = require("../controllers/ExternalPingData");
router.route("/create").post(createExternalPingData);
router.route("/read").get(readExternalPingData);
router.route("/read/:id").get(readExternalPingDataFromID);
router.route("/update/:id").post(updateExternalPingData);
router.route("/delete/:id").delete(deleteExternalPingData);
module.exports = router;