const express = require("express")
const ProtectRouter = require("../Middleware/ProtectRouter")
const { add, get, update } = require("../Controller/ProfileController")
const profilerouter =express.Router()
const multer = require('multer');  
const upload = multer({ storage: multer.memoryStorage() });  

profilerouter.post('/add', ProtectRouter, upload.fields([  
    { name: 'profilePhotoCompany', maxCount: 1 },   
    { name: 'profilePhotoPerson', maxCount: 1 }  
  ]), add); 
profilerouter.get('/get', ProtectRouter,get)
profilerouter.put('/update/:id', ProtectRouter,update)
// profilerouter.post('/getotp',ProtectRouter,getotp )
// profilerouter.post('/verifyotp',ProtectRouter,otpverify )


module.exports = profilerouter;