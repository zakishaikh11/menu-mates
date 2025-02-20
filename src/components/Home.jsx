import { FaStar, FaQrcode, FaUserPlus, FaShoppingCart, FaUtensils, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../api';
import defaultImage from './default.png';

const LandingPage = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // // Fetch 3 vendors
    axios.get(`${BASE_URL}/vendors?limit=3`)
      .then(response => setVendors(response.data))
      .catch(error => console.error('Error fetching vendors:', error));

    // Fetch 3 products (using new API)
    axios.get(`${BASE_URL}/products/all-products?limit=3`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);
  const addToCart = async (product, event) => {
    event.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.username) {
      alert("Please log in to add items to your cart.");
      navigate('/login');
      return;
    }

    const payload = {
      username: user.username,
      product_id: product._id,
      price: product.price,
      quantity: 1,
      total: product.price,
    };

    try {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Product added to cart!');
      } else {
        alert('Error: Could not add product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="text-center bg-sky-500 py-20 px-4">
        <h1 className="text-5xl font-bold text-gray-800">Digitizing Local Food Vendors, One QR Code at a Time!</h1>
        <p className="text-lg text-gray-700 mt-4">Seamless ordering, real-time tracking, and vendor empowerment.</p>
        <div className="mt-6 flex justify-center gap-4">
           <Link to="/explore-vendors">
           <button className="bg-gray-800 text-white px-6 py-3 rounded-lg text-lg cursor-pointer hover:bg-gray-900">Explore Vendors</button>
           </Link>
           <Link to="/admin/add-vendor">
           <button className="bg-white text-gray-800 px-6 py-3 rounded-lg text-lg border hover:bg-gray-200">Join as a Vendor</button>
           </Link>
          
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-6 px-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <FaQrcode className="text-4xl text-sky-500 mx-auto" />
            <h3 className="mt-4 font-bold">Scan QR Code</h3>
            <p>Access the vendor’s menu instantly.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <FaShoppingCart className="text-4xl text-green-500 mx-auto" />
            <h3 className="mt-4 font-bold">Browse & Order</h3>
            <p>Add items to your cart and confirm your order.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <FaUtensils className="text-4xl text-red-500 mx-auto" />
            <h3 className="mt-4 font-bold">Pick Up & Enjoy</h3>
            <p>Track order status and pick up when ready.</p>
          </div>
        </div>
      </section>

      {/* Popular Vendors */}
      <section className="py-16 px-6">
      <h2 className="text-2xl font-bold mb-4">Popular Vendors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vendors.map(vendor => (
          <div key={vendor._id} className="bg-white p-4 shadow-lg rounded-lg">
            <img src={vendor.image ? `${BASE_URL.replace('/api', '')}${vendor.image}` : defaultImage}
            alt={vendor.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-xl font-semibold mt-2">{vendor.name}</h3>
            <p className="text-gray-600">{vendor.location}</p>
            <Link to={`/${vendor.name}/menu`} className="text-blue-500 mt-2 block">View Menu</Link>
          </div>
        ))}
      </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-16 px-6 bg-gray-200">
      <h2 className="text-2xl font-bold mt-8 mb-4">Popular Dishes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product._id} className="bg-white p-4 shadow-lg rounded-lg">
            <img 
            src={product.image ? `${BASE_URL.replace('/api', '')}${product.image}` : defaultImage} 
            alt={product.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <div className="flex justify-between mt-2">
              <Link to={`/product/${product._id}`} className="text-blue-500">View Product</Link>
              <button 
              onClick={(event) => addToCart(product, event)}
              className="bg-green-500 text-white px-4 py-1 rounded">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-sky-500">
        <h2 className="text-3xl font-semibold">Join Menu Mates Today!</h2>
        <p className="text-lg mt-4">Start receiving digital orders and grow your business effortlessly.</p>
      <Link to="/admin/add-vendor">
      <button className="mt-6 bg-gray-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-900">Get Started</button>
      </Link>
        
      </section>

      {/* Footer */}
      <footer className="text-center py-8 bg-gray-900 text-white">
        <p>&copy; 2025 Menu Mates. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
