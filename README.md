# 🌍 GlobePlanner - Akıllı Dünya Seyahat & Tatil Asistanı

Dünyanın tüm ülkeleri için seyahat süresine, ilgi alanlarına, bütçesine ve seyahat tarzına göre optimize edilmiş, **trafiğe takılmayan lojistik kümelemeli** günlük tatil rotaları oluşturan yeni nesil seyahat platformu.

---

## 🌟 Öne Çıkan Özellikler

1. **Küresel Ülke & Destinasyon Seçici:**
   - **Öne Çıkan Popüler Rotalar:**
     - 🇹🇷 **Türkiye** (İstanbul, Kapadokya)
     - 🇦🇹 **Avusturya** (Viyana Schönbrunn, Aziz Stefan, Belvedere, Hallstatt masal köyü)
     - 🇳🇱 **Hollanda** (Amsterdam kanalları, Rijksmuseum, Van Gogh, Zaanse Schans yel değirmenleri)
     - 🇮🇹 **İtalya** (Roma Kolezyum, Trevi Çeşmesi, Pantheon, Vatikan, Trastevere)
     - 🇫🇷 **Fransa** (Paris, Eyfel, Louvre)
     - 🇪🇸 **İspanya** (Barselona, Sagrada Familia)
     - 🇩🇪 **Almanya**, 🇬🇧 **Birleşik Krallık**, 🇬🇷 **Yunanistan**, 🇯🇵 **Japonya** vb.
   - **20 Ülke, 700+ Gerçek Gezi Noktası:** Her ülkede 35+ gerçek yer var; 7 günlük yoğun planda bile hiçbir yer iki kez tekrar etmez. Her durağın fotoğrafı o yerin kendi Wikipedia fotoğrafıdır.

2. **Ülkeye Özel Hayatta Kalma Rehberleri (Survival Guides):**
   - **Avusturya:** Vienna City Card, Pazar günü mağaza kapanışları, tarihi Viyana kahvehane adabı ve Schönbrunn saatli biletleri.
   - **Hollanda:** OVpay temassız kart sistemi, kırmızı bisiklet yolları kuralı, Van Gogh/Anne Frank erken bilet rezervasyonu ve nakitsiz ödeme.
   - **İtalya:** Tren bilet onaylatma (validation), kilise kılık kıyafet kuralları, Nasoni ücretsiz içme suları ve Coperto hesabı.
   - **Türkiye:** İstanbulkart, vapurlar, cami kuralları ve müze sıraları.

3. **Akıllı Tercih Sihirbazı (4 Adımlı):**
   - Gün sayısı (1, 2, 3, 5, 7 gün), Yol arkadaşı, İlgi alanları ve Gezi temposu & Bütçe.

4. **İnteraktif Canlı Harita & Rota Çizgisi (Leaflet / OpenStreetMap):**
   - Seçilen ülkenin başkenti ve bölgelerine göre harita otomatik odaklanır, durakları numaralandırır ve rota bağlantılarını çizer.

5. **Tek Tıkla Çift Dil (TR / EN):**
   - Tüm ülkeler, başkentler, kartlar ve hayatta kalma tüyoları Türkçe ve İngilizce dillerinde tam uyumludur.

---

## 🚀 Nasıl Çalıştırılır?

Proje sıfır harici paket bağımlılığıyla hazırlanmıştır:

1. **Doğrudan Tarayıcıda Açmak İçin:**
   - [`index.html`](index.html) dosyasına çift tıklayarak Safari veya Chrome'da açabilirsiniz.

2. **Yerel Sunucu ile Çalıştırmak İçin:**
   ```bash
   cd /Users/meteyilmazdogan/.gemini/antigravity/scratch/istanbul-trip-planner
   ruby -run -ehttpd . -p3000
   ```
   Tarayıcınızdan `http://localhost:3000` adresine gidin.
