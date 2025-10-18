"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import forestDensityData from "@/data/forest-density-data.json";
import turkeyGeoJSON from "@/data/tr-cities.json";

// Mock fire data for the last 24 hours
const mockFireData = [
  {
    id: 1,
    location: "Muğla - Bodrum",
    lat: 37.0344,
    lon: 27.4305,
    severity: "critical",
    startTime: "18 Ekim 2025, 08:30",
    area: "42 hektar",
    status: "Müdahale devam ediyor",
    treeType: "Kızılçam Ormanı",
    affectedDensity: 85,
  },
  {
    id: 2,
    location: "Antalya - Manavgat",
    lat: 36.7869,
    lon: 31.4442,
    severity: "critical",
    startTime: "18 Ekim 2025, 03:15",
    area: "127 hektar",
    status: "Kontrol altında",
    treeType: "Kızılçam, Sedir",
    affectedDensity: 92,
  },
  {
    id: 3,
    location: "İzmir - Urla",
    lat: 38.3242,
    lon: 26.7692,
    severity: "high",
    startTime: "17 Ekim 2025, 22:45",
    area: "8 hektar",
    status: "Söndürüldü",
    treeType: "Kızılçam, Meşe",
    affectedDensity: 65,
  },
];

// Tree type information with VIBRANT, DISTINCT colors
const treeTypeInfo: Record<string, { color: string; name: string; flammability: number; brightColor: string }> = {
  "Kızılçam": { 
    color: "#D2691E", // Chocolate (daha parlak kahverengi)
    brightColor: "#FF8C42", // Parlak turuncu-kahve
    name: "Kızılçam (Yüksek Risk)", 
    flammability: 85 
  },
  "Karaçam": { 
    color: "#4A7C59", // Forest green (daha parlak koyu yeşil)
    brightColor: "#5FA777", // Parlak orman yeşili
    name: "Karaçam (Orta-Yüksek Risk)", 
    flammability: 70 
  },
  "Ladin": { 
    color: "#228B22", // ForestGreen (parlak orman yeşili)
    brightColor: "#32CD32", // LimeGreen
    name: "Ladin (Düşük Risk)", 
    flammability: 45 
  },
  "Kayın": { 
    color: "#6B8E23", // OliveDrab (parlak zeytin)
    brightColor: "#9ACD32", // YellowGreen
    name: "Kayın (Orta Risk)", 
    flammability: 50 
  },
  "Göknar": { 
    color: "#2E8B57", // SeaGreen (parlak deniz yeşili)
    brightColor: "#3CB371", // MediumSeaGreen
    name: "Göknar (Orta Risk)", 
    flammability: 60 
  },
  "Meşe": { 
    color: "#8B4513", // SaddleBrown (koyu kahve)
    brightColor: "#A0522D", // Sienna
    name: "Meşe (Orta Risk)", 
    flammability: 55 
  },
};

interface FirePopupProps {
  fire: typeof mockFireData[0];
  onClose: () => void;
}

function FirePopup({ fire, onClose }: FirePopupProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "#dc2626";
      case "high": return "#f97316";
      case "medium": return "#fb923c";
      default: return "#4ade80";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical": return "Kritik";
      case "high": return "Yüksek";
      case "medium": return "Orta";
      default: return "Düşük";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2000] p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} onClick={onClose}>
      <div
        className="rounded-2xl max-w-md w-full p-6 transform transition-all border-2"
        style={{
          backgroundColor: '#404040',
          borderColor: getSeverityColor(fire.severity),
          boxShadow: `0 20px 50px ${getSeverityColor(fire.severity)}80`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div style={{ 
              width: '48px', 
              height: '48px',
              background: `radial-gradient(circle, ${getSeverityColor(fire.severity)}, ${getSeverityColor(fire.severity)}dd)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Yangın Detayı</h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: '#00D9A5' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Location */}
          <div className="rounded-xl p-4 border" style={{ 
            backgroundColor: '#505050',
            borderColor: 'rgba(0, 217, 165, 0.3)'
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
                <p className="text-sm font-medium text-gray-300 mb-1">Konum</p>
                <p className="text-lg font-semibold text-white">{fire.location}</p>
              </div>
            </div>
          </div>

          {/* Severity, Area & Density */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl p-3 border" style={{
              backgroundColor: '#505050',
              borderColor: getSeverityColor(fire.severity) + '40'
            }}>
              <p className="text-xs font-medium text-gray-300 mb-1">Şiddet</p>
              <div className="flex items-center justify-center">
                <div className="w-2 h-2 rounded-full animate-pulse mr-1" style={{ backgroundColor: getSeverityColor(fire.severity) }}></div>
                <span className="text-sm font-bold" style={{ color: getSeverityColor(fire.severity) }}>
                  {getSeverityLabel(fire.severity)}
                </span>
              </div>
            </div>

            <div className="rounded-xl p-3 border" style={{
              backgroundColor: '#505050',
              borderColor: 'rgba(0, 217, 165, 0.3)'
            }}>
              <p className="text-xs font-medium text-gray-300 mb-1">Alan</p>
              <p className="text-sm font-bold text-white text-center">{fire.area}</p>
            </div>

            <div className="rounded-xl p-3 border" style={{
              backgroundColor: '#505050',
              borderColor: 'rgba(251, 146, 60, 0.3)'
            }}>
              <p className="text-xs font-medium text-gray-300 mb-1">Yoğunluk</p>
              <p className="text-sm font-bold text-white text-center">%{fire.affectedDensity}</p>
            </div>
          </div>

          {/* Tree Type - VERY Prominent with Flammability Warning */}
          <div className="rounded-xl p-5 border-3 relative overflow-hidden" style={{
            backgroundColor: '#505050',
            borderColor: '#00D9A5',
            borderWidth: '3px',
            boxShadow: '0 0 30px rgba(0, 217, 165, 0.5)'
          }}>
            {/* Glow effect background */}
            <div className="absolute inset-0 opacity-10" style={{
              background: 'radial-gradient(circle at top right, #00D9A5, transparent)'
            }}></div>

            <div className="relative z-10">
              {/* Tree Icon & Title */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)',
                  boxShadow: '0 4px 20px rgba(0, 217, 165, 0.4)'
                }}>
                  <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: '#00D9A5' }}>⚠️ ETKİLENEN AĞAÇ TÜRÜ</p>
                  <p className="text-2xl font-bold text-white leading-tight mt-1">{fire.treeType}</p>
                </div>
              </div>

              {/* Flammability Critical Info */}
              {fire.treeType.includes("Kızılçam") && (
                <div className="rounded-lg p-4 mb-3 border-2 animate-pulse" style={{
                  backgroundColor: '#ef444420',
                  borderColor: '#ef4444'
                }}>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      backgroundColor: '#ef4444'
                    }}>
                      <span className="text-lg">🔥</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white mb-1">KRİTİK: Yüksek Yanıcılık!</h5>
                      <p className="text-xs text-gray-200 leading-relaxed">
                        <strong style={{ color: '#ef4444' }}>Kızılçam</strong>, reçine içeriği nedeniyle 
                        <strong> %85 yanıcılık oranına</strong> sahiptir. Normal ağaçlardan 
                        <strong> 3 kat daha hızlı</strong> tutuşur ve yangın yayılımını hızlandırır.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(fire.treeType.includes("Ladin") || fire.treeType.includes("Karaçam")) && (
                <div className="rounded-lg p-4 mb-3 border-2" style={{
                  backgroundColor: '#fb923c20',
                  borderColor: '#fb923c'
                }}>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
                      backgroundColor: '#fb923c'
                    }}>
                      <span className="text-lg">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white mb-1">DİKKAT: Yüksek Risk!</h5>
                      <p className="text-xs text-gray-200 leading-relaxed">
                        Bu ağaç türü <strong style={{ color: '#fb923c' }}>%70-75 yanıcılık</strong> oranına sahip. 
                        Kuru hava koşullarında hızla tutuşabilir.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Density Impact on Fire Spread */}
              <div className="rounded-lg p-3 border" style={{
                backgroundColor: '#60606020',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-300">Orman Yoğunluğu Etkisi</span>
                  <span className="text-lg font-bold text-white">%{fire.affectedDensity}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#606060' }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${fire.affectedDensity}%`,
                      background: fire.affectedDensity >= 80 
                        ? 'linear-gradient(to right, #ef4444, #dc2626)' 
                        : 'linear-gradient(to right, #fb923c, #f97316)'
                    }}
                  />
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {fire.affectedDensity >= 80 ? (
                    <>🔥 <strong style={{ color: '#ef4444' }}>Çok yoğun orman alanı</strong> - Yangın yayılımı son derece hızlı</>
                  ) : (
                    <>⚡ <strong style={{ color: '#fb923c' }}>Yoğun orman alanı</strong> - Yangın kontrol altına alınması zor</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-xl p-4 border space-y-3" style={{
            backgroundColor: '#505050',
            borderColor: 'rgba(0, 217, 165, 0.2)'
          }}>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-300">Başlangıç:</span>
              <span className="text-sm font-semibold text-white text-right">{fire.startTime}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-300">Durum:</span>
              <span className="text-sm font-semibold text-white text-right">{fire.status}</span>
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

export default function OGMMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const forestLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedFire, setSelectedFire] = useState<typeof mockFireData[0] | null>(null);
  const [showForestDensity, setShowForestDensity] = useState(true);
  const [showTreeTypes, setShowTreeTypes] = useState(true);
  const [showFireRisk, setShowFireRisk] = useState(true);
  const [isLegendOpen, setIsLegendOpen] = useState(false); // For mobile toggle

  // Debug: Log legend state changes
  useEffect(() => {
    console.log('🗺️ Legend State:', isLegendOpen);
  }, [isLegendOpen]);

  // Lock body scroll when legend is open on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isLegendOpen && window.innerWidth < 768) {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
      } else {
        // Restore scroll
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      }
    }

    return () => {
      // Cleanup
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
      }
    };
  }, [isLegendOpen]);

  // Normalize city names
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
    };
    return mapping[name] || name;
  };

  // Get fire risk color
  const getFireRiskColor = (risk: number, opacity: number = 0.6): string => {
    if (risk >= 70) return `rgba(220, 38, 38, ${opacity})`; // red
    if (risk >= 60) return `rgba(249, 115, 22, ${opacity})`; // orange
    if (risk >= 50) return `rgba(251, 146, 60, ${opacity})`; // light orange
    if (risk >= 40) return `rgba(234, 179, 8, ${opacity})`; // yellow
    return `rgba(74, 222, 128, ${opacity})`; // green
  };

  // Get tree type color
  const getTreeTypeColor = (dominantTree: string, opacity: number = 0.5): string => {
    const info = treeTypeInfo[dominantTree];
    if (!info) return `rgba(100, 100, 100, ${opacity})`;
    
    // Convert hex to rgba
    const hex = info.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with satellite/terrain view
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView([39.0, 35.0], 6);

    mapRef.current = map;

    // Satellite/Terrain layer (Google Satellite)
    const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      attribution: 'Google Hybrid'
    });
    satelliteLayer.addTo(map);

    // Create forest overlay layer
    const forestLayer = L.layerGroup();
    forestLayerRef.current = forestLayer;
    forestLayer.addTo(map);

    // Add Turkey regions with forest data
    const features = turkeyGeoJSON.features;
    
    features.forEach((feature: any) => {
      const cityName = normalizeCityName(feature.properties.name);
      const forestData = forestDensityData.find((f: any) => f.cityName === cityName);
      
      if (!forestData) return;

      // Create polygon coordinates
      const createPolygonCoords = (coords: any): L.LatLngExpression[] => {
        if (Array.isArray(coords[0][0])) {
          return coords[0].map((c: number[]) => [c[1], c[0]] as L.LatLngExpression);
        }
        return coords.map((c: number[]) => [c[1], c[0]] as L.LatLngExpression);
      };

      const getCoordinates = (geometry: any): L.LatLngExpression[][] => {
        if (geometry.type === "Polygon") {
          return [createPolygonCoords(geometry.coordinates)];
        } else if (geometry.type === "MultiPolygon") {
          return geometry.coordinates.map((poly: any) => createPolygonCoords(poly));
        }
        return [];
      };

      const coordinates = getCoordinates(feature.geometry);

      coordinates.forEach((coords) => {
        // Forest density & tree type layer with MAXIMUM visibility
        const densityOpacity = (forestData.forestDensity / 100 * 0.5) + 0.35; // Min 0.35, max 0.85
        const treeInfo = treeTypeInfo[forestData.dominantTree];
        const isHighRisk = forestData.fireRisk >= 70;
        
        // Use bright color for fill, regular for border
        const fillColor = treeInfo?.brightColor || treeInfo?.color || '#666';
        const borderColor = treeInfo?.color || '#666';
        
        const forestPolygon = L.polygon(coords, {
          fillColor: fillColor,
          fillOpacity: showTreeTypes && showForestDensity ? densityOpacity : 0, // Much more visible
          color: showTreeTypes ? borderColor : 'transparent',
          weight: showTreeTypes ? (isHighRisk ? 5 : 4) : 0, // Even thicker borders
          opacity: showTreeTypes ? 1 : 0, // Fully opaque borders
          className: showTreeTypes ? 'tree-polygon-enhanced' : '',
        });

        // Fire risk overlay
        const riskOpacity = showFireRisk ? 0.4 : 0;
        const riskColor = getFireRiskColor(forestData.fireRisk, riskOpacity);
        
        const riskPolygon = L.polygon(coords, {
          fillColor: riskColor,
          fillOpacity: riskOpacity,
          color: forestData.fireRisk >= 60 ? '#ef4444' : 'transparent',
          weight: forestData.fireRisk >= 60 ? 2 : 0,
          opacity: forestData.fireRisk >= 60 ? 0.6 : 0,
          dashArray: '5, 5',
        });

        const treeFlammability = treeTypeInfo[forestData.dominantTree]?.flammability || 50;
        const tooltipContent = `
          <div style="font-family: sans-serif; min-width: 240px; max-width: 300px;">
            <div style="font-weight: bold; font-size: 18px; margin-bottom: 10px; color: #00D9A5; border-bottom: 2px solid #00D9A5; padding-bottom: 6px;">
              📍 ${cityName}
            </div>
            
            <!-- TREE TYPE PROMINENT -->
            <div style="margin: 10px 0; padding: 10px; background: rgba(0, 217, 165, 0.1); border-left: 4px solid ${treeTypeInfo[forestData.dominantTree]?.color || '#666'}; border-radius: 4px;">
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <svg width="24" height="24" fill="${treeTypeInfo[forestData.dominantTree]?.color || '#666'}" viewBox="0 0 20 20" style="margin-right: 8px; filter: drop-shadow(0 0 4px ${treeTypeInfo[forestData.dominantTree]?.color || '#666'});">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
                <div>
                  <div style="font-size: 11px; color: #00D9A5; font-weight: 600;">🌲 AĞAÇ TÜRÜ</div>
                  <div style="font-size: 16px; font-weight: bold; color: white;">${forestData.dominantTree}</div>
                </div>
              </div>
              <div style="background: rgba(0,0,0,0.3); padding: 6px; border-radius: 4px; margin-top: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 11px; color: #ccc;">Yanıcılık Oranı:</span>
                  <span style="font-size: 16px; font-weight: bold; color: ${treeFlammability >= 70 ? '#ef4444' : treeFlammability >= 60 ? '#fb923c' : '#4ade80'};">
                    ${treeFlammability >= 70 ? '🔥' : treeFlammability >= 60 ? '⚠️' : '✓'} %${treeFlammability}
                  </span>
                </div>
                ${treeFlammability >= 70 ? '<div style="font-size: 10px; color: #ef4444; margin-top: 4px; font-weight: 600;">⚠️ ÇOK YÜKSEK YANICILIK!</div>' : ''}
              </div>
            </div>
            
            <div style="margin: 8px 0; display: flex; justify-content: space-between; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">
              <span style="font-size: 12px; color: #ccc;">Orman Yoğunluğu:</span>
              <strong style="font-size: 13px; color: white;">%${forestData.forestDensity}</strong>
            </div>
            
            <div style="margin: 8px 0; padding: 8px; background: ${forestData.fireRisk >= 70 ? 'rgba(239, 68, 68, 0.2)' : forestData.fireRisk >= 60 ? 'rgba(251, 146, 60, 0.2)' : 'rgba(74, 222, 128, 0.2)'}; border-radius: 4px; border: 2px solid ${forestData.fireRisk >= 70 ? '#ef4444' : forestData.fireRisk >= 60 ? '#fb923c' : '#4ade80'};">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; font-weight: 600; color: ${forestData.fireRisk >= 70 ? '#ef4444' : forestData.fireRisk >= 60 ? '#fb923c' : '#4ade80'};">
                  ${forestData.fireRisk >= 70 ? '🔥 YANGIN RİSKİ:' : forestData.fireRisk >= 60 ? '⚠️ YANGIN RİSKİ:' : '✓ YANGIN RİSKİ:'}
                </span>
                <strong style="font-size: 16px; color: ${forestData.fireRisk >= 70 ? '#ef4444' : forestData.fireRisk >= 60 ? '#fb923c' : '#4ade80'};">
                  %${forestData.fireRisk}
                </strong>
              </div>
            </div>
            
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px; color: #888; text-align: center;">
              💡 Tıklayarak detaylı bilgi alın
            </div>
          </div>
        `;

        forestPolygon.bindTooltip(tooltipContent, {
          sticky: true,
          className: 'forest-tooltip',
        });
        
        riskPolygon.bindTooltip(tooltipContent, {
          sticky: true,
          className: 'forest-tooltip',
        });

        forestPolygon.addTo(forestLayer);
        riskPolygon.addTo(forestLayer);
      });
    });

    // Custom fire icon with enhanced animation
    const createFireIcon = (severity: string) => {
      const color = severity === "critical" ? "#dc2626" : "#f97316";
      return L.divIcon({
        className: 'custom-fire-marker',
        html: `
          <div style="position: relative; animation: fireFloat 3s ease-in-out infinite;">
            <div style="
              width: 50px;
              height: 50px;
              background: radial-gradient(circle, ${color}, ${color}dd);
              border: 4px solid white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 30px ${color}cc, 0 0 60px ${color}66;
              animation: firePulse 1.5s infinite, fireGlow 2s infinite;
              position: relative;
              z-index: 2;
            ">
              <svg width="28" height="28" fill="white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
              </svg>
            </div>
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 50px;
              height: 50px;
              background: radial-gradient(circle, ${color}44, transparent);
              border-radius: 50%;
              animation: fireRipple 2s infinite;
              z-index: 1;
            "></div>
          </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
      });
    };

    // Add fire markers with enhanced visuals
    mockFireData.forEach((fire) => {
      const marker = L.marker([fire.lat, fire.lon], { icon: createFireIcon(fire.severity) })
        .addTo(map)
        .bindTooltip(`
          <div style="font-family: sans-serif; min-width: 180px;">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 6px; color: #ef4444;">
              🔥 YANGIN
            </div>
            <div style="font-weight: bold; margin: 4px 0;">${fire.location}</div>
            <div style="margin: 4px 0; font-size: 12px;">Alan: ${fire.area}</div>
            <div style="margin: 4px 0; font-size: 12px; color: #00D9A5;">${fire.treeType}</div>
          </div>
        `, {
          permanent: false,
          direction: 'top',
          className: 'fire-tooltip',
          offset: [0, -25]
        });

      marker.on('click', () => {
        setSelectedFire(fire);
      });
    });

    // Add CSS for animations and enhanced visuals
    const style = document.createElement('style');
    style.textContent = `
      @keyframes firePulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.85; }
      }
      @keyframes fireGlow {
        0%, 100% { box-shadow: 0 0 30px currentColor, 0 0 60px currentColor; }
        50% { box-shadow: 0 0 50px currentColor, 0 0 100px currentColor; }
      }
      @keyframes fireRipple {
        0% { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      @keyframes fireFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* Enhanced tree polygon visibility with stronger effects */
      .tree-polygon-enhanced {
        filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5)) 
                drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))
                brightness(1.1) 
                contrast(1.2);
      }
      
      /* Leaflet polygon path enhancement */
      .leaflet-interactive {
        transition: all 0.2s ease !important;
      }
      
      .leaflet-interactive:hover {
        filter: brightness(1.2) contrast(1.3) !important;
      }
      
      /* Enhanced tooltips */
      .fire-tooltip, .forest-tooltip {
        background-color: rgba(48, 48, 48, 0.98) !important;
        border: 2px solid #00D9A5 !important;
        color: white !important;
        font-weight: 500 !important;
        padding: 14px !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 217, 165, 0.5) !important;
        backdrop-filter: blur(12px) !important;
        max-width: 320px !important;
      }
      .fire-tooltip::before, .forest-tooltip::before {
        border-top-color: #00D9A5 !important;
      }
      .leaflet-popup-content-wrapper {
        background-color: rgba(48, 48, 48, 0.95) !important;
        border: 2px solid #00D9A5 !important;
        border-radius: 12px !important;
      }
      
      /* Desktop Legend Styles */
      @media (min-width: 768px) {
        .legend-scroll {
          position: absolute !important;
          top: 16px !important;
          right: 16px !important;
          width: auto !important;
          height: auto !important;
          min-width: 280px !important;
          max-width: 320px !important;
          max-height: 85vh !important;
          border-radius: 16px !important;
          padding-bottom: 16px !important;
          transform: translateX(0) !important; /* Force visible on desktop */
        }
        
        /* Hide mobile close button on desktop */
        .mobile-close-header {
          display: none !important;
        }
      }
      
      /* Mobile Responsive Styles */
      @media (max-width: 768px) {
        .map-container-responsive {
          height: 450px !important;
          border-radius: 8px !important;
        }
        
        .fire-tooltip, .forest-tooltip {
          max-width: 280px !important;
          padding: 12px !important;
          font-size: 13px !important;
        }
        
        .leaflet-popup-content-wrapper {
          max-width: 90vw !important;
        }
        
        /* Touch-friendly checkbox */
        .touch-checkbox {
          transform: scale(1.2);
        }
        
        /* Better touch targets */
        .leaflet-control-zoom a {
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 24px !important;
        }
        
        /* Tooltip positioning for mobile */
        .leaflet-tooltip {
          font-size: 12px !important;
          padding: 8px !important;
        }
        
        /* Prevent scroll on legend panel when open */
        body.legend-open {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
        }
        
        /* Legend scroll isolation */
        .legend-scroll {
          overscroll-behavior: contain;
          touch-action: pan-y;
        }
      }
      
      @media (max-width: 480px) {
        .map-container-responsive {
          height: 400px !important;
        }
        
        .fire-tooltip, .forest-tooltip {
          max-width: 260px !important;
          padding: 10px !important;
          font-size: 12px !important;
        }
      }
      
      /* Smooth scroll for legend */
      .legend-scroll {
        scrollbar-width: thin;
        scrollbar-color: #00D9A5 rgba(48, 48, 48, 0.5);
        transition: transform 300ms ease-in-out;
      }
      
      /* Mobile: Hidden by default, show when open */
      @media (max-width: 767px) {
        .legend-scroll {
          transform: translateX(100%);
        }
        
        .legend-scroll[data-open="true"] {
          transform: translateX(0) !important;
        }
      }
      
      .legend-scroll::-webkit-scrollbar {
        width: 6px;
      }
      
      .legend-scroll::-webkit-scrollbar-track {
        background: rgba(48, 48, 48, 0.5);
        border-radius: 3px;
      }
      
      .legend-scroll::-webkit-scrollbar-thumb {
        background: #00D9A5;
        border-radius: 3px;
      }
      
      .legend-scroll::-webkit-scrollbar-thumb:hover {
        background: #00FFC6;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      document.head.removeChild(style);
    };
  }, []);

  // Update layer visibility
  useEffect(() => {
    if (!forestLayerRef.current || !mapRef.current) return;

    forestLayerRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Polygon) {
        const options = layer.options;
        if (options.dashArray) {
          // Fire risk layer
          layer.setStyle({
            fillOpacity: showFireRisk ? 0.4 : 0,
            opacity: showFireRisk && options.weight > 0 ? 0.6 : 0,
          });
        } else {
          // Tree type layer
          const originalOpacity = parseFloat(layer.options.fillColor?.split(',')[3]?.replace(')', '') || '0.5');
          layer.setStyle({
            fillOpacity: showTreeTypes && showForestDensity ? originalOpacity : 0,
            weight: showTreeTypes ? 2 : 0,
            opacity: showTreeTypes ? 0.8 : 0,
          });
        }
      }
    });
  }, [showForestDensity, showTreeTypes, showFireRisk]);

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Backdrop Overlay - Mobile Only */}
        {isLegendOpen && (
          <div
            className="md:hidden"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 999,
              animation: 'fadeIn 0.3s ease-in-out'
            }}
            onClick={() => setIsLegendOpen(false)}
            onTouchStart={(e) => {
              e.preventDefault();
            }}
          />
        )}

        {/* Mobile Legend Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔘 Toggle clicked! Current state:', isLegendOpen, '→ New state:', !isLegendOpen);
            setIsLegendOpen(!isLegendOpen);
          }}
          className="md:hidden"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1002,
            backgroundColor: 'rgba(0, 217, 165, 0.95)',
            border: '2px solid #00D9A5',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 217, 165, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isLegendOpen ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Enhanced Legend & Controls - Responsive */}
        <div 
          className="legend-scroll"
          data-open={isLegendOpen ? "true" : "false"}
          style={{
            // Base mobile styles
            position: 'fixed',
            top: '0',
            right: '0',
            zIndex: 1000,
            backgroundColor: 'rgba(48, 48, 48, 0.98)',
            borderRadius: '0',
            padding: '16px',
            paddingBottom: '32px',
            border: '2px solid #00D9A5',
            boxShadow: '0 8px 32px rgba(0, 217, 165, 0.3)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            height: '100vh',
            maxHeight: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}
          onClick={(e) => {
            // Prevent clicks inside panel from closing it
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            // Allow scrolling inside panel
            e.stopPropagation();
          }}
        >
          {/* Mobile Close Button (inside panel) */}
          <div className="mobile-close-header md:hidden flex justify-between items-center mb-4 pb-4 border-b border-[#00D9A5]">
            <h3 style={{ color: '#00D9A5', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>
              🗺️ Harita Katmanları
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLegendOpen(false);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#00D9A5',
                cursor: 'pointer',
                padding: '8px',
                minWidth: '40px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h3 style={{ color: '#00D9A5', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ marginRight: '8px' }}>
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
            </svg>
            Harita Katmanları
          </h3>

          {/* Layer Controls - Touch Friendly */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '12px', 
              cursor: 'pointer', 
              color: 'white',
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 217, 165, 0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 217, 165, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 217, 165, 0.1)'}
            >
              <input 
                type="checkbox" 
                checked={showTreeTypes} 
                onChange={(e) => setShowTreeTypes(e.target.checked)}
                className="touch-checkbox"
                style={{ 
                  marginRight: '12px', 
                  width: '20px', 
                  height: '20px', 
                  accentColor: '#00D9A5',
                  cursor: 'pointer',
                  minWidth: '20px'
                }}
              />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>🌲 Ağaç Türleri</span>
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '12px', 
              cursor: 'pointer', 
              color: 'white',
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 217, 165, 0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 217, 165, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 217, 165, 0.1)'}
            >
              <input 
                type="checkbox" 
                checked={showForestDensity} 
                onChange={(e) => setShowForestDensity(e.target.checked)}
                className="touch-checkbox"
                style={{ 
                  marginRight: '12px', 
                  width: '20px', 
                  height: '20px', 
                  accentColor: '#00D9A5',
                  cursor: 'pointer',
                  minWidth: '20px'
                }}
              />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>🌳 Orman Yoğunluğu</span>
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              color: 'white',
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 217, 165, 0.1)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 217, 165, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 217, 165, 0.1)'}
            >
              <input 
                type="checkbox" 
                checked={showFireRisk} 
                onChange={(e) => setShowFireRisk(e.target.checked)}
                className="touch-checkbox"
                style={{ 
                  marginRight: '12px', 
                  width: '20px', 
                  height: '20px', 
                  accentColor: '#00D9A5',
                  cursor: 'pointer',
                  minWidth: '20px'
                }}
              />
              <span style={{ fontSize: '15px', fontWeight: '600' }}>⚠️ Yangın Risk Bölgeleri</span>
            </label>
          </div>

          <div style={{ borderTop: '1px solid rgba(0, 217, 165, 0.3)', paddingTop: '12px', marginTop: '12px' }}>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>
              🌲 Ağaç Türleri (Haritadaki Renkler)
            </h4>
            {Object.entries(treeTypeInfo).map(([key, info]) => (
              <div key={key} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '10px',
                padding: '6px',
                borderRadius: '6px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: `2px solid ${info.color}30`
              }}>
                {/* Larger color box with gradient */}
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: `linear-gradient(135deg, ${info.brightColor}, ${info.color})`,
                  borderRadius: '6px', 
                  marginRight: '10px',
                  border: `3px solid ${info.color}`,
                  boxShadow: `0 0 10px ${info.color}80, inset 0 0 10px rgba(255,255,255,0.2)`,
                  flexShrink: 0
                }}></div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: 'white', 
                    fontSize: '13px', 
                    fontWeight: '600',
                    marginBottom: '2px'
                  }}>
                    {key}
                  </div>
                  <div style={{ 
                    fontSize: '10px', 
                    color: info.flammability >= 70 ? '#ef4444' : info.flammability >= 60 ? '#fb923c' : '#4ade80'
                  }}>
                    {info.flammability >= 70 ? '🔥' : info.flammability >= 60 ? '⚠️' : '✓'} Yanıcılık: %{info.flammability}
                  </div>
                </div>
              </div>
            ))}
            <div style={{
              marginTop: '12px',
              padding: '8px',
              background: 'rgba(0, 217, 165, 0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(0, 217, 165, 0.3)'
            }}>
              <p style={{ fontSize: '11px', color: '#00D9A5', margin: 0, textAlign: 'center' }}>
                💡 Daha parlak renkler = Daha yoğun orman
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(0, 217, 165, 0.3)', paddingTop: '12px', marginTop: '12px' }}>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>🔥 Yangın Durumu</h4>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#dc2626', 
                borderRadius: '50%', 
                marginRight: '8px',
                boxShadow: '0 0 10px #dc2626'
              }}></div>
              <span style={{ color: 'white', fontSize: '13px' }}>Aktif Yangın (Kritik)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#f97316', 
                borderRadius: '50%', 
                marginRight: '8px',
                boxShadow: '0 0 10px #f97316'
              }}></div>
              <span style={{ color: 'white', fontSize: '13px' }}>Aktif Yangın (Yüksek)</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(0, 217, 165, 0.3)', paddingTop: '12px', marginTop: '12px' }}>
            <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' }}>⚠️ Risk Seviyeleri</h4>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: 'rgba(220, 38, 38, 0.6)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span style={{ color: 'white', fontSize: '12px' }}>Çok Yüksek (≥70%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: 'rgba(249, 115, 22, 0.6)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span style={{ color: 'white', fontSize: '12px' }}>Yüksek (60-69%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: 'rgba(251, 146, 60, 0.6)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span style={{ color: 'white', fontSize: '12px' }}>Orta-Yüksek (50-59%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: 'rgba(234, 179, 8, 0.6)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span style={{ color: 'white', fontSize: '12px' }}>Orta (40-49%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '20px', height: '12px', backgroundColor: 'rgba(74, 222, 128, 0.6)', marginRight: '8px', borderRadius: '2px' }}></div>
              <span style={{ color: 'white', fontSize: '12px' }}>Düşük (&lt;40%)</span>
            </div>
          </div>
        </div>

        {/* Map Container - Responsive Height */}
        <div
          ref={mapContainerRef}
          className="map-container-responsive"
          style={{
            width: "100%",
            height: "600px",
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
          }}
        />
      </div>

      {selectedFire && (
        <FirePopup fire={selectedFire} onClose={() => setSelectedFire(null)} />
      )}
    </>
  );
}
