// js/scenario.js
import { frameworkData } from './data.js';

// --- Helper Functions ---
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const pickKeys = obj => Object.keys(obj);

const CANVAS_W = 900;
const CANVAS_H = 520;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function near(anchorX, anchorY, radius = 80) {
  const x = clamp(anchorX + rand(-radius, radius), 40, CANVAS_W - 40);
  const y = clamp(anchorY + rand(-radius, radius), 40, CANVAS_H - 40);
  return { x, y };
}

function randomLayoutType() {
  return Math.random() < 0.6 ? 't-junction' : 'offset-headon';
}

// --- Core Logic ---
function makeCasualty(id, injuryKeyOverride = null) {
  const injuryKey = injuryKeyOverride || choice(pickKeys(frameworkData.injuries));
  const injury = frameworkData.injuries[injuryKey];

  const ageBuckets = [
    () => randInt(6, 12), () => randInt(16, 30),
    () => randInt(31, 55), () => randInt(65, 88)
  ];
  const age = Math.random() < 0.12 ? ageBuckets[0]() :
              Math.random() < 0.55 ? ageBuckets[1]() :
              Math.random() < 0.85 ? ageBuckets[2]() : ageBuckets[3]();

  const vitals = { ...injury.vitals };

  return {
    id,
    age,
    injuries: [{ ...injury, key: injuryKey }],
    vitals: { ...vitals },
    prevVitals: { ...vitals },
    treatedInjuries: new Set(),
    entrapment: injury.canSelfExtricate ? 'No physical entrapment.' : 'Physical entrapment by intrusion.',
    ample: {
      A: choice(frameworkData.ampleHistory.allergies),
      M: choice(frameworkData.ampleHistory.medications),
      P: choice(frameworkData.ampleHistory.pastHistory),
      L: choice(frameworkData.ampleHistory.lastMeal),
      E: choice(frameworkData.ampleHistory.events)
    },
    initialVitals: { ...vitals }
  };
}

function instantiateHazard(t, anchor) {
  const pos = near(anchor.x, anchor.y, 140);
  if (t.type === 'Fuel Spill') {
    return { type: t.type, x: pos.x, y: pos.y, rx: rand(t.minR, t.maxR), ry: rand(t.minR * 0.4, t.maxR * 0.7), rotation: rand(0, Math.PI) };
  }
  if (t.type === 'Fire' || t.type === 'Battery Fire') {
    return { type: t.type, x: pos.x, y: pos.y, r: rand(t.minR, t.maxR) };
  }
  if (t.type === 'Wall') {
    return { type: t.type, x: rand(80, CANVAS_W - 80 - 16), y: rand(60, 120), w: t.width_m * 16, h: t.height_m * 16 };
  }
  if (t.type === 'Lamppost') {
    return { type: t.type, x: rand(70, CANVAS_W - 70), y: rand(140, CANVAS_H - 140) };
  }
  return null;
}

function spawnHazards(vehicles, probability, forced = [], includeBatteryFire = false) {
  const anchor = vehicles[0] ? { x: vehicles[0].x, y: vehicles[0].y } : { x: CANVAS_W * 0.5, y: CANVAS_H * 0.5 };
  const isEVPresent = vehicles.some(v => v.isEV);
  const pool = frameworkData.hazardTemplates.filter(t => !(t.type === 'Battery Fire' && !(isEVPresent && includeBatteryFire)));
  const chosen = pool.map(t => {
    if (forced.includes(t.type) || (t.type !== 'Battery Fire' && Math.random() < probability)) {
      return instantiateHazard(t, anchor);
    }
    return null;
  }).filter(Boolean);

  const unique = [];
  const seen = new Set();
  for (const h of chosen) {
    if (!seen.has(h.type)) {
      unique.push(h);
      seen.add(h.type);
    }
  }
  return unique;
}

function spawnVehicles(numVehicles, layout) {
  const vehicleKeys = pickKeys(frameworkData.vehicles);
  const colors = ['#60a5fa', '#facc15', '#4ade80', '#fb7185'];

  const vehicles = [];
  if (layout === 't-junction') {
    for (let i = 0; i < numVehicles; i++) {
      const proto = frameworkData.vehicles[choice(vehicleKeys)];
      vehicles.push({
        ...proto, id: i, color: colors[i % colors.length],
        position: { name: 'Upright on all fours', rotation: i === 0 ? rand(-12, 12) : rand(78, 100) },
        x: (i === 0 ? CANVAS_W * 0.42 : CANVAS_W * 0.53) + rand(-20, 20),
        y: (i === 0 ? CANVAS_H * 0.40 : CANVAS_H * 0.56) + rand(-15, 15),
        impactType: i === 0 ? 'frontal' : 'side',
        impactSide: i === 0 ? null : (Math.random() < 0.5 ? 'nearside' : 'offside'),
        damage: i === 0 ? 'Frontal intrusion from T-bone' : 'Severe side intrusion from T-bone',
        casualties: []
      });
    }
  } else {
    for (let i = 0; i < numVehicles; i++) {
      const proto = frameworkData.vehicles[choice(vehicleKeys)];
      vehicles.push({
        ...proto, id: i, color: colors[i % colors.length],
        position: { name: 'Upright on all fours', rotation: rand(-15, 15) },
        x: CANVAS_W * (0.35 + i * 0.18) + rand(-10, 10),
        y: CANVAS_H * (0.44 + i * 0.1) + rand(-12, 12),
        impactType: 'frontal',
        damage: 'Frontal intrusion from offset collision',
        casualties: []
      });
    }
  }
  return vehicles;
}

// --- Exported Functions ---
export function generateRtcScenario(numVehicles = 2, numPatients = 2, options = {}) {
  const { hazardProbability = 0.55, forceHazards = [], includeEVBatteryHazard = false, presetInjuries = [] } = options;

  const layout = randomLayoutType();
  const vehicles = spawnVehicles(numVehicles, layout);
  const totalCapacity = vehicles.reduce((a, v) => a + v.capacity, 0);
  numPatients = Math.min(numPatients, totalCapacity);

  const casualties = Array.from({ length: numPatients }, (_, i) => makeCasualty(i, presetInjuries[i] || null));
  casualties.forEach((cas, idx) => {
    vehicles[idx % vehicles.length].casualties.push(cas);
  });

  const hazards = spawnHazards(vehicles, hazardProbability, forceHazards, includeEVBatteryHazard);

  return {
    type: 'RTC', title: 'RTC Challenge', timeLimit: 20,
    location: layout === 't-junction' ? 'Urban T-Junction' : 'Urban A-Road',
    hazards: hazards.map(h => h.type).join(', ') || 'None obvious',
    vehicles, casualties, environmentalObjects: hazards, layoutType: layout,
    canvas: { width: CANVAS_W, height: CANVAS_H }
  };
}

export function generateTraumaScenario(numPatients = 2, options = {}) {
  const { hazardProbability = 0.42, forceHazards = [], presetInjuries = [] } = options;

  const casualties = Array.from({ length: numPatients }, (_, i) => makeCasualty(i, presetInjuries[i] || null));
  const hazards = spawnHazards([], hazardProbability, forceHazards, false);

  return {
    type: 'Trauma', title: 'Trauma Challenge', timeLimit: 12,
    location: 'Industrial unit',
    hazards: hazards.map(h => h.type).join(', ') || 'None obvious',
    vehicles: [], casualties, environmentalObjects: hazards, layoutType: 't-junction',
    canvas: { width: CANVAS_W, height: CANVAS_H }
  };
}
