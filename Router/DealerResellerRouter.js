const express = require("express")
const ProtectRouter = require("../Middleware/ProtectRouter")
const {resellerPush , dealerdata, individualdealer} = require("../Controller/DealerResellerController")
const dealerresellerrouter =express.Router()


dealerresellerrouter.post('/create',ProtectRouter,resellerPush)
dealerresellerrouter.get('/get' ,ProtectRouter , dealerdata)
dealerresellerrouter.get('/get/:id' ,ProtectRouter,individualdealer)


module.exports = dealerresellerrouter