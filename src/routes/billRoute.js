const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");


router.get("/:bookingId", billController.generateBill);
router.get("/download/:bookingId", billController.downloadBill);


module.exports = router;
