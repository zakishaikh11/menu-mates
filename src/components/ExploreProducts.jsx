import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BASE_URL from "../api";
import defaultImage from "./default.png";

const ExploreProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/products/all-products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-6">Explore Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white p-4 shadow-lg rounded-lg">
            <img src={product.image ? `${BASE_URL.replace('/api', '')}${product.image}` : defaultImage}
              alt={product.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <div className="flex justify-between mt-2">
              <Link to={`/product/${product._id}`} className="text-blue-500">View Product</Link>
              <button className="bg-green-500 text-white px-4 py-1 rounded">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreProducts;
