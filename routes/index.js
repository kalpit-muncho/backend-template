const express = require("express");
const router = express.Router();

const reviewRouter = require("./review");
const giftCardRouter = require("./giftcard");

router.use("/review", reviewRouter);
router.use("/giftcard", giftCardRouter);

module.exports = router;
