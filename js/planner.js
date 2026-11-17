// Universal Multi-Country Trip Planner Engine for GlobePlanner
// Implements strict category matching, strict budget tiers, and authentic location-specific itineraries.

class UniversalTripPlanner {
  constructor(curatedDestinations, countriesRegistry) {
    this.curated = curatedDestinations;
    this.registry = countriesRegistry;
  }

  generateItinerary(preferences) {
    const {
      country = "turkey",
      days = 3,
      travelerType = "couple",
      interests = ["history", "food", "views"],
      pace = "balanced",
      budget = "moderate",
      anchors = null,
      startDate = ""
    } = preferences;

    const targetDays = Math.min(Math.max(parseInt(days, 10) || 3, 1), 7);
    const countryInfo = this.registry.find(c => c.id === country) || this.registry[0];
    
    // Ensure selectedInterests is a valid array
    const selectedInterests = (Array.isArray(interests) && interests.length > 0) ? interests : ["history", "food", "views"];

    // Check if country has curated data (Turkey, Austria, Netherlands, Italy, etc.)
    if (this.curated[country]) {
      // Leave out places that are shut (e.g. for renovation) during the trip
      let dataset = this.curated[country];
      const blocked = typeof tempClosedIds === "function" ? tempClosedIds(country, startDate, targetDays) : null;
      if (blocked && blocked.size) dataset = Object.assign({}, dataset, { places: dataset.places.filter(p => !blocked.has(p.id)) });
      return this.generateCuratedPlan(countryInfo, dataset, targetDays, travelerType, selectedInterests, pace, budget, anchors);
    } else {
      // Procedural Smart Travel Plan for any country in the world
      return this.generateProceduralPlan(countryInfo, targetDays, travelerType, selectedInterests, pace, budget);
    }
  }

  generateCuratedPlan(countryInfo, dataset, targetDays, travelerType, interests, pace, budget, anchors) {
    const stopsPerDay = pace === "relaxed" ? 3 : pace === "balanced" ? 4 : 5;
    const usedPlaceIds = new Set();
    const itineraryDays = [];
    const all = dataset.places;

    const budgetOk = (p) => {
      if (!p.budgetTier) return true;
      if (budget === "economy") return p.budgetTier.includes("economy");
      if (budget === "luxury") return p.budgetTier.includes("luxury") || p.budgetTier.includes("moderate");
      return true;
    };
    const interestOk = (p) => p.category.some(cat => interests.includes(cat));
    const familyOk = (p) => !(travelerType === "family" && p.category.length === 1 && p.category[0] === "nightlife");

    // Candidate tiers, best first. A place is NEVER used twice in one trip:
    // 1) matches interests + budget, 2) matches budget (other interests),
    // 3) matches interests (other budget), 4) any remaining real place.
    const tiers = [
      p => interestOk(p) && budgetOk(p),
      p => budgetOk(p) && familyOk(p),
      p => interestOk(p),
      p => familyOk(p),
      () => true
    ];
    const tierOf = (p) => tiers.findIndex(t => t(p));

    const usedZoneTitles = {};
    let prevRegion = null;
    const dist = (a, b) => Math.hypot(a.lat - b.lat, (a.lng - b.lng) * Math.cos(a.lat * Math.PI / 180));

    // Group places into geographic regions (a city, a valley, a day-trip spot)
    // so a single day never jumps between far-apart places.
    const region = {};
    all.forEach((p, i) => { region[p.id] = i; });
    const find = (id) => { while (region[id] !== region[all[region[id]].id]) region[id] = region[all[region[id]].id]; return region[id]; };
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        if (dist(all[i], all[j]) <= (dataset.regionRadius || 0.25)) {
          const ri = find(all[i].id), rj = find(all[j].id);
          if (ri !== rj) all.forEach(p => { if (region[p.id] === rj) region[p.id] = ri; });
        }
      }
    }
    const regionOf = (p) => region[p.id];

    for (let dayIndex = 0; dayIndex < targetDays; dayIndex++) {
      const remaining = all.filter(p => !usedPlaceIds.has(p.id));
      if (remaining.length === 0) break;

      // Pick today's region: one that can still fill a whole day, with the most
      // best-matching places left. Then today's district inside that region.
      const regionCounts = {};
      remaining.forEach(p => { regionCounts[regionOf(p)] = (regionCounts[regionOf(p)] || 0) + 1; });
      const bestTier = Math.min(...remaining.map(tierOf));
      const regionScore = {};
      remaining.forEach(p => {
        const r = regionOf(p);
        regionScore[r] = (regionScore[r] || 0) + (tierOf(p) === bestTier ? 1 : 0.01);
      });
      const regionKeys = Object.keys(regionCounts);
      // Look ahead: prefer regions that still leave enough full days for the rest of the trip
      const daysLeftAfter = targetDays - dayIndex - 1;
      const capacityAfter = (r) => regionKeys.reduce((acc, k) =>
        acc + Math.floor((regionCounts[k] - (k === r ? stopsPerDay : 0)) / stopsPerDay), 0);
      let fullRegions = regionKeys.filter(r => regionCounts[r] >= stopsPerDay);
      const feasible = fullRegions.filter(r => capacityAfter(r) >= daysLeftAfter);
      if (feasible.length) fullRegions = feasible;
      // Stay in yesterday's city while it can still fill a day (no back-and-forth travel)
      const regionChoices = fullRegions.length ? fullRegions : regionKeys;
      const dayRegion = (prevRegion !== null && regionChoices.includes(String(prevRegion)))
        ? prevRegion
        : Number(regionChoices.sort((a, b) => (regionScore[b] - regionScore[a]) || (regionCounts[b] - regionCounts[a]))[0]);
      prevRegion = dayRegion;

      const zoneCounts = {};
      remaining.filter(p => regionOf(p) === dayRegion).forEach(p => {
        zoneCounts[p.zone] = (zoneCounts[p.zone] || 0) + (tierOf(p) === bestTier ? 1 : 0.01);
      });
      // The traveller's own hotel for this day (if any)
      const hotel = anchors && anchors[dayIndex] && isFinite(anchors[dayIndex].lat) ? anchors[dayIndex] : null;
      let topZoneKey = Object.keys(zoneCounts).sort((a, b) => zoneCounts[b] - zoneCounts[a])[0] || Object.keys(dataset.zones)[0];
      if (hotel) {
        // Of the districts that can still carry the day, take the one closest to the hotel
        const zoneDist = {};
        Object.keys(zoneCounts).forEach(z => {
          const ps = remaining.filter(p => regionOf(p) === dayRegion && p.zone === z);
          zoneDist[z] = Math.min(...ps.map(p => dist(p, hotel)));
        });
        const enough = Math.min(Math.ceil(stopsPerDay / 2), Math.floor(zoneCounts[topZoneKey]));
        const strong = Object.keys(zoneCounts).filter(z => zoneCounts[z] >= enough);
        if (strong.length) topZoneKey = strong.sort((a, b) => zoneDist[a] - zoneDist[b])[0];
      }
      const zoneMeta = dataset.zones[topZoneKey] || {
        titleTr: countryInfo.nameTr,
        titleEn: countryInfo.nameEn,
        primaryNeighborhood: countryInfo.capital,
        color: "#0284c7"
      };

      const selected = [];
      while (selected.length < stopsPerDay) {
        const pool = all.filter(p => !usedPlaceIds.has(p.id));
        if (pool.length === 0) break;
        const anchor = selected[0];
        pool.sort((a, b) => {
          // Stay inside today's region; if it runs out, use the nearest other places
          const ra = regionOf(a) === dayRegion ? 0 : 1, rb = regionOf(b) === dayRegion ? 0 : 1;
          if (ra !== rb) return ra - rb;
          if (ra === 1 && anchor) return dist(a, anchor) - dist(b, anchor);
          const ta = tierOf(a), tb = tierOf(b);
          if (ta !== tb) return ta - tb;
          const za = a.zone === topZoneKey ? 0 : 1, zb = b.zone === topZoneKey ? 0 : 1;
          if (za !== zb) return za - zb;
          const hp = (p) => hotel ? dist(p, hotel) * 200 : 0; // nudge towards the hotel
          const sa = this.scorePlace(a, interests, budget, travelerType) - (anchor ? dist(a, anchor) * 400 : 0) - hp(a);
          const sb = this.scorePlace(b, interests, budget, travelerType) - (anchor ? dist(b, anchor) * 400 : 0) - hp(b);
          return sb - sa;
        });
        // Keep the day balanced: avoid more than 2 evening stops
        const eveningCount = selected.filter(p => p.timeOfDay === "evening").length;
        const inRegion = pool.filter(p => regionOf(p) === dayRegion);
        const candidates = inRegion.length ? inRegion : pool;
        const pick = candidates.find(p => !(eveningCount >= 2 && p.timeOfDay === "evening")) || candidates[0];
        selected.push(pick);
        usedPlaceIds.add(pick.id);
      }

      // Order logically across the day
      const slotWeights = { morning: 1, afternoon: 2, sunset: 3, evening: 4 };
      selected.sort((a, b) => (slotWeights[a.timeOfDay] || 2) - (slotWeights[b.timeOfDay] || 2));

      // Title the day after the district most of today's stops are in
      const selZoneCounts = {};
      selected.forEach(p => { selZoneCounts[p.zone] = (selZoneCounts[p.zone] || 0) + 1; });
      const dayZoneKey = Object.keys(selZoneCounts).sort((a, b) => selZoneCounts[b] - selZoneCounts[a])[0] || topZoneKey;
      const dayZoneMeta = dataset.zones[dayZoneKey] || zoneMeta;
      usedZoneTitles[dayZoneKey] = (usedZoneTitles[dayZoneKey] || 0) + 1;
      const zonePart = usedZoneTitles[dayZoneKey];

      const stops = this.buildDayStops(selected, countryInfo);
      const dayCategories = [...new Set(selected.flatMap(p => p.category))];
      const dayTitle = this.createDynamicDayTitle(dayIndex + 1, countryInfo, dayCategories, dayZoneMeta, interests);
      if (zonePart > 1 && dayZoneMeta && dayZoneMeta.titleTr && !(interests.length === 1 && ["nightlife", "food"].includes(interests[0]))) {
        dayTitle.tr += ` (${zonePart}. Keşif)`;
        dayTitle.en += ` (Part ${zonePart})`;
      }

      itineraryDays.push({
        dayNumber: dayIndex + 1,
        countryName: countryInfo.nameTr,
        zoneKey: dayZoneKey,
        regionId: dayRegion,
        titleTr: dayTitle.tr,
        titleEn: dayTitle.en,
        neighborhood: dayZoneMeta.primaryNeighborhood || countryInfo.capital,
        color: dayZoneMeta.color || "#0284c7",
        stops: stops,
        stats: {
          stopsCount: stops.length,
          walkingKm: (stops.length * 1.3 + (pace === "fast" ? 2.0 : 0.8)).toFixed(1),
          estimatedHours: (stops.reduce((acc, s) => acc + (s.place.durationHours || 1.5), 0) + 1.0).toFixed(1)
        }
      });
    }

    return {
      country: countryInfo,
      days: itineraryDays,
      totalStops: itineraryDays.reduce((acc, d) => acc + d.stops.length, 0)
    };
  }

  generateProceduralPlan(countryInfo, targetDays, travelerType, interests, pace, budget) {
    const stopsPerDay = pace === "relaxed" ? 3 : pace === "balanced" ? 4 : 5;
    const itineraryDays = [];
    const usedProceduralIds = new Set();

    // Get curated stop pool matching the user's selected interests
    const pools = this.getProceduralPools(countryInfo, budget);

    for (let dayIndex = 0; dayIndex < targetDays; dayIndex++) {
      const dayStopsData = [];
      const slots = ["morning", "afternoon", "sunset", "evening", "evening"].slice(0, stopsPerDay);

      for (let sIdx = 0; sIdx < stopsPerDay; sIdx++) {
        const slot = slots[sIdx];
        // Pick an interest from user's selected interests for this stop
        const interest = interests[sIdx % interests.length];
        const pool = pools[interest] || pools.views;

        // Find an unused stop in this pool, ideally matching slot
        let candidate = pool.find(item => !usedProceduralIds.has(item.id) && item.slot === slot);
        if (!candidate) {
          candidate = pool.find(item => !usedProceduralIds.has(item.id));
        }
        if (!candidate) {
          // If all pool items used, instantiate a variation
          const base = pool[sIdx % pool.length];
          candidate = {
            ...base,
            id: `proc_${countryInfo.id}_d${dayIndex}_s${sIdx}`,
            titleTr: `${base.titleTr} (${dayIndex + 1}. Gün Keşfi)`,
            titleEn: `${base.titleEn} (Day ${dayIndex + 1} Discovery)`
          };
        }
        usedProceduralIds.add(candidate.id);
        dayStopsData.push(candidate);
      }

      // Order stops chronologically
      const slotWeights = { morning: 1, afternoon: 2, sunset: 3, evening: 4 };
      dayStopsData.sort((a, b) => (slotWeights[a.slot] || 2) - (slotWeights[b.slot] || 2));

      const stops = dayStopsData.map((s, idx) => {
        const nextStop = (idx < dayStopsData.length - 1) ? dayStopsData[idx + 1] : null;
        return {
          stepOrder: idx + 1,
          timeSlot: s.slot,
          place: {
            id: s.id,
            nameTr: s.titleTr,
            nameEn: s.titleEn,
            descTr: s.descTr,
            descEn: s.descEn,
            insiderTipTr: s.tipTr,
            insiderTipEn: s.tipEn,
            transitTr: s.transitTr,
            transitEn: s.transitEn,
            image: s.image,
            durationHours: s.dur,
            category: s.cat,
            budgetTier: s.budget,
            lat: countryInfo.lat + (idx * 0.008) - 0.015,
            lng: countryInfo.lng + (idx * 0.012) - 0.02
          },
          transitToNext: nextStop ? {
            tr: `Bir sonraki noktaya (${nextStop.titleTr}) toplu taşıma veya kısa yürüyüşle ulaşabilirsiniz (8-12 dk).`,
            en: `Proceed to next location (${nextStop.titleEn}) via short walk or transit (8-12 mins).`
          } : null
        };
      });

      const dayCategories = [...new Set(dayStopsData.flatMap(s => s.cat))];
      const dayTitle = this.createDynamicDayTitle(dayIndex + 1, countryInfo, dayCategories, null, interests);

      itineraryDays.push({
        dayNumber: dayIndex + 1,
        countryName: countryInfo.nameTr,
        titleTr: dayTitle.tr,
        titleEn: dayTitle.en,
        neighborhood: countryInfo.capital,
        color: this.getInterestColor(interests[0]),
        stops: stops,
        stats: {
          stopsCount: stops.length,
          walkingKm: (stops.length * 1.4 + 1.0).toFixed(1),
          estimatedHours: (stops.reduce((acc, s) => acc + (s.place.durationHours || 1.5), 0) + 1.0).toFixed(1)
        }
      });
    }

    return {
      country: countryInfo,
      days: itineraryDays,
      totalStops: itineraryDays.reduce((acc, d) => acc + d.stops.length, 0)
    };
  }

  // Generate on-demand curated stops strictly matching selected interests and budget
   generateOnDemandStops(countryInfo, interests, budget, dayIndex, count, startIndex) {
    const curatedData = this.curated[countryInfo.id];
    let candidatePool = [];
    if (curatedData && curatedData.places) {
      candidatePool = curatedData.places.filter(p => p.category.some(cat => interests.includes(cat)));
      if (budget === "economy") {
        candidatePool = candidatePool.filter(p => p.budgetTier && p.budgetTier.includes("economy"));
      }
    }

    // Shuffle pool so we don't always pick same items
    const shuffled = [...candidatePool].sort(() => Math.random() - 0.5);

    const pools = this.getProceduralPools(countryInfo, budget);
    const generated = [];
    const usedImgs = new Set();

    for (let i = 0; i < count; i++) {
      const slotIndex = startIndex + i;
      const interest = interests[slotIndex % interests.length];

      // Try to pick a unique place from curated pool not already used
      const unusedCurated = shuffled.filter(p => !usedImgs.has(p.image));
      if (unusedCurated.length > 0) {
        const base = unusedCurated[i % unusedCurated.length];
        usedImgs.add(base.image);
        generated.push({
          id: `curated_ext_${countryInfo.id}_d${dayIndex}_${i}`,
          nameTr: base.nameTr,
          nameEn: base.nameEn,
          zone: base.zone,
          category: base.category,
          lat: base.lat,
          lng: base.lng,
          timeOfDay: base.timeOfDay,
          durationHours: base.durationHours || 2.0,
          budgetTier: base.budgetTier,
          image: base.image,
          descTr: base.descTr,
          descEn: base.descEn,
          insiderTipTr: base.insiderTipTr,
          insiderTipEn: base.insiderTipEn,
          transitTr: base.transitTr,
          transitEn: base.transitEn
        });
      } else {
        const pool = pools[interest] || pools.views;
        const unusedPool = pool.filter(t => !usedImgs.has(t.image));
        const template = unusedPool.length > 0 ? unusedPool[0] : pool[slotIndex % pool.length];
        usedImgs.add(template.image);
        generated.push({
          id: `curated_supp_${countryInfo.id}_d${dayIndex}_${i}`,
          nameTr: template.titleTr,
          nameEn: template.titleEn,
          zone: "extended_district",
          category: template.cat,
          lat: countryInfo.lat + (i * 0.009) - 0.01,
          lng: countryInfo.lng + (i * 0.011) - 0.015,
          timeOfDay: template.slot,
          durationHours: template.dur,
          budgetTier: template.budget,
          image: template.image,
          descTr: template.descTr,
          descEn: template.descEn,
          insiderTipTr: template.tipTr,
          insiderTipEn: template.tipEn,
          transitTr: template.transitTr,
          transitEn: template.transitEn
        });
      }
    }

    return generated;
  }

  createDynamicDayTitle(dayNumber, countryInfo, dayCategories, zoneMeta, interests) {
    // If user selected ONLY nightlife
    if (interests.length === 1 && interests[0] === "nightlife") {
      const titles = [
        { tr: "Canlı Barlar Sokağı & Kraft Publar", en: "Vibrant Bar Street & Craft Pub Crawl" },
        { tr: "Teras Kokteyl Barları & Gün Batımı", en: "Panoramic Rooftop Lounges & Sunset" },
        { tr: "Bohem Gece Meydanları & Caz Kulüpleri", en: "Bohemian Night Plazas & Jazz Cellars" },
        { tr: "Sahil / Nehir Kenarı Açık Hava Barları", en: "Waterfront Lounges & Outdoor Terraces" },
        { tr: "Elektronik Müzik Kulüpleri & Gece Hayatı", en: "Electronic Music Clubs & Nightlife" }
      ];
      const t = titles[(dayNumber - 1) % titles.length];
      return {
        tr: `${dayNumber}. Gün: ${countryInfo.capital} (${t.tr})`,
        en: `Day ${dayNumber}: ${countryInfo.capital} (${t.en})`
      };
    }

    // If user selected ONLY food
    if (interests.length === 1 && interests[0] === "food") {
      const titles = [
        { tr: "Sokak Lezzetleri & Gurme Pazarlar", en: "Street Food & Gourmet Markets" },
        { tr: "Tarihi Fırınlar & Geleneksel Şef Restoranları", en: "Historic Bakeries & Traditional Dining" },
        { tr: "Yöresel Tatlar, Şarap & Çikolata Tadımı", en: "Regional Delicacies & Artisan Tastings" },
        { tr: "Nehir Kıyısı Balık & Akşam Lezzetleri", en: "Waterfront Dining & Evening Bistro" }
      ];
      const t = titles[(dayNumber - 1) % titles.length];
      return {
        tr: `${dayNumber}. Gün: ${countryInfo.capital} (${t.tr})`,
        en: `Day ${dayNumber}: ${countryInfo.capital} (${t.en})`
      };
    }

    // Default zone-aware or interest-aware title
    if (zoneMeta && zoneMeta.titleTr) {
      return {
        tr: `${dayNumber}. Gün: ${zoneMeta.titleTr}`,
        en: `Day ${dayNumber}: ${zoneMeta.titleEn}`
      };
    }

    const catNameTr = dayCategories.includes("nightlife") ? "Gece Hayatı & Barlar" : dayCategories.includes("food") ? "Gurme Lezzetler" : "Şehir Keşfi";
    const catNameEn = dayCategories.includes("nightlife") ? "Nightlife & Pubs" : dayCategories.includes("food") ? "Gastronomy" : "City Highlights";

    return {
      tr: `${dayNumber}. Gün: ${countryInfo.capital} (${catNameTr})`,
      en: `Day ${dayNumber}: ${countryInfo.capital} (${catNameEn})`
    };
  }

  getInterestColor(interest) {
    const colors = {
      history: "#e11d48",
      food: "#ea580c",
      views: "#0284c7",
      bazaars: "#7c3aed",
      art: "#059669",
      nightlife: "#db2777"
    };
    return colors[interest] || "#0284c7";
  }

  scorePlace(place, interests, budget, travelerType) {
    let score = 0;
    const matchingInterests = place.category.filter(c => interests.includes(c));
    score += matchingInterests.length * 15;

    // Heavy boost for exact budget match
    if (budget === "economy" && place.budgetTier.includes("economy")) {
      score += 20;
    } else if (budget === "luxury" && place.budgetTier.includes("luxury")) {
      score += 15;
    }

    if (travelerType === "family") {
      if (place.category.includes("nightlife")) score -= 30;
      if (place.category.includes("views") || place.category.includes("history")) score += 6;
    } else if (travelerType === "couple") {
      if (place.category.includes("views") || place.timeOfDay === "sunset") score += 8;
    } else if (travelerType === "solo") {
      if (place.category.includes("art") || place.category.includes("food")) score += 6;
    } else if (travelerType === "friends") {
      if (place.category.includes("nightlife") || place.category.includes("food")) score += 10;
    }
    return score;
  }

  buildDayStops(places, countryInfo) {
    const defaultSlots = ["morning", "afternoon", "sunset", "evening", "evening"];
    return places.map((place, index) => {
      const slot = place.timeOfDay || (index < defaultSlots.length ? defaultSlots[index] : "afternoon");
      let nextTransit = null;
      if (index < places.length - 1) {
        const nextPlace = places[index + 1];
        nextTransit = {
          tr: `${place.nameTr} çıkışında kısa bir yürüyüş veya metro/tramvay ile bir sonraki noktaya (${nextPlace.nameTr}) kolayca geçebilirsiniz.`,
          en: `Take an easy short walk or quick metro/tram connection to the next stop (${nextPlace.nameEn}).`
        };
      }

      return {
        stepOrder: index + 1,
        timeSlot: slot,
        place: place,
        transitToNext: nextTransit
      };
    });
  }

  getProceduralPools(countryInfo, budget) {
    const isEcon = budget === "economy";
    const budgetTiers = isEcon ? ["economy"] : ["economy", "moderate", "luxury"];
    const imgs = (countryInfo && countryInfo.images) ? countryInfo.images : {};
    const histImg = imgs.history || "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=900&auto=format&fit=crop&q=80";
    const viewImg = imgs.views || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80";
    const nightImg = imgs.nightlife || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&auto=format&fit=crop&q=80";
    const foodImg = imgs.food || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80";
    const bazaarImg = imgs.bazaars || imgs.views || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80";
    const artImg = imgs.art || imgs.history || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&auto=format&fit=crop&q=80";

    return {
      nightlife: [
        {
          id: `proc_nl_bars_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Canlı Barlar Sokağı & Kraft Publar`,
          titleEn: `${countryInfo.capital} Vibrant Bar Street & Craft Pubs`,
          cat: ["nightlife"],
          slot: "evening",
          dur: 2.5,
          budget: budgetTiers,
          image: nightImg,
          descTr: `Kentin en hareketli gece sokağında yerel fıçı biralar, samimi atmosfer ve canlı sokak enerjisi.`,
          descEn: `Vibrant pedestrian street lined with craft beer pubs, open terraces, and lively evening energy.`,
          tipTr: isEcon 
            ? "Açık hava barlarında yerel fıçı bira veya içecekler son derece ekonomiktir; giriş ücreti yoktur."
            : "Açık hava masalarında oturup yerel butik biraları veya ev yapımı kokteylleri deneyin.",
          tipEn: isEcon
            ? "Outdoor street pubs have no cover charge and offer very cheap local draft beers."
            : "Grab a sidewalk table to sample regional draft beers and local craft cocktails.",
          transitTr: "Merkez metro istasyonundan 5 dk yürüyüş.",
          transitEn: "5 mins walk from the central metro station."
        },
        {
          id: `proc_nl_rooftop_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Panoramik Teras Kokteyl Lounge`,
          titleEn: `${countryInfo.capital} Panoramic Sunset Rooftop Lounge`,
          cat: ["nightlife", "views"],
          slot: "sunset",
          dur: 2.0,
          budget: isEcon ? ["economy", "moderate"] : ["moderate", "luxury"],
          image: nightImg,
          descTr: `Şehrin ışıklarını ve gün batımını yukarıdan izleyebileceğiniz nefis manzaralı çatı barı ve imza kokteyller.`,
          descEn: `High-rise rooftop terrace offering sweeping sunset vistas over the illuminated city skyline.`,
          tipTr: "Gün batımından yarım saat önce giderek ışıkların tek tek yanışını fotoğraflayın.",
          tipEn: "Arrive 30 minutes before golden hour to secure a perimeter view table.",
          transitTr: "Meydandan 8 dk yürüyüş mesafesinde.",
          transitEn: "8 mins walk from the main plaza."
        },
        {
          id: `proc_nl_jazz_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Canlı Caz & Akustik Müzik Kulübü`,
          titleEn: `${countryInfo.capital} Live Jazz & Acoustic Music Cellar`,
          cat: ["nightlife"],
          slot: "evening",
          dur: 2.5,
          budget: budgetTiers,
          image: nightImg,
          descTr: `Tarihi taş kemerler altında yerel ve uluslararası müzisyenlerin sahne aldığı samimi caz kulübü.`,
          descEn: `Intimate brick-vaulted underground music cellar hosting nightly live jazz and acoustic sets.`,
          tipTr: "Müzik başlamadan önce yerleşip yerel içecek eşliğinde performansın tadını çıkarın.",
          tipEn: "Arrive before the first set starts and enjoy a drink by the stage.",
          transitTr: "Merkez tramvayı ile Sanat durağı.",
          transitEn: "Direct tramway to the Arts district."
        },
        {
          id: `proc_nl_club_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Gece Kulübü & Elektronik Müzik Sahnesi`,
          titleEn: `${countryInfo.capital} Underground Dance Club & DJ Stage`,
          cat: ["nightlife"],
          slot: "evening",
          dur: 3.0,
          budget: isEcon ? ["economy", "moderate"] : ["moderate", "luxury"],
          image: nightImg,
          descTr: `Yerel ve uluslararası DJ'lerin ritimleriyle sabahın ilk ışıklarına kadar süren dinamik dans gecesi.`,
          descEn: `Pulsating nightlife venue with world-class sound system and DJ sets until late.`,
          tipTr: "Girişte kuyruk beklememek için biletinizi online veya erken saatte temin edin.",
          tipEn: "Check DJ listings and arrive early to skip the late-night queue.",
          transitTr: "Güvenli gece taksisi veya gece metrosu ile kolay ulaşım.",
          transitEn: "Official night cab or night metro line."
        },
        {
          id: `proc_nl_waterfront_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Sahil / Nehir Kenarı Açık Hava Lounge Bar`,
          titleEn: `${countryInfo.capital} Waterfront Open-Air Lounge Bar`,
          cat: ["nightlife", "views"],
          slot: "sunset",
          dur: 2.0,
          budget: budgetTiers,
          image: viewImg,
          descTr: `Su kenarında ahşap iskeleler, hafif lounge müziği ve serinletici içecekler eşliğinde dinlendirici akşam.`,
          descEn: `Relaxing waterfront wooden pier with ambient lounge music, refreshing drinks, and cool river breeze.`,
          tipTr: "Akşamüstü saatlerinde nehir kenarında yürüyüş yapıp açık hava barlarına geçin.",
          tipEn: "Combine an afternoon waterside stroll with sunset drinks by the docks.",
          transitTr: "Sahil tramvayı ile İskele durağı.",
          transitEn: "Coastal tram to the Marina stop."
        },
        {
          id: `proc_nl_food_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Meşhur Gece Sokak Lezzetleri Durağı`,
          titleEn: `${countryInfo.capital} Late-Night Street Food & Night Bites`,
          cat: ["nightlife", "food"],
          slot: "evening",
          dur: 1.0,
          budget: ["economy"],
          image: foodImg,
          descTr: `Barlar çıkışında yerel halkın akın ettiği sıcak, taze ve ekonomik gece atıştırmalık tezgahları.`,
          descEn: `Beloved late-night street food spot where revelers gather for hot, affordable regional post-party snacks.`,
          tipTr: "Kentin en meşhur sıcak sokak sandviçi veya çorbasını yerinde deneyin; oldukça ekonomiktir.",
          tipEn: "Try the city's signature hot street roll or midnight soup; very budget friendly.",
          transitTr: "Barlar sokağının hemen köşesinde.",
          transitEn: "Right around the corner from the nightlife strip."
        }
      ],
      food: [
        {
          id: `proc_fd_bakery_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Tarihi Sabah Fırını & Yerel Kahve`,
          titleEn: `${countryInfo.capital} Historic Morning Bakery & Artisan Coffee`,
          cat: ["food"],
          slot: "morning",
          dur: 1.5,
          budget: ["economy", "moderate"],
          image: foodImg,
          descTr: `Sabahın erken saatlerinde fırından yeni çıkmış sıcacık geleneksel hamur işleri ve taze demlenmiş yerel kahve.`,
          descEn: `Artisan bakery serving warm regional pastries fresh from the stone ovens paired with rich morning roast coffee.`,
          tipTr: "Fırının vitrinindeki en çok tercih edilen yöresel çöreği sıcak olarak isteyin.",
          tipEn: "Ask for the bakery's signature warm flaky pastry straight from the oven.",
          transitTr: "Merkez yaya caddesinden 3 dk yürüyüş.",
          transitEn: "3 mins walk from the central pedestrian boulevard."
        },
        {
          id: `proc_fd_market_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Otantik Gurme Pazarı & Sokak Lezzetleri`,
          titleEn: `${countryInfo.capital} Authentic Food Market & Street Tastings`,
          cat: ["food", "bazaars"],
          slot: "afternoon",
          dur: 2.0,
          budget: ["economy", "moderate"],
          image: foodImg,
          descTr: `Ülkenin dört bir yanından gelen taze peynirler, şarküteri ürünleri, sokak lezzetleri ve meyve tezgahları.`,
          descEn: `Bustling market hall offering regional artisan cheeses, charcuterie, and street food tastings.`,
          tipTr: "Tezgahları gezerken küçük porsiyonlar halinde farklı lezzetleri tadarak doyurucu ve ekonomik bir öğle yemeği çıkarın.",
          tipEn: "Sample small bites from multiple stalls for a diverse and budget-friendly lunch.",
          transitTr: "Pazar Meydanı metro durağı.",
          transitEn: "Take the metro directly to Market Square."
        },
        {
          id: `proc_fd_bistro_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Geleneksel Şef Restoranı & Yöresel Yemekler`,
          titleEn: `${countryInfo.capital} Traditional Bistro & Regional Signature Dinner`,
          cat: ["food"],
          slot: "evening",
          dur: 2.0,
          budget: budgetTiers,
          image: foodImg,
          descTr: `Nesillerdir aktarılan geleneksel tariflerle pişirilen tencere yemekleri ve bölgesel spesiyaliteler.`,
          descEn: `Celebrated traditional dining room serving time-honored slow-cooked regional recipes and desserts.`,
          tipTr: "Garsona günün yöresel tencere yemeğini veya spesiyalitesini mutlaka sorun.",
          tipEn: "Ask the host for the house specialty of the day paired with regional wine.",
          transitTr: "Tarihi merkezden yürüyerek 6 dk.",
          transitEn: "6 mins leisurely walk through the historic district."
        },
        {
          id: `proc_fd_dessert_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Tarihi Tatlıcı & Yerel Tatlı Tadımı`,
          titleEn: `${countryInfo.capital} Heritage Confectionery & Dessert Tasting`,
          cat: ["food"],
          slot: "sunset",
          dur: 1.5,
          budget: ["economy", "moderate"],
          image: foodImg,
          descTr: `Şehrin en köklü tatlı salonunda el yapımı çikolatalar, yöresel tatlılar ve taze çay/kahve servisi.`,
          descEn: `Historic confectioner crafting artisanal desserts, cakes, and regional sweet delicacies.`,
          tipTr: "Günün tatlısını yöresel bitki çayı eşliğinde deneyin.",
          tipEn: "Pair the house specialty dessert with aromatic herbal tea.",
          transitTr: "Meydandan 4 dk yürüyüş.",
          transitEn: "4 mins walk from the square."
        }
      ],
      history: [
        {
          id: `proc_hi_square_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Tarihi Başkent Meydanı & Anıtlar`,
          titleEn: `${countryInfo.capital} Grand Historic Square & Memorials`,
          cat: ["history", "views"],
          slot: "morning",
          dur: 2.0,
          budget: ["economy", "moderate", "luxury"],
          image: histImg,
          descTr: `Yüzyıllık tarihi belediye binası, anıt heykeller ve taş döşeli görkemli ana meydan.`,
          descEn: `The historical epicenter boasting centuries-old civic architecture, monuments, and stone plazas.`,
          tipTr: "Meydanda yürümek tamamen ücretsizdir; sabah erken saatte kalabalıksız fotoğraflar çekin.",
          tipEn: "Walking through the square is free; visit early for crowd-free landmark photography.",
          transitTr: "Merkez metro veya tramvay durağı.",
          transitEn: "Central metro or tram stop."
        },
        {
          id: `proc_hi_museum_${countryInfo.id}`,
          titleTr: `${countryInfo.nameTr} Ulusal Sanat & Tarih Müzesi`,
          titleEn: `National Museum of ${countryInfo.nameEn}`,
          cat: ["history", "art"],
          slot: "afternoon",
          dur: 2.5,
          budget: isEcon ? ["economy", "moderate"] : ["moderate", "luxury"],
          image: artImg,
          descTr: `Ülkenin köklü arkeolojik mirası, kraliyet hazineleri ve sanat başyapıtlarını sergileyen ulusal müze.`,
          descEn: `The premiere cultural institution preserving ancient relics, royal collections, and master paintings.`,
          tipTr: "Biletinizi online alarak veya varsa indirimli saatleri kontrol ederek sıradan kaçının.",
          tipEn: "Check online for discounted admission hours or city passes to save money.",
          transitTr: "Meydandan 10 dk yürüyüş.",
          transitEn: "10 mins walk from the main plaza."
        },
        {
          id: `proc_hi_palace_${countryInfo.id}`,
          titleTr: `${countryInfo.nameTr} Kraliyet / Tarihi Sarayı`,
          titleEn: `Royal Palace & Historic Grounds`,
          cat: ["history", "views"],
          slot: "morning",
          dur: 2.5,
          budget: isEcon ? ["economy", "moderate"] : ["moderate", "luxury"],
          image: histImg,
          descTr: `Görkemli cephesi, mermer avluları ve bakımlı peyzajlı saray bahçeleri.`,
          descEn: `Monumental palace complex with manicured botanical courtyards and state rooms.`,
          tipTr: "Sarayın dış bahçeleri ve avlularını gezmek ücretsizdir.",
          tipEn: "The palace outer gardens and courtyards are free to explore.",
          transitTr: "Saray Parkı tramvay durağı.",
          transitEn: "Palace Park tram stop."
        },
        {
          id: `proc_hi_fort_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Antik Kale & Şehir Surları`,
          titleEn: `${countryInfo.capital} Ancient Citadel & Fort Ramparts`,
          cat: ["history", "views"],
          slot: "sunset",
          dur: 2.0,
          budget: ["economy", "moderate"],
          image: viewImg,
          descTr: `Tarih boyunca şehri koruyan taş burçlar, kuleler ve gün batımında kente bakan surlar.`,
          descEn: `Historic hilltop stone fortress commanding sweeping views over the medieval town and river.`,
          tipTr: "Surlara gün batımında çıkarak antik taşların üzerinden batan güneşi izleyin.",
          tipEn: "Walk the outer ramparts at dusk for striking golden light over the rooftops.",
          transitTr: "Füniküler veya kale otobüsü ile 10 dk.",
          transitEn: "10 mins by funicular or local fortress shuttle."
        }
      ],
      views: [
        {
          id: `proc_vi_hill_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Panoramik Seyir Tepesi & Füniküler`,
          titleEn: `${countryInfo.capital} Panoramic Hilltop & Scenic View`,
          cat: ["views"],
          slot: "morning",
          dur: 2.0,
          budget: ["economy", "moderate"],
          image: viewImg,
          descTr: `Şehri, nehirleri ve çevredeki doğayı kuşbakışı gören en etkileyici manzara seyir noktası.`,
          descEn: `Sweeping mountain/hilltop panoramic vantage point accessible via walking path or funicular.`,
          tipTr: "Seyir terasındaki banklarda temiz havanın ve geniş şehir açısının tadını çıkarın; tamamen ücretsizdir.",
          tipEn: "Free public viewing terrace offering the best wide-angle landscape shots.",
          transitTr: "Merkezden teleferik veya yürüyüş ile 10 dk.",
          transitEn: "10 mins funicular or pleasant hike from downtown."
        },
        {
          id: `proc_vi_cruise_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Nehir / Sahil Tekne Gezisi`,
          titleEn: `${countryInfo.capital} Scenic Waterfront Boat Cruise`,
          cat: ["views"],
          slot: "afternoon",
          dur: 1.5,
          budget: budgetTiers,
          image: viewImg,
          descTr: `Kentin köprüleri ve yalıları altından geçen sakin ve dinlendirici tekne yolculuğu.`,
          descEn: `A relaxing boat cruise navigating past ancient bridges, waterfront promenades, and skyline views.`,
          tipTr: "Açık güvertede rüzgara karşı oturup şehri su seviyesinden fotoğraflayın.",
          tipEn: "Sit on the open upper deck for the best reflection photography.",
          transitTr: "Merkez vapur iskelesinden 5 dk yürüme.",
          transitEn: "5 mins walk to the central pier."
        },
        {
          id: `proc_vi_park_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Doğa Parkı & Botanik Vadisi`,
          titleEn: `${countryInfo.capital} Botanical Park & Valley Nature Walk`,
          cat: ["views"],
          slot: "afternoon",
          dur: 2.0,
          budget: ["economy"],
          image: viewImg,
          descTr: `Şehir merkezinde yeşil göletler, çiçek bahçeleri ve huzurlu yürüyüş yolları.`,
          descEn: `Lush green urban oasis with walking paths, lotus ponds, and manicured flora.`,
          tipTr: "Giriş tamamen ücretsizdir; dinlenmek ve piknik yapmak için mükemmel bir duraktır.",
          tipEn: "Free entrance; an ideal midday haven to recharge surrounded by nature.",
          transitTr: "Metro Park durağından 2 dk yürüyüş.",
          transitEn: "2 mins walk from Park metro stop."
        }
      ],
      art: [
        {
          id: `proc_ar_street_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Bohem Sanat Sokakları & Duvar Resimleri`,
          titleEn: `${countryInfo.capital} Bohemian Arts Quarter & Street Murals`,
          cat: ["art"],
          slot: "afternoon",
          dur: 2.0,
          budget: ["economy", "moderate"],
          image: artImg,
          descTr: `Sokak grafitileri, bağımsız sanat atölyeleri, vintage plakçılar ve konsept kahveciler.`,
          descEn: `Creative indie quarter brimming with street art murals, artist studios, and retro bookshops.`,
          tipTr: "Sokak sanatını yürüyerek gezmek ücretsizdir; ara sokaklardaki ilginç çizimleri keşfedin.",
          tipEn: "Completely free to stroll; explore the colorful murals and independent craft workshops.",
          transitTr: "Sanatçılar durağından 4 dk yürüme.",
          transitEn: "4 mins walk from the Arts tram stop."
        },
        {
          id: `proc_ar_gallery_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Çağdaş Sanat Müzesi & Tasarım Galerisi`,
          titleEn: `${countryInfo.capital} Modern Art Gallery & Design Center`,
          cat: ["art"],
          slot: "morning",
          dur: 2.0,
          budget: isEcon ? ["economy", "moderate"] : ["moderate", "luxury"],
          image: artImg,
          descTr: `Modern heykel enstalasyonları, çağdaş resim sergileri ve avangard mimari.`,
          descEn: `Cutting-edge contemporary gallery presenting thought-provoking installations and modern design.`,
          tipTr: "Müzenin tasarım dükkanındaki özgün hatıraları inceleyin.",
          tipEn: "Browse the museum bookstore for unique architecture and design publications.",
          transitTr: "Müze metro durağı.",
          transitEn: "Direct metro to Museum station."
        }
      ],
      bazaars: [
        {
          id: `proc_bz_covered_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Tarihi Kapalı Çarşı & El Sanatları`,
          titleEn: `${countryInfo.capital} Historic Covered Bazaar & Artisan Crafts`,
          cat: ["bazaars"],
          slot: "afternoon",
          dur: 2.0,
          budget: budgetTiers,
          image: bazaarImg,
          descTr: `Yüzyıllık tarihi çarşı kemerleri altında el dokuması kumaşlar, seramikler, deri ve hediyelikler.`,
          descEn: `Heritage covered arcade packed with artisan ceramics, handwoven fabrics, and local handicrafts.`,
          tipTr: "Çarşıyı gezmek ücretsizdir; yerel el sanatı ustalarını çalışırken izleyin.",
          tipEn: "Free to wander and admire local artisans handcrafting copperware and textiles.",
          transitTr: "Çarşı tramvay durağı.",
          transitEn: "Bazaar tramway stop."
        },
        {
          id: `proc_bz_flea_${countryInfo.id}`,
          titleTr: `${countryInfo.capital} Antika & Tasarım Butikleri Pasajı`,
          titleEn: `${countryInfo.capital} Vintage Flea Market & Design Passage`,
          cat: ["bazaars", "art"],
          slot: "sunset",
          dur: 1.5,
          budget: ["economy", "moderate"],
          image: bazaarImg,
          descTr: `Eski plaklar, antika saatler, nostaljik kartpostallar ve yerel tasarımcı ürünleri.`,
          descEn: `Atmospheric flea market and glass-covered arcade for vintage watches, retro records, and curiosities.`,
          tipTr: "Tezgahlardaki eski nostaljik kartpostallar uygun fiyatlı harika bir hatıradır.",
          tipEn: "Vintage postcards and retro coins make wonderful budget souvenirs.",
          transitTr: "Eski Şehir meydanından 5 dk.",
          transitEn: "5 mins from Old Town square."
        }
      ]
    };
  }
}
