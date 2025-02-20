import { useState, useEffect } from "react";
import BASE_URL from "../../api";

const AddCategoryAndProduct = () => {
    const [name, setName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("");
    const [featured, setFeatured] = useState(false);
    const [images, setImages] = useState([]);
    const [vendorId, setVendorId] = useState(null);

    useEffect(() => {
        const storedVendorId = localStorage.getItem("vendor_id");
        if (storedVendorId) {
            setVendorId(storedVendorId);
            fetchCategories(storedVendorId);
        } else {
            alert("Vendor not found! Please register or log in.");
        }
    }, []);

    const fetchCategories = async (vendorId) => {
        try {
            const response = await fetch(`${BASE_URL}/vendors/${vendorId}/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        if (!vendorId) return alert("Vendor ID missing. Please refresh the page.");
        
        const response = await fetch(`${BASE_URL}/vendors/add-category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, categoryDescription, vendor_id: vendorId }),
        });
        const data = await response.json();
        alert(data.message);
        
        if (response.ok) {
            setCategories([...categories, data.category]);
            setName("");
            setCategoryDescription("");
        }
    };

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        if (!vendorId) return alert("Vendor ID missing. Please refresh the page.");

        const formData = new FormData();
        formData.append("vendor_id", vendorId);
        formData.append("category_id", categoryId);
        formData.append("title", title);
        formData.append("price", price);
        formData.append("description", productDescription);
        formData.append("stock", stock);
        formData.append("featured", featured);

        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }

        try {
            const response = await fetch(`${BASE_URL}/vendors/add-product`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                setTitle("");
                setPrice("");
                setCategoryId("");
                setStock("");
                setFeatured(false);
                setImages([]);
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Category</h2>
            <form onSubmit={handleCategorySubmit} className="space-y-3">
                <input type="text" placeholder="Category Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                <input type="text" placeholder="Description" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Add Category</button>
            </form>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Add Product</h2>
            <form onSubmit={handleProductSubmit} className="space-y-3">
                <input type="text" placeholder="Product Name" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                <textarea placeholder="Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />
                <label className="flex items-center">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="mr-2" />
                    Featured Product
                </label>
                <input type="file" multiple onChange={handleImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Add Product</button>
            </form>
        </div>
    );
};

export default AddCategoryAndProduct;
