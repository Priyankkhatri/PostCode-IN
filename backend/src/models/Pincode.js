const mongoose = require("mongoose");
const config = require("../config");

const PincodeSchema = new mongoose.Schema(
  {
    pincode: { 
      type: Number, 
      required: true, 
      index: true 
    },
    officeName: { 
      type: String, 
      required: true 
    },
    officeType: { 
      type: String, 
      enum: ["HO", "SO", "BO", "GPO"] 
    },
    deliveryStatus: { 
      type: String, 
      enum: ["Delivery", "Non-Delivery"] 
    },
    divisionName: String,
    regionName: String,
    circleName: String,
    taluk: String,
    districtName: String,
    stateName: { 
      type: String, 
      uppercase: true 
    },
    telephone: String,
    relatedSubOffice: String,
    relatedHeadOffice: String,
  },
  { 
    collection: config.database.collectionName,
    timestamps: true 
  }
);

// Optimize search with a text index
PincodeSchema.index({ stateName: 1 });
PincodeSchema.index({ districtName: 1 });
PincodeSchema.index({ taluk: 1 });

// Full-text search index for search functionality
PincodeSchema.index({
  officeName: "text",
  districtName: "text",
  stateName: "text",
  taluk: "text",
});

module.exports = mongoose.model("Pincode", PincodeSchema);
