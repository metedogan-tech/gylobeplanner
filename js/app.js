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
  budget: "moderate"
};

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
  initTranslations();
  initLanguageSwitcher();
  initDestinationSelector();
  initWizardNavigation();
  initOptionSelections();
  initActionButtons();
  selectCountry(userState.country);
  safeCreateIcons();

  // Dynamically update country count label (e.g. "20+")
  const countLabel = document.getElementById("country-count-label");
  if (countLabel) countLabel.textContent = getCountryCountLabel();
});

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
    });
  });

  // Traveler Type (single select)
  document.querySelectorAll("[data-pref='travelerType']").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-pref='travelerType']").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userState.travelerType = card.dataset.val;
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
    });
  });

  // Pace (single select)
  document.querySelectorAll("[data-pref='pace']").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-pref='pace']").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userState.pace = card.dataset.val;
    });
  });

  // Budget (single select)
  document.querySelectorAll("[data-pref='budget']").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll("[data-pref='budget']").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      userState.budget = card.dataset.val;
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
function generateAndDisplayPlan() {
  currentItinerary = planner.generateItinerary(userState);
  activeDayIndex = 0;

  // Hide Wizard, Show Plan
  document.getElementById("wizard-section").classList.add("hidden");
  const planSection = document.getElementById("itinerary-section");
  planSection.classList.remove("hidden");

  // Confetti celebration if available
  try {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  } catch (e) {}

  renderItinerary(currentItinerary);
  planSection.scrollIntoView({ behavior: "smooth" });
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
      <div><strong>~${activeDay.stats.walkingKm} km</strong><span>${isTr ? "yürüyüş" : "walking"}</span></div>
      <div><strong>~${activeDay.stats.estimatedHours} sa</strong><span>${isTr ? "toplam süre" : "in total"}</span></div>
    </div>
  `;
  contentContainer.appendChild(header);

  const line = document.createElement("div");
  line.className = "stops";

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
            <span>${isTr ? `yaklaşık ${p.durationHours} saat` : `about ${p.durationHours} h`}</span>
          </div>
          <h4 class="stop-title">${escapeHtml(name)}</h4>
          <p class="stop-desc">${escapeHtml(isTr ? p.descTr : p.descEn)}</p>
          <div class="tags">${tags}<span class="tag tag-budget">${budgetLabel(p, isTr)}</span></div>
          <p class="tip"><strong>${isTr ? "İpucu:" : "Tip:"}</strong> ${escapeHtml(isTr ? p.insiderTipTr : p.insiderTipEn)}</p>
          <p class="how"><strong>${isTr ? "Ulaşım:" : "Getting there:"}</strong> ${escapeHtml(isTr ? p.transitTr : p.transitEn)}</p>
        </div>
      </article>
    `;
    line.appendChild(el);

    if (stop.transitToNext) {
      const leg = document.createElement("div");
      leg.className = "leg";
      leg.innerHTML = `<p>${escapeHtml(isTr ? stop.transitToNext.tr : stop.transitToNext.en)}</p>`;
      line.appendChild(leg);
    }
  });

  contentContainer.appendChild(line);
  hydratePlaceImages(line);
  updateMap(activeDay.stops, country, activeDay.color);
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
function updateMap(stops, country, lineColor) {
  const color = lineColor || "#2346D8";
  const mapElement = document.getElementById("map");
  if (!mapElement || typeof L === "undefined") return;

  const defaultLat = country ? country.lat : 41.0082;
  const defaultLng = country ? country.lng : 28.9784;

  if (!mapInstance) {
    try {
      mapInstance = L.map("map").setView([defaultLat, defaultLng], country ? country.zoom || 13 : 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
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

  setTimeout(() => {
    try { mapInstance.invalidateSize(); } catch (e) {}
  }, 200);
}

// Action Buttons & Navigation Reset
function resetToHomepage() {
  const itinerarySection = document.getElementById("itinerary-section");
  const wizardSection = document.getElementById("wizard-section");
  if (itinerarySection) itinerarySection.classList.add("hidden");
  if (wizardSection) wizardSection.classList.remove("hidden");
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
