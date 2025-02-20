const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const Vendor = require('../models/vendorModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const multer = require('multer');
const router = express.Router();

// Add Category for a Vendor
router.post('/add-category', async (req, res) => {
    const { name, description, vendor_id } = req.body;

    try {
        const category = new Category({
            name,
            description,
            vendor_id
        });

        await category.save();
        res.status(201).json({ message: 'Category added successfully', category });
    } catch (err) {
        res.status(500).json({ error: 'Error adding category', err });
    }
});

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save images to 'uploads/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });
// Add a Vendor
router.post('/add-vendor', upload.single('image'), async (req, res) => {
    try {
      const { name, location, functioningTime, contactNumber } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'Image upload is required' });
      }
  
      const imagePath = `/uploads/${req.file.filename}`;
  
      const qrCodeUrl = `https://menu-mates.vercel.app/${name}/menu`;
      const qrCode = await QRCode.toDataURL(qrCodeUrl);
  
      const vendor = new Vendor({
        name,
        location,
        image: imagePath,
        functioningTime: JSON.parse(functioningTime),
        contactNumber,
        qrCode,
      });
  
      await vendor.save();
  
      res.status(201).json({
        message: 'Vendor created successfully',
        vendor_id: vendor._id,
      });
    } catch (err) {
      console.error('Error creating vendor:', err);
      res.status(500).json({ error: 'Error creating vendor', message: err.message });
    }
  });


// Add Product API with Image Uploads
router.post('/add-product', upload.array('images', 4), async (req, res) => {
    try {
        const { vendor_id, category_id, title, price, description, stock, featured } = req.body;

        // Ensure req.files exists
        const imagePaths = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

        // Create the product without product_id first
        const product = new Product({
            vendor_id,
            category_id,
            title,
            price,
            description,
            stock,
            image: imagePaths[0] || null,
            image2: imagePaths[1] || null,
            image3: imagePaths[2] || null,
            image4: imagePaths[3] || null,
            featured: featured === "true" || featured === true, // Ensure boolean type
        });

        // Save the product to get its _id
        await product.save();

        // Update product_id to match _id
        product.product_id = product._id;
        await product.save();

        res.status(201).json({ message: "Product added successfully", product });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Error adding product", details: err.message });
    }
});


// Get Menu for a Vendor
router.get('/:name/menu', async (req, res) => {
    const { name } = req.params;

    try {
        const vendor = await Vendor.findOne({ name }).lean();
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        const categories = await Category.find({ vendor_id: vendor._id }).lean();
        const products = await Product.find({ vendor_id: vendor._id }).lean();

        // Group products by category
        const menu = categories.map(category => ({
            ...category,
            products: products.filter(p => p.category_id.equals(category._id))
        }));

        res.status(200).json({ vendor, menu });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching menu', err });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid vendor ID' });
    }

    try {
        const vendor = await Vendor.findById(id).lean();
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        res.status(200).json({ vendor });
    } catch (err) {
        console.error('Error fetching vendor:', err);
        res.status(500).json({ error: 'Error fetching vendor', err });
    }
});
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const queryLimit = limit ? parseInt(limit) : 10;
        const vendors = await Vendor.find({}).limit(queryLimit);
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vendors', error });
    }
});


// Get Categories for a Vendor
router.get('/:vendorId/categories', async (req, res) => {
    try {
        const categories = await Category.find({ vendor_id: req.params.vendorId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

// Get Products by Vendor & Category
router.get('/:vendorId/products/:categoryId', async (req, res) => {
    try {
        const products = await Product.find({
            vendor_id: req.params.vendorId,
            category_id: req.params.categoryId
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

module.exports = router;