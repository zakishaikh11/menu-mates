import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BASE_URL from "../api";
import defaultImage from "./default.png";

const ExploreVendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/vendors`)
      .then(response => setVendors(response.data))
      .catch(error => console.error("Error fetching vendors:", error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-6">Explore Vendors</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
};

export default ExploreVendors;