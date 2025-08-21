'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DriversPage() {
  const params = useParams();
  const providerId = params.providerId;

  const apiUrl = `http://localhost:8000/api/logistic-providers/${providerId}/assigned-drivers-count`;
  const { data, error, isLoading } = useSWR(providerId ? apiUrl : null, fetcher);

  if (isLoading) return <div className="text-center text-gray-500">Loading drivers...</div>;
  if (error) return <div className="text-center text-red-500">Failed to load drivers.</div>;
  if (!data) return null;

  console.log(data);
  const { company_name, assigned_drivers_count, drivers_list } = data;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold">Assigned Drivers</h1>

      {/* Company Name + Total Drivers in one card */}
      <div className="bg-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{company_name}</h2>
          <p className="text-gray-500">Logistics Provider</p>
        </div>
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <p className="text-lg font-semibold text-gray-700">Total Drivers</p>
          <p className="text-3xl font-bold text-indigo-600">{assigned_drivers_count}</p>
        </div>
      </div>

      {/* Drivers Table */}
      {drivers_list?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Vehicle ID</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers_list.map((driver, index) => (
                <tr
                  key={driver.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-3 text-black">{driver.id}</td>
                  <td className="px-6 py-3 font-medium text-black">{driver.name}</td>
                  <td className="px-6 py-3 text-black">{driver.assigned_vehicle_id}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        driver.status === 'LINKED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No drivers assigned yet.</p>
      )}
    </div>
  );
}
