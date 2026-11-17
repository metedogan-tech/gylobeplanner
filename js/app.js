// Main Application Logic & UI Controller for GlobePlanner
let currentLanguage = "tr";
let currentStep = 1;
const totalSteps = 4;

// User state
const userState = {
  country: "turkey",
  days: 3,
  travelerType: "couple",
  interests: ["history", "food", "views"],
  pace: "balanced",
  budget: "moderate",
  startDate: "",
  hotels: {},        // stay area key -> { name, lat, lng, address, source }
  bookingMode: {},   // stay area key -> "own" (has a booking) | "none" (wants suggestions)
  swaps: {},         // original place id -> place the traveller chose instead
  rejected: [],      // places the traveller swapped out (never suggested again)
  currency: ""       // "" = automatic (TRY in Turkish, EUR in English)
};

// ---------- Remember where the traveller left off (survives a page refresh) ----------
const STATE_KEY = "gp_state_v1";
let planVisible = false;

// The hero button leads back to an open plan instead of starting again
function syncHeroCta() {
  const span = document.querySelector("#hero-start-btn span");
  if (!span) return;
  const tr = currentLanguage === "tr";
  span.textContent = planVisible ? (tr ? "Planıma git" : "Go to my plan") : (tr ? "Planımı oluştur" : "Build my plan");
  // Budget cards show the money sign of the page language
  document.querySelectorAll(".budget-mark").forEach((m, i) => { m.textContent = (tr ? "₺" : "€").repeat(i + 1); });
}

function saveState() {
  syncHeroCta();
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      v: 1, userState, planVisible, activeDayIndex, currentStep, lang: currentLanguage
    }));
  } catch (e) { /* storage unavailable: nothing to do */ }
}

function loadSavedState() {
  try {
    return applySavedState(JSON.parse(localStorage.getItem(STATE_KEY) || "null"));
  } catch (e) { return null; }
}

function applySavedState(raw) {
  try {
    if (!raw || raw.v !== 1 || !raw.userState) return null;
    const u = raw.userState;
    if (u.country && COUNTRIES_REGISTRY.some(c => c.id === u.country)) userState.country = u.country;
    if ([1, 2, 3, 5, 7].includes(u.days)) userState.days = u.days;
    if (["solo", "couple", "family", "friends"].includes(u.travelerType)) userState.travelerType = u.travelerType;
    if (Array.isArray(u.interests) && u.interests.length) userState.interests = u.interests.filter(i => ["history", "food", "views", "bazaars", "art", "nightlife"].includes(i));
    if (!userState.interests.length) userState.interests = ["history", "food", "views"];
    if (["relaxed", "balanced", "fast"].includes(u.pace)) userState.pace = u.pace;
    if (["economy", "moderate", "luxury"].includes(u.budget)) userState.budget = u.budget;
    const today = new Date().toISOString().slice(0, 10);
    userState.startDate = typeof u.startDate === "string" && u.startDate >= today ? u.startDate : "";
    userState.hotels = u.hotels && typeof u.hotels === "object" ? u.hotels : {};
    userState.bookingMode = u.bookingMode && typeof u.bookingMode === "object" ? u.bookingMode : {};
    userState.swaps = u.swaps && typeof u.swaps === "object" ? u.swaps : {};
    userState.rejected = Array.isArray(u.rejected) ? u.rejected.slice(-200) : [];
    userState.currency = typeof u.currency === "string" && CURRENCY_NAMES[u.currency] ? u.currency : "";
    return raw;
  } catch (e) { return null; }
}

// Make the wizard cards show the saved choices
function syncSelectionUI() {
  document.querySelectorAll("[data-pref]").forEach(card => {
    const pref = card.dataset.pref, val = card.dataset.val;
    let on;
    if (pref === "interests") on = userState.interests.includes(val);
    else if (pref === "days") on = String(userState.days) === val;
    else on = userState[pref] === val;
    card.classList.toggle("selected", !!on);
  });
}

let currentItinerary = null;
let activeDayIndex = 0;
let mapInstance = null;
let mapMarkers = [];
let routePolyline = null;

// Safe icon generator helper (never throws)
function safeCreateIcons() {
  try {
    if (typeof lucide !== "undefined" && lucide && typeof lucide.createIcons === "function") {
      lucide.createIcons();
    }
  } catch (err) {
    console.warn("Lucide icon generation skipped:", err);
  }
}

// String normalization for foolproof Turkish & English search
function normalizeStr(str) {
  return (str || "")
    .toString()
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .trim();
}

// Initialize Universal Planner
const planner = new UniversalTripPlanner(CURATED_DESTINATIONS, COUNTRIES_REGISTRY);

// The cities each country's plans actually cover
const CITY_LABELS = {
  turkey: ["İstanbul", "Istanbul"], france: ["Paris & Versay", "Paris & Versailles"], spain: ["Barselona & Madrid", "Barcelona & Madrid"],
  germany: ["Berlin & Potsdam", "Berlin & Potsdam"], uk: ["Londra", "London"], italy: ["Roma", "Rome"], austria: ["Viyana & Wachau", "Vienna & Wachau"],
  netherlands: ["Amsterdam", "Amsterdam"], greece: ["Atina", "Athens"], japan: ["Tokyo & Kyoto", "Tokyo & Kyoto"],
  usa: ["New York & Washington", "New York & Washington"], egypt: ["Kahire, Luksor & İskenderiye", "Cairo, Luxor & Alexandria"],
  uae: ["Dubai & Abu Dabi", "Dubai & Abu Dhabi"], thailand: ["Bangkok & Ayutthaya", "Bangkok & Ayutthaya"], brazil: ["Rio de Janeiro", "Rio de Janeiro"],
  switzerland: ["Zürih, Luzern, Cenevre & Alpler", "Zurich, Lucerne, Geneva & the Alps"], portugal: ["Lizbon, Porto & Algarve", "Lisbon, Porto & the Algarve"],
  czechia: ["Prag & Çeski Krumlov", "Prague & Český Krumlov"], norway: ["Oslo, Bergen & Tromsø", "Oslo, Bergen & Tromsø"], iceland: ["Reykjavik & güney kıyısı", "Reykjavík & the south coast"]
};
function cityLabel(c) {
  const l = CITY_LABELS[c.id];
  return l ? l[currentLanguage === "tr" ? 0 : 1] : c.capital;
}

document.addEventListener("DOMContentLoaded", () => {
  const shared = readSharedLink();
  const saved = shared || loadSavedState();
  if (saved && (saved.lang === "en" || saved.lang === "tr")) currentLanguage = saved.lang;
  initTranslations();
  initLanguageSwitcher();
  initDestinationSelector();
  initWizardNavigation();
  initOptionSelections();
  initActionButtons();
  initThemeToggle();
  initTripBar();
  initCurrencyNav();
  loadRates().then(() => { renderCurrencyNav(); if (planVisible && currentItinerary) renderItinerary(currentItinerary); });
  selectCountry(userState.country);
  safeCreateIcons();

  // Dynamically update country count label (e.g. "20+")
  const countLabel = document.getElementById("country-count-label");
  if (countLabel) countLabel.textContent = getCountryCountLabel();

  // Continue where the traveller left off
  syncSelectionUI();
  if (shared) {
    history.replaceState(null, "", location.pathname + location.search);
    saveState();
    setTimeout(() => showToast(currentLanguage === "tr" ? "Paylaşılan plan açıldı." : "Shared plan opened."), 600);
  }
  if (saved) {
    if (saved.planVisible) {
      generateAndDisplayPlan({ restore: true, dayIndex: saved.activeDayIndex });
    } else if (saved.currentStep > 1 && saved.currentStep <= totalSteps) {
      goToStep(saved.currentStep);
    }
  }
});

// Light / dark theme: follows the device until the traveller picks one, then remembers it
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const label = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const isTr = currentLanguage === "tr";
    btn.setAttribute("aria-label", dark ? (isTr ? "Açık temaya geç" : "Switch to light theme") : (isTr ? "Karanlık temaya geç" : "Switch to dark theme"));
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
  };
  label();
  btn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("gp_theme", next); } catch (e) { /* storage unavailable */ }
    label();
  });
  document.addEventListener("gp:lang", label);
}

// Country count shown as a rounded-down "N+" label (33 -> "30+", 44 -> "40+")
function getCountryCountLabel() {
  const n = (typeof COUNTRIES_REGISTRY !== "undefined") ? COUNTRIES_REGISTRY.length : 0;
  if (n < 10) return String(n);
  return (Math.floor(n / 10) * 10) + "+";
}

// Destination / Country Selector
function initDestinationSelector() {
  renderPopularCountries();
  populateAllCountriesSelect();

  // Search input filter
  const searchInput = document.getElementById("country-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value;
      renderPopularCountries(q);
    });
  }

  // All countries dropdown change
  const allSelect = document.getElementById("all-countries-select");
  if (allSelect) {
    allSelect.addEventListener("change", (e) => {
      selectCountry(e.target.value);
    });
  }

  // Change Country Button in Wizard
  const changeBtn = document.getElementById("change-country-btn");
  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      const destSection = document.getElementById("destination-section");
      if (destSection) {
        destSection.scrollIntoView({ behavior: "smooth" });
        const input = document.getElementById("country-search-input");
        if (input) input.focus();
      }
    });
  }
}

function renderPopularCountries(filterText = "") {
  const container = document.getElementById("popular-countries-grid");
  const countBadge = document.getElementById("country-results-count");
  if (!container) return;
  container.innerHTML = "";

  const isTr = currentLanguage === "tr";
  const featuredIds = ["turkey", "austria", "netherlands", "italy", "france", "spain", "germany", "uk", "greece", "japan"];
  
  const normQuery = normalizeStr(filterText);
  let countriesToShow = [];

  if (normQuery.length > 0) {
    countriesToShow = COUNTRIES_REGISTRY.filter(c => {
      const nameTr = normalizeStr(c.nameTr);
      const nameEn = normalizeStr(c.nameEn);
      const capital = normalizeStr(c.capital + " " + (CITY_LABELS[c.id] || []).join(" "));
      const id = normalizeStr(c.id);
      return nameTr.includes(normQuery) || nameEn.includes(normQuery) || capital.includes(normQuery) || id.includes(normQuery);
    });

    if (countBadge) {
      countBadge.textContent = `${countriesToShow.length} ${isTr ? 'ülke bulundu' : 'countries found'}`;
    }
  } else {
    countriesToShow = COUNTRIES_REGISTRY.filter(c => featuredIds.includes(c.id));
    if (countBadge) {
      countBadge.textContent = "";
    }
  }

  if (countriesToShow.length === 0) {
    container.innerHTML = `
      <div class="country-empty">
        <strong>${isTr ? 'Bu isimde bir ülke yok.' : 'No country matches that name.'}</strong>
        ${isTr ? `Aşağıdaki listeden ${getCountryCountLabel()} ülkenin hepsine bakabilirsin.` : `You can browse all ${getCountryCountLabel()} countries in the list below.`}
      </div>
    `;
    return;
  }

  countriesToShow.forEach(c => {
    const isSelected = c.id === userState.country;
    const name = isTr ? c.nameTr : c.nameEn;

    const card = document.createElement("button");
    card.type = "button";
    card.className = `country-tile${isSelected ? " is-selected" : ""}`;
    card.dataset.countryId = c.id;
    card.setAttribute("aria-pressed", isSelected ? "true" : "false");
    card.innerHTML = `
      <span class="flag" aria-hidden="true">${c.flag}</span>
      <span class="min-w-0">
        <span class="name">${name}</span>
        <span class="cap">${cityLabel(c)}</span>
      </span>
    `;
    card.addEventListener("click", () => selectCountry(c.id));
    container.appendChild(card);
  });
}

function populateAllCountriesSelect() {
  const select = document.getElementById("all-countries-select");
  if (!select) return;
  select.innerHTML = "";

  const isTr = currentLanguage === "tr";
  
  // Sort alphabetically
  const sorted = [...COUNTRIES_REGISTRY].sort((a, b) => {
    const nameA = isTr ? a.nameTr : a.nameEn;
    const nameB = isTr ? b.nameTr : b.nameEn;
    return nameA.localeCompare(nameB);
  });

  sorted.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    const name = isTr ? c.nameTr : c.nameEn;
    opt.textContent = `${c.flag} ${name} (${cityLabel(c)})`;
    if (c.id === userState.country) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
}

function selectCountry(countryId) {
  const country = COUNTRIES_REGISTRY.find(c => c.id === countryId);
  if (!country) return;

  userState.country = countryId;
  saveState();
  renderCurrencyNav();
  const isTr = currentLanguage === "tr";
  const name = isTr ? country.nameTr : country.nameEn;

  // Re-render popular grid with new selection state
  const searchInput = document.getElementById("country-search-input");
  renderPopularCountries(searchInput ? searchInput.value : "");

  // Update Select Dropdown
  const select = document.getElementById("all-countries-select");
  if (select && select.value !== countryId) {
    select.value = countryId;
  }

  // Update Hero preview badge
  const heroFlag = document.getElementById("hero-selected-flag");
  const heroCountry = document.getElementById("hero-selected-country");
  const heroCapital = document.getElementById("hero-selected-capital");

  if (heroFlag) heroFlag.textContent = country.flag;
  if (heroCountry) heroCountry.textContent = name;
  if (heroCapital) heroCapital.textContent = cityLabel(country);

  // Update Wizard banner
  const wizardFlag = document.getElementById("wizard-flag");
  const wizardName = document.getElementById("wizard-country-name");

  if (wizardFlag) wizardFlag.textContent = country.flag;
  if (wizardName) wizardName.textContent = `${name} (${cityLabel(country)})`;

  // Re-render Survival Guide and the hero sample line for this country
  renderSurvivalGuide();
  renderHeroLine();

  // If map exists and plan was already generated, re-center map
  if (mapInstance && currentItinerary) {
    mapInstance.setView([country.lat, country.lng], country.zoom || 13);
  }
}

// Survival Guide Renderer
function renderSurvivalGuide() {
  const container = document.getElementById("survival-guide-cards");
  if (!container) return;
  container.innerHTML = "";

  const isTr = currentLanguage === "tr";
  const countryId = userState.country;
  const country = COUNTRIES_REGISTRY.find(c => c.id === countryId) || COUNTRIES_REGISTRY[0];

  let tips = COUNTRY_SURVIVAL_GUIDES[countryId];
  if (!tips) {
    // Universal Smart Survival Guide for any other country
    tips = [
      {
        titleTr: `${country.nameTr} Şehir İçi Ulaşım & Kartları`,
        titleEn: `Public Transit & City Passes in ${country.nameEn}`,
        descTr: `Başkent ${country.capital} içinde 24 veya 72 saatlik sınırsız turist ulaşım kartı almak bütçenizi korur.`,
        descEn: `A 24 or 72-hour unlimited tourist transit pass in ${country.capital} saves significant money over single tickets.`
      },
      {
        titleTr: `Para Birimi & Kart Kullanımı`,
        titleEn: `Currency & Card Acceptance`,
        descTr: `Temassız kredi kartları şehir merkezlerinde yaygın olarak geçerlidir. Küçük yerel pazarlar için ufak miktarda nakit bulundurun.`,
        descEn: `Contactless cards are widely accepted. Carry modest cash for local open-air markets and minor tips.`
      },
      {
        titleTr: `Müze & Saraylarda Önceden Rezervasyon`,
        titleEn: `Advance Bookings for Major Attractions`,
        descTr: `Milli saray ve popüler müzelerde uzun bilet sıralarından kaçınmak için online saatli bilet ayırtın.`,
        descEn: `Reserve timed-entry tickets online in advance to bypass long ticket lines at royal palaces and state museums.`
      },
      {
        titleTr: `Acil Durum & Yerel İletişim`,
        titleEn: `Emergency Numbers & Local Advice`,
        descTr: `Avrupa genelinde acil durum numarası 112'dir. Resmi Turizm Danışma ofislerinden ücretsiz şehir haritası alabilirsiniz.`,
        descEn: `112 is the universal emergency number across Europe. Grab a free paper map from official tourist info offices.`
      }
    ];
  }

  tips.forEach(t => {
    const title = isTr ? t.titleTr : t.titleEn;
    const desc = isTr ? t.descTr : t.descEn;
    const item = document.createElement("div");
    item.className = "guide-item";
    item.innerHTML = `
      <span class="guide-pin" aria-hidden="true"></span>
      <div>
        <h4>${title}</h4>
        <p>${desc}</p>
      </div>
    `;
    container.appendChild(item);
  });

  safeCreateIcons();
}

// Translation Management
function setLanguage(lang) {
  currentLanguage = lang;
  saveState();
  document.documentElement.lang = lang;
  document.title = lang === "tr" 
    ? "GlobePlanner - Akıllı Dünya Seyahat & Tatil Planlayıcı" 
    : "GlobePlanner - Smart Global Trip & Itinerary Planner";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key].replace(/\{count\}/g, getCountryCountLabel());
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang] && translations[lang][key]) {
      el.setAttribute("placeholder", translations[lang][key]);
    }
  });

  // Update language toggle buttons UI
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
    btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
  });
  updateHeroFacts();
  document.dispatchEvent(new Event("gp:lang"));

  // Refresh country lists in new language
  populateAllCountriesSelect();
  selectCountry(userState.country);

  // If itinerary is already displayed, re-render it in new language
  if (currentItinerary) {
    renderItinerary(currentItinerary);
  }
  syncHeroCta();
  renderCurrencyNav();
}

function initTranslations() {
  setLanguage(currentLanguage);
}

function initLanguageSwitcher() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });
}

// Option Selections
function initOptionSelections() {
  // Days (single select)
  document.querySelectorAll("[data-pref='days']").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-pref='days']").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userState.days = parseInt(card.dataset.val, 10);
      saveState();
    });
  });

  // Traveler Type (single select)
  document.querySelectorAll("[data-pref='travelerType']").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-pref='travelerType']").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userState.travelerType = card.dataset.val;
      saveState();
    });
  });

  // Interests (multi select)
  document.querySelectorAll("[data-pref='interests']").forEach(card => {
    card.addEventListener("click", () => {
      const val = card.dataset.val;
      if (userState.interests.includes(val)) {
        if (userState.interests.length > 1) { // keep at least 1
          userState.interests = userState.interests.filter(i => i !== val);
          card.classList.remove("selected");
        }
      } else {
        userState.interests.push(val);
        card.classList.add("selected");
      }
      saveState();
    });
  });

  // Pace (single select)
  document.querySelectorAll("[data-pref='pace']").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-pref='pace']").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userState.pace = card.dataset.val;
      saveState();
    });
  });

  // Budget (single select)
  document.querySelectorAll("[data-pref='budget']").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-pref='budget']").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userState.budget = card.dataset.val;
      saveState();
    });
  });
}

// Wizard Step Navigation
function initWizardNavigation() {
  const btnNext = document.getElementById("btn-next");
  const btnBack = document.getElementById("btn-back");
  const btnGenerate = document.getElementById("btn-generate");
  const heroStartBtn = document.getElementById("hero-start-btn");

  if (heroStartBtn) {
    heroStartBtn.addEventListener("click", () => {
      const target = document.getElementById(planVisible && currentItinerary ? "itinerary-section" : "wizard-section");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }
  const heroChange = document.getElementById("hero-change-country");
  if (heroChange) {
    heroChange.addEventListener("click", () => {
      document.getElementById("destination-section").scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("country-search-input");
      if (input) setTimeout(() => input.focus({ preventScroll: true }), 400);
    });
  }

  btnNext.addEventListener("click", () => {
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    }
  });

  btnBack.addEventListener("click", () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });

  btnGenerate.addEventListener("click", () => {
    userState.swaps = {};
    userState.rejected = [];
    generateAndDisplayPlan();
  });
}

function goToStep(step) {
  currentStep = step;
  saveState();

  // Show/hide step panels
  for (let i = 1; i <= totalSteps; i++) {
    const panel = document.getElementById(`step-panel-${i}`);
    if (panel) {
      if (i === step) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    }

    const dot = document.getElementById(`step-dot-${i}`);
    if (dot) {
      dot.className = "step-dot" + (i < step ? " completed" : i === step ? " active" : "");
      if (i === step) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
    }
  }

  // Button visibility
  const btnBack = document.getElementById("btn-back");
  const btnNext = document.getElementById("btn-next");
  const btnGenerate = document.getElementById("btn-generate");

  if (step === 1) {
    btnBack.classList.add("invisible");
  } else {
    btnBack.classList.remove("invisible");
  }

  if (step === totalSteps) {
    btnNext.classList.add("hidden");
    btnGenerate.classList.remove("hidden");
  } else {
    btnNext.classList.remove("hidden");
    btnGenerate.classList.add("hidden");
  }

  safeCreateIcons();
}

// Generate & Render Itinerary
function finishItinerary(itinerary, hotels) {
  return applyHotelRouting(applyClosures(applySwaps(itinerary), userState.startDate), hotels);
}

// Put the traveller's own picks in place of the places they swapped out
function applySwaps(itinerary) {
  const swaps = userState.swaps || {};
  const ds = CURATED_DESTINATIONS[userState.country];
  if (!ds || !Object.keys(swaps).length) return itinerary;
  const byId = {};
  ds.places.forEach(p => { byId[p.id] = p; });
  const used = new Set();
  itinerary.days.forEach(d => d.stops.forEach(st => used.add(st.place.id)));
  itinerary.days.forEach(d => d.stops.forEach(st => {
    const to = byId[swaps[st.place.id]];
    if (!to || used.has(to.id) || isTempClosed(to, userState.startDate, itinerary.days.length)) return;
    used.delete(st.place.id);
    used.add(to.id);
    st.swappedFrom = st.place.id;
    st.place = to;
    st.timeSlot = to.timeOfDay || st.timeSlot;
  }));
  return itinerary;
}

// Pick another place for one stop: same area, not already in the trip,
// not one the traveller already turned down, open on that date,
// similar time of day and interests. opts.indoor: only indoor places.
function pickReplacement(dayIdx, stopIdx, opts, used, rejected) {
  opts = opts || {};
  const day = currentItinerary && currentItinerary.days[dayIdx];
  const stop = day && day.stops[stopIdx];
  const ds = CURATED_DESTINATIONS[userState.country];
  if (!stop || !ds) return null;
  const date = tripDate(userState.startDate, dayIdx);
  const weekday = date ? date.getDay() : null;

  const others = day.stops.filter((st, i) => i !== stopIdx).map(st => st.place);
  const ref = others.length ? {
    lat: others.reduce((t, p) => t + p.lat, 0) / others.length,
    lng: others.reduce((t, p) => t + p.lng, 0) / others.length
  } : stop.place;
  const span = Math.max(0, ...day.stops.map(st => geoDistanceKm(ref, st.place)));
  const maxKm = Math.max(opts.indoor ? 7 : 5, span * 1.3);
  const budgetOk = (p) => {
    const t = p.budgetTier || [];
    if (userState.budget === "economy") return t.includes("economy");
    if (userState.budget === "luxury") return t.includes("luxury") || t.includes("moderate");
    return true;
  };

  let best = null, bestScore = -Infinity;
  ds.places.forEach(p => {
    if (used.has(p.id) || rejected.has(p.id)) return;
    if (userState.travelerType === "family" && p.category.length === 1 && p.category[0] === "nightlife") return;
    if (isClosedOn(p, weekday)) return;
    if (isTempClosed(p, userState.startDate, currentItinerary.days.length)) return;
    if (opts.indoor && !isIndoor(p)) return;
    const km = geoDistanceKm(ref, p);
    if (km > maxKm) return;
    const score = p.category.filter(c => userState.interests.includes(c)).length * 15
      + (p.timeOfDay === stop.timeSlot ? 12 : 0)
      + (budgetOk(p) ? 8 : 0)
      - km * 3
      - (day.hotel ? geoDistanceKm(day.hotel, p) : 0);
    if (score > bestScore) { bestScore = score; best = p; }
  });
  return best;
}

function tripUsedIds() {
  const used = new Set();
  currentItinerary.days.forEach(d => d.stops.forEach(st => used.add(st.place.id)));
  return used;
}

function recordSwap(stop, picked, rejected) {
  rejected.add(stop.place.id);
  if (stop.swappedFrom) rejected.add(stop.swappedFrom);
  const original = stop.swappedFrom || stop.place.id;
  userState.swaps = Object.assign({}, userState.swaps, { [original]: picked.id });
  userState.rejected = [...rejected].slice(-200);
}

function swapStop(dayIdx, stopIdx) {
  const stop = currentItinerary && currentItinerary.days[dayIdx] && currentItinerary.days[dayIdx].stops[stopIdx];
  if (!stop) return null;
  const rejected = new Set(userState.rejected || []);
  rejected.add(stop.place.id);
  if (stop.swappedFrom) rejected.add(stop.swappedFrom);
  const best = pickReplacement(dayIdx, stopIdx, {}, tripUsedIds(), rejected);
  if (!best) return null;
  recordSwap(stop, best, rejected);
  lastSwappedId = best.id;
  refreshPlanKeepingDay();
  return best;
}

// Rainy day: trade the day's outdoor stops for indoor places nearby
function makeDayIndoor(dayIdx) {
  const day = currentItinerary && currentItinerary.days[dayIdx];
  if (!day) return 0;
  const used = tripUsedIds();
  const rejected = new Set(userState.rejected || []);
  let n = 0;
  day.stops.forEach((st, si) => {
    if (isIndoor(st.place)) return;
    const picked = pickReplacement(dayIdx, si, { indoor: true }, used, new Set([...rejected, st.place.id]));
    if (!picked) return;
    used.add(picked.id);
    recordSwap(st, picked, rejected);
    n++;
  });
  if (n) refreshPlanKeepingDay();
  return n;
}

function undoSwap(originalId) {
  const next = Object.assign({}, userState.swaps);
  delete next[originalId];
  userState.swaps = next;
  userState.rejected = (userState.rejected || []).filter(id => id !== originalId);
  lastSwappedId = originalId;
  refreshPlanKeepingDay();
}
let lastSwappedId = null;

function buildCurrentItinerary() {
  const hotels = userState.hotels || {};
  const base = planner.generateItinerary(userState);
  if (!Object.keys(hotels).length) return finishItinerary(base, hotels);

  // Second pass: re-pick each day's places around the traveller's own hotel.
  // Regions stay the same, so every day keeps its stay area and its hotel.
  const stayZones = base.days.map((d, i) => {
    const st = getStayForDay(base, i);
    return st && hotels[stayKey(base, st)] ? st.zoneKey : null;
  });
  const anchors = base.days.map((d, i) => stayZones[i] ? hotelForDay(base, i, hotels) : null);
  if (!anchors.some(Boolean)) return finishItinerary(base, hotels);

  const tuned = planner.generateItinerary(Object.assign({}, userState, { anchors }));
  const sameRegions = tuned.days.length === base.days.length &&
    tuned.days.every((d, i) => d.regionId === base.days[i].regionId);
  if (!sameRegions) return finishItinerary(base, hotels);
  tuned.days.forEach((d, i) => { if (stayZones[i]) d.stayZone = stayZones[i]; });
  return finishItinerary(tuned, hotels);
}

function generateAndDisplayPlan(opts) {
  opts = opts || {};
  currentItinerary = buildCurrentItinerary();
  activeDayIndex = opts.restore && opts.dayIndex >= 0 && opts.dayIndex < currentItinerary.days.length ? opts.dayIndex : 0;

  // Hide Wizard, Show Plan
  document.getElementById("wizard-section").classList.add("hidden");
  const planSection = document.getElementById("itinerary-section");
  planSection.classList.remove("hidden");
  planVisible = true;
  saveState();

  if (!opts.restore) {
    try {
      if (typeof confetti === "function") confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  }

  renderItinerary(currentItinerary);
  if (opts.restore) {
    setTimeout(() => planSection.scrollIntoView({ behavior: "auto" }), 50);
  } else {
    planSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Re-plan after the hotel changes, keeping the open day
function refreshPlanKeepingDay() {
  if (!currentItinerary) return;
  const keep = activeDayIndex;
  currentItinerary = buildCurrentItinerary();
  activeDayIndex = Math.min(keep, currentItinerary.days.length - 1);
  saveState();
  renderItinerary(currentItinerary);
}

const SLOT_LABELS = {
  morning: { tr: "Sabah", en: "Morning" },
  afternoon: { tr: "Öğleden sonra", en: "Afternoon" },
  sunset: { tr: "Gün batımı", en: "Sunset" },
  evening: { tr: "Akşam", en: "Evening" }
};
const CATEGORY_LABELS = {
  history: { tr: "Tarih", en: "History" },
  food: { tr: "Lezzet", en: "Food" },
  views: { tr: "Manzara", en: "Views" },
  bazaars: { tr: "Çarşı", en: "Shopping" },
  art: { tr: "Sanat", en: "Art" },
  nightlife: { tr: "Gece hayatı", en: "Nightlife" }
};

function budgetLabel(p, isTr) {
  const t = p.budgetTier || [];
  if (t.length === 1 && t[0] === "economy") return isTr ? "Ücretsiz / ucuz" : "Free / cheap";
  if (t.includes("economy")) return isTr ? "Uygun fiyatlı" : "Affordable";
  if (t.length === 1 && t[0] === "luxury") return isTr ? "Lüks" : "Luxury";
  return isTr ? "Orta bütçe" : "Mid-range";
}

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function photoMarkup(p, name) {
  const wikiAttr = encodeURIComponent(JSON.stringify(p.wiki || p.nameEn || ""));
  return `
    <span class="photo-fallback" aria-hidden="true">${escapeHtml(name)}</span>
    <img data-wiki="${wikiAttr}" alt="${escapeHtml(name)}" referrerpolicy="no-referrer" class="place-photo opacity-0 transition-opacity duration-500">
  `;
}

// Days in the same district get the same title from the planner ("... (2. Keşif)").
// Give each of them its own title from its best-known stops, and its own tab name.
function shortPlaceName(p, isTr) {
  return (isTr ? p.nameTr : p.nameEn).split(/ & | \(| - /)[0].trim();
}
function dayLabels(itinerary, isTr) {
  const base = itinerary.days.map(d => (isTr ? d.titleTr : d.titleEn)
    .replace(/^(\d+\. Gün|Day \d+):\s*/, "").replace(/\s*\((\d+\. Keşif|Part \d+)\)$/, ""));
  const count = {};
  base.forEach(t => { count[t] = (count[t] || 0) + 1; });
  const hoods = {};
  itinerary.days.forEach(d => { hoods[d.neighborhood] = (hoods[d.neighborhood] || 0) + 1; });
  return itinerary.days.map((d, i) => {
    const names = d.stops.map(s => shortPlaceName(s.place, isTr));
    const zoneShort = base[i].replace(/\s*\([^)]*\)$/, "");
    const title = count[base[i]] > 1 && names.length
      ? `${zoneShort}: ${names.slice(0, 2).join(isTr ? " ve " : " and ")}`
      : base[i];
    const tab = hoods[d.neighborhood] > 1 && names.length ? names[0] : d.neighborhood;
    return { title, tab };
  });
}

function renderItinerary(itinerary) {
  const tabsContainer = document.getElementById("day-tabs");
  const contentContainer = document.getElementById("day-content");
  tabsContainer.innerHTML = "";
  contentContainer.innerHTML = "";

  const isTr = currentLanguage === "tr";
  const country = itinerary.country;
  const countryName = country ? (isTr ? country.nameTr : country.nameEn) : "";

  const planFlag = document.getElementById("plan-country-flag");
  if (planFlag && country) planFlag.textContent = country.flag;
  const summary = document.getElementById("plan-summary");
  if (summary) {
    const n = itinerary.days.length;
    summary.textContent = isTr
      ? `${countryName}, ${n} gün, ${itinerary.totalStops} durak. Her gün tek bir bölgede.`
      : `${countryName}, ${n} days, ${itinerary.totalStops} stops. Each day stays in one area.`;
  }

  // Day tabs: each day is a line with its own colour
  const labels = dayLabels(itinerary, isTr);
  itinerary.days.forEach((day, idx) => {
    const tab = document.createElement("button");
    const isActive = idx === activeDayIndex;
    tab.type = "button";
    tab.className = "day-tab";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.style.setProperty("--day", day.color || "#2346D8");
    tab.innerHTML = `<span class="line-badge">${day.dayNumber}</span><span class="day-tab-name">${escapeHtml(labels[idx].tab)}</span>`;
    tab.addEventListener("click", () => {
      activeDayIndex = idx;
      saveState();
      renderItinerary(itinerary);
    });
    tabsContainer.appendChild(tab);
  });
  // Keep the open day's tab in view on narrow screens
  const activeTab = tabsContainer.children[activeDayIndex];
  if (activeTab && tabsContainer.scrollWidth > tabsContainer.clientWidth) {
    tabsContainer.scrollLeft = Math.max(0, activeTab.offsetLeft - tabsContainer.offsetLeft - 16);
  }

  const activeDay = itinerary.days[activeDayIndex];
  if (!activeDay) return;
  contentContainer.style.setProperty("--day", activeDay.color || "#2346D8");

  const dayTitle = labels[activeDayIndex].title;
  const dayDate = tripDate(userState.startDate, activeDayIndex);
  const times = scheduleDay(activeDay, activeDayIndex, userState, country ? country.id : "");
  const header = document.createElement("div");
  header.className = "day-header";
  header.innerHTML = `
    <div>
      <h3>${isTr ? `${activeDay.dayNumber}. gün` : `Day ${activeDay.dayNumber}`}: ${escapeHtml(dayTitle)}</h3>
      <p class="area">${escapeHtml(activeDay.neighborhood)}${dayDate ? `, ${escapeHtml(formatTripDate(dayDate, isTr))}` : ""}</p>
      ${dayDate ? `<p class="day-weather" data-weather-day="${activeDayIndex}"><span class="weather-loading">${isTr ? "Hava durumu yükleniyor" : "Loading the weather"}</span></p>` : ""}
    </div>
    <div class="day-stats">
      <div><strong>${activeDay.stats.stopsCount}</strong><span>${isTr ? "durak" : "stops"}</span></div>
      <div><strong>~${String(activeDay.stats.walkingKm).replace(".", isTr ? "," : ".")} km</strong><span>${isTr ? "toplam yol" : "total distance"}</span></div>
      <div><strong>~${activeDay.stats.estimatedHours} sa</strong><span>${isTr ? "toplam süre" : "in total"}</span></div>
    </div>
  `;
  contentContainer.appendChild(header);
  const rainBox = document.createElement("div");
  rainBox.className = "rain-box";
  rainBox.hidden = true;
  contentContainer.appendChild(rainBox);
  if (dayDate) loadDayWeather(itinerary, activeDayIndex, header.querySelector(".day-weather"), rainBox);
  const stayHost = document.createElement("div");
  stayHost.className = "stay-host";
  contentContainer.appendChild(stayHost);

  const line = document.createElement("div");
  line.className = "stops";
  const hotel = activeDay.hotel;

  const legHtml = (leg, extraClass) => `
    <div class="leg-body">
      <p class="leg-text">${escapeHtml(leg.text)}</p>
      ${leg.arrival ? `<p class="leg-arrival">${escapeHtml(leg.arrival)}</p>` : ""}
      <a class="leg-link" href="${leg.url}" target="_blank" rel="noopener">${isTr ? "Google Haritalar'da yol tarifi" : "Directions in Google Maps"}</a>
    </div>`;

  // Start of the day at the hotel
  if (hotel) {
    const first = activeDay.stops[0] && activeDay.stops[0].place;
    const startEl = document.createElement("div");
    startEl.className = "stop stop-hotel";
    startEl.innerHTML = `
      <span class="stop-node hotel-node" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 20V8"/><path d="M3 16h18v4"/><path d="M21 16v-4a3 3 0 0 0-3-3h-7v7"/><circle cx="7" cy="12" r="2"/></svg></span>
      <div class="hotel-start"><span class="hotel-start-label">${isTr ? "Güne otelinden başla" : "Start at your hotel"}</span><strong>${escapeHtml(hotel.name)}</strong></div>`;
    line.appendChild(startEl);
    if (first) {
      const leg = describeLeg(hotel, first, isTr);
      const legEl = document.createElement("div");
      legEl.className = "leg";
      legEl.innerHTML = legHtml(leg);
      line.appendChild(legEl);
    }
  }

  activeDay.stops.forEach((stop, idx) => {
    const p = stop.place;
    const name = isTr ? p.nameTr : p.nameEn;
    const slot = SLOT_LABELS[stop.timeSlot] || SLOT_LABELS.morning;
    const tags = (p.category || []).map(cat => {
      const m = CATEGORY_LABELS[cat];
      return m ? `<span class="tag">${isTr ? m.tr : m.en}</span>` : "";
    }).join("");

    const el = document.createElement("div");
    el.className = "stop" + (p.id === lastSwappedId ? " just-swapped" : "");
    const swapControls = `
      <div class="swap-row">
        <button type="button" class="swap-btn" data-swap="${idx}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h13l-3-3"/><path d="M20 17H7l3 3"/></svg>
          ${isTr ? "Bu yeri değiştir" : "Swap this place"}
        </button>
        ${stop.swappedFrom ? `<button type="button" class="swap-undo" data-undo="${escapeHtml(stop.swappedFrom)}">${isTr ? "Önerilen yere dön" : "Back to the suggested place"}</button>` : ""}
      </div>`;
    el.innerHTML = `
      <span class="stop-node" aria-hidden="true">${idx + 1}</span>
      <article class="stop-card">
        <div class="stop-photo">${photoMarkup(p, name)}</div>
        <div class="stop-body">
          <div class="stop-meta">
            <span class="slot">${fmtClock(times[idx].start)}–${fmtClock(times[idx].end)}</span>
            <span>${isTr ? `${String(p.durationHours).replace(".", ",")} saat` : `${p.durationHours} h`}</span>
          </div>
          ${closureNote(stop, p, isTr)}
          <h4 class="stop-title">${escapeHtml(name)}</h4>
          <p class="stop-desc">${escapeHtml(isTr ? p.descTr : p.descEn)}</p>
          <div class="tags">${tags}<span class="tag tag-budget">${budgetLabel(p, isTr)}</span></div>
          <p class="tip"><strong>${isTr ? "İpucu:" : "Tip:"}</strong> ${escapeHtml(isTr ? p.insiderTipTr : p.insiderTipEn)}</p>
          <p class="how"><strong>${isTr ? "En yakın durak:" : "Nearest stop:"}</strong> ${escapeHtml(isTr ? p.transitTr : p.transitEn)}</p>
          ${swapControls}
        </div>
      </article>
    `;
    line.appendChild(el);
    const swapBtn = el.querySelector("[data-swap]");
    swapBtn.addEventListener("click", () => {
      const picked = swapStop(activeDayIndex, idx);
      if (!picked) {
        swapBtn.disabled = true;
        swapBtn.textContent = isTr ? "Bu bölgede başka yer kalmadı" : "No other places left in this area";
      } else {
        showToast(isTr ? `${name} yerine ${picked.nameTr} eklendi.` : `${picked.nameEn} replaces ${name}.`);
      }
    });
    const undoBtn = el.querySelector("[data-undo]");
    if (undoBtn) undoBtn.addEventListener("click", () => undoSwap(undoBtn.dataset.undo));

    const next = activeDay.stops[idx + 1];
    if (next) {
      const leg = describeLeg(p, next.place, isTr);
      const legEl = document.createElement("div");
      legEl.className = "leg";
      legEl.innerHTML = legHtml(leg);
      line.appendChild(legEl);
    }
  });

  // Back to the hotel at the end of the day
  if (hotel && activeDay.stops.length) {
    const last = activeDay.stops[activeDay.stops.length - 1].place;
    const back = describeLeg(last, hotel, isTr);
    back.arrival = "";
    const legEl = document.createElement("div");
    legEl.className = "leg";
    legEl.innerHTML = legHtml(back);
    line.appendChild(legEl);
    const endEl = document.createElement("div");
    endEl.className = "stop stop-hotel";
    endEl.innerHTML = `
      <span class="stop-node hotel-node" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 20V8"/><path d="M3 16h18v4"/><path d="M21 16v-4a3 3 0 0 0-3-3h-7v7"/><circle cx="7" cy="12" r="2"/></svg></span>
      <div class="hotel-start"><span class="hotel-start-label">${isTr ? "Günün sonu: otele dönüş" : "End of the day: back to the hotel"}</span><strong>${escapeHtml(hotel.name)}</strong></div>`;
    line.appendChild(endEl);
  }

  contentContainer.appendChild(line);
  hydratePlaceImages(line);
  syncTripBar();
  renderBudget(itinerary);
  const swapped = line.querySelector(".just-swapped");
  if (swapped) {
    swapped.scrollIntoView({ behavior: "smooth", block: "center" });
    lastSwappedId = null;
  }
  renderStayCard(itinerary, stayHost);
  updateMap(activeDay.stops, country, activeDay.color, activeDay.hotel);
}

function closureNote(stop, p, isTr) {
  const names = WEEKDAYS[isTr ? "tr" : "en"];
  if (stop.closedOnDay) {
    const date = tripDate(userState.startDate, activeDayIndex);
    return `<p class="closed-note warn">${isTr
      ? `${escapeHtml(names[date.getDay()])} günleri kapalı ve başka güne alınamadı. "Bu yeri değiştir" ile açık bir yer seçebilirsin.`
      : `Closed on ${escapeHtml(names[date.getDay()])}s and couldn't be moved. Use "Swap this place" to pick an open one.`}</p>`;
  }
  if (stop.movedFrom != null) {
    const label = closedDaysLabel(p, isTr);
    return `<p class="closed-note moved">${label
      ? (isTr ? `${escapeHtml(label)}; bu yüzden ${stop.movedFrom + 1}. günden buraya alındı.` : `${escapeHtml(label)}, so it was moved here from day ${stop.movedFrom + 1}.`)
      : (isTr ? `${stop.movedFrom + 1}. gündeki kapalı bir yerle yer değiştirdi.` : `Swapped with a place that is closed on day ${stop.movedFrom + 1}.`)}</p>`;
  }
  const label = closedDaysLabel(p, isTr);
  return label ? `<p class="closed-note">${escapeHtml(label)}${userState.startDate ? "" : (isTr ? ". Tarih seçersen plan buna göre ayarlanır." : ". Pick dates and the plan works around it.")}</p>` : "";
}

// Weather for the open day, plus a rainy-day offer to switch to indoor places
async function loadDayWeather(itinerary, dayIdx, el, rainBox) {
  if (!el) return;
  const isTr = currentLanguage === "tr";
  const day = itinerary.days[dayIdx];
  if (!day.stops.length) { el.remove(); return; }
  const lat = day.stops.reduce((t, s) => t + s.place.lat, 0) / day.stops.length;
  const lng = day.stops.reduce((t, s) => t + s.place.lng, 0) / day.stops.length;
  // One request for every day spent in this area
  const idxs = itinerary.days.map((d, i) => i).filter(i => itinerary.days[i].regionId === day.regionId);
  const dates = idxs.map(i => isoDate(tripDate(userState.startDate, i)));
  let data = {};
  try { data = await getWeather(lat, lng, dates); } catch (e) { /* offline */ }
  if (!el.isConnected) return;
  const w = data[isoDate(tripDate(userState.startDate, dayIdx))];
  if (!w) {
    el.innerHTML = `<span class="weather-loading">${isTr ? "Bu tarih için hava bilgisi alınamadı." : "No weather available for this date."}</span>`;
    return;
  }
  el.innerHTML = weatherMarkup(w, isTr);
  el.title = w.kind === "forecast"
    ? (isTr ? "Open-Meteo hava tahmini" : "Open-Meteo forecast")
    : (isTr ? `Tahmin için çok erken: son ${w.years} yılın aynı günlerinin ortalaması (Open-Meteo)` : `Too early for a forecast: average of the same dates over the last ${w.years} years (Open-Meteo)`);
  const outdoor = day.stops.filter(s => !isIndoor(s.place)).length;
  if (isWet(w) && outdoor) {
    rainBox.hidden = false;
    rainBox.innerHTML = `
      <p>${w.kind === "forecast"
        ? (isTr ? `Bu gün yağmur bekleniyor. Plandaki ${outdoor} durak açık havada.` : `Rain is expected this day. ${outdoor} of the stops are outdoors.`)
        : (isTr ? `Bu tarihlerde sık yağmur yağıyor. Plandaki ${outdoor} durak açık havada.` : `It often rains around this date. ${outdoor} of the stops are outdoors.`)}</p>
      <button type="button" class="btn btn-ghost btn-sm" data-indoor>${isTr ? "Açık hava duraklarını kapalı mekânlarla değiştir" : "Swap outdoor stops for indoor places"}</button>`;
    rainBox.querySelector("[data-indoor]").addEventListener("click", (e) => {
      const n = makeDayIndoor(dayIdx);
      if (n) showToast(isTr ? `${n} durak kapalı mekânla değiştirildi. Geri almak için durakta "Önerilen yere dön"e bas.` : `${n} stops swapped for indoor places. Use "Back to the suggested place" to undo.`);
      else { e.target.disabled = true; e.target.textContent = isTr ? "Yakında uygun kapalı mekân kalmadı" : "No suitable indoor places left nearby"; }
    });
  }
}

// ---------- trip bar: start date + calendar ----------
function syncTripBar() {
  const input = document.getElementById("trip-start-date");
  if (input) {
    input.min = new Date().toISOString().slice(0, 10);
    if (input.value !== (userState.startDate || "")) input.value = userState.startDate || "";
  }
  const hint = document.getElementById("trip-date-hint");
  if (hint) {
    const isTr = currentLanguage === "tr";
    if (!userState.startDate) hint.textContent = isTr ? "Tarih seçersen hava durumu, kapalı günler ve saatler buna göre ayarlanır." : "Pick a date to get the weather, closing days and times for your trip.";
    else {
      const end = tripDate(userState.startDate, (currentItinerary ? currentItinerary.days.length : userState.days) - 1);
      hint.textContent = (isTr ? "Dönüş: " : "Last day: ") + formatTripDate(end, isTr);
    }
  }
}

function initTripBar() {
  const input = document.getElementById("trip-start-date");
  if (input) input.addEventListener("change", () => {
    userState.startDate = input.value || "";
    saveState();
    refreshPlanKeepingDay();
  });
  const cal = document.getElementById("btn-calendar");
  if (cal) cal.addEventListener("click", () => {
    const isTr = currentLanguage === "tr";
    if (!currentItinerary) return;
    if (!userState.startDate) {
      showToast(isTr ? "Takvime eklemek için önce gezi tarihini seç." : "Pick your trip date first.");
      if (input) { input.focus(); try { input.showPicker && input.showPicker(); } catch (e) {} }
      return;
    }
    const ics = buildIcs(currentItinerary, userState, isTr);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `globeplanner-${currentItinerary.country.id}-${userState.startDate}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    showToast(isTr ? "Takvim dosyası indirildi. Açınca tüm duraklar takvimine eklenir." : "Calendar file downloaded. Open it to add every stop to your calendar.");
  });
}

// ---------- budget ----------
function activeCurrency() {
  const opts = currencyOptions(userState.country);
  if (userState.currency && opts.includes(userState.currency)) return userState.currency;
  return currentLanguage === "tr" ? "TRY" : "EUR";
}
function formatMoney(n, isTr) {
  return money(n, activeCurrency(), isTr);
}
async function renderBudget(itinerary) {
  const box = document.getElementById("budget-card");
  if (!box) return;
  let data = null;
  try { data = await loadHotelData(); } catch (e) { /* use typical prices */ }
  if (itinerary !== currentItinerary) return;
  const isTr = currentLanguage === "tr";
  const est = estimateBudget(itinerary, userState, data);
  const p = est.parts;
  const max = Math.max(1, ...Object.values(p));
  const rows = [
    ["hotel", isTr ? `Konaklama (${est.nights} gece${est.rooms > 1 ? `, ${est.rooms} oda` : ""})` : `Stay (${est.nights} night${est.nights === 1 ? "" : "s"}${est.rooms > 1 ? `, ${est.rooms} rooms` : ""})`],
    ["food", isTr ? "Yemek ve içecek" : "Food and drinks"],
    ["tickets", isTr ? "Giriş ücretleri ve etkinlikler" : "Tickets and activities"],
    ["local", isTr ? "Şehir içi ulaşım" : "Getting around"],
    ["intercity", isTr ? "Şehirler arası tren / otobüs" : "Trains and buses between cities"]
  ].filter(([k]) => p[k] > 0.5);
  const hotelSrc = est.hotelHow.includes("picked") ? (isTr ? "seçtiğin otelin fiyatı" : "your chosen hotel's price")
    : est.hotelHow.includes("area") ? (isTr ? "bölgedeki otellerin güncel örnek fiyatları" : "current sample prices of hotels in the area")
    : (isTr ? "ülkenin ortalama otel fiyatları" : "typical hotel prices in the country");
  box.innerHTML = `
    <div class="budget-head">
      <div>
        <h3>${isTr ? "Tahmini gezi bütçesi" : "Estimated trip budget"}</h3>
        <p class="budget-sub">${isTr
          ? `${est.people} kişi, ${itinerary.days.length} gün, ${({ economy: "ekonomik", moderate: "dengeli", luxury: "konforlu" })[userState.budget]} bütçe`
          : `${est.people} ${est.people === 1 ? "person" : "people"}, ${itinerary.days.length} days, ${userState.budget} budget`}</p>
      </div>
      <div class="budget-total">
        <strong>${formatMoney(est.total, isTr)}</strong>
        ${est.people > 1 ? `<span>${isTr ? `kişi başı ${formatMoney(est.perPerson, isTr)}` : `${formatMoney(est.perPerson, isTr)} per person`}</span>` : ""}
      </div>
    </div>
    <ul class="budget-rows">
      ${rows.map(([k, label]) => `
        <li>
          <span class="budget-label">${label}</span>
          <span class="budget-bar"><span style="width:${Math.max(3, p[k] / max * 100).toFixed(1)}%"></span></span>
          <span class="budget-val">${formatMoney(p[k], isTr)}</span>
        </li>`).join("")}
    </ul>
    <p class="budget-note">${isTr
      ? `Uçak bileti hariç. Konaklama için ${hotelSrc} kullanıldı; giriş ücretleri ve yemek yaklaşık değerlerdir. Otel seçince ya da yer değiştirince hesap güncellenir.`
      : `Flights not included. Stay uses ${hotelSrc}; tickets and food are approximate. Picking a hotel or swapping places updates it.`}${rateNote(isTr)}</p>`;
}

// ---------- currency menu in the top bar ----------
function currencySymbol(c) {
  try {
    const part = new Intl.NumberFormat("en", { style: "currency", currency: c, currencyDisplay: "narrowSymbol" })
      .formatToParts(0).find(x => x.type === "currency");
    return part && part.value !== c ? part.value : "";
  } catch (e) { return ""; }
}
function renderCurrencyNav() {
  const btn = document.getElementById("currency-btn");
  const menu = document.getElementById("currency-menu");
  if (!btn || !menu) return;
  const isTr = currentLanguage === "tr";
  const cur = activeCurrency();
  const sym = currencySymbol(cur);
  btn.textContent = `${sym ? sym + " " : ""}${cur}`;
  btn.setAttribute("aria-label", `${isTr ? "Para birimi" : "Currency"}: ${CURRENCY_NAMES[cur][isTr ? 0 : 1]}`);
  const all = currencyOptions(userState.country);
  const local = LOCAL_CURRENCY[userState.country];
  const topN = local && !["EUR", "TRY", "USD", "GBP"].includes(local) ? 5 : 4;
  const item = (c) => `<button type="button" role="menuitemradio" aria-checked="${c === cur}" data-cur="${c}"${c === cur ? ' class="is-current"' : ""}>
      <span class="cur-code">${c}</span><span class="cur-name">${CURRENCY_NAMES[c][isTr ? 0 : 1]}</span></button>`;
  menu.setAttribute("role", "menu");
  menu.innerHTML = `<p class="cur-group">${isTr ? "Sık kullanılanlar" : "Common"}</p>${all.slice(0, topN).map(item).join("")}
    <p class="cur-group">${isTr ? "Diğer para birimleri" : "Other currencies"}</p>${all.slice(topN).map(item).join("")}`;
}
function initCurrencyNav() {
  const btn = document.getElementById("currency-btn");
  const menu = document.getElementById("currency-menu");
  if (!btn || !menu) return;
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = menu.hidden;
    renderCurrencyNav();
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { const cur = menu.querySelector(".is-current"); if (cur) cur.focus(); }
  });
  document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== btn) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { close(); btn.focus(); } });
  menu.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cur]");
    if (!b) return;
    userState.currency = b.dataset.cur;
    saveState();
    close();
    renderCurrencyNav();
    if (planVisible && currentItinerary) renderItinerary(currentItinerary);
    btn.focus();
  });
  renderCurrencyNav();
}

function rateNote(isTr) {
  const cur = activeCurrency();
  if (cur === "EUR") return "";
  const r = FX.rates[cur] || 1;
  const rate = r >= 100 ? Math.round(r) : r.toFixed(2);
  const rateTxt = new Intl.NumberFormat(isTr ? "tr-TR" : "en-GB").format(rate);
  const when = FX.live && FX.date ? formatTripDate(new Date(FX.date + "T12:00:00"), isTr, false) : "";
  return isTr
    ? ` Fiyatlar euro üzerinden çevrildi: 1 € = ${rateTxt} ${cur}${FX.live ? (when ? ` (${when} kuru)` : "") : " (yaklaşık kur, güncel kura ulaşılamadı)"}.`
    : ` Converted from euros: €1 = ${rateTxt} ${cur}${FX.live ? (when ? ` (rate of ${when})` : "") : " (approximate; live rate unavailable)"}.`;
}

// "Where to stay" for the active day
function renderStayCard(itinerary, container) {
  if (typeof getStayForDay !== "function") return;
  const stay = getStayForDay(itinerary, activeDayIndex);
  if (!stay) return;
  const isTr = currentLanguage === "tr";
  const key = stayKey(itinerary, stay);
  const hotel = userState.hotels[key];
  const mode = hotel ? "own" : userState.bookingMode[key] || "";
  const links = buildStayLinks(stay, userState, currentLanguage);

  const range = stay.firstDay === stay.lastDay
    ? (isTr ? `${stay.firstDay}. gün` : `day ${stay.firstDay}`)
    : (isTr ? `${stay.firstDay}–${stay.lastDay}. günler` : `days ${stay.firstDay}–${stay.lastDay}`);
  const guests = isTr
    ? `${links.adults} yetişkin, ${links.rooms} oda`
    : `${links.adults} adult${links.adults > 1 ? "s" : ""}, ${links.rooms} room${links.rooms > 1 ? "s" : ""}`;

  const lead = stay.isDayTrip
    ? (isTr ? "Bu gün genelde günübirlik gezilir; geceyi önceki gün kaldığın yerde geçirebilirsin." : "This is usually a day trip, so you can sleep where you stayed the night before.")
    : (isTr
      ? `${range} için tek bir otel yeter; duraklarının çoğu bu bölgede.`
      : `One hotel works for ${range}; most of your stops are in this area.`);

  const card = document.createElement("section");
  card.className = "stay-card";
  card.setAttribute("aria-labelledby", "stay-title");

  let body = "";
  if (hotel) {
    body = `
      <div class="my-hotel">
        <div>
          <span class="my-hotel-label">${isTr ? "Otelin" : "Your hotel"}</span>
          <strong>${escapeHtml(hotel.name)}</strong>
          ${hotel.address ? `<span class="my-hotel-addr">${escapeHtml(hotel.address)}</span>` : ""}
        </div>
        <div class="my-hotel-actions">
          <button type="button" class="link-btn" data-act="change">${isTr ? "Değiştir" : "Change"}</button>
          <button type="button" class="link-btn" data-act="remove">${isTr ? "Kaldır" : "Remove"}</button>
        </div>
      </div>
      <p class="stay-note">${isTr ? `${range} rotası bu otelden başlıyor ve burada bitiyor; ilk ve son durağa nasıl gideceğin planda yazıyor.` : `The route for ${range} starts and ends at this hotel; the plan shows how to reach the first and last stops.`}</p>`;
  } else {
    body = `
      <div class="booking-q" role="group" aria-label="${isTr ? "Rezervasyon durumu" : "Booking status"}">
        <span class="booking-q-label">${isTr ? "Kalacak yerin belli mi?" : "Do you have a place to stay?"}</span>
        <button type="button" class="chip${mode === "own" ? " is-on" : ""}" data-act="mode-own">${isTr ? "Rezervasyonum var" : "I have a booking"}</button>
        <button type="button" class="chip${mode === "none" ? " is-on" : ""}" data-act="mode-none">${isTr ? "Henüz yok" : "Not yet"}</button>
      </div>`;
    if (mode === "own") {
      body += `
        <form class="hotel-search" novalidate>
          <label for="hotel-query">${isTr ? "Otelinin adı ya da adresi" : "Your hotel's name or address"}</label>
          <div class="hotel-search-row">
            <input id="hotel-query" type="text" autocomplete="off" placeholder="${isTr ? "Örn. Pera Palace" : "e.g. Pera Palace"}">
            <button type="submit" class="btn btn-primary">${isTr ? "Otelimi bul" : "Find my hotel"}</button>
          </div>
          <div class="hotel-results" aria-live="polite"></div>
        </form>`;
    } else if (mode === "none") {
      body += `
        <div class="stay-form">
          <label class="stay-date">
            <span>${isTr ? "Varış tarihi" : "Arrival date"}</span>
            <input type="date" id="stay-start-date" value="${userState.startDate || ""}">
          </label>
          <p class="stay-summary">${guests}${links.checkin ? `; ${new Date(links.checkin + "T12:00:00").toLocaleDateString(isTr ? "tr-TR" : "en-GB", { day: "numeric", month: "long" })}, ${stay.nights} ${isTr ? "gece" : stay.nights > 1 ? "nights" : "night"}` : ""}</p>
        </div>
        <h4 class="hotel-list-title">${isTr ? `${escapeHtml(stay.neighborhood)} çevresindeki oteller` : `Hotels around ${escapeHtml(stay.neighborhood)}`}</h4>
        <div class="hotel-list" aria-live="polite"><p class="stay-note">${isTr ? "Oteller yükleniyor…" : "Loading hotels…"}</p></div>
        <div class="stay-links">
          <a class="btn btn-ghost" href="${links.booking}" target="_blank" rel="noopener">${isTr ? "Bölgedeki tüm oteller (Booking)" : "All hotels in the area (Booking)"}</a>
          <a class="btn btn-ghost" href="${links.google}" target="_blank" rel="noopener">${isTr ? "Google'da puan ve fiyatlar" : "Ratings and prices on Google"}</a>
          <a class="btn btn-ghost" href="${links.airbnb}" target="_blank" rel="noopener">${isTr ? "Airbnb'de evler" : "Homes on Airbnb"}</a>
        </div>
        <p class="stay-note">${isTr ? "Oteller OpenStreetMap'ten geliyor. Güncel fiyat ve misafir puanlarını Booking ya da Google'da görürsün." : "Hotels come from OpenStreetMap. You'll see live prices and guest ratings on Booking or Google."}</p>`;
    }
  }

  card.innerHTML = `
    <div class="stay-head">
      <svg class="stay-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20V8"/><path d="M3 16h18v4"/><path d="M21 16v-4a3 3 0 0 0-3-3h-7v7"/><circle cx="7" cy="12" r="2"/></svg>
      <div>
        <h3 id="stay-title">${isTr ? "Nerede kalınır?" : "Where to stay"}</h3>
        <p class="stay-area">${escapeHtml(stay.neighborhood)}</p>
      </div>
    </div>
    <p class="stay-lead">${lead}</p>
    ${body}
  `;
  container.appendChild(card);

  const rerender = (focusSel) => {
    card.remove();
    renderStayCard(itinerary, container);
    const el = focusSel && container.querySelector(focusSel);
    if (el) el.focus();
  };
  const setHotel = (h) => {
    if (h) userState.hotels[key] = Object.assign({ name: h.name, lat: h.lat, lng: h.lng, address: h.address || "", source: h.source || "own" }, h.eur ? { eur: h.eur } : {});
    else delete userState.hotels[key];
    saveState();
    refreshPlanKeepingDay();
  };

  card.querySelectorAll("[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const act = btn.dataset.act;
      if (act === "mode-own") { userState.bookingMode[key] = "own"; saveState(); rerender("#hotel-query"); }
      if (act === "mode-none") { userState.bookingMode[key] = "none"; saveState(); rerender(); }
      if (act === "change") { userState.bookingMode[key] = hotel.source === "suggested" ? "none" : "own"; setHotel(null); }
      if (act === "remove") { userState.bookingMode[key] = ""; setHotel(null); }
    });
  });

  const dateInput = card.querySelector("#stay-start-date");
  if (dateInput) {
    dateInput.addEventListener("change", () => {
      userState.startDate = dateInput.value || "";
      saveState();
      refreshPlanKeepingDay();
      syncTripBar();
    });
  }

  // Own booking: find the hotel on the map
  const form = card.querySelector(".hotel-search");
  if (form) {
    const results = form.querySelector(".hotel-results");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const q = form.querySelector("#hotel-query").value.trim();
      if (q.length < 3) { results.innerHTML = `<p class="stay-note">${isTr ? "Otelin adını ya da adresini yaz." : "Type your hotel's name or address."}</p>`; return; }
      results.innerHTML = `<p class="stay-note">${isTr ? "Aranıyor…" : "Searching…"}</p>`;
      let found = [];
      try {
        found = await searchHotelByName(q + (stay.query ? ", " + stay.query.split(",").pop().trim() : ""), itinerary.country.id, currentLanguage);
        if (!found.length) found = await searchHotelByName(q, itinerary.country.id, currentLanguage);
      } catch (err) {
        results.innerHTML = `<p class="stay-note">${isTr ? "Arama şu an yapılamadı. Birkaç saniye sonra tekrar dene." : "Search isn't available right now. Try again in a few seconds."}</p>`;
        return;
      }
      if (!found.length) {
        results.innerHTML = `<p class="stay-note">${isTr ? "Bu isimle bir yer bulunamadı. Otelin tam adını ya da sokak adresini dene." : "Nothing found with that name. Try the full hotel name or its street address."}</p>`;
        return;
      }
      results.innerHTML = `<p class="stay-note">${isTr ? "Otelini seç:" : "Pick your hotel:"}</p>` + found.map((r, i) => `
        <button type="button" class="hotel-result" data-i="${i}">
          <strong>${escapeHtml(r.name)}</strong><span>${escapeHtml(r.address)}</span>
        </button>`).join("");
      results.querySelectorAll(".hotel-result").forEach(b => {
        b.addEventListener("click", () => setHotel(found[+b.dataset.i]));
      });
    });
  }

  // No booking yet: real hotels around the area
  const list = card.querySelector(".hotel-list");
  if (list) loadHotelSuggestions(itinerary, stay, list, links, (h) => setHotel(Object.assign({}, h, { source: "suggested" })));
}

function renderRichHotels(hotels, data, stay, list, links, onPick) {
  const isTr = currentLanguage === "tr";
  const minPrice = h => (h.prices && h.prices.length ? h.prices[0].eur : null);
  let sorted = hotels.slice();
  const score = h => (h.rating || 0) * Math.log10((h.reviews || 0) + 10);
  if (userState.budget === "economy") sorted.sort((a, b) => (minPrice(a) ?? 1e9) - (minPrice(b) ?? 1e9));
  else if (userState.budget === "luxury") sorted.sort((a, b) => (minPrice(b) ?? -1) - (minPrice(a) ?? -1) || score(b) - score(a));
  else sorted.sort((a, b) => score(b) - score(a));
  const top = sorted.slice(0, 6);

  const sample = data.sample || {};
  const sampleDate = sample.checkin ? new Date(sample.checkin + "T12:00:00").toLocaleDateString(isTr ? "tr-TR" : "en-GB", { day: "numeric", month: "long" }) : "";
  const prefs = Object.assign({}, userState, { _checkin: links.checkin, _checkout: links.checkout });
  const typeLabel = t => ({ Hotel: isTr ? "Otel" : "Hotel", Hostel: "Hostel", "B&B": isTr ? "Pansiyon" : "B&B", Inn: isTr ? "Pansiyon" : "Inn", Specialty: isTr ? "Butik konaklama" : "Specialty lodging" }[t] || t || (isTr ? "Otel" : "Hotel"));

  list.innerHTML = top.map((h, i) => {
    const p = h.prices && h.prices.length ? h.prices : null;
    const rating = h.rating ? `<span class="hotel-rating"><strong>${isTr ? String(h.rating).replace(".", ",") : h.rating}</strong>/5</span> <span class="hotel-reviews">(${h.reviews.toLocaleString(isTr ? "tr-TR" : "en-GB")} ${isTr ? "yorum" : "reviews"})</span>` : "";
    const priceHtml = p
      ? `<p class="hotel-price"><span>${isTr ? "Gecelik" : "Per night"}</span> <strong>${activeCurrency() === "EUR" ? "" : "≈ "}${formatEur(p[0].eur, isTr)}</strong>${activeCurrency() === "EUR" ? "" : ` <span>(${money(p[0].eur, "EUR", isTr)})</span>`} <span>${escapeHtml(p[0].site)}</span></p>
         ${p.length > 1 ? `<p class="hotel-meta">${p.slice(1).map(x => `${escapeHtml(x.site)} ${formatEur(x.eur, isTr)}`).join(", ")}</p>` : ""}`
      : `<p class="hotel-meta">${isTr ? "Bu tarih için fiyat yok; Booking'e bak." : "No price for the sample date; check Booking."}</p>`;
    return `
      <article class="hotel-card">
        <div class="hotel-photo">
          <span class="photo-fallback" aria-hidden="true">${escapeHtml(h.name)}</span>
          ${h.image ? `<img src="${escapeHtml(h.image)}" alt="${escapeHtml(h.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ""}
        </div>
        <div class="hotel-body">
          <h5>${escapeHtml(h.name)}</h5>
          <p class="hotel-meta">${typeLabel(h.type)}${rating ? ", " : ""}${rating}</p>
          ${priceHtml}
          <p class="hotel-meta">${isTr ? `Bölgenin merkezine ${formatDistance(h.distanceKm, true)}` : `${formatDistance(h.distanceKm, false)} from the area's centre`}</p>
          <div class="hotel-actions">
            <a class="btn btn-ghost btn-sm" href="${hotelBookingUrl(h, stay.query, prefs, currentLanguage)}" target="_blank" rel="noopener">${isTr ? "Tarihlerime göre fiyat" : "Price for my dates"}</a>
            <a class="btn btn-ghost btn-sm" href="${escapeHtml(h.url)}" target="_blank" rel="noopener">${isTr ? "Yorumlar" : "Reviews"}</a>
            <button type="button" class="btn btn-primary btn-sm" data-pick="${i}">${isTr ? "Burada kalacağım" : "I'll stay here"}</button>
          </div>
        </div>
      </article>`;
  }).join("") + `<p class="stay-note">${isTr
    ? `Puan ve yorumlar TripAdvisor'dan. Fiyatlar ${sampleDate} için 1 gece, 2 kişilik örnek fiyatlardır ve her gün güncellenir${activeCurrency() === "EUR" ? "" : "; euro fiyatlar günün kuruyla çevrildi"}. Kendi tarihlerinin fiyatı için "Tarihlerime göre fiyat"a bas.`
    : `Ratings and reviews from TripAdvisor. Prices are samples for 1 night on ${sampleDate} for 2 adults, refreshed daily; tap "Price for my dates" for your own dates.`}</p>`;

  list.querySelectorAll("[data-pick]").forEach(b => b.addEventListener("click", () => {
    const h = top[+b.dataset.pick];
    const eur = (h.prices && h.prices.length) ? Math.min(...h.prices.map(x => x.eur)) : null;
    onPick({ name: h.name, lat: h.lat, lng: h.lng, address: "", source: "suggested", eur });
  }));
}

function stayCenter(itinerary, stay) {
  const pts = [];
  for (let i = stay.firstDay - 1; i <= stay.lastDay - 1; i++) {
    itinerary.days[i].stops.forEach(s => { if (s.place.zone === stay.zoneKey) pts.push(s.place); });
  }
  if (!pts.length) for (let i = stay.firstDay - 1; i <= stay.lastDay - 1; i++) itinerary.days[i].stops.forEach(s => pts.push(s.place));
  return { lat: pts.reduce((a, p) => a + p.lat, 0) / pts.length, lng: pts.reduce((a, p) => a + p.lng, 0) / pts.length };
}

// Hotel data (ratings, photos, sample prices) refreshed daily by a GitHub Action
let hotelDataPromise = null;
function loadHotelData() {
  if (!hotelDataPromise) {
    const day = new Date().toISOString().slice(0, 10);
    hotelDataPromise = fetch(`data/hotels.json?d=${day}`)
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return hotelDataPromise;
}

function formatEur(n, isTr) {
  return money(n, activeCurrency(), isTr);
}

async function loadHotelSuggestions(itinerary, stay, list, links, onPick) {
  const isTr = currentLanguage === "tr";
  const data = await loadHotelData();
  const rich = data && data.areas && data.areas[stayKey(itinerary, stay)];
  if (rich && rich.length) {
    renderRichHotels(rich, data, stay, list, links, onPick);
    return;
  }
  const center = stayCenter(itinerary, stay);
  let hotels = [];
  try {
    hotels = await fetchHotelsNear(center, 1200);
    if (hotels.length < 4) hotels = await fetchHotelsNear(center, 3000);
  } catch (e) {
    list.innerHTML = `<p class="stay-note">${isTr ? "Otel listesi şu an yüklenemedi. Aşağıdaki linklerle bölgedeki otellere bakabilirsin." : "The hotel list couldn't load right now. Use the links below to see hotels in the area."}</p>`;
    return;
  }
  const top = rankHotels(hotels, center, userState.budget).slice(0, 6);
  if (!top.length) {
    list.innerHTML = `<p class="stay-note">${isTr ? "Bu bölgede kayıtlı otel bulunamadı. Aşağıdaki linklerle aramaya devam edebilirsin." : "No hotels are listed in this area. Use the links below to keep searching."}</p>`;
    return;
  }
  const kindLabel = k => ({
    hotel: isTr ? "Otel" : "Hotel", hostel: "Hostel", guest_house: isTr ? "Pansiyon" : "Guest house", apartment: isTr ? "Daire" : "Apartment"
  }[k] || (isTr ? "Otel" : "Hotel"));
  const prefs = Object.assign({}, userState, { _checkin: links.checkin, _checkout: links.checkout });

  list.innerHTML = top.map((h, i) => {
    const dist = geoDistanceKm(center, h);
    return `
      <article class="hotel-card">
        <div class="hotel-photo" data-i="${i}"><span class="photo-fallback" aria-hidden="true">${escapeHtml(h.name)}</span></div>
        <div class="hotel-body">
          <h5>${escapeHtml(h.name)}</h5>
          <p class="hotel-meta">${kindLabel(h.kind)}${h.stars ? `, <span aria-label="${h.stars} ${isTr ? "yıldız" : "stars"}">${"★".repeat(h.stars)}</span>` : ""}</p>
          <p class="hotel-meta">${isTr ? `Günün duraklarının merkezine ${formatDistance(dist, true)}` : `${formatDistance(dist, false)} from the centre of your stops`}</p>
          <div class="hotel-actions">
            <a class="btn btn-ghost btn-sm" href="${hotelBookingUrl(h, stay.query, prefs, currentLanguage)}" target="_blank" rel="noopener">${isTr ? "Fiyat ve puan" : "Price and rating"}</a>
            <button type="button" class="btn btn-primary btn-sm" data-pick="${i}">${isTr ? "Burada kalacağım" : "I'll stay here"}</button>
          </div>
        </div>
      </article>`;
  }).join("");

  list.querySelectorAll("[data-pick]").forEach(b => b.addEventListener("click", () => onPick(top[+b.dataset.pick])));
  top.forEach((h, i) => {
    hotelPhoto(h).then(src => {
      if (!src) return;
      const box = list.querySelector(`.hotel-photo[data-i="${i}"]`);
      if (!box) return;
      const img = new Image();
      img.alt = h.name;
      img.referrerPolicy = "no-referrer";
      img.onload = () => box.appendChild(img);
      img.src = src;
    });
  });
}

// Hero: a live sample of day 1 for the selected country
function renderHeroLine() {
  const list = document.getElementById("hero-line-stops");
  if (!list) return;
  const isTr = currentLanguage === "tr";
  let plan;
  try {
    plan = planner.generateItinerary({ country: userState.country, days: 1, travelerType: "couple", interests: ["history", "food", "views", "art"], pace: "balanced", budget: "moderate" });
  } catch (e) { return; }
  const day = plan && plan.days[0];
  if (!day) return;
  const box = list.closest(".hero-line");
  if (box) box.style.setProperty("--day", day.color || "#2346D8");
  const title = document.getElementById("hero-line-title");
  if (title) title.textContent = day.neighborhood;

  list.innerHTML = day.stops.map(s => {
    const name = isTr ? s.place.nameTr : s.place.nameEn;
    const slot = SLOT_LABELS[s.timeSlot] || SLOT_LABELS.morning;
    const wikiAttr = encodeURIComponent(JSON.stringify(s.place.wiki || s.place.nameEn || ""));
    return `
      <li class="hero-stop">
        <span class="station" aria-hidden="true"></span>
        <span class="hero-thumb"><img data-wiki="${wikiAttr}" alt="" referrerpolicy="no-referrer" class="place-photo opacity-0 transition-opacity duration-500"></span>
        <span><span class="hero-stop-name">${escapeHtml(name)}</span><br><span class="hero-stop-time">${isTr ? slot.tr : slot.en}</span></span>
      </li>`;
  }).join("");
  hydratePlaceImages(list);
}

function updateHeroFacts() {
  const c = document.getElementById("fact-countries");
  if (c) c.textContent = getCountryCountLabel();
  const p = document.getElementById("fact-places");
  if (p) {
    const total = Object.values(CURATED_DESTINATIONS).reduce((a, d) => a + d.places.length, 0);
    p.textContent = (Math.floor(total / 50) * 50) + "+";
  }
}

// Leaflet Map Controller
function updateMap(stops, country, lineColor, hotel) {
  const color = lineColor || "#2346D8";
  const mapElement = document.getElementById("map");
  if (!mapElement || typeof L === "undefined") return;

  const defaultLat = country ? country.lat : 41.0082;
  const defaultLng = country ? country.lng : 28.9784;

  if (!mapInstance) {
    try {
      mapInstance = L.map("map").setView([defaultLat, defaultLng], country ? country.zoom || 13 : 13);

      // OpenStreetMap tiles. Their usage policy requires the page's Referer header,
      // so the page must not send "no-referrer" globally.
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        referrerPolicy: "strict-origin-when-cross-origin",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstance);
    } catch (e) {
      console.warn("Leaflet map initialization skipped:", e);
      return;
    }
  }

  // Clear existing markers
  mapMarkers.forEach(m => {
    try { mapInstance.removeLayer(m); } catch (e) {}
  });
  mapMarkers = [];
  if (routePolyline) {
    try { mapInstance.removeLayer(routePolyline); } catch (e) {}
  }

  const latLngs = [];

  stops.forEach((stop, index) => {
    const p = stop.place;
    const isTr = currentLanguage === "tr";
    const name = isTr ? p.nameTr : p.nameEn;
    const desc = isTr ? p.descTr : p.descEn;

    latLngs.push([p.lat, p.lng]);

    // Custom HTML Pin Marker
    const icon = L.divIcon({
      className: "custom-pin-container",
      html: `<div class="custom-pin" style="border-color: ${color};">${index + 1}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(mapInstance);
    marker.bindPopup(`
      <div style="max-width:220px">
        <strong style="display:block;font-weight:800">${index + 1}. ${escapeHtml(name)}</strong>
        <span style="color:#5B6478;font-size:12px">${escapeHtml(desc)}</span>
      </div>
    `);

    mapMarkers.push(marker);
  });

  // The hotel: the day's route starts and ends there
  if (hotel) {
    const hIcon = L.divIcon({
      className: "custom-pin-container",
      html: `<div class="hotel-pin"><svg viewBox="0 0 24 24"><path d="M3 20V8"/><path d="M3 16h18v4"/><path d="M21 16v-4a3 3 0 0 0-3-3h-7v7"/><circle cx="7" cy="12" r="2"/></svg></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    const hm = L.marker([hotel.lat, hotel.lng], { icon: hIcon, zIndexOffset: 500 }).addTo(mapInstance);
    hm.bindPopup(`<strong style="font-weight:800">${escapeHtml(hotel.name)}</strong>`);
    mapMarkers.push(hm);
    latLngs.unshift([hotel.lat, hotel.lng]);
    latLngs.push([hotel.lat, hotel.lng]);
  }

  // Polyline connecting the stops
  if (latLngs.length > 1) {
    routePolyline = L.polyline(latLngs, {
      color: color,
      weight: 6,
      opacity: 0.9
    }).addTo(mapInstance);

    mapInstance.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
  } else if (latLngs.length === 1) {
    mapInstance.setView(latLngs[0], 14);
  } else if (country) {
    mapInstance.setView([country.lat, country.lng], country.zoom || 13);
  }

  // The plan section may have just become visible: make Leaflet re-measure, then re-fit
  [100, 400].forEach(ms => setTimeout(() => {
    try {
      mapInstance.invalidateSize();
      if (latLngs.length > 1) mapInstance.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
    } catch (e) {}
  }, ms));
}

// Action Buttons & Navigation Reset
function resetToHomepage() {
  const itinerarySection = document.getElementById("itinerary-section");
  const wizardSection = document.getElementById("wizard-section");
  if (itinerarySection) itinerarySection.classList.add("hidden");
  if (wizardSection) wizardSection.classList.remove("hidden");
  planVisible = false;
  goToStep(1);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initActionButtons() {
  // Logo Click -> Return to Homepage / Beginning
  const logoLink = document.getElementById("app-logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();
      resetToHomepage();
    });
  }

  const footerLogoLink = document.getElementById("footer-logo-link");
  if (footerLogoLink) {
    footerLogoLink.addEventListener("click", (e) => {
      e.preventDefault();
      resetToHomepage();
    });
  }

  // Edit Preferences
  const btnEdit = document.getElementById("btn-edit-pref");
  if (btnEdit) {
    btnEdit.addEventListener("click", () => {
      document.getElementById("itinerary-section").classList.add("hidden");
      document.getElementById("wizard-section").classList.remove("hidden");
      planVisible = false;
      goToStep(1);
      document.getElementById("wizard-section").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Print / PDF: a clean page with every day, not just the open one
  const btnPrint = document.getElementById("btn-print");
  if (btnPrint) btnPrint.addEventListener("click", () => { renderPrintView(); window.print(); });
  window.addEventListener("beforeprint", renderPrintView);

  // Share: a link that opens exactly this plan
  const btnShare = document.getElementById("btn-share");
  const menu = document.getElementById("share-menu");
  if (btnShare && menu) {
    const close = () => { menu.hidden = true; btnShare.setAttribute("aria-expanded", "false"); };
    btnShare.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!currentItinerary) return;
      const open = menu.hidden;
      menu.hidden = !open;
      btnShare.setAttribute("aria-expanded", open ? "true" : "false");
      const nativeBtn = menu.querySelector('[data-share="native"]');
      if (nativeBtn) nativeBtn.hidden = !navigator.share;
      // Keep the menu on screen whichever side the button sits on
      menu.classList.remove("align-left");
      if (open && menu.getBoundingClientRect().left < 8) menu.classList.add("align-left");
    });
    document.addEventListener("click", (e) => { if (!menu.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    menu.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-share]");
      if (!b) return;
      const isTr = currentLanguage === "tr";
      const link = buildShareLink();
      const title = shareTitle(isTr);
      close();
      if (b.dataset.share === "copy") {
        const ok = await copyText(link);
        showToast(ok ? (isTr ? "Link kopyalandı. Açan kişi planı aynen görür." : "Link copied. Anyone who opens it sees this plan.")
                     : (isTr ? "Kopyalanamadı. Linki adres çubuğundan alabilirsin." : "Couldn't copy. Take the link from the address bar."));
        if (!ok) history.replaceState(null, "", link);
      } else if (b.dataset.share === "whatsapp") {
        const lines = currentItinerary.days.map(d =>
          `${d.dayNumber}. ${isTr ? "gün" : "day"}: ${d.stops.map(st => isTr ? st.place.nameTr : st.place.nameEn).join(", ")}`);
        const text = `${title}\n\n${lines.join("\n")}\n\n${isTr ? "Planın tamamı:" : "Full plan:"} ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      } else if (b.dataset.share === "native" && navigator.share) {
        try { await navigator.share({ title, url: link }); } catch (err) { /* cancelled */ }
      }
    });
  }
}

function shareTitle(isTr) {
  const c = currentItinerary.country;
  const name = c ? (isTr ? c.nameTr : c.nameEn) : "";
  const n = currentItinerary.days.length;
  return isTr ? `${name} için ${n} günlük gezi planım` : `My ${n}-day ${name} trip plan`;
}

// ---------- shareable link: the whole plan packed into the address ----------
function b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, ch => ch.charCodeAt(0)));
}

function buildShareLink() {
  const u = userState;
  const hotels = {};
  Object.keys(u.hotels || {}).forEach(k => {
    const h = u.hotels[k];
    if (h && isFinite(h.lat) && isFinite(h.lng)) {
      hotels[k] = Object.assign({ name: h.name, lat: +(+h.lat).toFixed(5), lng: +(+h.lng).toFixed(5), source: h.source || "own" }, h.eur ? { eur: Math.round(h.eur) } : {});
    }
  });
  const packed = {
    c: u.country, d: u.days, t: u.travelerType, i: u.interests, p: u.pace, b: u.budget,
    s: u.startDate || "", h: hotels, m: u.bookingMode || {}, w: u.swaps || {}, a: activeDayIndex, l: currentLanguage, cu: u.currency || ""
  };
  return `${location.origin}${location.pathname}#plan=${b64urlEncode(JSON.stringify(packed))}`;
}

function readSharedLink() {
  const m = /[#&]plan=([A-Za-z0-9_-]+)/.exec(location.hash);
  if (!m) return null;
  try {
    const x = JSON.parse(b64urlDecode(m[1]));
    return applySavedState({
      v: 1,
      planVisible: true,
      activeDayIndex: Number.isInteger(x.a) ? x.a : 0,
      currentStep: totalSteps,
      lang: x.l,
      userState: { country: x.c, days: x.d, travelerType: x.t, interests: x.i, pace: x.p, budget: x.b,
        startDate: x.s, hotels: x.h, bookingMode: x.m, swaps: x.w, rejected: [], currency: x.cu }
    });
  } catch (e) { return null; }
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall back */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (e) { return false; }
}

let toastTimer = null;
function showToast(msg) {
  let t = document.getElementById("gp-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "gp-toast";
    t.className = "toast";
    t.setAttribute("role", "status");
    t.setAttribute("aria-live", "polite");
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

// ---------- print view: every day on paper ----------
function renderPrintView() {
  if (!currentItinerary) return;
  let root = document.getElementById("print-view");
  if (!root) {
    root = document.createElement("div");
    root.id = "print-view";
    document.body.appendChild(root);
  }
  const isTr = currentLanguage === "tr";
  const it = currentItinerary;
  const fmtDate = (offset) => {
    if (!userState.startDate) return "";
    const d = new Date(userState.startDate + "T12:00:00");
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString(isTr ? "tr-TR" : "en-GB", { weekday: "long", day: "numeric", month: "long" });
  };
  const travellers = { solo: isTr ? "Tek kişi" : "Solo", couple: isTr ? "Çift" : "Couple", family: isTr ? "Aile" : "Family", friends: isTr ? "Arkadaş grubu" : "Friends" };
  const paces = { relaxed: isTr ? "sakin tempo" : "relaxed pace", balanced: isTr ? "dengeli tempo" : "balanced pace", fast: isTr ? "hızlı tempo" : "fast pace" };
  const leg = (a, b) => { const l = describeLeg(a, b, isTr); return `<p class="pv-leg">${escapeHtml(l.text)}</p>`; };

  const pvLabels = dayLabels(it, isTr);
  const days = it.days.map((day, di) => {
    const title = pvLabels[di].title;
    const date = fmtDate(di);
    let body = "";
    if (day.hotel) body += `<p class="pv-hotel">${isTr ? "Başlangıç: " : "Start: "}<strong>${escapeHtml(day.hotel.name)}</strong></p>` + (day.stops[0] ? leg(day.hotel, day.stops[0].place) : "");
    const times = scheduleDay(day, di, userState, it.country.id);
    day.stops.forEach((st, i) => {
      const p = st.place;
      const slot = SLOT_LABELS[st.timeSlot] || SLOT_LABELS.morning;
      const closed = closedDaysLabel(p, isTr);
      body += `
        <div class="pv-stop">
          <div class="pv-num">${i + 1}</div>
          <div>
            <p class="pv-meta">${fmtClock(times[i].start)}–${fmtClock(times[i].end)}, ${isTr ? slot.tr : slot.en}${closed ? `, ${escapeHtml(closed)}` : ""}</p>
            <h3>${escapeHtml(isTr ? p.nameTr : p.nameEn)}</h3>
            <p>${escapeHtml(isTr ? p.descTr : p.descEn)}</p>
            <p class="pv-small"><strong>${isTr ? "İpucu:" : "Tip:"}</strong> ${escapeHtml(isTr ? p.insiderTipTr : p.insiderTipEn)}</p>
            <p class="pv-small"><strong>${isTr ? "En yakın durak:" : "Nearest stop:"}</strong> ${escapeHtml(isTr ? p.transitTr : p.transitEn)}</p>
          </div>
        </div>`;
      const next = day.stops[i + 1];
      if (next) body += leg(p, next.place);
    });
    if (day.hotel && day.stops.length) body += leg(day.stops[day.stops.length - 1].place, day.hotel) + `<p class="pv-hotel">${isTr ? "Otele dönüş" : "Back to the hotel"}</p>`;
    return `
      <section class="pv-day">
        <h2>${isTr ? `${day.dayNumber}. gün` : `Day ${day.dayNumber}`}: ${escapeHtml(title)}</h2>
        <p class="pv-area">${escapeHtml(day.neighborhood)}${date ? `, ${escapeHtml(date)}` : ""}, ~${String(day.stats.walkingKm).replace(".", isTr ? "," : ".")} km</p>
        ${body}
      </section>`;
  }).join("");

  root.innerHTML = `
    <header class="pv-head">
      <p class="pv-brand">GlobePlanner</p>
      <h1>${escapeHtml(shareTitle(isTr))}</h1>
      <p>${travellers[userState.travelerType] || ""}, ${paces[userState.pace] || ""}${userState.startDate ? `, ${escapeHtml(fmtDate(0))}` : ""}</p>
    </header>
    ${days}
    <footer class="pv-foot">
      <p>${isTr ? "Planı internette açmak için:" : "Open this plan online:"}</p>
      <p class="pv-link">${escapeHtml(buildShareLink())}</p>
    </footer>`;
}


// ---------------------------------------------------------------------------
// Place photos: every stop shows a photo of that exact place, taken from the
// lead image of its Wikipedia article. Results are cached in memory and, when
// available, in localStorage so repeat visits load instantly.
// ---------------------------------------------------------------------------
const PLACE_IMG_CACHE_KEY = "gp_place_img_v2";
const placeImgCache = (() => {
  try { return JSON.parse(localStorage.getItem(PLACE_IMG_CACHE_KEY) || "{}"); } catch (e) { return {}; }
})();
const placeImgPending = {};

function savePlaceImgCache() {
  try { localStorage.setItem(PLACE_IMG_CACHE_KEY, JSON.stringify(placeImgCache)); } catch (e) { /* storage unavailable */ }
}

// Logos, maps, flags and posters are not photos of the place itself
const NOT_A_PHOTO = /logo|\.svg|poster|map|sign\b|flag|coat_of_arms|locator/i;

async function wikiThumbForTitle(title) {
  const url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1" +
    "&prop=pageimages|pageprops&ppprop=wikibase_item|disambiguation&piprop=thumbnail&pithumbsize=900&titles=" + encodeURIComponent(title);
  const res = await fetch(url);
  if (!res.ok) throw new Error("wiki " + res.status);
  const data = await res.json();
  const pages = (data.query && data.query.pages) || {};
  for (const id in pages) {
    const pg = pages[id];
    if (pg.missing !== undefined) continue;
    if (pg.pageprops && pg.pageprops.disambiguation !== undefined) continue;
    if (pg.thumbnail && pg.thumbnail.source && !NOT_A_PHOTO.test(pg.thumbnail.source)) return pg.thumbnail.source;
    // No lead image on Wikipedia: use the official image (P18) of the same item on Wikidata
    const qid = pg.pageprops && pg.pageprops.wikibase_item;
    if (qid) {
      const wd = await fetch("https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&property=P18&entity=" + qid);
      if (wd.ok) {
        const wdData = await wd.json();
        const claim = wdData.claims && wdData.claims.P18 && wdData.claims.P18[0];
        const file = claim && claim.mainsnak && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value;
        if (file && !NOT_A_PHOTO.test(file)) return "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(file) + "?width=900";
      }
    }
  }
  return null;
}

function resolvePlaceImage(titles) {
  const key = titles.join("|");
  if (!key) return Promise.resolve(null);
  if (key in placeImgCache) return Promise.resolve(placeImgCache[key]);
  if (placeImgPending[key]) return placeImgPending[key];
  placeImgPending[key] = (async () => {
    let src = null;
    try {
      for (const t of titles) {
        src = await wikiThumbForTitle(t);
        if (src) break;
      }
    } catch (e) {
      delete placeImgPending[key];
      return undefined; // network problem / rate limit: don't cache, caller retries
    }
    placeImgCache[key] = src;
    savePlaceImgCache();
    return src;
  })();
  return placeImgPending[key];
}

function hydratePlaceImages(root) {
  (root || document).querySelectorAll("img.place-photo[data-wiki]").forEach(img => {
    let titles = [];
    try {
      const parsed = JSON.parse(decodeURIComponent(img.dataset.wiki));
      titles = (Array.isArray(parsed) ? parsed : [parsed]).filter(Boolean);
    } catch (e) { titles = []; }
    const load = (attempt) => resolvePlaceImage(titles).then(src => {
      if (src === undefined && attempt < 3 && img.isConnected) {
        setTimeout(() => load(attempt + 1), 3000 * (attempt + 1)); // temporary error: retry
        return;
      }
      if (!src) return; // keep the neutral placeholder rather than an unrelated photo
      img.onload = () => img.classList.remove("opacity-0");
      img.src = src;
    });
    load(0);
  });
}
