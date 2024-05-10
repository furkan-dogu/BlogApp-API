"use strict";

const router = require("express").Router()

router.use('/documents', require('./document'))

router.use("/users", require("./user"))

module.exports = router