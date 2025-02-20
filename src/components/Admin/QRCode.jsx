import React, { useEffect, useState, useRef } from 'react';
import BASE_URL from '../../api';
import html2pdf from 'html2pdf.js';
import logo from '../Images/zakstechLogo.png';

const QRCode = () => {
    const [vendor, setVendor] = useState(null);
    const qrRef = useRef(null);

    useEffect(() => {
        const vendorId = localStorage.getItem('vendor_id');
        if (!vendorId) {
            console.error('No vendor_id found in localStorage');
            return;
        }

        fetch(`${BASE_URL}/vendors/${vendorId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.vendor) {
                    setVendor(data.vendor);
                } else {
                    console.error('Vendor not found:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching vendor details:', error);
            });
    }, []);

    const handleDownloadPDF = () => {
        const element = qrRef.current;
        const options = {
            margin: 10,
            filename: `QR_${vendor?.name}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().from(element).set(options).save();
    };

    if (!vendor) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-lg font-semibold text-gray-700">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            {/* QR Code Card */}
            <div 
                ref={qrRef} 
                className="bg-white p-8 rounded-2xl shadow-2xl text-center border border-gray-100 transform hover:scale-105 transition-transform duration-300"
            >
                {/* Logo */}
                <img 
                    src={logo} 
                    alt="Menu-Mates Logo" 
                    className="w-28 mx-auto mb-6 filter drop-shadow-lg"
                />

                {/* Vendor Name */}
                <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {vendor.name}
                </h1>

                {/* Vendor Details */}
                <div className="mt-4 space-y-2">
                    <p className="text-gray-600 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {vendor.location}
                    </p>
                    <p className="text-gray-600 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {vendor.contactNumber}
                    </p>
                </div>

                {/* QR Code Section */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Scan QR Code</h2>
                    <img 
                        src={vendor.qrCode} 
                        alt="Vendor QR Code" 
                        className="w-48 mx-auto border-4 border-white rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Download Button */}
            <button
                className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={handleDownloadPDF}
            >
                Download QR Code
            </button>
        </div>
    );
};

export default QRCode;