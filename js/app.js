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
      <div class="col-span-full py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p class="font-bold text-slate-700 mb-1">${isTr ? 'Aradığınız ülke listede bulunamadı.' : 'No matching country found.'}</p>
        <p class="text-[11px] text-slate-400">${isTr ? `Aşağıdaki açılır menüden tüm ${getCountryCountLabel()} ülke arasından seçim yapabilirsiniz.` : `Please select from the comprehensive ${getCountryCountLabel()} country dropdown list below.`}</p>
      </div>
    `;
    return;
  }

  countriesToShow.forEach(c => {
    const isSelected = c.id === userState.country;
    const name = isTr ? c.nameTr : c.nameEn;
    
    const card = document.createElement("div");
    card.className = `selection-card p-3 rounded-2xl border-2 flex flex-col items-center text-center transition cursor-pointer relative ${
      isSelected 
        ? 'selected border-sky-600 bg-sky-50 shadow-md ring-2 ring-sky-500/20' 
        : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-xs'
    }`;
    card.dataset.countryId = c.id;

    card.innerHTML = `
      <span class="text-3xl mb-1">${c.flag}</span>
      <strong class="text-xs ${isSelected ? 'text-sky-950 font-extrabold' : 'text-slate-900 font-bold'} block truncate w-full">${name}</strong>
      <span class="text-[10px] text-slate-500 block truncate w-full mt-0.5">${c.capital}</span>
      ${isSelected ? `<span class="mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">${isTr ? '✓ Seçildi' : '✓ Selected'}</span>` : ''}
    `;

    card.addEventListener("click", () => {
      selectCountry(c.id);
    });

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

  // Re-render Survival Guide for this country
  renderSurvivalGuide();

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

    const card = document.createElement("div");
    card.className = "card-glass p-6 rounded-2xl border border-slate-200 flex items-start gap-4 transition hover:shadow-md";
    card.innerHTML = `
      <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
      </div>
      <div>
        <h4 class="font-bold text-slate-900 text-base mb-1">${title}</h4>
        <p class="text-xs text-slate-600 leading-relaxed">${desc}</p>
      </div>
    `;
    container.appendChild(card);
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
    if (btn.dataset.lang === lang) {
      btn.classList.add("bg-sky-600", "text-white");
      btn.classList.remove("text-slate-600", "hover:bg-slate-100");
    } else {
      btn.classList.remove("bg-sky-600", "text-white");
      btn.classList.add("text-slate-600", "hover:bg-slate-100");
    }
  });

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
      const destSection = document.getElementById("destination-section");
      if (destSection) {
        destSection.scrollIntoView({ behavior: "smooth" });
      }
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
      if (i < step) {
        dot.className = "step-dot completed w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm";
      } else if (i === step) {
        dot.className = "step-dot active w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm";
      } else {
        dot.className = "step-dot w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm";
      }
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

function renderItinerary(itinerary) {
  const tabsContainer = document.getElementById("day-tabs");
  const contentContainer = document.getElementById("day-content");
  tabsContainer.innerHTML = "";
  contentContainer.innerHTML = "";

  const isTr = currentLanguage === "tr";
  const country = itinerary.country;

  // Update Plan Flag in Actions Bar
  const planFlag = document.getElementById("plan-country-flag");
  if (planFlag && country) {
    planFlag.textContent = country.flag;
  }

  // Build Day Tabs
  itinerary.days.forEach((day, idx) => {
    const tab = document.createElement("button");
    const isActive = idx === activeDayIndex;
    tab.className = `px-5 py-3 rounded-xl font-bold transition-all text-sm flex items-center gap-2 cursor-pointer ${
      isActive
        ? "bg-sky-600 text-white shadow-md shadow-sky-200"
        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
    }`;

    tab.innerHTML = `
      <span>${isTr ? `${day.dayNumber}. Gün` : `Day ${day.dayNumber}`}</span>
      <span class="text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-sky-700 text-sky-100' : 'bg-slate-100 text-slate-600'}">${day.neighborhood}</span>
    `;

    tab.addEventListener("click", () => {
      activeDayIndex = idx;
      renderItinerary(itinerary);
    });

    tabsContainer.appendChild(tab);
  });

  // Current Active Day
  const activeDay = itinerary.days[activeDayIndex];
  if (!activeDay) return;

  // Render Day Summary Banner
  const banner = document.createElement("div");
  banner.className = "bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4";
  banner.innerHTML = `
    <div>
      <span class="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full text-xs font-semibold mb-2">
        ${country ? country.flag : '📍'} ${activeDay.neighborhood}
      </span>
      <h3 class="text-2xl font-bold font-heading">${isTr ? activeDay.titleTr : activeDay.titleEn}</h3>
      <p class="text-slate-300 text-sm mt-1">
        ${isTr ? 'Gereksiz trafikten kaçınmak için birbiriyle ardışık ve mantıklı duraklar seçildi.' : 'Clustered sequentially to avoid traffic and maximize discovery.'}
      </p>
    </div>
    <div class="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center">
      <div>
        <div class="text-lg font-bold text-sky-300">${activeDay.stats.stopsCount}</div>
        <div class="text-xs text-slate-300">${isTr ? 'Durak' : 'Stops'}</div>
      </div>
      <div class="h-8 w-px bg-white/20"></div>
      <div>
        <div class="text-lg font-bold text-emerald-300">~${activeDay.stats.walkingKm} km</div>
        <div class="text-xs text-slate-300">${isTr ? 'Yürüme' : 'Walking'}</div>
      </div>
      <div class="h-8 w-px bg-white/20"></div>
      <div>
        <div class="text-lg font-bold text-amber-300">~${activeDay.stats.estimatedHours} h</div>
        <div class="text-xs text-slate-300">${isTr ? 'Tahmini Süre' : 'Duration'}</div>
      </div>
    </div>
  `;
  contentContainer.appendChild(banner);

  // Render Stops Timeline
  const timeline = document.createElement("div");
  timeline.className = "space-y-6";

  activeDay.stops.forEach((stop, idx) => {
    const p = stop.place;
    const name = isTr ? p.nameTr : p.nameEn;
    const desc = isTr ? p.descTr : p.descEn;
    const insiderTip = isTr ? p.insiderTipTr : p.insiderTipEn;
    const transitTip = isTr ? p.transitTr : p.transitEn;

    const timeLabels = {
      morning: { tr: "Sabah", en: "Morning", color: "text-amber-500 bg-amber-50 border-amber-200", icon: "☀️" },
      afternoon: { tr: "Öğle", en: "Afternoon", color: "text-sky-500 bg-sky-50 border-sky-200", icon: "⛅" },
      sunset: { tr: "Gün Batımı", en: "Golden Hour", color: "text-orange-500 bg-orange-50 border-orange-200", icon: "🌅" },
      evening: { tr: "Akşam", en: "Evening", color: "text-indigo-500 bg-indigo-50 border-indigo-200", icon: "🌙" }
    };
    const tBadge = timeLabels[stop.timeSlot] || timeLabels.morning;

    // Photo of this exact place (resolved from its Wikipedia article after render)
    const wikiAttr = encodeURIComponent(JSON.stringify(p.wiki || p.nameEn || ""));

    // Category badges
    const catBadgesHtml = (p.category || []).map(cat => {
      const cMeta = {
        history: { tr: "Tarih", en: "History", color: "bg-amber-100 text-amber-800 border-amber-200" },
        food: { tr: "Gastronomi", en: "Food", color: "bg-orange-100 text-orange-800 border-orange-200" },
        views: { tr: "Manzara", en: "Views", color: "bg-sky-100 text-sky-800 border-sky-200" },
        bazaars: { tr: "Alışveriş", en: "Bazaar", color: "bg-purple-100 text-purple-800 border-purple-200" },
        art: { tr: "Sanat & Bohem", en: "Art & Bohemian", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
        nightlife: { tr: "Gece Hayatı", en: "Nightlife", color: "bg-pink-100 text-pink-800 border-pink-200" }
      }[cat] || { tr: cat, en: cat, color: "bg-slate-100 text-slate-700 border-slate-200" };
      return `<span class="px-2 py-0.5 rounded text-[11px] font-semibold border ${cMeta.color}">${isTr ? cMeta.tr : cMeta.en}</span>`;
    }).join(" ");

    // Budget badge
    const isEconomyOnly = p.budgetTier && p.budgetTier.length === 1 && p.budgetTier.includes("economy");
    const budgetBadgeHtml = isEconomyOnly
      ? `<span class="px-2 py-0.5 rounded text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">₺ ${isTr ? 'Ekonomik / Ücretsiz' : 'Free / Budget'}</span>`
      : (p.budgetTier && p.budgetTier.includes("economy")
          ? `<span class="px-2 py-0.5 rounded text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">₺ ${isTr ? 'Ekonomik' : 'Budget Friendly'}</span>`
          : (p.budgetTier && p.budgetTier.includes("luxury")
              ? `<span class="px-2 py-0.5 rounded text-[11px] font-bold border bg-purple-50 text-purple-700 border-purple-200">₺₺₺ ${isTr ? 'Lüks' : 'Luxury'}</span>`
              : `<span class="px-2 py-0.5 rounded text-[11px] font-bold border bg-sky-50 text-sky-700 border-sky-200">₺₺ ${isTr ? 'Dengeli' : 'Moderate'}</span>`));

    const stopCard = document.createElement("div");
    stopCard.className = "card-glass rounded-2xl overflow-hidden border border-slate-200/80 transition hover:shadow-lg";

    stopCard.innerHTML = `
      <div class="flex flex-col md:flex-row">
        <!-- Photo -->
        <div class="md:w-1/3 relative min-h-[200px] md:min-h-auto overflow-hidden">
          <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-100 via-slate-100 to-indigo-100 text-slate-500 p-4 text-center">
            <span class="text-3xl">📍</span>
            <span class="text-xs font-semibold leading-snug">${name}</span>
          </div>
          <img data-wiki="${wikiAttr}" alt="${name}" referrerpolicy="no-referrer" class="place-photo relative w-full h-full object-cover min-h-[220px] opacity-0 transition-opacity duration-500">
          <div class="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/90 ${tBadge.color}">
            <span>${tBadge.icon}</span>
            <span>${isTr ? tBadge.tr : tBadge.en}</span>
          </div>
          <div class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs">
            ${p.durationHours} ${isTr ? 'saat' : 'hours'}
          </div>
        </div>

        <!-- Content -->
        <div class="md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  ${idx + 1}
                </span>
                <div>
                  <h4 class="text-xl font-bold text-slate-900">${name}</h4>
                  <div class="flex flex-wrap items-center gap-1.5 mt-1.5">${budgetBadgeHtml} ${catBadgesHtml}</div>
                </div>
              </div>
            </div>
            
            <p class="text-slate-600 text-sm mt-3 leading-relaxed">${desc}</p>

            <!-- Insider Tip Box -->
            <div class="mt-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-3">
              <span class="text-amber-600 text-lg shrink-0 mt-0.5">💡</span>
              <div>
                <span class="font-bold text-xs uppercase tracking-wider text-amber-900 block mb-0.5">
                  ${isTr ? 'Yerel İpucu' : 'Insider Tip'}
                </span>
                <p class="text-xs text-amber-800 leading-snug">${insiderTip}</p>
              </div>
            </div>

            <!-- Transit Tip -->
            <div class="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span class="text-sky-600 text-sm shrink-0 mt-0.5">🧭</span>
              <div class="text-xs text-slate-700">
                <strong class="text-slate-900">${isTr ? 'Ulaşım:' : 'Transit:'}</strong> ${transitTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    timeline.appendChild(stopCard);

    // Transit Connector to next stop
    if (stop.transitToNext) {
      const transitBox = document.createElement("div");
      transitBox.className = "flex items-center gap-3 py-1.5 px-4 my-2 text-xs font-medium text-slate-500 bg-sky-50/60 border border-dashed border-sky-200 rounded-xl";
      transitBox.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 font-bold">
          ↓
        </div>
        <span>${isTr ? stop.transitToNext.tr : stop.transitToNext.en}</span>
      `;
      timeline.appendChild(transitBox);
    }
  });

  contentContainer.appendChild(timeline);
  hydratePlaceImages(timeline);

  // Update Interactive Map for this Day
  updateMap(activeDay.stops, country);
  safeCreateIcons();
}

// Leaflet Map Controller
function updateMap(stops, country) {
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
      html: `<div class="custom-pin" style="background-color: #0284c7;">${index + 1}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(mapInstance);
    marker.bindPopup(`
      <div class="p-2 max-w-[200px]">
        <strong class="text-sm block text-slate-900">${index + 1}. ${name}</strong>
        <p class="text-xs text-slate-600 mt-1 line-clamp-2">${desc}</p>
      </div>
    `);

    mapMarkers.push(marker);
  });

  // Polyline connecting the stops
  if (latLngs.length > 1) {
    routePolyline = L.polyline(latLngs, {
      color: "#0284c7",
      weight: 4,
      dashArray: "6, 8",
      opacity: 0.8
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
