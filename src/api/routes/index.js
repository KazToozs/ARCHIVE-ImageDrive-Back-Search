const express = require('express');
const controller = require("../controllers/controller");
const router = express.Router();

router.route("/search").get(controller.search);

module.exports = router;
