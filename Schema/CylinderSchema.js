const mongoose = require("mongoose");

const cylinderSchema = new mongoose.Schema({
    cylinderType: {
        type: String,
        required: true,
        enum: ["5kg", "14kg", "17kg","19kg", "21kg", "45kg"]
    },
    fullCylinder: {
        type: Number,
        required: true
    },
    emptyCylinder: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const CylinderData = mongoose.model("CylinderData", cylinderSchema);

module.exports = CylinderData;
