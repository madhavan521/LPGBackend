const mongoose = require("mongoose")

const addCustomerSchema = mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    customerPhoneNo:{
        type:String,
        required:true
    },
    customerLocation:{
        type:String,
        required:true
    },
    customerAddress:{
        type:String,
        required:true
    },
    shopName:{
        type:String,
        required:true
    }
})



const AddCustomer = mongoose.model("AddCustomer" ,addCustomerSchema)

module.exports = AddCustomer