'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const DeliveryHeatmap = dynamic(() => import('../../components/DeliveryHeatmap'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

export default function HeatmapPage() {
  const [locations, setLocations] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    providerId: 'all',
    status: 'all'
  });

  // Provider list matching Hans's approach
  const providers = [
    { id: 1, name: 'Swift Logistics' },
    { id: 2, name: 'Express Delivery Co' },
    { id: 3, name: 'Metro Transport Ltd' },
    { id: 4, name: 'Global Freight Services' }
  ];

  const fetchLocationData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url;
      if (filters.providerId === 'all') {
        url = 'http://localhost:8000/api/logistic-providers/locations';
      } else {
        url = `http://localhost:8000/api/logistic-providers/${filters.providerId}/locations`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Filter locations with valid coordinates
        const validLocations = data.filter(location => 
          location.latitude && 
          location.longitude && 
          !isNaN(location.latitude) && 
          !isNaN(location.longitude)
        );
        setLocations(validLocations);
      } else if (data.message) {
        setLocations([]);
        console.log('API message:', data.message);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setError(error.message);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter locations based on status
  const filteredLocations = locations.filter(location => {
    if (filters.status === 'all') return true;
    return location.status === filters.status;
  });

  // Stats for the sidebar (following Hans's approach)
  const stats = {
    total: locations.length,
    active: locations.filter(loc => loc.status === 'ACTIVE').length,
    inactive: locations.filter(loc => loc.status === 'INACTIVE').length,
    withCoordinates: locations.filter(loc => loc.latitude && loc.longitude).length
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header following Hans's gradient style */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 text-center shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Thumbworx 2.0 - Delivery Location Heatmap</h1>
        <p className="opacity-90">Real-time geographic distribution and activity analysis</p>
      </div>

      {/* Main container with sidebar and map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar following Hans's design */}
        <div className="w-80 bg-white border-r border-gray-300 overflow-y-auto shadow-lg">
          {/* Stats section */}
          <div className="bg-blue-600 text-white p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs opacity-90">Total Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.active}</div>
                <div className="text-xs opacity-90">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.inactive}</div>
                <div className="text-xs opacity-90">Inactive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.withCoordinates}</div>
                <div className="text-xs opacity-90">Mapped</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-5">
            <h3 className="font-bold text-gray-800 mb-4">Filters</h3>
            
            <div className="space-y-4">
              {/* Provider Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logistic Provider
                </label>
                <select
                  name="providerId"
                  value={filters.providerId}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Providers</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchLocationData}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Refresh Data'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                Error: {error}
              </div>
            )}
          </div>

          {/* Location List */}
          <div className="p-5 pt-0">
            <h3 className="font-bold text-gray-800 mb-4">
              Locations ({filteredLocations.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className={`bg-gray-50 rounded-lg p-4 border-l-4 ${
                    location.status === 'ACTIVE' ? 'border-green-500' : 'border-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                      location.status === 'ACTIVE' 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {location.status || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-500">ID: {location.id}</span>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium text-gray-800 mb-1">
                      {location.address || 'No Address'}
                    </div>
                    <div className="text-gray-600 text-xs">
                      📍 {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
                    </div>
                    {location.type && (
                      <div className="text-gray-600 text-xs mt-1">
                        Type: {location.type}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Map controls following Hans's style */}
          <div className="absolute top-3 right-3 z-[1000] flex gap-2">
            <button
              onClick={fetchLocationData}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-md border"
            >
              Refresh Map
            </button>
          </div>

          {/* Map Component */}
          <div className="w-full h-full">
            <DeliveryHeatmap 
              locations={filteredLocations}
              loading={loading}
              error={error}
            />
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-2 rounded-full text-sm z-[1000]">
            {loading ? 'Loading...' : `${filteredLocations.length} locations shown`}
          </div>
        </div>
      </div>
    </div>
  );
}
