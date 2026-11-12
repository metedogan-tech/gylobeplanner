// GlobePlanner - Place database extensions
// Loaded right after data.js. Adds helpers used by the places-*.js files,
// normalizes old category names and links every place to its own Wikipedia
// article so the card photo always shows that exact place.

(function () {
  const BUDGETS = {
    a: ["economy", "moderate", "luxury"],
    em: ["economy", "moderate"],
    m: ["moderate", "luxury"],
    l: ["luxury"],
    e: ["economy"]
  };
  const TIMES = { m: "morning", a: "afternoon", s: "sunset", e: "evening" };

  // Old datasets used categories that the interest picker doesn't offer.
  const CATEGORY_MAP = {
    culture: "art",
    nature: "views",
    relax: "views",
    adventure: "views",
    shopping: "bazaars"
  };

  // Wikipedia article for every place that already existed in data.js
  const EXISTING_WIKI = {
    // Turkey
    ayasofya: "Hagia Sophia", sultanahmet_camii: "Blue Mosque", yerebatan_sarnici: "Basilica Cistern",
    topkapi_sarayi: "Topkapı Palace", kadikoy_barlar_sokagi: "Kadıköy", asmalimescit_gece: ["Asmalımescit", "Beyoğlu"],
    besiktas_publar: "Beşiktaş", moda_sahili_gunbatimi: ["Moda, Kadıköy", "Moda, Istanbul"], eminonu_balik_ekmek: "Balık ekmek",
    sultanahmet_koftecisi: ["Sultanahmet Köftecisi", "Köfte"], galata_kulesi: "Galata Tower", kapalicarsi: "Grand Bazaar, Istanbul",
    // France
    paris_eiffel_tower: "Eiffel Tower", paris_louvre: "Louvre", paris_montmartre: "Sacré-Cœur, Paris",
    paris_marais_nightlife: "Le Marais", paris_bastille_bars: ["Rue de Lappe", "Place de la Bastille"], paris_moulin_rouge: "Moulin Rouge",
    paris_latin_bistros: "Latin Quarter, Paris", paris_croissant_bakery: ["Boulangerie", "Croissant"], paris_seine_cruise: "Bateaux Mouches",
    paris_arc_triomphe: "Arc de Triomphe",
    // Spain
    spain_sagrada_familia: "Sagrada Família", spain_gothic_quarter: "Gothic Quarter, Barcelona", spain_born_nightlife: ["El Born", "Sant Pere, Santa Caterina i la Ribera"],
    spain_barceloneta_nightlife: "La Barceloneta, Barcelona", spain_razzmatazz_club: "Razzmatazz", spain_boqueria_market: "La Boqueria",
    spain_park_guell: "Park Güell",
    // Germany
    germany_brandenburg_gate: "Brandenburg Gate", germany_reichstag: "Reichstag building", germany_kreuzberg_bars: ["Oranienstraße", "Kreuzberg"],
    germany_raw_gelande: ["RAW-Gelände", "Friedrichshain"], germany_curry36: ["Curry 36", "Currywurst"], germany_east_side_gallery: "East Side Gallery",
    // UK
    uk_big_ben: "Big Ben", uk_tower_bridge: "Tower Bridge", uk_soho_pubs: "Soho", uk_camden_bars: "Camden Town",
    uk_borough_market: "Borough Market", uk_sky_garden: "20 Fenchurch Street",
    // Italy
    italy_colosseum: "Colosseum", italy_trevi_fountain: "Trevi Fountain", italy_pantheon: "Pantheon, Rome",
    italy_trastevere_nightlife: "Trastevere", italy_campo_fiori: "Campo de' Fiori", italy_roma_pasta: ["Cacio e pepe", "Carbonara"],
    italy_giolitti_gelato: ["Giolitti", "Gelato"], italy_vatican: "St. Peter's Basilica",
    // Austria
    austria_schonbrunn: "Schönbrunn Palace", austria_stephansdom: "St. Stephen's Cathedral, Vienna", austria_hofburg: "Hofburg",
    austria_bermuda_dreieck: ["Bermudadreieck (Wien)", "Ruprechtskirche"], austria_donaukanal_bars: "Donaukanal", austria_prater: "Wiener Riesenrad",
    austria_naschmarkt: "Naschmarkt", austria_schnitzel: ["Figlmüller", "Wiener schnitzel"], austria_cafe_central: "Café Central",
    austria_belvedere: "Belvedere, Vienna",
    // Netherlands
    netherlands_rijksmuseum: "Rijksmuseum", netherlands_dam_square: "Royal Palace of Amsterdam", netherlands_jordaan_nightlife: "Jordaan",
    netherlands_leidseplein: "Leidseplein", netherlands_canal_cruise: "Canals of Amsterdam", netherlands_vondelpark: "Vondelpark",
    netherlands_albert_cuyp: "Albert Cuyp Market", netherlands_brouwerij_ij: "Brouwerij 't IJ",
    // Greece
    greece_acropolis: "Parthenon", greece_plaka_walk: ["Anafiotika", "Plaka"], greece_gazi_nightlife: ["Technopolis (Athens)", "Gazi, Athens"],
    greece_psiri_tavernas: "Psyrri", greece_souvlaki: "Souvlaki", greece_lycabettus: "Mount Lycabettus",
    // Japan
    japan_sensoji: "Sensō-ji", japan_shibuya_crossing: "Shibuya Crossing", japan_golden_gai: "Golden Gai", japan_tsukiji_sushi: ["Tsukiji Outer Market", "Tsukiji fish market"],
    // USA
    usa_statue_of_liberty: "Statue of Liberty", usa_central_park: ["Bethesda Terrace and Fountain", "Central Park"], usa_greenwich_jazz: ["Village Vanguard", "Greenwich Village"],
    usa_times_square: "Times Square", usa_joes_pizza: ["Joe's Pizza", "New York-style pizza"],
    // Egypt
    egypt_giza_pyramids: "Giza pyramid complex", egypt_khan_khalili: "Khan el-Khalili", egypt_nile_felucca: "Felucca",
    egypt_zamalek_nightlife: "Zamalek", egypt_koshary: "Koshary",
    // UAE
    uae_burj_khalifa: "Burj Khalifa", uae_dubai_fountains: "Dubai Fountain", uae_marina_nightlife: ["Jumeirah Beach Residence", "Dubai Marina"],
    uae_old_dubai: "Al Fahidi Historical Neighbourhood",
    // Thailand
    thailand_wat_arun: "Wat Arun", thailand_grand_palace: "Grand Palace", thailand_khao_san_bars: "Khaosan Road", thailand_yaowarat_food: "Yaowarat Road",
    // Brazil
    brazil_christ_redeemer: "Christ the Redeemer (statue)", brazil_sugarloaf: "Sugarloaf Mountain", brazil_lapa_nightlife: ["Carioca Aqueduct", "Lapa, Rio de Janeiro"],
    brazil_copacabana_beach: ["Copacabana Beach", "Copacabana, Rio de Janeiro"],
    // Switzerland
    swiss_bergamo_bridge: "Bahnhofstrasse", swiss_lake_geneva: "Lake Geneva", swiss_interlaken_hike: ["Harder Kulm", "Interlaken"],
    swiss_matterhorn: "Matterhorn", swiss_jungfraujoch: "Jungfraujoch", swiss_lucerne_oldtown: ["Kapellbrücke", "Lucerne"],
    swiss_lake_zurich_cruise: "Lake Zurich", swiss_chillon_castle: "Chillon Castle", swiss_bern_oldcity: "Old City (Bern)",
    // Portugal
    portugal_lisbon_alfama_walk: "Alfama", portugal_lisbon_pasteis_de_belem: ["Pastéis de Belém", "Pastel de nata"], portugal_lisbon_cathedral: "Lisbon Cathedral",
    portugal_lisbon_bairro_alto_nightlife: "Bairro Alto", portugal_porto_cellars: ["Vila Nova de Gaia", "Port wine"], portugal_algarve_beaches: ["Praia da Marinha", "Algarve"],
    portugal_lisbon_belem_tower: "Belém Tower", portugal_lisbon_jeronimos: "Jerónimos Monastery", portugal_sintra_palace: "Pena Palace",
    portugal_cascais_coast: "Cascais", portugal_douro_valley: ["Douro Valley", "Douro DOC"], portugal_algarve_cliffs: "Ponta da Piedade",
    // Czechia
    czech_charles_bridge: "Charles Bridge", czech_prague_astronomical_clock: "Prague astronomical clock", czech_prague_castle: "Prague Castle",
    czech_wenceslas_square: "Wenceslas Square", czech_petrin_hill: "Petřín Lookout Tower", czech_josefov: "Josefov",
    czech_vysehrad: "Vyšehrad", czech_national_museum: "National Museum (Prague)", czech_pilsen_beer: "Pilsner Urquell Brewery",
    czech_krumlov_castle: "Český Krumlov Castle", czech_kutna_hora: "Sedlec Ossuary",
    // Norway
    norway_oslo_opera_house: "Oslo Opera House", norway_vigeland_park: "Vigeland installation", norway_bryggen: "Bryggen",
    norway_preikestolen: "Preikestolen", norway_geirangerfjord: "Geirangerfjord", norway_flam_railway: "Flåm Line",
    norway_tromso_northern_lights: ["Aurora", "Tromsø"], norway_lofoten_islands: "Lofoten", norway_trolltunga: "Trolltunga",
    // Iceland
    iceland_hallgrimskirkja: "Hallgrímskirkja", iceland_golden_circle_geysir: ["Strokkur", "Geysir"], iceland_gullfoss: "Gullfoss",
    iceland_thingvellir: "Þingvellir", iceland_seljalandsfoss: "Seljalandsfoss", iceland_black_sand_beach: "Reynisfjara",
    iceland_jokulsarlon: "Jökulsárlón", iceland_blue_lagoon: "Blue Lagoon (geothermal spa)", iceland_skogafoss: "Skógafoss"
  };

  // Places in the old data that were attached to the wrong district
  const ZONE_FIXES = {
    swiss_matterhorn: "alps_valais",
    swiss_lucerne_oldtown: "lucerne_region",
    swiss_bern_oldcity: "bern_region",
    swiss_lake_zurich_cruise: "zurich_oldtown",
    swiss_bergamo_bridge: "zurich_oldtown",
    portugal_douro_valley: "porto_wine",
    portugal_sintra_palace: "sintra_cascais",
    portugal_cascais_coast: "sintra_cascais"
  };

  /**
   * Add zones and places to a country.
   * Row format:
   * [id, wiki, nameTr, nameEn, zone, "cat/cat", lat, lng, time(m|a|s|e), hours, budget(a|em|m|l|e),
   *  descTr, descEn, tipTr, tipEn, transitTr, transitEn]
   */
  window.gpAddPlaces = function (countryId, zones, rows) {
    const ds = CURATED_DESTINATIONS[countryId];
    if (!ds) return;
    Object.assign(ds.zones, zones || {});
    const existing = new Set(ds.places.map(p => p.id));
    rows.forEach(r => {
      const [id, wiki, nameTr, nameEn, zone, cats, lat, lng, t, dur, b, descTr, descEn, tipTr, tipEn, trTr, trEn] = r;
      if (existing.has(id)) return;
      existing.add(id);
      ds.places.push({
        id, wiki, nameTr, nameEn, zone,
        category: cats.split("/"),
        lat, lng,
        timeOfDay: TIMES[t] || "afternoon",
        durationHours: dur,
        budgetTier: BUDGETS[b] || BUDGETS.a,
        image: "",
        descTr, descEn,
        insiderTipTr: tipTr, insiderTipEn: tipEn,
        transitTr: trTr, transitEn: trEn
      });
    });
  };

  // Better Wikipedia article titles for places whose first title has no usable photo
  const WIKI_FIX = {
    "A'DAM Tower": ["A'DAM Toren"],
    "Al Fahidi Historical Neighbourhood": ["Al Bastakiya", "Al Fahidi Historical Neighbourhood"],
    "Al Shindagha Museum": ["Al Shindagha"],
    "Al-Muizz Street": ["Al-Mu'izz Street"],
    "Apostolou Pavlou Street": ["Dionysiou Areopagitou Street", "Thiseio"],
    "Aquaventure": ["Aquaventure", "Atlantis The Palm"],
    "Bergen Fish Market": ["Bergen Fish Market", "Torget, Bergen"],
    "Blue Mosque": ["Blue Mosque, Istanbul"],
    "Boulevard Olímpico": ["Boulevard Olímpico", "Porto Maravilha"],
    "Búðakirkja": ["Búðakirkja", "Búðir"],
    "Carrer de Blai": ["Poble-sec"],
    "Cine Thisio": ["Cine Thisio", "Thiseio"],
    "De Hallen": ["De Hallen", "Foodhallen"],
    "Feira Hippie de Ipanema": ["Feira Hippie de Ipanema", "Praça General Osório"],
    "Friðheimar": ["Friðheimar", "Reykholt (Bláskógabyggð)"],
    "Galeries Lafayette Haussmann": ["Galeries Lafayette"],
    "Gold Souk": ["Dubai Gold Souk"],
    "Spice Souk": ["Dubai Spice Souk"],
    "Gran Vía": ["Gran Vía, Madrid"],
    "Hatta": ["Hatta Dam", "Hatta, Dubai"],
    "KODE": ["KODE (art museum)", "KODE"],
    "Khlongs of Bangkok": ["Khlong Bangkok Yai", "Khlong"],
    "Kite Beach": ["Kite Beach, Dubai", "Kite Beach"],
    "Kunst Haus Wien": ["KunstHausWien"],
    "Laugavegur (street)": ["Laugavegur (Reykjavík)"],
    "Lisbon tramway network": ["Trams in Lisbon"],
    "Mercado da Ribeira": ["Time Out Market Lisboa", "Mercado da Ribeira"],
    "Mikrolimano": ["Mikrolimano"],
    "Miradouro da Senhora do Monte": ["Miradouro da Senhora do Monte", "Graça (Lisbon)"],
    "Monastiraki Square": ["Monastiraki"],
    "Niederdorf": ["Niederdorf district"],
    "Náplavka": ["Rašínovo nábřeží", "Náplavka"],
    "Omoide Yokochō": ["Omoide Yokocho", "Omoide Yokochō"],
    "Pilsner Urquell Brewery": ["Pilsner Urquell"],
    "Psyrri": ["Psyri", "Psyrri"],
    "Reykjadalur": ["Reykjadalur", "Hveragerði"],
    "Ribeira (Porto)": ["Ribeira Square"],
    "Rio Scenarium": ["Rio Scenarium", "Rua do Lavradio"],
    "SALT Galata": ["SALT Galata", "Salt Research"],
    "Sant Pau Recinte Modernista": ["Hospital de Sant Pau"],
    "Sant'Eustachio Il Caffè": ["Sant'Eustachio Il Caffè", "Sant'Eustachio, Rome"],
    "Secret Lagoon": ["Secret Lagoon", "Flúðir"],
    "Skydive Dubai": ["Palm Jumeirah"],
    "The Walk, Jumeirah Beach Residence": ["Jumeirah Beach Residence"],
    "Trocadéro": ["Palais de Chaillot", "Trocadéro, Paris"],
    "Varvakios Agora": ["Varvakios Agora", "Athens Central Market"],
    "Volksgarten": ["Volksgarten, Vienna"],
    "Six d.o.g.s": ["Psyri"]
  };
  const fixWiki = (w) => {
    const list = (Array.isArray(w) ? w : [w]).filter(Boolean);
    const out = [];
    list.forEach(t => (WIKI_FIX[t] || [t]).forEach(x => { if (!out.includes(x)) out.push(x); }));
    return out;
  };

  // Road-trip countries: a single day naturally covers a wider area
  const REGION_RADIUS = { iceland: 0.9, norway: 1.0, switzerland: 0.5, egypt: 0.3 };
  Object.keys(REGION_RADIUS).forEach(cid => {
    if (CURATED_DESTINATIONS[cid]) CURATED_DESTINATIONS[cid].regionRadius = REGION_RADIUS[cid];
  });

  // Normalize the original dataset
  Object.keys(CURATED_DESTINATIONS).forEach(cid => {
    CURATED_DESTINATIONS[cid].places.forEach(p => {
      p.category = [...new Set((p.category || []).map(c => CATEGORY_MAP[c] || c))];
      if (!TIMES[p.timeOfDay] && !["morning", "afternoon", "sunset", "evening"].includes(p.timeOfDay)) {
        p.timeOfDay = "afternoon";
      }
      if (EXISTING_WIKI[p.id]) p.wiki = EXISTING_WIKI[p.id];
      if (ZONE_FIXES[p.id]) p.zone = ZONE_FIXES[p.id];
    });
  });

  // Applied after the places-*.js files have added their rows
  window.gpFinalizePlaces = function () {
    Object.keys(CURATED_DESTINATIONS).forEach(cid => {
      CURATED_DESTINATIONS[cid].places.forEach(p => { p.wiki = fixWiki(p.wiki || p.nameEn); });
    });
  };
})();
