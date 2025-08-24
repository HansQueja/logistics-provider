// src/components/driver-shift/DashboardFilters.js
'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DashboardFilters = ({
    rangeType,
    onRangeTypeChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-end">

                {/* Range Type Filter */}
                <div>
                    <label htmlFor="rangeType" className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
                    <select
                        id="rangeType"
                        value={rangeType}
                        onChange={(e) => onRangeTypeChange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                        <option value="daily">Daily View</option>
                        <option value="weekly">Weekly Summary</option>
                        <option value="monthly">Monthly Summary</option>
                    </select>
                </div>

                {/* Start Date Filter */}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <DatePicker
                        id="startDate"
                        selected={startDate}
                        onChange={(date) => onStartDateChange(date)}
                        dateFormat="yyyy-MM-dd"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                </div>

                {/* End Date Filter */}
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <DatePicker
                        id="endDate"
                        selected={endDate}
                        onChange={(date) => onEndDateChange(date)}
                        dateFormat="yyyy-MM-dd"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardFilters;
