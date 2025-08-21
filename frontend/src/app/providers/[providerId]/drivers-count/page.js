'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import StatCard from '@/components/ui/StatCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DriversPage() {
    const params = useParams();
    const providerId = params.providerId;

    const apiUrl = `http://localhost:8000/api/logistic-providers/${providerId}/assigned-drivers-count`;
    const { data, error, isLoading } = useSWR(providerId ? apiUrl : null, fetcher);

    if (isLoading) return <div className="text-center text-gray-500">Loading drivers...</div>;
    if (error) return <div className="text-center text-red-500">Failed to load drivers.</div>;
    if (!data) return null;

    console.log(data);
    const { company_name, assigned_drivers_count, drivers_list } = data;

    return (
        <div className="space-y-8">
            {/* Provider Info */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold text-gray-800">{company_name}</h1>
                <p className="text-gray-500">Logistic Provider</p>
            </div>

            {/* Stat Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Drivers" value={assigned_drivers_count} />
            </div>

            {/* Drivers List */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 px-6 py-4 border-b">Assigned Drivers</h2>
                {drivers_list?.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {drivers_list.map((driver) => (
                            <li
                                key={driver.id}
                                className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">{driver.name}</p>
                                    <p className="text-sm text-gray-500">Vehicle ID: {driver.assigned_vehicle_id}</p>
                                </div>
                                <span
                                    className={`px-3 py-1 text-sm rounded-full ${
                                        driver.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {driver.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 px-6 py-4">No drivers assigned yet.</p>
                )}
            </div>
        </div>
    );
}
