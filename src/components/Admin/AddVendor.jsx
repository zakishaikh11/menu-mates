import React, { useState } from 'react';
import BASE_URL from '../../api';

function AddVendor() {
  const [vendorData, setVendorData] = useState({
    name: '',
    location: '',
    opening: '',
    closing: '',
    contactNumber: '',
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', vendorData.name);
    formData.append('location', vendorData.location);
    formData.append('contactNumber', vendorData.contactNumber);
    formData.append(
      'functioningTime',
      JSON.stringify({ opening: vendorData.opening, closing: vendorData.closing })
    );

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`${BASE_URL}/vendors/add-vendor`, {
        method: 'POST',
        body: formData, // Send form data (no need for headers, browser sets them automatically)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('vendor_id', data.vendor_id);
        alert('Vendor added successfully!');
        setVendorData({
          name: '',
          location: '',
          opening: '',
          closing: '',
          contactNumber: '',
        });
        setImage(null);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Error creating vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register to Menu Mates</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={vendorData.name}
          onChange={handleChange}
          placeholder="Vendor Name"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          required
        />
        <input
          type="text"
          name="location"
          value={vendorData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            name="opening"
            value={vendorData.opening}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            required
          />
          <input
            type="time"
            name="closing"
            value={vendorData.closing}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
            required
          />
        </div>
        <input
          type="text"
          name="contactNumber"
          value={vendorData.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-300"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? 'Adding Vendor...' : 'Create Vendor'}
        </button>
      </form>
    </div>
  );
}

export default AddVendor;
