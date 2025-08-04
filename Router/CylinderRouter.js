const express = require("express");
const ProtectRouter = require("../Middleware/ProtectRouter");
const { postdealercylinderpurchase ,postdealerdelivery, postuserdelivery} = require("../Controller/CylinderController");
//  createdata, getdata, deletedata, updatedata, typegetdata,
const cylinderentryrouter = express.Router();

cylinderentryrouter.post('/create',ProtectRouter, postdealercylinderpurchase);
cylinderentryrouter.post('/delivery/create' ,ProtectRouter ,postdealerdelivery);
cylinderentryrouter.post('/user/delivery/create',ProtectRouter,postuserdelivery)
// cylinderentryrouter.get('/get',ProtectRouter, getdata);
// cylinderentryrouter.get('/get/type', typegetdata);
// cylinderentryrouter.put('/update/:id', ProtectRouter, updatedata);
// cylinderentryrouter.delete('/delete/:id', ProtectRouter, deletedata);

module.exports = cylinderentryrouter;
