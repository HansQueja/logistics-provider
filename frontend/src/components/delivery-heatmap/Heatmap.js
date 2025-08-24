// src/components/delivery-heatmap/Heatmap.js
'use client';

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import 'leaflet/dist/leaflet.css';

const Heatmap = ({ points }) => {
    // Leaflet's HeatmapLayer expects an array of [lat, lng, intensity]
    const heatmapPoints = points.map(p => [p.latitude, p.longitude, 1.0]);

    return (
        // --- UPDATED MAP VIEW TO FOCUS ON MANILA ---
        <MapContainer center={[14.5995, 120.9842]} zoom={11} style={{ height: '600px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {heatmapPoints.length > 0 && (
                <HeatmapLayer
                    points={heatmapPoints}
                    longitudeExtractor={m => m[1]}
                    latitudeExtractor={m => m[0]}
                    intensityExtractor={m => parseFloat(m[2])}
                    radius={30} // Increased radius for better visibility on a city map
                    blur={25}
                />
            )}
        </MapContainer>
    );
};

export default Heatmap;