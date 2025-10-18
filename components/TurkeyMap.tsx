"use client";

import { useState } from "react";
import citiesData from "@/data/cities-data.json";
import turkeyGeoJSON from "@/data/Turkey-Maps-GeoJSON/tr-cities.json";

interface CityData {
  id: number;
  name: string;
  fireRisk: number;
  treeType: string;
  forestRatio: number;
}

interface CityPopupProps {
  city: CityData;
  onClose: () => void;
}

function CityPopup({ city, onClose }: CityPopupProps) {
  const getRiskColor = (risk: number) => {
    if (risk >= 60) return "text-red-600";
    if (risk >= 40) return "text-orange-500";
    return "text-green-600";
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 60) return "Yüksek Risk";
    if (risk >= 40) return "Orta Risk";
    return "Düşük Risk";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} onClick={onClose}>
      <div
        className="rounded-2xl max-w-md w-full p-6 transform transition-all border-2"
        style={{
          backgroundColor: '#404040',
          borderColor: '#00D9A5',
          boxShadow: '0 20px 50px rgba(0, 217, 165, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{city.name}</h2>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: '#00D9A5' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Fire Risk */}
          <div className="rounded-xl p-4 border" style={{ 
            backgroundColor: '#505050',
            borderColor: 'rgba(0, 217, 165, 0.2)'
          }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Yangın Olasılığı</span>
              <span className={`text-sm font-bold ${getRiskColor(city.fireRisk)}`}>
                {getRiskLabel(city.fireRisk)}
              </span>
            </div>
            <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: '#606060' }}>
              <div
                className={`h-3 rounded-full transition-all ${
                  city.fireRisk >= 60
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : city.fireRisk >= 40
                    ? "bg-gradient-to-r from-orange-400 to-orange-500"
                    : "bg-gradient-to-r from-green-400 to-green-500"
                }`}
                style={{ width: `${city.fireRisk}%` }}
              />
            </div>
            <span className="text-2xl font-bold text-white">%{city.fireRisk}</span>
          </div>

          {/* Tree Type */}
          <div className="rounded-xl p-4 border" style={{
            backgroundColor: '#505050',
            borderColor: 'rgba(0, 217, 165, 0.2)'
          }}>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
              }}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-300 mb-1">Genel Ağaç Tipi</p>
                <p className="text-lg font-semibold text-white">{city.treeType}</p>
              </div>
            </div>
          </div>

          {/* Forest Ratio */}
          <div className="rounded-xl p-4 border" style={{
            backgroundColor: '#505050',
            borderColor: 'rgba(0, 217, 165, 0.2)'
          }}>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
              }}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-300 mb-1">Orman Oranı</p>
                <p className="text-3xl font-bold text-white">%{city.forestRatio}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(to right, #00D9A5, #00A87E)',
            boxShadow: '0 4px 15px rgba(0, 217, 165, 0.4)'
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}

// GeoJSON koordinatlarını SVG koordinatlarına dönüştürme
function projectCoordinates(coords: number[][]): string {
  // Türkiye'nin sınırları (yaklaşık)
  const minLon = 26;
  const maxLon = 45;
  const minLat = 36;
  const maxLat = 42;
  
  // SVG viewBox boyutları
  const width = 1000;
  const height = 500;
  
  return coords.map(([lon, lat]) => {
    // Longitude ve latitude'ü SVG koordinatlarına çevir
    const x = ((lon - minLon) / (maxLon - minLon)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

function createPathFromGeometry(geometry: any): string {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring: number[][]) => {
      const points = projectCoordinates(ring);
      return `M ${points} Z`;
    }).join(' ');
  } else if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map((polygon: number[][][]) => {
      return polygon.map((ring: number[][]) => {
        const points = projectCoordinates(ring);
        return `M ${points} Z`;
      }).join(' ');
    }).join(' ');
  }
  return '';
}

export default function TurkeyMap() {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // GeoJSON'daki encoding sorunlu isimleri düzelt
  const normalizeCityName = (name: string): string => {
    const mapping: Record<string, string> = {
      "K\u0131r\u0131kkale": "Kırıkkale",
      "K\u0131rklareli": "Kırklareli",
      "K\u0131r\u015fehir": "Kırşehir",
      "K\u00fctahya": "Kütahya",
      "\u015eanl\u0131urfa": "Şanlıurfa",
      "�?anl��urfa": "Şanlıurfa",
      "\u015e\u0131rnak": "Şırnak",
      "�?��rnak": "Şırnak",
      "Tekirda\u011f": "Tekirdağ",
      "U\u015fak": "Uşak",
      "K��r��kkale": "Kırıkkale",
      "K��rklareli": "Kırklareli", 
      "K��r�Yehir": "Kırşehir",
      "KǬtahya": "Kütahya",
      "Tekirda�Y": "Tekirdağ",
      "U�Yak": "Uşak"
    };
    return mapping[name] || name;
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 60) return "#dc2626"; // red-600
    if (risk >= 40) return "#f97316"; // orange-500
    return "#16a34a"; // green-600
  };

  const getStrokeColor = (cityName: string) => {
    const normalizedName = normalizeCityName(cityName);
    const city = (citiesData as CityData[]).find(c => c.name === normalizedName);
    if (!city) return "#4ade80"; // green-400 (default)
    
    if (city.fireRisk >= 60) return "#ef4444"; // red-500 - Yüksek Risk
    if (city.fireRisk >= 40) return "#fb923c"; // orange-400 - Orta Risk
    return "#4ade80"; // green-400 - Düşük Risk
  };

  return (
    <section id="harita" className="min-h-screen relative py-12" style={{ backgroundColor: '#303030' }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#303030]/80 via-transparent to-[#303030]/80 pointer-events-none"></div>
      
      <div className="w-full px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Türkiye Yangın Risk Haritası
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            İllere tıklayarak detaylı yangın riski, ağaç tipleri ve orman oranı bilgilerine ulaşabilirsiniz
          </p>

           {/* Legend */}
           <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 flex-wrap">
             <div className="flex items-center space-x-2 bg-[#404040] px-4 py-2 rounded-lg border-2" style={{ borderColor: '#4ade80' }}>
               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4ade80' }}></div>
               <span className="text-sm text-gray-200 font-medium">Düşük Risk (&lt;40%)</span>
             </div>
             <div className="flex items-center space-x-2 bg-[#404040] px-4 py-2 rounded-lg border-2" style={{ borderColor: '#fb923c' }}>
               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#fb923c' }}></div>
               <span className="text-sm text-gray-200 font-medium">Orta Risk (40-59%)</span>
             </div>
             <div className="flex items-center space-x-2 bg-[#404040] px-4 py-2 rounded-lg border-2" style={{ borderColor: '#ef4444' }}>
               <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
               <span className="text-sm text-gray-200 font-medium">Yüksek Risk (≥60%)</span>
             </div>
           </div>
        </div>

         {/* Map Container - Full Width */}
         <div className="w-full mx-auto" style={{ maxWidth: "75vw" }}>
           <div className="w-full">
             <svg
               viewBox="0 0 1000 500"
               className="w-full h-auto"
               style={{ filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))" }}
             >
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3"/>
                </filter>
              </defs>

               {/* Render each city from GeoJSON */}
               {turkeyGeoJSON.features.map((feature: any) => {
                 const cityName = feature.properties.name;
                 const normalizedName = normalizeCityName(cityName);
                 const path = createPathFromGeometry(feature.geometry);
                 const isHovered = hoveredCity === normalizedName;
                 const city = (citiesData as CityData[]).find(c => c.name === normalizedName);
                 const strokeColor = getStrokeColor(cityName);

                 return (
                   <path
                     key={feature.properties.number}
                     d={path}
                     fill="rgba(64, 64, 64, 0.3)"
                     stroke={strokeColor}
                     strokeWidth={isHovered ? "3" : "2"}
                     className="cursor-pointer transition-all duration-200"
                     style={{
                       opacity: isHovered ? 1 : 0.9,
                       filter: isHovered ? `drop-shadow(0 0 10px ${strokeColor})` : "none",
                     }}
                     onClick={() => city && setSelectedCity(city)}
                     onMouseEnter={() => setHoveredCity(normalizedName)}
                     onMouseLeave={() => setHoveredCity(null)}
                   >
                     <title>{normalizedName}</title>
                   </path>
                 );
               })}

              {/* City labels for hovered city */}
              {hoveredCity && turkeyGeoJSON.features.map((feature: any) => {
                const featureName = normalizeCityName(feature.properties.name);
                if (featureName !== hoveredCity) return null;
                
                const strokeColor = getStrokeColor(feature.properties.name);
                
                // Calculate centroid (simplified - using first coordinate)
                const geometry = feature.geometry;
                let coords = geometry.type === "Polygon" 
                  ? geometry.coordinates[0] 
                  : geometry.coordinates[0][0];
                
                // Find approximate center
                const centerLon = coords.reduce((sum: number, c: number[]) => sum + c[0], 0) / coords.length;
                const centerLat = coords.reduce((sum: number, c: number[]) => sum + c[1], 0) / coords.length;
                
                const minLon = 26, maxLon = 45, minLat = 36, maxLat = 42;
                const width = 1000, height = 500;
                const x = ((centerLon - minLon) / (maxLon - minLon)) * width;
                const y = height - ((centerLat - minLat) / (maxLat - minLat)) * height;

                return (
                  <text
                    key={`label-${feature.properties.number}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    fill={strokeColor}
                    fontSize="20"
                    fontWeight="bold"
                    className="pointer-events-none"
                    style={{ 
                      textShadow: "0 0 8px rgba(0, 0, 0, 0.9), 0 0 12px rgba(0, 0, 0, 0.9)",
                      paintOrder: "stroke fill",
                      filter: `drop-shadow(0 0 6px ${strokeColor})`
                    }}
                  >
                    {hoveredCity}
                  </text>
                );
              })}
            </svg>
          </div>

           {/* Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
             <div className="text-center p-6 bg-[#404040] rounded-xl border-2 hover:scale-105 transition-all" style={{ borderColor: '#ef4444' }}>
               <p className="text-4xl font-bold" style={{ color: '#ef4444' }}>
                 {(citiesData as CityData[]).filter(c => c.fireRisk >= 60).length}
               </p>
               <p className="text-sm text-gray-300 mt-2 font-medium">Yüksek Riskli İl</p>
             </div>
             <div className="text-center p-6 bg-[#404040] rounded-xl border-2 hover:scale-105 transition-all" style={{ borderColor: '#fb923c' }}>
               <p className="text-4xl font-bold" style={{ color: '#fb923c' }}>
                 {(citiesData as CityData[]).filter(c => c.fireRisk >= 40 && c.fireRisk < 60).length}
               </p>
               <p className="text-sm text-gray-300 mt-2 font-medium">Orta Riskli İl</p>
             </div>
             <div className="text-center p-6 bg-[#404040] rounded-xl border-2 hover:scale-105 transition-all" style={{ borderColor: '#4ade80' }}>
               <p className="text-4xl font-bold" style={{ color: '#4ade80' }}>
                 {(citiesData as CityData[]).filter(c => c.fireRisk < 40).length}
               </p>
               <p className="text-sm text-gray-300 mt-2 font-medium">Düşük Riskli İl</p>
             </div>
           </div>
        </div>
      </div>

      {/* City Detail Popup */}
      {selectedCity && (
        <CityPopup city={selectedCity} onClose={() => setSelectedCity(null)} />
      )}
    </section>
  );
}
