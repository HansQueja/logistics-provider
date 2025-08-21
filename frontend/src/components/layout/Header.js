// src/components/layout/Header.js
import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-gray-900 shadow-md">
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
                        <ul className="flex space-x-8 text-gray-300 font-medium">
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
                            {/* --- NEW NAVIGATION LINK --- */}
                            <li>
                                <Link
                                    href="/providers/1/delivery-heatmap" // Points to the new page
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Delivery Heatmap
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