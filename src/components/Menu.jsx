import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../api';
import defaultImage from './default.png';
function VendorMenu() {
  const { stallName } = useParams();
    const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${BASE_URL}/vendors/${stallName}/menu`);
        const data = await response.json();
        
        if (response.ok) {
          setVendor(data.vendor);
          setMenu(data.menu);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [stallName]);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const convertTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};


  if (!vendor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800">Vendor not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header with Background Image */}
      <div 
        className="relative h-96 w-full overflow-hidden"
        style={{
          backgroundImage: `url(${vendor.image ? `${BASE_URL.replace('/api', '')}${vendor.image}` : defaultImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        
        {/* Vendor Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg max-w-2xl border border-white/20 relative">
            {/* Glass morphism effect */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-lg rounded-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6">
              {/* Vendor Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">{vendor.name}</h1>
                <div className="flex flex-col gap-3">
                  <span className="flex items-center backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
                    <svg className="w-5 h-5 mr-1 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">{vendor.location}</span>
                  </span>
                  <span className="flex items-center backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
                    <svg className="w-5 h-5 mr-1 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-black">{vendor.contactNumber}</span>
                  </span>
                  <span className="flex items-center backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
                    <svg className="w-5 h-5 mr-1 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">
                      {convertTo12Hour(vendor.functioningTime.opening)} - {convertTo12Hour(vendor.functioningTime.closing)}
                    </span>
                  </span>
                </div>
              </div>
              
              {/* QR Code */}
              <div className="flex-shrink-0">
                <img 
                  src={vendor.qrCode} 
                  alt="QR Code" 
                  className="w-30 h-30 rounded-lg border-2 border-white/30 p-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

  {/* Rest of the menu sections remain the same */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {menu.map((category) => (
      <section key={category._id} className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600 text-lg">{category.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.products.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="relative h-56">
                <img
                   src={product.image ? `${BASE_URL.replace('/api', '')}${product.image}` : defaultImage}
                   alt={product.title}
                 className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                /> 
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{product.title}</h3>
                  {product.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
                
                {product.description && (
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                  <button
                        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                        onClick={(event) => addToCart(product, event)} // Stop propagation on click
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}
  </main>
</div>
);
}

export default VendorMenu;