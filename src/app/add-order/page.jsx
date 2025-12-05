"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddOrderPage() {
    const [description, setDescription] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleProductToggle = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const saveOrder = async () => {
        if (!description.trim()) {
            setError('Please enter an order description');
            return;
        }

        if (selectedProducts.length === 0) {
            setError('Please select at least one product');
            return;
        }

        try {
            setError("");
            setSuccess("");
            
            // Create the order first
            const orderRes = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderDescription: description }),
            });
            
            if (!orderRes.ok) {
                throw new Error(`Order creation failed with status ${orderRes.status}`);
            }
            
            const order = await orderRes.json();

            // Add selected products to the order
            if (selectedProducts.length > 0) {
                const itemsRes = await fetch(`/api/order/${order.id}/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productIds: selectedProducts }),
                });
                
                if (!itemsRes.ok) {
                    throw new Error(`Adding products failed with status ${itemsRes.status}`);
                }
            }

            setSuccess('Order created successfully!');
            setTimeout(() => {
                router.push('/orders');
            }, 1500);
        } catch (error) {
            console.error('Error saving order:', error);
            setError('Failed to save order: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/orders" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 font-medium transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Orders
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Order</h1>
                    <p className="text-gray-600">Fill in the details below to create a new order</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="bg-linear-to-r from-indigo-600 to-indigo-700 h-1"></div>
                    
                    <div className="p-8 md:p-10">
                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                                <p className="text-red-700 font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Success Alert */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                                <p className="text-green-700 font-medium flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {success}
                                </p>
                            </div>
                        )}

                        {/* Description Section */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-3">
                                Order Description
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                                placeholder="Enter order description (e.g., Customer name, special instructions, etc.)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="5"
                            />
                            <p className="text-gray-500 text-sm mt-2">{description.length}/500 characters</p>
                        </div>

                        {/* Products Section */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-4">
                                Select Products
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            
                            <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6">
                                {products.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-gray-600 font-medium">No products available</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {products.map(product => (
                                            <label
                                                key={product.id}
                                                htmlFor={`product-${product.id}`}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-start ${
                                                    selectedProducts.includes(product.id)
                                                        ? 'border-indigo-600 bg-indigo-50'
                                                        : 'border-gray-300 hover:border-indigo-400 bg-white'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`product-${product.id}`}
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleProductToggle(product.id)}
                                                    className="mt-1 w-5 h-5 text-indigo-600 bg-white border-2 border-gray-300 rounded accent-indigo-600 cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all shrink-0"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="font-semibold text-gray-900 text-base">{product.productname}</div>
                                                    <div className="text-sm text-gray-600 mt-1">{product.productdescription}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Count */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-blue-900 font-medium">
                                    <span className="text-lg font-bold text-indigo-600">{selectedProducts.length}</span> product{selectedProducts.length !== 1 ? 's' : ''} selected
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                onClick={saveOrder}
                                disabled={!description.trim() || selectedProducts.length === 0}
                                className="flex-1 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Create Order
                            </button>
                            <Link
                                href="/orders"
                                className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Info Footer */}
                <div className="mt-8 bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
                    <div className="flex">
                        <svg className="w-6 h-6 text-indigo-600 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zm3 1a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900">Tip</h3>
                            <p className="text-gray-600 text-sm mt-1">Provide clear order descriptions and select all required products before submitting.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}