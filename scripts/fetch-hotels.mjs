// Fetches hotels near every stay area of GlobePlanner from Xotelo (TripAdvisor-based data):
// name, type, photo, rating, review count, location and a sample nightly price per booking site.
// Runs in GitHub Actions (the browser can't call Xotelo directly) and writes data/hotels.json.
//
//   node scripts/fetch-hotels.mjs
//
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const API = "https://data.xotelo.com/api";

// TripAdvisor city keys for each stay area (verified against Xotelo results)
const CITY = {
  istanbul: "g293974", paris: "g187147", barcelona: "g187497", madrid: "g187514", berlin: "g187323",
  london: "g186338", rome: "g187791", vienna: "g190454", amsterdam: "g188590", athens: "g189400",
  tokyo: "g298184", kyoto: "g298564", nyc: "g60763", dc: "g28970", cairo: "g294201", giza: "g294202",
  luxor: "g294205", alexandria: "g295398", dubai: "g295424", abudhabi: "g294013", bangkok: "g293916",
  rio: "g303506", zurich: "g188113", lausanne: "g188107", interlaken: "g188081", lucerne: "g188064",
  bern: "g188052", zermatt: "g188098", lisbon: "g189158", porto: "g189180", lagos: "g189117",
  sintra: "g189164", prague: "g274707", oslo: "g190479", bergen: "g190502", tromso: "g190475",
  stavanger: "g190510", reykjavik: "g189970", vik: "g189978", stykkisholmur: "g189983"
};

const ZONE_CITY = {
  turkey: { sultanahmet: "istanbul", beyoglu_karakoy: "istanbul", besiktas_bosphorus: "istanbul", kadikoy_moda: "istanbul", fatih_balat: "istanbul", uskudar_camlica: "istanbul" },
  france: { eiffel_seine: "paris", louvre_central: "paris", marais_nightlife: "paris", montmartre_bohemian: "paris", left_bank: "paris" },
  spain: { gaudi_eixample: "barcelona", gothic_born: "barcelona", barceloneta_beach: "barcelona", montjuic: "barcelona", madrid_centro: "madrid" },
  germany: { mitte_historic: "berlin", kreuzberg_nightlife: "berlin", tiergarten_views: "berlin", museum_island: "berlin", charlottenburg: "berlin" },
  uk: { westminster_thames: "london", soho_covent: "london", city_tower: "london", south_kensington: "london", greenwich: "london" },
  italy: { colosseo_forum: "rome", trevi_pantheon: "rome", trastevere_nightlife: "rome", vatican_borgo: "rome", centro_storico: "rome", spagna_borghese: "rome", monti_testaccio: "rome" },
  austria: { innere_stadt: "vienna", schonbrunn_palace: "vienna", donaukanal_nightlife: "vienna", museumsquartier: "vienna" },
  netherlands: { canal_ring: "amsterdam", dam_central: "amsterdam", leidseplein_nightlife: "amsterdam", museumplein: "amsterdam", de_pijp_oost: "amsterdam" },
  greece: { acropolis_plaka: "athens", gazi_nightlife: "athens", lycabettus_views: "athens", syntagma_kolonaki: "athens", riviera_sounion: "athens" },
  japan: { asakusa_ueno: "tokyo", shinjuku_shibuya: "tokyo", tsukiji_ginza: "tokyo", harajuku_roppongi: "tokyo", kyoto: "kyoto" },
  usa: { midtown_broadway: "nyc", village_soho: "nyc", downtown_bridge: "nyc", brooklyn: "nyc", upper_manhattan: "nyc", washington_dc: "dc" },
  egypt: { giza_pyramids: "giza", islamic_cairo: "cairo", nile_zamalek: "cairo", downtown_cairo: "cairo", coptic_cairo: "cairo", luxor: "luxor", alexandria: "alexandria" },
  uae: { downtown_burj: "dubai", marina_jbr: "dubai", old_creek: "dubai", jumeirah: "dubai", abu_dhabi: "abudhabi" },
  thailand: { rattanakosin_temples: "bangkok", khao_san_nightlife: "bangkok", chinatown_food: "bangkok", sukhumvit_silom: "bangkok" },
  brazil: { corcovado_centro: "rio", copacabana_ipanema: "rio", sugarloaf_urca: "rio", santa_teresa: "rio", leblon_lagoa: "rio" },
  switzerland: { zurich_oldtown: "zurich", geneva_lake: "lausanne", interlaken_adventure: "interlaken", lucerne_region: "lucerne", bern_region: "bern", alps_valais: "zermatt" },
  portugal: { lisbon_history: "lisbon", porto_wine: "porto", algarve_coast: "lagos", sintra_cascais: "sintra" },
  czechia: { prague_oldtown: "prague", mala_strana: "prague" },
  norway: { oslo_city: "oslo", bergen_fjord: "bergen", northern_norway: "tromso", stavanger: "stavanger" },
  iceland: { reykjavik_city: "reykjavik", south_coast: "vik", snaefellsnes: "stykkisholmur" }
};

const PER_ZONE = 8;           // hotels kept per area
const PRICED_PER_ZONE = 8;    // hotels we ask prices for
const DEADLINE = Date.now() + 30 * 60 * 1000; // stop asking for prices after 30 min

// ---------- load the site's own place data to get each area's centre ----------
function loadSiteData() {
  const ctx = { window: {}, console };
  ctx.window = ctx;
  vm.createContext(ctx);
  const files = ["data.js", "places-core.js", "places-1.js", "places-2.js", "places-3.js", "places-4.js", "places-5.js"];
  let src = "";
  for (const f of files) src += fs.readFileSync(path.join(ROOT, "js", f), "utf8") + "\n";
  src += "\nthis.__D = CURATED_DESTINATIONS;";
  vm.runInContext(src, ctx);
  return ctx.__D;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const km = (a, b) => {
  const R = 6371, t = d => d * Math.PI / 180;
  const h = Math.sin(t(b.lat - a.lat) / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(t(b.lng - a.lng) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

async function getJson(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "GlobePlanner school project (github.com/metedogan-tech/gylobeplanner)" }, signal: AbortSignal.timeout(20000) });
      if (res.ok) {
        const j = await res.json();
        if (!j.error) return j.result;
      }
    } catch (e) { /* retry */ }
    await sleep(1500 * (i + 1));
  }
  return null;
}

function smallImage(url) {
  // TripAdvisor serves sizes: photo-o (original) / photo-w (wide) / photo-s (small)
  return url ? url.replace("/photo-o/", "/photo-w/") : "";
}

async function main() {
  const D = loadSiteData();
  const cityCache = {};
  const out = {};

  // check that the currency we want is supported, fall back to EUR
  const checkin = new Date(Date.now() + 30 * 864e5);
  const checkout = new Date(checkin.getTime() + 864e5);
  const iso = d => d.toISOString().slice(0, 10);

  for (const [country, zones] of Object.entries(ZONE_CITY)) {
    for (const [zone, city] of Object.entries(zones)) {
      const ds = D[country];
      const places = ds ? ds.places.filter(p => p.zone === zone) : [];
      if (!places.length) continue;
      const center = { lat: places.reduce((a, p) => a + p.lat, 0) / places.length, lng: places.reduce((a, p) => a + p.lng, 0) / places.length };

      if (!cityCache[city]) {
        const list = [];
        for (const offset of [0, 100]) {
          const r = await getJson(`${API}/list?location_key=${CITY[city]}&limit=100&offset=${offset}&sort=best_value`);
          await sleep(400);
          if (!r || !r.list || !r.list.length) break;
          list.push(...r.list);
          if (list.length >= r.total_count) break;
        }
        cityCache[city] = list.filter(h => h.geo && h.name && h.key).map(h => ({
          key: h.key, name: h.name, type: h.accommodation_type || "Hotel",
          rating: h.review_summary ? h.review_summary.rating : null,
          reviews: h.review_summary ? h.review_summary.count : 0,
          lat: h.geo.latitude, lng: h.geo.longitude,
          image: smallImage(h.image), url: h.url
        }));
        console.log(`${city}: ${cityCache[city].length} hotels`);
      }
      const all = cityCache[city];
      if (!all.length) continue;

      // Hotels near this area; widen the circle when the area is sparse
      let near = [];
      for (const r of [1.5, 3, 6, 15, 40]) {
        near = all.filter(h => km(center, h) <= r);
        if (near.length >= PER_ZONE) break;
      }
      if (near.length < 3) near = all.slice().sort((a, b) => km(center, a) - km(center, b)).slice(0, PER_ZONE);

      // Well-reviewed first (rating weighted by how many reviews it has)
      near.sort((a, b) => ((b.rating || 0) * Math.log10((b.reviews || 0) + 10)) - ((a.rating || 0) * Math.log10((a.reviews || 0) + 10)));
      const picked = near.slice(0, PER_ZONE).map(h => ({ ...h, distanceKm: +km(center, h).toFixed(2) }));

      // Sample prices: 1 night, 2 adults, 30 days from now
      for (const h of picked.slice(0, PRICED_PER_ZONE)) {
        if (Date.now() > DEADLINE) break;
        const r = await getJson(`${API}/rates?hotel_key=${h.key}&chk_in=${iso(checkin)}&chk_out=${iso(checkout)}&currency=EUR&adults=2&rooms=1`, 2);
        await sleep(350);
        if (r && Array.isArray(r.rates) && r.rates.length) {
          const rates = r.rates.filter(x => x.rate > 0).map(x => ({ site: x.name, eur: Math.round(x.rate) })).sort((a, b) => a.eur - b.eur);
          if (rates.length) h.prices = rates.slice(0, 4);
        }
      }
      out[`${country}:${zone}`] = picked;
      console.log(`${country}:${zone} -> ${picked.length} hotels, ${picked.filter(h => h.prices).length} priced`);
    }
    save(out, iso(checkin), iso(checkout)); // keep what we have even if a later country fails
  }
  save(out, iso(checkin), iso(checkout));
  console.log("areas:", Object.keys(out).length);
}

function save(out, checkin, checkout) {
  // Keep yesterday's data for any area we couldn't refresh today
  let previous = {};
  try { previous = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "hotels.json"), "utf8")).areas || {}; } catch (e) { /* first run */ }
  const payload = {
    updated: new Date().toISOString(),
    sample: { checkin, checkout, adults: 2, currency: "EUR" },
    source: "Xotelo (TripAdvisor data)",
    areas: Object.assign({}, previous, out)
  };
  fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "data", "hotels.json"), JSON.stringify(payload));
}

main().catch(e => { console.error(e); process.exit(1); });
