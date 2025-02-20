const express = require('express');
const router = express.Router();
const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');

// POST: Create new order after payment
// router.post('/create', async (req, res) => {
//   try {
//     const { user, items, paymentInfo, total, tax, grandTotal } = req.body;

//     // Generate random 12-digit orderId
//     const orderId = Math.random().toString().slice(2, 14);

//     const newOrder = new Order({
//       orderId,
//       user,
//       items,
//       paymentInfo,
//       total,
//       tax,
//       grandTotal,
//     });

//     await newOrder.save();

//     res.status(201).json({ message: 'Order created successfully', orderId });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });
router.post('/create', async (req, res) => {
  try {
    const { user, items, paymentInfo, total, tax, grandTotal } = req.body;

    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid request: Missing user or items" });
    }

    // Extract vendor_id from the first item (Assumption: one vendor per order)
    const vendor_id = items[0]?.vendor_id;
    if (!vendor_id) {
      return res.status(400).json({ message: "Missing vendor_id" });
    }

    // Generate a unique 12-digit orderId
    const orderId = Math.random().toString().slice(2, 14);

    const newOrder = new Order({
      orderId,
      user,
      items,
      paymentInfo,
      total,
      tax,
      grandTotal,
      vendor_id, // Ensure vendor_id is included
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Get order by orderId
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const { vendor_id } = req.query;
    
    if (!vendor_id) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const orders = await Order.find({ vendor_id }); 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

module.exports = router;