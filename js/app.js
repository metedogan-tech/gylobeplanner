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
  bookingMode: {}    // stay area key -> "own" (has a booking) | "none" (wants suggestions)
};

// ---------- Remember where the traveller left off (survives a page refresh) ----------
const STATE_KEY = "gp_state_v1";
let planVisible = false;

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      v: 1, userState, planVisible, activeDayIndex, currentStep, lang: currentLanguage
    }));
  } catch (e) { /* storage unavailable: nothing to do */ }
}

function loadSavedState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
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

document.addEventListener("DOMContentLoaded", () => {
  const saved = loadSavedState();
  if (saved && (saved.lang === "en" || saved.lang === "tr")) currentLanguage = saved.lang;
  initTranslations();
  initLanguageSwitcher();
  initDestinationSelector();
  initWizardNavigation();
  initOptionSelections();
  initActionButtons();
  initThemeToggle();
  selectCountry(userState.country);
  safeCreateIcons();

  // Dynamically update country count label (e.g. "20+")
  const countLabel = document.getElementById("country-count-label");
  if (countLabel) countLabel.textContent = getCountryCountLabel();

  // Continue where the traveller left off
  syncSelectionUI();
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
      const capital = normalizeStr(c.capital);
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
        <span class="cap">${c.capital}</span>
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
    opt.textContent = `${c.flag} ${name} (${c.capital})`;
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
  if (heroCapital) heroCapital.textContent = country.capital;

  // Update Wizard banner
  const wizardFlag = document.getElementById("wizard-flag");
  const wizardName = document.getElementById("wizard-country-name");

  if (wizardFlag) wizardFlag.textContent = country.flag;
  if (wizardName) wizardName.textContent = `${name} (${country.capital})`;

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
      const target = document.getElementById(currentItinerary ? "itinerary-section" : "wizard-section");
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
function buildCurrentItinerary() {
  const hotels = userState.hotels || {};
  const base = planner.generateItinerary(userState);
  if (!Object.keys(hotels).length) return applyHotelRouting(base, hotels);

  // Second pass: re-pick each day's places around the traveller's own hotel.
  // Regions stay the same, so every day keeps its stay area and its hotel.
  const stayZones = base.days.map((d, i) => {
    const st = getStayForDay(base, i);
    return st && hotels[stayKey(base, st)] ? st.zoneKey : null;
  });
  const anchors = base.days.map((d, i) => stayZones[i] ? hotelForDay(base, i, hotels) : null);
  if (!anchors.some(Boolean)) return applyHotelRouting(base, hotels);

  const tuned = planner.generateItinerary(Object.assign({}, userState, { anchors }));
  const sameRegions = tuned.days.length === base.days.length &&
    tuned.days.every((d, i) => d.regionId === base.days[i].regionId);
  if (!sameRegions) return applyHotelRouting(base, hotels);
  tuned.days.forEach((d, i) => { if (stayZones[i]) d.stayZone = stayZones[i]; });
  return applyHotelRouting(tuned, hotels);
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
  itinerary.days.forEach((day, idx) => {
    const tab = document.createElement("button");
    const isActive = idx === activeDayIndex;
    tab.type = "button";
    tab.className = "day-tab";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.style.setProperty("--day", day.color || "#2346D8");
    tab.innerHTML = `<span class="line-badge">${day.dayNumber}</span><span class="day-tab-name">${escapeHtml(day.neighborhood)}</span>`;
    tab.addEventListener("click", () => {
      activeDayIndex = idx;
      saveState();
      renderItinerary(itinerary);
    });
    tabsContainer.appendChild(tab);
  });

  const activeDay = itinerary.days[activeDayIndex];
  if (!activeDay) return;
  contentContainer.style.setProperty("--day", activeDay.color || "#2346D8");

  const dayTitle = (isTr ? activeDay.titleTr : activeDay.titleEn).replace(/^(\d+\. Gün|Day \d+):\s*/, "");
  const header = document.createElement("div");
  header.className = "day-header";
  header.innerHTML = `
    <div>
      <h3>${isTr ? `${activeDay.dayNumber}. gün` : `Day ${activeDay.dayNumber}`}: ${escapeHtml(dayTitle)}</h3>
      <p class="area">${escapeHtml(activeDay.neighborhood)}</p>
    </div>
    <div class="day-stats">
      <div><strong>${activeDay.stats.stopsCount}</strong><span>${isTr ? "durak" : "stops"}</span></div>
      <div><strong>~${String(activeDay.stats.walkingKm).replace(".", isTr ? "," : ".")} km</strong><span>${isTr ? "toplam yol" : "total distance"}</span></div>
      <div><strong>~${activeDay.stats.estimatedHours} sa</strong><span>${isTr ? "toplam süre" : "in total"}</span></div>
    </div>
  `;
  contentContainer.appendChild(header);

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
    el.className = "stop";
    el.innerHTML = `
      <span class="stop-node" aria-hidden="true">${idx + 1}</span>
      <article class="stop-card">
        <div class="stop-photo">${photoMarkup(p, name)}</div>
        <div class="stop-body">
          <div class="stop-meta">
            <span class="slot">${isTr ? slot.tr : slot.en}</span>
            <span>${isTr ? `burada yaklaşık ${p.durationHours} saat` : `about ${p.durationHours} h here`}</span>
          </div>
          <h4 class="stop-title">${escapeHtml(name)}</h4>
          <p class="stop-desc">${escapeHtml(isTr ? p.descTr : p.descEn)}</p>
          <div class="tags">${tags}<span class="tag tag-budget">${budgetLabel(p, isTr)}</span></div>
          <p class="tip"><strong>${isTr ? "İpucu:" : "Tip:"}</strong> ${escapeHtml(isTr ? p.insiderTipTr : p.insiderTipEn)}</p>
          <p class="how"><strong>${isTr ? "En yakın durak:" : "Nearest stop:"}</strong> ${escapeHtml(isTr ? p.transitTr : p.transitEn)}</p>
        </div>
      </article>
    `;
    line.appendChild(el);

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
  renderStayCard(itinerary, contentContainer);
  updateMap(activeDay.stops, country, activeDay.color, activeDay.hotel);
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
      ? `${range} için tek bir yerde kal: duraklarının çoğu ${escapeHtml(stay.neighborhood)} çevresinde.`
      : `Stay in one place for ${range}: most of your stops are around ${escapeHtml(stay.neighborhood)}.`);

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
        <p class="stay-area">${escapeHtml(stay.query)}</p>
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
    if (h) userState.hotels[key] = { name: h.name, lat: h.lat, lng: h.lng, address: h.address || "", source: h.source || "own" };
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
      rerender("#stay-start-date");
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
      ? `<p class="hotel-price"><span>${isTr ? "Gecelik" : "Per night"}</span> <strong>${formatEur(p[0].eur, isTr)}</strong> <span>${escapeHtml(p[0].site)}</span></p>
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
    ? `Puan ve yorumlar TripAdvisor'dan. Fiyatlar ${sampleDate} için 1 gece, 2 kişilik örnek fiyatlardır ve her gün güncellenir; kendi tarihlerinin fiyatı için "Tarihlerime göre fiyat"a bas.`
    : `Ratings and reviews from TripAdvisor. Prices are samples for 1 night on ${sampleDate} for 2 adults, refreshed daily; tap "Price for my dates" for your own dates.`}</p>`;

  list.querySelectorAll("[data-pick]").forEach(b => b.addEventListener("click", () => {
    const h = top[+b.dataset.pick];
    onPick({ name: h.name, lat: h.lat, lng: h.lng, address: "" });
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
  return isTr ? `${n.toLocaleString("tr-TR")} €` : `€${n.toLocaleString("en-GB")}`;
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

  // Print / PDF
  const btnPrint = document.getElementById("btn-print");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  // Share via WhatsApp
  const btnShare = document.getElementById("btn-share");
  if (btnShare) {
    btnShare.addEventListener("click", () => {
      if (!currentItinerary) return;
      const isTr = currentLanguage === "tr";
      const country = currentItinerary.country;
      const countryName = country ? (isTr ? country.nameTr : country.nameEn) : "";

      let text = isTr
        ? `🌍 *Benim ${countryName} Tatil Planım (${userState.days} Gün)*\n\n`
        : `🌍 *My ${countryName} Trip Plan (${userState.days} Days)*\n\n`;

      currentItinerary.days.forEach(day => {
        text += isTr ? `📍 *${day.titleTr}*\n` : `📍 *${day.titleEn}*\n`;
        day.stops.forEach((s, idx) => {
          const name = isTr ? s.place.nameTr : s.place.nameEn;
          text += `  ${idx + 1}. ${name}\n`;
        });
        text += `\n`;
      });

      text += isTr
        ? `GlobePlanner ile akıllı olarak oluşturuldu!`
        : `Generated with GlobePlanner!`;

      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    });
  }
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
