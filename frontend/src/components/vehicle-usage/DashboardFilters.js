// src/components/vehicle-usage/DashboardFilters.js
'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DashboardFilters = ({
    // Props for existing filters
    vehicleTypes,
    selectedType,
    onTypeChange,
    selectedDate,
    onDateChange,
    // --- NEW PROPS FOR NEW FILTERS ---
    usageHours,
    onUsageHoursChange,
    showActiveOnly,
    onShowActiveOnlyChange,
    maxHours // To set the slider's max value
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">

                {/* Vehicle Type Filter (existing) */}
                <div>
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                    <select
                        id="vehicleType"
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                        <option value="all">All Types</option>
                        {vehicleTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                    </select>
                </div>

                {/* Date Picker Filter (existing) */}
                <div>
                    <label htmlFor="datePicker" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <DatePicker
                        id="datePicker"
                        selected={selectedDate}
                        onChange={(date) => onDateChange(date)}
                        dateFormat="yyyy-MM-dd"
                        className="block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                </div>

                {/* --- NEW: Usage Hours Slider --- */}
                <div>
                    <label htmlFor="usageHours" className="block text-sm font-medium text-gray-700 mb-1">
                        Min Usage Hours: <span className="font-bold text-indigo-600">{usageHours}</span>
                    </label>
                    <input
                        type="range"
                        id="usageHours"
                        min="0"
                        max={maxHours} // Dynamically set the max based on data
                        value={usageHours}
                        onChange={(e) => onUsageHoursChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* --- NEW: Active Vehicles Toggle Switch --- */}
                <div className="flex items-center justify-center h-full pb-2">
                    <label htmlFor="activeOnlyToggle" className="flex items-center cursor-pointer">
                        <span className="mr-3 text-sm font-medium text-gray-900">Show Active Only</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="activeOnlyToggle"
                                className="sr-only" // Hide the default checkbox
                                checked={showActiveOnly}
                                onChange={(e) => onShowActiveOnlyChange(e.target.checked)}
                            />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showActiveOnly ? 'transform translate-x-6 bg-indigo-400' : ''}`}></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default DashboardFilters;