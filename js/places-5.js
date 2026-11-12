// GlobePlanner extra places — top-ups so every region can fill whole days
(function () {
  const A = window.gpAddPlaces;

  A("spain", {}, [
    ["spain_gran_via", "Gran Vía", "Gran Vía & Callao", "Gran Vía & Callao", "madrid_centro", "bazaars/views", 40.4200, -3.7058, "a", 1.5, "a",
      "Madrid'in Broadway'i; 1900'lerin görkemli binaları ve mağazalar.", "Madrid's Broadway, lined with grand early-1900s buildings and shops.",
      "Círculo de Bellas Artes çatısından bulvara bakın.", "Look down the avenue from the Círculo de Bellas Artes rooftop.",
      "Madrid Metro Gran Vía.", "Madrid Metro to Gran Vía."],
    ["spain_temple_debod", "Temple of Debod", "Debod Tapınağı", "Temple of Debod", "madrid_centro", "history/views", 40.4240, -3.7178, "s", 1, "a",
      "Mısır'dan hediye edilen 2.200 yıllık tapınak; Madrid'in gün batımı noktası.", "2,200-year-old Egyptian temple gifted to Spain—Madrid's sunset spot.",
      "Gün batımında havuzdaki yansımayı çekin.", "Shoot its reflection in the pool at sunset.",
      "Madrid Metro Plaza de España.", "Madrid Metro to Plaza de España."],
    ["spain_la_latina", "La Latina", "La Latina Tapas Turu", "La Latina Tapas Crawl", "madrid_centro", "food/nightlife", 40.4110, -3.7090, "e", 2.5, "em",
      "Cava Baja sokağında barlar arası tapas ve vermut.", "Bar-hopping for tapas and vermouth along Cava Baja.",
      "Pazar öğlen El Rastro pazarından sonra gelin.", "Come on Sunday after the El Rastro flea market.",
      "Madrid Metro La Latina.", "Madrid Metro to La Latina."]
  ]);

  A("austria", {}, [
    ["austria_augarten", "Augarten", "Augarten & Viyana Porselen", "Augarten & Porcelain Manufactory", "donaukanal_nightlife", "art/views", 48.2240, 16.3740, "a", 1.5, "em",
      "Barok bahçe ve 1718'den beri porselen üreten imalathane.", "Baroque park and a porcelain manufactory dating from 1718.",
      "Viyana Çocuk Korosu'nun evi de buradadır.", "It's also home to the Vienna Boys' Choir.",
      "Tram 2 Obere Augartenstraße.", "Tram 2 to Obere Augartenstraße."]
  ]);

  A("greece", {}, [
    ["greece_kallimarmaro_walk", "Zappeion", "Zappeion Sarayı", "Zappeion Hall", "syntagma_kolonaki", "history/views", 37.9714, 23.7369, "a", 0.5, "a",
      "Ulusal Bahçe içinde ilk modern olimpiyatlar için yapılan neoklasik saray.", "Neoclassical hall in the National Garden built for the first modern Olympics.",
      "Önündeki bahçede kafede dinlenin.", "Rest at the garden café out front.",
      "Tram Zappeio.", "Tram to Zappeio."]
  ]);

  A("japan", {}, [
    ["japan_nijo", "Nijō Castle", "Nijo Kalesi", "Nijō Castle", "kyoto", "history/art", 35.0142, 135.7481, "m", 1.5, "em",
      "Yürürken kuş gibi öten 'bülbül zeminleri'yle şogun sarayı.", "Shogun's palace with 'nightingale floors' that chirp as you walk.",
      "Ninomaru Bahçesi'ni kaçırmayın.", "Don't miss the Ninomaru Garden.",
      "Kyoto Subway Nijojo-mae.", "Kyoto Subway to Nijojo-mae."],
    ["japan_kyoto_tower_sake", "Fushimi-ku, Kyoto", "Fushimi Sake Bölgesi", "Fushimi Sake District", "kyoto", "food/history", 34.9320, 135.7610, "a", 2, "em",
      "Kanallı tarihi sake fabrikaları ve tadım salonları.", "Historic canal-side sake breweries and tasting rooms.",
      "Gekkeikan Okura Müzesi'nde tadım yapın.", "Do a tasting at the Gekkeikan Okura Museum.",
      "Keihan Chushojima.", "Keihan Line to Chushojima."]
  ]);

  A("usa", {}, [
    ["usa_georgetown", "Georgetown (Washington, D.C.)", "Georgetown", "Georgetown", "washington_dc", "food/bazaars", 38.9097, -77.0654, "e", 2, "em",
      "Arnavut kaldırımlı tarihi semt, kanal yolu ve Potomac kıyısı restoranlar.", "Cobbled historic district with a canal path and Potomac waterfront dining.",
      "Georgetown Cupcake'te tatlı molası verin.", "Stop for a treat at Georgetown Cupcake.",
      "DC Circulator otobüsü.", "DC Circulator bus."]
  ]);

  A("egypt", {}, [
    ["egypt_montaza", "Montaza Palace", "Montaza Sarayı Bahçeleri", "Montaza Palace Gardens", "alexandria", "history/views", 31.2880, 30.0160, "a", 1.5, "e",
      "Akdeniz kıyısında son kralın yazlık sarayı ve geniş bahçeleri.", "The last king's summer palace and vast gardens on the Mediterranean.",
      "Bahçeler ve sahil girişi uygun fiyatlıdır.", "Garden and beach entry is cheap.",
      "Corniche boyunca taksi.", "Taxi along the Corniche."],
    ["egypt_kom_el_shoqafa", "Catacombs of Kom El Shoqafa", "Kom el-Şukafa Katakombları", "Catacombs of Kom El Shoqafa", "alexandria", "history/art", 31.1786, 29.8930, "m", 1, "em",
      "Mısır, Yunan ve Roma motiflerinin karıştığı yer altı mezarları.", "Underground tombs blending Egyptian, Greek and Roman art.",
      "Pompey Sütunu hemen yakındadır.", "Pompey's Pillar is nearby.",
      "Karmouz bölgesi, taksi.", "Karmouz district, by taxi."]
  ]);

  A("uae", {}, [
    ["uae_corniche_abu_dhabi", "Corniche (Abu Dhabi)", "Abu Dabi Corniche", "Abu Dhabi Corniche", "abu_dhabi", "views/food", 24.4760, 54.3410, "s", 1.5, "a",
      "8 km'lik sahil yolu, halk plajı ve gün batımı kafeleri.", "8 km waterfront promenade with public beach and sunset cafés.",
      "Bisiklet kiralayıp sahil boyunca gezin.", "Rent a bike and ride the waterfront.",
      "Abu Dabi merkez.", "Central Abu Dhabi."]
  ]);

  A("thailand", {}, [
    ["thailand_wat_suthat", "Wat Suthat", "Wat Suthat & Dev Salıncak", "Wat Suthat & Giant Swing", "rattanakosin_temples", "history/art", 13.7510, 100.5010, "a", 1, "e",
      "Kırmızı Dev Salıncak ve duvar resimli kraliyet tapınağı.", "Royal temple with murals beside the red Giant Swing.",
      "Akşamüstü ışığında salıncağı fotoğraflayın.", "Photograph the swing in late-afternoon light.",
      "MRT Sam Yot.", "MRT to Sam Yot."],
    ["thailand_pak_khlong", "Pak Khlong Talat", "Pak Khlong Talat Çiçek Pazarı", "Pak Khlong Talat Flower Market", "chinatown_food", "bazaars", 13.7425, 100.4970, "e", 1, "e",
      "24 saat açık, gece en canlı olan dev çiçek pazarı.", "Huge 24-hour flower market, liveliest at night.",
      "Gece yarısından sonra çiçek kamyonları gelir.", "Flower trucks arrive after midnight.",
      "MRT Sanam Chai.", "MRT to Sanam Chai."],
    ["thailand_benjakitti", "Benjakitti Park", "Benjakitti Orman Parkı", "Benjakitti Forest Park", "sukhumvit_silom", "views", 13.7300, 100.5590, "s", 1.5, "a",
      "Gökdelenlere bakan yükseltilmiş yürüyüş yollu sulak alan parkı.", "Wetland park with elevated skywalks facing the skyline.",
      "Gün batımında yükseltilmiş yolda yürüyün.", "Walk the skywalk at sunset.",
      "MRT Queen Sirikit Centre.", "MRT to Queen Sirikit Centre."],
    ["thailand_sri_mariamman", "Sri Maha Mariamman Temple, Bangkok", "Sri Mariamman Hindu Tapınağı", "Sri Mariamman Hindu Temple", "sukhumvit_silom", "history/art", 13.7240, 100.5230, "a", 0.5, "a",
      "Silom'da rengarenk heykelli kuleyle Hindu tapınağı.", "Hindu temple in Silom with a rainbow-sculpted tower.",
      "İçeride fotoğraf çekmek yasaktır.", "Photography is not allowed inside.",
      "BTS Surasak.", "BTS to Surasak."]
  ]);

  A("portugal", {}, [
    ["portugal_portimao", "Praia da Rocha", "Praia da Rocha (Portimão)", "Praia da Rocha (Portimão)", "algarve_coast", "views/nightlife", 37.1180, -8.5370, "s", 2.5, "em",
      "Altın kayalıklı geniş plaj ve akşam canlanan sahil barları.", "Wide beach of golden cliffs with seafront bars that liven up at night.",
      "Fortaleza de Santa Catarina'dan gün batımını izleyin.", "Watch sunset from the Santa Catarina fortress.",
      "Lagos'tan otobüs, 30 dk.", "30 min bus from Lagos."]
  ]);

  A("czechia", {}, [
    ["czech_rudolfinum", "Rudolfinum", "Rudolfinum Konser Salonu", "Rudolfinum Concert Hall", "prague_oldtown", "art/nightlife", 50.0899, 14.4155, "e", 2, "m",
      "Çek Filarmoni'nin evi neo-Rönesans konser sarayı.", "Neo-Renaissance home of the Czech Philharmonic.",
      "Öğrenci/son dakika biletlerine bakın.", "Look for last-minute tickets.",
      "Metro Staroměstská.", "Metro to Staroměstská."],
    ["czech_spanish_synagogue", "Spanish Synagogue (Prague)", "İspanyol Sinagogu", "Spanish Synagogue", "prague_oldtown", "history/art", 50.0902, 14.4194, "a", 0.5, "em",
      "Altın Mağribi süslemeleriyle Avrupa'nın en güzel sinagoglarından.", "One of Europe's most beautiful synagogues with golden Moorish décor.",
      "Yahudi Müzesi bileti kapsar.", "Covered by the Jewish Museum ticket.",
      "Metro Staroměstská.", "Metro to Staroměstská."],
    ["czech_naplavka", "Náplavka", "Náplavka Nehir Kıyısı", "Náplavka Riverbank", "prague_oldtown", "nightlife/food", 50.0700, 14.4140, "s", 2, "e",
      "Tekne barları ve Cumartesi çiftçi pazarıyla Vltava kıyısı.", "Vltava embankment of boat bars and a Saturday farmers' market.",
      "Cumartesi sabahı pazarı ziyaret edin.", "Visit the Saturday morning market.",
      "Tram Výtoň.", "Tram to Výtoň."],
    ["czech_zizkov_tower", "Žižkov Television Tower", "Žižkov TV Kulesi", "Žižkov TV Tower", "prague_oldtown", "views/art", 50.0809, 14.4510, "s", 1, "em",
      "Tırmanan bebek heykelleriyle fütüristik kule ve seyir terası.", "Futuristic tower with crawling-baby sculptures and an observation deck.",
      "Tek odalı 'otel' kapsülünü görün.", "Peek at its one-room hotel pod.",
      "Metro Jiřího z Poděbrad.", "Metro to Jiřího z Poděbrad."],
    ["czech_cafe_louvre", "Café Louvre", "Café Louvre", "Café Louvre", "prague_oldtown", "food/history", 50.0820, 14.4190, "m", 1, "em",
      "Kafka ve Einstein'ın uğradığı 1902 tarihli Art Nouveau kafe.", "1902 art-nouveau café once visited by Kafka and Einstein.",
      "Kahvaltıda Çek usulü krep isteyin.", "Try Czech-style pancakes at breakfast.",
      "Tram Národní třída.", "Tram to Národní třída."]
  ]);

  A("norway", {}, [
    ["norway_ekeberg", "Ekebergparken Sculpture Park", "Ekeberg Heykel Parkı", "Ekeberg Sculpture Park", "oslo_city", "art/views", 59.8990, 10.7610, "s", 1.5, "a",
      "Munch'un 'Çığlık'a ilham veren manzarasına bakan orman heykel parkı.", "Forest sculpture park overlooking the view that inspired The Scream.",
      "'Çığlık' bankından fiyorda bakın.", "Look out from the Scream viewpoint bench.",
      "Tram 13/19 Ekebergparken.", "Tram 13/19 to Ekebergparken."],
    ["norway_stavanger_cathedral", "Stavanger Cathedral", "Stavanger Katedrali & Petroleum Müzesi", "Stavanger Cathedral & Petroleum Museum", "stavanger", "history", 58.9690, 5.7330, "a", 1.5, "em",
      "Norveç'in en eski katedrali ve petrol platformu temalı müze.", "Norway's oldest cathedral and an oil-platform themed museum.",
      "Müzenin çocuk oyun alanı ailelere idealdir.", "The museum's play area is great for families.",
      "Stavanger merkez.", "Central Stavanger."],
    ["norway_polaria", "Polaria", "Polaria Arktik Akvaryumu", "Polaria Arctic Aquarium", "northern_norway", "views", 69.6430, 18.9480, "a", 1.5, "em",
      "Devrilmiş buz kütleleri şeklindeki binada sakallı foklar.", "Bearded seals in a building shaped like toppled ice floes.",
      "Fok besleme saatlerine göre gidin.", "Time your visit for seal feeding.",
      "Tromsø merkez.", "Central Tromsø."]
  ]);

  A("iceland", {}, [
    ["iceland_stykkisholmur", "Stykkishólmur", "Stykkishólmur Liman Kasabası", "Stykkishólmur Harbour Town", "snaefellsnes", "food/views", 65.0750, -22.7290, "e", 2, "em",
      "Renkli ahşap evler, deniz feneri tepesi ve taze midye.", "Colourful wooden houses, a lighthouse hill and fresh mussels.",
      "Narfeyrarstofa'da midye çorbası deneyin.", "Try mussel soup at Narfeyrarstofa.",
      "Snæfellsnes kuzey sahili.", "Snæfellsnes north coast."]
  ]);
})();

window.gpFinalizePlaces();
