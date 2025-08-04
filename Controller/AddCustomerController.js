const  AddCustomer =require('../Schema/AddCustomerSchema')
const Reseller =require('../Schema/ResellerSchema')


const create=async(req,res)=>{

    const {customerName,customerLocation,customerAddress,customerPhoneNo,shopName} =req.body

    try{
         const UserId = req.user._id
         const resellerdata = await Reseller.findById(UserId)
         if(!resellerdata)
         {
            return res.status(404).send("Invalid reseller")
         }

            const createdata = new AddCustomer({ customerName, customerLocation, customerAddress, customerPhoneNo, shopName });  
            await createdata.save();  
            resellerdata.Userdata.push(createdata);  
            await resellerdata.save(); 

        res.status(201).send(createdata); 

    }
    catch(err){
        res.status(500).send(err)
    }
}

const getdata=async(req,res)=>{
    try{ 
        const getdata = await AddCustomer.find()
        if(!getdata){
            return res.status(404).send("Data Not Avaliable")
        }
        return res.status(200).send(getdata)

    }
    catch(err){
        res.status(500).send(err)
    }
}

const getIndividual=async(req,res)=>{
    try{
        const {id} = req.params
        const getById = await AddCustomer.findById(id)
        if(!getById){
            return res.status(404).send("Data Not Avaliable")
        }
        return res.status(200).send(getById)
        
    }
    catch(err){
        res.status(500).send(err)
    }
}

const update=async(req,res)=>{
    try{ const {id}=req.params
        const update = req.body;
        const updatedata = await AddCustomer.findByIdAndUpdate(id,update,{
            new:"true" , runValidators:"true"
        })
        if(!updatedata){
            return res.status(404).send("Data Not Avaliable")
        }
        return res.status(200).send(updatedata)

    }
    catch(err){
        res.status(500).send(err)
    }
}
const deletedata=async(req,res)=>{
    try{
        const {id}=req.params;
        const deletedata = await AddCustomer.findByIdAndDelete(id)
        return res.status(200).send("Data Deleted Successfully")

    }
    catch(err){
        res.status(500).send(err)
    }
}

module.exports = {create ,getdata,getIndividual,update,deletedata}