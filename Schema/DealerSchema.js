const mongoose = require("mongoose");
const dealerSchema = mongoose.Schema({  
    username: {  
        type: String,  
        required: "true"  
    },  
    fullname: {  
        type: String,  
        required: "true"  
    },  
    email: {  
        type: String,  
        required: "true"  
    },  
    password: {  
        type: String,  
        required: "true"  
    },  
    Profile:[{
        type:Object,
        default:[]
         }],
    Reseller:[{
        type:Object,
        default:[]
    }],
    TotalCylinder:[
        {
            type:Object,
            default:[]
        }
    ],
    PurchaseCylinder:[
        {
            type:Object,
            default:[]
        }
    ],
    CylinderDelivery:[
        {
            type:Object,
            default:[]
        }
    ],
   
});

const Dealer = mongoose.model("Dealer" , dealerSchema)

module.exports = Dealer;

