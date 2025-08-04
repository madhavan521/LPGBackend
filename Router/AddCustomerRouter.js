const express= require("express");
const { create, getdata, getIndividual, update, deletedata } = require("../Controller/AddCustomerController");
const addcustomerrouter=express.Router()
const ProtectRouter = require('../Middleware/ProtectRouter')

addcustomerrouter.post('/create',ProtectRouter,create)
addcustomerrouter.get('/get',ProtectRouter,getdata)
addcustomerrouter.get('/get/:id' ,ProtectRouter,getIndividual)
addcustomerrouter.put('/update/:id',ProtectRouter ,update)
addcustomerrouter.delete('/delete/:id' ,ProtectRouter,deletedata)









module.exports = addcustomerrouter;