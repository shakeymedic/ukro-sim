// sim.js
import { addLog } from './log.js';

/**
 * Compute trend arrows for display vs previous vitals.
 */
export function vitalTrendLine(c) {
  const v = c.vitals;
  const p = c.prevVitals || v;
  const arrow = (curr, prev) => curr > prev ? '▲' : curr < prev ? '▼' : '▬';

  return `GCS:${v.GCS} ${arrow(v.GCS, p.GCS)} | ` +
         `HR:${v.HR} ${arrow(v.HR, p.HR)} | ` +
         `RR:${v.RR} ${arrow(v.RR, p.RR)} | ` +
         `SBP:${v.SBP} ${arrow(v.SBP, p.SBP)} | ` +
         `SpO2:${v.SpO2}% ${arrow(v.SpO2, p.SpO2)}`;
}

/**
 * Advance simulation one tick.
 */
export function simulationTick(allCasualties) {
  (allCasualties || []).forEach(cas => {
    cas.prevVitals = { ...cas.vitals };

    let changed = false;

    (cas.injuries || []).forEach(inj => {
      if (cas.treatedInjuries?.has?.(inj.key)) return;
      if (inj.deterioration) {
        Object.entries(inj.deterioration).forEach(([k, delta]) => {
          const before = cas.vitals[k];
          if (k === 'GCS') cas.vitals[k] = Math.max(3, Math.round(before + delta));
          else cas.vitals[k] = Math.round(before + delta);
          changed = true;
        });
      }
    });

    // Gentle random noise
    cas.vitals.HR += Math.random() < 0.25 ? (Math.random() < 0.5 ? 1 : -1) : 0;
    cas.vitals.RR += Math.random() < 0.2 ? (Math.random() < 0.5 ? 1 : -1) : 0;

    if (changed) {
      addLog(`Casualty ${cas.id + 1} showing deterioration.`, 'bad');
    }
  });
}

/** Apply a named intervention to a casualty/injury and update prevVitals */
export function applyIntervention(cas, injuryKey, interventionKey, btnEl) {
  const inj = cas?.injuries?.find(i => i.key === injuryKey);
  const intervention = inj?.interventions?.[interventionKey];
  if (!inj || !intervention) return;

  cas.prevVitals = { ...cas.vitals };

  Object.entries(intervention.effect || {}).forEach(([k, v]) => {
    cas.vitals[k] = Math.max(0, Math.round(cas.vitals[k] + v));
  });

  if (intervention.stopsDeterioration) {
    cas.treatedInjuries.add(injuryKey);
    if (btnEl) btnEl.disabled = true;
  }
  addLog(`Intervention on Casualty ${cas.id + 1}: ${intervention.feedback}`, 'good');
}
