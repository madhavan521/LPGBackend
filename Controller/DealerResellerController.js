const Reseller = require('../Schema/ResellerSchema');  
const Dealer = require('../Schema/DealerSchema');  

const resellerPush = async (req, res) => {  
    try {  
        const { username } = req.body;  
        const UserId = req.user._id;  

        console.log(UserId);  

        const resellerdata = await Reseller.findById(UserId);  
        console.log(resellerdata);  

        if (!resellerdata) {  
            return res.status(404).send("Invalid User");  
        }  

        const dealerdata = await Dealer.find({ username });  
        console.log(dealerdata);  

        if (dealerdata.length === 0) {  
            return res.status(404).send("Invalid Dealer");  
        }  

        dealerdata[0].Reseller.push(resellerdata);  
        await dealerdata[0].save();  
        
        resellerdata.MyDealer.push(dealerdata[0]._id);  
        await resellerdata.save(); 
        console.log(resellerdata);  
        res.status(201).send(resellerdata);  
    } catch (err) {  
        console.error(err);  
        return res.status(505).send(err.message);  
    }  
}

const individualdealer =async(req,res)=>{
    try{
        const {id}=req.params;
        const UserId = req.user._id;  
        const resellerdata = await Reseller.findById(UserId);  

        if (!resellerdata) {  
            return res.status(404).send("Invalid User");  
        }  
        const data = await Dealer.findById(id)
        return res.status(200).send(data)

    }
    catch(err){
        return res.status(505).send(err)
        console.error(err)
    }
}

const dealerdata = async(req,res)=>{
    try{
        const dealer = await Dealer.find()
        return res.status(200).send(dealer)

    }
    catch(err){
        console.error(err.message)
    }

}


module.exports = {resellerPush ,dealerdata ,individualdealer};