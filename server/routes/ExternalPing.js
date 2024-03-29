const express = require("express");
const router = express.Router();
const {
    createExternalPing,
    readExternalPing,
    readExternalPingFromID,
    updateExternalPing,
    deleteExternalPing,
} = require("../controllers/ExternalPing");
router.route("/create").post(createExternalPing);
router.route("/read").get(readExternalPing);
router.route("/read/:id").get(readExternalPingFromID);
router.route("/update/:id").post(updateExternalPing);
router.route("/delete/:id").delete(deleteExternalPing);
module.exports = router;
