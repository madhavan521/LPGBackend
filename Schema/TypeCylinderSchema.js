const mongoose = require("mongoose");

const cylinderSchema = new mongoose.Schema({
  cylinder5kg: [
    {
      fullCylinder: { type: Number, required: true },
      emptyCylinder: { type: Number, required: true }
    }
  ],
  cylinder17kg: [
    {
      fullCylinder: { type: Number, required: true },
      emptyCylinder: { type: Number, required: true }
    }
  ],
  cylinder19kg: [
    {
      fullCylinder: { type: Number, required: true },
      emptyCylinder: { type: Number, required: true }
    }
  ],
  cylinder14kg: [
    {
      fullCylinder: { type: Number, required: true },
      emptyCylinder: { type: Number, required: true }
    }
  ],
  cylinder21kg: [
    {
      fullCylinder: { type: Number, required: true },
      emptyCylinder: { type: Number, required: true }
    }
  ],
  cylinder45kg: [
    {
      fullCylinder: { type: Number, required: true },
      emptyCylinder: { type: Number, required: true }
    }
  ]
});

const IndividualCylinderType = mongoose.model("CylinderTypedata", cylinderSchema);

module.exports = IndividualCylinderType;
