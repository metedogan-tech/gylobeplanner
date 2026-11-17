// GlobePlanner extras: weekly closing days, day schedule (clock times),
// weather per day, rainy-day indoor check, trip budget estimate, calendar export.

// ---------------------------------------------------------------------------
// Weekly closing days (0 = Sunday ... 6 = Saturday) for places that are not
// open every day. Places not listed are treated as open daily.
// ---------------------------------------------------------------------------
const CLOSED_DAYS = {
  // Türkiye
  topkapi_sarayi: [2], dolmabahce: [1], kapalicarsi: [0], pera_muzesi: [1], istanbul_modern: [1],
  // France
  paris_louvre: [2], paris_orsay: [1], paris_orangerie: [2], paris_rodin: [1], paris_centre_pompidou: [2], paris_versailles: [1],
  // Spain
  spain_picasso_museum: [1], spain_mnac: [1], spain_reina_sofia: [2], spain_temple_debod: [1],
  // Germany
  germany_gemaldegalerie: [1], germany_charlottenburg_palace: [1], germany_sanssouci: [1],
  germany_mauerpark: [1, 2, 3, 4, 5, 6], germany_markthalle_neun: [0],
  // UK (sightseeing visits)
  uk_westminster_abbey: [0], uk_st_pauls: [0],
  // Italy
  italy_vatican_museums: [0], italy_borghese_gallery: [1], italy_caracalla: [1], italy_testaccio_market: [0],
  // Austria
  austria_kunsthistorisches: [1],
  // Netherlands
  netherlands_waterlooplein: [0],
  // Greece
  greece_benaki: [2], greece_varvakios: [0],
  // Japan
  japan_tokyo_national_museum: [1], japan_tsukiji_sushi_dai: [0],
  // UAE
  uae_louvre_abu_dhabi: [1],
  // Thailand
  thailand_chatuchak: [1, 2, 3, 4, 5], thailand_bangkok_national_museum: [1, 2],
  // Brazil
  brazil_museum_tomorrow: [1], brazil_niteroi: [1], brazil_petropolis: [1], brazil_ilha_fiscal: [1, 2, 3],
  // Switzerland
  swiss_kunsthaus: [1],
  // Portugal
  portugal_lisbon_jeronimos: [1], portugal_lisbon_belem_tower: [1], portugal_gulbenkian: [2], portugal_maat: [2],
  // Czechia
  czech_krumlov_castle: [1], czech_karlstejn: [1],
  // Norway
  norway_national_museum: [1]
};

// Places shut for a longer period (renovation). They never enter a plan whose
// dates overlap the closure; without dates, the next days from today are used.
const TEMP_CLOSED = {
  paris_centre_pompidou: { from: "2025-09-22", until: "2030-12-31",
    tr: "Tadilat nedeniyle 2030'a kadar kapalı", en: "Closed for renovation until 2030" },
  germany_pergamon: { from: "2023-10-23", until: "2027-06-03",
    tr: "Tadilat nedeniyle kapalı, 4 Haziran 2027'de açılıyor", en: "Closed for renovation, reopens 4 June 2027" }
};

function tripWindow(startDate, days) {
  const first = startDate ? tripDate(startDate, 0) : new Date();
  const last = new Date(first.getTime() + Math.max(0, (days || 1) - 1) * 864e5);
  return [isoDate(first), isoDate(last)];
}
function isTempClosed(place, startDate, days) {
  const c = TEMP_CLOSED[place.id];
  if (!c) return false;
  const [a, b] = tripWindow(startDate, days);
  return a <= c.until && b >= c.from;
}
// Ids of every place in a country that is shut during the trip
function tempClosedIds(countryId, startDate, days) {
  const ds = typeof CURATED_DESTINATIONS !== "undefined" && CURATED_DESTINATIONS[countryId];
  const out = new Set();
  if (ds) ds.places.forEach(p => { if (isTempClosed(p, startDate, days)) out.add(p.id); });
  return out;
}

const WEEKDAYS = {
  tr: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};

function closedDaysOf(place) { return CLOSED_DAYS[place.id] || []; }
function isClosedOn(place, weekday) { return weekday != null && closedDaysOf(place).includes(weekday); }

function closedDaysLabel(place, isTr) {
  const days = closedDaysOf(place);
  if (!days.length) return "";
  const names = WEEKDAYS[isTr ? "tr" : "en"];
  if (days.length >= 4) {
    const open = [0, 1, 2, 3, 4, 5, 6].filter(d => !days.includes(d)).map(d => names[d]);
    return isTr ? `Sadece ${open.join(" ve ")} açık` : `Open only on ${open.join(" and ")}`;
  }
  return isTr ? `${days.map(d => names[d]).join(" ve ")} kapalı` : `Closed on ${days.map(d => names[d]).join(" and ")}`;
}

// ---------- trip dates ----------
function tripDate(startDate, dayIndex) {
  if (!startDate) return null;
  const [y, m, d] = startDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d + dayIndex, 12);
  return dt;
}
function isoDate(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}
function formatTripDate(dt, isTr, withWeekday) {
  return dt.toLocaleDateString(isTr ? "tr-TR" : "en-GB",
    withWeekday === false ? { day: "numeric", month: "long" } : { weekday: "long", day: "numeric", month: "long" });
}

// Pin each day's stay area so moving stops between days never changes the hotel
function pinStayZones(itinerary) {
  if (typeof getStayForDay !== "function") return;
  const zones = itinerary.days.map((d, i) => {
    if (d.stayZone) return d.stayZone;
    const st = getStayForDay(itinerary, i);
    return st && !st.isDayTrip ? st.zoneKey : null;
  });
  itinerary.days.forEach((d, i) => { if (zones[i]) d.stayZone = zones[i]; });
}

// Move a stop that is closed on its date to another day in the same area
// where it is open, trading places with a stop that is open on both dates.
function applyClosures(itinerary, startDate) {
  itinerary.days.forEach(d => d.stops.forEach(s => { delete s.movedFrom; delete s.closedOnDay; }));
  if (!startDate) return itinerary;
  pinStayZones(itinerary);
  const wd = itinerary.days.map((d, i) => tripDate(startDate, i).getDay());

  itinerary.days.forEach((day, i) => {
    day.stops.forEach((s, si) => {
      if (!isClosedOn(s.place, wd[i])) return;
      let done = false;
      for (let j = 0; j < itinerary.days.length && !done; j++) {
        const other = itinerary.days[j];
        if (j === i || other.regionId !== day.regionId || isClosedOn(s.place, wd[j])) continue;
        // Partner: open on both days; prefer one at the same time of day
        const partners = other.stops
          .map((t, ti) => ({ t, ti }))
          .filter(({ t }) => !isClosedOn(t.place, wd[i]))
          .sort((a, b) => (a.t.timeSlot === s.timeSlot ? 0 : 1) - (b.t.timeSlot === s.timeSlot ? 0 : 1));
        if (!partners.length) continue;
        const { t, ti } = partners[0];
        other.stops[ti] = s;
        day.stops[si] = t;
        s.movedFrom = i;
        t.movedFrom = j;
        done = true;
      }
      if (!done) s.closedOnDay = true;
    });
  });
  return itinerary;
}

// ---------- day schedule (clock times) ----------
function legMinutes(from, to) {
  const km = geoDistanceKm(from, to) * 1.3;
  if (km <= 1.5) return km / 4.8 * 60;
  if (km <= 6) return km / 16 * 60 + 8;
  if (km <= 45) return km / 28 * 60 + 15;
  return km / 75 * 60 + 20;
}

// Approximate local sunset in minutes after midnight (NOAA formula, local solar time
// shifted by the time zone guessed from longitude; good to ~15 minutes)
function sunsetMinutes(lat, lng, date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const n = Math.floor((date - start) / 864e5);
  const g = 2 * Math.PI / 365 * (n - 1);
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g)
    + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const latR = lat * Math.PI / 180;
  const cosH = (Math.cos(90.833 * Math.PI / 180) / (Math.cos(latR) * Math.cos(decl))) - Math.tan(latR) * Math.tan(decl);
  if (cosH < -1) return 23 * 60;       // midnight sun
  if (cosH > 1) return 14 * 60;        // polar night: early dark
  const ha = Math.acos(cosH) * 180 / Math.PI;
  const utcMin = 720 - 4 * (lng - ha) - eqt;
  const tzMin = (SUNSET_TZ[currentCountryForSchedule] != null ? SUNSET_TZ[currentCountryForSchedule] : Math.round(lng / 15)) * 60
    + (isSummerTime(currentCountryForSchedule, date) ? 60 : 0);
  return ((utcMin + tzMin) % 1440 + 1440) % 1440;
}
// Standard UTC offsets (hours) and whether the country uses summer time
const SUNSET_TZ = { turkey: 3, france: 1, spain: 1, germany: 1, uk: 0, italy: 1, austria: 1, netherlands: 1, greece: 2,
  japan: 9, usa: -5, egypt: 2, uae: 4, thailand: 7, brazil: -3, switzerland: 1, portugal: 0, czechia: 1, norway: 1, iceland: 0 };
const DST = { france: 1, spain: 1, germany: 1, uk: 1, italy: 1, austria: 1, netherlands: 1, greece: 1, usa: 1, egypt: 1,
  switzerland: 1, portugal: 1, czechia: 1, norway: 1 };
let currentCountryForSchedule = "";
function isSummerTime(country, date) {
  if (!DST[country]) return false;
  const m = date.getMonth();
  return country === "usa" ? (m >= 2 && m <= 10 && !(m === 10 && date.getDate() > 7)) : (m >= 3 && m <= 9);
}

function fmtClock(min) {
  min = Math.round(min / 5) * 5;
  const h = Math.floor(min / 60) % 24, m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Start/end minutes for every stop of the day
function scheduleDay(day, dayIndex, prefs, countryId) {
  currentCountryForSchedule = countryId;
  const dt = tripDate(prefs.startDate, dayIndex) || new Date();
  let t = prefs.pace === "relaxed" ? 9.5 * 60 : prefs.pace === "fast" ? 8.5 * 60 : 9 * 60;
  if (day.hotel && day.stops[0]) t += legMinutes(day.hotel, day.stops[0].place);
  const first = day.stops[0] && day.stops[0].place;
  const sunset = first ? sunsetMinutes(first.lat, first.lng, dt) : 18 * 60;
  return day.stops.map((s, i) => {
    let earliest = 0;
    if (s.timeSlot === "sunset") earliest = Math.max(15 * 60, sunset - 60);
    if (s.timeSlot === "evening") earliest = Math.max(18.5 * 60, sunset);
    const start = Math.max(t, earliest);
    const end = start + (s.place.durationHours || 1.5) * 60;
    const next = day.stops[i + 1];
    t = end + (next ? legMinutes(s.place, next.place) : 0);
    return { start, end };
  });
}

// ---------- weather (Open-Meteo, free, no key) ----------
const WEATHER_CACHE = {};
const WMO = {
  tr: { 0: "Açık", 1: "Az bulutlu", 2: "Parçalı bulutlu", 3: "Kapalı", 45: "Sisli", 48: "Sisli", 51: "Çisenti", 53: "Çisenti", 55: "Çisenti",
    61: "Hafif yağmur", 63: "Yağmurlu", 65: "Kuvvetli yağmur", 66: "Dondurucu yağmur", 67: "Dondurucu yağmur", 71: "Hafif kar", 73: "Karlı", 75: "Yoğun kar",
    77: "Kar taneleri", 80: "Sağanak", 81: "Sağanak", 82: "Kuvvetli sağanak", 85: "Kar sağanağı", 86: "Kar sağanağı", 95: "Gök gürültülü", 96: "Dolu", 99: "Dolu" },
  en: { 0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 48: "Fog", 51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 66: "Freezing rain", 67: "Freezing rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
    77: "Snow grains", 80: "Showers", 81: "Showers", 82: "Heavy showers", 85: "Snow showers", 86: "Snow showers", 95: "Thunderstorm", 96: "Hail", 99: "Hail" }
};
const WET_CODES = new Set([51, 53, 55, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]);

function weatherIcon(kind) {
  const p = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    cloud: '<path d="M17.5 19H8a5 5 0 1 1 1.1-9.9A6 6 0 0 1 20 11a4 4 0 0 1-2.5 8z"/>',
    rain: '<path d="M17.5 15H8a5 5 0 1 1 1.1-9.9A6 6 0 0 1 20 7a4 4 0 0 1-2.5 8z"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3"/>',
    snow: '<path d="M17.5 15H8a5 5 0 1 1 1.1-9.9A6 6 0 0 1 20 7a4 4 0 0 1-2.5 8z"/><path d="M8 19h.01M12 21h.01M16 19h.01"/>'
  }[kind];
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
}

async function fetchJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(12000) : undefined });
  if (!res.ok) throw new Error("weather " + res.status);
  return res.json();
}

// Weather for one place and a list of ISO dates. Dates within the next 15 days use
// the forecast; later dates use the same calendar days of the last 5 years.
async function getWeather(lat, lng, dates) {
  lat = Math.round(lat * 100) / 100; lng = Math.round(lng * 100) / 100;
  const key = `${lat},${lng},${dates.join(",")}`;
  if (WEATHER_CACHE[key]) return WEATHER_CACHE[key];
  const job = (async () => {
    const out = {};
    const today = new Date(); today.setHours(12, 0, 0, 0);
    const limit = isoDate(new Date(today.getTime() + 15 * 864e5));
    const near = dates.filter(d => d <= limit && d >= isoDate(today));
    const far = dates.filter(d => d > limit);
    if (near.length) {
      try {
        const j = await fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto` +
          `&start_date=${near[0]}&end_date=${near[near.length - 1]}`);
        j.daily.time.forEach((d, i) => {
          out[d] = { kind: "forecast", code: j.daily.weather_code[i], tmax: j.daily.temperature_2m_max[i],
            tmin: j.daily.temperature_2m_min[i], rain: j.daily.precipitation_probability_max[i] };
        });
      } catch (e) { /* no forecast: leave empty */ }
    }
    if (far.length) {
      const years = [1, 2, 3, 4, 5];
      const shift = (d, y) => `${Number(d.slice(0, 4)) - y}${d.slice(4)}`.replace(/-02-29$/, "-02-28");
      const acc = {};
      await Promise.all(years.map(async y => {
        try {
          const j = await fetchJson(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}` +
            `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto` +
            `&start_date=${shift(far[0], y)}&end_date=${shift(far[far.length - 1], y)}`);
          j.daily.time.forEach((d, i) => {
            const md = d.slice(5);
            const a = acc[md] = acc[md] || { tmax: 0, tmin: 0, wet: 0, n: 0 };
            if (j.daily.temperature_2m_max[i] == null) return;
            a.tmax += j.daily.temperature_2m_max[i];
            a.tmin += j.daily.temperature_2m_min[i];
            a.wet += (j.daily.precipitation_sum[i] || 0) >= 1 ? 1 : 0;
            a.n++;
          });
        } catch (e) { /* that year failed: average the rest */ }
      }));
      far.forEach(d => {
        const a = acc[d.slice(5)] || acc["02-28"];
        if (a && a.n) out[d] = { kind: "climate", tmax: a.tmax / a.n, tmin: a.tmin / a.n, rain: Math.round(a.wet / a.n * 100), years: a.n };
      });
    }
    return out;
  })();
  WEATHER_CACHE[key] = job;
  job.catch(() => delete WEATHER_CACHE[key]);
  return job;
}

function isWet(w) {
  if (!w) return false;
  if (w.kind === "forecast") return (w.rain != null && w.rain >= 60) || WET_CODES.has(w.code) && (w.rain == null || w.rain >= 40);
  return w.rain >= 50;
}

function weatherMarkup(w, isTr) {
  const t = (v) => `${Math.round(v)}°`;
  if (w.kind === "forecast") {
    const label = (WMO[isTr ? "tr" : "en"][w.code]) || "";
    const kind = [71, 73, 75, 77, 85, 86].includes(w.code) ? "snow" : WET_CODES.has(w.code) ? "rain" : w.code <= 1 ? "sun" : "cloud";
    return `${weatherIcon(kind)}<span><strong>${t(w.tmax)} / ${t(w.tmin)}</strong> ${escapeHtml(label)}${w.rain != null ? (isTr ? `, yağış ihtimali %${w.rain}` : `, ${w.rain}% chance of rain`) : ""}</span>`;
  }
  const kind = w.rain >= 50 ? "rain" : w.rain >= 25 ? "cloud" : "sun";
  return `${weatherIcon(kind)}<span>${isTr ? "Bu tarihlerde genelde" : "Usually around this date"} <strong>${t(w.tmax)} / ${t(w.tmin)}</strong>, ` +
    `${isTr ? `günlerin %${w.rain}'${suffixTr(w.rain)} yağışlı` : `${w.rain}% of days wet`}</span>`;
}
// Turkish possessive suffix after a number: %40'ı, %25'i, %100'ü, %60'ı ...
function suffixTr(n) {
  if (n === 0) return "ı";
  if (n % 100 === 0) return "ü";
  const last = n % 10;
  if (last) return ({ 1: "i", 2: "si", 3: "ü", 4: "ü", 5: "i", 6: "sı", 7: "si", 8: "i", 9: "u" })[last];
  return ({ 10: "u", 20: "si", 30: "u", 40: "ı", 50: "si", 60: "ı", 70: "i", 80: "i", 90: "ı" })[n % 100];
}

// Indoor places (for rainy days)
const INDOOR_RE = /museum|musée|museo|muzesi|müze|palace|palais|palast|palazzo|sarayı|gallery|galerie|galleria|church|cathedral|basilica|mosque|camii|cistern|sarnıç|bazaar|çarşı|market hall|food hall|foodhallen|markthalle|mathallen|mall|harrods|lafayette|library|opera|hamam|bath\b|aquarium|abbey|monastery|hall|house|haus|theatre|theater|kunsthaus|kunsthistorisches|albertina|belvedere|louvre|orsay|prado|rijks|planetarium|science|nemo|perlan|polaria|shindagha|chapel|synagogue|tower of london|crown jewels|catacomb|greenhouse|time out market|covent garden|tea house|coffee museum|cafe|café|restaurant|trattoria|bistro|meyhane|pub|bar\b|jazz|concert|karaoke/i;
const OUTDOOR_RE = /park|garden|bahçe|hill|tepe|beach|plaj|walk|hike|trail|yürüyüş|square|meydan|street|cadde|sokak|lake|göl|river|nehir|falls|glacier|valley|vadi|boat|cruise|tur|ferry|vapur|viewpoint|seyir|terrace|teras|ruins|agora|acropolis|forum|pyramid|piramit|bridge|köprü|pier|harbour|harbor|coast|sahil|island|ada|zoo|safari|desert|çöl|canal|kanal|flea|open-air|açık hava|night market|floating market|lookout|mount|dağ|cliff/i;
function isIndoor(p) {
  const s = `${p.id} ${p.nameEn} ${p.nameTr}`;
  // Clearly outdoors whatever else is in the name (e.g. "Retiro Park & Crystal Palace")
  if (/\bpark\b|parkı|garden|bahçe|beach|plaj|hill|tepe|valley|vadi|lake|göl|walk|hike|trail|cruise|boat|tekne|glacier|falls|şelale/i.test(s)) return false;
  if (OUTDOOR_RE.test(s) && !/museum|müze|muzesi|palace|sarayı|hall|church|cathedral|mosque|camii/i.test(p.nameEn + " " + p.nameTr)) return false;
  return INDOOR_RE.test(s);
}

// ---------- budget estimate (EUR) ----------
// Per person per day: food at economy / moderate / luxury, local transport;
// a typical sight ticket; hotel per room-night when no hotel data exists.
const PRICE_LEVEL = {
  turkey:      { food: [15, 35, 80],  local: 4,  ticket: 20, hotel: [45, 100, 250] },
  france:      { food: [30, 60, 140], local: 8,  ticket: 17, hotel: [90, 170, 450] },
  spain:       { food: [25, 50, 120], local: 6,  ticket: 15, hotel: [70, 140, 350] },
  germany:     { food: [25, 50, 110], local: 9,  ticket: 14, hotel: [70, 130, 300] },
  uk:          { food: [35, 65, 150], local: 12, ticket: 25, hotel: [100, 190, 450] },
  italy:       { food: [30, 55, 130], local: 7,  ticket: 18, hotel: [80, 150, 400] },
  austria:     { food: [28, 55, 120], local: 6,  ticket: 18, hotel: [75, 140, 320] },
  netherlands: { food: [30, 60, 130], local: 9,  ticket: 22, hotel: [90, 170, 380] },
  greece:      { food: [20, 40, 100], local: 5,  ticket: 15, hotel: [60, 120, 300] },
  japan:       { food: [20, 45, 120], local: 8,  ticket: 8,  hotel: [70, 140, 400] },
  usa:         { food: [45, 80, 180], local: 8,  ticket: 30, hotel: [150, 260, 600] },
  egypt:       { food: [10, 25, 70],  local: 5,  ticket: 20, hotel: [30, 80, 250] },
  uae:         { food: [25, 60, 150], local: 8,  ticket: 30, hotel: [70, 160, 450] },
  thailand:    { food: [8, 20, 60],   local: 4,  ticket: 8,  hotel: [25, 70, 220] },
  brazil:      { food: [15, 35, 90],  local: 4,  ticket: 8,  hotel: [50, 110, 280] },
  switzerland: { food: [45, 80, 170], local: 15, ticket: 22, hotel: [130, 240, 550] },
  portugal:    { food: [20, 40, 100], local: 5,  ticket: 12, hotel: [60, 120, 300] },
  czechia:     { food: [18, 35, 80],  local: 4,  ticket: 12, hotel: [50, 100, 250] },
  norway:      { food: [45, 85, 170], local: 12, ticket: 18, hotel: [120, 200, 420] },
  iceland:     { food: [50, 90, 180], local: 15, ticket: 20, hotel: [130, 230, 480] }
};
const FREE_SIGHTS = new Set(["uk_national_gallery", "uk_british_museum", "uk_natural_history", "uk_va_museum", "usa_smithsonian_air", "usa_911_memorial"]);
const PAID_RE = /museum|musée|museo|muzesi|müze|palace|palais|palast|sarayı|gallery|galerie|galleria|tower|kule|castle|kale|fortress|hisar|zoo|aquarium|abbey|monastery|cistern|sarnıç|acropolis|pyramid|piramit|temple of|valley of the kings|tomb|cruise|boat|tekne|tur\b|tour|show|bath\b|hamam|observation|top of the rock|sky|cable car|teleferik|catacomb|crown jewels|park güell|sagrada|alhambra|colosseum|kolezyum|sistine|greenhouse|lagoon|whale|balina|safari/i;
function ticketEstimate(p, country) {
  const lvl = PRICE_LEVEL[country] || PRICE_LEVEL.france;
  if (FREE_SIGHTS.has(p.id)) return 0;
  const tiers = p.budgetTier || [];
  if (tiers.length === 1 && tiers[0] === "economy") return 0;
  const cats = p.category || [];
  if (cats.length === 1 && cats[0] === "food") return 0;           // meals are counted separately
  if (cats.includes("nightlife")) return Math.round(lvl.ticket * 0.8); // drinks, entry, music
  if (!PAID_RE.test(`${p.id} ${p.nameEn} ${p.nameTr}`)) return 0;   // streets, parks, mosques, markets
  const lux = tiers.length === 1 && tiers[0] === "luxury";
  return Math.round(lvl.ticket * (lux ? 2 : 1));
}

const PARTY = { solo: { people: 1, eaters: 1 }, couple: { people: 2, eaters: 2 }, family: { people: 4, eaters: 3.2 }, friends: { people: 4, eaters: 4 } };

function hotelNightPrice(itinerary, stay, prefs, hotelData) {
  const key = stayKey(itinerary, stay);
  const own = prefs.hotels && prefs.hotels[key];
  if (own && own.eur) return { eur: own.eur, how: "picked" };
  const list = hotelData && hotelData.areas && hotelData.areas[key];
  const prices = (list || []).map(h => (h.prices && h.prices.length) ? Math.min(...h.prices.map(p => p.eur)) : null)
    .filter(v => v != null).sort((a, b) => a - b);
  if (prices.length >= 2) {
    const pick = prefs.budget === "economy" ? prices.slice(0, 3)
      : prefs.budget === "luxury" ? prices.slice(-3)
      : [prices[Math.floor(prices.length / 2)]];
    return { eur: pick.reduce((a, b) => a + b, 0) / pick.length, how: "area" };
  }
  const lvl = PRICE_LEVEL[itinerary.country.id] || PRICE_LEVEL.france;
  const b = prefs.budget === "economy" ? 0 : prefs.budget === "luxury" ? 2 : 1;
  return { eur: lvl.hotel[b], how: "typical" };
}

function estimateBudget(itinerary, prefs, hotelData) {
  const country = itinerary.country.id;
  const lvl = PRICE_LEVEL[country] || PRICE_LEVEL.france;
  const party = PARTY[prefs.travelerType] || PARTY.couple;
  const rooms = (STAY_GUESTS[prefs.travelerType] || STAY_GUESTS.couple).rooms;
  const b = prefs.budget === "economy" ? 0 : prefs.budget === "luxury" ? 2 : 1;
  const days = itinerary.days.length;

  // Stays: one per run of days in the same area; the last day is the way home
  let hotel = 0, nights = 0, hotelHow = new Set();
  const seen = new Set();
  itinerary.days.forEach((d, i) => {
    const stay = getStayForDay(itinerary, i);
    if (!stay || seen.has(stay.firstDay)) return;
    seen.add(stay.firstDay);
    const n = Math.max(0, Math.min(stay.nights, days - 1 - stay.startOffset) );
    if (!n) return;
    const price = hotelNightPrice(itinerary, stay, prefs, hotelData);
    hotel += price.eur * n * rooms;
    nights += n;
    hotelHow.add(price.how);
  });
  if (days === 1) nights = 0;

  const tickets = itinerary.days.reduce((t, d) => t + d.stops.reduce((a, s) => a + ticketEstimate(s.place, country), 0), 0) * party.people;
  const food = lvl.food[b] * days * party.eaters;
  const local = lvl.local * days * party.people * (prefs.budget === "luxury" ? 2 : 1);

  // Trips between areas (train or bus)
  let intercity = 0;
  for (let i = 1; i < days; i++) {
    const a = itinerary.days[i - 1], c = itinerary.days[i];
    if (a.regionId === c.regionId || !a.stops.length || !c.stops.length) continue;
    const km = geoDistanceKm(a.stops[a.stops.length - 1].place, c.stops[0].place);
    intercity += Math.max(10, km * 0.12) * party.people;
  }

  const total = hotel + tickets + food + local + intercity;
  return {
    total, perPerson: total / party.people, people: party.people, nights, rooms,
    parts: { hotel, tickets, food, local, intercity },
    hotelHow: [...hotelHow]
  };
}

// ---------- calendar export (.ics) ----------
function icsEscape(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1"); }
function icsFold(line) {
  const out = [];
  let s = line;
  while (s.length > 74) { out.push(s.slice(0, 74)); s = " " + s.slice(74); }
  out.push(s);
  return out.join("\r\n");
}
function buildIcs(itinerary, prefs, isTr) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GlobePlanner//Trip//TR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsEscape("GlobePlanner: " + (isTr ? itinerary.country.nameTr : itinerary.country.nameEn))}`];
  itinerary.days.forEach((day, di) => {
    const date = tripDate(prefs.startDate, di);
    const ymd = isoDate(date).replace(/-/g, "");
    const times = scheduleDay(day, di, prefs, itinerary.country.id);
    day.stops.forEach((s, si) => {
      const p = s.place;
      const hm = (m) => fmtClock(m).replace(":", "") + "00";
      const prev = si === 0 ? day.hotel : day.stops[si - 1].place;
      const legText = prev ? describeLeg(prev, p, isTr).text : "";
      const desc = [isTr ? p.descTr : p.descEn,
        (isTr ? "İpucu: " : "Tip: ") + (isTr ? p.insiderTipTr : p.insiderTipEn),
        (isTr ? "En yakın durak: " : "Nearest stop: ") + (isTr ? p.transitTr : p.transitEn),
        legText ? (isTr ? "Buraya ulaşım: " : "Getting here: ") + legText : ""].filter(Boolean).join("\n");
      lines.push("BEGIN:VEVENT",
        `UID:gp-${ymd}-${p.id}@globeplanner`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${ymd}T${hm(times[si].start)}`,
        `DTEND:${ymd}T${hm(times[si].end)}`,
        icsFold(`SUMMARY:${icsEscape(isTr ? p.nameTr : p.nameEn)}`),
        icsFold(`LOCATION:${icsEscape(isTr ? p.nameTr : p.nameEn)}`),
        `GEO:${p.lat.toFixed(5)};${p.lng.toFixed(5)}`,
        icsFold(`DESCRIPTION:${icsEscape(desc)}`),
        "END:VEVENT");
    });
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

// ---------- currencies: prices are stored in EUR and shown in the traveller's currency ----------
const LOCAL_CURRENCY = { turkey: "TRY", uk: "GBP", japan: "JPY", usa: "USD", egypt: "EGP", uae: "AED", thailand: "THB",
  brazil: "BRL", switzerland: "CHF", czechia: "CZK", norway: "NOK", iceland: "ISK" };
const CURRENCY_NAMES = {
  EUR: ["Euro", "Euro"], TRY: ["Türk lirası", "Turkish lira"], USD: ["ABD doları", "US dollar"], GBP: ["Sterlin", "British pound"],
  JPY: ["Japon yeni", "Japanese yen"], EGP: ["Mısır lirası", "Egyptian pound"], AED: ["BAE dirhemi", "UAE dirham"],
  THB: ["Tayland bahtı", "Thai baht"], BRL: ["Brezilya reali", "Brazilian real"], CHF: ["İsviçre frangı", "Swiss franc"],
  CZK: ["Çek korunası", "Czech koruna"], NOK: ["Norveç kronu", "Norwegian krone"], ISK: ["İzlanda kronu", "Icelandic króna"]
};
// Used only if no live rate can be fetched (rates of 17 Nov 2026)
const FALLBACK_RATES = { EUR: 1, USD: 1.1, GBP: 0.834, TRY: 55.5, JPY: 176, EGP: 59.1, AED: 4.04, THB: 37.3, BRL: 6.29,
  CHF: 0.924, CZK: 24.4, NOK: 10.6, ISK: 137 };
const FX = { rates: Object.assign({}, FALLBACK_RATES), live: false, date: "" };
const FX_CACHE_KEY = "gp_fx_v1";

async function loadRates() {
  try {
    const hit = JSON.parse(localStorage.getItem(FX_CACHE_KEY) || "null");
    if (hit && Date.now() - hit.t < 12 * 3600e3) { Object.assign(FX, { rates: hit.rates, live: true, date: hit.date }); return FX; }
  } catch (e) { /* no cache */ }
  const save = (rates, date) => {
    Object.assign(FX, { rates: Object.assign({}, FALLBACK_RATES, rates, { EUR: 1 }), live: true, date });
    try { localStorage.setItem(FX_CACHE_KEY, JSON.stringify({ t: Date.now(), rates: FX.rates, date })); } catch (e) { /* full */ }
  };
  try {
    const j = await fetchJson("https://open.er-api.com/v6/latest/EUR");
    if (j && j.rates) { save(j.rates, (j.time_last_update_unix ? new Date(j.time_last_update_unix * 1000) : new Date()).toISOString().slice(0, 10)); return FX; }
  } catch (e) { /* try the next source */ }
  try {
    const j = await fetchJson("https://api.frankfurter.app/latest?from=EUR");
    if (j && j.rates) { save(j.rates, j.date || ""); return FX; }
  } catch (e) { /* keep fallback rates */ }
  return FX;
}

function currencyOptions(countryId) {
  const list = ["EUR", "TRY", "USD", "GBP"];
  const local = LOCAL_CURRENCY[countryId];
  if (local && !list.includes(local)) list.push(local);
  return list;
}

// Format an amount given in EUR in the chosen currency
function money(eur, cur, isTr) {
  if (!FX.rates[cur]) cur = "EUR";
  const v = eur * FX.rates[cur];
  const big = Math.abs(v) >= 1000 || cur === "JPY" || cur === "ISK";
  const rounded = big && Math.abs(v) >= 10000 ? Math.round(v / 10) * 10 : Math.round(v);
  try {
    return new Intl.NumberFormat(isTr ? "tr-TR" : "en-GB", { style: "currency", currency: cur, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(rounded);
  } catch (e) {
    return `${rounded.toLocaleString(isTr ? "tr-TR" : "en-GB")} ${cur}`;
  }
}
