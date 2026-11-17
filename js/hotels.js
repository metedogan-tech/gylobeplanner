// GlobePlanner — hotels, routing from the hotel, and detailed transport between stops.
//  - Hotel search (the traveller's own booking): OpenStreetMap Nominatim
//  - Hotel suggestions near the day's area: OpenStreetMap (Overpass API), real places only
//  - Hotel photos: the hotel's own Wikidata / Wikimedia Commons image, when it has one

const COUNTRY_ISO = {
  turkey: "tr", france: "fr", spain: "es", germany: "de", uk: "gb", italy: "it", austria: "at",
  netherlands: "nl", greece: "gr", japan: "jp", usa: "us", egypt: "eg", uae: "ae", thailand: "th",
  brazil: "br", switzerland: "ch", portugal: "pt", czechia: "cz", norway: "no", iceland: "is"
};

// ---------- geometry ----------
function geoDistanceKm(a, b) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatDistance(km, isTr) {
  if (km < 1) return `${Math.round(km * 1000 / 50) * 50} m`;
  const v = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  return `${isTr ? v.replace(".", ",") : v} km`;
}

function formatMinutes(min, isTr) {
  min = Math.max(1, Math.round(min));
  if (min < 60) return isTr ? `${min} dk` : `${min} min`;
  const h = Math.floor(min / 60), m = Math.round((min % 60) / 5) * 5;
  if (isTr) return m ? `${h} sa ${m} dk` : `${h} sa`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function directionsUrl(from, to, mode) {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=${mode}`;
}

/**
 * How to get from one point to the next, with realistic times.
 * Straight-line distance x 1.3 approximates the real street distance.
 * `to.transitTr/En` (the place's nearest stop) is added as the concrete arrival point.
 */
function describeLeg(from, to, isTr) {
  const km = geoDistanceKm(from, to) * 1.3;
  const dist = formatDistance(km, isTr);
  const arrival = to.transitTr ? (isTr ? to.transitTr : to.transitEn) : "";
  const toName = isTr ? (to.nameTr || to.name) : (to.nameEn || to.name);
  let mode, icon, main, extra = "";

  if (km <= 1.5) {
    mode = "walking"; icon = "walk";
    main = isTr
      ? `Yürüyerek yaklaşık ${formatMinutes(km / 4.8 * 60, isTr)} (${dist}).`
      : `About ${formatMinutes(km / 4.8 * 60, isTr)} on foot (${dist}).`;
  } else if (km <= 6) {
    mode = "transit"; icon = "transit";
    const pt = km / 16 * 60 + 8, taxi = km / 22 * 60 + 4;
    main = isTr
      ? `${dist}. Toplu taşımayla yaklaşık ${formatMinutes(pt, isTr)}, taksiyle ${formatMinutes(taxi, isTr)}.`
      : `${dist}. About ${formatMinutes(pt, isTr)} by public transport, ${formatMinutes(taxi, isTr)} by taxi.`;
    if (km <= 3) extra = isTr ? ` Hava güzelse ${formatMinutes(km / 4.8 * 60, isTr)} yürüyerek de gidilir.` : ` In good weather it's a ${formatMinutes(km / 4.8 * 60, isTr)} walk.`;
  } else if (km <= 45) {
    mode = "transit"; icon = "car";
    const pt = km / 28 * 60 + 15, car = km / 38 * 60 + 5;
    main = isTr
      ? `${dist} uzakta. Tren/otobüsle yaklaşık ${formatMinutes(pt, isTr)}, taksi ya da arabayla ${formatMinutes(car, isTr)}.`
      : `${dist} away. About ${formatMinutes(pt, isTr)} by train or bus, ${formatMinutes(car, isTr)} by taxi or car.`;
  } else {
    mode = "transit"; icon = "train";
    const train = km / 75 * 60 + 20;
    main = isTr
      ? `${dist} uzakta; şehirler arası yolculuk. Tren ya da otobüsle yaklaşık ${formatMinutes(train, isTr)}. Bileti önceden almanı öneririz.`
      : `${dist} away; an intercity trip. About ${formatMinutes(train, isTr)} by train or bus. Book tickets in advance.`;
  }

  return {
    km, mode, icon,
    text: main + extra,
    arrival: arrival ? (isTr ? `Varış: ${arrival}` : `Arrive at: ${arrival}`) : "",
    toName,
    url: directionsUrl(from, to, mode)
  };
}

// ---------- route order ----------
// Keep the time-of-day order (sunset spots stay at sunset), but inside each part of
// the day visit the closest place next, starting from the hotel when there is one.
function orderStopsFrom(stops, start) {
  const weight = { morning: 1, afternoon: 2, sunset: 3, evening: 4 };
  const groups = {};
  stops.forEach(s => { const w = weight[s.timeSlot] || 2; (groups[w] = groups[w] || []).push(s); });
  const out = [];
  let cur = start || null;
  Object.keys(groups).sort().forEach(w => {
    const left = groups[w].slice();
    while (left.length) {
      let best = 0;
      if (cur) {
        let bestD = Infinity;
        left.forEach((s, i) => { const d = geoDistanceKm(cur, s.place); if (d < bestD) { bestD = d; best = i; } });
      }
      const next = left.splice(best, 1)[0];
      out.push(next);
      cur = next.place;
    }
  });
  return out;
}

// The traveller's hotel that serves a given day (hotels are saved per stay area)
function hotelForDay(itinerary, dayIndex, hotels) {
  if (!hotels || typeof getStayForDay !== "function") return null;
  const stay = getStayForDay(itinerary, dayIndex);
  if (!stay) return null;
  const h = hotels[stayKey(itinerary, stay)];
  if (!h) return null;
  // Only use it when it is actually near this day's stops
  const day = itinerary.days[dayIndex];
  const near = day.stops.some(s => geoDistanceKm(h, s.place) < 40);
  return near ? h : null;
}

function stayKey(itinerary, stay) {
  return `${itinerary.country ? itinerary.country.id : ""}:${stay.zoneKey}`;
}

function applyHotelRouting(itinerary, hotels) {
  itinerary.days.forEach((day, i) => {
    const h = hotelForDay(itinerary, i, hotels);
    day.stops = orderStopsFrom(day.stops, h);
    day.hotel = h || null;
    // Real distance of the day (hotel → stops → hotel)
    const pts = (h ? [h] : []).concat(day.stops.map(s => s.place)).concat(h ? [h] : []);
    let km = 0;
    for (let k = 1; k < pts.length; k++) km += geoDistanceKm(pts[k - 1], pts[k]) * 1.3;
    day.stats.walkingKm = km.toFixed(1);
    day.stats.stopsCount = day.stops.length;
  });
  return itinerary;
}

// ---------- the traveller's own hotel: search by name or address ----------
async function searchHotelByName(query, countryId, lang) {
  const cc = COUNTRY_ISO[countryId] || "";
  const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=0&limit=5" +
    (cc ? `&countrycodes=${cc}` : "") + `&accept-language=${lang === "tr" ? "tr" : "en"}&q=` + encodeURIComponent(query);
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  if (!res.ok) throw new Error("search " + res.status);
  const data = await res.json();
  return data.map(r => ({
    name: (r.name || r.display_name.split(",")[0]).trim(),
    address: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    source: "own"
  }));
}

// ---------- hotel suggestions near the stay area ----------
const HOTEL_CACHE_KEY = "gp_hotels_v1";
function hotelCacheGet(key) {
  try {
    const all = JSON.parse(localStorage.getItem(HOTEL_CACHE_KEY) || "{}");
    const hit = all[key];
    if (hit && Date.now() - hit.t < 7 * 864e5) return hit.v;
  } catch (e) { /* storage unavailable */ }
  return null;
}
function hotelCacheSet(key, v) {
  try {
    const all = JSON.parse(localStorage.getItem(HOTEL_CACHE_KEY) || "{}");
    all[key] = { t: Date.now(), v };
    const keys = Object.keys(all);
    if (keys.length > 40) delete all[keys[0]];
    localStorage.setItem(HOTEL_CACHE_KEY, JSON.stringify(all));
  } catch (e) { /* storage unavailable */ }
}

async function fetchHotelsNear(center, radiusM) {
  const key = `${center.lat.toFixed(3)},${center.lng.toFixed(3)},${radiusM}`;
  const cached = hotelCacheGet(key);
  if (cached) return cached;
  const q = `[out:json][timeout:20];nwr["tourism"~"^(hotel|hostel|guest_house|apartment)$"]["name"](around:${radiusM},${center.lat},${center.lng});out center tags 150;`;
  const endpoints = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
  let data = null, lastErr;
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { method: "POST", body: "data=" + encodeURIComponent(q), headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      if (!res.ok) throw new Error("overpass " + res.status);
      data = await res.json();
      break;
    } catch (e) { lastErr = e; }
  }
  if (!data) throw lastErr || new Error("overpass");
  const hotels = (data.elements || []).map(el => {
    const t = el.tags || {};
    const lat = el.lat != null ? el.lat : el.center && el.center.lat;
    const lng = el.lon != null ? el.lon : el.center && el.center.lon;
    const stars = parseInt((t.stars || "").replace(/[^0-9]/g, ""), 10) || null;
    return {
      id: `${el.type}/${el.id}`,
      name: t["name:en"] && !/[A-Za-z]/.test(t.name || "") ? t["name:en"] : t.name,
      kind: t.tourism,
      stars: stars && stars <= 5 ? stars : null,
      lat, lng,
      website: t.website || t["contact:website"] || "",
      wikidata: t.wikidata || "",
      commons: t.wikimedia_commons || (t.image && /commons\.wikimedia\.org/.test(t.image) ? t.image : "")
    };
  }).filter(h => h.name && h.lat && h.lng);
  hotelCacheSet(key, hotels);
  return hotels;
}

// Pick a short list that fits the budget; hotels with a known photo and star rating first
function rankHotels(hotels, center, budget) {
  const fits = h => {
    if (budget === "luxury") return h.kind === "hotel" && (h.stars == null || h.stars >= 4);
    if (budget === "economy") return h.kind !== "hotel" || (h.stars != null && h.stars <= 3) || h.stars == null;
    return h.kind === "hotel" && (h.stars == null || (h.stars >= 3 && h.stars <= 4));
  };
  const score = h => {
    let s = 0;
    if (fits(h)) s += 100;
    if (h.wikidata || h.commons) s += 30;
    if (h.stars) s += 15;
    if (h.website) s += 5;
    s -= geoDistanceKm(center, h) * 20;
    return s;
  };
  const seen = new Set();
  return hotels.slice().sort((a, b) => score(b) - score(a)).filter(h => {
    const k = h.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const hotelPhotoCache = {};
async function hotelPhoto(h) {
  const key = h.wikidata || h.commons;
  if (!key) return null;
  if (key in hotelPhotoCache) return hotelPhotoCache[key];
  let file = null;
  try {
    if (h.wikidata) {
      const r = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&property=P18&entity=${encodeURIComponent(h.wikidata)}`);
      if (r.ok) {
        const d = await r.json();
        const c = d.claims && d.claims.P18 && d.claims.P18[0];
        file = c && c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value;
      }
    }
    if (!file && h.commons) {
      const m = h.commons.match(/(?:File:|\/)([^/]+\.(?:jpe?g|png|webp))$/i);
      if (m) file = decodeURIComponent(m[1]);
    }
  } catch (e) { return null; }
  const src = file ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=600` : null;
  hotelPhotoCache[key] = src;
  return src;
}

function hotelBookingUrl(h, cityQuery, prefs, lang) {
  const g = (typeof STAY_GUESTS !== "undefined" && STAY_GUESTS[prefs.travelerType]) || { adults: 2, rooms: 1 };
  const city = (cityQuery || "").split(",").pop().trim();
  let url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name + (city ? ", " + city : ""))}&group_adults=${g.adults}&no_rooms=${g.rooms}&group_children=0&lang=${lang === "tr" ? "tr" : "en-gb"}`;
  if (prefs._checkin) url += `&checkin=${prefs._checkin}&checkout=${prefs._checkout}`;
  return url;
}
