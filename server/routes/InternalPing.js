const express = require("express");
const router = express.Router();
const {
    createInternalPing,
    readInternalPing,
    readInternalPingFromID,
    updateInternalPing,
    deleteInternalPing,
} = require("../controllers/InternalPing");
router.route("/create").post(createInternalPing);
router.route("/read").get(readInternalPing);
router.route("/read/:id").get(readInternalPingFromID);
router.route("/update/:id").post(updateInternalPing);
router.route("/delete/:id").delete(deleteInternalPing);
module.exports = router;
