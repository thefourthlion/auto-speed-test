const express = require("express");
const router = express.Router();
const {
    createInternalSpeeds,
    readInternalSpeeds,
    readInternalSpeedsFromID,
    updateInternalSpeeds,
    deleteInternalSpeeds,
} = require("../controllers/InternalSpeeds");
router.route("/create").post(createInternalSpeeds);
router.route("/read").get(readInternalSpeeds);
router.route("/read/:id").get(readInternalSpeedsFromID);
router.route("/update/:id").post(updateInternalSpeeds);
router.route("/delete/:id").delete(deleteInternalSpeeds);
module.exports = router;
