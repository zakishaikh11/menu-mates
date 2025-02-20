const mongoose = require('mongoose');


const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  location: { type: String, required: true }, 
  image: { type: String }, 
  functioningTime: {
    opening: { type: String, required: true }, 
    closing: { type: String, required: true }, 
  },
  qrCode: { type: String }, 
 
  contactNumber: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [{ type: String }],
}, { timestamps: true }); 

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
