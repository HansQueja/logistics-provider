// src/components/driver-shift/ShiftsTable.js
'use client';

import React from 'react';

const ShiftsTable = ({ data, rangeType }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No shift data available for the selected filters.</p>
                <p className="text-sm mt-2">Try adjusting the date range or view type.</p>
            </div>
        );
    }

    // Render different table structures based on range type
    if (rangeType === 'daily') {
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First IN</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last OUT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((shift, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                    {shift.name || 'Unknown Driver'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {shift.shift_date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {shift.first_scan_in ? new Date(shift.first_scan_in).toLocaleTimeString() : 'No scan'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {shift.last_scan_out ? new Date(shift.last_scan_out).toLocaleTimeString() : 'Ongoing'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {parseFloat(shift.shift_duration_hours || 0).toFixed(1)} hours
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Weekly/Monthly aggregated view
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period Start</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Worked</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Hours/Day</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((driver, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {driver.driver_name || 'Unknown Driver'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {driver.period_start}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {driver.days_worked} days
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {driver.total_hours} hours
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {parseFloat(driver.avg_shift_hours || 0).toFixed(1)} hours
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShiftsTable;
