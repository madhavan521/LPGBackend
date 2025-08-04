const { PurchaseDealerCylinder, DealerCylinder, DealerDelivery } = require('../Schema/DealerCylinderSchema');
const Dealer = require('../Schema/DealerSchema');
const Reseller = require('../Schema/ResellerSchema');

const postdealercylinderpurchase = async (req, res) => {
    try {
        const UserId = req.user._id;
        const username = await Dealer.findById(UserId);
        if (!username) {
            return res.status(404).send("Invalid User from database");
        }

        // Validate request body
        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).send("Invalid input: Expected an array of purchases");
        }

        // Bulk insert purchase records
        const purchaseEntries = req.body.map(item => ({
            purchasecylinderType: item.cylinderType,
            purchasefullCylinder: parseInt(item.fullCylinder),
            purchaseemptyCylinder: parseInt(item.emptyCylinder)
        }));

        const Cylinderdeliverydata = await PurchaseDealerCylinder.insertMany(purchaseEntries);

        // Retrieve existing cylinder stock data or create a new one
        let individualCylinderType = await DealerCylinder.findOne();
        if (!individualCylinderType) {
            individualCylinderType = new DealerCylinder({
                DealerCylinder5kg: [],
                DealerCylinder14kg: [],
                DealerCylinder17kg: [],
                DealerCylinder19kg: [],
                DealerCylinder21kg: [],
                DealerCylinder45kg: []
            });
        }

        // Loop through each purchase and update stock
        for (const item of req.body) {
            let targetCylinderArray;
            switch (item.cylinderType) {
                case "5kg":
                    targetCylinderArray = individualCylinderType.DealerCylinder5kg;
                    break;
                case "14kg":
                    targetCylinderArray = individualCylinderType.DealerCylinder14kg;
                    break;
                case "17kg":
                    targetCylinderArray = individualCylinderType.DealerCylinder17kg;
                    break;
                case "19kg":
                    targetCylinderArray = individualCylinderType.DealerCylinder19kg;
                    break;
                case "21kg":
                    targetCylinderArray = individualCylinderType.DealerCylinder21kg;
                    break;
                case "45kg":
                    targetCylinderArray = individualCylinderType.DealerCylinder45kg;
                    break;
                default:
                    return res.status(400).send("Invalid Cylinder Type");
            }

            let existingEntry = targetCylinderArray.length > 0 ? targetCylinderArray[0] : null;

            if (existingEntry) {
                existingEntry.fullCylinder += parseInt(item.fullCylinder);
                existingEntry.emptyCylinder -= parseInt(item.fullCylinder);
                existingEntry.fullCylinder -= parseInt(item.emptyCylinder);
                existingEntry.emptyCylinder += parseInt(item.emptyCylinder);
            } else {
                targetCylinderArray.push({
                    fullCylinder: parseInt(item.fullCylinder),
                    emptyCylinder: -parseInt(item.fullCylinder)
                });
            }
        }

        await individualCylinderType.save();

        // Update the dealer's record
        username.TotalCylinder = individualCylinderType;
        username.PurchaseCylinder.push(...Cylinderdeliverydata);
        await username.save();

        return res.status(201).send({ message: "Cylinder Data Updated Successfully", username });
    } catch (err) {
        console.error("Error:", err.message);
        return res.status(500).send(err.message);
    }
};   
const postdealerdelivery = async (req, res) => {  
    try {  
        const now = new Date();  

        if (!req.user || !req.user._id) {  
            return res.status(401).send("Unauthorized request");  
        }  

        const dealerId = req.user._id;  
        const requestData = req.body;  

        if (!Array.isArray(requestData) || requestData.length < 2) {  
            return res.status(400).send("Invalid input: Expected an array with resellername and deliveries.");  
        }  

        const { resellername } = requestData[0];  

        const dealerdata = await Dealer.findById(dealerId).populate("TotalCylinder");  
        if (!dealerdata) return res.status(404).send("Dealer not found in database");  

        const resellerdata = await Reseller.findOne({ username: resellername });  
        if (!resellerdata) return res.status(404).send("Reseller not found in database");  

        let dealerCylinderStock = await DealerCylinder.findOne({ dealerId });  
        if (!dealerCylinderStock) {  
            dealerCylinderStock = new DealerCylinder({  
                dealerId,  
                DealerCylinder5kg: [{ fullCylinder: 0, emptyCylinder: 0 }],  
                DealerCylinder14kg: [{ fullCylinder: 0, emptyCylinder: 0 }],  
                DealerCylinder17kg: [{ fullCylinder: 0, emptyCylinder: 0 }],  
                DealerCylinder19kg: [{ fullCylinder: 0, emptyCylinder: 0 }],  
                DealerCylinder21kg: [{ fullCylinder: 0, emptyCylinder: 0 }],  
                DealerCylinder45kg: [{ fullCylinder: 0, emptyCylinder: 0 }]  
            });  
        }  

        if (!Array.isArray(resellerdata.ResellerTotalCylinder)) {  
            resellerdata.ResellerTotalCylinder = [];  
        }  

        let resellerTotalCylinder = resellerdata.ResellerTotalCylinder.find(item =>  
            item.dealerId.toString() === dealerId.toString()  
        );  

        if (!resellerTotalCylinder) {  
            resellerTotalCylinder = {  
                dealerId: dealerId,  
                DealerCylinder5kg: { fullCylinder: 0, emptyCylinder: 0 },  
                DealerCylinder14kg: { fullCylinder: 0, emptyCylinder: 0 },  
                DealerCylinder17kg: { fullCylinder: 0, emptyCylinder: 0 },  
                DealerCylinder19kg: { fullCylinder: 0, emptyCylinder: 0 },  
                DealerCylinder21kg: { fullCylinder: 0, emptyCylinder: 0 },  
                DealerCylinder45kg: { fullCylinder: 0, emptyCylinder: 0 }  
            };  
            resellerdata.ResellerTotalCylinder.push(resellerTotalCylinder);  
        }  

        // Cylinder Type Mapping  
        const cylinderMapping = {  
            "5kg": "DealerCylinder5kg",  
            "14kg": "DealerCylinder14kg",  
            "17kg": "DealerCylinder17kg",  
            "19kg": "DealerCylinder19kg",  
            "21kg": "DealerCylinder21kg",  
            "45kg": "DealerCylinder45kg"  
        };  

        for (let i = 1; i < requestData.length; i++) {  
            const { cylinderType, fullCylinder, emptyCylinder } = requestData[i];  

            const cylinderKey = cylinderMapping[cylinderType];  
            if (!cylinderKey) return res.status(400).send(`Invalid Cylinder Type: ${cylinderType}`);  

            // Get the correct dealer stock entry  
            let dealerCylinderEntry = dealerCylinderStock[cylinderKey][0];  
            if (!dealerCylinderEntry) {  
                return res.status(400).send(`No stock for ${cylinderType}`);  
            }  

            // Reduce fullCylinder count and increase emptyCylinder count  
            dealerCylinderEntry.fullCylinder -= parseInt(fullCylinder);  
            dealerCylinderEntry.emptyCylinder += parseInt(emptyCylinder);  

            // Ensure reseller's total cylinder entry is created or updated  
            if (!resellerTotalCylinder[cylinderKey]) {  
                resellerTotalCylinder[cylinderKey] = { fullCylinder: 0, emptyCylinder: 0 };  
            }  

            // Update reseller's stock  
            resellerTotalCylinder[cylinderKey].fullCylinder += parseInt(fullCylinder);  
            resellerTotalCylinder[cylinderKey].emptyCylinder -=  parseInt(emptyCylinder);  

            // Update Dealer's TotalCylinder in `dealerdata`  
            let dealerTotalCylinderEntry = dealerdata.TotalCylinder[0][cylinderKey][0];  
            if (dealerTotalCylinderEntry) {  
                dealerTotalCylinderEntry.fullCylinder -= parseInt(fullCylinder);  
                dealerTotalCylinderEntry.emptyCylinder += parseInt(emptyCylinder);  
            } else {  
                return res.status(400).send(`TotalCylinder entry for ${cylinderType} not found`);  
            }  

            // Add purchase record for reseller  
            resellerdata.ResellerPurchaseCylinder.push({  
                dealerId: dealerId,  
                cylinderType,  
                fullCylinder,  
                emptyCylinder,  
                date: now.toLocaleDateString(),  
                time: now.toLocaleTimeString(),  
            });  

            // Add delivery record to dealer  
            dealerdata.CylinderDelivery.push({  
                resellerId: resellerdata._id,  
                cylinderType,  
                fullCylinder,  
                emptyCylinder,  
                date: now.toLocaleDateString(),   
                time: now.toLocaleTimeString()   
            });  
        }  

        // Ensure Mongoose detects nested object changes  
        dealerdata.markModified("TotalCylinder");  
        resellerdata.markModified("ResellerTotalCylinder");  

        // Save all updates  
        await Promise.all([dealerCylinderStock.save(), resellerdata.save(), dealerdata.save()]);  

        return res.status(201).send({  
            message: "Cylinders Delivered Successfully",  
            dealerStock: dealerCylinderStock,  
            resellerStock: resellerdata.ResellerTotalCylinder  
        });  

    } catch (err) {  
        console.error("Error:", err.message);  
        return res.status(500).send(err.message);  
    }  
};  
  
const postuserdelivery = async (req, res) => {  
    try {  
        const now = new Date();  
        const resellerId = req.user._id;   
        
        if (!Array.isArray(req.body) || req.body.length < 2) {  
            return res.status(400).send("Invalid input: Expected an array with at least two elements.");  
        }  
        
        const { username } = req.body[0];  
        const cylinders = req.body.slice(1);  
        
        if (!username || cylinders.length === 0) {  
            return res.status(400).send("Invalid input: Missing username or cylinder details.");  
        }  
        
        const resellerData = await Reseller.findById(resellerId);  
        if (!resellerData) {  
            return res.status(404).send('Reseller not found in database.');  
        }  
        
        if (!Array.isArray(resellerData.UserDeliverHistory)) {  
            resellerData.UserDeliverHistory = [];   
        }  
        
        const user = resellerData.Userdata.find(user => user.customerName === username);  
        if (!user) {  
            return res.status(404).send('User not found in reseller data.');  
        }  
        
        for (const { cylinderType, fullCylinder, emptyCylinder } of cylinders) {  
            if (!cylinderType || typeof fullCylinder === 'undefined' || typeof emptyCylinder === 'undefined') {  
                return res.status(400).send("Invalid input: Missing cylinderType, fullCylinder, or emptyCylinder.");  
            }  
            
            const cylinderStockKey = `DealerCylinder${cylinderType}`;  
            const cylinderStock = resellerData.ResellerTotalCylinder[0][cylinderStockKey];  
            
            if (!cylinderStock) {  
                return res.status(404).send(`${cylinderType} is not available in reseller's stock.`);  
            }  
            
            if (cylinderStock.fullCylinder < fullCylinder) {  
                return res.status(400).send(`Not enough full stock for ${cylinderType}.`);  
            }  
            
            cylinderStock.fullCylinder -= fullCylinder;  
            cylinderStock.emptyCylinder -= emptyCylinder; 
            
            resellerData.UserDeliverHistory.push({  
                username: user.customerName,   
                cylinderType,  
                fullCylinder,  
                emptyCylinder: -emptyCylinder,  
                date: now.toLocaleDateString(),  
                time: now.toLocaleTimeString()  
            });  
        }  
        
        resellerData.markModified('ResellerTotalCylinder');  
        resellerData.markModified('UserDeliverHistory');  
        
        await resellerData.save();  
        
        return res.status(201).send({  
            message: "Delivery to user completed successfully.",  
            updatedStock: resellerData.ResellerTotalCylinder,  
            userDeliveryHistory: resellerData.UserDeliverHistory  
        });  
        
    } catch (err) {  
        console.error("Error:", err.message);  
        return res.status(500).send("Internal Server Error: " + err.message);  
    }  
};


 

  

module.exports = { postdealercylinderpurchase ,postdealerdelivery,postuserdelivery};

