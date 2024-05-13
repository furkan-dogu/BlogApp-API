"use strict"

const express = require('express')
const app = express()
const cors = require("cors")

/* ------------------------------------------------------- */
//! Required Modules:

require("dotenv").config()
const PORT = process.env.PORT || 8000

app.use(cors())

require("express-async-errors")

/* ------------------------------------------------------- */
//! Configrations:

const { dbConnection } = require("./src/configs/dbConnection")
dbConnection()

/* ------------------------------------------------------- */
//! Middlewares:

app.use(express.json())

app.use(require('./src/middlewares/authentication'))

app.use(require('./src/middlewares/queryHandler'))

app.use(require("./src/middlewares/requestIp"))

/* ------------------------------------------------------- */
//! Routes:

app.use("/", require("./src/routes"))

app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to BLOG APP API',
        docs: {
            swagger: "/documents/swagger",
            redoc: "/documents/redoc",
            json: "/documents/json",
        },
        user: req.user,
    })
})

/* ------------------------------------------------------- */
//! errorHandler:

app.use(require('./src/middlewares/errorHandler'))

/* ------------------------------------------------------- */
//! RUN SERVER:

app.listen(PORT, () => console.log('http://127.0.0.1:' + PORT))

/* ------------------------------------------------------- */
//! Syncronization 

// require('./src/helpers/sync')() // !!! Bütün dataları siler