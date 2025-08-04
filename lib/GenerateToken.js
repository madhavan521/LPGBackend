const jwt = require("jsonwebtoken");
// comment to generate jwt_secret
//openssl rand -base64 32

const generateTokenAndSetCookies=(userId , res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
    expiresIn:'15d'
    })
res.cookie("jwt",token ,{
     maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days  
    httpOnly: true, 
    secure: true,
      sameSite: 'none'
})
}
module.exports = generateTokenAndSetCookies;
