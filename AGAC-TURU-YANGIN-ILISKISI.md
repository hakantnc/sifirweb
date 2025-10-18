# 🌲🔥 Ağaç Türü - Yangın Riski İlişkisi Görselleştirmesi

## 🎯 Geliştirme Amacı
Kullanıcılara **ağaç türünün yangın ihtimalini doğrudan etkilediğini** net bir şekilde göstermek için frontend'de kapsamlı görselleştirmeler ve eğitici içerikler eklendi.

---

## ✅ Eklenen Özellikler

### 1. 📊 **Karşılaştırmalı Yanıcılık Dashboard'u**

**Konum:** OGM Girişi sayfasının en üstünde, büyük bir banner section

**İçerik:**
- **6 Ağaç Türü Karşılaştırmalı Kartlar:**
  - Kızılçam: 🔥 %85 (ÇOK YÜKSEK)
  - Ladin: ⚠️ %75 (YÜKSEK)
  - Karaçam: ⚠️ %70 (YÜKSEK)
  - Göknar: ⚡ %60 (ORTA-YÜKSEK)
  - Meşe: ✓ %55 (ORTA)
  - Kayın: ✓ %50 (ORTA)

**Görsel Özellikler:**
- Her kart kendi ağaç renginde
- Animasyonlu progress bar'lar
- Risk seviyesine göre border renkleri (kırmızı/turuncu/yeşil)
- Hover'da büyüme animasyonu
- Yüksek riskli ağaçlarda (≥70%) animasyonlu 🔥 badge

**Eğitici Alt Kartlar:**
1. **🔥 Reçineli Ağaçlar:**
   - "Kızılçam ve Ladin gibi reçine içeriği yüksek ağaçlar **3 kat daha hızlı** tutuşur"
   
2. **🌡️ Nem Oranı Etkisi:**
   - "Karaçam ve Göknar düşük nem oranlarında **%40 daha fazla** yangın riski taşır"
   
3. **💧 Geniş Yapraklılar:**
   - "Kayın ve Meşe yüksek nem içeriği sayesinde **doğal yangın bariyeri** oluşturur"

**Bilimsel Mesaj:**
> "Ağaç türü, yangın ihtimalini doğrudan etkileyen en önemli faktördür. Reçine içeriği yüksek ağaçlar 2-3 kat daha hızlı tutuşur."

---

### 2. 🗺️ **Haritada Gelişmiş Ağaç Türü Vurgulaması**

**Değişiklikler:**
- **Kalın border'lar:** 3px (normal), 4px (yüksek risk)
- **Artan opacity:** +0.1 daha görünür
- **Glow efekti:** CSS drop-shadow ile parıldama
- **Renk yoğunluğu:** Daha belirgin ağaç renkleri

**Her bölgede:**
- Ağaç türü rengine göre dolgu
- Orman yoğunluğuna göre opacity
- Risk seviyesine göre border kalınlığı

---

### 3. 💬 **Geliştirilmiş Tooltip'ler (Hover)**

**Yeni Görünüm:**
```
📍 [Şehir Adı]
━━━━━━━━━━━━━━━━━

🌲 AĞAÇ TÜRÜ
[Ağaç Adı - Büyük font]

┌─────────────────┐
│ Yanıcılık Oranı: │
│  🔥 %85         │
│ ⚠️ ÇOK YÜKSEK   │
│    YANICILIK!   │
└─────────────────┘

Orman Yoğunluğu: %75

🔥 YANGIN RİSKİ: %82
```

**Özellikler:**
- Ağaç türü özel vurgulanmış bölüm
- Yanıcılık oranı büyük gösterilmiş
- Yüksek yanıcılıkta (≥70%) kırmızı uyarı
- Görsel simgeler (🔥, ⚠️, ✓)
- Renkli border ve arka planlar

---

### 4. 🔥 **Yangın Popup'larında Ağaç Türü Vurgusu**

**Yapılan İyileştirmeler:**

#### A. Ağaç Türü Kartı (Popup içinde en belirgin)
- **3px kalın border** + glow efekti
- Büyük ağaç ikonu (14x14 div içinde)
- "⚠️ ETKİLENEN AĞAÇ TÜRÜ" başlığı
- 2xl font boyutunda ağaç adı

#### B. Yanıcılık Uyarı Kartları (Conditional)

**Kızılçam için:**
```
┌──────────────────────────────┐
│ 🔥 KRİTİK: Yüksek Yanıcılık! │
├──────────────────────────────┤
│ Kızılçam, reçine içeriği     │
│ nedeniyle %85 yanıcılık      │
│ oranına sahiptir. Normal     │
│ ağaçlardan 3 kat daha hızlı  │
│ tutuşur ve yangın yayılımını │
│ hızlandırır.                 │
└──────────────────────────────┘
(Animasyonlu, kırmızı border)
```

**Ladin/Karaçam için:**
```
┌──────────────────────────────┐
│ ⚠️ DİKKAT: Yüksek Risk!      │
├──────────────────────────────┤
│ Bu ağaç türü %70-75 yanıcılık│
│ oranına sahip. Kuru hava     │
│ koşullarında hızla tutuşabilir│
└──────────────────────────────┘
(Turuncu border)
```

#### C. Orman Yoğunluğu Etkisi
- Progress bar ile görselleştirme
- %80+ için: "🔥 Çok yoğun orman - Yangın yayılımı son derece hızlı"
- Gradient renklendirme

---

## 📈 Görsel Hiyerarşi

### Öncelik Sırası (En Belirgin → Az Belirgin)
1. **Dashboard Banner** (Sayfa açılır açılmaz görünür)
   - 6 ağaç türü karşılaştırması
   - Bar grafikler
   - Eğitici kartlar

2. **Yangın Popup'ları** (Yangına tıklandığında)
   - Ağaç türü özel vurgulanmış
   - Yanıcılık uyarıları
   - Animasyonlu efektler

3. **Harita Tooltip'leri** (Bölgeye hover)
   - Ağaç türü büyük gösterilmiş
   - Yanıcılık oranı belirtilmiş

4. **Harita Katmanları**
   - Renkli bölgeler
   - Kalın border'lar
   - Glow efektleri

---

## 🎨 Renk Kodlaması

### Yanıcılık Seviyeleri
- **%85+ (Kızılçam):** Kırmızı (#ef4444) - 🔥 ÇOK YÜKSEK
- **%70-84 (Ladin, Karaçam):** Turuncu (#fb923c) - ⚠️ YÜKSEK
- **%60-69 (Göknar):** Açık Turuncu (#fb923c) - ⚡ ORTA-YÜKSEK
- **%50-59 (Meşe, Kayın):** Yeşil (#4ade80) - ✓ ORTA

### Ağaç Türü Renkleri
- Kızılçam: #8B4513 (Kahverengi)
- Karaçam: #3B5323 (Koyu Yeşil)
- Ladin: #006400 (Orman Yeşili)
- Kayın: #556B2F (Zeytin Yeşili)
- Göknar: #2F4F4F (Deniz Yeşili)
- Meşe: #654321 (Koyu Kahve)

---

## 📊 İstatistikler ve Veriler

### Yanıcılık Faktörleri
| Ağaç Türü | Yanıcılık | Reçine İçeriği | Nem Oranı | Tutuşma Hızı |
|-----------|-----------|----------------|-----------|--------------|
| Kızılçam  | %85       | Çok Yüksek     | Düşük     | 3x          |
| Ladin     | %75       | Yüksek         | Düşük     | 2.5x        |
| Karaçam   | %70       | Orta-Yüksek    | Orta      | 2x          |
| Göknar    | %60       | Orta           | Orta      | 1.5x        |
| Meşe      | %55       | Düşük          | Yüksek    | 1x          |
| Kayın     | %50       | Düşük          | Yüksek    | 1x          |

### Etkilenen Alan Dağılımı (Mock Data)
- **Kızılçam Ormanları:** 3 aktif yangın (177 hektar)
- **Yüksek Riskli Bölge:** 12 alan (Muğla, Antalya, İzmir vb.)
- **Toplam İzlenen Parsel:** 1,547

---

## 🧠 Eğitici Mesajlar

### 1. Reçine Etkisi
> "Kızılçam ve Ladin gibi iğne yapraklı ağaçlar yüksek reçine içeriği nedeniyle son derece yanıcıdır. Reçine, doğal bir yakıt görevi görerek yangının hızla yayılmasına neden olur."

### 2. Nem Bariyeri
> "Kayın ve Meşe gibi geniş yapraklı ağaçlar yüksek su içeriği sayesinde doğal yangın bariyeri oluşturur. Bu ağaçlar yangın yayılımını yavaşlatır."

### 3. Yoğunluk Faktörü
> "Orman yoğunluğu %80'in üzerinde olduğunda, yangın yayılım hızı 2-3 kat artar. Yoğun ormanlarda ağaçlar arası yakın mesafe, ateşin sıçramasını kolaylaştırır."

---

## 🎯 Kullanıcı Deneyimi Akışı

### Akış 1: İlk Giriş
1. Kullanıcı OGM'ye giriş yapar (`ogm123` / `admin`)
2. **İLK GÖRDÜĞÜ:** Büyük dashboard banner
3. **6 ağaç türünü** yan yana karşılaştırır
4. **Bar grafiklerle** yanıcılık oranlarını görür
5. **Alt kartlarda** bilimsel açıklamaları okur
6. **Mesaj:** "Ağaç türü yangın riskini doğrudan etkiler"

### Akış 2: Harita Keşfi
1. Kullanıcı haritaya bakar
2. **Renkli bölgeler** dikkatini çeker
3. Bir bölgeye **hover** yapar
4. **Tooltip açılır:**
   - Şehir adı
   - **🌲 AĞAÇ TÜRÜ** (vurgulanmış)
   - **Yanıcılık Oranı: 🔥 %85**
   - "⚠️ ÇOK YÜKSEK YANICILIK!"
5. **Mesaj:** Bu bölge tehlikeli çünkü Kızılçam var

### Akış 3: Yangın Detayı
1. Kullanıcı aktif yangına tıklar
2. **Popup açılır**
3. **En belirgin bölüm:** Ağaç türü kartı (3px border, glow)
4. **Kırmızı uyarı kartı:**
   - "🔥 KRİTİK: Yüksek Yanıcılık!"
   - "Kızılçam 3 kat daha hızlı tutuşur"
5. **Orman yoğunluğu:** %85 → "Yangın yayılımı son derece hızlı"
6. **Mesaj:** Bu yangın tehlikeli çünkü:
   - Kızılçam (%85 yanıcılık)
   - Yüksek yoğunluk (%85)

---

## 💡 Teknik Detaylar

### Animasyonlar
- **Bar animasyonları:** 1 saniye transition
- **Hover scale:** 1.05x büyüme
- **Pulse efekti:** Yüksek risk badge'leri
- **Glow efekti:** Drop-shadow ile parıldama

### Responsive Tasarım
- **Desktop:** 6 sütun grid (her ağaç ayrı kart)
- **Tablet:** 3 sütun grid
- **Mobile:** 2 sütun grid
- Tüm fontlar responsive

### Performans
- CSS animasyonları (GPU accelerated)
- Conditional rendering (Sadece gerekli uyarılar gösteriliyor)
- Optimize edilmiş tooltip'ler

---

## 📸 Görsel Örnekler

### Dashboard Banner
```
┌────────────────────────────────────────────────────────────┐
│  🌲 AĞAÇ TÜRÜ - YANGIN RİSKİ İLİŞKİSİ                     │
│  "Ağaç türü, yangın ihtimalini doğrudan etkileyen en      │
│   önemli faktördür. Reçine içeriği yüksek ağaçlar 2-3 kat│
│   daha hızlı tutuşur."                                     │
│                                                            │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  │
│  │ 🌲  │  │ 🌲  │  │ 🌲  │  │ 🌲  │  │ 🌲  │  │ 🌲  │  │
│  │Kızıl│  │Ladin│  │Kara │  │Gök- │  │Meşe │  │Kayın│  │
│  │çam  │  │     │  │çam  │  │nar  │  │     │  │     │  │
│  ├─────┤  ├─────┤  ├─────┤  ├─────┤  ├─────┤  ├─────┤  │
│  │█████│  │████ │  │████ │  │███  │  │███  │  │██   │  │
│  │🔥85%│  │⚠️75%│  │⚠️70%│  │⚡60%│  │✓55% │  │✓50% │  │
│  │ ÇOK │  │YÜKSEK│ │YÜKSEK│ │ORTA-│  │ORTA │  │ORTA │  │
│  │YÜKSEK│ │     │  │     │  │YÜKSEK│ │     │  │     │  │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  │
│                                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │🔥 Reçineli   │ │🌡️ Nem Oranı │ │💧 Geniş      │     │
│  │   Ağaçlar    │ │   Etkisi     │ │   Yapraklılar│     │
│  │              │ │              │ │              │     │
│  │Kızılçam 3x   │ │Karaçam %40  │ │Kayın doğal   │     │
│  │daha hızlı    │ │daha fazla   │ │yangın        │     │
│  │tutuşur       │ │risk         │ │bariyeri      │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Sonuç

Kullanıcı artık **ağaç türünün yangın riskini nasıl etkilediğini** açıkça görebiliyor:

✅ **Dashboard'da** 6 ağaç türü karşılaştırmalı  
✅ **Haritada** renkli bölgeler + kalın border'lar  
✅ **Tooltip'lerde** yanıcılık oranı vurgulanmış  
✅ **Popup'larda** kritik uyarılar ve eğitici bilgiler  
✅ **Bilimsel mesajlar** ile desteklenmiş  

**Temel Mesaj:** 
> 🔥 **Kızılçam = Yüksek Risk** (Reçine + Düşük Nem)  
> ✓ **Kayın = Düşük Risk** (Yüksek Nem + Doğal Bariyer)

---

**Geliştirme Tarihi:** 18 Ekim 2025  
**Dosyalar:** `app/ogm-girisi/page.tsx`, `components/OGMMap.tsx`

