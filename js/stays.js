// GlobePlanner — where to stay
// For every district (zone) the search phrase that booking sites understand best.
// dayTrip: the area is usually visited as a day trip, you sleep in the main city.
const STAY_AREAS = {
  turkey: {
    sultanahmet: { q: "Sultanahmet, Istanbul" },
    beyoglu_karakoy: { q: "Beyoğlu, Istanbul" },
    besiktas_bosphorus: { q: "Beşiktaş, Istanbul" },
    kadikoy_moda: { q: "Kadıköy, Istanbul" },
    fatih_balat: { q: "Fatih, Istanbul" },
    uskudar_camlica: { q: "Üsküdar, Istanbul" },
    adalar: { q: "Büyükada", dayTrip: true }
  },
  france: {
    eiffel_seine: { q: "7th arrondissement, Paris" },
    louvre_central: { q: "1st arrondissement, Paris" },
    marais_nightlife: { q: "Le Marais, Paris" },
    montmartre_bohemian: { q: "Montmartre, Paris" },
    left_bank: { q: "Saint-Germain-des-Prés, Paris" },
    versailles: { q: "Versailles", dayTrip: true }
  },
  spain: {
    gaudi_eixample: { q: "Eixample, Barcelona" },
    gothic_born: { q: "Ciutat Vella, Barcelona" },
    barceloneta_beach: { q: "Barceloneta, Barcelona" },
    montjuic: { q: "Poble-sec, Barcelona" },
    madrid_centro: { q: "Centro, Madrid" }
  },
  germany: {
    mitte_historic: { q: "Mitte, Berlin" },
    kreuzberg_nightlife: { q: "Kreuzberg, Berlin" },
    tiergarten_views: { q: "Tiergarten, Berlin" },
    museum_island: { q: "Mitte, Berlin" },
    charlottenburg: { q: "Charlottenburg, Berlin" },
    potsdam: { q: "Potsdam", dayTrip: true }
  },
  uk: {
    westminster_thames: { q: "Westminster, London" },
    soho_covent: { q: "Covent Garden, London" },
    city_tower: { q: "Southwark, London" },
    south_kensington: { q: "South Kensington, London" },
    greenwich: { q: "Greenwich, London" }
  },
  italy: {
    colosseo_forum: { q: "Monti, Rome" },
    trevi_pantheon: { q: "Centro Storico, Rome" },
    trastevere_nightlife: { q: "Trastevere, Rome" },
    vatican_borgo: { q: "Prati, Rome" },
    centro_storico: { q: "Piazza Navona, Rome" },
    spagna_borghese: { q: "Piazza di Spagna, Rome" },
    monti_testaccio: { q: "Testaccio, Rome" }
  },
  austria: {
    innere_stadt: { q: "Innere Stadt, Vienna" },
    schonbrunn_palace: { q: "Hietzing, Vienna" },
    donaukanal_nightlife: { q: "Leopoldstadt, Vienna" },
    museumsquartier: { q: "Neubau, Vienna" },
    wachau: { q: "Dürnstein", dayTrip: true }
  },
  netherlands: {
    canal_ring: { q: "Jordaan, Amsterdam" },
    dam_central: { q: "Amsterdam City Centre" },
    leidseplein_nightlife: { q: "Leidseplein, Amsterdam" },
    museumplein: { q: "Oud-Zuid, Amsterdam" },
    de_pijp_oost: { q: "De Pijp, Amsterdam" },
    noord_day_trips: { q: "Amsterdam-Noord", dayTrip: true }
  },
  greece: {
    acropolis_plaka: { q: "Plaka, Athens" },
    gazi_nightlife: { q: "Psyri, Athens" },
    lycabettus_views: { q: "Kolonaki, Athens" },
    syntagma_kolonaki: { q: "Syntagma, Athens" },
    riviera_sounion: { q: "Glyfada, Athens" }
  },
  japan: {
    asakusa_ueno: { q: "Asakusa, Tokyo" },
    shinjuku_shibuya: { q: "Shinjuku, Tokyo" },
    tsukiji_ginza: { q: "Ginza, Tokyo" },
    kyoto: { q: "Gion, Kyoto" },
    harajuku_roppongi: { q: "Shibuya, Tokyo" }
  },
  usa: {
    midtown_broadway: { q: "Midtown Manhattan, New York" },
    village_soho: { q: "Greenwich Village, New York" },
    downtown_bridge: { q: "Financial District, New York" },
    brooklyn: { q: "Williamsburg, Brooklyn" },
    upper_manhattan: { q: "Upper East Side, New York" },
    washington_dc: { q: "Washington, D.C." }
  },
  egypt: {
    giza_pyramids: { q: "Giza" },
    islamic_cairo: { q: "Downtown Cairo" },
    nile_zamalek: { q: "Zamalek, Cairo" },
    downtown_cairo: { q: "Downtown Cairo" },
    coptic_cairo: { q: "Garden City, Cairo" },
    luxor: { q: "Luxor" },
    alexandria: { q: "Alexandria, Egypt" }
  },
  uae: {
    downtown_burj: { q: "Downtown Dubai" },
    marina_jbr: { q: "Dubai Marina" },
    old_creek: { q: "Bur Dubai" },
    jumeirah: { q: "Jumeirah, Dubai" },
    desert: { q: "Dubai", dayTrip: true },
    abu_dhabi: { q: "Abu Dhabi" }
  },
  thailand: {
    rattanakosin_temples: { q: "Phra Nakhon, Bangkok" },
    khao_san_nightlife: { q: "Khao San Road, Bangkok" },
    chinatown_food: { q: "Chinatown, Bangkok" },
    sukhumvit_silom: { q: "Sukhumvit, Bangkok" },
    ayutthaya_markets: { q: "Ayutthaya", dayTrip: true }
  },
  brazil: {
    corcovado_centro: { q: "Santa Teresa, Rio de Janeiro" },
    copacabana_ipanema: { q: "Copacabana, Rio de Janeiro" },
    sugarloaf_urca: { q: "Botafogo, Rio de Janeiro" },
    santa_teresa: { q: "Santa Teresa, Rio de Janeiro" },
    leblon_lagoa: { q: "Leblon, Rio de Janeiro" },
    petropolis: { q: "Petrópolis", dayTrip: true }
  },
  switzerland: {
    zurich_oldtown: { q: "Zurich Old Town" },
    geneva_lake: { q: "Lausanne" },
    interlaken_adventure: { q: "Interlaken" },
    lucerne_region: { q: "Lucerne" },
    bern_region: { q: "Bern" },
    alps_valais: { q: "Zermatt" }
  },
  portugal: {
    lisbon_history: { q: "Baixa, Lisbon" },
    porto_wine: { q: "Ribeira, Porto" },
    algarve_coast: { q: "Lagos, Portugal" },
    sintra_cascais: { q: "Sintra" }
  },
  czechia: {
    prague_oldtown: { q: "Old Town, Prague" },
    pilsen_region: { q: "Plzeň", dayTrip: true },
    south_bohemia: { q: "Český Krumlov" },
    mala_strana: { q: "Malá Strana, Prague" }
  },
  norway: {
    oslo_city: { q: "Oslo" },
    bergen_fjord: { q: "Bergen" },
    northern_norway: { q: "Tromsø" },
    stavanger: { q: "Stavanger" }
  },
  iceland: {
    reykjavik_city: { q: "Reykjavík" },
    golden_circle: { q: "Selfoss" },
    south_coast: { q: "Vík" },
    snaefellsnes: { q: "Grundarfjörður" }
  }
};

// Guests per traveller type (adults, rooms)
const STAY_GUESTS = {
  solo: { adults: 1, rooms: 1 },
  couple: { adults: 2, rooms: 1 },
  family: { adults: 2, rooms: 1 },
  friends: { adults: 4, rooms: 2 }
};

function stayIsoDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Where to sleep for the active day. Consecutive days spent in the same region
 * share one base, so the traveller doesn't change hotels every night.
 */
function getStayForDay(itinerary, dayIndex) {
  const days = itinerary.days;
  const day = days[dayIndex];
  if (!day) return null;
  const countryId = itinerary.country && itinerary.country.id;
  const areas = STAY_AREAS[countryId] || {};

  let start = dayIndex, end = dayIndex;
  while (start > 0 && days[start - 1].regionId === day.regionId) start--;
  while (end < days.length - 1 && days[end + 1].regionId === day.regionId) end++;

  // Base = the district most of this stretch's stops are in (ignoring day-trip areas)
  const counts = {};
  for (let i = start; i <= end; i++) {
    days[i].stops.forEach(s => {
      const z = s.place.zone;
      if (areas[z] && areas[z].dayTrip) return;
      counts[z] = (counts[z] || 0) + 1;
    });
  }
  // A stay the traveller already booked keeps its area even if the stops shift around it
  const baseZone = day.stayZone || Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const isDayTrip = !baseZone;
  const zoneKey = baseZone || day.zoneKey;
  const area = areas[zoneKey] || { q: `${day.neighborhood}, ${itinerary.country ? itinerary.country.nameEn : ""}` };
  const zoneMeta = (CURATED_DESTINATIONS[countryId] && CURATED_DESTINATIONS[countryId].zones[zoneKey]) || {};

  return {
    query: area.q,
    zoneKey,
    neighborhood: zoneMeta.primaryNeighborhood || day.neighborhood,
    isDayTrip,
    firstDay: start + 1,
    lastDay: end + 1,
    nights: end - start + 1,
    startOffset: start
  };
}

function buildStayLinks(stay, prefs, lang) {
  const g = STAY_GUESTS[prefs.travelerType] || STAY_GUESTS.couple;
  let checkin = "", checkout = "";
  if (prefs.startDate) {
    const base = new Date(prefs.startDate + "T12:00:00");
    if (!isNaN(base)) {
      const ci = new Date(base); ci.setDate(ci.getDate() + stay.startOffset);
      const co = new Date(ci); co.setDate(co.getDate() + stay.nights);
      checkin = stayIsoDate(ci); checkout = stayIsoDate(co);
    }
  }
  const q = encodeURIComponent(stay.query);

  // Booking.com: budget changes the default sorting / filter
  let booking = `https://www.booking.com/searchresults.html?ss=${q}&group_adults=${g.adults}&no_rooms=${g.rooms}&group_children=0&lang=${lang === "tr" ? "tr" : "en-gb"}`;
  if (checkin) booking += `&checkin=${checkin}&checkout=${checkout}`;
  if (prefs.budget === "economy") booking += "&order=price";
  else if (prefs.budget === "luxury") booking += "&nflt=" + encodeURIComponent("class=4;class=5");
  else booking += "&nflt=" + encodeURIComponent("review_score=80");

  const google = `https://www.google.com/travel/search?q=${encodeURIComponent((lang === "tr" ? "oteller " : "hotels in ") + stay.query)}&hl=${lang === "tr" ? "tr" : "en"}`;

  let airbnb = `https://www.airbnb.com/s/${q}/homes?adults=${g.adults}`;
  if (checkin) airbnb += `&checkin=${checkin}&checkout=${checkout}`;

  return { booking, google, airbnb, checkin, checkout, adults: g.adults, rooms: g.rooms };
}
