"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [productCounts, setProductCounts] = useState({});
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/order');
            const data = await res.json();
            setOrders(data);

            // Fetch product counts for each order
            const counts = {};
            for (const order of data) {
                try {
                    const itemRes = await fetch(`/api/order/${order.id}/items`);
                    const items = await itemRes.json();
                    counts[order.id] = items.length;
                } catch (error) {
                    console.error(`Error fetching items for order ${order.id}:`, error);
                    counts[order.id] = 0;
                }
            }
            setProductCounts(counts);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filtered = orders.filter(
        order => 
            order.orderdescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
                    <p className="text-gray-600">View and manage all your orders</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
                    <div className="bg-linear-to-r from-indigo-600 to-indigo-700 h-1"></div>
                    
                    <div className="p-8 md:p-10">
                        {/* Search Section */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-3">
                                Search Orders
                            </label>
                            <div className="relative">
                                <svg className="absolute left-4 top-3.5 w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by order ID or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 placeholder-gray-700 bg-white"
                                />
                            </div>
                        </div>

                        {/* Results Info */}
                        <div className="mb-6 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                            <p className="text-indigo-900 font-medium">
                                Showing <span className="font-bold text-indigo-600">{filtered.length}</span> of <span className="font-bold text-indigo-600">{orders.length}</span> order{orders.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Table Section */}
                        {filtered.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-600 font-medium text-lg">No orders found</p>
                                <p className="text-gray-500 mt-2">Create a new order to get started</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b-2 border-gray-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Products</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created At</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filtered.map((order, index) => (
                                            <tr 
                                                key={order.id} 
                                                className={`hover:bg-indigo-50 transition-colors ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                            >
                                                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{order.orderdescription}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
                                                        {productCounts[order.id] ?? 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(order.createdat).toLocaleDateString()} at {new Date(order.createdat).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex gap-2">
                                                        <button
                                                            onClick={() => router.push(`/add-order?id=${order.id}`)}
                                                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-3 rounded shadow-sm transition-all"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm(`Delete order ${order.id}? This cannot be undone.`)) return;
                                                                try {
                                                                    const res = await fetch(`/api/order/${order.id}`, { method: 'DELETE' });
                                                                    if (!res.ok) throw new Error('Delete failed');
                                                                    // Refresh orders
                                                                    await fetchOrders();
                                                                } catch (err) {
                                                                    console.error('Error deleting order:', err);
                                                                    alert('Failed to delete order');
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-3 rounded shadow-sm transition-all"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add New Order Button */}
                <div className="flex gap-4 justify-center mb-8">
                    <Link 
                        href="/add-order"
                        className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Order
                    </Link>
                </div>

                {/* Footer Info */}
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
                    <div className="flex">
                        <svg className="w-6 h-6 text-indigo-600 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zm3 1a1 1 0 11-2 0 1 1 0 012 0zm3 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-gray-900">Quick Stats</h3>
                            <p className="text-gray-600 text-sm mt-1">Total orders: <span className="font-bold text-indigo-600">{orders.length}</span> | Total products: <span className="font-bold text-indigo-600">{Object.values(productCounts).reduce((a, b) => a + b, 0)}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
