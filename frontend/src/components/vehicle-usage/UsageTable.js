// src/components/UsageTable.js
'use client';

import React from 'react';

const UsageTable = ({ data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Scan In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Scan Out</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((vehicle) => (
                        <tr key={vehicle.vehicle_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vehicle.plate_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vehicle.vehicle_type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vehicle.usage_hours}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vehicle.first_scan_in || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vehicle.last_scan_out || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsageTable;