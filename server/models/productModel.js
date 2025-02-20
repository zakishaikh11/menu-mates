const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
  description: { type: String },
  image: { type: String },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
  featured: { type: Boolean, default: false },
  stock: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);