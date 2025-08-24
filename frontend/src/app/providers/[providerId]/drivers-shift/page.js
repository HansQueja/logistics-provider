// src/app/providers/[providerId]/drivers-shift/page.js
'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

// Import components
import StatCard from '@/components/ui/StatCard';
import DashboardFilters from '@/components/driver-shift/DashboardFilters';
import ShiftsTable from '@/components/driver-shift/ShiftsTable';

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

export default function DriversShiftPage() {
    const params = useParams();
    const providerId = params.providerId;

    // --- STATE MANAGEMENT FOR ALL FILTERS ---
    const [rangeType, setRangeType] = useState('daily');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // Applied filter state
    const [appliedFilters, setAppliedFilters] = useState({
        rangeType: 'daily',
        startDate: new Date(),
        endDate: new Date(),
    });

    // --- DATA FETCHING ---
    const apiUrl = `http://127.0.0.1:8000/api/logistic-providers/${providerId}/shifts?range_type=${appliedFilters.rangeType}&start_date=${formatDateForAPI(appliedFilters.startDate)}&end_date=${formatDateForAPI(appliedFilters.endDate)}`;
    const { data: shiftResponse, error: shiftError, isLoading: shiftIsLoading } = useSWR(providerId ? apiUrl : null, fetcher);

    const shiftData = shiftResponse?.data;

    // --- CALCULATIONS BASED ON DATA ---
    const stats = useMemo(() => {
        if (!shiftData) return { totalDrivers: 0, activeShifts: 0, totalHours: 0, avgHours: 0 };

        if (rangeType === 'daily' && shiftData.shifts) {
            const shifts = shiftData.shifts;
            const totalDrivers = shifts.length;
            const activeShifts = shifts.filter(s => parseFloat(s.shift_duration_hours || 0) > 0).length;
            const totalHours = shifts.reduce((sum, s) => sum + (parseFloat(s.shift_duration_hours) || 0), 0);
            const avgHours = totalDrivers > 0 ? (totalHours / totalDrivers).toFixed(1) : 0;

            return { totalDrivers, activeShifts, totalHours: totalHours.toFixed(1), avgHours };
        } else if (shiftData.aggregated_data) {
            const aggregated = shiftData.aggregated_data;
            const totalDrivers = aggregated.length;
            const totalHours = aggregated.reduce((sum, d) => sum + (parseFloat(d.total_hours) || 0), 0);
            const totalDaysWorked = aggregated.reduce((sum, d) => sum + (parseInt(d.days_worked) || 0), 0);
            const avgHours = totalDaysWorked > 0 ? (totalHours / totalDaysWorked).toFixed(1) : 0;

            return { totalDrivers, activeShifts: totalDrivers, totalHours: totalHours.toFixed(1), avgHours };
        }

        return { totalDrivers: 0, activeShifts: 0, totalHours: 0, avgHours: 0 };
    }, [shiftData, rangeType]);

    // Get the appropriate data for the table
    const tableData = useMemo(() => {
        if (!shiftData) return [];
        
        if (rangeType === 'daily' && shiftData.shifts) {
            return shiftData.shifts;
        } else if (shiftData.aggregated_data) {
            return shiftData.aggregated_data;
        }
        
        return [];
    }, [shiftData, rangeType]);

    if (shiftIsLoading) return <div className="text-center text-gray-500">Loading dashboard...</div>;
    if (shiftError) return <div className="text-center text-red-500">Failed to load shift data. Please try again.</div>;

    // --- RENDER THE DASHBOARD ---
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white bg-blue-900 rounded-lg shadow p-4">Driver Shift Dashboard</h1>

            {/* Filter Component */}
            <DashboardFilters
                rangeType={rangeType}
                onRangeTypeChange={setRangeType}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                onApplyFilter={() => setAppliedFilters({ rangeType, startDate, endDate })}
            />

            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Drivers" value={stats.totalDrivers} />
                <StatCard title="Active Shifts" value={stats.activeShifts} />
                <StatCard title="Total Hours" value={stats.totalHours} />
                <StatCard title="Avg Hours/Day" value={stats.avgHours} />
            </div>

            {/* Table Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-white bg-gray-900 rounded shadow p-3 mb-4">
                    Detailed Report for {formatDateForAPI(startDate)} to {formatDateForAPI(endDate)}
                </h2>
                <ShiftsTable data={tableData} rangeType={rangeType} />
            </div>
        </div>
    );
}
