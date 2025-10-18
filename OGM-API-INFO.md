# OGM Yangın İzleme Sistemi - API Bilgileri

## 📋 Giriş Bilgileri

**OGM Girişi:**
- **Kullanıcı Adı:** `ogm123`
- **Şifre:** `admin`

**Birim Girişi (Kemerburgaz):**
- **Kullanıcı Adı:** `ogm123`
- **Şifre:** `admin`

---

## 🗺️ Parsel Haritası API'leri

### 1. TKGM Parsel Sorgulama API (Türkiye Resmi)
- **URL:** https://cbsapi.tkgm.gov.tr/megsiswebapi.v3.1
- **Durum:** ❌ Ticari kullanım yasak
- **Açıklama:** Tapu ve Kadastro Genel Müdürlüğü'nün resmi API'si ancak kullanım koşulları ticari kullanıma izin vermiyor.

### 2. OpenStreetMap (OSM) Overpass API
- **URL:** https://overpass-api.de/api/interpreter
- **Durum:** ✅ Ücretsiz, ticari kullanılabilir
- **Açıklama:** Orman alanları ve bazı arazi bilgileri sorgulanabilir. Parsel sınırları tam olmayabilir.
- **Örnek Sorgu:**
```javascript
const query = `
  [out:json];
  area["ISO3166-1"="TR"][admin_level=2];
  (
    way["landuse"="forest"](area);
    relation["landuse"="forest"](area);
  );
  out geom;
`;
```

### 3. Sentinel Hub API (Uydu Görüntüleri)
- **URL:** https://www.sentinel-hub.com/
- **Durum:** 💰 Sınırlı ücretsiz, ticari ücretli
- **Açıklama:** Uydu görüntüleri ile orman alanları tespit edilebilir.

---

## 🔥 Yangın Verisi API'leri

### 1. NASA FIRMS (Fire Information for Resource Management System)
- **URL:** https://firms.modaps.eosdis.nasa.gov/api/
- **Durum:** ✅ Ücretsiz
- **Açıklama:** Gerçek zamanlı aktif yangın tespiti. MODIS ve VIIRS uydu verileri.
- **API Key:** Ücretsiz kayıt gerekir
- **Örnek Kullanım:**
```javascript
// Son 24 saatteki yangınlar (Türkiye)
const API_KEY = 'YOUR_API_KEY';
const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${API_KEY}/VIIRS_SNPP_NRT/TUR/1`;

fetch(url)
  .then(response => response.text())
  .then(data => console.log(data));
```

### 2. Copernicus EFFIS (European Forest Fire Information System)
- **URL:** https://effis.jrc.ec.europa.eu/
- **Durum:** ✅ Ücretsiz (Avrupa odaklı, Türkiye dahil)
- **Açıklama:** Orman yangınları için gerçek zamanlı veri ve haritalar.

### 3. Global Forest Watch Fires API
- **URL:** https://www.globalforestwatch.org/
- **Durum:** ✅ Ücretsiz
- **Açıklama:** Küresel orman yangını izleme sistemi.

---

## 📊 Mock Veri Yapısı (Mevcut Uygulama)

### Yangın Verisi
```typescript
interface FireData {
  id: number;
  location: string;
  lat: number;
  lon: number;
  severity: "critical" | "high" | "medium" | "low";
  startTime: string;
  area: string;
  status: string;
  treeType: string;
}
```

### Yüksek Riskli Bölge Verisi
```typescript
interface HighRiskArea {
  id: number;
  name: string;
  lat: number;
  lon: number;
  risk: number; // 0-100
}
```

### Parsel Verisi
```typescript
interface Parcel {
  id: string;
  cityName: string;
  districtName?: string;
  coordinates: number[][];
  area: number; // m²
  forestType: string;
  treeSpecies: string[];
  dominantTree: string;
  forestDensity: number; // 0-100
  fireRisk: number; // 0-100
  elevation: number;
  slope: number;
}
```

---

## 🌲 Ağaç Türü Yanıcılık Tablosu

| Ağaç Türü | Yanıcılık Katsayısı | Risk Seviyesi |
|-----------|---------------------|---------------|
| Kızılçam | 85 | Çok Yüksek |
| Ladin | 75 | Yüksek |
| Karaçam | 70 | Yüksek |
| Sedir | 65 | Yüksek-Orta |
| Göknar | 60 | Orta-Yüksek |
| Meşe | 55 | Orta |
| Kayın | 50 | Orta |
| Kavak | 40 | Düşük-Orta |
| Söğüt | 35 | Düşük |

---

## 🔧 Yangın Risk Hesaplama Formülü

```typescript
function calculateFireRisk(params: {
  treeType: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  slope: number;
  forestDensity: number;
}): number {
  const treeRisk = TREE_FLAMMABILITY[params.treeType] || 50;
  const tempFactor = (params.temperature - 20) * 2;
  const humidityFactor = (100 - params.humidity) * 0.5;
  const windFactor = params.windSpeed * 0.8;
  const slopeFactor = params.slope * 0.5;
  const densityFactor = params.forestDensity * 0.3;
  
  const totalRisk = (
    treeRisk * 0.4 +
    tempFactor * 0.2 +
    humidityFactor * 0.15 +
    windFactor * 0.1 +
    slopeFactor * 0.1 +
    densityFactor * 0.05
  );
  
  return Math.min(Math.max(totalRisk, 0), 100);
}
```

---

## 🚀 Gerçek API'ye Geçiş İçin Adımlar

### 1. NASA FIRMS Entegrasyonu
```bash
# API Key almak için
https://firms.modaps.eosdis.nasa.gov/api/area/

# Türkiye için son 24 saat
https://firms.modaps.eosdis.nasa.gov/api/country/csv/[API_KEY]/VIIRS_SNPP_NRT/TUR/1
```

### 2. OpenStreetMap Overpass API
```javascript
const fetchForestData = async () => {
  const query = `
    [out:json][timeout:25];
    area["ISO3166-1"="TR"]->.searchArea;
    (
      way["landuse"="forest"](area.searchArea);
      way["natural"="wood"](area.searchArea);
    );
    out geom;
  `;
  
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query
  });
  
  return await response.json();
};
```

### 3. Hava Durumu API (OpenWeatherMap)
```javascript
const fetchWeather = async (lat, lon) => {
  const API_KEY = 'YOUR_API_KEY';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  
  const response = await fetch(url);
  return await response.json();
};
```

---

## 📍 Haritada Gösterilen Mock Yangınlar (Son 24 Saat)

1. **Muğla - Bodrum**
   - Koordinat: 37.0344, 27.4305
   - Şiddet: Yüksek
   - Alan: 42 hektar
   - Ağaç Tipi: Kızılçam Ormanı

2. **Antalya - Manavgat**
   - Koordinat: 36.7869, 31.4442
   - Şiddet: Kritik
   - Alan: 127 hektar
   - Ağaç Tipi: Kızılçam, Sedir

3. **İzmir - Urla**
   - Koordinat: 38.3242, 26.7692
   - Şiddet: Orta
   - Alan: 8 hektar
   - Ağaç Tipi: Kızılçam, Meşe

## 📍 Yüksek Riskli Bölgeler (12 Bölge)

Haritada turuncu uyarı işaretleri ile gösterilen 12 yüksek riskli bölge bulunmaktadır:
- Muğla - Marmaris (Risk: %85)
- Antalya - Kaş (Risk: %78)
- Muğla - Fethiye (Risk: %82)
- Antalya - Kemer (Risk: %76)
- Mersin - Silifke (Risk: %75)
- Aydın - Kuşadası (Risk: %72)
- İzmir - Çeşme (Risk: %70)
- Osmaniye - Düziçi (Risk: %69)
- Hatay - İskenderun (Risk: %68)
- Balıkesir - Ayvalık (Risk: %65)
- Kahramanmaraş - Elbistan (Risk: %64)
- Adana - Karataş (Risk: %62)

---

## 💡 Not

Bu uygulama şu anda **mock (simülasyon) verisi** kullanmaktadır. Gerçek zamanlı veri entegrasyonu için yukarıdaki API'lerden biri veya birkaçı kullanılabilir. NASA FIRMS en güvenilir ve ücretsiz gerçek zamanlı yangın verisi kaynağıdır.

