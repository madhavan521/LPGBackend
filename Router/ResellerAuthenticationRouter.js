const express = require("express")
const resellerauthrouter = express.Router()
const{ signup ,login ,logout, getMe ,forget }= require("../Controller/ResellerAuthenticationController")
const ProtectRouter = require("../Middleware/ProtectRouter")
resellerauthrouter.post('/signup', signup)
resellerauthrouter.post('/login', login)
resellerauthrouter.post('/logout', logout)
resellerauthrouter.get('/me',ProtectRouter , getMe)
resellerauthrouter.put('/forget' ,forget)

module.exports = resellerauthrouter
