// src/components/ui/StatCard.js
import React from 'react';

const StatCard = ({ title, value, className = "" }) => {
    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}>
            <div className="flex flex-col">
                <dt className="text-sm font-medium text-gray-500 truncate">
                    {title}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {value}
                </dd>
            </div>
        </div>
    );
};

export default StatCard;
