// src/components/Footer.js
import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-auto">
            <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-700">
                <p className="text-sm">&copy; {new Date().getFullYear()} Thumbworx Logistics. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
