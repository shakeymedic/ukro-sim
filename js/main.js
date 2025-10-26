// js/main.js
// Entry point for the UKRO scenario simulator.

import { generateRtcScenario, generateTraumaScenario } from './scenario.js';
import { showMenu, renderSetupScreen } from './ui.js';
import { frameworkData } from './data.js';

// Initialise the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  // Render the main menu with scenario generation options.
  showMenu();

  // Centralised click handler for buttons on the page.
  document.addEventListener('click', e => {
    const presetInjuries = Array.from(document.getElementById('preset-injuries')?.selectedOptions || []).map(o => o.value);

    // Generate RTC scenario button clicked
    if (e.target.id === 'genRtc') {
      const nVeh = parseInt(document.getElementById('rtc-vehicles').value, 10);
      const nPat = parseInt(document.getElementById('rtc-patients').value, 10);
      if (nPat > nVeh * 5) {
        alert('Patient count exceeds vehicle capacity.');
        return;
      }

      const options = {
        includeEVBatteryHazard: document.getElementById('opt-evhaz').checked,
        hazardProbability: Number(document.getElementById('opt-hp').value) / 100,
        forceHazards: [...document.querySelectorAll('.force-hazard:checked')].map(cb => cb.value),
        presetInjuries
      };

      const scenario = generateRtcScenario(nVeh, nPat, options);
      scenario.scoresheets = frameworkData.scoresheets;
      renderSetupScreen(scenario);
    }

    // Generate Trauma scenario button clicked
    if (e.target.id === 'genTrauma') {
      const nPat = parseInt(document.getElementById('trauma-patients').value, 10);
      const options = {
        includeEVBatteryHazard: document.getElementById('opt-evhaz-trauma').checked,
        hazardProbability: Number(document.getElementById('opt-hp-trauma').value) / 100,
        forceHazards: [...document.querySelectorAll('.force-hazard-trauma:checked')].map(cb => cb.value),
        presetInjuries
      };

      const scenario = generateTraumaScenario(nPat, options);
      scenario.scoresheets = frameworkData.scoresheets;
      renderSetupScreen(scenario);
    }
  });
});
