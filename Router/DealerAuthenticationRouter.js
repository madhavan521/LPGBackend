const express = require("express")
const dealerauthrouter = express.Router()
const{ signup ,login ,logout, getMe, forget }= require("../Controller/DealerAuthenticationController")
const ProtectRouter = require("../Middleware/ProtectRouter")

dealerauthrouter.post('/signup', signup)
dealerauthrouter.post('/login', login)
dealerauthrouter.post('/logout', logout)
dealerauthrouter.get('/me',ProtectRouter , getMe)
dealerauthrouter.put('/forget' ,forget)

module.exports = dealerauthrouter
