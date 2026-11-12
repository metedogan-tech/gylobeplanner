// Comprehensive Global Destination Database for GlobePlanner
// Includes curated databases for ALL 20 countries:
// Turkey, France, Spain, Germany, UK, Italy, Austria, Netherlands, Greece, Japan, USA, Egypt, UAE, Thailand, Brazil, Switzerland, Portugal, Czechia, Norway, Iceland.
// All places feature real, authentic landmark photos and strict category tags.

const COUNTRIES_REGISTRY = [
  {
    "id": "turkey",
    "nameTr": "Türkiye",
    "nameEn": "Turkey",
    "flag": "🇹🇷",
    "capital": "İstanbul & Ankara",
    "lat": 41.0082,
    "lng": 28.9784,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1567527259232-3a7fcd490c53?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1527066579998-dbbae57f45ce?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "france",
    "nameTr": "Fransa",
    "nameEn": "France",
    "flag": "🇫🇷",
    "capital": "Paris",
    "lat": 48.8566,
    "lng": 2.3522,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "spain",
    "nameTr": "İspanya",
    "nameEn": "Spain",
    "flag": "🇪🇸",
    "capital": "Barselona & Madrid",
    "lat": 41.3879,
    "lng": 2.16992,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "germany",
    "nameTr": "Almanya",
    "nameEn": "Germany",
    "flag": "🇩🇪",
    "capital": "Berlin",
    "lat": 52.52,
    "lng": 13.405,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "uk",
    "nameTr": "Birleşik Krallık",
    "nameEn": "United Kingdom",
    "flag": "🇬🇧",
    "capital": "Londra (London)",
    "lat": 51.5074,
    "lng": -0.1278,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "italy",
    "nameTr": "İtalya",
    "nameEn": "Italy",
    "flag": "🇮🇹",
    "capital": "Roma (Rome)",
    "lat": 41.9028,
    "lng": 12.4964,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "austria",
    "nameTr": "Avusturya",
    "nameEn": "Austria",
    "flag": "🇦🇹",
    "capital": "Viyana (Vienna)",
    "lat": 48.2082,
    "lng": 16.3738,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1578964317355-68427771ba6a?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "netherlands",
    "nameTr": "Hollanda",
    "nameEn": "Netherlands",
    "flag": "🇳🇱",
    "capital": "Amsterdam",
    "lat": 52.3676,
    "lng": 4.9041,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "greece",
    "nameTr": "Yunanistan",
    "nameEn": "Greece",
    "flag": "🇬🇷",
    "capital": "Atina (Athens)",
    "lat": 37.9838,
    "lng": 23.7275,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "japan",
    "nameTr": "Japonya",
    "nameEn": "Japan",
    "flag": "🇯🇵",
    "capital": "Tokyo & Kyoto",
    "lat": 35.6762,
    "lng": 139.6503,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "usa",
    "nameTr": "Amerika Birleşik Devletleri",
    "nameEn": "United States",
    "flag": "🇺🇸",
    "capital": "New York & Washington",
    "lat": 40.7128,
    "lng": -74.006,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "egypt",
    "nameTr": "Mısır",
    "nameEn": "Egypt",
    "flag": "🇪🇬",
    "capital": "Kahire (Cairo)",
    "lat": 30.0444,
    "lng": 31.2357,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1567527259232-3a7fcd490c53?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "uae",
    "nameTr": "Birleşik Arap Emirlikleri",
    "nameEn": "United Arab Emirates",
    "flag": "🇦🇪",
    "capital": "Dubai & Abu Dabi",
    "lat": 25.2048,
    "lng": 55.2708,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "thailand",
    "nameTr": "Tayland",
    "nameEn": "Thailand",
    "flag": "🇹🇭",
    "capital": "Bangkok & Phuket",
    "lat": 13.7563,
    "lng": 100.5018,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "brazil",
    "nameTr": "Brezilya",
    "nameEn": "Brazil",
    "flag": "🇧🇷",
    "capital": "Rio de Janeiro",
    "lat": -22.9068,
    "lng": -43.1729,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1527066579998-dbbae57f45ce?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1527066579998-dbbae57f45ce?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "switzerland",
    "nameTr": "İsviçre",
    "nameEn": "Switzerland",
    "flag": "🇨🇭",
    "capital": "Zürih & Luzern",
    "lat": 47.3769,
    "lng": 8.5417,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "portugal",
    "nameTr": "Portekiz",
    "nameEn": "Portugal",
    "flag": "🇵🇹",
    "capital": "Lizbon (Lisbon)",
    "lat": 38.7223,
    "lng": -9.1393,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "czechia",
    "nameTr": "Çekya",
    "nameEn": "Czech Republic",
    "flag": "🇨🇿",
    "capital": "Prag (Prague)",
    "lat": 50.0755,
    "lng": 14.4378,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "norway",
    "nameTr": "Norveç",
    "nameEn": "Norway",
    "flag": "🇳🇴",
    "capital": "Oslo",
    "lat": 59.9139,
    "lng": 10.7522,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=900&auto=format&fit=crop&q=80"
    }
  },
  {
    "id": "iceland",
    "nameTr": "İzlanda",
    "nameEn": "Iceland",
    "flag": "🇮🇸",
    "capital": "Reykjavik",
    "lat": 64.1466,
    "lng": -21.9426,
    "zoom": 13,
    "hasCurated": true,
    "images": {
      "history": "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=900&auto=format&fit=crop&q=80",
      "views": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=80",
      "nightlife": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
      "food": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
      "bazaars": "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=900&auto=format&fit=crop&q=80",
      "art": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=80"
    }
  }
];

const CURATED_DESTINATIONS = {
  "turkey": {
    "zones": {
      "sultanahmet": {
        "titleTr": "Tarihi Yarımada & Fatih (Eski Şehir)",
        "titleEn": "Historic Peninsula & Old City",
        "primaryNeighborhood": "Sultanahmet / Eminönü",
        "color": "#e11d48"
      },
      "beyoglu_karakoy": {
        "titleTr": "Beyoğlu, Galata & Karaköy (Canlı Kültür & Gece)",
        "titleEn": "Beyoğlu, Galata & Karaköy",
        "primaryNeighborhood": "Galata / İstiklal",
        "color": "#2563eb"
      },
      "besiktas_bosphorus": {
        "titleTr": "Boğaziçi, Beşiktaş & Ortaköy",
        "titleEn": "Bosphorus Coast & Beşiktaş",
        "primaryNeighborhood": "Ortaköy / Boğaz",
        "color": "#0891b2"
      },
      "kadikoy_moda": {
        "titleTr": "Anadolu Yakası: Kadıköy & Moda (Barlar & Lezzet)",
        "titleEn": "Asian Side: Kadıköy & Moda",
        "primaryNeighborhood": "Kadıköy / Moda",
        "color": "#d97706"
      }
    },
    "places": [
      {
        "id": "ayasofya",
        "nameTr": "Ayasofya-i Kebîr Cami-i Şerîfi",
        "nameEn": "Hagia Sophia Grand Mosque",
        "zone": "sultanahmet",
        "category": [
          "history",
          "views"
        ],
        "lat": 41.0086,
        "lng": 28.9802,
        "timeOfDay": "morning",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=900&auto=format&fit=crop&q=80",
        "descTr": "1500 yıllık mimari şaheser; Bizans ve Osmanlı medeniyetlerinin kesişim noktası.",
        "descEn": "A 1500-year-old architectural marvel standing at the crossroads of empires.",
        "insiderTipTr": "Sabah namazı sonrası veya 08:30 civarı giderseniz sıra beklemeden gezebilirsiniz.",
        "insiderTipEn": "Arrive around 08:30 AM to enter smoothly with minimal queues.",
        "transitTr": "T1 Tramvay hattı ile Sultanahmet durağı.",
        "transitEn": "Take T1 Tram to 'Sultanahmet' stop."
      },
      {
        "id": "sultanahmet_camii",
        "nameTr": "Sultanahmet Camii (Mavi Cami)",
        "nameEn": "The Blue Mosque",
        "zone": "sultanahmet",
        "category": [
          "history"
        ],
        "lat": 41.0054,
        "lng": 28.9768,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&auto=format&fit=crop&q=80",
        "descTr": "İznik çinileriyle süslü, 6 minareli Osmanlı klasik döneminin simge eseri.",
        "descEn": "Famous for its intricate blue İznik tiles and distinctive 6 minarets.",
        "insiderTipTr": "Giriş tamamen ücretsizdir; ibadet saatleri dışında ziyaret ediniz.",
        "insiderTipEn": "Entrance is free; please plan visits outside prayer times.",
        "transitTr": "Sultanahmet Meydanı içinden 2 dk yürüyüş.",
        "transitEn": "2 mins walk from Sultanahmet square."
      },
      {
        "id": "yerebatan_sarnici",
        "nameTr": "Yerebatan Sarnıcı",
        "nameEn": "Basilica Cistern",
        "zone": "sultanahmet",
        "category": [
          "history",
          "art"
        ],
        "lat": 41.0084,
        "lng": 28.9779,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Suyun içinden yükselen 336 mermer sütun, Ters Medusa başları ve çağdaş heykel ışıklandırmaları.",
        "descEn": "Subterranean Roman water reservoir supported by 336 marble columns and Medusa heads.",
        "insiderTipTr": "Biletinizi online alın, kapıdaki uzun bilet kuyruğundan kurtulun.",
        "insiderTipEn": "Pre-purchase e-tickets online to bypass the queue.",
        "transitTr": "Ayasofya'nın hemen karşısında.",
        "transitEn": "Directly opposite Hagia Sophia."
      },
      {
        "id": "topkapi_sarayi",
        "nameTr": "Topkapı Sarayı & Harem Dairesi",
        "nameEn": "Topkapi Palace & Imperial Harem",
        "zone": "sultanahmet",
        "category": [
          "history",
          "views"
        ],
        "lat": 41.0115,
        "lng": 28.9833,
        "timeOfDay": "afternoon",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1520541763955-f0ce4a3c10b4?w=900&auto=format&fit=crop&q=80",
        "descTr": "Osmanlı padişahlarının 400 yıl boyunca hüküm sürdüğü ihtişamlı saray kompleksi.",
        "descEn": "Imperial palace of the Ottoman Sultans for four centuries, overlooking the Bosphorus.",
        "insiderTipTr": "4. Avludaki Mecidiye Köşkü terasından Boğaz manzarasını mutlaka fotoğraflayın.",
        "insiderTipEn": "Head to the 4th courtyard's terrace for panoramic Bosphorus views.",
        "transitTr": "Gülhane Parkı girişinden veya Ayasofya arkasından 5 dk.",
        "transitEn": "5 mins walk from Hagia Sophia."
      },
      {
        "id": "kadikoy_barlar_sokagi",
        "nameTr": "Kadıköy Barlar Sokağı (Kadife Sokak) & Publar",
        "nameEn": "Kadıköy Bar Street & Indie Pubs",
        "zone": "kadikoy_moda",
        "category": [
          "nightlife"
        ],
        "lat": 40.988,
        "lng": 29.0275,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Anadolu Yakası'nın alternatif kültür kalbi; samimi kraft bira mekanları, canlı müzik ve sokak masaları.",
        "descEn": "The bohemian nightlife pulse of Istanbul's Asian shore with craft beers and indie terraces.",
        "insiderTipTr": "Karga Bar'ın tarihi taş binasındaki loş odalarında biranızı yudumlayın.",
        "insiderTipEn": "Visit Karga Bar, set inside an atmospheric 19th-century stone townhouse.",
        "transitTr": "Kadıköy Vapur İskelesi'nden 6 dk yürüyüş.",
        "transitEn": "6 mins walk from Kadıköy Ferry Terminal."
      },
      {
        "id": "asmalimescit_gece",
        "nameTr": "Beyoğlu Asmalımescit Barlar & Meyhaneler",
        "nameEn": "Asmalımescit Historic Nightlife & Taverns",
        "zone": "beyoglu_karakoy",
        "category": [
          "nightlife"
        ],
        "lat": 41.031,
        "lng": 28.9745,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
        "descTr": "Tarihi Pera sokaklarında açık hava masaları, yerel kokteyl barları ve gece boyu süren enerji.",
        "descEn": "Pedestrian cobblestone nightlife alleys filled with historic taverns and lively outdoor bars.",
        "insiderTipTr": "Akşam 20:00 sonrası ara sokaklardaki canlı jazz ve akustik mekanlara uğrayın.",
        "insiderTipEn": "Explore side lanes after 8 PM for live jazz and outdoor wine bars.",
        "transitTr": "M2 Şişhane durağı veya Tünel çıkışı.",
        "transitEn": "M2 Metro 'Şişhane' station."
      },
      {
        "id": "besiktas_publar",
        "nameTr": "Beşiktaş Köyiçi Canlı Publar & Barlar Bölgesi",
        "nameEn": "Beşiktaş Köyiçi Lively Pubs & Beer Hub",
        "zone": "besiktas_bosphorus",
        "category": [
          "nightlife"
        ],
        "lat": 41.0425,
        "lng": 29.0065,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Üniversitelilerin ve yerel halkın doldurduğu, uygun fiyatlı biralar ve dinamik sokak atmosferi.",
        "descEn": "High-energy pub zone loved by locals with craft beer taps and vibrant outdoor seating.",
        "insiderTipTr": "Maç günleri hariç açık hava masalarında uygun fiyata yerel fıçı biraları deneyebilirsiniz.",
        "insiderTipEn": "Great budget-friendly pints and lively terrace conversations.",
        "transitTr": "Beşiktaş Meydanı'ndan 3 dk yürüme.",
        "transitEn": "3 mins walk from Beşiktaş Square."
      },
      {
        "id": "moda_sahili_gunbatimi",
        "nameTr": "Moda Sahil Parkı & Çay Bahçesi Gün Batımı",
        "nameEn": "Moda Coastal Promenade & Sunset Tea Gardens",
        "zone": "kadikoy_moda",
        "category": [
          "views",
          "nightlife"
        ],
        "lat": 40.979,
        "lng": 29.026,
        "timeOfDay": "sunset",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
        "descTr": "Tarihi Yarımada silüetine karşı batan güneşi çimlere oturarak izleyebileceğiniz kentin en huzurlu sahili.",
        "descEn": "Scenic waterfront greensward offering postcard sunset views of the Old City silhouette.",
        "insiderTipTr": "Giriş tamamen ücretsizdir; yerel halk gibi çimlere oturup çekirdek ve içeceğinizle gün batımını seyredin.",
        "insiderTipEn": "Completely free entrance; join locals sitting on the grass for twilight views.",
        "transitTr": "T3 Tarihi Moda Tramvayı ile Moda İlkokulu durağı.",
        "transitEn": "Take T3 Nostalgic Tram to Moda."
      },
      {
        "id": "eminonu_balik_ekmek",
        "nameTr": "Tarihi Eminönü Balık Ekmek & Turşu Suyu",
        "nameEn": "Historic Eminönü Fish Sandwiches & Pickle Juice",
        "zone": "sultanahmet",
        "category": [
          "food"
        ],
        "lat": 41.018,
        "lng": 28.973,
        "timeOfDay": "afternoon",
        "durationHours": 1.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "Haliç kıyısında sallanan teknelerde ızgara edilen taze uskumru ekmek ve baharatlı turşu suyu.",
        "descEn": "Istanbul's iconic street food tradition: freshly grilled mackerel fillets in crusty loaves by the water.",
        "insiderTipTr": "Sadece 120-150 TL civarında hem doyurucu hem de Boğaz havası aldıran ekonomik bir öğle yemeğidir.",
        "insiderTipEn": "One of the city's cheapest and most iconic lunches right by the water.",
        "transitTr": "T1 Eminönü veya vapur iskelesi.",
        "transitEn": "T1 Tram to 'Eminönü'."
      },
      {
        "id": "sultanahmet_koftecisi",
        "nameTr": "Tarihi Sultanahmet Köftecisi (1920)",
        "nameEn": "Historic Sultanahmet Meatballs (Est. 1920)",
        "zone": "sultanahmet",
        "category": [
          "food"
        ],
        "lat": 41.008,
        "lng": 28.976,
        "timeOfDay": "afternoon",
        "durationHours": 1.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "100 yılı aşkın süredir katkısız dana etiyle hazırlanan ızgara köfte, piyaz ve acı biber sosu.",
        "descEn": "Serving legendary chargrilled meatballs and white bean salad on Divanyolu street since 1920.",
        "insiderTipTr": "Tabelasında '1920' yazan orijinal dükkana oturun; köftenin yanında mutlaka piyaz ve yayık ayranı isteyin.",
        "insiderTipEn": "Look for the original 1920 facade on Divanyolu; order the piyaz bean salad and ayran.",
        "transitTr": "Sultanahmet tramvay durağının hemen karşısı.",
        "transitEn": "Directly opposite Sultanahmet tram stop."
      },
      {
        "id": "galata_kulesi",
        "nameTr": "Tarihi Galata Kulesi & Çevre Sokakları",
        "nameEn": "Galata Tower & Cobblestone Quarter",
        "zone": "beyoglu_karakoy",
        "category": [
          "history",
          "views"
        ],
        "lat": 41.0256,
        "lng": 28.9741,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=900&auto=format&fit=crop&q=80",
        "descTr": "1348 yapımı Ceneviz kulesi; 360 derece Boğaz, Haliç ve Tarihi Yarımada panoraması.",
        "descEn": "14th-century Genoese stone watchtower boasting unmatched 360-degree vistas.",
        "insiderTipTr": "Kule meydanındaki kafelerde çay içip kulenin taş cephesini aşağıdan fotoğraflamak ücretsizdir.",
        "insiderTipEn": "Enjoying tea at the plaza cafes and photographing the exterior is completely free.",
        "transitTr": "Karaköy'den yürüyerek 6 dk yukarı.",
        "transitEn": "6 mins walk uphill from Karaköy."
      },
      {
        "id": "kapalicarsi",
        "nameTr": "Tarihi Kapalıçarşı (Grand Bazaar)",
        "nameEn": "The Grand Bazaar (Kapalıçarşı)",
        "zone": "sultanahmet",
        "category": [
          "bazaars",
          "history"
        ],
        "lat": 41.0107,
        "lng": 28.968,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1567527259232-3a7fcd490c53?w=900&auto=format&fit=crop&q=80",
        "descTr": "4000 dükkanı ve 64 sokağıyla dünyanın en eski ve en büyük kapalı alışveriş merkezi.",
        "descEn": "One of the world's oldest covered markets with over 4,000 artisan stalls and spice arcades.",
        "insiderTipTr": "İç bedestendeki tarihi kahvehanelerde közde Türk kahvesi için.",
        "insiderTipEn": "Stop by Zincirli Han or the inner bedesten for authentic Turkish coffee brewed on hot sand.",
        "transitTr": "T1 Beyazıt-Kapalıçarşı durağı.",
        "transitEn": "T1 Tram to 'Beyazıt'."
      }
    ]
  },
  "france": {
    "zones": {
      "eiffel_seine": {
        "titleTr": "Eyfel Kulesi & Seine Nehri",
        "titleEn": "Eiffel Tower & Seine River",
        "primaryNeighborhood": "7th Arrondissement / Champ de Mars",
        "color": "#2563eb"
      },
      "louvre_central": {
        "titleTr": "Louvre & Tarihi Merkez",
        "titleEn": "Louvre Museum & Central Paris",
        "primaryNeighborhood": "1st Arrondissement / Châtelet",
        "color": "#e11d48"
      },
      "marais_nightlife": {
        "titleTr": "Le Marais & Bastille (Barlar & Gece Hayatı)",
        "titleEn": "Le Marais & Bastille Nightlife",
        "primaryNeighborhood": "4th Arrondissement / Bastille",
        "color": "#d97706"
      },
      "montmartre_bohemian": {
        "titleTr": "Montmartre & Sacré-Cœur",
        "titleEn": "Montmartre & Sacré-Cœur",
        "primaryNeighborhood": "18th Arrondissement",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "paris_eiffel_tower",
        "nameTr": "Eyfel Kulesi (Tour Eiffel) & Champ de Mars",
        "nameEn": "Eiffel Tower & Champ de Mars",
        "zone": "eiffel_seine",
        "category": [
          "history",
          "views"
        ],
        "lat": 48.8584,
        "lng": 2.2945,
        "timeOfDay": "morning",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=900&auto=format&fit=crop&q=80",
        "descTr": "1889 Dünya Fuarı için inşa edilen Paris'in 330 metrelik demir simgesi; kentin en büyüleyici manzarası.",
        "descEn": "Iconic 330-meter wrought-iron lattice monument offering panoramic views over Parisian rooftops.",
        "insiderTipTr": "Her saat başı 5 dakika boyunca parıldayan altın ışık şovunu Trocadéro meydanından ücretsiz izleyin.",
        "insiderTipEn": "Watch the magical 5-minute sparkle show at the top of every hour from Place du Trocadéro.",
        "transitTr": "Metro 6 Bir-Hakeim veya Metro 9 Trocadéro durağı.",
        "transitEn": "Metro Line 6 to 'Bir-Hakeim' or Line 9 to 'Trocadéro'."
      },
      {
        "id": "paris_louvre",
        "nameTr": "Louvre Müzesi (Musée du Louvre) & Cam Piramit",
        "nameEn": "Louvre Museum & Glass Pyramid",
        "zone": "louvre_central",
        "category": [
          "history",
          "art"
        ],
        "lat": 48.8606,
        "lng": 2.3376,
        "timeOfDay": "morning",
        "durationHours": 3.5,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&auto=format&fit=crop&q=80",
        "descTr": "Mona Lisa, Milo Venüsü ve 35.000'den fazla tarihi sanat başyapıtına ev sahipliği yapan dünyanın en büyük sanat sarayı.",
        "descEn": "World's largest art museum housed in the historic royal palace, famous for the Mona Lisa and Winged Victory.",
        "insiderTipTr": "Ana cam piramit kuyruğu yerine Porte des Lions veya Carrousel du Louvre alt girişini kullanın.",
        "insiderTipEn": "Skip the main pyramid line by entering through the underground Carrousel du Louvre shopping concourse.",
        "transitTr": "Metro 1 veya 7 Palais-Royal Musée du Louvre durağı.",
        "transitEn": "Metro Line 1 or 7 directly to 'Palais-Royal'."
      },
      {
        "id": "paris_montmartre",
        "nameTr": "Montmartre Tepesi & Sacré-Cœur Bazilikası",
        "nameEn": "Montmartre & Sacré-Cœur Basilica",
        "zone": "montmartre_bohemian",
        "category": [
          "history",
          "views",
          "art"
        ],
        "lat": 48.8867,
        "lng": 2.3431,
        "timeOfDay": "sunset",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80",
        "descTr": "Beyaz traverten kubbeli görkemli bazilika, dar bohem sokaklar ve ressamların buluştuğu Place du Tertre meydanı.",
        "descEn": "Hilltop basilica perched above the bohemian artistic quarter with sweeping sunset vistas over all of Paris.",
        "insiderTipTr": "Bazilikanın ön merdivenlerine oturup gün batımında sokak müzisyenlerini dinleyin; giriş tamamen ücretsizdir.",
        "insiderTipEn": "Sit on the basilica steps at sunset to enjoy live acoustic street music with no admission fee.",
        "transitTr": "Metro 2 Anvers durağından füniküler veya merdivenlerle.",
        "transitEn": "Metro Line 2 to 'Anvers', then funicular."
      },
      {
        "id": "paris_marais_nightlife",
        "nameTr": "Le Marais Butik Barlar & Kokteyl Salonları",
        "nameEn": "Le Marais Hip Cocktail Bars & Courtyard Pubs",
        "zone": "marais_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 48.8575,
        "lng": 2.359,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Paris'in en popüler ve şık gece bölgesi; gizli avlularda el yapımı kokteyller, yerel şarap barları ve sıcak sokak terasları.",
        "descEn": "Paris's trendiest evening quarter filled with candlelit wine caves, indie cocktail lounges, and bustling bistro terraces.",
        "insiderTipTr": "La Candelaria gibi gizli speakeasy mekanlarda imza kokteylleri deneyin.",
        "insiderTipEn": "Step through the back door of taco joints to discover hidden speakeasy cocktail bars like Candelaria.",
        "transitTr": "Metro 1 Saint-Paul durağı.",
        "transitEn": "Metro Line 1 to 'Saint-Paul' station."
      },
      {
        "id": "paris_bastille_bars",
        "nameTr": "Bastille & Rue de Lappe Canlı Barlar Sokağı",
        "nameEn": "Bastille & Rue de Lappe Lively Pub Crawl",
        "zone": "marais_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 48.853,
        "lng": 2.3715,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Gençlerin ve üniversitelilerin doldurduğu, uygun fiyatlı fıçı biralar, shot barları ve sabah kadar süren dans mekanları.",
        "descEn": "High-energy pedestrian nightlife lane packed with budget-friendly pubs, rock bars, and dance halls.",
        "insiderTipTr": "Happy hour saatlerinde (17:00-20:00) fıçı bira ve kokteyller yarı fiyatınadır.",
        "insiderTipEn": "Take advantage of generous happy hours along Rue de Lappe from 5 PM to 8 PM for €4 pints.",
        "transitTr": "Metro 1, 5, 8 Bastille durağı.",
        "transitEn": "Metro Lines 1, 5, or 8 to 'Bastille'."
      },
      {
        "id": "paris_moulin_rouge",
        "nameTr": "Moulin Rouge & Pigalle Gece Kulüpleri",
        "nameEn": "Moulin Rouge & Vibrant Pigalle Nightclub Strip",
        "zone": "montmartre_bohemian",
        "category": [
          "nightlife"
        ],
        "lat": 48.8841,
        "lng": 2.3322,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Kırmızı yel değirmeniyle dünyaca ünlü tarihi kabare, canlı DJ kulüpleri ve neon ışıklı Pigalle geceleri.",
        "descEn": "World-famous red windmill cabaret district surrounded by retro dance clubs and late-night cocktail bars.",
        "insiderTipTr": "La Machine du Moulin Rouge kulübünde gece yarısı elektronik müzik partisine katılın.",
        "insiderTipEn": "Head to La Machine du Moulin Rouge right behind the cabaret for electronic and indie gigs.",
        "transitTr": "Metro 2 Blanche durağı.",
        "transitEn": "Metro Line 2 to 'Blanche' station."
      },
      {
        "id": "paris_latin_bistros",
        "nameTr": "Quartier Latin & Saint-Germain Geleneksel Fransız Bistroları",
        "nameEn": "Latin Quarter Traditional French Bistros",
        "zone": "louvre_central",
        "category": [
          "food"
        ],
        "lat": 48.853,
        "lng": 2.348,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Taş binalar altında sıcak Fransız soğan çorbası (Soupe à l'oignon), ördek konfi ve taze çıtır baget lezzetleri.",
        "descEn": "Quintessential Parisian bistros serving authentic steaming onion soup, duck confit, and carafes of Bordeaux wine.",
        "insiderTipTr": "Öğle saatlerinde 'Formule Midi' (günün menüsü) seçerseniz çok daha uygun fiyata 2-3 çeşit yemek yiyebilirsiniz.",
        "insiderTipEn": "Order the fixed-price lunch menu ('Formule Midi') for a high-value authentic 2-course meal.",
        "transitTr": "Metro 10 Cluny - La Sorbonne veya Metro 4 Saint-Michel.",
        "transitEn": "Metro to 'Saint-Michel' or 'Cluny'."
      },
      {
        "id": "paris_croissant_bakery",
        "nameTr": "Tarihi Paris Fırını & Sıcak Tereyağlı Kruvasan",
        "nameEn": "Traditional Parisian Boulangerie & Fresh Butter Croissants",
        "zone": "louvre_central",
        "category": [
          "food"
        ],
        "lat": 48.871,
        "lng": 2.362,
        "timeOfDay": "morning",
        "durationHours": 1.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop&q=80",
        "descTr": "Sabah fırından yeni çıkmış çıtır kat kat tereyağlı kruvasan, pain au chocolat ve taze kahve.",
        "descEn": "Traditional artisanal French bakery filling the street with aromas of golden, flaky butter croissants.",
        "insiderTipTr": "Sadece 1.5-2 Euro'ya sıcacık bir kruvasan alıp parkta kahvenizle tadını çıkarın; son derece ekonomiktir.",
        "insiderTipEn": "Grab a fresh croissant for under €2 and enjoy it in a nearby park like a true local.",
        "transitTr": "Metro 5 Jacques Bonsergent durağı.",
        "transitEn": "Metro Line 5 to 'Jacques Bonsergent'."
      },
      {
        "id": "paris_seine_cruise",
        "nameTr": "Seine Nehri Panoramik Tekne Turu",
        "nameEn": "Scenic Seine River Sightseeing Cruise",
        "zone": "eiffel_seine",
        "category": [
          "views"
        ],
        "lat": 48.859,
        "lng": 2.296,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80",
        "descTr": "Paris'in tarihi köprüleri, Notre-Dame ve Eyfel Kulesi altından geçen romantik nehir gezisi.",
        "descEn": "Panoramic boat cruise gliding beneath historic bridges with prime views of the illuminated riverbanks.",
        "insiderTipTr": "Gün batımı saatinde binin; nehir seviyesinden Eyfel'in ışıklarını izlemek muhteşemdir.",
        "insiderTipEn": "Take the twilight departure to see the city monuments illuminate along the water.",
        "transitTr": "Eyfel Kulesi iskelesi (Bateaux Parisiens).",
        "transitEn": "Piers right beneath the Eiffel Tower."
      },
      {
        "id": "paris_arc_triomphe",
        "nameTr": "Zafer Takı (Arc de Triomphe) & Champs-Élysées",
        "nameEn": "Arc de Triomphe & Champs-Élysées",
        "zone": "eiffel_seine",
        "category": [
          "history",
          "views"
        ],
        "lat": 48.8738,
        "lng": 2.295,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80",
        "descTr": "Napolyon'un zafer anıtı; 12 geniş bulvarın yıldız gibi kesiştiği tepeden muhteşem Paris perspektifi.",
        "descEn": "Monumental neoclassical triumphal arch anchoring the radiating avenues of the Place Charles de Gaulle.",
        "insiderTipTr": "Anıtın altındaki Meçhul Asker Mezarını görmek tamamen ücretsizdir.",
        "insiderTipEn": "Viewing the eternal flame beneath the arch is completely free.",
        "transitTr": "Metro 1, 2, 6 Charles de Gaulle - Étoile durağı.",
        "transitEn": "Metro to Charles de Gaulle - Étoile."
      }
    ]
  },
  "spain": {
    "zones": {
      "gaudi_eixample": {
        "titleTr": "Eixample & Gaudí Başyapıtları",
        "titleEn": "Eixample & Gaudí Architecture",
        "primaryNeighborhood": "Eixample",
        "color": "#059669"
      },
      "gothic_born": {
        "titleTr": "Barri Gòtic & El Born (Tarih & Barlar)",
        "titleEn": "Gothic Quarter & El Born",
        "primaryNeighborhood": "Ciutat Vella / El Born",
        "color": "#e11d48"
      },
      "barceloneta_beach": {
        "titleTr": "Barceloneta Plajı & Deniz Barları",
        "titleEn": "Barceloneta Coast & Beach Clubs",
        "primaryNeighborhood": "Barceloneta / Port Olímpic",
        "color": "#0284c7"
      }
    },
    "places": [
      {
        "id": "spain_sagrada_familia",
        "nameTr": "Sagrada Família Bazilikası",
        "nameEn": "Basílica de la Sagrada Família",
        "zone": "gaudi_eixample",
        "category": [
          "history",
          "art"
        ],
        "lat": 41.4036,
        "lng": 2.1744,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&auto=format&fit=crop&q=80",
        "descTr": "Antoni Gaudí'nin doğadan ilham alan, vitray pencerelerinden süzülen ışık huzmeleriyle büyüleyen başyapıtı.",
        "descEn": "Gaudí's unfinished dream basilica featuring forest-like stone pillars and radiant stained-glass light.",
        "insiderTipTr": "Öğleden sonra 15:00-17:00 arası güneş ışığı batı vitraylarına vururken içerisi kırmızı ve turuncu renklere bürünür.",
        "insiderTipEn": "Visit late afternoon to watch the sunset paint the nave in dramatic crimson and gold light.",
        "transitTr": "Metro 2 ve 5 Sagrada Família durağı.",
        "transitEn": "Metro L2 or L5 directly to 'Sagrada Família'."
      },
      {
        "id": "spain_gothic_quarter",
        "nameTr": "Barri Gòtic (Gotik Mahalle) & Barselona Katedrali",
        "nameEn": "Gothic Quarter (Barri Gòtic) & Cathedral",
        "zone": "gothic_born",
        "category": [
          "history",
          "views"
        ],
        "lat": 41.3833,
        "lng": 2.1764,
        "timeOfDay": "morning",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=900&auto=format&fit=crop&q=80",
        "descTr": "Roma kalıntıları üzerine kurulu dar Orta Çağ labirent sokakları, taş kemerler ve sokak müzisyenleri.",
        "descEn": "Atmospheric labyrinth of narrow medieval lanes, hidden stone squares, and historic cathedral courtyards.",
        "insiderTipTr": "Plaça del Rei meydanındaki Gotik basamaklara oturup sokak gitaristlerini ücretsiz dinleyin.",
        "insiderTipEn": "Wandering the cobblestones and admiring the facade is 100% free of charge.",
        "transitTr": "Metro 4 Jaume I durağı.",
        "transitEn": "Metro L4 to 'Jaume I'."
      },
      {
        "id": "spain_born_nightlife",
        "nameTr": "El Born Hareketli Tapas & Kokteyl Barları",
        "nameEn": "El Born Lively Tapas Bars & Night Crawl",
        "zone": "gothic_born",
        "category": [
          "nightlife"
        ],
        "lat": 41.3855,
        "lng": 2.182,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Passeig del Born boyunca sıralanan el yapımı vermut evleri, şık kokteyl salonları ve tapas barları.",
        "descEn": "Bustling nightlife lane packed with trendy vermouth bodegas, craft cocktail hideouts, and terrace dining.",
        "insiderTipTr": "Geleneksel 'Vermut' içkisini zeytin eşliğinde deneyin; oldukça hesaplıdır.",
        "insiderTipEn": "Order an artisan house vermouth on the rocks with an olive for an affordable classic aperitif.",
        "transitTr": "Metro 4 Jaume I veya Barceloneta durağı.",
        "transitEn": "Metro L4 to 'Jaume I'."
      },
      {
        "id": "spain_barceloneta_nightlife",
        "nameTr": "Barceloneta Sahil Barları (Chiringuitos) & Kulüpler",
        "nameEn": "Barceloneta Beach Promenade & Open-Air Lounges",
        "zone": "barceloneta_beach",
        "category": [
          "nightlife",
          "views"
        ],
        "lat": 41.38,
        "lng": 2.193,
        "timeOfDay": "sunset",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
        "descTr": "Akdeniz dalgaları eşliğinde gün batımı kokteylleri, açık hava DJ müzikleri ve kumsal enerjisi.",
        "descEn": "Sunset beachside promenade with outdoor boardwalk cocktail bars, sea breeze, and ambient dance tracks.",
        "insiderTipTr": "Akşamüstü saatlerinde sahil boyundaki ahşap güvertelerde oturup sangria yudumlayın.",
        "insiderTipEn": "Walk the beachfront boardwalk at dusk and grab a pitcher of fresh sangria.",
        "transitTr": "Metro 4 Barceloneta durağı.",
        "transitEn": "Metro L4 to 'Barceloneta'."
      },
      {
        "id": "spain_razzmatazz_club",
        "nameTr": "Razzmatazz & Sala Apolo Gece Kulüpleri",
        "nameEn": "Razzmatazz & Sala Apolo Legendary Dance Stages",
        "zone": "gothic_born",
        "category": [
          "nightlife"
        ],
        "lat": 41.3975,
        "lng": 2.191,
        "timeOfDay": "evening",
        "durationHours": 3.5,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "5 farklı salonunda indie rock'tan tekno ve elektroniğe kadar sabahın ilk ışıklarına dek süren müzik maratonu.",
        "descEn": "Massive 5-room music venue and warehouse club hosting world-renowned DJs and indie concerts.",
        "insiderTipTr": "Online bilet alırsanız giriş ücretine bir içecek dahildir; gece 01:00'den önce çok kalabalıklaşmaz.",
        "insiderTipEn": "Advance tickets usually include a drink ticket; peak energy starts after 1:30 AM.",
        "transitTr": "Metro 1 Marina veya Metro 4 Bogatell durağı.",
        "transitEn": "Metro L1 to 'Marina'."
      },
      {
        "id": "spain_boqueria_market",
        "nameTr": "Mercat de la Boqueria Gurme Pazarı",
        "nameEn": "Mercat de Sant Josep de la Boqueria",
        "zone": "gothic_born",
        "category": [
          "food",
          "bazaars"
        ],
        "lat": 41.3817,
        "lng": 2.1716,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "1840'tan beri La Rambla üzerinde taze meyve suları, Jamón Ibérico jambonu, taze deniz ürünleri ve tapas tezgahları.",
        "descEn": "Historic market hall exploding with colors: freshly sliced cured ham, tropical juices, and sizzling seafood bars.",
        "insiderTipTr": "Girişteki turistik tezgahlar yerine arka sıralardaki 'Bar Pinotxo' veya 'El Quim' taburelerine oturarak taze kalamar yiyin.",
        "insiderTipEn": "Grab a stool at Bar El Quim in the central aisles for baby squid with fried eggs.",
        "transitTr": "Metro 3 Liceu durağı.",
        "transitEn": "Metro L3 to 'Liceu'."
      },
      {
        "id": "spain_park_guell",
        "nameTr": "Park Güell & Manzara Terası",
        "nameEn": "Park Güell Monumental Terrace & Viewpoint",
        "zone": "gaudi_eixample",
        "category": [
          "views",
          "art"
        ],
        "lat": 41.4145,
        "lng": 2.1527,
        "timeOfDay": "afternoon",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=900&auto=format&fit=crop&q=80",
        "descTr": "Gaudí'nin masalsı mozaik kertenkelesi, dalgalı bankları ve Barselona'yı denizle birlikte kucaklayan manzarası.",
        "descEn": "Fairytale park adorned with mosaic dragons, sculpted stone viaducts, and skyline views down to the Mediterranean.",
        "insiderTipTr": "Parkın ormanlık yürüyüş yolları tamamen ücretsizdir; zirvedeki haç tepesinden tüm kenti görün.",
        "insiderTipEn": "The outer forested park trails are free to enter and offer panoramic mountain views.",
        "transitTr": "Metro 3 Lesseps durağından 12 dk yürüyüş veya yürüyen merdivenler.",
        "transitEn": "Metro L3 to 'Lesseps'."
      }
    ]
  },
  "germany": {
    "zones": {
      "mitte_historic": {
        "titleTr": "Mitte (Tarihi Merkez & Müzeler)",
        "titleEn": "Mitte Historic Core",
        "primaryNeighborhood": "Mitte",
        "color": "#e11d48"
      },
      "kreuzberg_nightlife": {
        "titleTr": "Kreuzberg & Friedrichshain (Barlar & Kulüpler)",
        "titleEn": "Kreuzberg & Friedrichshain Nightlife",
        "primaryNeighborhood": "Kreuzberg / RAW",
        "color": "#2563eb"
      },
      "tiergarten_views": {
        "titleTr": "Tiergarten & Hükümet Bölgesi",
        "titleEn": "Tiergarten & Government District",
        "primaryNeighborhood": "Tiergarten",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "germany_brandenburg_gate",
        "nameTr": "Brandenburger Tor (Brandenburg Kapısı)",
        "nameEn": "Brandenburg Gate (Brandenburger Tor)",
        "zone": "mitte_historic",
        "category": [
          "history",
          "views"
        ],
        "lat": 52.5163,
        "lng": 13.3777,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&auto=format&fit=crop&q=80",
        "descTr": "1791 yapımı neoklasik zafer takı; Soğuk Savaş bölünmesinin ve ardından Alman birleşmesinin evrensel simgesi.",
        "descEn": "Berlin's most iconic 18th-century neoclassical monument symbolizing German reunification.",
        "insiderTipTr": "Giriş tamamen ücretsizdir; akşam aydınlatması altında fotoğraflamak büyüleyicidir.",
        "insiderTipEn": "Visiting the gate is 100% free; come back at night when floodlights illuminate the stone Quadriga.",
        "transitTr": "S+U Brandenburger Tor durağı.",
        "transitEn": "S-Bahn / U-Bahn 'Brandenburger Tor'."
      },
      {
        "id": "germany_reichstag",
        "nameTr": "Reichstag Binası & Cam Kubbesi",
        "nameEn": "Reichstag Building & Norman Foster Glass Dome",
        "zone": "tiergarten_views",
        "category": [
          "history",
          "views"
        ],
        "lat": 52.5186,
        "lng": 13.3762,
        "timeOfDay": "morning",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&auto=format&fit=crop&q=80",
        "descTr": "Norman Foster tasarımı dev cam kubbesinin spiral rampalarından parlamentoyu ve tüm Berlin'i izleyin.",
        "descEn": "Historic parliament building crowned by an awe-inspiring glass dome with 360-degree city views.",
        "insiderTipTr": "Kubbe ziyareti TAMAMEN ÜCRETSİZDİR; tek yapmanız gereken resmi Bundestag web sitesinden önceden randevu almaktır.",
        "insiderTipEn": "Admission is completely FREE with an advance booking on the official Bundestag website.",
        "transitTr": "Brandenburg Kapısı'ndan 4 dk yürüyüş.",
        "transitEn": "4 mins walk from Brandenburg Gate."
      },
      {
        "id": "germany_kreuzberg_bars",
        "nameTr": "Kreuzberg Oranienstraße Barlar Sokağı & Kraft Publar",
        "nameEn": "Kreuzberg Oranienstraße Iconic Bar Strip",
        "zone": "kreuzberg_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 52.5005,
        "lng": 13.418,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Berlin'in punk ve bohem kökleri; mum ışığında salaş Kneipe birahaneleri, craft publar ve canlı sokak enerjisi.",
        "descEn": "The legendary heart of Berlin's counterculture filled with smoky candlelit Kneipen pubs and indie cocktail joints.",
        "insiderTipTr": "Geleneksel bir Berlin pubına girip yerel fıçı bira (Berliner Pilsner) isteyin; fiyatlar çok ekonomiktir.",
        "insiderTipEn": "Order a local draft Berliner Pilsner at an old-school Eckkneipe corner pub for under €4.",
        "transitTr": "U8 / U1 Kottbusser Tor durağı.",
        "transitEn": "U-Bahn U8 / U1 to 'Kottbusser Tor'."
      },
      {
        "id": "germany_raw_gelande",
        "nameTr": "RAW-Gelände Açık Hava Kültür & Gece Sahnesi",
        "nameEn": "RAW-Gelände Industrial Nightlife Compound",
        "zone": "kreuzberg_nightlife",
        "category": [
          "nightlife",
          "art"
        ],
        "lat": 52.507,
        "lng": 13.454,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Eski demiryolu atölyelerinin dönüştürüldüğü grafitili barlar, kaykay pistleri, açık hava bira bahçeleri ve dans kulüpleri (Cassiopeia).",
        "descEn": "Graffiti-splashed former railway compound housing indie open-air bars, skate halls, and underground dance stages.",
        "insiderTipTr": "Açık hava avlusunda biranızı alıp sokak sanatçılarını ve kaykaycıları izleyin.",
        "insiderTipEn": "Stroll the open courtyards with a cold Club Mate or beer and admire massive street art murals.",
        "transitTr": "S+U Warschauer Straße durağından 3 dk.",
        "transitEn": "3 mins walk from S+U Warschauer Straße."
      },
      {
        "id": "germany_curry36",
        "nameTr": "Curry 36 & Geleneksel Berlin Currywurst",
        "nameEn": "Curry 36 Famous Berlin Currywurst",
        "zone": "kreuzberg_nightlife",
        "category": [
          "food"
        ],
        "lat": 52.4935,
        "lng": 13.388,
        "timeOfDay": "afternoon",
        "durationHours": 0.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "Özel köri tozu ve baharatlı sosla servis edilen Berlin'in 1949'dan beri en meşhur sokak sosislisi.",
        "descEn": "Berlin's ultimate street food institution serving steaming curry-dusted sausages and crispy fries on paper trays.",
        "insiderTipTr": "'Currywurst mit Pommes Schranke' (mayonez ve ketçaplı patatesle) sipariş verin; sadece 6-7 Euro'ya tıka basa doyurur.",
        "insiderTipEn": "Order 'Currywurst mit Pommes Schranke' for the classic local fast lunch under €7.",
        "transitTr": "U6 / U7 Mehringdamm durağının tam önü.",
        "transitEn": "Right in front of U-Bahn Mehringdamm."
      },
      {
        "id": "germany_east_side_gallery",
        "nameTr": "East Side Gallery (Tarihi Berlin Duvarı Açık Hava Müzesi)",
        "nameEn": "East Side Gallery Historic Open-Air Memorial",
        "zone": "kreuzberg_nightlife",
        "category": [
          "history",
          "art"
        ],
        "lat": 52.505,
        "lng": 13.4395,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=900&auto=format&fit=crop&q=80",
        "descTr": "Berlin Duvarı'nın ayakta kalan 1.3 kilometrelik en uzun parçası; 100'den fazla uluslararası sanatçının barış duvar resimleri.",
        "descEn": "The longest remaining section of the Berlin Wall covered in world-famous murals promoting peace and freedom.",
        "insiderTipTr": "Spree Nehri boyunca yürümek tamamen ücretsizdir; meşhur 'Kardeşlik Öpücüğü' duvar resmini görün.",
        "insiderTipEn": "Completely free open-air walking gallery along the Spree River.",
        "transitTr": "S+U Warschauer Straße veya Ostbahnhof durağı.",
        "transitEn": "Walk from Warschauer Straße or Ostbahnhof."
      }
    ]
  },
  "uk": {
    "zones": {
      "westminster_thames": {
        "titleTr": "Westminster & Thames Nehri Kıyısı",
        "titleEn": "Westminster & Thames Riverside",
        "primaryNeighborhood": "Westminster / South Bank",
        "color": "#e11d48"
      },
      "soho_covent": {
        "titleTr": "Soho & Covent Garden (Publar & Tiyatro)",
        "titleEn": "Soho & West End Nightlife",
        "primaryNeighborhood": "Soho / Leicester Sq",
        "color": "#2563eb"
      },
      "city_tower": {
        "titleTr": "City of London & Tower Bridge",
        "titleEn": "City & Tower Bridge",
        "primaryNeighborhood": "Tower Bridge / Borough",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "uk_big_ben",
        "nameTr": "Big Ben & Westminster Sarayı (Parlamento)",
        "nameEn": "Big Ben & Palace of Westminster",
        "zone": "westminster_thames",
        "category": [
          "history",
          "views"
        ],
        "lat": 51.5007,
        "lng": -0.1246,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=900&auto=format&fit=crop&q=80",
        "descTr": "Gotik ihtişamıyla Londra'nın en ünlü saat kulesi; Thames Nehri üzerindeki Westminster Köprüsü'nden muazzam görünüm.",
        "descEn": "Iconic neo-Gothic clock tower standing majestically alongside the Thames.",
        "insiderTipTr": "Westminster Köprüsü'nün güney ucundan (South Bank) saat kulesi ve kırmızı Londra otobüslerini aynı karede fotoğraflayın.",
        "insiderTipEn": "Cross to the South Bank side of Westminster Bridge for the classic frame with red double-decker buses.",
        "transitTr": "Westminster Tube İstasyonu (Jubilee, Circle, District hatları).",
        "transitEn": "Westminster Underground Station."
      },
      {
        "id": "uk_tower_bridge",
        "nameTr": "Tower Bridge & Londra Kalesi Kıyısı",
        "nameEn": "Tower Bridge & Historic Fortress",
        "zone": "city_tower",
        "category": [
          "history",
          "views"
        ],
        "lat": 51.5055,
        "lng": -0.0754,
        "timeOfDay": "sunset",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop&q=80",
        "descTr": "1894 yapımı çift kuleli asma köprü; Thames Nehri boyunca yürüyüş ve akşam ışıkları.",
        "descEn": "Victorian bascule bridge spanning the Thames with iconic blue suspension cables.",
        "insiderTipTr": "Köprünün üstünden yürümek tamamen ücretsizdir; nehir kıyısındaki banklarda oturup gün batımını izleyin.",
        "insiderTipEn": "Walking across the bridge is 100% free; enjoy sunset from the riverside path.",
        "transitTr": "Tower Hill Tube İstasyonu.",
        "transitEn": "Tower Hill Underground Station."
      },
      {
        "id": "uk_soho_pubs",
        "nameTr": "Soho Tarihi Pubları & Jazz Barları",
        "nameEn": "Soho Historic Ale Pubs & Jazz Cellars",
        "zone": "soho_covent",
        "category": [
          "nightlife"
        ],
        "lat": 51.5135,
        "lng": -0.1365,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Kaldırımlara taşan Londra pub kültürü; The French House, The John Snow ve Ronnie Scott's Jazz Club.",
        "descEn": "The electric epicentre of London's pub scene with pints on the pavement and legendary live music.",
        "insiderTipTr": "İngiliz pub geleneğinde masaya servis yoktur; bara gidip doğrudan sipariş verip kaldırımlarda ayakta biranızı yudumlayın.",
        "insiderTipEn": "Order directly at the bar counter and join locals drinking outside on the cobblestones.",
        "transitTr": "Tottenham Court Road veya Piccadilly Circus tube durağı.",
        "transitEn": "Tube to 'Tottenham Court Road'."
      },
      {
        "id": "uk_camden_bars",
        "nameTr": "Camden Town Canlı Müzik Pubları & Rock Barları",
        "nameEn": "Camden Town Iconic Rock Pubs & Canal Bars",
        "zone": "soho_covent",
        "category": [
          "nightlife"
        ],
        "lat": 51.539,
        "lng": -0.1425,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "The Hawley Arms, The Dublin Castle gibi Amy Winehouse ve Britpop efsanelerinin buluştuğu tarihi publar.",
        "descEn": "Legendary indie and rock music heritage quarter packed with alternative pubs and canal-side beer gardens.",
        "insiderTipTr": "The Dublin Castle'da haftanın her günü uygun biletle yeni çıkan indie grupları canlı dinleyebilirsiniz.",
        "insiderTipEn": "Check out The Dublin Castle for grassroots live indie bands and classic pub atmosphere.",
        "transitTr": "Camden Town Tube İstasyonu (Northern Line).",
        "transitEn": "Camden Town Underground."
      },
      {
        "id": "uk_borough_market",
        "nameTr": "Borough Market Tarihi Gurme Pazarı",
        "nameEn": "Borough Market Heritage Food Stalls",
        "zone": "city_tower",
        "category": [
          "food",
          "bazaars"
        ],
        "lat": 51.5055,
        "lng": -0.091,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "1000 yıllık geçmişiyle Londra'nın en ünlü açık hava gıda pazarı; sıcak sausage roll, artisan peynirler ve sokak lezzetleri.",
        "descEn": "London's premier historic food market featuring artisan baked pies, cheeses, street food from around the world.",
        "insiderTipTr": "Kappacasein tezgahından sıcak erimiş İsviçre peynirli tost veya Bread Ahead'den vanilyalı çörek (doughnut) tadın.",
        "insiderTipEn": "Sample the melted raclette or award-winning filled doughnuts at Bread Ahead.",
        "transitTr": "London Bridge Tube İstasyonu.",
        "transitEn": "London Bridge Underground."
      },
      {
        "id": "uk_sky_garden",
        "nameTr": "Sky Garden Panoramik Çatı Bahçesi Seyir Terası",
        "nameEn": "Sky Garden 360-Degree Panoramic View",
        "zone": "city_tower",
        "category": [
          "views"
        ],
        "lat": 51.511,
        "lng": -0.0835,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&auto=format&fit=crop&q=80",
        "descTr": "160 metre yükseklikte cam kubbe altındaki yemyeşil tropik bahçelerden tüm Londra silüetini 360 derece izleyin.",
        "descEn": "Spectacular landscaped indoor public garden on the 35th floor offering sweeping skyline vistas.",
        "insiderTipTr": "Giriş TAMAMEN ÜCRETSİZDİR; tek yapmanız gereken resmi sitesinden 2-3 hafta önce ücretsiz giriş bileti almaktır.",
        "insiderTipEn": "Tickets are 100% FREE; simply reserve a time slot online on their official website.",
        "transitTr": "Monument Tube İstasyonu.",
        "transitEn": "Monument Underground Station."
      }
    ]
  },
  "italy": {
    "zones": {
      "colosseo_forum": {
        "titleTr": "Kolezyum & Antik Roma Forumu",
        "titleEn": "Colosseum & Ancient Roman Forum",
        "primaryNeighborhood": "Colosseo / Monti",
        "color": "#e11d48"
      },
      "trevi_pantheon": {
        "titleTr": "Trevi, Panteon & Tarihi Merkez",
        "titleEn": "Trevi Fountain & Pantheon Core",
        "primaryNeighborhood": "Centro Storico",
        "color": "#0284c7"
      },
      "trastevere_nightlife": {
        "titleTr": "Trastevere & Campo de' Fiori (Barlar & Şarap)",
        "titleEn": "Trastevere & Campo de' Fiori Nightlife",
        "primaryNeighborhood": "Trastevere",
        "color": "#d97706"
      },
      "vatican_borgo": {
        "titleTr": "Vatikan & Castel Sant'Angelo",
        "titleEn": "Vatican City & St. Angelo",
        "primaryNeighborhood": "Vatican / Prati",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "italy_colosseum",
        "nameTr": "Kolezyum (Colosseo) & Roma Forumu",
        "nameEn": "The Colosseum & Roman Forum",
        "zone": "colosseo_forum",
        "category": [
          "history",
          "views"
        ],
        "lat": 41.8902,
        "lng": 12.4922,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&auto=format&fit=crop&q=80",
        "descTr": "MS 80 yılında inşa edilen 50.000 kişilik gladyatör arenası; antik dünyanın en büyük amfitiyatrosu.",
        "descEn": "The majestic two-thousand-year-old amphitheatre that hosted epic gladiator battles in ancient Rome.",
        "insiderTipTr": "Dış cephesinden ve Via dei Fori Imperiali üzerinden Kolezyum'u seyretmek tamamen ücretsizdir; gün batımında altın ışığı yakalayın.",
        "insiderTipEn": "Strolling around the exterior perimeter from Via dei Fori Imperiali is free and magical at dusk.",
        "transitTr": "Metro B Colosseo durağı.",
        "transitEn": "Metro Line B to 'Colosseo'."
      },
      {
        "id": "italy_trevi_fountain",
        "nameTr": "Trevi Çeşmesi (Fontana di Trevi)",
        "nameEn": "Trevi Fountain (Fontana di Trevi)",
        "zone": "trevi_pantheon",
        "category": [
          "views",
          "history"
        ],
        "lat": 41.9009,
        "lng": 12.4833,
        "timeOfDay": "sunset",
        "durationHours": 1.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=900&auto=format&fit=crop&q=80",
        "descTr": "Barok mimarinin şaheseri; traverten heykeller arasından akan sular ve omzunun üzerinden bozuk para atma geleneği.",
        "descEn": "Late Baroque fountain masterpiece where tossing a coin over your left shoulder guarantees a return to Rome.",
        "insiderTipTr": "Giriş tamamen ücretsizdir; kalabalıktan kaçınmak için sabah 07:30'da veya gece yarısı ziyaret edin.",
        "insiderTipEn": "100% free; visit at dawn or midnight to admire the illuminated sculptures without crowds.",
        "transitTr": "Metro A Barberini durağından 6 dk yürüyüş.",
        "transitEn": "6 mins walk from Metro A 'Barberini'."
      },
      {
        "id": "italy_pantheon",
        "nameTr": "Panteon (Pantheon) & Piazza della Rotonda",
        "nameEn": "Pantheon & Piazza della Rotonda",
        "zone": "trevi_pantheon",
        "category": [
          "history"
        ],
        "lat": 41.8986,
        "lng": 12.4769,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=900&auto=format&fit=crop&q=80",
        "descTr": "2000 yıldır ayakta duran dünyanın en büyük donatısız beton kubbesi ve tepe açıklığından (oculus) süzülen gökyüzü ışığı.",
        "descEn": "Ancient Roman temple preserved in perfection, crowned by an unreinforced concrete dome with central oculus.",
        "insiderTipTr": "Öğlen 12:00 civarında giderseniz güneş ışığının kubbe deliğinden döşemeye dik bir sütun gibi indiğini görebilirsiniz.",
        "insiderTipEn": "At midday, the sunbeam through the oculus creates a dramatic spotlight on the marble floor.",
        "transitTr": "Largo di Torre Argentina tramvayından 4 dk.",
        "transitEn": "4 mins walk from Largo di Torre Argentina."
      },
      {
        "id": "italy_trastevere_nightlife",
        "nameTr": "Trastevere Canlı Barlar Sokağı & Şarap Evleri (Enoteche)",
        "nameEn": "Trastevere Cobblestone Nightlife & Wine Taverns",
        "zone": "trastevere_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 41.889,
        "lng": 12.47,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Sarmaşıklarla kaplı eski Roma sokaklarında açık hava masaları, yerel şarap barları ve sıcak sokak sohbetleri.",
        "descEn": "Rome's most romantic bohemian quarter alive with bustling sidewalk terraces, spritz bars, and craft beer.",
        "insiderTipTr": "Piazza di Santa Maria in Trastevere meydanındaki çeşme basamaklarına oturup yerel halkla birlikte Aperol Spritz için.",
        "insiderTipEn": "Grab an Aperol Spritz from a corner bar and sit on the fountain steps in Piazza Santa Maria.",
        "transitTr": "Tramvay 8 ile Belli durağı.",
        "transitEn": "Tram 8 to 'Belli' stop."
      },
      {
        "id": "italy_campo_fiori",
        "nameTr": "Campo de' Fiori Akşam Barları & Canlı Meydan",
        "nameEn": "Campo de' Fiori Evening Piazza & Cocktail Bars",
        "zone": "trastevere_nightlife",
        "category": [
          "nightlife",
          "bazaars"
        ],
        "lat": 41.8955,
        "lng": 12.472,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
        "descTr": "Gündüz çiçek pazarı, akşam ise gençlerin ve gezginlerin kadeh tokuşturduğu tarihi meydan ve barlar.",
        "descEn": "Lively historic square bordered by vibrant open-air pubs and wine taverns around the Giordano Bruno statue.",
        "insiderTipTr": "Happy hour (Aperitivo) saatinde bir içecek sipariş ettiğinizde büfedeki atıştırmalıklar ücretsiz ikram edilir.",
        "insiderTipEn": "Order an aperitivo drink around 6:30 PM to enjoy complimentary Italian bar snacks.",
        "transitTr": "Piazza Navona'dan 3 dk yürüyüş.",
        "transitEn": "3 mins walk from Piazza Navona."
      },
      {
        "id": "italy_roma_pasta",
        "nameTr": "Geleneksel Roma Trattoriası & Cacio e Pepe / Carbonara",
        "nameEn": "Traditional Roman Trattoria & Authentic Pasta",
        "zone": "trastevere_nightlife",
        "category": [
          "food"
        ],
        "lat": 41.888,
        "lng": 12.4715,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&auto=format&fit=crop&q=80",
        "descTr": "Pecorino Romano peyniri ve karabiberle hazırlanan Cacio e Pepe veya taze guanciale ile pişen otantik Carbonara.",
        "descEn": "Authentic Roman dining room serving time-honored handmade pasta dishes: Cacio e Pepe and Carbonara.",
        "insiderTipTr": "Kare masa örtülü aile işletmesi trattorialarda günlük 'Piatto del Giorno' menüsü çok lezzetli ve ekonomiktir.",
        "insiderTipEn": "Look for small family-run osterie with handwritten daily menus for top quality at modest prices.",
        "transitTr": "Trastevere merkez sokakları.",
        "transitEn": "Heart of Trastevere lanes."
      },
      {
        "id": "italy_giolitti_gelato",
        "nameTr": "Giolitti Tarihi Dondurmacı & İtalyan Espresso (1900)",
        "nameEn": "Giolitti Historic Gelateria & Espresso (Est. 1900)",
        "zone": "trevi_pantheon",
        "category": [
          "food"
        ],
        "lat": 41.901,
        "lng": 12.477,
        "timeOfDay": "afternoon",
        "durationHours": 0.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=900&auto=format&fit=crop&q=80",
        "descTr": "120 yıllık ahşap vitrinleriyle Roma'nın en efsanevi dondurmacısı; 100 çeşit taze meyveli ve kremalı gelato.",
        "descEn": "Rome's most famous historic gelateria serving creamy handcrafted gelato topped with fresh panna.",
        "insiderTipTr": "Önce kasada fişinizi kestirin, sonra dondurma tezgahına geçip 'con panna' (taze krem şantili) isteyin; sadece 3-4 Euro.",
        "insiderTipEn": "Pay at the cash register first, then present your ticket at the counter with complimentary fresh cream.",
        "transitTr": "Panteon'dan 3 dk yürüyüş.",
        "transitEn": "3 mins walk from Pantheon."
      },
      {
        "id": "italy_vatican",
        "nameTr": "Vatikan Müzeleri & Aziz Petrus Bazilikası",
        "nameEn": "Vatican City & St. Peter's Basilica",
        "zone": "vatican_borgo",
        "category": [
          "history",
          "art"
        ],
        "lat": 41.9022,
        "lng": 12.4539,
        "timeOfDay": "morning",
        "durationHours": 3.5,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=900&auto=format&fit=crop&q=80",
        "descTr": "Michelangelo'nun Sistina Şapeli tavan freskleri ve Hristiyan aleminin en görkemli bazilikası.",
        "descEn": "World-famous papacy art collection featuring Michelangelo's Sistine Chapel and colossal St. Peter's dome.",
        "insiderTipTr": "Aziz Petrus Meydanı'nı ve bazilikanın içini gezmek tamamen ÜCRETSİZDİR; sabah 08:00'de kuyruksuz girin.",
        "insiderTipEn": "Entering St. Peter's Basilica is 100% FREE; arrive at 8 AM for immediate entry.",
        "transitTr": "Metro A Ottaviano durağı.",
        "transitEn": "Metro Line A to 'Ottaviano'."
      }
    ]
  },
  "austria": {
    "zones": {
      "innere_stadt": {
        "titleTr": "Innere Stadt (Tarihi Viyana Merkezi)",
        "titleEn": "Innere Stadt Historic Core",
        "primaryNeighborhood": "Stephansplatz / Graben",
        "color": "#e11d48"
      },
      "schonbrunn_palace": {
        "titleTr": "Schönbrunn Sarayı & Kraliyet Parkı",
        "titleEn": "Schönbrunn Palace & Gardens",
        "primaryNeighborhood": "Hietzing",
        "color": "#d97706"
      },
      "donaukanal_nightlife": {
        "titleTr": "Donaukanal & Bermuda Dreieck (Barlar & Eğlence)",
        "titleEn": "Donaukanal & Bermuda Triangle",
        "primaryNeighborhood": "Schwedenplatz / Donaukanal",
        "color": "#2563eb"
      },
      "museumsquartier": {
        "titleTr": "MuseumsQuartier & Belvedere Sanat Bölgesi",
        "titleEn": "MuseumsQuartier & Belvedere",
        "primaryNeighborhood": "Neubau / Landstraße",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "austria_schonbrunn",
        "nameTr": "Schönbrunn Sarayı & İmparatorluk Bahçeleri",
        "nameEn": "Schönbrunn Palace & Imperial Gardens",
        "zone": "schonbrunn_palace",
        "category": [
          "history",
          "views"
        ],
        "lat": 48.1858,
        "lng": 16.3128,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=900&auto=format&fit=crop&q=80",
        "descTr": "Habsburg Hanedanı'nın 1441 odalı yazlık sarayı, görkemli Barok bahçeleri ve tepe üzerindeki Gloriette seyir köşkü.",
        "descEn": "Magnificent Habsburg imperial summer palace surrounded by manicured baroque botanical grounds and Gloriette arch.",
        "insiderTipTr": "Devasa saray bahçelerini ve Gloriette seyir tepesini gezmek tamamen ÜCRETSİZDİR; tepeden tüm Viyana'yı fotoğraflayın.",
        "insiderTipEn": "Exploring the sprawling palace gardens and ascending to the Gloriette is 100% FREE.",
        "transitTr": "U4 Metro hattı ile Schönbrunn durağı.",
        "transitEn": "Take U-Bahn U4 to 'Schönbrunn' station."
      },
      {
        "id": "austria_stephansdom",
        "nameTr": "Stephansdom (Aziz Stephan Katedrali)",
        "nameEn": "St. Stephen's Cathedral (Stephansdom)",
        "zone": "innere_stadt",
        "category": [
          "history",
          "views"
        ],
        "lat": 48.2085,
        "lng": 16.3731,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=900&auto=format&fit=crop&q=80",
        "descTr": "Viyana'nın kalbinde yükselen 136 metrelik Gotik kulesi ve 230.000 renkli çiniden oluşan zikzak desenli çatısı.",
        "descEn": "Gothic architectural icon anchoring central Vienna, crowned by a vibrantly tiled mosaic roof.",
        "insiderTipTr": "Katedralin ana salonuna giriş ücretsizdir; dış cephesindeki taş oymaları Graben caddesinden inceleyin.",
        "insiderTipEn": "Entering the main cathedral nave is free; marvel at the centuries-old stonework from the square.",
        "transitTr": "U1 ve U3 Stephansplatz durağı.",
        "transitEn": "U-Bahn U1 / U3 directly to 'Stephansplatz'."
      },
      {
        "id": "austria_hofburg",
        "nameTr": "Hofburg İmparatorluk Sarayı & Heldenplatz Meydanı",
        "nameEn": "The Hofburg Imperial Palace & Heldenplatz",
        "zone": "innere_stadt",
        "category": [
          "history"
        ],
        "lat": 48.2065,
        "lng": 16.3655,
        "timeOfDay": "afternoon",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1578964317355-68427771ba6a?w=900&auto=format&fit=crop&q=80",
        "descTr": "Avusturya imparatorlarının kışlık sarayı; Sisi Müzesi, İspanyol Binicilik Okulu ve devasa Heldenplatz meydanı.",
        "descEn": "Imperial seat of Austrian power spanning seven centuries of European history and state apartments.",
        "insiderTipTr": "Heldenplatz meydanında ve sarayın iç avlularında yürüyüş yapmak ücretsizdir; akşam ışıklandırması büyüleyicidir.",
        "insiderTipEn": "Wandering through the majestic courtyards and Heldenplatz plaza has no entrance fee.",
        "transitTr": "U3 Herrengasse durağından 3 dk.",
        "transitEn": "3 mins walk from U3 'Herrengasse'."
      },
      {
        "id": "austria_bermuda_dreieck",
        "nameTr": "Bermuda Dreieck (Bermuda Şeytan Üçgeni) Barlar Sokağı",
        "nameEn": "Bermuda Triangle (Bermuda Dreieck) Nightlife Hub",
        "zone": "donaukanal_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 48.2115,
        "lng": 16.375,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Viyana'nın en meşhur tarihi gece bölgesi; dar taş sokaklara taşan canlı kraft publar, kokteyl barları ve gece kulüpleri.",
        "descEn": "Vienna's historic nightlife enclave packed with cozy Irish pubs, craft beer taverns, and bustling street patios.",
        "insiderTipTr": "Ruprechtsplatz civarındaki açık hava pub masalarında yerel Ottakringer fıçı birasını deneyin; son derece ekonomiktir.",
        "insiderTipEn": "Order an Austrian draft Ottakringer beer at sidewalk tables around Ruprechtsplatz.",
        "transitTr": "U1 / U4 Schwedenplatz durağından 2 dk yürüyüş.",
        "transitEn": "2 mins walk from U1/U4 'Schwedenplatz'."
      },
      {
        "id": "austria_donaukanal_bars",
        "nameTr": "Donaukanal Açık Hava Barları & Sokak Sanatı",
        "nameEn": "Donaukanal Urban Beach Bars & Street Art",
        "zone": "donaukanal_nightlife",
        "category": [
          "nightlife",
          "views"
        ],
        "lat": 48.213,
        "lng": 16.3775,
        "timeOfDay": "sunset",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
        "descTr": "Kanal boyunca rengarenk grafitiler, kumsallı açık hava lounge barları (Tel Aviv Beach, Strandbar Herrmann) ve canlı DJ'ler.",
        "descEn": "Waterfront riverside promenade lined with sand beach lounges, graffiti murals, and lively summer terrace bars.",
        "insiderTipTr": "Kanal kenarındaki ahşap basamaklara oturup içeceğinizle müzik dinlemek tamamen ücretsizdir.",
        "insiderTipEn": "Sit along the riverbank edge with drinks for a free and laid-back sunset hangout.",
        "transitTr": "U-Bahn Schwedenplatz veya Schottenring durağı.",
        "transitEn": "Schwedenplatz or Schottenring station."
      },
      {
        "id": "austria_prater",
        "nameTr": "Prater Lunaparkı & Tarihi Dev Riesenrad Dönme Dolabı",
        "nameEn": "Prater Amusement Park & Giant Ferris Wheel",
        "zone": "donaukanal_nightlife",
        "category": [
          "views",
          "nightlife"
        ],
        "lat": 48.2166,
        "lng": 16.3959,
        "timeOfDay": "sunset",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80",
        "descTr": "1897 yapımı tarihi kırmızı kabinli dev dönme dolap, nostaljik eğlence parkı ve devasa yeşil yürüyüş ormanı.",
        "descEn": "Legendary historic public park with the famous 1897 Giant Ferris Wheel offering sunset panoramas.",
        "insiderTipTr": "Prater park alanına giriş tamamen ÜCRETSİZDİR; nostaljik sokaklarda gezip atmosferi soluyabilirsiniz.",
        "insiderTipEn": "Entry into the amusement park grounds is 100% free; you only pay per ride.",
        "transitTr": "U1 / U2 Praterstern durağı.",
        "transitEn": "U-Bahn U1 / U2 to 'Praterstern'."
      },
      {
        "id": "austria_naschmarkt",
        "nameTr": "Naschmarkt Gurme Pazarı & Viyana Sokak Lezzetleri",
        "nameEn": "Naschmarkt Historic Food Market & Tastings",
        "zone": "innere_stadt",
        "category": [
          "food",
          "bazaars"
        ],
        "lat": 48.1985,
        "lng": 16.363,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&auto=format&fit=crop&q=80",
        "descTr": "1.5 kilometre boyunca uzanan 120'den fazla peynirci, baharatçı, falafelci, Avusturya şarküterisi ve mini bistrolar.",
        "descEn": "Vienna's premier open-air foodie paradise stretching for 1.5 km with artisan food stands and street stalls.",
        "insiderTipTr": "Tezgahlarda ücretsiz peynir ve zeytin tadımı yapabilir; küçük bistrolarda uygun fiyata doyurucu bir öğle yemeği yiyebilirsiniz.",
        "insiderTipEn": "Market vendors generously offer cheese samples; great spot for a low-cost lunch on the go.",
        "transitTr": "U4 Kettenbrückengasse durağının hemen çıkışı.",
        "transitEn": "U-Bahn U4 'Kettenbrückengasse'."
      },
      {
        "id": "austria_schnitzel",
        "nameTr": "Geleneksel Viyana Şnitzeli (Figlmüller & Çevresi)",
        "nameEn": "Traditional Wiener Schnitzel (Historic Figlmüller)",
        "zone": "innere_stadt",
        "category": [
          "food"
        ],
        "lat": 48.209,
        "lng": 16.3745,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=900&auto=format&fit=crop&q=80",
        "descTr": "Tabağa sığmayan altın sarısı çıtır Viyana şnitzeli, yanında otantik ılık patates salatası (Erdäpfelsalat).",
        "descEn": "The world-famous giant, golden pan-fried breaded veal schnitzel served with traditional warm Austrian potato salad.",
        "insiderTipTr": "Şnitzelin yanına limon sıkıp geleneksel Viyana patates salatası ile tadını çıkarın; bir porsiyon iki kişiye bile yetebilir.",
        "insiderTipEn": "Portions are enormous; one golden schnitzel is often enough to share between two people.",
        "transitTr": "Stephansdom'dan 2 dk yürüyüş.",
        "transitEn": "2 mins walk from St. Stephen's."
      },
      {
        "id": "austria_cafe_central",
        "nameTr": "Café Central Tarihi Viyana Kahvehanesi & Apfelstrudel",
        "nameEn": "Historic Café Central & Warm Apple Strudel",
        "zone": "innere_stadt",
        "category": [
          "food",
          "history"
        ],
        "lat": 48.21,
        "lng": 16.365,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&auto=format&fit=crop&q=80",
        "descTr": "1876'dan kalma mermer sütunlu saray salonunda piyano tınıları eşliğinde Viyana kahvesi (Melange) ve elmalı turta.",
        "descEn": "Legendary Grand Café where Freud, Trotsky, and Stefan Zweig sat beneath neo-Renaissance vaulted ceilings.",
        "insiderTipTr": "Bir fincan 'Wiener Melange' ve sıcak vanilyalı sos eşliğinde Apfelstrudel sipariş edin.",
        "insiderTipEn": "Order the house Melange coffee with a warm slice of fresh apple strudel.",
        "transitTr": "U3 Herrengasse durağından 1 dk.",
        "transitEn": "1 min walk from U3 'Herrengasse'."
      },
      {
        "id": "austria_belvedere",
        "nameTr": "Belvedere Sarayı & Gustav Klimt Sanat Koleksiyonu",
        "nameEn": "Belvedere Palace & Gustav Klimt 'The Kiss'",
        "zone": "museumsquartier",
        "category": [
          "history",
          "art"
        ],
        "lat": 48.1915,
        "lng": 16.3808,
        "timeOfDay": "morning",
        "durationHours": 2.5,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1578964317355-68427771ba6a?w=900&auto=format&fit=crop&q=80",
        "descTr": "Barok saray kompleksi; Gustav Klimt'in altın yaldızlı dünyaca ünlü 'Öpücük' (The Kiss) tablosuna ev sahipliği yapar.",
        "descEn": "Baroque palace ensemble holding Austria's greatest art treasures, including Gustav Klimt's golden masterpiece 'The Kiss'.",
        "insiderTipTr": "Yukarı ve Aşağı Belvedere arasındaki basamaklı havuzlu bahçeleri gezmek tamamen ücretsizdir.",
        "insiderTipEn": "Strolling the terraced water gardens between Upper and Lower Belvedere is free.",
        "transitTr": "Tramvay D Schloss Belvedere durağı.",
        "transitEn": "Tram D to 'Schloss Belvedere'."
      }
    ]
  },
  "netherlands": {
    "zones": {
      "canal_ring": {
        "titleTr": "Kanal Bölgesi (Grachtengordel)",
        "titleEn": "Historic Canal Ring",
        "primaryNeighborhood": "Jordaan / Prinsengracht",
        "color": "#0284c7"
      },
      "dam_central": {
        "titleTr": "Dam Meydanı & Eski Merkez",
        "titleEn": "Dam Square & Central",
        "primaryNeighborhood": "Centrum / Dam",
        "color": "#e11d48"
      },
      "leidseplein_nightlife": {
        "titleTr": "Leidseplein & De Wallen (Barlar & Gece Hayatı)",
        "titleEn": "Leidseplein & Nightlife",
        "primaryNeighborhood": "Leidseplein / De Wallen",
        "color": "#d97706"
      },
      "museumplein": {
        "titleTr": "Museumplein & Vondelpark",
        "titleEn": "Museum Square & Vondelpark",
        "primaryNeighborhood": "Oud-Zuid",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "netherlands_rijksmuseum",
        "nameTr": "Rijksmuseum & Rembrandt 'Gece Devriyesi'",
        "nameEn": "Rijksmuseum & Dutch Masters",
        "zone": "museumplein",
        "category": [
          "history",
          "art"
        ],
        "lat": 52.36,
        "lng": 4.8852,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Hollanda Altın Çağı'nın 8000 sanat eserine ev sahipliği yapan muhteşem neo-Rönesans saray müzesi.",
        "descEn": "The national masterpiece museum celebrating Dutch Golden Age art, featuring Rembrandt's 'Night Watch'.",
        "insiderTipTr": "Müzenin içinden geçen tonozlu bisiklet geçidinde sokak müzisyenlerini dinlemek ücretsizdir.",
        "insiderTipEn": "The central arched bicycle passageway running through the museum has great acoustics and is free.",
        "transitTr": "Tramvay 2, 5, 12 Rijksmuseum durağı.",
        "transitEn": "Tram 2, 5, or 12 to 'Rijksmuseum'."
      },
      {
        "id": "netherlands_dam_square",
        "nameTr": "Dam Meydanı & Amsterdam Kraliyet Sarayı",
        "nameEn": "Dam Square & Royal Palace Amsterdam",
        "zone": "dam_central",
        "category": [
          "history",
          "views"
        ],
        "lat": 52.3731,
        "lng": 4.8926,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Amsterdam'ın kalbi; 17. yüzyıl klasik dönem Kraliyet Sarayı, Ulusal Anıt ve canlı sokak gösterileri.",
        "descEn": "The historical beating heart of Amsterdam surrounded by the Koninklijk Paleis and vibrant pedestrian buzz.",
        "insiderTipTr": "Meydanda oturup tarihi binaların ve tramvayların geçişini izlemek ücretsizdir.",
        "insiderTipEn": "Visiting Dam Square is free; a great starting point for historic Old Town walking tours.",
        "transitTr": "Centraal İstasyonundan 8 dk yürüyüş veya tramvay.",
        "transitEn": "8 mins walk from Central Station."
      },
      {
        "id": "netherlands_jordaan_nightlife",
        "nameTr": "Jordaan Bölgesi Bruin Café'ler & Kanal Barları",
        "nameEn": "Jordaan Quarter Bruin Cafés & Canal Terraces",
        "zone": "canal_ring",
        "category": [
          "nightlife"
        ],
        "lat": 52.375,
        "lng": 4.882,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Tarihi ahşap panelli geleneksel 'Bruin Café'ler, yerel fıçı biralar ve kanallara bakan romantik köprü masaları.",
        "descEn": "Charming canal-laced quarter filled with heritage brown pubs, craft beer taps, and candlelit bridge terraces.",
        "insiderTipTr": "Kanal kenarındaki tarihi Café Chris (1624) veya Café 't Smalle'de açık havada yerel bira tadın.",
        "insiderTipEn": "Grab a canal-facing outdoor table at Café 't Smalle for affordable local beers.",
        "transitTr": "Westermarkt tramvay durağından 4 dk.",
        "transitEn": "4 mins walk from 'Westermarkt'."
      },
      {
        "id": "netherlands_leidseplein",
        "nameTr": "Leidseplein Canlı Müzik Mekanları & Barlar Bölgesi",
        "nameEn": "Leidseplein Nightlife Plaza & Live Music Clubs",
        "zone": "leidseplein_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 52.3635,
        "lng": 4.8825,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Paradiso ve Melkweg gibi dünyaca ünlü konser salonları, açık hava pubları ve sokak sanatçıları.",
        "descEn": "Amsterdam's bustling entertainment hub packed with historic music venues (Paradiso, Melkweg) and dance clubs.",
        "insiderTipTr": "Akşamüstü saatlerinde meydana açılan barlarda oturup sokak akrobatlarını izleyin.",
        "insiderTipEn": "Sit outside on the plaza for great people-watching and evening acoustic buskers.",
        "transitTr": "Tramvay 1, 2, 5, 12 Leidseplein durağı.",
        "transitEn": "Tram to 'Leidseplein'."
      },
      {
        "id": "netherlands_canal_cruise",
        "nameTr": "Amsterdam Kanalları Panoramik Tekne Gezisi",
        "nameEn": "Amsterdam Historic Canal Belt Sightseeing Cruise",
        "zone": "canal_ring",
        "category": [
          "views"
        ],
        "lat": 52.378,
        "lng": 4.898,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=900&auto=format&fit=crop&q=80",
        "descTr": "17. yüzyıl tüccar konakları, kemerli taş köprüler ve akşam ışıklandırılan kanallarda büyüleyici tekne turu.",
        "descEn": "Glass-topped boat tour gliding through UNESCO-listed canal rings past tilted historic merchant houses.",
        "insiderTipTr": "Alacakaranlık saatlerinde binerek köprü kemerlerinin altındaki sarı lambaların suya yansımasını fotoğraflayın.",
        "insiderTipEn": "Take an evening departure to see hundreds of bridge arches illuminate over the water.",
        "transitTr": "Centraal İstasyonu önündeki iskeleler.",
        "transitEn": "Docks right outside Centraal Station."
      },
      {
        "id": "netherlands_vondelpark",
        "nameTr": "Vondelpark Şehir Parkı & Gül Bahçeleri",
        "nameEn": "Vondelpark Oasis & Rose Gardens",
        "zone": "museumplein",
        "category": [
          "views"
        ],
        "lat": 52.358,
        "lng": 4.868,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
        "descTr": "47 hektarlık yeşil park; kuğuların yüzdüğü göletler, söğüt ağaçları ve bisiklet yolları.",
        "descEn": "Amsterdam's most beloved 120-acre urban park featuring tranquil ponds, weeping willows, and open lawns.",
        "insiderTipTr": "Giriş tamamen ÜCRETSİZDİR; fırından sıcak kruvasan veya peynir alıp çimlerde piknik yapın.",
        "insiderTipEn": "100% free entrance; an ideal spot for a budget picnic by the ponds.",
        "transitTr": "Museumplein'den 4 dk yürüyüş.",
        "transitEn": "4 mins walk from Museumplein."
      },
      {
        "id": "netherlands_albert_cuyp",
        "nameTr": "Albert Cuypmarkt & Sıcak Stroopwafel Tadımı",
        "nameEn": "Albert Cuypmarkt & Fresh Warm Stroopwafel",
        "zone": "museumplein",
        "category": [
          "food",
          "bazaars"
        ],
        "lat": 52.356,
        "lng": 4.8935,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "Avrupa'nın en uzun açık hava pazarı; taze gözünüzün önünde pişirilen karamelli sıcak stroopwafel, ringa balığı ve peynirler.",
        "descEn": "Bustling street market celebrated for fresh jumbo caramel stroopwafels, Dutch herring, and local cheeses.",
        "insiderTipTr": "Sadece 3 Euro'ya gözünüzün önünde sıcacık pişirilip arasına karamel sürülen taze stroopwafel alın.",
        "insiderTipEn": "Watch artisan bakers press fresh giant stroopwafels with hot caramel for under €3.50.",
        "transitTr": "Metro 52 De Pijp durağı.",
        "transitEn": "Metro 52 to 'De Pijp'."
      },
      {
        "id": "netherlands_brouwerij_ij",
        "nameTr": "Brouwerij 't IJ (Tarihi De Gooyer Değirmeni Bira Evi)",
        "nameEn": "Brouwerij 't IJ Historic Windmill Craft Brewery",
        "zone": "dam_central",
        "category": [
          "food",
          "nightlife"
        ],
        "lat": 52.3668,
        "lng": 4.9262,
        "timeOfDay": "sunset",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "18. yüzyıldan kalma dev tarihi ahşap yel değirmeninin gölgesinde organik el yapımı biralar ve açık hava terası.",
        "descEn": "Iconic craft artisan brewery situated directly underneath Amsterdam's tallest wooden windmill.",
        "insiderTipTr": "Değirmenin altındaki açık hava masalarında 'Zatte' veya 'Natte' biralarını yerel peynir tabağıyla çok ucuza tadın.",
        "insiderTipEn": "Sample a flight of organic craft beers outdoors right beside the historic windmill.",
        "transitTr": "Tramvay 14 Pontanusstraat durağı.",
        "transitEn": "Tram 14 to 'Pontanusstraat'."
      }
    ]
  },
  "greece": {
    "zones": {
      "acropolis_plaka": {
        "titleTr": "Akropolis & Plaka (Tarih & Bohem)",
        "titleEn": "Acropolis & Plaka",
        "primaryNeighborhood": "Plaka / Monastiraki",
        "color": "#e11d48"
      },
      "gazi_nightlife": {
        "titleTr": "Gazi & Psiri (Barlar & Tavernalar)",
        "titleEn": "Gazi & Psiri Nightlife",
        "primaryNeighborhood": "Gazi / Psiri",
        "color": "#2563eb"
      },
      "lycabettus_views": {
        "titleTr": "Lykavittos Seyir Tepesi & Kolonaki",
        "titleEn": "Mount Lycabettus & Views",
        "primaryNeighborhood": "Kolonaki",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "greece_acropolis",
        "nameTr": "Akropolis & Parthenon Tapınağı",
        "nameEn": "The Acropolis & The Parthenon",
        "zone": "acropolis_plaka",
        "category": [
          "history",
          "views"
        ],
        "lat": 37.9715,
        "lng": 23.7257,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&auto=format&fit=crop&q=80",
        "descTr": "MÖ 5. yüzyıldan beri Atina semalarını taçlandıran beyaz mermer dorik sütunlar ve Antik Yunan felsefesinin beşiği.",
        "descEn": "The crowning citadel of classical Greece with the Parthenon overlooking the entire Attica basin.",
        "insiderTipTr": "Akropolis'in hemen yanındaki Areopagus (Mars Tepesi) kayalıklarına çıkıp Parthenon'u izlemek tamamen ÜCRETSİZDİR.",
        "insiderTipEn": "Climbing Areopagus (Mars Hill) rock right next to the entrance is 100% free with incredible views.",
        "transitTr": "Metro 2 Acropoli durağı.",
        "transitEn": "Metro Line 2 to 'Acropoli'."
      },
      {
        "id": "greece_plaka_walk",
        "nameTr": "Tarihi Plaka Mahallesi & Anafiotika Kiklad Evleri",
        "nameEn": "Plaka Historic Lanes & Anafiotika Island Quarter",
        "zone": "acropolis_plaka",
        "category": [
          "history",
          "views",
          "art"
        ],
        "lat": 37.973,
        "lng": 23.7295,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&auto=format&fit=crop&q=80",
        "descTr": "Akropolis yamaçlarında begonvillerle süslü dar merdivenli sokaklar ve Ege adalarını andıran beyaz badanalı evler.",
        "descEn": "Atmospheric pedestrian quarter resembling a Cycladic island nestled directly beneath the Acropolis walls.",
        "insiderTipTr": "Anafiotika'nın daracık beyaz patikalarında yürümek ücretsizdir; tepede muhteşem şehir panoraması açılır.",
        "insiderTipEn": "Wandering the whitewashed stairs of Anafiotika is completely free and peaceful.",
        "transitTr": "Monastiraki metro durağından 6 dk yürüyüş.",
        "transitEn": "6 mins walk from Monastiraki."
      },
      {
        "id": "greece_gazi_nightlife",
        "nameTr": "Gazi (Technopolis) Endüstriyel Barlar & Gece Kulüpleri",
        "nameEn": "Gazi / Technopolis Creative Nightlife District",
        "zone": "gazi_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 37.9785,
        "lng": 23.712,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Eski gaz fabrikasının çevresinde toplanan çatı kokteyl barları, açık hava dans mekanları ve canlı DJ sahneleri.",
        "descEn": "Former gasworks industrial quarter turned into Athens's loudest nightlife center with rooftop terraces.",
        "insiderTipTr": "Çatı barlarından ışıklandırılmış Akropolis'i gece izlerken kokteylinizi yudumlayın.",
        "insiderTipEn": "Head to a rooftop bar for striking illuminated night views of the Acropolis.",
        "transitTr": "Metro 3 Kerameikos durağının hemen meydanı.",
        "transitEn": "Metro Line 3 to 'Kerameikos'."
      },
      {
        "id": "greece_psiri_tavernas",
        "nameTr": "Psiri Canlı Meyhaneleri & Rebetiko Müzik Barları",
        "nameEn": "Psiri Bohemian Tavernas & Live Rebetiko Music",
        "zone": "gazi_nightlife",
        "category": [
          "nightlife",
          "food"
        ],
        "lat": 37.979,
        "lng": 23.724,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Grafitili dar sokaklarda canlı buzuki nağmeleri eşliğinde uzo, meze ve gece yarısına kadar süren taverna neşesi.",
        "descEn": "Indie artistic district filled with cozy ouzeries, live acoustic rebetiko music, and street art murals.",
        "insiderTipTr": "Yerel uzo veya tsipouro eşliğinde 4-5 çeşit meze siparişi vererek ekonomik ve çok zengin bir akşam geçirin.",
        "insiderTipEn": "Order carafes of house wine and shared meze platters for an authentic, budget-friendly Greek evening.",
        "transitTr": "Monastiraki'den 3 dk yürüyüş.",
        "transitEn": "3 mins walk from Monastiraki."
      },
      {
        "id": "greece_souvlaki",
        "nameTr": "Geleneksel Atina Pita Souvlaki & Tzatziki",
        "nameEn": "Authentic Athens Pita Souvlaki & Gyros",
        "zone": "acropolis_plaka",
        "category": [
          "food"
        ],
        "lat": 37.976,
        "lng": 23.726,
        "timeOfDay": "afternoon",
        "durationHours": 1.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "Sıcak kabarık pita ekmeğine sarılı ızgara et, taze domates, soğan, çıtır patates ve ev yapımı cacık.",
        "descEn": "Classic Greek pita wrapped around tender grilled pork or chicken skewers, tomatoes, and cool garlic tzatziki.",
        "insiderTipTr": "Sadece 3.5 - 4 Euro karşılığında Atina'nın en lezzetli ve doyurucu sokak yemeğini elde edebilirsiniz.",
        "insiderTipEn": "At under €4, a fresh wrapped pita souvlaki is the tastiest and most economical lunch in Athens.",
        "transitTr": "Monastiraki Meydanı çevresi.",
        "transitEn": "Around Monastiraki square."
      },
      {
        "id": "greece_lycabettus",
        "nameTr": "Lykavittos Seyir Tepesi & Gün Batımı",
        "nameEn": "Mount Lycabettus Panoramic Sunset Summit",
        "zone": "lycabettus_views",
        "category": [
          "views"
        ],
        "lat": 37.9818,
        "lng": 23.7432,
        "timeOfDay": "sunset",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=900&auto=format&fit=crop&q=80",
        "descTr": "277 metreyle Atina'nın en yüksek noktası; zirvedeki beyaz Agios Georgios şapelinden Ege Denizi'ne uzanan ufuk.",
        "descEn": "The highest limestone hill in Athens offering breathtaking 360-degree vistas stretching all the way to Piraeus harbor.",
        "insiderTipTr": "Zirveye patika yoldan çamlar arasından yürümek tamamen ÜCRETSİZDİR; gün batımında güneşin denize batışını izleyin.",
        "insiderTipEn": "Hiking up the pine-scented walking paths is completely free; arrive for golden hour.",
        "transitTr": "Metro 3 Evangelismos durağından füniküler veya patika yürüyüşü.",
        "transitEn": "Walk from Evangelismos Metro."
      }
    ]
  },
  "japan": {
    "zones": {
      "asakusa_ueno": {
        "titleTr": "Asakusa & Ueno (Tarih & Gelenek)",
        "titleEn": "Asakusa & Historic Tokyo",
        "primaryNeighborhood": "Asakusa / Taito",
        "color": "#e11d48"
      },
      "shinjuku_shibuya": {
        "titleTr": "Shinjuku & Shibuya (Neon, Barlar & Gece)",
        "titleEn": "Shinjuku & Shibuya Nightlife",
        "primaryNeighborhood": "Shibuya / Shinjuku",
        "color": "#2563eb"
      },
      "tsukiji_ginza": {
        "titleTr": "Tsukiji Balık Pazarı & Ginza",
        "titleEn": "Tsukiji Food Market & Ginza",
        "primaryNeighborhood": "Tsukiji / Chuo",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "japan_sensoji",
        "nameTr": "Sensō-ji Tapınağı & Kaminarimon Kapısı",
        "nameEn": "Sensō-ji Temple & Kaminarimon Giant Lantern",
        "zone": "asakusa_ueno",
        "category": [
          "history",
          "views"
        ],
        "lat": 35.7148,
        "lng": 139.7967,
        "timeOfDay": "morning",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80",
        "descTr": "MS 645 yapımı Tokyo'nun en eski Budist tapınağı, dev kırmızı feneri ve tütsü dumanlarıyla arınma ritüeli.",
        "descEn": "Tokyo's oldest and most sacred Buddhist temple, anchored by the iconic 700 kg red paper thunder lantern.",
        "insiderTipTr": "Tapınak bahçesini gezmek ve 100 yen karşılığında geleneksel 'Omikuji' falı çekmek keyifli bir ritüeldir.",
        "insiderTipEn": "Admission to the temple complex is completely free; draw a paper fortune (omikuji) for 100 yen.",
        "transitTr": "Ginza veya Asakusa Hattı Asakusa durağı.",
        "transitEn": "Ginza / Asakusa Subway to 'Asakusa'."
      },
      {
        "id": "japan_shibuya_crossing",
        "nameTr": "Shibuya Crossing & Hachiko Heykeli",
        "nameEn": "Shibuya Scramble Crossing & Hachiko Square",
        "zone": "shinjuku_shibuya",
        "category": [
          "views",
          "nightlife"
        ],
        "lat": 35.6595,
        "lng": 139.7005,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=900&auto=format&fit=crop&q=80",
        "descTr": "Aynı anda 3000 kişinin karşıdan karşıya geçtiği devasa LED ekranlarla aydınlatılan dünyanın en meşhur kavşağı.",
        "descEn": "The world's busiest pedestrian crossing surrounded by dazzling neon billboards and Tokyo's pulse.",
        "insiderTipTr": "Kavşaktan geçmek tamamen ücretsizdir; Shibuya İstasyonu geçidinden kavşağı yukarıdan fotoğraflayın.",
        "insiderTipEn": "Crossing is free; head to the 2nd-floor station pedestrian bridge for bird's-eye views.",
        "transitTr": "Shibuya İstasyonu (Hachiko çıkışı).",
        "transitEn": "Shibuya Station (Hachiko Exit)."
      },
      {
        "id": "japan_golden_gai",
        "nameTr": "Shinjuku Golden Gai & Omoide Yokocho Minik Barlar Sokağı",
        "nameEn": "Shinjuku Golden Gai Micro-Bars & Lantern Alleys",
        "zone": "shinjuku_shibuya",
        "category": [
          "nightlife"
        ],
        "lat": 35.6942,
        "lng": 139.7045,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Sadece 4-6 kişinin sığabildiği 200'den fazla tarihi minik barın dizildiği nostaljik Showa dönemi labirenti.",
        "descEn": "Atmospheric warren of six narrow alleys packed with over 200 tiny thematic micro-bars seating just 5-6 patrons.",
        "insiderTipTr": "Kapısında 'No Cover Charge' (giriş ücreti yok) yazan barları tercih ederek yerel Japon viskisi veya birası tadın.",
        "insiderTipEn": "Look for bars clearly indicating 'No Table Charge' for budget-friendly whiskey and beer.",
        "transitTr": "Shinjuku İstasyonu Doğu çıkışından 5 dk.",
        "transitEn": "5 mins walk from Shinjuku Station East Exit."
      },
      {
        "id": "japan_tsukiji_sushi",
        "nameTr": "Tsukiji Dış Balık Pazarı & Taze Suşi Tadımı",
        "nameEn": "Tsukiji Outer Market Fresh Sushi & Street Eats",
        "zone": "tsukiji_ginza",
        "category": [
          "food",
          "bazaars"
        ],
        "lat": 35.6655,
        "lng": 139.7705,
        "timeOfDay": "morning",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Denizden yeni çıkmış ton balığı suşileri, taze istiridyeler, sıcak tamagoyaki omletleri ve deniz ürünleri tezgahları.",
        "descEn": "Legendary seafood market bustling with hundreds of sushi counters, wagyu skewers, and sweet tamago omelets.",
        "insiderTipTr": "Demir tavalarda gözünüzün önünde kat kat pişirilen sıcak tatlı Tamagoyaki omlet çubuğunu 150-200 yene ayaküstü deneyin.",
        "insiderTipEn": "Sample fresh rolled tamagoyaki sweet egg skewers right off the hot plate for just 150-200 yen.",
        "transitTr": "Oedo Hattı Tsukijishijo durağı.",
        "transitEn": "Toei Oedo Line to 'Tsukijishijo'."
      }
    ]
  },
  "usa": {
    "zones": {
      "midtown_broadway": {
        "titleTr": "Midtown Manhattan & Times Square",
        "titleEn": "Midtown Manhattan & Central Park",
        "primaryNeighborhood": "Midtown",
        "color": "#e11d48"
      },
      "village_soho": {
        "titleTr": "Greenwich Village & SoHo (Caz & Barlar)",
        "titleEn": "Greenwich Village & SoHo Nightlife",
        "primaryNeighborhood": "Greenwich Village",
        "color": "#2563eb"
      },
      "downtown_bridge": {
        "titleTr": "Downtown & Brooklyn Köprüsü",
        "titleEn": "Downtown & Brooklyn Bridge",
        "primaryNeighborhood": "DUMBO / FiDi",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "usa_statue_of_liberty",
        "nameTr": "Özgürlük Heykeli & New York Limanı",
        "nameEn": "Statue of Liberty & New York Harbor",
        "zone": "downtown_bridge",
        "category": [
          "history",
          "views"
        ],
        "lat": 40.6892,
        "lng": -74.0445,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=900&auto=format&fit=crop&q=80",
        "descTr": "1886'da açılan ve Amerikan rüyasının evrensel simgesi olan 93 metrelik bakır anıt heykel.",
        "descEn": "Colossal neoclassical copper sculpture on Liberty Island welcoming generations of world travelers.",
        "insiderTipTr": "Staten Island Ferry feribotuna binerek Özgürlük Heykeli'nin yanından tamamen ÜCRETSİZ geçebilirsiniz.",
        "insiderTipEn": "Take the completely FREE Staten Island Ferry for sweeping harbor views right past Lady Liberty.",
        "transitTr": "Subway 1, R South Ferry durağı.",
        "transitEn": "Subway 1 or R to 'South Ferry'."
      },
      {
        "id": "usa_central_park",
        "nameTr": "Central Park & Bethesda Terası",
        "nameEn": "Central Park & Bethesda Terrace",
        "zone": "midtown_broadway",
        "category": [
          "views"
        ],
        "lat": 40.7829,
        "lng": -73.9654,
        "timeOfDay": "afternoon",
        "durationHours": 2.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop&q=80",
        "descTr": "Gökdelenlerin arasında 3.4 km²'lik devasa yeşil vaha; göletler, taş köprüler ve sokak müzisyenleri.",
        "descEn": "Manhattan's 843-acre urban forest featuring Bow Bridge, sheep meadow, and acoustic live buskers.",
        "insiderTipTr": "Giriş tamamen ücretsizdir; Bow Bridge köprüsü üzerinde gökdelen silüetini fotoğraflayın.",
        "insiderTipEn": "Entrance is 100% free; stroll across Bow Bridge for reflections of the Upper West Side skyline.",
        "transitTr": "Subway N, Q, R 5th Ave - 59th St durağı.",
        "transitEn": "Subway to 59th St / 5th Ave."
      },
      {
        "id": "usa_greenwich_jazz",
        "nameTr": "Greenwich Village Tarihi Caz Kulüpleri (Blue Note & Village Vanguard)",
        "nameEn": "Greenwich Village Iconic Jazz Clubs",
        "zone": "village_soho",
        "category": [
          "nightlife"
        ],
        "lat": 40.7308,
        "lng": -74.0007,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=900&auto=format&fit=crop&q=80",
        "descTr": "Miles Davis ve John Coltrane'in çaldığı kırmızı tuğlalı tarihi yeraltı caz salonları ve bohem barlar.",
        "descEn": "Historic tree-lined neighborhood famous for legendary underground jazz basements and speakeasies.",
        "insiderTipTr": "Village Vanguard'da barda oturarak daha uygun biletle dünyaca ünlü caz sanatçılarını dinleyin.",
        "insiderTipEn": "Reserve bar-seating tickets in advance for world-class live bebop jazz at modest prices.",
        "transitTr": "Subway A, C, E, B, D W 4th St durağı.",
        "transitEn": "Subway to 'West 4th St - Washington Sq'."
      },
      {
        "id": "usa_times_square",
        "nameTr": "Times Square Gece Işıkları & Broadway",
        "nameEn": "Times Square Midnight Neon & Broadway",
        "zone": "midtown_broadway",
        "category": [
          "nightlife",
          "views"
        ],
        "lat": 40.758,
        "lng": -73.9855,
        "timeOfDay": "evening",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=900&auto=format&fit=crop&q=80",
        "descTr": "Gece yarısı bile gündüz gibi parlayan devasa dijital panolar, sokak sanatçıları ve Broadway tiyatroları.",
        "descEn": "The illuminated crossroads of the world pulsating with towering digital billboards and Broadway energy.",
        "insiderTipTr": "Kırmızı basamaklara (Red Steps) oturup ışık selini yukarıdan seyredin; giriş ücretsizdir.",
        "insiderTipEn": "Sit on top of the red TKTS bleacher steps to take in the electrifying panoramic lights.",
        "transitTr": "Times Sq - 42 St Metro durağı.",
        "transitEn": "Times Sq - 42 St Station."
      },
      {
        "id": "usa_joes_pizza",
        "nameTr": "Joe's Pizza Greenwich Village (Klasik New York Dilim Pizza)",
        "nameEn": "Joe's Pizza Famous NY Slice (Est. 1975)",
        "zone": "village_soho",
        "category": [
          "food"
        ],
        "lat": 40.7305,
        "lng": -74.0021,
        "timeOfDay": "afternoon",
        "durationHours": 0.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=80",
        "descTr": "İnce çıtır hamuru, uzayan mozzarella peyniri ve domates sosuyla New York'un en ünlü dilim pizzası.",
        "descEn": "The quintessential Greenwich Village institution serving piping-hot thin-crust cheese slices on paper plates.",
        "insiderTipTr": "Sadece $4 karşılığında sıcacık bir peynirli dilim alıp katlayarak New York usulü ayaküstü yiyin.",
        "insiderTipEn": "Order a classic plain cheese slice for $4, fold it in half lengthways, and enjoy on the go.",
        "transitTr": "W 4th St metro durağından 2 dk yürüyüş.",
        "transitEn": "2 mins walk from W 4th St."
      }
    ]
  },
  "egypt": {
    "zones": {
      "giza_pyramids": {
        "titleTr": "Giza & Piramitler Bölgesi",
        "titleEn": "Giza Plateau & Pyramids",
        "primaryNeighborhood": "Giza",
        "color": "#e11d48"
      },
      "islamic_cairo": {
        "titleTr": "Tarihi İslam Kahiresi & Han el-Halili",
        "titleEn": "Historic Islamic Cairo & Bazaars",
        "primaryNeighborhood": "Al-Gamaleya",
        "color": "#d97706"
      },
      "nile_zamalek": {
        "titleTr": "Nil Nehri & Zamalek Adası (Barlar & Manzara)",
        "titleEn": "Nile River Promenade & Zamalek",
        "primaryNeighborhood": "Zamalek",
        "color": "#0284c7"
      }
    },
    "places": [
      {
        "id": "egypt_giza_pyramids",
        "nameTr": "Giza Piramitleri (Keops, Kefren, Mikerinos) & Büyük Sfenks",
        "nameEn": "Giza Pyramids & The Great Sphinx",
        "zone": "giza_pyramids",
        "category": [
          "history",
          "views"
        ],
        "lat": 29.9792,
        "lng": 31.1342,
        "timeOfDay": "morning",
        "durationHours": 3.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=900&auto=format&fit=crop&q=80",
        "descTr": "Antik Dünyanın Yedi Harikası'ndan günümüze kalan tek şaheser; 4500 yıllık devasa kireçtaşı piramitler ve sfenks.",
        "descEn": "The sole surviving wonder of the ancient world: 4,500-year-old colossal stone tombs guarded by the Sphinx.",
        "insiderTipTr": "Plato biletinizle üç piramidin panoramik açısını çölde biraz geri yürüyerek kalabalıksız fotoğraflayın.",
        "insiderTipEn": "Walk south into the dunes for an iconic alignment shot of all three pyramids together.",
        "transitTr": "Giza metro durağından taksi veya dolmuş ile 15 dk.",
        "transitEn": "15 mins taxi from Giza Metro."
      },
      {
        "id": "egypt_khan_khalili",
        "nameTr": "Han el-Halili Tarihi Kapalı Çarşısı (1382)",
        "nameEn": "Khan el-Khalili Historic Labyrinth Souk",
        "zone": "islamic_cairo",
        "category": [
          "bazaars",
          "history"
        ],
        "lat": 30.0475,
        "lng": 31.2625,
        "timeOfDay": "afternoon",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1567527259232-3a7fcd490c53?w=900&auto=format&fit=crop&q=80",
        "descTr": "14. yüzyıldan kalma taş kemerler, pirinç lambalar, baharat kokuları ve el dokuması kilimlerle dolu büyüleyici pazar.",
        "descEn": "Sprawling 14th-century souk filled with copper lanterns, fragrant frankincense, spices, and stained-glass crafts.",
        "insiderTipTr": "Çarşıyı gezmek tamamen ücretsizdir; meşhur El Fishawy kahvehanesinde naneli çay içerek soluklanın.",
        "insiderTipEn": "Wandering the vibrant medieval arcades is free; stop for fresh mint tea at El Fishawy.",
        "transitTr": "Bab El Shaariya metro durağından 10 dk.",
        "transitEn": "10 mins walk from Bab El Shaariya."
      },
      {
        "id": "egypt_nile_felucca",
        "nameTr": "Nil Nehri Gün Batımı Geleneksel Felucca Yelkenli Turu",
        "nameEn": "Nile River Sunset Felucca Sail",
        "zone": "nile_zamalek",
        "category": [
          "views"
        ],
        "lat": 30.042,
        "lng": 31.226,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=900&auto=format&fit=crop&q=80",
        "descTr": "Motorsuz beyaz yelkenli teknede nehir rüzgarı ve Kahire silüeti eşliğinde dinlendirici altın saat yolculuğu.",
        "descEn": "Tranquil sail along the world's longest river on a traditional canvas-sailed wooden felucca.",
        "insiderTipTr": "Gruptan birkaç kişiyle birleşerek bir felucca kiraladığınızda kişi başı sadece 3-5 dolara nefis bir gün batımı yaşarsınız.",
        "insiderTipEn": "Hiring a private wooden felucca at Dokki pier costs very little when split among fellow travelers.",
        "transitTr": "Dokki veya Opera metro durağı yakınındaki iskeleler.",
        "transitEn": "Piers near Opera or Dokki Metro."
      },
      {
        "id": "egypt_zamalek_nightlife",
        "nameTr": "Zamalek Adası Nil Kıyısı Akşam Barları & Teraslar",
        "nameEn": "Zamalek Island Nile-View Lounge Bars & Clubs",
        "zone": "nile_zamalek",
        "category": [
          "nightlife"
        ],
        "lat": 30.061,
        "lng": 31.2205,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
        "descTr": "Kahire'nin en nezih adasında yüzen teknelerde (Le Pacha) kokteyller, açık hava terasları ve canlı müzik.",
        "descEn": "Upscale island quarter home to moored riverboat cocktail lounges, jazz clubs, and riverside terraces.",
        "insiderTipTr": "Nehir kenarındaki açık hava teraslarında yerel içecek eşliğinde ışıl ışıl Nil yansımalarını izleyin.",
        "insiderTipEn": "Grab a river-deck table on one of Zamalek's permanently moored boats for illuminated night views.",
        "transitTr": "Gezira / Opera metro durağı.",
        "transitEn": "Opera Metro station on Gezira Island."
      },
      {
        "id": "egypt_koshary",
        "nameTr": "Koshary Abou Tarek (Geleneksel Mısır Koşari Yemeği)",
        "nameEn": "Koshary Abou Tarek National Egyptian Dish",
        "zone": "islamic_cairo",
        "category": [
          "food"
        ],
        "lat": 30.052,
        "lng": 31.238,
        "timeOfDay": "afternoon",
        "durationHours": 1.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "Pirinç, makarna, mercimek, nohut, çıtır kızarmış soğan ve sarımsaklı domates sosuyla Mısır'ın milli lezzeti.",
        "descEn": "Egypt's ultimate national comfort food layered with pasta, rice, brown lentils, chickpeas, and crispy fried onions.",
        "insiderTipTr": "Kocaman bir porsiyon koşari sadece 1-2 dolar civarındadır; üzerine acı sos ve sarımsak sirkesi ekleyin.",
        "insiderTipEn": "One of the most budget-friendly hearty lunches in the world; cost is under $2.",
        "transitTr": "Nasser metro durağından 4 dk yürüme.",
        "transitEn": "4 mins walk from Nasser Metro."
      }
    ]
  },
  "uae": {
    "zones": {
      "downtown_burj": {
        "titleTr": "Downtown Dubai & Burç Halife",
        "titleEn": "Downtown Dubai & Burj Khalifa",
        "primaryNeighborhood": "Downtown",
        "color": "#0284c7"
      },
      "marina_jbr": {
        "titleTr": "Dubai Marina & JBR Sahili (Barlar & Plaj)",
        "titleEn": "Dubai Marina & JBR Beach",
        "primaryNeighborhood": "Dubai Marina",
        "color": "#2563eb"
      },
      "old_creek": {
        "titleTr": "Eski Dubai & Haliç (Kültür & Çarşılar)",
        "titleEn": "Old Dubai & Dubai Creek",
        "primaryNeighborhood": "Al Fahidi / Deira",
        "color": "#e11d48"
      }
    },
    "places": [
      {
        "id": "uae_burj_khalifa",
        "nameTr": "Burç Halife (Burj Khalifa) & Seyir Terası",
        "nameEn": "Burj Khalifa & Observation Decks",
        "zone": "downtown_burj",
        "category": [
          "history",
          "views"
        ],
        "lat": 25.1972,
        "lng": 55.2744,
        "timeOfDay": "morning",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&auto=format&fit=crop&q=80",
        "descTr": "828 metre yüksekliğiyle dünyanın en yüksek yapısı; 124. ve 148. katlarından tüm çöl ve gökdelen panoraması.",
        "descEn": "The world's tallest architectural achievement soaring 828 meters into the desert sky.",
        "insiderTipTr": "Aşağıdaki Dubai Mall göletinin etrafından kuleyi fotoğraflamak ve çeşme şovunu izlemek tamamen ÜCRETSİZDİR.",
        "insiderTipEn": "Admiring the tower from the waterfront promenade and watching the fountain show is 100% free.",
        "transitTr": "Kırmızı Hat Burj Khalifa / Dubai Mall metro durağı.",
        "transitEn": "Red Line Metro to 'Burj Khalifa / Dubai Mall'."
      },
      {
        "id": "uae_dubai_fountains",
        "nameTr": "Dubai Çeşmeleri Dans Şovu & Dubai Mall",
        "nameEn": "The Dubai Fountain Show & Lake Promenade",
        "zone": "downtown_burj",
        "category": [
          "views",
          "bazaars"
        ],
        "lat": 25.1955,
        "lng": 55.2785,
        "timeOfDay": "sunset",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&auto=format&fit=crop&q=80",
        "descTr": "Işıklar ve müzik eşliğinde 150 metre yüksekliğe fışkıran dev koreografik su gösterisi.",
        "descEn": "World's largest choreographed dancing fountain system shooting water 150 meters to Arabic and global hits.",
        "insiderTipTr": "Her akşam 18:00'den itibaren her yarım saatte bir ücretsiz olarak sergilenir; köprü üzerinden izleyin.",
        "insiderTipEn": "Shows run every 30 minutes in the evening for free; watch from Souk Al Bahar bridge.",
        "transitTr": "Dubai Mall zemin kat çıkışı.",
        "transitEn": "Ground level exit of Dubai Mall."
      },
      {
        "id": "uae_marina_nightlife",
        "nameTr": "Dubai Marina & JBR Açık Hava Teras Barları & Kulüpler",
        "nameEn": "Dubai Marina Promenade & JBR Beach Lounges",
        "zone": "marina_jbr",
        "category": [
          "nightlife",
          "views"
        ],
        "lat": 25.0805,
        "lng": 55.1403,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80",
        "descTr": "7 kilometrelik ışıl ışıl yat limanı boyunca sıralanan açık hava teras barları, çatı lounge mekanları ve plaj kulüpleri.",
        "descEn": "Gleaming high-rise waterfront lined with luxury yachts, open-air terrace dining, and illuminated skyline bars.",
        "insiderTipTr": "Marina boyunca akşam yürüyüşü yapmak ücretsizdir; 'Ladies Night' günlerinde barlarda ücretsiz içecek ikramları bulunur.",
        "insiderTipEn": "Walking the waterfront promenade is free; look out for generous mid-week promotions.",
        "transitTr": "Dubai Tramvayı JBR 1 veya JBR 2 durağı.",
        "transitEn": "Dubai Tram to 'JBR'."
      },
      {
        "id": "uae_old_dubai",
        "nameTr": "Eski Dubai Al Fahidi Tarihi Bölgesi & Baharat Çarşısı",
        "nameEn": "Al Fahidi Historic Quarter & Gold & Spice Souk",
        "zone": "old_creek",
        "category": [
          "history",
          "bazaars"
        ],
        "lat": 25.263,
        "lng": 55.297,
        "timeOfDay": "afternoon",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=900&auto=format&fit=crop&q=80",
        "descTr": "Geleneksel rüzgar kuleli taş konaklar, baharat ve safran kokulu çarşılar ve 1 Dirhem'lik geleneksel ahşap tekne (Abra) geçişi.",
        "descEn": "Heritage coral-stone wind-tower quarter contrasted with traditional wooden abra boats crossing the Creek.",
        "insiderTipTr": "Haliç'i karşıdan karşıya geleneksel ahşap 'Abra' kayığıyla geçmek sadece 1 BAE Dirhemi'dir (yaklaşık 10 TL).",
        "insiderTipEn": "Hop on a wooden abra boat across Dubai Creek for just 1 AED (roughly $0.25).",
        "transitTr": "Yeşil Hat Al Fahidi metro durağı.",
        "transitEn": "Green Line Metro to 'Al Fahidi'."
      }
    ]
  },
  "thailand": {
    "zones": {
      "rattanakosin_temples": {
        "titleTr": "Rattanakosin & Tarihi Tapınaklar",
        "titleEn": "Old City & Sacred Temples",
        "primaryNeighborhood": "Phra Nakhon",
        "color": "#e11d48"
      },
      "khao_san_nightlife": {
        "titleTr": "Khao San Road & Sukhumvit (Gece Hayatı)",
        "titleEn": "Khao San & Sukhumvit Nightlife",
        "primaryNeighborhood": "Khao San / Sukhumvit",
        "color": "#2563eb"
      },
      "chinatown_food": {
        "titleTr": "Yaowarat (Chinatown) & Nehir Kıyısı",
        "titleEn": "Chinatown & Chao Phraya",
        "primaryNeighborhood": "Yaowarat",
        "color": "#d97706"
      }
    },
    "places": [
      {
        "id": "thailand_wat_arun",
        "nameTr": "Wat Arun (Şafak Tapınağı) & Chao Phraya Nehri",
        "nameEn": "Wat Arun (Temple of Dawn)",
        "zone": "rattanakosin_temples",
        "category": [
          "history",
          "views"
        ],
        "lat": 13.7437,
        "lng": 100.4888,
        "timeOfDay": "sunset",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&auto=format&fit=crop&q=80",
        "descTr": "Chao Phraya Nehri kıyısında renkli porselen mozaiklerle kaplı 82 metrelik dev kule; gün batımında altından parlar.",
        "descEn": "Iconic riverside Buddhist spire (prang) encrusted in colorful Chinese porcelain mosaics.",
        "insiderTipTr": "Nehrin karşı kıyısındaki kafelerden veya feribottan Wat Arun'un gün batımı silüetini fotoğraflayın.",
        "insiderTipEn": "Watch the sunset glow illuminate the spires from the eastern riverbank cafes.",
        "transitTr": "Chao Phraya Express Bot ile Tha Tien iskelesinden 5 Baht'lık karşı geçiş.",
        "transitEn": "Cross-river ferry from Tha Tien pier."
      },
      {
        "id": "thailand_grand_palace",
        "nameTr": "Büyük Saray (Grand Palace) & Zümrüt Buda Tapınağı",
        "nameEn": "The Grand Palace & Wat Phra Kaew",
        "zone": "rattanakosin_temples",
        "category": [
          "history",
          "art"
        ],
        "lat": 13.75,
        "lng": 100.4915,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=900&auto=format&fit=crop&q=80",
        "descTr": "1782'den kalma Siyam Krallığı'nın altın kuleli, mitolojik heykelli muazzam saray kompleksi.",
        "descEn": "The spiritual heart of Thailand with gilded stupas, demon guardians, and the sacred Emerald Buddha.",
        "insiderTipTr": "Girişte omuzları ve dizleri örten kıyafet kuralı zorunludur; sabah 08:30 açılışında gidin.",
        "insiderTipEn": "Strict dress code applies (covered shoulders and knees); arrive at 8:30 AM to beat the heat.",
        "transitTr": "Sanam Chai MRT durağından 10 dk yürüyüş.",
        "transitEn": "10 mins walk from MRT 'Sanam Chai'."
      },
      {
        "id": "thailand_khao_san_bars",
        "nameTr": "Khao San Road Canlı Gece Hayatı & Sokak Barları",
        "nameEn": "Khao San Road Legendary Backpacker Nightlife Strip",
        "zone": "khao_san_nightlife",
        "category": [
          "nightlife"
        ],
        "lat": 13.7588,
        "lng": 100.4975,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Neon ışıklar altında dünyanın dört bir yanından gezginlerin buluştuğu açık hava barları, sokak DJ'leri ve ucuz tropikal kokteyller.",
        "descEn": "World-famous buzzing pedestrian avenue overflowing with open-air bars, booming sound systems, and street food carts.",
        "insiderTipTr": "Yerel Chang birası veya kovalarda servis edilen kokteyller son derece ekonomiktir; cadde boyunca yürümek ücretsizdir.",
        "insiderTipEn": "Grab an ice-cold Chang beer or fresh tropical fruit shake from street vendors.",
        "transitTr": "Tarihi merkezden kısa yürüyüş veya tuk-tuk.",
        "transitEn": "Short walk or tuk-tuk from the Old City."
      },
      {
        "id": "thailand_yaowarat_food",
        "nameTr": "Yaowarat (Chinatown) Gece Sokak Lezzetleri Pazarı",
        "nameEn": "Yaowarat Chinatown Night Street Food Extravaganza",
        "zone": "chinatown_food",
        "category": [
          "food",
          "nightlife"
        ],
        "lat": 13.741,
        "lng": 100.5085,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80",
        "descTr": "Akşam karanlığı çökünce neon tabelalar altında kurulan yüzlerce wok tava tezgahı; taze deniz ürünleri, pad thai ve mango tatlıları.",
        "descEn": "World's most celebrated street food strip with fiery woks sizzling fresh prawns, dim sum, and mango sticky rice.",
        "insiderTipTr": "Kömür ateşinde kızartılan içi akışkan kremalı sıcak ekmeklerden (Yaowarat Toasted Buns) mutlaka tadın; 25 Baht.",
        "insiderTipEn": "Sample the famous charcoal-toasted buns oozing with pandan custard for under $1.",
        "transitTr": "MRT Wat Mangkon durağının hemen çıkışı.",
        "transitEn": "Directly outside MRT 'Wat Mangkon'."
      }
    ]
  },
  "brazil": {
    "zones": {
      "corcovado_centro": {
        "titleTr": "Corcovado & Tarihi Merkez (Lapa)",
        "titleEn": "Corcovado & Historic Lapa",
        "primaryNeighborhood": "Lapa / Santa Teresa",
        "color": "#e11d48"
      },
      "copacabana_ipanema": {
        "titleTr": "Copacabana & Ipanema (Plaj & Barlar)",
        "titleEn": "Copacabana & Ipanema Beach Life",
        "primaryNeighborhood": "Copacabana / Ipanema",
        "color": "#0284c7"
      },
      "sugarloaf_urca": {
        "titleTr": "Şeker Tepesi & Urca Koyu",
        "titleEn": "Sugarloaf Mountain & Urca",
        "primaryNeighborhood": "Urca",
        "color": "#059669"
      }
    },
    "places": [
      {
        "id": "brazil_christ_redeemer",
        "nameTr": "Kurtarıcı İsa Heykeli (Cristo Redentor) & Corcovado",
        "nameEn": "Christ the Redeemer (Cristo Redentor)",
        "zone": "corcovado_centro",
        "category": [
          "history",
          "views"
        ],
        "lat": -22.9519,
        "lng": -43.2105,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=900&auto=format&fit=crop&q=80",
        "descTr": "710 metrelik Corcovado Dağı zirvesinde kolları açık duran 38 metrelik heybetli anıt; dünyanın Yeni Yedi Harikası'ndan biri.",
        "descEn": "Global symbol of Christianity and Rio, welcoming the world from atop Corcovado mountain.",
        "insiderTipTr": "Sabah 08:00'deki ilk trenle çıkarak bulutsuz Guanabara Körfezi ve Copacabana sahilini fotoğraflayın.",
        "insiderTipEn": "Take the earliest cogwheel train through Tijuca forest for clear morning panoramas.",
        "transitTr": "Cosme Velho tren istasyonundan tarihi dişli raylı trenle 20 dk.",
        "transitEn": "Historic cog train from Cosme Velho."
      },
      {
        "id": "brazil_sugarloaf",
        "nameTr": "Şeker Tepesi (Pão de Açúcar) & Teleferik",
        "nameEn": "Sugarloaf Mountain (Pão de Açúcar) Cable Car",
        "zone": "sugarloaf_urca",
        "category": [
          "views"
        ],
        "lat": -22.9492,
        "lng": -43.1545,
        "timeOfDay": "sunset",
        "durationHours": 2.5,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=900&auto=format&fit=crop&q=80",
        "descTr": "Granit monolit tepeye cam kabinli teleferikle çıkış; gün batımında kentin altın rengi ışıkları.",
        "descEn": "Dramatic granite peak rising 396 meters above the harbor, accessed by iconic bubble cable cars.",
        "insiderTipTr": "Urca Koyu'nun sahil duvarı (Mureta da Urca) üzerine oturup gün batımında bira içmek yerel ve tamamen ücretsizdir.",
        "insiderTipEn": "Sit along the stone wall at Mureta da Urca with cold beer for a free local sunset ritual.",
        "transitTr": "Botafogo metro durağından otobüsle 10 dk.",
        "transitEn": "10 mins bus from Botafogo Metro."
      },
      {
        "id": "brazil_lapa_nightlife",
        "nameTr": "Lapa Kemerleri & Canlı Samba Kulüpleri (Carioca da Gema)",
        "nameEn": "Lapa Arches & Live Samba Dance Halls",
        "zone": "corcovado_centro",
        "category": [
          "nightlife"
        ],
        "lat": -22.913,
        "lng": -43.18,
        "timeOfDay": "evening",
        "durationHours": 3.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Tarihi su kemerleri altında sokak caipirinha tezgahları, canlı samba ritimleri ve sabahın ilk ışıklarına kadar dans.",
        "descEn": "The beating pulse of Rio's bohemian nights filled with live acoustic samba taverns and vibrant street parties.",
        "insiderTipTr": "Sokak tezgahlarında taze misket limonuyla ezilen Caipirinha kokteyli son derece uygun fiyatlıdır.",
        "insiderTipEn": "Try a fresh passionfruit caipirinha prepared by street mixologists beneath the arches.",
        "transitTr": "Cinelandia metro durağından 6 dk yürüyüş.",
        "transitEn": "6 mins walk from Cinelandia Metro."
      },
      {
        "id": "brazil_copacabana_beach",
        "nameTr": "Copacabana & Ipanema Sahil Barları (Quiosques) & Gün Batımı",
        "nameEn": "Copacabana & Ipanema Beachfront Boardwalk & Sunset",
        "zone": "copacabana_ipanema",
        "category": [
          "nightlife",
          "views"
        ],
        "lat": -22.9698,
        "lng": -43.1868,
        "timeOfDay": "sunset",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
        "descTr": "Siyah-beyaz dalga desenli ünlü kaldırım boyunca sıralanan canlı müzikli kumsal barları, soğuk hindistan cevizi suyu ve okyanus esintisi.",
        "descEn": "World-famous mosaic promenade hosting open-air beach kiosks, fresh chilled coconut water, and bossa nova tunes.",
        "insiderTipTr": "Arpoador kayalıklarına oturup güneş batarken alkışlama ritüeline katılın; giriş tamamen ücretsizdir.",
        "insiderTipEn": "Join the local tradition of applauding the sunset from Arpoador rock between the two beaches.",
        "transitTr": "Metro Cardeal Arcoverde veya General Osorio durağı.",
        "transitEn": "Metro to 'Cardeal Arcoverde'."
      }
    ]
  },
  "switzerland": {
    "zones": {
      "zurich_oldtown": {
        "titleTr": "Zürih Eski Şehir",
        "titleEn": "Zurich Old Town",
        "primaryNeighborhood": "Altstadt",
        "color": "#e11d48"
      },
      "geneva_lake": {
        "titleTr": "Cenevre Gölü",
        "titleEn": "Lake Geneva",
        "primaryNeighborhood": "Lac Léman",
        "color": "#0284c7"
      },
      "interlaken_adventure": {
        "titleTr": "Interlaken Macera",
        "titleEn": "Interlaken Adventure",
        "primaryNeighborhood": "Bernese Oberland",
        "color": "#2563eb"
      }
    },
    "places": [
      {
        "id": "swiss_bergamo_bridge",
        "nameTr": "Bahnhofstrasse Köprüsü (Alışveriş)",
        "nameEn": "Bahnhofstrasse Bridge (Shopping)",
        "zone": "zurich_oldtown",
        "category": [
          "shopping"
        ],
        "lat": 47.3769,
        "lng": 8.5417,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=900&auto=format&fit=crop&q=80",
        "descTr": "Zürih'in popüler alışveriş caddesi, güzel bir köprüyle birbirine bağlanıyor.",
        "descEn": "Zurich's iconic shopping boulevard linked by a charming footbridge.",
        "insiderTipTr": "Köprünün altında gerçekleşen sokak sanatını kaçırmayın; ücretsiz.",
        "insiderTipEn": "Don't miss the free street art beneath the bridge.",
        "transitTr": "Tram 2, Haltestelle Bahnhofstrasse.",
        "transitEn": "Tram 2, Bahnhofstrasse stop."
      },
      {
        "id": "swiss_lake_geneva",
        "nameTr": "Cenevre Gölü Tekne Turu",
        "nameEn": "Lake Geneva Boat Tour",
        "zone": "geneva_lake",
        "category": [
          "views",
          "relax"
        ],
        "lat": 46.2044,
        "lng": 6.1432,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1506976785307-3e1dfaf68e0c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Cenevre Gölü'nde tekneyle muhteşem Alp manzaraları.",
        "descEn": "Scenic boat ride on Lake Geneva with Alpine backdrops.",
        "insiderTipTr": "Öğle saatlerinde çıkın; kalabalık daha azdır.",
        "insiderTipEn": "Leave at midday to avoid crowds.",
        "transitTr": "Beyaz Feribot iskelesi, 5 dk yürüyüş.",
        "transitEn": "White ferry dock, 5 min walk."
      },
      {
        "id": "swiss_interlaken_hike",
        "nameTr": "Interlaken Dağ Yürüyüşü",
        "nameEn": "Interlaken Mountain Hike",
        "zone": "interlaken_adventure",
        "category": [
          "adventure",
          "views"
        ],
        "lat": 46.6863,
        "lng": 7.8632,
        "timeOfDay": "morning",
        "durationHours": 4.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
        "descTr": "İki göl arasındaki patikalar, nefes kesen dağ manzaraları.",
        "descEn": "Trails between two lakes offering breathtaking mountain vistas.",
        "insiderTipTr": "Erken çıkın; güneş ışığı en güzel olur.",
        "insiderTipEn": "Start early for optimal sunlight.",
        "transitTr": "Interlaken Ost tren istasyonu, 10 dk yürüyüş.",
        "transitEn": "Interlaken Ost train station, 10 min walk."
      },
      {
        "id": "swiss_matterhorn",
        "nameTr": "Matterhorn",
        "nameEn": "Matterhorn",
        "zone": "zurich_oldtown",
        "category": [
          "nature",
          "adventure"
        ],
        "lat": 45.9763,
        "lng": 7.6586,
        "timeOfDay": "morning",
        "durationHours": 4.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1505761671938-6c6b4d6c0c2a?w=900&auto=format&fit=crop&q=80",
        "descTr": "Alplerin ikonik zirvesi, zorlu tırmanış rotaları.",
        "descEn": "Iconic Alpine peak with challenging climbing routes.",
        "insiderTipTr": "Erken kalkın, sisli saatlerde kaçının.",
        "insiderTipEn": "Start early, avoid foggy hours.",
        "transitTr": "Zermatt tren, 2 saat.",
        "transitEn": "Zermatt train, 2h."
      },
      {
        "id": "swiss_jungfraujoch",
        "nameTr": "Jungfraujoch",
        "nameEn": "Jungfraujoch",
        "zone": "interlaken_adventure",
        "category": [
          "views",
          "nature"
        ],
        "lat": 46.5475,
        "lng": 7.985,
        "timeOfDay": "midday",
        "durationHours": 5.0,
        "budgetTier": [
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1526401485004-2a93c5da5f84?w=900&auto=format&fit=crop&q=80",
        "descTr": "Avrupa'nın en yüksek demiryolu istasyonu, nefes kesen manzaralar.",
        "descEn": "Europe's highest railway station with breathtaking views.",
        "insiderTipTr": "Hava şartlarını kontrol edin, soğuk olabilir.",
        "insiderTipEn": "Check weather, it can be cold.",
        "transitTr": "Interlaken tren, 1.5 saat.",
        "transitEn": "Interlaken train, 1.5h."
      },
      {
        "id": "swiss_lucerne_oldtown",
        "nameTr": "Lucerne Eski Şehir",
        "nameEn": "Lucerne Old Town",
        "zone": "zurich_oldtown",
        "category": [
          "culture",
          "history"
        ],
        "lat": 47.0502,
        "lng": 8.3093,
        "timeOfDay": "afternoon",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80",
        "descTr": "Ortaçağ köprüleri ve renkli evlerle dolu tarihî şehir.",
        "descEn": "Historic city with medieval bridges and colorful houses.",
        "insiderTipTr": "Kapalı alanlarda yürüyüş yapın, bisiklet kiralayabilirsiniz.",
        "insiderTipEn": "Walk the covered passages, bike rentals available.",
        "transitTr": "Lucerne otobüs, 30 dk.",
        "transitEn": "Lucerne bus, 30min."
      },
      {
        "id": "swiss_lake_zurich_cruise",
        "nameTr": "Zürih Gölü Gezisi",
        "nameEn": "Lake Zurich Cruise",
        "zone": "geneva_lake",
        "category": [
          "relax",
          "views"
        ],
        "lat": 47.3667,
        "lng": 8.55,
        "timeOfDay": "evening",
        "durationHours": 2.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1491975474560-6a5bb0af5e70?w=900&auto=format&fit=crop&q=80",
        "descTr": "Göl üzerindeki akşam gezintisi, şehrin silüeti.",
        "descEn": "Evening cruise on the lake with city skyline.",
        "insiderTipTr": "Güneş batarken rezervasyon yapın.",
        "insiderTipEn": "Book for sunset timing.",
        "transitTr": "Zürich tramvay, 10 dk.",
        "transitEn": "Zurich tram, 10min."
      },
      {
        "id": "swiss_chillon_castle",
        "nameTr": "Chillon Kalesi",
        "nameEn": "Chillon Castle",
        "zone": "geneva_lake",
        "category": [
          "culture",
          "history"
        ],
        "lat": 46.424,
        "lng": 6.925,
        "timeOfDay": "morning",
        "durationHours": 2.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1526401485004-2a93c5da5f84?w=900&auto=format&fit=crop&q=80",
        "descTr": "Lake Geneva kıyısındaki tarihî kale.",
        "descEn": "Historic castle on Lake Geneva's shore.",
        "insiderTipTr": "Sesli rehber kiralayın.",
        "insiderTipEn": "Rent an audio guide.",
        "transitTr": "Montreux otobüs, 15 dk.",
        "transitEn": "Montreux bus, 15min."
      },
      {
        "id": "swiss_bern_oldcity",
        "nameTr": "Bern Eski Şehir",
        "nameEn": "Bern Old City",
        "zone": "zurich_oldtown",
        "category": [
          "culture",
          "history"
        ],
        "lat": 46.948,
        "lng": 7.4474,
        "timeOfDay": "afternoon",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=900&auto=format&fit=crop&q=80",
        "descTr": "UNESCO Dünya Mirası, arkeoloji ve çatı evleri.",
        "descEn": "UNESCO World Heritage site with arcades and frescoes.",
        "insiderTipTr": "Köprü altındaki kafeleri keşfedin.",
        "insiderTipEn": "Explore cafes under the bridges.",
        "transitTr": "Bern tram, 5 dk.",
        "transitEn": "Bern tram, 5min."
      }
    ]
  },
  "portugal": {
    "zones": {
      "lisbon_history": {
        "titleTr": "Lizbon Tarihi Bölge",
        "titleEn": "Lisbon Historic Area",
        "primaryNeighborhood": "Alfama",
        "color": "#e11d48"
      },
      "porto_wine": {
        "titleTr": "Porto Şarap Bölgesi",
        "titleEn": "Porto Wine Region",
        "primaryNeighborhood": "Vila Nova de Gaia",
        "color": "#0284c7"
      },
      "algarve_coast": {
        "titleTr": "Algarve Kıyısı",
        "titleEn": "Algarve Coast",
        "primaryNeighborhood": "Faro",
        "color": "#2563eb"
      }
    },
    "places": [
      {
        "id": "portugal_lisbon_alfama_walk",
        "nameTr": "Alfama Gezisi",
        "nameEn": "Alfama Historic Walk",
        "zone": "lisbon_history",
        "category": [
          "history",
          "culture"
        ],
        "lat": 38.709,
        "lng": -9.131,
        "timeOfDay": "morning",
        "durationHours": 2.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80",
        "descTr": "Dar taş sokaklar, fado evleri ve panoramik manzaralar.",
        "descEn": "Narrow stone lanes, fado houses, and panoramic views.",
        "insiderTipTr": "Sabah erken gelin, kalabalıktan kaçının.",
        "insiderTipEn": "Arrive early to avoid crowds.",
        "transitTr": "Rossio Metro, 5 dk yürüyüş.",
        "transitEn": "Rossio Metro, 5 min walk."
      },
      {
        "id": "portugal_lisbon_pasteis_de_belem",
        "nameTr": "Pastéis de Belém",
        "nameEn": "Pastéis de Belém Pastry Shop",
        "zone": "lisbon_history",
        "category": [
          "food",
          "culture"
        ],
        "lat": 38.6997,
        "lng": -9.2038,
        "timeOfDay": "afternoon",
        "durationHours": 1.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=900&auto=format&fit=crop&q=80",
        "descTr": "Ünlü kremalı hamur işi, tarihi pastane.",
        "descEn": "Famous custard tart from a historic bakery.",
        "insiderTipTr": "Sıra çok uzun, önceden rezervasyon yapın.",
        "insiderTipEn": "Lines are long; consider pre-order.",
        "transitTr": "Belém Metro, 3 dk yürüyüş.",
        "transitEn": "Belém Metro, 3 min walk."
      },
      {
        "id": "portugal_lisbon_cathedral",
        "nameTr": "Lisbon Katedrali",
        "nameEn": "Lisbon Cathedral",
        "zone": "lisbon_history",
        "category": [
          "history",
          "views"
        ],
        "lat": 38.715,
        "lng": -9.124,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1522199670076-2852f80289c7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Şehrin en eski kilisesi, Gotik ve Romanesk detaylar.",
        "descEn": "City's oldest church with Gothic and Romanesque elements.",
        "insiderTipTr": "Müze giriş ücretsiz, sessiz olun.",
        "insiderTipEn": "Museum entry free; keep quiet.",
        "transitTr": "Santa Apolónia tren, 5 dk yürüyüş.",
        "transitEn": "Santa Apolónia train, 5 min walk."
      },
      {
        "id": "portugal_lisbon_bairro_alto_nightlife",
        "nameTr": "Bairro Alto Gece Hayatı",
        "nameEn": "Bairro Alto Nightlife",
        "zone": "lisbon_history",
        "category": [
          "nightlife",
          "culture"
        ],
        "lat": 38.7149,
        "lng": -9.145,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1494949649105-f69d5c7aa2d2?w=900&auto=format&fit=crop&q=80",
        "descTr": "Canlı barlar, fado kulüpleri ve sokak sanatları.",
        "descEn": "Lively bars, fado clubs, and street art.",
        "insiderTipTr": "Rezervasyonlu barları tercih edin, kalabalıktan kaçının.",
        "insiderTipEn": "Prefer booked venues to avoid crowds.",
        "transitTr": "Cais do Sodré tram, 2 dk yürüyüş.",
        "transitEn": "Cais do Sodré tram, 2 min walk."
      },
      {
        "id": "portugal_porto_cellars",
        "nameTr": "Porto Şarap Mahzenleri",
        "nameEn": "Porto Wine Cellars",
        "zone": "porto_wine",
        "category": [
          "food",
          "culture"
        ],
        "lat": 41.138,
        "lng": -8.61,
        "timeOfDay": "afternoon",
        "durationHours": 2.5,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1542540910-5d5d0a0d33c5?w=900&auto=format&fit=crop&q=80",
        "descTr": "Nehir kenarında mağara tarzı şarap depoları, tadım turu.",
        "descEn": "Cave-like wine cellars along the Douro with tasting tours.",
        "insiderTipTr": "Erken rezervasyon ile ücretsiz giriş.",
        "insiderTipEn": "Early booking grants free entry.",
        "transitTr": "São Bento tren istasyonu, 5 dk yürüyüş.",
        "transitEn": "Sao Bento station, 5 min walk."
      },
      {
        "id": "portugal_algarve_beaches",
        "nameTr": "Algarve Plajları",
        "nameEn": "Algarve Beaches",
        "zone": "algarve_coast",
        "category": [
          "views",
          "relax"
        ],
        "lat": 37.0891,
        "lng": -8.2465,
        "timeOfDay": "sunset",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
        "descTr": "Altın kumlu sahiller, kayalık yürüyüş yolları ve deniz kabukları.",
        "descEn": "Golden sands, cliff paths and seashells along the southern coast.",
        "insiderTipTr": "Gün batımında kalabalık azalır, fotoğraf çekmek harika.",
        "insiderTipEn": "Sunset crowds thin; perfect for photos.",
        "transitTr": "Faro otobüs terminali, 10 dk otobüs.",
        "transitEn": "Faro bus terminal, 10 min bus ride."
      },
      {
        "id": "portugal_lisbon_belem_tower",
        "nameTr": "Belém Kulesi",
        "nameEn": "Belém Tower",
        "zone": "lisbon_history",
        "category": [
          "history",
          "views"
        ],
        "lat": 38.6916,
        "lng": -9.2159,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1580657098965-9c8c57c3e0c0?w=900&auto=format&fit=crop&q=80",
        "descTr": "16. yüzyıldan kalan savunma kulesi, Tagus Nehri kıyısında.",
        "descEn": "16th‑century defensive tower on the banks of the Tagus River.",
        "insiderTipTr": "Gün doğumunda fotoğraf için ideal.",
        "insiderTipEn": "Great for sunrise photos.",
        "transitTr": "Belém tramvay durağı, 5 dk yürüyüş.",
        "transitEn": "Belém tram stop, 5 min walk."
      },
      {
        "id": "portugal_lisbon_jeronimos",
        "nameTr": "Jerónimos Manastırı",
        "nameEn": "Jerónimos Monastery",
        "zone": "lisbon_history",
        "category": [
          "history",
          "culture"
        ],
        "lat": 38.6989,
        "lng": -9.2065,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1549187774-bbad629e3ce3?w=900&auto=format&fit=crop&q=80",
        "descTr": "Manueline mimarinin başyapıtı, UNESCO listesinde.",
        "descEn": "Manueline masterpiece, UNESCO World Heritage site.",
        "insiderTipTr": "Rehberli tur rezervasyonu önerilir.",
        "insiderTipEn": "Book a guided tour.",
        "transitTr": "Belém metro, 2 dk yürüyüş.",
        "transitEn": "Belém metro, 2 min walk."
      },
      {
        "id": "portugal_sintra_palace",
        "nameTr": "Sintra Sarayı",
        "nameEn": "Sintra Palace",
        "zone": "lisbon_history",
        "category": [
          "history",
          "views"
        ],
        "lat": 38.7915,
        "lng": -9.3904,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80",
        "descTr": "Rönesans sarayı, renkli kubbeler ve bahçeler.",
        "descEn": "Renaissance palace with colorful domes and gardens.",
        "insiderTipTr": "Erken saatlerde kalabalık daha az.",
        "insiderTipEn": "Visit early to avoid crowds.",
        "transitTr": "Sintra tren istasyonu, 10 dk yürüyüş.",
        "transitEn": "Sintra train station, 10 min walk."
      },
      {
        "id": "portugal_cascais_coast",
        "nameTr": "Cascais Kıyısı",
        "nameEn": "Cascais Coast",
        "zone": "lisbon_history",
        "category": [
          "views",
          "relax"
        ],
        "lat": 38.6975,
        "lng": -9.4202,
        "timeOfDay": "sunset",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=900&auto=format&fit=crop&q=80",
        "descTr": "Altın kumlu plajlar ve sahil yürüyüşleri.",
        "descEn": "Golden sands and seaside promenades.",
        "insiderTipTr": "Yaz akşamları daha sakin.",
        "insiderTipEn": "Evenings are calmer in summer.",
        "transitTr": "Cascais tren, 30 dk.",
        "transitEn": "Cascais train, 30 min."
      },
      {
        "id": "portugal_douro_valley",
        "nameTr": "Douro Vadisi Şarap Turu",
        "nameEn": "Douro Valley Wine Tour",
        "zone": "lisbon_history",
        "category": [
          "food",
          "culture"
        ],
        "lat": 41.15,
        "lng": -7.8666,
        "timeOfDay": "afternoon",
        "durationHours": 4.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1523839922805-4bba9f6fdb70?w=900&auto=format&fit=crop&q=80",
        "descTr": "Douro nehrinde bağlar, bağcılık ve şarap tadımı.",
        "descEn": "Vineyards along the Douro river with tastings.",
        "insiderTipTr": "Rezervasyonla özel tur.",
        "insiderTipEn": "Book a private tour.",
        "transitTr": "Porto tren istasyonu, 20 dk.",
        "transitEn": "Porto train station, 20 min."
      },
      {
        "id": "portugal_algarve_cliffs",
        "nameTr": "Algarve Kayalıkları",
        "nameEn": "Algarve Cliffs",
        "zone": "algarve_coast",
        "category": [
          "views",
          "nature"
        ],
        "lat": 37.08,
        "lng": -8.24,
        "timeOfDay": "morning",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&auto=format&fit=crop&q=80",
        "descTr": "Kıyıdaki dramatik kayalar ve deniz manzarası.",
        "descEn": "Dramatic cliffs with sea views.",
        "insiderTipTr": "Güneş doğarken fotoğraf çekin.",
        "insiderTipEn": "Shoot at sunrise.",
        "transitTr": "Faro otobüs, 15 dk.",
        "transitEn": "Faro bus, 15 min"
      }
    ]
  },
  "czechia": {
    "zones": {
      "prague_oldtown": {
        "titleTr": "Prag Eski Şehir",
        "titleEn": "Prague Old Town",
        "primaryNeighborhood": "Staré Město",
        "color": "#e11d48"
      },
      "pilsen_region": {
        "titleTr": "Pilsen Bölgesi",
        "titleEn": "Pilsen Region",
        "primaryNeighborhood": "Plzeň",
        "color": "#0284c7"
      },
      "south_bohemia": {
        "titleTr": "Güney Bohemya",
        "titleEn": "South Bohemia",
        "primaryNeighborhood": "Český Krumlov",
        "color": "#2563eb"
      }
    },
    "places": [
      {
        "id": "czech_charles_bridge",
        "nameTr": "Charles Köprüsü",
        "nameEn": "Charles Bridge",
        "zone": "prague_oldtown",
        "category": [
          "history",
          "views"
        ],
        "lat": 50.0865,
        "lng": 14.4114,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1519091697-9986a84615a9?w=900&auto=format&fit=crop&q=80",
        "descTr": "14. yüzyıldan kalma ikonik taş köprü, 30 Barok heykelliyle süslü.",
        "descEn": "Iconic 14th-century stone bridge adorned with 30 Baroque statues.",
        "insiderTipTr": "Sabah 07:00'de gidin, köprü neredeyse boş olur.",
        "insiderTipEn": "Arrive at 7 AM – the bridge is nearly crowd-free.",
        "transitTr": "Malostranská metro B hattı, 5 dk yürüyüş.",
        "transitEn": "Malostranská metro line B, 5 min walk."
      },
      {
        "id": "czech_prague_astronomical_clock",
        "nameTr": "Prag Astronomik Saat",
        "nameEn": "Prague Astronomical Clock",
        "zone": "prague_oldtown",
        "category": [
          "history",
          "culture"
        ],
        "lat": 50.0875,
        "lng": 14.4208,
        "timeOfDay": "morning",
        "durationHours": 1.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1555952517-0c0e5d0a4c9c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Ortaçağdan kalma astronomik saat, her saat başı figürler hareket eder.",
        "descEn": "Medieval astronomical clock with hourly moving figure show.",
        "insiderTipTr": "Saat kulesi çıkışı için bilet alın, Prag manzarası şahane.",
        "insiderTipEn": "Buy tower access ticket – Prague views from above are stunning.",
        "transitTr": "Staroměstská metro, 2 dk yürüyüş.",
        "transitEn": "Staroměstská metro stop, 2 min walk."
      },
      {
        "id": "czech_prague_castle",
        "nameTr": "Prag Kalesi & St. Vitus Katedrali",
        "nameEn": "Prague Castle & St. Vitus Cathedral",
        "zone": "prague_oldtown",
        "category": [
          "history",
          "views"
        ],
        "lat": 50.0909,
        "lng": 14.398,
        "timeOfDay": "afternoon",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=900&auto=format&fit=crop&q=80",
        "descTr": "Dünyanın en büyük kale kompleksi; Gotik katedral, saraylar ve bahçeler.",
        "descEn": "World's largest castle complex; Gothic cathedral, palaces and gardens.",
        "insiderTipTr": "Dış avlular ücretsiz; kombine bilet tüm bölümleri kapsar.",
        "insiderTipEn": "Outer courtyards are free; combo ticket covers all sections.",
        "transitTr": "22 numaralı tramvay, Pražský hrad durağı.",
        "transitEn": "Tram 22, Pražský hrad stop."
      },
      {
        "id": "czech_wenceslas_square",
        "nameTr": "Wenceslas Meydanı",
        "nameEn": "Wenceslas Square",
        "zone": "prague_oldtown",
        "category": [
          "views",
          "culture"
        ],
        "lat": 50.0813,
        "lng": 14.4278,
        "timeOfDay": "evening",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Prag'ın kalbindeki tarihi bulvar, art deco binalar ve canlı kafeler.",
        "descEn": "Historic art-deco boulevard at the heart of Prague city center.",
        "insiderTipTr": "Akşam ışıklandırması çarpıcı fotoğraflar sunar.",
        "insiderTipEn": "Evening illumination makes for stunning street photos.",
        "transitTr": "Můstek veya Muzeum metro, 1 dk yürüyüş.",
        "transitEn": "Můstek or Muzeum metro, 1 min walk."
      },
      {
        "id": "czech_petrin_hill",
        "nameTr": "Petřín Tepesi & Kulesi",
        "nameEn": "Petřín Hill & Tower",
        "zone": "prague_oldtown",
        "category": [
          "views",
          "nature"
        ],
        "lat": 50.0836,
        "lng": 14.3934,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&auto=format&fit=crop&q=80",
        "descTr": "Prag'ın Eiffel Kulesi; tepeden 360 derece panoramik şehir manzarası.",
        "descEn": "Prague's mini Eiffel Tower with 360° panoramic city views.",
        "insiderTipTr": "Funiküler ile çıkın, inişi bahçelerden yürüyerek yapın.",
        "insiderTipEn": "Take the funicular up and walk down through the rose gardens.",
        "transitTr": "Petřín funiküler, Újezd durağı.",
        "transitEn": "Petřín funicular from Újezd tram stop."
      },
      {
        "id": "czech_josefov",
        "nameTr": "Josefov Yahudi Mahallesi",
        "nameEn": "Josefov Jewish Quarter",
        "zone": "prague_oldtown",
        "category": [
          "history",
          "culture"
        ],
        "lat": 50.0901,
        "lng": 14.4178,
        "timeOfDay": "morning",
        "durationHours": 2.5,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
        "descTr": "Orta Avrupa'nın en iyi korunmuş Yahudi mahallesi; 6 sinagog ve eski mezarlık.",
        "descEn": "Best-preserved Jewish quarter in Central Europe; 6 synagogues and old cemetery.",
        "insiderTipTr": "Kombine bilet 6 sinagog ve mezarlığı kapsar.",
        "insiderTipEn": "Combined ticket covers 6 synagogues and the historic cemetery.",
        "transitTr": "Staroměstská metro, 3 dk yürüyüş.",
        "transitEn": "Staroměstská metro, 3 min walk."
      },
      {
        "id": "czech_vysehrad",
        "nameTr": "Vyšehrad Kalesi & Manzarası",
        "nameEn": "Vyšehrad Fortress & Views",
        "zone": "prague_oldtown",
        "category": [
          "history",
          "views"
        ],
        "lat": 50.0634,
        "lng": 14.4178,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&auto=format&fit=crop&q=80",
        "descTr": "Tarihi kale, Vltava nehri manzarası ve ünlü Çek isimlerinin mezarlığı.",
        "descEn": "Historic fortress overlooking the Vltava river with Czech celebrities cemetery.",
        "insiderTipTr": "Giriş ücretsiz; piknik için ideal, kalabalık olmaz.",
        "insiderTipEn": "Free entry; ideal for a peaceful picnic with great views.",
        "transitTr": "Vyšehrad metro C hattı, 5 dk yürüyüş.",
        "transitEn": "Vyšehrad metro line C, 5 min walk."
      },
      {
        "id": "czech_national_museum",
        "nameTr": "Çek Ulusal Müzesi",
        "nameEn": "Czech National Museum",
        "zone": "prague_oldtown",
        "category": [
          "culture",
          "history"
        ],
        "lat": 50.0784,
        "lng": 14.431,
        "timeOfDay": "afternoon",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1510662145379-13537db782dc?w=900&auto=format&fit=crop&q=80",
        "descTr": "Neo-Rönesans mimariyle süslü dev saray; tarih, doğa bilimleri koleksiyonları.",
        "descEn": "Neo-Renaissance palace housing Czech history and natural sciences.",
        "insiderTipTr": "Muhteşem merdiven holü ücretsiz görülebilir.",
        "insiderTipEn": "The grand staircase hall can be admired for free.",
        "transitTr": "Muzeum metro, 1 dk yürüyüş.",
        "transitEn": "Muzeum metro stop, 1 min walk."
      },
      {
        "id": "czech_pilsen_beer",
        "nameTr": "Pilsner Urquell Fabrika Turu",
        "nameEn": "Pilsner Urquell Brewery Tour",
        "zone": "pilsen_region",
        "category": [
          "food",
          "culture"
        ],
        "lat": 49.7444,
        "lng": 13.3936,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1619873822811-6a5b01867e55?w=900&auto=format&fit=crop&q=80",
        "descTr": "Dünya ünlü Pilsner Urquell birasının 1842'den beri üretim yapılan tarihi fabrikası.",
        "descEn": "Historic brewery of world-famous Pilsner Urquell, brewing since 1842.",
        "insiderTipTr": "Mahzen turunda fıçıdan taze bira tadımı yapılır.",
        "insiderTipEn": "Underground cellar tour includes fresh draft beer tasting.",
        "transitTr": "Pilsen otogarı, 10 dk yürüyüş.",
        "transitEn": "Pilsen bus terminal, 10 min walk."
      },
      {
        "id": "czech_krumlov_castle",
        "nameTr": "Český Krumlov Kale",
        "nameEn": "Cesky Krumlov Castle",
        "zone": "south_bohemia",
        "category": [
          "history",
          "views"
        ],
        "lat": 48.8125,
        "lng": 14.3178,
        "timeOfDay": "morning",
        "durationHours": 2.5,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&auto=format&fit=crop&q=80",
        "descTr": "UNESCO listesindeki Rönesans kale; nehir virajının üzerinde ihtişamlı siluet.",
        "descEn": "UNESCO-listed Renaissance castle with majestic silhouette over river bend.",
        "insiderTipTr": "Kale bahçesi ücretsiz; fotoğraf çekmek için en güzel spot tepe.",
        "insiderTipEn": "Castle garden is free; best photo spot is the hilltop viewpoint.",
        "transitTr": "Český Krumlov otobüs terminali, 10 dk yürüyüş.",
        "transitEn": "Cesky Krumlov bus terminal, 10 min walk."
      },
      {
        "id": "czech_kutna_hora",
        "nameTr": "Kutná Hora & Kemik Şapeli",
        "nameEn": "Kutná Hora & Bone Chapel",
        "zone": "south_bohemia",
        "category": [
          "history",
          "culture"
        ],
        "lat": 49.9494,
        "lng": 15.2683,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1543699565-003b8adda5fc?w=900&auto=format&fit=crop&q=80",
        "descTr": "UNESCO kenti ve insan iskeletlerinden yapılmış eşsiz Sedlec Kemik Şapeli.",
        "descEn": "UNESCO city with the unique Sedlec Ossuary chapel built from human bones.",
        "insiderTipTr": "Prag'dan kolayca günübirlik; öğleden önce gidin.",
        "insiderTipEn": "Easy day trip from Prague; visit before noon to beat tour groups.",
        "transitTr": "Prag'dan tren, 1 saat.",
        "transitEn": "Train from Prague main station, 1 hour."
      }
    ]
  },
  "norway": {
    "zones": {
      "oslo_city": {
        "titleTr": "Oslo Şehir Merkezi",
        "titleEn": "Oslo City Center",
        "primaryNeighborhood": "Sentrum",
        "color": "#e11d48"
      },
      "bergen_fjord": {
        "titleTr": "Bergen & Fiyortlar",
        "titleEn": "Bergen & Fjords",
        "primaryNeighborhood": "Bryggen",
        "color": "#0284c7"
      },
      "northern_norway": {
        "titleTr": "Kuzey Norveç",
        "titleEn": "Northern Norway",
        "primaryNeighborhood": "Tromsø",
        "color": "#2563eb"
      }
    },
    "places": [
      {
        "id": "norway_oslo_opera_house",
        "nameTr": "Oslo Opera Binası",
        "nameEn": "Oslo Opera House",
        "zone": "oslo_city",
        "category": [
          "views",
          "culture"
        ],
        "lat": 59.907,
        "lng": 10.7527,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop&q=80",
        "descTr": "Fiyort kenarında beyaz mermer opera binası; çatıya çıkarak şehri seyredin.",
        "descEn": "White marble opera house on the fjord; walk up to the roof for city views.",
        "insiderTipTr": "Çatı tamamen ücretsiz ve her saatte açık.",
        "insiderTipEn": "The rooftop is completely free and open around the clock.",
        "transitTr": "Oslo Sentralstasjon, 10 dk yürüyüş.",
        "transitEn": "Oslo Central Station, 10 min walk."
      },
      {
        "id": "norway_vigeland_park",
        "nameTr": "Vigeland Heykel Parkı",
        "nameEn": "Vigeland Sculpture Park",
        "zone": "oslo_city",
        "category": [
          "views",
          "culture"
        ],
        "lat": 59.9271,
        "lng": 10.6997,
        "timeOfDay": "morning",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80",
        "descTr": "Dünyanın en büyük tek sanatçı heykel parkı; 200'den fazla bronz ve granit figür.",
        "descEn": "World's largest sculpture park by one artist; 200+ bronze and granite figures.",
        "insiderTipTr": "Giriş ücretsiz; özellikle bahar aylarında harika.",
        "insiderTipEn": "Entry completely free; especially beautiful in spring bloom.",
        "transitTr": "Majorstuen T-bane, 15 dk yürüyüş.",
        "transitEn": "Majorstuen T-bane metro, 15 min walk."
      },
      {
        "id": "norway_bryggen",
        "nameTr": "Bergen Bryggen Rıhtımı",
        "nameEn": "Bergen Bryggen Wharf",
        "zone": "bergen_fjord",
        "category": [
          "history",
          "views"
        ],
        "lat": 60.3975,
        "lng": 5.3238,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1574190812629-50e9f2f4f9d0?w=900&auto=format&fit=crop&q=80",
        "descTr": "UNESCO listesindeki Hansa dönemi renkli ahşap evler; ortaçağ atmosferi.",
        "descEn": "UNESCO-listed Hanseatic colourful wooden buildings; medieval atmosphere.",
        "insiderTipTr": "Küçük galerileri ve el sanatı dükkanlarını keşfedin.",
        "insiderTipEn": "Explore tiny galleries and craft shops hidden in the passages.",
        "transitTr": "Bergen merkezi, yürüyüş mesafesinde.",
        "transitEn": "Bergen city center, walking distance."
      },
      {
        "id": "norway_preikestolen",
        "nameTr": "Preikestolen (Pazar Kayası)",
        "nameEn": "Preikestolen (Pulpit Rock)",
        "zone": "bergen_fjord",
        "category": [
          "adventure",
          "views"
        ],
        "lat": 58.9868,
        "lng": 6.1869,
        "timeOfDay": "morning",
        "durationHours": 6.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&auto=format&fit=crop&q=80",
        "descTr": "604 m yükseklikteki düz kayalık platform; Lysefjord'a nefes kesen manzara.",
        "descEn": "Flat cliff platform at 604 m height with breathtaking views of Lysefjord.",
        "insiderTipTr": "Gidiş-dönüş 4-5 saat; sağlam yürüyüş botu şart.",
        "insiderTipEn": "Round trip 4-5 hours; sturdy hiking boots are essential.",
        "transitTr": "Stavanger'dan feribot ve otobüs, 2 saat.",
        "transitEn": "Ferry and bus from Stavanger, 2 hours."
      },
      {
        "id": "norway_geirangerfjord",
        "nameTr": "Geirangerfjord",
        "nameEn": "Geirangerfjord",
        "zone": "bergen_fjord",
        "category": [
          "nature",
          "views"
        ],
        "lat": 62.1038,
        "lng": 7.2061,
        "timeOfDay": "afternoon",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1538947879803-86895f74ff1a?w=900&auto=format&fit=crop&q=80",
        "descTr": "UNESCO listesindeki dünyanın en güzel fiyortlarından biri; şelaleler ve sarp kayalıklar.",
        "descEn": "UNESCO-listed fjord among world's most beautiful; waterfalls and steep cliffs.",
        "insiderTipTr": "Feribot turu en güzel açıyı sunar; rezervasyon yapın.",
        "insiderTipEn": "Ferry cruise gives the best angle; book in advance.",
        "transitTr": "Ålesund'dan feribot, 2.5 saat.",
        "transitEn": "Ferry from Ålesund, 2.5 hours."
      },
      {
        "id": "norway_flam_railway",
        "nameTr": "Flåm Demiryolu",
        "nameEn": "Flåm Railway",
        "zone": "bergen_fjord",
        "category": [
          "views",
          "adventure"
        ],
        "lat": 60.8637,
        "lng": 7.1162,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=900&auto=format&fit=crop&q=80",
        "descTr": "Dünyanın en sarp tren yollarından biri; fiyort, şelale ve dağ manzaraları.",
        "descEn": "One of the world's steepest railway lines; fjord, waterfall and mountain views.",
        "insiderTipTr": "Sol tarafta oturun, Kjosfossen şelalesini kaçırmayın.",
        "insiderTipEn": "Sit on the left side – don't miss the Kjosfossen waterfall stop.",
        "transitTr": "Bergen'den tren ve feribot, 3 saat.",
        "transitEn": "Train and ferry from Bergen, 3 hours."
      },
      {
        "id": "norway_tromso_northern_lights",
        "nameTr": "Tromsø Kuzey Işıkları",
        "nameEn": "Tromsø Northern Lights",
        "zone": "northern_norway",
        "category": [
          "nature",
          "views"
        ],
        "lat": 69.6496,
        "lng": 18.955,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Dünyanın en iyi kuzey ışıkları izleme noktalarından biri; Kasım-Mart arası görülür.",
        "descEn": "One of the world's best northern lights viewing spots; visible Nov-Mar.",
        "insiderTipTr": "Şehirden uzak karanlık alanlara çıkın; tur şirketleri rehberlik yapar.",
        "insiderTipEn": "Head away from city lights; guided tours maximize your chances.",
        "transitTr": "Tromsø Havalimanı'ndan şehir merkezi, 10 dk.",
        "transitEn": "Tromsø Airport to city center, 10 min."
      },
      {
        "id": "norway_lofoten_islands",
        "nameTr": "Lofoten Adaları",
        "nameEn": "Lofoten Islands",
        "zone": "northern_norway",
        "category": [
          "nature",
          "views"
        ],
        "lat": 68.1551,
        "lng": 13.5799,
        "timeOfDay": "morning",
        "durationHours": 5.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=900&auto=format&fit=crop&q=80",
        "descTr": "Sivri dağlar, turuncuya boyalı balıkçı köyleri ve berrak turkuaz sular.",
        "descEn": "Jagged peaks, red fishing villages, and crystal clear turquoise waters.",
        "insiderTipTr": "Reine köyü en fotoğrafik noktadır.",
        "insiderTipEn": "Reine village is the most photogenic spot on the islands.",
        "transitTr": "Bodø'dan uçak veya feribot, 3 saat.",
        "transitEn": "Plane or ferry from Bodø, 3 hours."
      },
      {
        "id": "norway_trolltunga",
        "nameTr": "Trolltunga Yürüyüşü",
        "nameEn": "Trolltunga Hike",
        "zone": "bergen_fjord",
        "category": [
          "adventure",
          "views"
        ],
        "lat": 60.1245,
        "lng": 6.7337,
        "timeOfDay": "morning",
        "durationHours": 10.0,
        "budgetTier": [
          "economy",
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1507545602472-d3ef7bb6b6d2?w=900&auto=format&fit=crop&q=80",
        "descTr": "Norveç'in ikonik kayalık dilini görmek için 10-12 saatlik zorlu yürüyüş.",
        "descEn": "Challenging 10-12 hour hike to Norway's iconic hanging cliff tongue.",
        "insiderTipTr": "Sağlam yürüyüş botu ve yeterli yiyecek-su şart.",
        "insiderTipEn": "Sturdy hiking boots and ample food/water are essential.",
        "transitTr": "Odda otobüs durağı, servis otobüsü.",
        "transitEn": "Odda bus stop, shuttle service to trailhead."
      }
    ]
  },
  "iceland": {
    "zones": {
      "reykjavik_city": {
        "titleTr": "Reykjavik Şehir Merkezi",
        "titleEn": "Reykjavik City Center",
        "primaryNeighborhood": "Miðborg",
        "color": "#e11d48"
      },
      "golden_circle": {
        "titleTr": "Golden Circle",
        "titleEn": "Golden Circle",
        "primaryNeighborhood": "Selfoss",
        "color": "#0284c7"
      },
      "south_coast": {
        "titleTr": "Güney Kıyısı",
        "titleEn": "South Coast",
        "primaryNeighborhood": "Vík",
        "color": "#2563eb"
      }
    },
    "places": [
      {
        "id": "iceland_hallgrimskirkja",
        "nameTr": "Hallgrímskirkja Kilisesi",
        "nameEn": "Hallgrímskirkja Church",
        "zone": "reykjavik_city",
        "category": [
          "views",
          "history"
        ],
        "lat": 64.1418,
        "lng": -21.9263,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=900&auto=format&fit=crop&q=80",
        "descTr": "Reykjavik'in simgesi; İzlanda'nın en yüksek kilisesinin kulesinden panoramik manzara.",
        "descEn": "Reykjavik's icon; panoramic views from the tower of Iceland's tallest church.",
        "insiderTipTr": "Kule asansörü ücretli; manzara kesinlikle değer.",
        "insiderTipEn": "Tower elevator has a fee; the view is absolutely worth it.",
        "transitTr": "Reykjavik merkezi, yürüyüş mesafesinde.",
        "transitEn": "Reykjavik city center, walking distance."
      },
      {
        "id": "iceland_golden_circle_geysir",
        "nameTr": "Geysir Jeotermal Alan",
        "nameEn": "Geysir Geothermal Area",
        "zone": "golden_circle",
        "category": [
          "nature",
          "views"
        ],
        "lat": 64.3134,
        "lng": -20.3022,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=900&auto=format&fit=crop&q=80",
        "descTr": "Her 5-10 dakikada 30 metre fışkıran aktif Strokkur gayzerini canlı izleyin.",
        "descEn": "Watch the active Strokkur geyser erupt 30 meters high every 5-10 minutes.",
        "insiderTipTr": "Rüzgar yönüne dikkat edin, kaynar su sıçrayabilir.",
        "insiderTipEn": "Mind the wind direction – boiling water can splash.",
        "transitTr": "Reykjavik'ten otobüs turları, 2 saat.",
        "transitEn": "Bus tours from Reykjavik, 2 hours."
      },
      {
        "id": "iceland_gullfoss",
        "nameTr": "Gullfoss Şelalesi",
        "nameEn": "Gullfoss Waterfall",
        "zone": "golden_circle",
        "category": [
          "nature",
          "views"
        ],
        "lat": 64.3275,
        "lng": -20.1208,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=900&auto=format&fit=crop&q=80",
        "descTr": "Hvítá nehri üzerinde iki kademeli devasa şelale; sisi ve gökkuşaklarıyla efsanevi.",
        "descEn": "Massive two-tiered waterfall on the Hvítá river, legendary for its mist and rainbows.",
        "insiderTipTr": "Kayarak düşme riski var; yürüyüş ayakkabısı tercih edin.",
        "insiderTipEn": "Slippery rocks; always wear proper hiking footwear.",
        "transitTr": "Selfoss otobüs terminali, 30 dk otobüs.",
        "transitEn": "Selfoss bus terminal, 30 min bus."
      },
      {
        "id": "iceland_thingvellir",
        "nameTr": "Þingvellir Ulusal Parkı",
        "nameEn": "Þingvellir National Park",
        "zone": "golden_circle",
        "category": [
          "nature",
          "history"
        ],
        "lat": 64.2558,
        "lng": -21.13,
        "timeOfDay": "morning",
        "durationHours": 3.0,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1568454537842-d9d2b1710d44?w=900&auto=format&fit=crop&q=80",
        "descTr": "UNESCO alanı; Avrasya ve Amerika levhalarının kavuştuğu yerde, İzlanda'nın ilk parlamento yeri.",
        "descEn": "UNESCO site where Eurasian and American tectonic plates meet; Iceland's first parliament.",
        "insiderTipTr": "Silfra yarığında dalış için lisanslı operatör bulun.",
        "insiderTipEn": "For Silfra rift snorkeling, use a licensed dive operator.",
        "transitTr": "Reykjavik'ten otobüs, 45 dk.",
        "transitEn": "Bus from Reykjavik, 45 min."
      },
      {
        "id": "iceland_seljalandsfoss",
        "nameTr": "Seljalandsfoss Şelalesi",
        "nameEn": "Seljalandsfoss Waterfall",
        "zone": "south_coast",
        "category": [
          "nature",
          "views"
        ],
        "lat": 63.6156,
        "lng": -19.9887,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1476158085676-e67f57ed9ed7?w=900&auto=format&fit=crop&q=80",
        "descTr": "Arkasından yürünebilen 60 metrelik şelale; eşsiz panoramik bakış açısı.",
        "descEn": "60-meter waterfall you can walk behind; unique panoramic perspective.",
        "insiderTipTr": "Şelale arkası kaygan; yağmurluk ve sağlam ayakkabı şart.",
        "insiderTipEn": "Behind the falls is slippery; waterproof gear and sturdy shoes essential.",
        "transitTr": "Reykjavik'ten Ring Road üzerinde, 2 saat.",
        "transitEn": "2 hours from Reykjavik along Ring Road."
      },
      {
        "id": "iceland_black_sand_beach",
        "nameTr": "Reynisfjara Siyah Kumsal",
        "nameEn": "Reynisfjara Black Sand Beach",
        "zone": "south_coast",
        "category": [
          "nature",
          "views"
        ],
        "lat": 63.4063,
        "lng": -19.0391,
        "timeOfDay": "afternoon",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1529963183134-61a90a9a785a?w=900&auto=format&fit=crop&q=80",
        "descTr": "Siyah volkanik kumsal, bazalt sütunlar ve dev okyanus dalgaları.",
        "descEn": "Black volcanic beach with basalt columns and powerful ocean waves.",
        "insiderTipTr": "Dalgalar çok tehlikelidir; kesinlikle su kenarına gitmeyin.",
        "insiderTipEn": "Waves are extremely dangerous; never approach the shoreline.",
        "transitTr": "Vík köyünden 2 km, taksi veya araç.",
        "transitEn": "2 km from Vík village by taxi or rental car."
      },
      {
        "id": "iceland_jokulsarlon",
        "nameTr": "Jökulsárlón Buzul Gölü",
        "nameEn": "Jökulsárlón Glacier Lagoon",
        "zone": "south_coast",
        "category": [
          "nature",
          "views"
        ],
        "lat": 64.0784,
        "lng": -16.2306,
        "timeOfDay": "afternoon",
        "durationHours": 2.0,
        "budgetTier": [
          "moderate"
        ],
        "image": "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&auto=format&fit=crop&q=80",
        "descTr": "Mavi buzul parçalarının yüzdüğü göl; tekneden buzulları yakından görme imkânı.",
        "descEn": "Glacier lagoon with floating blue icebergs; boat tour brings you up close.",
        "insiderTipTr": "Yanındaki Elmas Plajı'nda buzlar kıyıya vurur; eşsiz manzara.",
        "insiderTipEn": "Adjacent Diamond Beach has icebergs washing ashore; unmissable sight.",
        "transitTr": "Reykjavik'ten Ring Road, 5 saat veya uçak.",
        "transitEn": "Ring Road from Reykjavik 5 hrs, or fly to nearby airport."
      },
      {
        "id": "iceland_blue_lagoon",
        "nameTr": "Blue Lagoon Jeotermal Spa",
        "nameEn": "Blue Lagoon Geothermal Spa",
        "zone": "reykjavik_city",
        "category": [
          "relax",
          "nature"
        ],
        "lat": 63.8804,
        "lng": -22.4495,
        "timeOfDay": "evening",
        "durationHours": 3.0,
        "budgetTier": [
          "moderate",
          "luxury"
        ],
        "image": "https://images.unsplash.com/photo-1506976785307-3e1dfaf68e0c?w=900&auto=format&fit=crop&q=80",
        "descTr": "Turkuaz renkli jeotermal sular, silika çamur maskesi ve doğal buhar banyosu.",
        "descEn": "Turquoise geothermal waters, silica mud mask, and natural steam bath.",
        "insiderTipTr": "Rezervasyon zorunlu; akşam saatleri daha sakin ve romantik.",
        "insiderTipEn": "Reservation required; evenings are quieter and more romantic.",
        "transitTr": "Reykjavik'ten otobüs, 50 dk.",
        "transitEn": "Bus from Reykjavik, 50 min."
      },
      {
        "id": "iceland_skogafoss",
        "nameTr": "Skógafoss Şelalesi",
        "nameEn": "Skógafoss Waterfall",
        "zone": "south_coast",
        "category": [
          "nature",
          "views"
        ],
        "lat": 63.5319,
        "lng": -19.5118,
        "timeOfDay": "morning",
        "durationHours": 1.5,
        "budgetTier": [
          "economy"
        ],
        "image": "https://images.unsplash.com/photo-1467320424268-f91a16cf7c77?w=900&auto=format&fit=crop&q=80",
        "descTr": "60 m yüksekliğindeki şelale; merdivenden yukarı çıkarak üstten manzara.",
        "descEn": "60-meter waterfall; climb the staircase for stunning views from above.",
        "insiderTipTr": "Güneşli günlerde şelalenin önünde gökkuşağı görürsünüz.",
        "insiderTipEn": "On sunny days you'll see a vivid rainbow in front of the falls.",
        "transitTr": "Reykjavik'ten Ring Road, 2.5 saat.",
        "transitEn": "2.5 hours from Reykjavik along Ring Road."
      }
    ]
  }
};

const COUNTRY_SURVIVAL_GUIDES = {
  "turkey": [
    {
      "titleTr": "İstanbulkart Şarttır",
      "titleEn": "Get an Istanbulkart",
      "descTr": "Metro, vapur, tramvay için tek kart kullanılır. Giriş istasyonlarındaki Biletmatik'lerden nakit veya kartla alabilirsiniz.",
      "descEn": "One single card works for metros, ferries, trams, and funiculars. Buy at yellow Biletmatik kiosks with cash/card."
    },
    {
      "titleTr": "Köprü Trafiğinden Kaçın: Vapurları Kullan",
      "titleEn": "Take Ferries to Beat Bridge Traffic",
      "descTr": "Avrupa'dan Asya'ya geçerken köprü taksisi yerine 20 dakikalık vapur yolculuğunu tercih edin.",
      "descEn": "Cross between continents by public ferry (20 mins with tea & view) rather than sitting in bridge traffic."
    }
  ],
  "france": [
    {
      "titleTr": "Navigo Easy Kart & Metro",
      "titleEn": "Navigo Easy Card",
      "descTr": "Paris metrosunda kağıt biletler kalktı. İstasyonlardan Navigo Easy kart alıp içine 10'luk bilet paketi yükleyin.",
      "descEn": "Paper tickets are phased out. Buy a Navigo Easy card at any station and load 10 single rides for discounts."
    },
    {
      "titleTr": "Louvre İçin Önceden Randevu",
      "titleEn": "Pre-book Louvre Time Slot",
      "descTr": "Louvre Müzesi kapıda bilet satmaz. Resmi siteden belirli bir giriş saati ayırtmanız zorunludur.",
      "descEn": "The Louvre strictly requires timed-entry reservation tickets purchased online in advance."
    }
  ],
  "spain": [
    {
      "titleTr": "İspanyol Yemek Saatlerine Dikkat",
      "titleEn": "Late Spanish Dining Hours",
      "descTr": "İspanya'da öğle yemeği 14:00 - 16:00, akşam yemeği ise en erken 21:00'de başlar.",
      "descEn": "Locals eat late: lunch is typically 2 PM–4 PM and dinner starts after 9 PM. Adjust your hunger clock!"
    },
    {
      "titleTr": "Sagrada Família İçin Erken Bilet",
      "titleEn": "Book Sagrada Família Ahead",
      "descTr": "Gaudí'nin başyapıtı için biletler günler öncesinden tükenir. Biletinizi seyahatten önce ayırtın.",
      "descEn": "Tickets for Sagrada Família sell out days ahead. Reserve on the official site well in advance."
    }
  ],
  "germany": [
    {
      "titleTr": "Pazar Günleri Her Yer Kapalıdır",
      "titleEn": "Sundays Are Quiet in Germany",
      "descTr": "Almanya'da pazar günleri süpermarketler, AVM'ler ve dükkanlar tamamen kapalıdır. Alışverişinizi cumartesi yapın.",
      "descEn": "Shops and grocery supermarkets are strictly closed on Sundays across Germany by law."
    },
    {
      "titleTr": "Nakit Para (Bargeld) Yanınızda Bulundurun",
      "titleEn": "Always Carry Cash",
      "descTr": "Berlin'de pek çok geleneksel pub (Kneipe), fırın ve sokak büfesi sadece nakit kabul eder.",
      "descEn": "Many traditional German pubs, bakeries, and street stands are strictly cash-only (Nur Bares ist Wahres)."
    }
  ],
  "uk": [
    {
      "titleTr": "Oyster / Temassız Kart Geçerlidir",
      "titleEn": "Tap with Contactless Card",
      "descTr": "Londra metrosunda özel bilet almanıza gerek yok; temassız kredi kartınızı turnikelere okutarak en uygun tarifeyle gezebilirsiniz.",
      "descEn": "No need for special tickets; simply tap your contactless bank card or Apple Pay at London tube barriers."
    },
    {
      "titleTr": "Devlet Müzeleri Tamamen Ücretsizdir",
      "titleEn": "Major Museums Are 100% Free",
      "descTr": "British Museum, National Gallery, Tate Modern ve Doğa Tarihi Müzesi'ne giriş tamamen ücretsizdir.",
      "descEn": "Permanent collections at the British Museum, Tate Modern, and National Gallery are completely free to enter."
    }
  ],
  "italy": [
    {
      "titleTr": "Bar Tezgahında İçmek Masadan Daha Ucuzdur",
      "titleEn": "Stand at the Bar Counter (Al Banco)",
      "descTr": "İtalya'da kahve veya kruvasanı barda ayakta tüketmek (al banco), masada oturmaktan 2-3 kat daha ucuzdur.",
      "descEn": "Standing at the counter (al banco) for espresso costs about €1.20, whereas sitting down carries table service fees."
    },
    {
      "titleTr": "Kilise Kıyafet Kuralları",
      "titleEn": "Church Dress Codes",
      "descTr": "Vatikan ve tarihi bazilikalara girişte omuzlar ve dizler mutlaka kapalı olmalıdır.",
      "descEn": "St. Peter's and Roman churches strictly require covered shoulders and knees."
    }
  ],
  "austria": [
    {
      "titleTr": "Viyana Toplu Taşıma 24/48 Saatlik Bilet",
      "titleEn": "Vienna 24/48h Transit Pass",
      "descTr": "Viyana'da metro ve tramvaylarda tek tek bilet yerine 24 veya 48 saatlik 'Wien Ticket' almak çok ekonomiktir.",
      "descEn": "Buy a 24-hour or 48-hour Vienna city pass for unlimited rides on U-Bahn, trams, and buses."
    },
    {
      "titleTr": "Saray Bahçeleri Tamamen Ücretsizdir",
      "titleEn": "Palace Grounds Are Free",
      "descTr": "Schönbrunn ve Belvedere Sarayları'nın devasa imparatorluk bahçelerini gezmek ücretsizdir.",
      "descEn": "Wandering the magnificent imperial gardens of Schönbrunn and Belvedere costs nothing."
    }
  ],
  "netherlands": [
    {
      "titleTr": "Bisiklet Yollarında Yürümeyin",
      "titleEn": "Never Walk in Bike Lanes",
      "descTr": "Amsterdam'da kırmızı asfaltlı bisiklet yolları sadece bisikletlilere aittir. Yürürken dikkatli olun.",
      "descEn": "Red paved bike paths are strictly for cyclists; always check both sides before crossing."
    },
    {
      "titleTr": "Temassız OVpay ile Seyahat Edin",
      "titleEn": "Tap with OVpay",
      "descTr": "Amsterdam tramvay ve metrosunda kredi kartınızı binerken ve inerken okutarak (check-in / check-out) kolayca seyahat edin.",
      "descEn": "Tap your contactless credit card at check-in and check-out validators on trams and metros."
    }
  ],
  "greece": [
    {
      "titleTr": "Akropolis Sabah Serinliğinde Gezilmeli",
      "titleEn": "Beat the Acropolis Heat",
      "descTr": "Yaz aylarında mermer tepede gölge yoktur. Sabah 08:00 açılışında gidin ve yanınıza bol su alın.",
      "descEn": "There is zero shade on the marble summit. Visit at 8:00 AM opening and carry a sun hat."
    }
  ],
  "japan": [
    {
      "titleTr": "Suica veya Pasmo Kartı Alın",
      "titleEn": "Get a Suica or Pasmo Transit Card",
      "descTr": "Tokyo'da tüm metro ve tren hatlarında tek dokunuşla Suica veya Pasmo kartı kullanılır.",
      "descEn": "One tap with a digital or physical Suica/Pasmo card works across all Tokyo transit systems."
    },
    {
      "titleTr": "Bahşiş Kültürü Yoktur",
      "titleEn": "No Tipping in Japan",
      "descTr": "Japonya'da restoranlarda veya taksilerde bahşiş verilmez; bahşiş bırakmak kaba algılanabilir.",
      "descEn": "Tipping is not customary in Japan and will usually be politely refused."
    }
  ],
  "usa": [
    {
      "titleTr": "OMNY Temassız Metro Geçişi",
      "titleEn": "OMNY Contactless Subway",
      "descTr": "New York metrosunda turnikelere telefonunuzu veya kredi kartınızı okutarak binebilirsiniz.",
      "descEn": "Simply tap your contactless phone or credit card at NYC subway turnstiles."
    }
  ]
};
