// src/app/providers/[providerId]/delivery-heatmap/page.js
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

const fetcher = (url) => fetch(url).then((res) => res.json());

const Heatmap = dynamic(() => import('@/components/delivery-heatmap/Heatmap'), {
    ssr: false,
    loading: () => <div className="text-center p-10 font-semibold text-white-500">Loading Map...</div>
});

export default function DeliveryHeatmapPage() {
    const params = useParams();
    const providerId = params.providerId;

    // Fetch the PRE-GEOCODED location data directly from your Laravel endpoint.
    // This is now ONE single, fast API call.
    const { data: locations, error, isLoading } = useSWR(
        providerId ? `http://127.0.0.1:8000/api/logistic-providers/${providerId}/locations` : null,
        fetcher
    );

    if (isLoading) return <div>Loading heatmap data from the database...</div>;
    if (error) return <div>Failed to load heatmap data. Please ensure the backend is running.</div>;
    // Handle the custom "no records" message from your API
    if (!locations || locations.length === 0 || locations.message) {
        return <div>No delivery locations found for this provider. Add one using the form!</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-white-900">
                Delivery Heatmap
            </h1>
            <p className="text-white-600">
                Showing the geographic concentration of all delivery locations.
            </p>
            <div className="rounded-lg overflow-hidden shadow-lg border">
                {/* The Heatmap component receives the location data directly */}
                <Heatmap points={locations} />
            </div>
        </div>
    );
}