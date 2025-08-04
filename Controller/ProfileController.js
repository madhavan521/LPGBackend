const Dealer = require("../Schema/DealerSchema")
const Profile = require('../Schema/ProfileSchema')
const Reseller = require('../Schema/ResellerSchema')
const add = async (req, res) => {  
  const {   
    companyName,   
    companyAddress,   
    companyGSTNumber,   
    phoneNumber1,   
    phoneNumber2,   
    personAddress   
  } = req.body;  

  // Validate required fields  
  if (!companyName || !companyAddress || !companyGSTNumber || !phoneNumber1 || !personAddress) {  
    return res.status(400).send("Missing required fields.");  
  }  

  try {  
    const UserId = req.user._id;  
    const user = await Dealer.findById(UserId) || await Reseller.findById(UserId);  

    if (!user) {  
      return res.status(404).send("User not found.");  
    }  

    const profileData = new Profile({  
      companyName,  
      companyAddress,  
      companyGSTNumber,  
      phoneNumber1,  
      phoneNumber2,  
      personAddress,  
      profilePhotoCompany: req.file ? {  
        data: req.file.buffer,  
        contentType: req.file.mimetype  
      } : undefined,  
      profilePhotoPerson: req.files?.person?.[0] ? {  
        data: req.files.person[0].buffer,  
        contentType: req.files.person[0].mimetype  
      } : undefined  
    });  

    await profileData.save();  

    if (!user.Profile) {  
      user.Profile = [];  
    }  

    user.Profile.push(profileData);  
    await user.save();  

    return res.status(201).send(user);  
  } catch (err) {  
    console.error(err);  
    return res.status(500).send("Internal Server Error: " + err.message);  
  }  
};  
const get = async(req,res)=>{
    try{
     const user = await Profile.find()
   
     return res.status(201).send(user)
 
    }
    catch(err){
     return res.status(500).send("Internal Server Error")
    }
    
}

const update = async (req, res) => {  
  const { id } = req.params;  
  const updatedata = req.body;  

  try {  
    const UserId = req.user._id;  
    const user = await Dealer.findById(UserId) || await Reseller.findById(UserId);  
    
    if (!user) {  
      return res.status(404).send("User not found");  
    }  
    
    const updatedProfile = await Profile.findByIdAndUpdate(id, updatedata, {  
      new: true,   
      runValidators: true 
    });  
    
    if (!updatedProfile) {  
      return res.status(404).send("Profile not found");  
    }  

    const profileId = user.Profile[0];   
    
    if (profileId) {  
      user.Profile[0] = updatedProfile;   
      await user.save(); 
    }  

    return res.status(200).send(updatedProfile);  
  }   
  catch (err) {  
    console.error(err);  
    return res.status(500).send("Internal Server Error");  
  }  
};

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// const otpStorage = new Map(); 

// const getotp = async (req, res) => {
//   let { phone } = req.body;

//   if (!phone) {
//      return res.status(400).json({ success: false, message: "Phone number is required" });
//   }

//   if (!phone.startsWith("+")) {
//     phone = `+91${phone}`;
//   }

//   try {
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     otpStorage.set(phone, otp); // Store OTP

//     const message = await client.messages.create({
//       from: 'whatsapp:+14155238886',
//       to: `whatsapp:${phone}`,
// body: `Hello Jagan, welcome to Ghant Book! Your OTP is ${otp}. Please use this code to proceed. Do not share it with anyone. Have a great day!`
//     });

//     console.log(`OTP for ${phone}: ${otp}`); // Debugging

//     res.json({ success: true, message: "OTP sent successfully", sid: message.sid });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
//   }
// };
// const otpverify = async (req, res) => {
//   let { phone, otp } = req.body;

//   if (!phone || !otp) {
//     return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
//   }

//   if (!phone.startsWith("+")) {
//     phone = `+91${phone}`;
//   }

//   const storedOtp = otpStorage.get(phone);

//   console.log(`Stored OTP for ${phone}: ${storedOtp}`); // Debugging
//   console.log(`Received OTP: ${otp}`); // Debugging

//   if (storedOtp && storedOtp == otp) {  // Ensure comparison is correct
//     otpStorage.delete(phone); // Remove OTP after successful verification
//     return res.json({ success: true, message: "OTP verified successfully" });
//   } else {
//     return res.status(400).json({ success: false, message: "Invalid OTP" });
//   }
// };










module.exports = {add ,get ,update}   