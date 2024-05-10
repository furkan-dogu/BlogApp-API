"use strict"

const User = require("../models/user")
const Token = require("../models/token")
const passwordEncrypt = require("../helpers/passwordEncrypt")

module.exports = {

    login: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = "Login with email and password"
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "email": "test@test.com",
                    "password": "test",
                }
            }
        */

        const { email, password } = req.body

        if (email && password) {
            const user = await User.findOne({ email, password })
            if (user && user.isActive) {

                //* Token var mı?
                let tokenData = await Token.findOne({ userId: user._id })

                //* Eğer token yoksa oluştur:
                if(!tokenData) {
                    const tokenKey = passwordEncrypt(user._id + Date.now())
                    tokenData = await Token.create({ userId: user._id, token: tokenKey })
                } 

                res.status(200).send({
                    error: false,
                    token: tokenData.token,
                    user
                })

            } else {
                res.errorStatusCode = 401
                throw new Error('Wrong Email or Password.')
            }
        } else {
            res.errorStatusCode = 401
            throw new Error('Please entry email and password.')
        }
    },

    logout: async (req, res) => {
        /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Logout"
        */

        const auth = req.headers?.authorization || null 
        const tokenKey = auth ? auth.split(" ") : null 
        const result = await Token.deleteOne({ token: tokenKey[1] })

        res.status(200).send({
            error: false,
            message: 'Logout: Token Deleted.',
            result
        })
    },

}