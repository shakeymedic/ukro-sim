// main.js
// Entry point for the UKRO scenario simulator.
// This script hooks up the UI buttons to the scenario generation functions
// and passes user-selected options (like hazard probability and EV hazards)
// to the scenario generator. It also attaches score sheets from the
// framework data to each scenario for debriefing.

import { generateRtcScenario, generateTraumaScenario } from './scenario.js';
import { showMenu, renderSetupScreen } from './ui.js';
import { frameworkData } from './data.js';

// Initialise the application once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
  // Render the main menu with scenario generation options.
  showMenu();

  // Centralised click handler for buttons on the page. This avoids
  // attaching individual listeners to each button and ensures we
  // correctly capture events even if elements are re-rendered.
  document.addEventListener('click', e => {
    // Generate RTC scenario button clicked
    if (e.target.id === 'genRtc') {
      const nVeh = parseInt(document.getElementById('rtc-vehicles').value, 10);
      const nPat = parseInt(document.getElementById('rtc-patients').value, 10);
      // Validate patient count against vehicle capacity (max 5 per vehicle)
      if (nPat > nVeh * 5) {
        alert('Patient count exceeds vehicle capacity.');
        return;
      }
      // Read hazard options from UI controls
      const includeEVBatteryHazard = document.getElementById('opt-evhaz').checked;
      const hazardProbability = Number(document.getElementById('opt-hp').value) / 100;
      const forceHazards = [...document.querySelectorAll('.force-hazard:checked')].map(cb => cb.value);

      // Generate a new RTC scenario using the selected options
      const scenario = generateRtcScenario(nVeh, nPat, {
        includeEVBatteryHazard,
        hazardProbability,
        forceHazards
      });
      // Attach scoring categories so the debrief can build its checklist
      scenario.scoresheets = frameworkData.scoresheets;
      // Display the setup/briefing screen for the generated scenario
      renderSetupScreen(scenario);
    }
    // Generate Trauma scenario button clicked
    if (e.target.id === 'genTrauma') {
      const nPat = parseInt(document.getElementById('trauma-patients').value, 10);
      const includeEVBatteryHazard = document.getElementById('opt-evhaz-trauma').checked;
      const hazardProbability = Number(document.getElementById('opt-hp-trauma').value) / 100;
      const forceHazards = [...document.querySelectorAll('.force-hazard-trauma:checked')].map(cb => cb.value);

      // Generate a trauma scenario with the chosen options
      const scenario = generateTraumaScenario(nPat, {
        includeEVBatteryHazard,
        hazardProbability,
        forceHazards
      });
      scenario.scoresheets = frameworkData.scoresheets;
      renderSetupScreen(scenario);
    }
  });
});
