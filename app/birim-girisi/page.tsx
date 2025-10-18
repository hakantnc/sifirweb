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

export default function BirimGirisiPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [droneCharge, setDroneCharge] = useState(87);
  const [nextPatrolTime, setNextPatrolTime] = useState(15 * 60); // 15 dakika (saniye cinsinden)
  const [currentTime, setCurrentTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  // Real-time stats
  const [fireRisk, setFireRisk] = useState(3); // Yangın olasılığı %
  const [movementDetected, setMovementDetected] = useState(0); // Hareket oranı %
  const [windSpeed, setWindSpeed] = useState(15); // Rüzgar hızı km/h
  const [windDirection, setWindDirection] = useState("KB"); // Rüzgar yönü

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "Kemerburgaz" && password === "admin") {
      setIsLoggedIn(true);
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
                📋 Demo Giriş Bilgileri (Sunum İçin)
              </p>
              <div className="bg-[#505050] rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Kullanıcı Adı:</span>
                  <span className="text-white font-mono text-sm font-semibold">Kemerburgaz</span>
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
    );
  }

  // Main Dashboard (after login)
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-8" style={{ backgroundColor: '#303030' }}>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Header with Logout */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Birim Kontrol Paneli</h1>
              <p className="text-sm sm:text-base text-gray-300">Drone izleme ve kontrol sistemi</p>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
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
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: fireRisk >= 60 ? '#ef4444' : fireRisk >= 40 ? '#fb923c' : '#4ade80',
                boxShadow: `0 4px 15px ${fireRisk >= 60 ? 'rgba(239, 68, 68, 0.2)' : fireRisk >= 40 ? 'rgba(251, 146, 60, 0.2)' : 'rgba(74, 222, 128, 0.2)'}`
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Yangın Olasılığı</span>
                <svg className="w-5 h-5" style={{ color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold" style={{ 
                color: fireRisk >= 60 ? '#ef4444' : fireRisk >= 40 ? '#fb923c' : '#4ade80'
              }}>
                %{fireRisk}
              </div>
              <p className="text-gray-400 text-xs mt-1">
                {fireRisk >= 60 ? 'Yüksek Risk' : fireRisk >= 40 ? 'Orta Risk' : 'Düşük Risk'}
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
                borderColor: '#00D9A5',
                boxShadow: '0 4px 15px rgba(0, 217, 165, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Sıcaklık</span>
                <svg className="w-5 h-5" style={{ color: '#fb923c' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v7.586l2.707 2.707a1 1 0 11-1.414 1.414L9 11.414V3a1 1 0 011-1z" clipRule="evenodd" />
                  <path d="M6 12v-2a4 4 0 118 0v2a4 4 0 11-8 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white">
                28 <span className="text-lg">°C</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Nem: %65
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
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>Canlı Drone Görüntüsü</span>
                </h2>
                <div className="flex items-center space-x-2 bg-red-500/20 px-2 sm:px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-500 text-xs sm:text-sm font-semibold">CANLI</span>
                </div>
              </div>

              {/* Drone Map View */}
              <div className="relative mb-3 sm:mb-4">
                <DroneMap height="500px" />
                
                {/* Time Overlay */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg z-[1000]">
                  <p className="text-white text-xs sm:text-sm font-mono">
                    {mounted ? currentTime : "--:--:--"}
                  </p>
                </div>
              </div>

              {/* Watch Button */}
              <button 
                className="w-full text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 sm:space-x-3"
                style={{
                  background: 'linear-gradient(to right, #00D9A5, #00A87E)',
                  boxShadow: '0 4px 20px rgba(0, 217, 165, 0.4)'
                }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Drone&apos;u İzle</span>
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
    </>
  );
}
