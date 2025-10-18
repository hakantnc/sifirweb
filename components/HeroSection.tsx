"use client";

export default function HeroSection() {
  const scrollToMap = () => {
    document.getElementById("harita")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="anasayfa"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#303030' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D9A5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 border-2" style={{ 
            backgroundColor: 'rgba(0, 217, 165, 0.1)', 
            color: '#00D9A5',
            borderColor: '#00D9A5'
          }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-sm">Sıfır Ateş Projesi</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ 
            background: 'linear-gradient(to right, #FF4444, #FF6B6B, #FFA500, #00D9A5, #00D9A5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            FEBRESEE
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Ormanlarımızı Koruma Altına Alan Akıllı Drone Teknolojisi
          </p>

          {/* Description */}
          <div className="max-w-3xl mx-auto rounded-2xl p-8 mb-8 border-2" style={{
            backgroundColor: 'rgba(64, 64, 64, 0.6)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(0, 217, 165, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 217, 165, 0.1)'
          }}>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              FEBRESEE projesi, yapay zeka destekli drone teknolojisi kullanarak orman yangınlarını erken tespit eder ve müdahale süresini minimize eder.
            </p>
            <p className="text-gray-200 text-lg leading-relaxed">
              Ağaç tipi analizi, termal kamera görüntüleme ve rüzgar sensörleri ile donatılmış devriye dronelarımız, 15 dakikalık periyodlarla risk bölgelerini tarar ve yangın tespit edildiğinde anlık raporlama yapar.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="rounded-xl p-6 border-2 transition-all hover:scale-105" style={{
              backgroundColor: 'rgba(64, 64, 64, 0.6)',
              borderColor: 'rgba(0, 217, 165, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4" style={{
                background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
              }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Erken Tespit</h3>
              <p className="text-gray-300 text-sm">Yapay zeka ile yangın riski anlık tespit edilir</p>
            </div>

            <div className="rounded-xl p-6 border-2 transition-all hover:scale-105" style={{
              backgroundColor: 'rgba(64, 64, 64, 0.6)',
              borderColor: 'rgba(0, 217, 165, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4" style={{
                background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
              }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Harita Görünümü</h3>
              <p className="text-gray-300 text-sm">81 il için detaylı risk analizi ve orman verileri</p>
            </div>

            <div className="rounded-xl p-6 border-2 transition-all hover:scale-105" style={{
              backgroundColor: 'rgba(64, 64, 64, 0.6)',
              borderColor: 'rgba(0, 217, 165, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4" style={{
                background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
              }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Mobil Uygulama</h3>
              <p className="text-gray-300 text-sm">Halk için anlık uyarı ve eğitim içeriği</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToMap}
              className="text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(to right, #00D9A5, #00A87E)',
                boxShadow: '0 4px 20px rgba(0, 217, 165, 0.4)'
              }}
            >
              Haritayı İncele
            </button>
            <button className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 hover:scale-105" style={{
              backgroundColor: 'transparent',
              color: '#00D9A5',
              borderColor: '#00D9A5'
            }}>
              Proje Detayları
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
              className="w-6 h-6"
              style={{ color: '#00D9A5' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

