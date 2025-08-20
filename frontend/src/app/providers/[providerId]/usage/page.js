// src/app/providers/[providerId]/usage/page.js
'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

// Import all our components from their new locations
import UsageBarChart from '@/components/vehicle-usage/UsageBarChart';
import UsageTable from '@/components/vehicle-usage/UsageTable';
import StatCard from '@/components/ui/StatCard';
import VehicleTypePieChart from '@/components/vehicle-usage/VehicleTypePieChart';
import DashboardFilters from '@/components/vehicle-usage/DashboardFilters';
import ActivityLineChart from '@/components/vehicle-usage/ActivityLineChart';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Helper to format date to YYYY-MM-DD
const formatDateForAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

export default function VehicleUsagePage() {
    const params = useParams();
    const providerId = params.providerId;

    // --- STATE MANAGEMENT FOR ALL FILTERS ---
    const [selectedType, setSelectedType] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [usageHours, setUsageHours] = useState(0); // For the slider, default to 0
    const [showActiveOnly, setShowActiveOnly] = useState(false); // For the toggle, default to false

    // --- DATA FETCHING ---
    const apiUrl = `http://127.0.0.1:8000/api/logistic-providers/${providerId}/vehicle-usage?date=${formatDateForAPI(selectedDate)}`;
    const { data: usageData, error: usageError, isLoading: usageIsLoading } = useSWR(providerId ? apiUrl : null, fetcher);
    const { data: trendData, error: trendError, isLoading: trendIsLoading } = useSWR(providerId ? `http://127.0.0.1:8000/api/logistic-providers/${providerId}/activity-trend` : null, fetcher);

    // --- ENHANCED FILTERED DATA LOGIC ---
    const filteredData = useMemo(() => {
        if (!usageData) return [];
        
        return usageData.filter(vehicle => {
            // Filter by Vehicle Type
            const typeMatch = selectedType === 'all' || vehicle.vehicle_type === selectedType;
            // Filter by Minimum Usage Hours
            const hoursMatch = vehicle.usage_hours >= usageHours;
            // Filter by Active Only toggle
            const activeMatch = !showActiveOnly || vehicle.usage_hours > 0;

            return typeMatch && hoursMatch && activeMatch;
        });
    }, [usageData, selectedType, usageHours, showActiveOnly]);

    if (usageIsLoading) return <div className="text-center text-gray-500">Loading dashboard...</div>;
    if (usageError) return <div className="text-center text-red-500">Failed to load daily data. Please try again.</div>;

    const vehicleTypes = usageData ? [...new Set(usageData.map(v => v.vehicle_type))] : [];
    const maxHours = usageData ? Math.max(...usageData.map(v => v.usage_hours), 10) : 10;
    
    // --- CALCULATIONS BASED ON FILTERED DATA ---
    const totalVehicles = filteredData.length;
    const activeVehicles = filteredData.filter(v => v.usage_hours > 0).length;
    const totalUsageHours = filteredData.reduce((sum, v) => sum + v.usage_hours, 0);
    const utilizationRate = totalVehicles > 0 ? ((activeVehicles / totalVehicles) * 100).toFixed(1) : 0;

    // --- RENDER THE DASHBOARD ---
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white-900">Vehicle Usage Dashboard</h1>

            {/* Filter Component - now with more props! */}
            <DashboardFilters
                vehicleTypes={vehicleTypes}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                usageHours={usageHours}
                onUsageHoursChange={setUsageHours}
                showActiveOnly={showActiveOnly}
                onShowActiveOnlyChange={setShowActiveOnly}
                maxHours={maxHours}
            />

            {/* Stat Cards Section - Now updates based on filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Vehicles (Filtered)" value={totalVehicles} />
                <StatCard title="Active (Filtered)" value={activeVehicles} />
                <StatCard title="Total Fleet Hours (Filtered)" value={totalUsageHours} />
                <StatCard title="Utilization Rate (Filtered)" value={`${utilizationRate}%`} />
            </div>

            {/* Line Chart Section for Activity Trend */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Activity Trend</h2>
                {trendIsLoading && <p>Loading trend data...</p>}
                {trendError && <p className="text-red-500">Could not load trend data.</p>}
                {trendData && trendData.length > 0 ? (
                    <ActivityLineChart data={{
                        labels: trendData.map(d => d.date),
                        datasets: [
                            {
                                label: 'Scan Ins',
                                data: trendData.map(d => d.total_scan_ins),
                                borderColor: 'rgb(54, 162, 235)',
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                tension: 0.1,
                            },
                            {
                                label: 'Scan Outs',
                                data: trendData.map(d => d.total_scan_outs),
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                tension: 0.1,
                            },
                        ],
                    }} />
                ) : !trendIsLoading && <p>No historical data available to show a trend.</p>}
            </div>

            {/* Bar and Pie Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Daily Usage Hours</h2>
                    {filteredData.length > 0 ? (
                        <UsageBarChart data={{
                            labels: filteredData.map(v => v.plate_number),
                            datasets: [{
                                label: 'Usage Hours',
                                data: filteredData.map(v => v.usage_hours),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            }],
                        }} />
                    ) : <p className="text-gray-500">No data for this filter selection.</p>}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Vehicle Types</h2>
                     {filteredData.length > 0 ? (
                        <VehicleTypePieChart data={{
                            labels: [...new Set(filteredData.map(v => v.vehicle_type))],
                            datasets: [{
                                data: [...new Set(filteredData.map(v => v.vehicle_type))].map(
                                    type => filteredData.filter(v => v.vehicle_type === type).length
                                ),
                                backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                            }],
                        }} />
                    ) : <p className="text-gray-500">No data for this filter selection.</p>}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Detailed Report for {formatDateForAPI(selectedDate)}</h2>
                {filteredData.length > 0 ? <UsageTable data={filteredData} /> : <p className="text-gray-500">No data for this filter selection.</p>}
            </div>
        </div>
    );
}