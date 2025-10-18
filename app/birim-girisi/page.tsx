"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

// Dynamic import to avoid SSR issues with Leaflet
const DroneMap = dynamic(() => import("@/components/DroneMap"), {
  ssr: false,
  loading: () => (
    <div 
      className="w-full rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center"
      style={{ height: "500px", backgroundColor: '#505050' }}
    >
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Harita yükleniyor...</p>
      </div>
    </div>
  ),
});

const FireMap = dynamic(() => import("@/components/FireMap"), {
  ssr: false,
  loading: () => (
    <div 
      className="w-full rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center"
      style={{ height: "500px", backgroundColor: '#505050' }}
    >
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Harita yükleniyor...</p>
      </div>
    </div>
  ),
});

export default function BirimGirisiPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<"Malatya" | "Mugla" | "">("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [droneCharge, setDroneCharge] = useState(87);
  const [nextPatrolTime, setNextPatrolTime] = useState(15 * 60); // 15 dakika (saniye cinsinden)
  const [currentTime, setCurrentTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  // Real-time stats
  const [fireRisk, setFireRisk] = useState(3); // Yangın olasılığı % (Login ile ayarlanır)
  const [movementDetected, setMovementDetected] = useState(0); // Hareket oranı %
  const [windSpeed, setWindSpeed] = useState(15); // Rüzgar hızı km/h
  const [windDirection, setWindDirection] = useState("KB"); // Rüzgar yönü
  const [temperature, setTemperature] = useState(28); // Sıcaklık (Login ile ayarlanır)
  
  // Fire detection data (for Mugla user)
  const [fireLocation] = useState<[number, number]>([37.0892, 28.7458]); // Muğla orman bölgesi (Köyceğiz yakınları)
  const [firePotential, setFirePotential] = useState(85); // Yangın potansiyeli % (80-90 aralığında)
  const [fireGrowthRate, setFireGrowthRate] = useState(12); // Büyüme oranı %
  const [showFireImage, setShowFireImage] = useState(false); // Fire detection image modal
  const [showDetailedReport, setShowDetailedReport] = useState(false); // Detailed report modal
  const [showDroneVideo, setShowDroneVideo] = useState(false); // Drone video modal (for Malatya)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "Malatya" && password === "admin") {
      setIsLoggedIn(true);
      setCurrentUser("Malatya");
      setFireRisk(3); // Normal kullanıcı için düşük risk
      setTemperature(28); // Normal sıcaklık
      setError("");
    } else if (username === "Mugla" && password === "admin") {
      setIsLoggedIn(true);
      setCurrentUser("Mugla");
      setFireRisk(88); // Yangın tespit edilen bölge için yüksek risk
      setTemperature(73); // Yüksek yangın bölgesi sıcaklığı
      setError("");
    } else {
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  // Mount check for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Current time updater
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('tr-TR'));
    };
    
    updateTime(); // Initial update
    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNextPatrolTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate real-time movement detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate movement between 0-15%
      const randomMovement = Math.floor(Math.random() * 16);
      setMovementDetected(randomMovement);
      
      // Slightly fluctuate wind speed (12-18 km/h)
      const randomWind = 12 + Math.floor(Math.random() * 7);
      setWindSpeed(randomWind);
      
      // Occasionally change wind direction
      if (Math.random() > 0.95) {
        const directions = ["K", "KB", "B", "GB", "G", "GD", "D", "KD"];
        setWindDirection(directions[Math.floor(Math.random() * directions.length)]);
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate fire growth for Mugla user
  useEffect(() => {
    if (currentUser === "Mugla") {
      const interval = setInterval(() => {
        // Fluctuate fire growth rate (8-16%)
        const randomGrowth = 8 + Math.floor(Math.random() * 9);
        setFireGrowthRate(randomGrowth);
        
        // Fluctuate fire potential (80-90%)
        const randomPotential = 80 + Math.floor(Math.random() * 11);
        setFirePotential(randomPotential);
        
        // Fluctuate temperature for high-risk area (70-75°C)
        const randomTemp = 70 + Math.floor(Math.random() * 6);
        setTemperature(randomTemp);
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-8" style={{ backgroundColor: '#303030' }}>
        <div className="w-full max-w-md px-4">
          <div 
            className="rounded-2xl p-8 border-2 shadow-2xl"
            style={{
              backgroundColor: '#404040',
              borderColor: '#00D9A5',
              boxShadow: '0 10px 40px rgba(0, 217, 165, 0.3)'
            }}
          >
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{
                background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
              }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Birim Girişi</h1>
              <p className="text-gray-300 text-sm">Yetkili personel giriş sistemi</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-3 text-center">
                  <p className="text-red-500 text-sm font-semibold">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 text-white font-medium transition-all focus:outline-none"
                  style={{
                    backgroundColor: '#505050',
                    borderColor: error ? '#ef4444' : '#00D9A5',
                  }}
                  placeholder="Kullanıcı adınızı girin"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 text-white font-medium transition-all focus:outline-none"
                  style={{
                    backgroundColor: '#505050',
                    borderColor: error ? '#ef4444' : '#00D9A5',
                  }}
                  placeholder="Şifrenizi girin"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-3 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg"
                style={{
                  background: 'linear-gradient(to right, #00D9A5, #00A87E)',
                  boxShadow: '0 4px 20px rgba(0, 217, 165, 0.4)'
                }}
              >
                Giriş Yap
              </button>
            </form>

            {/* Demo Credentials - For Presentation */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(0, 217, 165, 0.2)' }}>
              <p className="text-gray-400 text-xs text-center mb-3 font-semibold">
                📋 Giriş Bilgileri
              </p>
              <div className="space-y-3">
                <div className="bg-[#505050] rounded-lg p-3 space-y-2">
                  <p className="text-gray-300 text-xs font-semibold mb-2"></p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Kullanıcı Adı:</span>
                    <span className="text-white font-mono text-sm font-semibold">Malatya</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Şifre:</span>
                    <span className="text-white font-mono text-sm font-semibold">admin</span>
                  </div>
                </div>
                
                <div className="bg-[#505050] rounded-lg p-3 space-y-2">
                  <p className="text-red-400 text-xs font-semibold mb-2">🔥Potansiyel Yangın İzleme</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Kullanıcı Adı:</span>
                    <span className="text-white font-mono text-sm font-semibold">Mugla</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Şifre:</span>
                    <span className="text-white font-mono text-sm font-semibold">admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard (after login)
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-8" style={{ backgroundColor: '#303030' }}>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Fire Alert Banner (for Mugla user) */}
          {currentUser === "Mugla" && (
            <div 
              className="mb-6 rounded-xl p-4 sm:p-6 border-2 animate-pulse"
              style={{
                backgroundColor: '#7f1d1d',
                borderColor: '#ef4444',
                boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)'
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2 flex items-center gap-2">
                    <span>⚠️ YÜKSEK YANGIN POTANSİYELİ</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base">
                    <div>
                      <p className="text-red-300 font-semibold mb-1">📍 Koordinat:</p>
                      <p className="text-white font-mono bg-black/30 px-3 py-1 rounded">
                        {fireLocation[0].toFixed(4)}°, {fireLocation[1].toFixed(4)}°
                      </p>
                    </div>
                    <div>
                      <p className="text-red-300 font-semibold mb-1">🔥 Yangın Potansiyeli:</p>
                      <p className="text-white font-mono bg-black/30 px-3 py-1 rounded">
                        %{firePotential} - Yüksek Risk
                      </p>
                    </div>
                    <div>
                      <p className="text-red-300 font-semibold mb-1">📈 Büyüme Oranı:</p>
                      <p className="text-white font-mono bg-black/30 px-3 py-1 rounded">
                        %{fireGrowthRate} / saat
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header with Logout */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {currentUser === "Mugla" ? "Potansiyel Yangın Tespit ve Kontrol Paneli" : "Birim Kontrol Paneli"}
              </h1>
              <p className="text-sm sm:text-base text-gray-300">
                {currentUser === "Mugla" ? "Orman yangını izleme sistemi" : "Drone izleme ve kontrol sistemi"}
              </p>
            </div>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setCurrentUser("");
              }}
              className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 border-2"
              style={{
                borderColor: '#00D9A5',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00D9A5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Çıkış Yap
            </button>
          </div>

          {/* Real-time Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            {/* Fire Risk */}
            <div 
              className={`rounded-xl p-4 border-2 ${currentUser === "Mugla" && fireRisk >= 80 ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor: currentUser === "Mugla" && fireRisk >= 80 ? '#7f1d1d' : '#404040',
                borderColor: fireRisk >= 60 ? '#ef4444' : fireRisk >= 40 ? '#fb923c' : '#4ade80',
                boxShadow: `0 4px 15px ${fireRisk >= 60 ? 'rgba(239, 68, 68, 0.4)' : fireRisk >= 40 ? 'rgba(251, 146, 60, 0.2)' : 'rgba(74, 222, 128, 0.2)'}`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs sm:text-sm font-semibold ${currentUser === "Mugla" && fireRisk >= 80 ? 'text-red-300' : 'text-gray-300'}`}>
                  Yangın Olasılığı
                </span>
                <svg className="w-6 h-6" style={{ color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-4xl font-bold" style={{ 
                color: fireRisk >= 60 ? '#ef4444' : fireRisk >= 40 ? '#fb923c' : '#4ade80'
              }}>
                %{fireRisk}
              </div>
              <p className={`text-xs mt-2 font-semibold ${currentUser === "Mugla" && fireRisk >= 80 ? 'text-red-400' : 'text-gray-400'}`}>
                {fireRisk >= 80 ? '⚠️ KRİTİK SEVİYE' : fireRisk >= 60 ? 'Yüksek Risk' : fireRisk >= 40 ? 'Orta Risk' : 'Düşük Risk'}
              </p>
            </div>

            {/* Movement Detection */}
            <div 
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: movementDetected > 10 ? '#ef4444' : movementDetected > 5 ? '#fb923c' : '#00D9A5',
                boxShadow: `0 4px 15px ${movementDetected > 10 ? 'rgba(239, 68, 68, 0.2)' : movementDetected > 5 ? 'rgba(251, 146, 60, 0.2)' : 'rgba(0, 217, 165, 0.2)'}`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Hareket Algılama</span>
                <svg className="w-5 h-5" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold" style={{ 
                color: movementDetected > 10 ? '#ef4444' : movementDetected > 5 ? '#fb923c' : '#00D9A5'
              }}>
                %{movementDetected}
              </div>
              <p className="text-gray-400 text-xs mt-1 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse" style={{
                  backgroundColor: movementDetected > 0 ? '#ef4444' : '#4ade80'
                }}></span>
                {movementDetected > 0 ? 'Hareket Var' : 'Hareket Yok'}
              </p>
            </div>

            {/* Wind Speed */}
            <div 
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: '#00D9A5',
                boxShadow: '0 4px 15px rgba(0, 217, 165, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Rüzgar Hızı</span>
                <svg className="w-5 h-5" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white">
                {windSpeed} <span className="text-lg">km/h</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Yön: {windDirection}
              </p>
            </div>

            {/* Temperature */}
            <div 
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: temperature >= 60 ? '#ef4444' : '#00D9A5',
                boxShadow: temperature >= 60 ? '0 4px 15px rgba(239, 68, 68, 0.2)' : '0 4px 15px rgba(0, 217, 165, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Sıcaklık</span>
                <svg className="w-5 h-5" style={{ color: temperature >= 60 ? '#ef4444' : '#fb923c' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v7.586l2.707 2.707a1 1 0 11-1.414 1.414L9 11.414V3a1 1 0 011-1z" clipRule="evenodd" />
                  <path d="M6 12v-2a4 4 0 118 0v2a4 4 0 11-8 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold" style={{ 
                color: temperature >= 60 ? '#ef4444' : 'white'
              }}>
                {temperature} <span className="text-lg">°C</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Nem: {temperature >= 60 ? '%15' : '%65'}
              </p>
            </div>
          </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Drone Video Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div 
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 h-full"
              style={{
                backgroundColor: '#404040',
                borderColor: '#00D9A5',
                boxShadow: '0 4px 20px rgba(0, 217, 165, 0.2)'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
                  {currentUser === "Mugla" ? (
                    <>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                      <span>Potansiyel Yangın Bölgesi Haritası</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>Canlı Drone Görüntüsü</span>
                    </>
                  )}
                </h2>
                <div className="flex items-center space-x-2 bg-red-500/20 px-2 sm:px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-500 text-xs sm:text-sm font-semibold">CANLI</span>
                </div>
              </div>

              {/* Map View */}
              <div className="relative mb-3 sm:mb-4">
                {currentUser === "Mugla" ? (
                  <FireMap 
                    height="500px" 
                    fireLocation={fireLocation}
                    windDirection={windDirection}
                    windSpeed={windSpeed}
                  />
                ) : (
                  <DroneMap height="500px" />
                )}
                
                {/* Time Overlay */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg z-[1000]">
                  <p className="text-white text-xs sm:text-sm font-mono">
                    {mounted ? currentTime : "--:--:--"}
                  </p>
                </div>
              </div>

              {/* Watch Button */}
              <button 
                onClick={() => {
                  if (currentUser === "Mugla") {
                    setShowFireImage(true);
                  } else if (currentUser === "Malatya") {
                    setShowDroneVideo(true);
                  }
                }}
                className="w-full text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 sm:space-x-3"
                style={{
                  background: currentUser === "Mugla" 
                    ? 'linear-gradient(to right, #ef4444, #dc2626)'
                    : 'linear-gradient(to right, #00D9A5, #00A87E)',
                  boxShadow: currentUser === "Mugla"
                    ? '0 4px 20px rgba(239, 68, 68, 0.4)'
                    : '0 4px 20px rgba(0, 217, 165, 0.4)'
                }}
              >
                {currentUser === "Mugla" ? (
                  <>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Potansiyel Yangın Yerini Görüntüle</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Drone&apos;u İzle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Battery Status */}
            <div 
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: droneCharge > 50 ? '#00D9A5' : droneCharge > 20 ? '#fb923c' : '#ef4444',
                boxShadow: `0 4px 20px ${droneCharge > 50 ? 'rgba(0, 217, 165, 0.2)' : droneCharge > 20 ? 'rgba(251, 146, 60, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white">Drone Şarjı</h3>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-xs sm:text-sm">Batarya Seviyesi</span>
                  <span className="text-white font-bold text-xl sm:text-2xl">%{droneCharge}</span>
                </div>
                <div className="w-full h-3 sm:h-4 rounded-full overflow-hidden" style={{ backgroundColor: '#505050' }}>
                  <div 
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${droneCharge}%`,
                      background: droneCharge > 50 
                        ? 'linear-gradient(to right, #00D9A5, #00FFC6)' 
                        : droneCharge > 20 
                        ? 'linear-gradient(to right, #fb923c, #f97316)'
                        : 'linear-gradient(to right, #ef4444, #dc2626)'
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-400">Tahmini Uçuş Süresi</span>
                <span className="text-white font-semibold">{Math.floor(droneCharge * 0.5)} dk</span>
              </div>
            </div>

            {/* Next Patrol Timer */}
            <div 
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: '#00D9A5',
                boxShadow: '0 4px 20px rgba(0, 217, 165, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white">Sonraki Devriye</h3>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2" style={{ 
                  background: 'linear-gradient(to right, #00D9A5, #00FFC6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {formatTime(nextPatrolTime)}
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">Kalan Süre</p>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t" style={{ borderColor: 'rgba(0, 217, 165, 0.2)' }}>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Devriye Durumu</span>
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold" style={{
                    backgroundColor: 'rgba(0, 217, 165, 0.2)',
                    color: '#00D9A5'
                  }}>
                    Beklemede
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: 'rgba(0, 217, 165, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 217, 165, 0.1)'
              }}
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Hızlı İşlemler</h3>
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all hover:scale-[1.02] border" style={{
                  backgroundColor: '#505050',
                  borderColor: 'rgba(0, 217, 165, 0.3)'
                }}>
                  <span className="text-white font-medium text-sm sm:text-base">📊 Rapor Oluştur</span>
                </button>
                <button className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all hover:scale-[1.02] border" style={{
                  backgroundColor: '#505050',
                  borderColor: 'rgba(0, 217, 165, 0.3)'
                }}>
                  <span className="text-white font-medium text-sm sm:text-base">🗺️ Rota Planla</span>
                </button>
                <button className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all hover:scale-[1.02] border" style={{
                  backgroundColor: '#505050',
                  borderColor: 'rgba(0, 217, 165, 0.3)'
                }}>
                  <span className="text-white font-medium text-sm sm:text-base">⚙️ Ayarlar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Drone Video Modal (for Malatya user) */}
    {showDroneVideo && currentUser === "Malatya" && (
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
        onClick={() => setShowDroneVideo(false)}
      >
        <div 
          className="relative max-w-6xl w-full bg-[#303030] rounded-2xl overflow-hidden border-2 shadow-2xl"
          style={{
            borderColor: '#00D9A5',
            boxShadow: '0 20px 60px rgba(0, 217, 165, 0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00D9A5] to-[#00A87E] px-6 py-4 border-b-2 border-[#00D9A5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Canlı Drone Görüntüsü</h3>
                <p className="text-white/90 text-sm">Görüntü Demo Görüntüsüdür</p>
              </div>
            </div>
            <button
              onClick={() => setShowDroneVideo(false)}
              className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Video Content */}
          <div className="p-4 sm:p-6">
            <div className="relative rounded-xl overflow-hidden border-2 border-[#00D9A5]/50 bg-black">
              <video 
                className="w-full h-auto"
                controls
                autoPlay
                loop
                style={{ maxHeight: '70vh' }}
              >
                <source src="/G_r_nt_ i_leme g_r_nt_s_.mp4" type="video/mp4" />
                Tarayıcınız video etiketini desteklemiyor.
              </video>
              
              {/* Live indicator */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 animate-pulse">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                <span className="text-white font-bold text-xs sm:text-sm">CANLI YAYIN</span>
              </div>
            </div>

            {/* Video info below video on mobile, overlay on desktop */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-10 sm:left-10 sm:right-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-[#00D9A5]/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
                <div>
                  <p className="text-[#00D9A5] text-xs font-semibold mb-1">Drone Durumu</p>
                  <p className="text-white text-xs sm:text-sm font-bold">✓ Aktif</p>
                </div>
                <div>
                  <p className="text-[#00D9A5] text-xs font-semibold mb-1">Batarya</p>
                  <p className="text-white text-xs sm:text-sm font-bold">%{droneCharge}</p>
                </div>
                <div>
                  <p className="text-[#00D9A5] text-xs font-semibold mb-1">Yükseklik</p>
                  <p className="text-white text-xs sm:text-sm font-bold">~120 m</p>
                </div>
                <div>
                  <p className="text-[#00D9A5] text-xs font-semibold mb-1">Sinyal Gücü</p>
                  <p className="text-white text-xs sm:text-sm font-bold">Mükemmel</p>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 border-2 flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(to right, #00D9A5, #00A87E)',
                  borderColor: '#00D9A5'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span>Ekran Görüntüsü Al</span>
              </button>
              <button 
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 border-2 flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                  borderColor: '#3b82f6'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>Görüş Alanını Ayarla</span>
              </button>
              <button 
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 border-2 flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                  borderColor: '#8b5cf6'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span>Acil İniş</span>
              </button>
            </div>

            {/* Info Message */}
            <div className="mt-4 bg-[#00D9A5]/10 border border-[#00D9A5]/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#00D9A5] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-[#00D9A5] font-semibold text-sm">Canlı Video Akışı</p>
                  <p className="text-gray-300 text-xs mt-1">
                    Drone şu anda belirlenen rota üzerinde devriye gezmekte ve orman alanını izlemektedir. 
                    Video akışı gerçek zamanlıdır ve tüm görüntüler güvenli sunucularda kaydedilmektedir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Detailed Report Modal */}
    {showDetailedReport && currentUser === "Mugla" && (
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={() => setShowDetailedReport(false)}
      >
        <div 
          className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
          style={{
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Mobile App Style */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 sm:px-6 py-4 sm:py-6 text-white">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-sm flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-bold truncate">Yangın Raporu</h3>
                  <p className="text-white/90 text-xs sm:text-sm truncate">Detaylı Analiz ve Değerlendirme</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailedReport(false)}
                className="text-white hover:bg-white/20 transition-colors p-2 rounded-lg flex-shrink-0"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Report ID and Date */}
            <div className="flex items-center justify-between text-sm bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
              <div>
                <span className="text-white/70">Rapor No:</span>
                <span className="ml-2 font-mono font-bold">MGL-2024-{Math.floor(Math.random() * 9000 + 1000)}</span>
              </div>
              <div>
                <span className="text-white/70">Tarih:</span>
                <span className="ml-2 font-bold">{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
              <div>
                <span className="text-white/70">Saat:</span>
                <span className="ml-2 font-bold">{mounted ? currentTime : "--:--:--"}</span>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Alert Status */}
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 p-2 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-red-800 font-bold text-lg">⚠️ YÜKSEK YANGIN POTANSİYELİ</h4>
                  <p className="text-red-600 text-sm">Yangın Potansiyeli %85 Kontrol Edilmesi Gerekmektedir.</p>
                </div>
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
                  🔥 ACİL
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="mb-6">
              <h4 className="text-gray-800 font-bold text-xl mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Konum Bilgileri
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Koordinatlar</p>
                  <p className="text-gray-900 font-bold text-lg font-mono">
                    {fireLocation[0].toFixed(6)}°, {fireLocation[1].toFixed(6)}°
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Bölge</p>
                  <p className="text-gray-900 font-bold text-lg">Köyceğiz Orman Bölgesi</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Rakım</p>
                  <p className="text-gray-900 font-bold text-lg">342 m</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-300">
                  <p className="text-orange-700 text-sm mb-1 font-semibold">En Yakın Yerleşim Yeri</p>
                  <p className="text-orange-900 font-bold text-lg">Köyceğiz Merkez</p>
                  <p className="text-orange-600 text-sm mt-1">📍 Uzaklık: ~4.2 km (GB yönü)</p>
                </div>
              </div>
            </div>

            {/* Forest and Fire Information */}
            <div className="mb-6">
              <h4 className="text-gray-800 font-bold text-xl mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                Orman ve Yangın Detayları
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-300">
                  <p className="text-green-700 text-sm mb-2 font-semibold">🌲 Yanan Ağaç Tipi</p>
                  <p className="text-green-900 font-bold text-lg mb-2">Kızılçam (Pinus brutia)</p>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>• Yoğunluk: Sık orman</p>
                    <p>• Yaş Ortalaması: 35-45 yıl</p>
                    <p>• Alan Kaplama: ~12.5 hektar</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300">
                  <p className="text-red-700 text-sm mb-2 font-semibold">⚠️ Risk Potansiyeli</p>
                  <div className="flex items-center mb-2">
                    <p className="text-red-900 font-bold text-2xl">%{firePotential}</p>
                    <span className="ml-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ÇOK YÜKSEK
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-red-800">
                    <p>• Rüzgar Hızı: {windSpeed} km/h ({windDirection})</p>
                    <p>• Büyüme Oranı: %{fireGrowthRate}/saat</p>
                    <p>• Yayılma Riski: Kritik</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fire Statistics */}
            <div className="mb-6">
              <h4 className="text-gray-800 font-bold text-xl mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Yangın İstatistikleri
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-4 text-center border border-red-200">
                  <p className="text-red-600 text-xs font-semibold mb-1">Tespit Güveni</p>
                  <p className="text-red-900 text-3xl font-bold">%87</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 text-center border border-orange-200">
                  <p className="text-orange-600 text-xs font-semibold mb-1">Etkilenen Alan</p>
                  <p className="text-orange-900 text-3xl font-bold">2.4 ha</p>
                </div>
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 text-center border border-amber-200">
                  <p className="text-amber-600 text-xs font-semibold mb-1">Tehdit Seviyesi</p>
                  <p className="text-amber-900 text-3xl font-bold">9/10</p>
                </div>
                <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-xl p-4 text-center border border-rose-200">
                  <p className="text-rose-600 text-xs font-semibold mb-1">Müdahale Önceliği</p>
                  <p className="text-rose-900 text-3xl font-bold">ACİL</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-300">
              <h4 className="text-blue-900 font-bold text-lg mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Önerilen Aksiyonlar
              </h4>
              <ul className="space-y-2 text-blue-900">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">1.</span>
                  <span>Hava ve kara ekiplerinin <strong>derhal bölgeye sevk edilmesi</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">2.</span>
                  <span>Köyceğiz Merkez sakinlerinin <strong>uyarılması ve hazırlıklı olması</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">3.</span>
                  <span>Rüzgar yönü GB olduğundan <strong>doğu tarafına yangın hatları oluşturulması</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2">4.</span>
                  <span>Sürekli drone gözetimi ile <strong>yangın gelişiminin anlık takibi</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="bg-gray-100 px-6 py-4 border-t border-gray-300">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Raporu Paylaş</span>
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                <span>PDF İndir</span>
              </button>
              <button 
                onClick={() => setShowDetailedReport(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition-all hover:scale-[1.02] shadow-lg"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Fire Detection Image Modal */}
    {showFireImage && currentUser === "Mugla" && (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={() => setShowFireImage(false)}
      >
        <div 
          className="relative max-w-6xl w-full bg-[#303030] rounded-2xl overflow-hidden border-2 shadow-2xl"
          style={{
            borderColor: '#ef4444',
            boxShadow: '0 20px 60px rgba(239, 68, 68, 0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#7f1d1d] px-6 py-4 border-b-2 border-red-500 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-2xl font-bold text-white">Potansiyel Yangın Tespit Görüntüsü</h3>
                <p className="text-red-300 text-sm">Drone AI Detection System</p>
              </div>
            </div>
            <button
              onClick={() => setShowFireImage(false)}
              className="text-white hover:text-red-400 transition-colors p-2 hover:bg-black/30 rounded-lg"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Image Content */}
          <div className="p-4 sm:p-6">
            <div className="relative rounded-xl overflow-hidden border-2 border-red-500/50">
              <img 
                src="/fire_detect.png" 
                alt="Fire Detection" 
                className="w-full h-auto"
              />
              
              {/* Live indicator */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-600 px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 animate-pulse">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                <span className="text-white font-bold text-xs sm:text-sm">CANLI TESPİT</span>
              </div>
            </div>

            {/* Detection info below image on mobile, overlay on desktop */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-10 sm:left-10 sm:right-10 bg-black/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-red-500/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
                <div>
                  <p className="text-red-400 text-xs font-semibold mb-1">Tespit Güveni</p>
                  <p className="text-white text-base sm:text-lg font-bold">%87</p>
                </div>
                <div>
                  <p className="text-red-400 text-xs font-semibold mb-1">Koordinat</p>
                  <p className="text-white text-xs sm:text-sm font-mono">{fireLocation[0].toFixed(4)}°</p>
                </div>
                <div>
                  <p className="text-red-400 text-xs font-semibold mb-1">Potansiyel Yangın Alanı</p>
                  <p className="text-white text-base sm:text-lg font-bold">~2.4 ha</p>
                </div>
                <div>
                  <p className="text-red-400 text-xs font-semibold mb-1">Durum</p>
                  <p className="text-red-500 text-xs sm:text-sm font-bold">🔥 AKTİF</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 border-2"
                style={{
                  background: 'linear-gradient(to right, #ef4444, #dc2626)',
                  borderColor: '#ef4444'
                }}
              >
                🚨 Acil Ekipleri Uyar
              </button>
              <button 
                onClick={() => setShowDetailedReport(true)}
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 border-2"
                style={{
                  background: 'linear-gradient(to right, #f97316, #ea580c)',
                  borderColor: '#f97316'
                }}
              >
                📊 Detaylı Rapor
              </button>
              <button 
                className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 border-2"
                style={{
                  background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                  borderColor: '#6366f1'
                }}
              >
                🗺️ Haritada Göster
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
