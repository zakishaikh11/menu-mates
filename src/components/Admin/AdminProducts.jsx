import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProductsByVendor } from '../../api'; // Assuming this is already imported correctly
import BASE_URL from '../../api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProductsByVendor();
        
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Failed to fetch products: Data is not in the expected format');
        }
      } catch (error) {
        setError('Error fetching products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (product_id) => {
    try {
      const response = await fetch(`${BASE_URL}/products/${product_id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Update the product list after deletion
      setProducts(products.filter(product => product.product_id !== product_id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Admin Products</h2>
      <Link to="" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add New Product
      </Link>
      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="w-full bg-gray-700 text-white">
            <th className="py-2 px-4">Product ID</th>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Price</th>
            <th className="py-2 px-4">Stock</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-2">No products available</td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.product_id} className="bg-gray-800 text-white border-b border-gray-600">
                <td className="py-2 px-4">{product.product_id}</td>
                <td className="py-2 px-4">{product.title}</td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4">{product.stock}</td>
                <td className="py-2 px-4">
                  <Link to={`/admin/products/edit/${product.product_id}`} className="text-yellow-500 hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(product.product_id)} className="text-red-500 hover:underline ml-4">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
