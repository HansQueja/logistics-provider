// src/components/layout/Header.js
import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-indigo-600 shadow-md">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo / Brand Name */}
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="text-2xl font-extrabold text-white tracking-wide hover:text-indigo-400 transition-colors duration-300 cursor-pointer">
                            Thumbworx Logistics
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav>
                        {/* Use items-center to vertically align the new button with the text links */}
                        <ul className="flex items-center space-x-8 text-gray-300 font-medium">
                            <li>
                                <Link
                                    href="/providers/1/drivers-count"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Drivers Count
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/providers/1/drivers-shift"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Drivers Shift
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/providers/1/usage"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Vehicle Usage
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/providers/1/delivery-heatmap"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Delivery Heatmap
                                </Link>
                            </li>
                            
                            {/* --- NEW LINK TO THE DELIVERY FORM --- */}
                            <li>
                                <Link
                                    href="/deliveries/new"
                                    className="bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                                >
                                    + New Delivery
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;