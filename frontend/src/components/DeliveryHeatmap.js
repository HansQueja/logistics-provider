'use client';

import { useEffect, useRef, useState } from 'react';

export default function DeliveryHeatmap({ locations = [], loading = false, error = null }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Fix for default markers (following Hans's approach)
        delete L.default.Icon.Default.prototype._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Initialize map if not already done
        if (!mapInstance.current && mapRef.current) {
          // Center on Metro Manila (following Hans's geographic focus)
          mapInstance.current = L.default.map(mapRef.current).setView([14.6091, 121.0223], 11);

          // Add tile layer with proper attribution
          L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(mapInstance.current);

          // Add scale control
          L.default.control.scale().addTo(mapInstance.current);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstance.current) return;

    const updateMarkers = async () => {
      try {
        const L = await import('leaflet');

        // Clear existing markers
        markersRef.current.forEach(marker => {
          mapInstance.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Create custom icons for different statuses (following Hans's style)
        const createIcon = (status) => {
          const color = status === 'ACTIVE' ? '#28a745' : '#6c757d';
          return L.default.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background-color: ${color};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: white;
                font-weight: bold;
              ">
                ${status === 'ACTIVE' ? '●' : '○'}
              </div>
            `,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
            popupAnchor: [0, -13]
          });
        };

        // Add markers for each location
        locations.forEach((location) => {
          if (location.latitude && location.longitude) {
            const marker = L.default.marker(
              [location.latitude, location.longitude],
              { 
                icon: createIcon(location.status)
              }
            );
            
            // Create popup content following Hans's detailed info style
            const popupContent = `
              <div style="min-width: 200px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px; margin: -10px -10px 10px -10px; border-radius: 8px 8px 0 0;">
                  <strong style="font-size: 14px;">Location #${location.id}</strong>
                  <div style="font-size: 11px; opacity: 0.9; margin-top: 2px;">
                    Status: ${location.status || 'Unknown'}
                  </div>
                </div>
                
                <div style="padding: 5px 0;">
                  <div style="margin-bottom: 8px;">
                    <strong>Address:</strong><br>
                    <span style="color: #666; font-size: 13px;">${location.address || 'No address provided'}</span>
                  </div>
                  
                  <div style="margin-bottom: 8px;">
                    <strong>Coordinates:</strong><br>
                    <span style="color: #666; font-size: 12px; font-family: monospace;">
                      ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
                    </span>
                  </div>
                  
                  ${location.type ? `
                    <div style="margin-bottom: 8px;">
                      <strong>Type:</strong> <span style="color: #666;">${location.type}</span>
                    </div>
                  ` : ''}
                  
                  <div style="border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px;">
                    <span style="background: ${location.status === 'ACTIVE' ? '#d4edda' : '#e2e3e5'}; 
                                 color: ${location.status === 'ACTIVE' ? '#155724' : '#383d41'}; 
                                 padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                      ${location.status || 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>
            `;
            
            marker.bindPopup(popupContent, {
              maxWidth: 300,
              className: 'custom-popup'
            });
            
            marker.addTo(mapInstance.current);
            markersRef.current.push(marker);
          }
        });

        // Fit map to show all markers if there are any (following Hans's auto-zoom)
        if (locations.length > 0) {
          const validLocations = locations.filter(loc => 
            loc.latitude && 
            loc.longitude && 
            !isNaN(loc.latitude) && 
            !isNaN(loc.longitude)
          );
          
          if (validLocations.length > 0) {
            const group = new L.default.featureGroup(
              validLocations.map(loc => 
                L.default.marker([loc.latitude, loc.longitude])
              )
            );
            
            // Add some padding to the bounds
            const bounds = group.getBounds();
            if (bounds.isValid()) {
              mapInstance.current.fitBounds(bounds.pad(0.1));
            }
          }
        }
      } catch (error) {
        console.error('Error updating markers:', error);
      }
    };

    updateMarkers();
  }, [locations]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Map Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Custom CSS for map styling */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: none;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 10px;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.8);
          font-size: 10px;
        }
        
        .custom-marker {
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .custom-marker:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
}
