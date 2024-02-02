const express = require("express");
const router = express.Router();
const {
  createSpeeds,
  readSpeeds,
  readSpeedsFromID,
  updateSpeeds,
  deleteSpeeds,
} = require("../controllers/Speeds");
router.route("/create").post(createSpeeds);
router.route("/read").get(readSpeeds);
router.route("/read/:id").get(readSpeedsFromID);
router.route("/update/:id").post(updateSpeeds);
router.route("/delete/:id").delete(deleteSpeeds);
module.exports = router;
