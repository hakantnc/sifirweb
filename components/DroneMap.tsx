"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Drone marker icon with pulsing animation
const createDroneIcon = () => {
  return L.divIcon({
    className: "custom-drone-marker",
    html: `
      <div style="position: relative;">
        <div style="
          width: 20px;
          height: 20px;
          background-color: #ef4444;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
          animation: pulse 1.5s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: -5px;
          left: -5px;
          width: 30px;
          height: 30px;
          border: 2px solid #ef4444;
          border-radius: 50%;
          opacity: 0.5;
          animation: ripple 1.5s ease-out infinite;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Component to update map view
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

interface DroneMapProps {
  height?: string;
}

// Devriye rotası - orman bölgesinde bir döngü (component dışında tanımla)
const PATROL_PATH: [number, number][] = [
  [40.277827, 30.221618], // Başlangıç
  [40.278200, 30.222000], // Kuzeydoğu
  [40.278500, 30.222400], // Daha kuzeydoğu
  [40.278700, 30.222100], // Doğu
  [40.278800, 30.221500], // Güneydoğu
  [40.278600, 30.221000], // Güney
  [40.278200, 30.220700], // Güneybatı
  [40.277800, 30.220900], // Batı
  [40.277500, 30.221300], // Kuzeybatı
  [40.277827, 30.221618], // Başlangıca dön
];

export default function DroneMap({ height = "500px" }: DroneMapProps) {
  const [mounted, setMounted] = useState(false);
  const [dronePosition, setDronePosition] = useState<[number, number]>([40.277827, 30.221618]);
  const [pathIndex, setPathIndex] = useState(0);
  const zoom = 15;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Drone hareketi - smooth interpolation ile hareket
  useEffect(() => {
    let currentStep = 0;
    const stepsPerSegment = 30; // Her segment için 30 adım (smooth hareket)
    
    const moveInterval = setInterval(() => {
      currentStep++;
      
      if (currentStep >= stepsPerSegment) {
        // Sonraki segment'e geç
        currentStep = 0;
        setPathIndex((prev) => (prev + 1) % PATROL_PATH.length);
      } else {
        // Mevcut ve sonraki nokta arasında interpolasyon yap
        const currentIndex = pathIndex;
        const nextIndex = (pathIndex + 1) % PATROL_PATH.length;
        const progress = currentStep / stepsPerSegment;
        
        const currentPoint = PATROL_PATH[currentIndex];
        const nextPoint = PATROL_PATH[nextIndex];
        
        const lat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * progress;
        const lng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * progress;
        
        setDronePosition([lat, lng]);
      }
    }, 100); // Her 100ms'de güncelle (smooth hareket)

    return () => clearInterval(moveInterval);
  }, [pathIndex]);

  if (!mounted) {
    return (
      <div 
        className="w-full rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center"
        style={{ height, backgroundColor: '#505050' }}
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Harita yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
        }
        
        @media (min-width: 640px) {
          .leaflet-container {
            border-radius: 0.75rem;
          }
        }
        
        .custom-drone-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      
      <div className="relative w-full rounded-lg sm:rounded-xl overflow-hidden" style={{ height }}>
        <MapContainer
          center={dronePosition}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={dronePosition} icon={createDroneIcon()}>
            <Popup>
              <div className="text-center p-2">
                <p className="font-bold text-red-600 mb-1">🚁 Drone Aktif</p>
                <p className="text-xs text-gray-600">
                  Konum: {dronePosition[0].toFixed(6)}, {dronePosition[1].toFixed(6)}
                </p>
                <p className="text-xs text-gray-600">Yükseklik: 120m</p>
                <p className="text-xs text-green-600 font-semibold mt-1">Orman Devriyesi</p>
              </div>
            </Popup>
          </Marker>
          
          <MapUpdater center={PATROL_PATH[0]} zoom={zoom} />
        </MapContainer>
        
        {/* Overlay controls */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/70 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg z-[1000]">
          <p className="text-white text-xs sm:text-sm font-mono">
            <span className="text-gray-400">Konum:</span> {dronePosition[0].toFixed(5)}°N, {dronePosition[1].toFixed(5)}°E
          </p>
          <p className="text-white text-xs sm:text-sm font-mono">
            <span className="text-gray-400">Yükseklik:</span> 120m
          </p>
        </div>
      </div>
    </>
  );
}

