// src/components/delivery-form/NewDeliveryForm.js
'use client';

import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const NewDeliveryForm = ({ providerId }) => {
    // --- State for the form inputs ---
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('IN--PROGRESS');
    const [driverId, setDriverId] = useState(''); // State for the selected driver

    // --- State for handling submission feedback ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // To show success or error messages

    // --- Fetch the list of drivers for this provider ---
    const { data: drivers, error: driversError } = useSWR(
        providerId ? `http://127.0.0.1:8000/api/logistic-providers/${providerId}/drivers` : null,
        fetcher
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        if (!driverId) {
            setMessage({ type: 'error', text: 'Please select a driver.' });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/logistic-providers/${providerId}/delivery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    address,
                    status,
                    driver_id: driverId
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 422 && result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join(' ');
                    throw new Error(errorMessages);
                }
                throw new Error(result.message || 'An unknown error occurred.');
            }

            setMessage({ type: 'success', text: result.message || 'Delivery created successfully!' });
            setAddress('');
            setStatus('IN-PROGRESS');
            setDriverId('');

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Delivery Details</h2>

                {/* Driver Select Dropdown */}
                <div>
                    <label htmlFor="driver" className="block text-sm font-medium text-gray-700">Assign Driver</label>
                    <select
                        id="driver"
                        value={driverId}
                        onChange={(e) => setDriverId(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-bold text-gray-900"
                        disabled={!drivers || driversError}
                    >
                        <option value="" disabled>
                            {driversError ? 'Error loading drivers' : (drivers ? 'Select a driver...' : 'Loading drivers...')}
                        </option>
                        {drivers && drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Address Input */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="e.g., SM Megamall, Mandaluyong"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-bold text-gray-900"
                    />
                </div>

                {/* Status Select */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-bold text-gray-900"
                    >
                        <option value="IN-PROGRESS">In Progress</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                    {isSubmitting ? 'Saving...' : 'Create Delivery'}
                </button>

                {/* Feedback Message Area */}
                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default NewDeliveryForm;