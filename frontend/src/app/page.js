'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [shiftData, setShiftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    providerId: 1, // Default to first provider
    rangeType: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchShiftData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        range_type: filters.rangeType,
        start_date: filters.startDate,
        end_date: filters.endDate
      });

      const response = await fetch(`http://localhost:8000/api/logistic-providers/${filters.providerId}/shifts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setShiftData(data.data);
      } else {
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error fetching shift data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg p-8 mb-0">
          <h1 className="text-4xl font-bold mb-2">
            🏎️ Logistics Provider Dashboard
          </h1>
          <p className="text-blue-100 text-lg">Driver Shift Tracking & Management</p>
        </div>

        {/* Filters Section with Light Background */}
        <div className="bg-white p-6 shadow-lg border-l border-r border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Filters & Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Provider ID with Light Styling */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                🏢 Provider ID
              </label>
              <select
                name="providerId"
                value={filters.providerId}
                onChange={handleFilterChange}
                className="w-full px-4 py-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-50 font-bold text-lg shadow-lg hover:shadow-xl transition duration-200"
              >
                <option value={1} className="bg-white text-black font-semibold">1 - Swift Logistics</option>
                <option value={2} className="bg-white text-black font-semibold">2 - Express Delivery Co</option>
                <option value={3} className="bg-white text-black font-semibold">3 - Metro Transport Ltd</option>
                <option value={4} className="bg-white text-black font-semibold">4 - Global Freight Services</option>
              </select>
            </div>

            {/* Range Type with Light Styling */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                📅 Range Type
              </label>
              <select
                name="rangeType"
                value={filters.rangeType}
                onChange={handleFilterChange}
                className="w-full px-4 py-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-50 font-bold text-lg shadow-lg hover:shadow-xl transition duration-200"
              >
                <option value="daily" className="bg-white text-black font-semibold">📊 Daily View</option>
                <option value="weekly" className="bg-white text-black font-semibold">📈 Weekly Summary</option>
                <option value="monthly" className="bg-white text-black font-semibold">📉 Monthly Summary</option>
              </select>
            </div>

            {/* Start Date with Light Styling */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                🗓️ Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-50 font-bold text-lg shadow-lg hover:shadow-xl transition duration-200"
              />
            </div>

            {/* End Date with Light Styling */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                📅 End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-4 bg-white text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-gray-50 font-bold text-lg shadow-lg hover:shadow-xl transition duration-200"
              />
            </div>
          </div>

          {/* Apply Button with Enhanced Styling */}
          <div className="mt-8">
            <button
              onClick={fetchShiftData}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-lg transition duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-lg"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Loading...
                </>
              ) : (
                <>🔄 Apply Filters</>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-b-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              📋 Shift Data Results
            </h2>
            {shiftData && (
              <div className="text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border">
                <strong>Period:</strong> {shiftData.start_date} to {shiftData.end_date} | 
                <strong className="ml-2">View:</strong> {shiftData.range_type}
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 text-xl font-semibold">Loading shift data...</p>
            </div>
          )}

          {!loading && !shiftData && (
            <div className="text-center py-16">
              <div className="text-gray-500 text-xl">No data available.</div>
              <div className="text-gray-400 mt-2">Try adjusting your filters.</div>
            </div>
          )}

          {!loading && shiftData && (
            <div>
              {filters.rangeType === 'daily' && shiftData.shifts && shiftData.shifts.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">👤 Driver</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">📅 Date</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">🕐 First IN</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">🕕 Last OUT</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">⏰ Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shiftData.shifts.map((shift, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {shift.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {shift.shift_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {shift.first_scan_in ? new Date(shift.first_scan_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {shift.last_scan_out ? new Date(shift.last_scan_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '🔴 Ongoing'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                              shift.shift_duration_hours >= 8 
                                ? 'bg-green-200 text-green-800' 
                                : shift.shift_duration_hours >= 4
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {shift.shift_duration_hours > 0 ? `${shift.shift_duration_hours}h` : 'Invalid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(filters.rangeType === 'weekly' || filters.rangeType === 'monthly') && shiftData.aggregated_data && shiftData.aggregated_data.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">👤 Driver</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">📅 Period Start</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">📊 Days Worked</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">⏰ Total Hours</th>
                        <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">📈 Avg Shift</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shiftData.aggregated_data.map((driver) => (
                        <tr key={driver.driver_id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            {driver.driver_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {driver.period_start}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-blue-200 text-blue-800">
                              {driver.days_worked} days
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-purple-200 text-purple-800">
                              {driver.total_hours}h
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-green-200 text-green-800">
                              {driver.avg_shift_hours}h
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(!shiftData.shifts || shiftData.shifts.length === 0) && 
               (!shiftData.aggregated_data || shiftData.aggregated_data.length === 0) && (
                <div className="text-center py-16">
                  <div className="text-gray-500 text-xl">No shift data found for the selected criteria.</div>
                  <div className="text-gray-400 mt-2">Try selecting a different provider or date range.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
