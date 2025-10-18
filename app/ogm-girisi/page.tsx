"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

// Dynamic import to avoid SSR issues with Leaflet
const OGMMap = dynamic(() => import("@/components/OGMMap"), {
  ssr: false,
  loading: () => (
    <div 
      className="w-full rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center"
      style={{ height: "600px", backgroundColor: '#505050' }}
    >
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Harita yükleniyor...</p>
      </div>
    </div>
  ),
});

export default function OGMGirisiPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Stats
  const [activeFires, setActiveFires] = useState(0);
  const [highRiskAreas, setHighRiskAreas] = useState(0);
  const [monitoredParcels, setMonitoredParcels] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "ogm123" && password === "admin") {
      setIsLoggedIn(true);
      setError("");
      // Simulated stats
      setActiveFires(3);
      setHighRiskAreas(12);
      setMonitoredParcels(1547);
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
    
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">OGM Giriş Sistemi</h1>
              <p className="text-gray-300 text-sm">Orman Genel Müdürlüğü - Yangın İzleme Sistemi</p>
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

            {/* OGM Credentials */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(0, 217, 165, 0.2)' }}>
              <p className="text-gray-400 text-xs text-center mb-3 font-semibold">
                📋 OGM Giriş Bilgileri
              </p>
              <div className="bg-[#505050] rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Kullanıcı Adı:</span>
                  <span className="text-white font-mono text-sm font-semibold">ogm123</span>
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

  // Main OGM Dashboard (after login)
  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 pb-8" style={{ backgroundColor: '#303030' }}>
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Header with Logout */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">OGM Yangın İzleme Sistemi</h1>
              <p className="text-sm sm:text-base text-gray-300">Son 24 saatteki yangınlar ve parsel bazlı risk analizi</p>
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

          {/* Tree Type & Fire Risk Relationship Banner */}
          <div className="mb-6 sm:mb-8 rounded-2xl p-6 border-2" style={{
            backgroundColor: '#404040',
            borderColor: '#00D9A5',
            boxShadow: '0 8px 32px rgba(0, 217, 165, 0.3)'
          }}>
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center">
                <svg className="w-8 h-8 mr-3" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
                Ağaç Türü - Yangın Riski İlişkisi
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-3xl mx-auto">
                <strong style={{ color: '#00D9A5' }}>Bilimsel Gerçek:</strong> Ağaç türü, yangın ihtimalini doğrudan etkileyen en önemli faktördür. 
                Reçine içeriği yüksek ağaçlar 2-3 kat daha hızlı tutuşur.
              </p>
            </div>

            {/* Comparative Flammability Chart */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { name: "Kızılçam", risk: 85, color: "#D2691E", brightColor: "#FF8C42", icon: "🔥", label: "ÇOK YÜKSEK" },
                { name: "Ladin", risk: 75, color: "#228B22", brightColor: "#32CD32", icon: "⚠️", label: "YÜKSEK" },
                { name: "Karaçam", risk: 70, color: "#4A7C59", brightColor: "#5FA777", icon: "⚠️", label: "YÜKSEK" },
                { name: "Göknar", risk: 60, color: "#2E8B57", brightColor: "#3CB371", icon: "⚡", label: "ORTA-YÜKSEK" },
                { name: "Meşe", risk: 55, color: "#8B4513", brightColor: "#A0522D", icon: "✓", label: "ORTA" },
                { name: "Kayın", risk: 50, color: "#6B8E23", brightColor: "#9ACD32", icon: "✓", label: "ORTA" },
              ].map((tree) => (
                <div key={tree.name} className="relative">
                  <div className="rounded-xl p-4 border-2 transition-all hover:scale-105 hover:shadow-2xl" style={{
                    backgroundColor: '#505050',
                    borderColor: tree.risk >= 70 ? '#ef4444' : tree.risk >= 60 ? '#fb923c' : '#4ade80',
                  }}>
                    {/* Tree Icon with gradient */}
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{
                        background: `linear-gradient(135deg, ${tree.brightColor}, ${tree.color})`,
                        boxShadow: `0 0 25px ${tree.brightColor}80, 0 0 40px ${tree.color}60, inset 0 0 15px rgba(255,255,255,0.2)`,
                        border: `3px solid ${tree.color}`
                      }}>
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                        }}>
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                      </div>
                    </div>

                    {/* Tree Name */}
                    <h4 className="text-white font-bold text-center text-sm mb-2">{tree.name}</h4>

                    {/* Risk Bar */}
                    <div className="mb-2">
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#606060' }}>
                        <div 
                          className="h-full transition-all duration-1000 rounded-full"
                          style={{
                            width: `${tree.risk}%`,
                            background: tree.risk >= 70 
                              ? 'linear-gradient(to right, #ef4444, #dc2626)' 
                              : tree.risk >= 60 
                              ? 'linear-gradient(to right, #fb923c, #f97316)'
                              : 'linear-gradient(to right, #4ade80, #22c55e)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Risk Percentage */}
                    <div className="text-center mb-2">
                      <span className="text-2xl font-bold" style={{ 
                        color: tree.risk >= 70 ? '#ef4444' : tree.risk >= 60 ? '#fb923c' : '#4ade80'
                      }}>
                        {tree.icon} %{tree.risk}
                      </span>
                    </div>

                    {/* Risk Label */}
                    <div className="text-center">
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                        backgroundColor: tree.risk >= 70 ? '#ef444420' : tree.risk >= 60 ? '#fb923c20' : '#4ade8020',
                        color: tree.risk >= 70 ? '#ef4444' : tree.risk >= 60 ? '#fb923c' : '#4ade80',
                      }}>
                        {tree.label}
                      </span>
                    </div>
                  </div>

                  {/* Flame indicator for high risk */}
                  {tree.risk >= 70 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-pulse" style={{
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 20px #ef4444'
                    }}>
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Insight */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-4 border-3 transition-all hover:scale-105" style={{
                backgroundColor: '#505050',
                borderColor: '#ef4444',
                borderWidth: '3px',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
              }}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #FF8C42, #D2691E)',
                    boxShadow: '0 0 20px #FF8C4280, inset 0 0 10px rgba(255,255,255,0.2)',
                    border: '2px solid #D2691E'
                  }}>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">Reçineli Ağaçlar</h4>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  <strong style={{ color: '#FF8C42' }}>Kızılçam</strong> ve <strong style={{ color: '#32CD32' }}>Ladin</strong> gibi reçine içeriği yüksek ağaçlar 
                  <strong> 3 kat daha hızlı</strong> tutuşur ve yangın yayılımını hızlandırır.
                </p>
              </div>

              <div className="rounded-xl p-4 border-3 transition-all hover:scale-105" style={{
                backgroundColor: '#505050',
                borderColor: '#fb923c',
                borderWidth: '3px',
                boxShadow: '0 0 20px rgba(251, 146, 60, 0.3)'
              }}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #5FA777, #4A7C59)',
                    boxShadow: '0 0 20px #5FA77780, inset 0 0 10px rgba(255,255,255,0.2)',
                    border: '2px solid #4A7C59'
                  }}>
                    <span className="text-2xl">🌡️</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">Nem Oranı Etkisi</h4>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  <strong style={{ color: '#5FA777' }}>Karaçam</strong> ve <strong style={{ color: '#3CB371' }}>Göknar</strong> düşük nem oranlarında 
                  <strong> %40 daha fazla</strong> yangın riski taşır.
                </p>
              </div>

              <div className="rounded-xl p-4 border-3 transition-all hover:scale-105" style={{
                backgroundColor: '#505050',
                borderColor: '#4ade80',
                borderWidth: '3px',
                boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)'
              }}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #9ACD32, #6B8E23)',
                    boxShadow: '0 0 20px #9ACD3280, inset 0 0 10px rgba(255,255,255,0.2)',
                    border: '2px solid #6B8E23'
                  }}>
                    <span className="text-2xl">💧</span>
                  </div>
                  <h4 className="text-white font-bold text-sm">Geniş Yapraklılar</h4>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed">
                  <strong style={{ color: '#9ACD32' }}>Kayın</strong> ve <strong style={{ color: '#A0522D' }}>Meşe</strong> yüksek nem içeriği sayesinde 
                  <strong> doğal yangın bariyeri</strong> oluşturur.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            {/* Active Fires */}
            <div 
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: '#ef4444',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Aktif Yangınlar (24s)</span>
                <svg className="w-5 h-5" style={{ color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold" style={{ color: '#ef4444' }}>
                {activeFires}
              </div>
              <p className="text-gray-400 text-xs mt-1">Son güncelleme: {mounted ? currentTime : "--:--:--"}</p>
            </div>

            {/* High Risk Areas */}
            <div 
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: '#fb923c',
                boxShadow: '0 4px 15px rgba(251, 146, 60, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Yüksek Riskli Bölge</span>
                <svg className="w-5 h-5" style={{ color: '#fb923c' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold" style={{ color: '#fb923c' }}>
                {highRiskAreas}
              </div>
              <p className="text-gray-400 text-xs mt-1">Risk seviyesi ≥60%</p>
            </div>

            {/* Monitored Parcels */}
            <div 
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: '#00D9A5',
                boxShadow: '0 4px 15px rgba(0, 217, 165, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">İzlenen Parsel</span>
                <svg className="w-5 h-5" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white">
                {monitoredParcels.toLocaleString()}
              </div>
              <p className="text-gray-400 text-xs mt-1">Türkiye geneli</p>
            </div>

            {/* System Status */}
            <div 
              className="rounded-xl p-4 border-2"
              style={{
                backgroundColor: '#404040',
                borderColor: '#4ade80',
                boxShadow: '0 4px 15px rgba(74, 222, 128, 0.2)'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Sistem Durumu</span>
                <svg className="w-5 h-5" style={{ color: '#4ade80' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#4ade80' }}></div>
                <span className="text-xl font-bold text-white">Aktif</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">Tüm sistemler çalışıyor</p>
            </div>
          </div>

          {/* Map Section */}
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2"
            style={{
              backgroundColor: '#404040',
              borderColor: '#00D9A5',
              boxShadow: '0 4px 20px rgba(0, 217, 165, 0.2)'
            }}
          >
            <div className="mb-3 sm:mb-4 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Türkiye Yangın ve Parsel Haritası</span>
              </h2>
              <div className="flex items-center space-x-2 bg-red-500/20 px-2 sm:px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-500 text-xs sm:text-sm font-semibold">SON 24 SAAT</span>
              </div>
            </div>

            {/* OGM Map */}
            <OGMMap />

            {/* Enhanced Legend */}
            <div className="mt-4 space-y-3">
              {/* Fire Status */}
              <div className="bg-[#505050] p-4 rounded-lg border-2" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <h4 className="text-white font-bold text-sm mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#ef4444' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  Yangın Durumu
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#dc2626', boxShadow: '0 0 10px #dc2626' }}></div>
                    <span className="text-xs text-gray-300">Kritik Yangın</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#f97316', boxShadow: '0 0 8px #f97316' }}></div>
                    <span className="text-xs text-gray-300">Yüksek Şiddet</span>
                  </div>
                </div>
              </div>

              {/* Tree Types */}
              <div className="bg-[#505050] p-4 rounded-lg border-2" style={{ borderColor: 'rgba(0, 217, 165, 0.3)' }}>
                <h4 className="text-white font-bold text-sm mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#00D9A5' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                  </svg>
                  Ağaç Türleri (Harita Katmanları)
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8B4513' }}></div>
                    <span className="text-gray-300">Kızılçam</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B5323' }}></div>
                    <span className="text-gray-300">Karaçam</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#006400' }}></div>
                    <span className="text-gray-300">Ladin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#556B2F' }}></div>
                    <span className="text-gray-300">Kayın</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#2F4F4F' }}></div>
                    <span className="text-gray-300">Göknar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: '#654321' }}></div>
                    <span className="text-gray-300">Meşe</span>
                  </div>
                </div>
              </div>

              {/* Risk Levels */}
              <div className="bg-[#505050] p-4 rounded-lg border-2" style={{ borderColor: 'rgba(251, 146, 60, 0.3)' }}>
                <h4 className="text-white font-bold text-sm mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#fb923c' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Risk Seviyeleri
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-2 rounded" style={{ backgroundColor: 'rgba(220, 38, 38, 0.6)' }}></div>
                      <span className="text-gray-300">Çok Yüksek</span>
                    </div>
                    <span className="text-white font-semibold">≥70%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-2 rounded" style={{ backgroundColor: 'rgba(249, 115, 22, 0.6)' }}></div>
                      <span className="text-gray-300">Yüksek</span>
                    </div>
                    <span className="text-white font-semibold">60-69%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-2 rounded" style={{ backgroundColor: 'rgba(234, 179, 8, 0.6)' }}></div>
                      <span className="text-gray-300">Orta</span>
                    </div>
                    <span className="text-white font-semibold">40-59%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-2 rounded" style={{ backgroundColor: 'rgba(74, 222, 128, 0.6)' }}></div>
                      <span className="text-gray-300">Düşük</span>
                    </div>
                    <span className="text-white font-semibold">&lt;40%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

