let generateTokenAndSetCookies = require('../lib/GenerateToken');
const Reseller = require('../Schema/ResellerSchema')
const bcrypt = require('bcryptjs');
const signup = async (req, res) => {   
    const { email, username, fullname, password} = req.body;  

    try {  
        // Username validation  
        const existingUser = await Reseller.findOne({ username });  
        if (existingUser) {  
            return res.status(400).send("Username already exists.");  
        }  

        // Email validation    
        const validateEmailRegex = /^\S+@\S+\.\S+$/;  
        if (!validateEmailRegex.test(email)) {  
            return res.status(400).send("Invalid email.");  
        }  

        const existingEmail = await Reseller.findOne({ email });  
        if (existingEmail) {  
            return res.status(400).send("Email already exists.");  
        }  

        // Password validation  
        if (password.length < 6) {  
            return res.status(400).send("Password must be at least 6 characters long.");  
        }  

        // Phone number validation  
        // if (!/^\d{10,15}$/.test(phoneNo)) {  
        //     return res.status(400).send("Enter a valid mobile number.");  
        // }  

        // Hash password  
        const salt = await bcrypt.genSalt(10);  
        const hashedPassword = await bcrypt.hash(password, salt);  

        const newUser = new Reseller({  
            email,  
            fullname,  
            username, 
            password: hashedPassword,  
             
        });  

        // Save new user and send response  
        await newUser.save();  
        generateTokenAndSetCookies(newUser._id, res);  

        res.status(200).send({  
            _id: newUser._id,  
            email: newUser.email,  
            fullname: newUser.fullname,  
            username: newUser.username,  
        });  

    } catch (err) {  
        console.error(err.message);  
        res.status(500).send("Internal Server Error");  
    }  
};
//Login
const login = async(req,res)=>{
    const { username ,password} = req.body
    try{  
        const userdata= await Reseller.findOne({username})
         if(!userdata)
         {
            return res.status(400).send("Invalid username")
         }
         const isPasswordValid = await bcrypt.compare(password , userdata.password)
         if(!isPasswordValid){
             return res.status(400).send("Invalid  Password")
         }
         generateTokenAndSetCookies(userdata._id , res)
         res.status(200).json(     
            {    
                _id: userdata._id,      
                fullname:userdata.fullname,
                username:userdata.username,
                email: userdata.email,
            })
    }
    catch(err){
        console.error(err.message)
        res.status(500).send("Internal Server Error")
    }
}
//LOGOUT
const logout = async(req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'Strict'
        });
        res.status(200).send("Logout Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

const getMe = async (req, res) => {  
    try {  
        const user = await Reseller.findById(req.user._id);  
        
        if (!user) {  
            return res.status(404).json({ message: "User not found" });  
        }  
        
        return res.status(200).json(user)
    } catch (err) {  
        console.error(err); 
        return res.status(500).json({ message: "Internal Server Error" });  
    }  
};
// forgetPassword
// forgetPassword  
const forget = async (req, res) => {  
    try {  
        const { username, email, password } = req.body;  

        // Verify username and email  
        const user = await Reseller.findOne({ username, email });  
        if (!user) {  
            return res.status(404).send("Invalid username or email");  
        }  

        // Hash the new password  
        const salt = await bcrypt.genSalt(10);  
        const hashedPassword = await bcrypt.hash(password, salt);  

        user.password = hashedPassword;
        await user.save();

        return res.status(200).send("Password updated successfully");  
    } catch (err) {  
        return res.status(500).send("Internal Server Error");  
    }  
};


module.exports ={ signup,login,logout,getMe,forget}