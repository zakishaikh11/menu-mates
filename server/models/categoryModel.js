const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true }
});

module.exports = mongoose.model('Category', categorySchema);