const express = require("express");
const router = express.Router();
const {
    createPackages,
    readPackages,
    readPackagesFromID,
    updatePackages,
    deletePackages,
} = require("../controllers/Packages");
router.route("/create").post(createPackages);
router.route("/read").get(readPackages);
router.route("/read/:id").get(readPackagesFromID);
router.route("/update/:id").post(updatePackages);
router.route("/delete/:id").delete(deletePackages);
module.exports = router;
