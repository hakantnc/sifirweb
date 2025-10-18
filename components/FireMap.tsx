"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fire icon
const fireIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ef4444' width='32' height='32'%3E%3Cpath d='M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface FireMapProps {
  height?: string;
  fireLocation: [number, number];
  windDirection: string;
  windSpeed: number;
}

// Helper to calculate wind direction angle
const getWindAngle = (direction: string): number => {
  const directions: { [key: string]: number } = {
    K: 0,    // Kuzey (North)
    KB: 45,  // Kuzey Batı
    B: 90,   // Batı (West)
    GB: 135, // Güney Batı
    G: 180,  // Güney (South)
    GD: 225, // Güney Doğu
    D: 270,  // Doğu (East)
    KD: 315, // Kuzey Doğu
  };
  return directions[direction] || 0;
};

// Calculate spread direction based on wind
const calculateSpreadCenter = (
  fireLocation: [number, number],
  windDirection: string,
  windSpeed: number
): [number, number] => {
  const angle = getWindAngle(windDirection);
  // Convert to radians and adjust for map orientation
  const radians = ((angle + 180) * Math.PI) / 180;
  
  // Distance factor based on wind speed (km/h to degrees roughly)
  const distanceFactor = (windSpeed / 100) * 0.02;
  
  const lat = fireLocation[0] + Math.cos(radians) * distanceFactor;
  const lng = fireLocation[1] + Math.sin(radians) * distanceFactor;
  
  return [lat, lng];
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
}

export default function FireMap({
  height = "500px",
  fireLocation,
  windDirection,
  windSpeed,
}: FireMapProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-full rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center"
        style={{ height, backgroundColor: "#505050" }}
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Harita yükleniyor...</p>
        </div>
      </div>
    );
  }

  const spreadCenter = calculateSpreadCenter(fireLocation, windDirection, windSpeed);

  return (
    <div style={{ height, width: "100%" }} className="rounded-lg sm:rounded-xl overflow-hidden">
      <MapContainer
        center={fireLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <MapUpdater center={fireLocation} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Yellow danger zone (potential spread) */}
        <Circle
          center={spreadCenter}
          radius={800}
          pathOptions={{
            color: "#fbbf24",
            fillColor: "#fbbf24",
            fillOpacity: 0.35,
            weight: 2,
          }}
        />

        {/* Red fire zone */}
        <Circle
          center={fireLocation}
          radius={400}
          pathOptions={{
            color: "#ef4444",
            fillColor: "#ef4444",
            fillOpacity: 0.6,
            weight: 3,
          }}
        />

        {/* Fire marker */}
        <Marker position={fireLocation} icon={fireIcon}>
          <Popup>
            <div className="text-center p-2">
              <strong className="text-red-600 text-lg">🔥 Yangın Tespit Edildi</strong>
              <p className="mt-2 text-sm">
                <strong>Koordinat:</strong> {fireLocation[0].toFixed(4)}, {fireLocation[1].toFixed(4)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Rüzgar: {windSpeed} km/h - {windDirection}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Wind direction arrow */}
        <Polyline
          positions={[
            fireLocation,
            [
              fireLocation[0] + Math.cos(((getWindAngle(windDirection) + 180) * Math.PI) / 180) * 0.01,
              fireLocation[1] + Math.sin(((getWindAngle(windDirection) + 180) * Math.PI) / 180) * 0.01,
            ],
          ]}
          pathOptions={{
            color: "#3b82f6",
            weight: 4,
            opacity: 0.8,
          }}
        />
      </MapContainer>
    </div>
  );
}

