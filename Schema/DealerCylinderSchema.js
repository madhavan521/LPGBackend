const mongoose = require("mongoose")

const dealercylinderschema = mongoose.Schema({
    DealerCylinder5kg: [
        {
          fullCylinder: { type: Number, required: true },
          emptyCylinder: { type: Number, required: true }
        }
      ],
      DealerCylinder14kg: [
        {
          fullCylinder: { type: Number, required: true },
          emptyCylinder: { type: Number, required: true }
        }
      ],
      DealerCylinder17kg: [
        {
          fullCylinder: { type: Number, required: true },
          emptyCylinder: { type: Number, required: true }
        }
      ],
      DealerCylinder19kg: [
        {
          fullCylinder: { type: Number, required: true },
          emptyCylinder: { type: Number, required: true }
        }
      ],
      DealerCylinder21kg: [
        {
          fullCylinder: { type: Number, required: true },
          emptyCylinder: { type: Number, required: true }
        }
      ],
      DealerCylinder45kg: [
        {
          fullCylinder: { type: Number, required: true },
          emptyCylinder: { type: Number, required: true }
        }
      ]
});
const purchasedealercylinderschema = mongoose.Schema({
    purchasecylinderType:{
        type:String,
        required:true

    },
    purchasefullCylinder:{
        type:String
    },
    purchaseemptyCylinder:{
        type:String
    },
    purchaseDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-IN') 
  },
  purchaseTime: {
      type: String,
      default: () => new Date().toLocaleTimeString('en-IN', { hour12: true, timeZone: 'Asia/Kolkata' })
  }
})
const deliverydealercylinderschema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    dealerdeliverycylinderType:{
        type:String,
        required:true

    },
    dealerdeliveryfullCylinder:{
        type:String
    },
    dealerdeliveryemptyCylinder:{
        type:String
    }

})


const DealerDelivery = mongoose.model("DealerDelivery" , deliverydealercylinderschema)
const DealerCylinder = mongoose.model("DealerCylinder" , dealercylinderschema)
const PurchaseDealerCylinder = mongoose.model("PurchaseDealerCylinder" ,purchasedealercylinderschema)
module.exports = {DealerCylinder,PurchaseDealerCylinder,DealerDelivery}