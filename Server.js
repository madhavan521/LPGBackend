const http = require("http")
const express=require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const cookieParser = require('cookie-parser')
const twilio = require('twilio');
const PORT = process.env.PORT
//modules
const dealerauthrouter = require("./Router/DealerAuthenticationRouter")
const DatabaseConnection = require("./Database/DatabaseConnection")
const resellerauthrouter = require("./Router/ResellerAuthenticationRouter")
const cylinderentryrouter = require("./Router/CylinderRouter")
const addcustomerrouter = require("./Router/AddCustomerRouter")
const dealerresellerrouter = require("./Router/DealerResellerRouter")
const profilerouter = require("./Router/ProfileRouter")


//MiddleWare
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStorage = {};
app.use(express.json())
app.use(cors({
    origin: 'https://lpg-frontend-omega.vercel.app', 
    credentials: true  
  }));
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));

// Routers 
app.use('/api/auth/dealer' , dealerauthrouter)
app.use('/api/auth/reseller' , resellerauthrouter)
app.use('/api/cylinder/entry',cylinderentryrouter)
app.use('/api/customer/add' ,addcustomerrouter)
app.use('/api/reseller/push',dealerresellerrouter)
app.use('/api/profile' , profilerouter)
 


// Database Connection

DatabaseConnection();

// Server Connection

const server = http.createServer(app)
server.listen(PORT ,()=>{
    console.log("Sever started listing")
})
