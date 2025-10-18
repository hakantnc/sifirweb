# 🗺️ OGM Yangın İzleme Sistemi - Gelişmiş Harita Özellikleri

## 🎯 Yapılan Geliştirmeler

### 1. **Fiziki Harita Görünümü (Satellite/Terrain)**
- ✅ Google Hybrid harita katmanı eklendi
- ✅ Gerçek uydu görüntüleri üzerinde çalışıyor
- ✅ Arazi yapısı ve orman alanları fiziksel olarak görülebiliyor
- ✅ Yollar, binalar ve coğrafi detaylar net görünüyor

### 2. **Ağaç Türü Katmanları (Bölgesel Renklendirme)**
- 🌲 **Kızılçam** - Kahverengi (#8B4513) - Yüksek Yangın Riski (%85)
- 🌲 **Karaçam** - Koyu Yeşil (#3B5323) - Orta-Yüksek Risk (%70)
- 🌲 **Ladin** - Koyu Yeşil (#006400) - Düşük Risk (%45)
- 🌲 **Kayın** - Zeytin Yeşili (#556B2F) - Orta Risk (%50)
- 🌲 **Göknar** - Koyu Deniz Yeşili (#2F4F4F) - Orta Risk (%60)
- 🌲 **Meşe** - Koyu Kahve (#654321) - Orta Risk (%55)

**Özellikler:**
- Her il kendi ağaç türüne göre renklendirilmiş
- Ağaç türü bilgisi harita üzerinde tooltip ile gösteriliyor
- Legend'da her ağaç türünün yanıcılık oranı belirtilmiş

### 3. **Orman Yoğunluğu Görselleştirmesi**
- ✅ Her bölgenin orman yoğunluğu %0-100 arası hesaplanmış
- ✅ Yoğunluk arttıkça renk opacity'si artıyor
- ✅ Yoğun orman bölgeleri daha koyu renkli
- ✅ Tooltip'te yoğunluk yüzdesi gösteriliyor

**Örnek Yoğunluklar:**
- Artvin (Ladin): %90
- Rize (Ladin): %88
- Kastamonu (Kayın): %82
- Muğla (Kızılçam): %75

### 4. **Yangın Risk Overlay (Gradient Renklendirme)**
- 🔴 **Çok Yüksek Risk (≥70%)** - Kırmızı overlay
- 🟠 **Yüksek Risk (60-69%)** - Turuncu overlay
- 🟡 **Orta Risk (40-59%)** - Sarı overlay
- 🟢 **Düşük Risk (<40%)** - Yeşil overlay

**Özellikler:**
- Risk seviyeleri gradient renklendirme ile gösteriliyor
- Yüksek riskli bölgeler kesikli çizgi border'a sahip
- Overlay açılıp kapatılabiliyor

### 5. **Gelişmiş Legend Sistemi**
- 📊 **3 Kategorili Legend:**
  1. **Yangın Durumu** - Aktif yangınların şiddeti
  2. **Ağaç Türleri** - 6 farklı ağaç türü renk kodlu
  3. **Risk Seviyeleri** - 4 farklı risk seviyesi

- ✅ Harita sağ üstünde sabit legend paneli
- ✅ Scroll edilebilir tasarım
- ✅ Katman açma/kapama toggle'ları
- ✅ Her kategori ayrı renk skalası ile

### 6. **Yanan Bölgelerin Belirgin Gösterimi**
- 🔥 **Gelişmiş Yangın İkonları:**
  - 50x50px büyüklüğünde
  - Radial gradient ile parlak efekt
  - 4px beyaz border
  - Glow shadow efekti
  
- 🎬 **4 Farklı Animasyon:**
  1. **firePulse** - İkon büyüyüp küçülüyor (1.5s)
  2. **fireGlow** - Işıltı efekti değişiyor (2s)
  3. **fireRipple** - Dalga efekti yayılıyor (2s)
  4. **fireFloat** - Yukarı aşağı hareket (3s)

- ✅ Yangın şiddetine göre renk:
  - Kritik: Koyu kırmızı (#dc2626)
  - Yüksek: Turuncu (#f97316)

### 7. **İnteraktif Özellikler**
- 🖱️ **Hover Efektleri:**
  - Her bölgeye mouse ile gelindiğinde tooltip açılıyor
  - İl adı, ağaç türü, yoğunluk ve risk bilgisi gösteriliyor
  - Tooltip'ler özel tasarımlı (blur efekti, border, glow)

- 🔄 **Toggle Sistemleri:**
  - Ağaç türleri katmanı açılıp kapatılabiliyor
  - Orman yoğunluğu katmanı açılıp kapatılabiliyor
  - Yangın risk overlay'i açılıp kapatılabiliyor

- 💬 **Detaylı Popup'lar:**
  - Yangına tıklayınca detaylı bilgi açılıyor
  - Konum, şiddet, alan, durum
  - Ağaç türü özel vurgulanmış
  - Orman yoğunluğu gösteriliyor

## 📊 Veri Yapısı

### Orman Yoğunluğu Verisi (`forest-density-data.json`)
```json
{
  "cityName": "Muğla",
  "dominantTree": "Kızılçam",
  "forestDensity": 75,
  "fireRisk": 82,
  "color": "#8B4513",
  "treeColor": "#2D5016"
}
```

**30 İl İçin Veri:**
- Muğla, Antalya, Mersin, İzmir (Kızılçam - Yüksek Risk)
- Rize, Trabzon, Artvin (Ladin - Düşük Risk)
- Kastamonu, Sinop, Bolu (Kayın - Orta Risk)
- Isparta, Burdur (Karaçam - Orta-Yüksek Risk)

### Son 24 Saat Yangın Verisi
```json
{
  "id": 1,
  "location": "Muğla - Bodrum",
  "lat": 37.0344,
  "lon": 27.4305,
  "severity": "critical",
  "area": "42 hektar",
  "treeType": "Kızılçam Ormanı",
  "affectedDensity": 85
}
```

**3 Aktif Yangın:**
1. Muğla - Bodrum (Kritik, 42 ha)
2. Antalya - Manavgat (Kritik, 127 ha)
3. İzmir - Urla (Yüksek, 8 ha - Söndürüldü)

## 🎨 Görsel Tasarım

### Renk Paleti
- **Ana Tema:** Koyu (#303030, #404040, #505050)
- **Vurgu Rengi:** Turkuaz (#00D9A5)
- **Yangın:** Kırmızı-Turuncu gradient
- **Ağaç Türleri:** Doğal kahverengi ve yeşil tonları

### Animasyon ve Efektler
- ✨ Pulse animasyonu (yangınlar için)
- ✨ Glow efekti (aktif yangınlar)
- ✨ Ripple efekti (dalga yayılması)
- ✨ Float animasyonu (yumuşak hareket)
- ✨ Hover transitions
- ✨ Smooth opacity changes

### Tipografi
- **Başlıklar:** Bold, 14-16px
- **Metin:** Regular, 12-13px
- **İkonlar:** 16-20px (legend), 28px (yangın), 5-6px (ağaç)

## 🔧 Teknik Detaylar

### Kullanılan Kütüphaneler
- **Leaflet.js** - Harita motoru
- **Google Hybrid Tiles** - Satellite/terrain görünüm
- **React Hooks** - State yönetimi
- **TypeScript** - Type safety

### Performans Optimizasyonları
- ✅ Lazy loading (dynamic import)
- ✅ Layer grouping
- ✅ Optimized polygon rendering
- ✅ CSS animations (GPU accelerated)
- ✅ Conditional rendering

### Responsive Tasarım
- 📱 Mobil uyumlu legend
- 📱 Touch-friendly tooltips
- 📱 Responsive popup'lar
- 📱 Scroll edilebilir içerikler

## 🎯 Kullanıcı Deneyimi İyileştirmeleri

### Önce
- ❌ Basit OpenStreetMap
- ❌ Sadece yangın işaretleri
- ❌ Ağaç türü bilgisi yok
- ❌ Orman yoğunluğu gösterilmiyor
- ❌ Basit legend

### Sonra
- ✅ Fiziki/uydu haritası
- ✅ 3 katmanlı sistem (ağaç türü + yoğunluk + risk)
- ✅ Animasyonlu yangın işaretleri
- ✅ İnteraktif tooltip'ler
- ✅ Detaylı legend + toggle'lar
- ✅ Ağaç türü ön planda

## 📱 Kullanım Kılavuzu

### Harita Kullanımı
1. **Zoom/Pan:** Haritada gezinmek için mouse veya touch kullanın
2. **Katmanlar:** Sağ üstteki legend'dan katmanları açıp kapatabilirsiniz
3. **Bölge İnceleme:** Bir ile hover yaparak detaylı bilgi alın
4. **Yangın Detayı:** Yangın ikonuna tıklayarak tam detayları görün

### Legend Özellikleri
- ✅ **Ağaç Türleri:** Haritadaki renk kodlarını gösterir
- ✅ **Risk Seviyeleri:** Bölgelerin tehlike durumu
- ✅ **Yangın Durumu:** Aktif yangınların kategorisi
- ✅ **Toggle'lar:** İstediğiniz katmanı açıp kapatın

## 🚀 Gelecek Geliştirmeler

### Önerilen Özellikler
1. 📊 Zaman serisi analizi (geçmiş yangınlar)
2. 🌡️ Hava durumu entegrasyonu (OpenWeatherMap)
3. 📈 Yangın yayılma simülasyonu
4. 🛰️ Gerçek zamanlı uydu verisi (NASA FIRMS)
5. 📍 GPS koordinat arama
6. 📤 Veri export (PDF/CSV)
7. 🔔 Alert sistemi (yeni yangın bildirimleri)
8. 📊 İstatistik dashboard'u

## 💡 Notlar

- Tüm veriler **mock/simülasyon** verisidir
- Gerçek zamanlı entegrasyon için NASA FIRMS API önerilir
- Ağaç türü verileri OGM verilerine dayalıdır
- Yangın risk hesaplaması 6 faktör kullanır (ağaç türü, sıcaklık, nem, rüzgar, eğim, yoğunluk)
- Harita performansı optimize edilmiştir (30+ polygon)

---

**Geliştirme Tarihi:** 18 Ekim 2025  
**Platform:** Next.js 15 + React 18 + TypeScript + Leaflet  
**Tarayıcı Desteği:** Chrome, Firefox, Safari, Edge (son 2 versiyon)

