// src/components/StatCard.js
'use client';

import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        // Added shadow-lg and a subtle hover effect
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
                {icon && <div className="mr-4 text-3xl text-indigo-500">{icon}</div>}
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-blue-700">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;