const express = require("express");
const router = express.Router();
const {
    createGroups,
    readGroups,
    readGroupsFromID,
    updateGroups,
    deleteGroups,
} = require("../controllers/Groups");
router.route("/create").post(createGroups);
router.route("/read").get(readGroups);
router.route("/read/:id").get(readGroupsFromID);
router.route("/update/:id").post(updateGroups);
router.route("/delete/:id").delete(deleteGroups);
module.exports = router;
