"use client";

export default function TreeInfoSection() {
  const treeTypes = [
    {
      name: "Kızılçam",
      scientificName: "Pinus brutia",
      flammability: "Çok Yüksek",
      riskLevel: 5,
      description: "Yüksek reçine içeriği nedeniyle son derece yanıcıdır. Akdeniz bölgesinde yaygındır.",
      icon: "🌲",
      riskColor: "#FF4444"
    },
    {
      name: "Karaçam",
      scientificName: "Pinus nigra",
      flammability: "Yüksek",
      riskLevel: 4,
      description: "Reçineli yapısı yangın riskini artırır. Anadolu'nun geniş bir alanında bulunur.",
      icon: "🌲",
      riskColor: "#FF6B6B"
    },
    {
      name: "Sarıçam",
      scientificName: "Pinus sylvestris",
      flammability: "Yüksek",
      riskLevel: 4,
      description: "Kuru yaprak ve iğne örtüsü yangın riskini yükseltir.",
      icon: "🌲",
      riskColor: "#FF8C42"
    },
    {
      name: "Ardıç",
      scientificName: "Juniperus spp.",
      flammability: "Yüksek",
      riskLevel: 4,
      description: "Uçucu yağ içeriği nedeniyle hızlı tutuşur ve yayılır.",
      icon: "🌿",
      riskColor: "#FFA500"
    },
    {
      name: "Sedir",
      scientificName: "Cedrus libani",
      flammability: "Orta",
      riskLevel: 3,
      description: "Kalın kabuk yapısı yangına karşı kısmi koruma sağlar.",
      icon: "🌲",
      riskColor: "#FFB347"
    },
    {
      name: "Meşe",
      scientificName: "Quercus spp.",
      flammability: "Orta",
      riskLevel: 3,
      description: "Geniş yapraklı yapısı ve yüksek nem içeriği yangın direncini artırır.",
      icon: "🌳",
      riskColor: "#87CEEB"
    },
    {
      name: "Kayın",
      scientificName: "Fagus orientalis",
      flammability: "Düşük",
      riskLevel: 2,
      description: "Yüksek nem içeriği sayesinde yangına karşı en dirençli türlerden biridir.",
      icon: "🌳",
      riskColor: "#4DA6A6"
    },
    {
      name: "Göknar",
      scientificName: "Abies spp.",
      flammability: "Orta-Düşük",
      riskLevel: 2,
      description: "Nemli ortamları tercih eder, yangın riski nispeten düşüktür.",
      icon: "🌲",
      riskColor: "#00D9A5"
    }
  ];

  const getRiskBar = (level: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((bar) => (
          <div
            key={bar}
            className="h-2 w-8 rounded-full transition-all duration-300"
            style={{
              backgroundColor: bar <= level ? treeTypes.find(t => t.riskLevel === level)?.riskColor : 'rgba(255, 255, 255, 0.2)'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section
      id="agac-bilgileri"
      className="py-20 relative overflow-hidden"
      style={{ backgroundColor: '#303030' }}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2300D9A5\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 border-2" style={{ 
            backgroundColor: 'rgba(0, 217, 165, 0.1)', 
            color: '#00D9A5',
            borderColor: '#00D9A5'
          }}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span className="font-semibold text-sm">Ağaç Tipleri ve Yangın Riski</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ 
            background: 'linear-gradient(to right, #FF4444, #FFA500, #00D9A5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Hangi Ağaçlar Daha Çabuk Yanar?
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Türkiye&apos;deki ağaç türlerinin yanıcılık seviyelerini öğrenin. Her ağaç türünün yangın riski farklıdır.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {treeTypes.map((tree, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                backgroundColor: 'rgba(64, 64, 64, 0.6)',
                borderColor: `${tree.riskColor}40`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 20px ${tree.riskColor}20`
              }}
            >
              <div className="text-6xl mb-4 text-center">
                {tree.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 text-center">
                {tree.name}
              </h3>
              <p className="text-sm text-gray-400 italic mb-4 text-center">
                {tree.scientificName}
              </p>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300 font-semibold">Yanıcılık:</span>
                  <span className="text-sm font-bold" style={{ color: tree.riskColor }}>
                    {tree.flammability}
                  </span>
                </div>
                {getRiskBar(tree.riskLevel)}
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {tree.description}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl p-8 border-2" style={{
          backgroundColor: 'rgba(64, 64, 64, 0.6)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(0, 217, 165, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 217, 165, 0.1)'
        }}>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(to bottom right, #00D9A5, #00A87E)'
              }}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white mb-2">Önemli Bilgi</h4>
              <p className="text-gray-300 leading-relaxed">
                <strong style={{ color: '#00D9A5' }}>FEBRESEE</strong> sistemi, bu ağaç tiplerinin yoğunluğunu analiz ederek yangın risk haritası oluşturur. 
                Reçineli iğne yapraklı ağaçlar (çam, ardıç) yüksek risk, geniş yapraklı ağaçlar (kayın, meşe) düşük risk bölgeleri olarak değerlendirilir. 
                Dronelarımız bu verileri kullanarak öncelikli devriye rotalarını belirler.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <h4 className="text-center text-lg font-bold text-white mb-4">Yangın Risk Skalası</h4>
          <div className="flex items-center justify-between">
            <div className="flex-1 h-4 rounded-full" style={{
              background: 'linear-gradient(to right, #00D9A5, #87CEEB, #FFB347, #FFA500, #FF6B6B, #FF4444)'
            }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-300">Düşük Risk</span>
            <span className="text-sm text-gray-300">Yüksek Risk</span>
          </div>
        </div>
      </div>
    </section>
  );
}
