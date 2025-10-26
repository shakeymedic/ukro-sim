// js/main.js
import { generateRtcScenario, generateTraumaScenario } from './scenario.js';
import { showMenu, renderSetupScreen, renderLiveSim, bindLiveSimEvents, renderDebrief, exportDebriefAsPdf, state, handleActionClick } from './ui.js';
import { frameworkData } from './data.js';
import { addLog } from './log.js';

document.addEventListener('DOMContentLoaded', () => {
  showMenu();

  // A single, powerful event listener for the whole app
  document.getElementById('app').addEventListener('click', e => {
    const target = e.target; // The element that was clicked

    // --- Menu Screen ---
    if (target.id === 'genRtc' || target.id === 'genTrauma') {
      const isRtc = target.id === 'genRtc';
      const prefix = isRtc ? 'rtc' : 'trauma';
      const presetInjuries = Array.from(document.getElementById('preset-injuries')?.selectedOptions || []).map(o => o.value);

      const options = {
        includeEVBatteryHazard: document.getElementById(`opt-evhaz${isRtc ? '' : '-trauma'}`).checked,
        hazardProbability: Number(document.getElementById(`opt-hp${isRtc ? '' : '-trauma'}`).value) / 100,
        forceHazards: [...document.querySelectorAll(`.force-hazard${isRtc ? '' : '-trauma'}:checked`)].map(cb => cb.value),
        presetInjuries
      };

      const scenario = isRtc
        ? generateRtcScenario(parseInt(document.getElementById(`${prefix}-vehicles`)?.value || 1, 10), parseInt(document.getElementById(`${prefix}-patients`).value, 10), options)
        : generateTraumaScenario(parseInt(document.getElementById(`${prefix}-patients`).value, 10), options);

      scenario.scoresheets = frameworkData.scoresheets;
      renderSetupScreen(scenario);
      return;
    }

    // --- Setup Screen ---
    if (target.id === 'backBtn') showMenu();
    if (target.id === 'printBtn') window.print();
    if (target.id === 'startSimBtn') {
        const liveSimElement = renderLiveSim(state.scenario);
        target.closest('#setup-screen').append(liveSimElement);
        bindLiveSimEvents(state.scenario);
        target.style.display = 'none';
    }
    
    // --- Live Sim Screen ---
    if (target.matches('.casualty-action-btn, .scenario-action-btn, .intervention-btn')) {
        handleActionClick(target);
    }
    if (target.id === 'addLogBtn') {
        const input = document.getElementById('manualLogInput');
        if (input.value.trim()) addLog(`<strong>Instructor:</strong> ${input.value.trim()}`, 'command');
        input.value = '';
    }
     if (target.id === 'finishBtn') {
        renderDebrief(state.scenario);
    }
    
    // --- Debrief Screen ---
     if (target.id === 'newScenarioBtn') showMenu();
     if (target.id === 'exportPdfBtn') exportDebriefAsPdf();
  });
});
