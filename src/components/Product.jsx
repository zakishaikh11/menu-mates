import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import defaultImage from './default.png';
const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <img
         src={product.image ? `${BASE_URL.replace('/api', '')}${product.image}` : defaultImage}
        alt={product.title}
        className="w-full h-72 object-cover rounded-lg"
      />
      <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
      <p className="text-lg text-gray-600">{product.description}</p>
      <p className="text-xl font-semibold text-green-600 mt-2">₹{product.price}</p>
      <button
        onClick={(event) => addToCart(product, event)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        <FontAwesomeIcon icon={faCartPlus} className="mr-2" /> Add to Cart
      </button>

    </div>
  );
};

export default Product;
