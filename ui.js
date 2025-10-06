// ui.js
// Handles rendering and UI updates for setup and live simulation
import { addLog } from './log.js';
import { simulationTick, vitalTrendLine, applyIntervention } from './sim.js';
import { renderSetupScreen } from './scenario.js';

// ensure flashing CSS exists
if (!document.getElementById('flash-css')) {
  const style = document.createElement('style');
  style.id = 'flash-css';
  style.textContent = `
    .flash-deterioration {
      outline: 3px solid red;
      animation: flash-border 1s infinite alternate;
      box-shadow: 0 0 10px rgba(255,0,0,0.6);
    }
    @keyframes flash-border {
      from { outline-color: transparent; box-shadow: none; }
      to   { outline-color: red; box-shadow: 0 0 10px rgba(255,0,0,0.8); }
    }
  `;
  document.head.appendChild(style);
}

// Render live sim as a standalone page (legacy mode)
export function renderLiveSim(scenario) {
  // Kept for compatibility but no longer used
  console.warn('renderLiveSim() is deprecated. Use embedLiveSim() instead.');
  embedLiveSim(scenario);
}

// New: Embed live simulation below the setup screen
export function embedLiveSim(scenario) {
  const setup = document.getElementById('setup-screen');
  if (!setup) return;

  // remove existing live sim if present
  const existing = document.getElementById('live-sim');
  if (existing) existing.remove();

  // create live simulation container
  const liveDiv = document.createElement('div');
  liveDiv.id = 'live-sim';
  liveDiv.className = 'bg-gray-800 p-6 rounded-lg shadow-2xl space-y-6 mt-8';

  const cas = scenario.casualties;

  const casCards = cas.map(c => {
    const injuries = (c.injuries || []).map(i => i.name).join(', ');
    return `
      <div class="bg-gray-900 p-3 rounded">
        <div class="flex items-center justify-between">
          <h4 class="font-bold">Casualty ${c.id + 1} — Age ${c.age}</h4>
          <span class="text-xs text-gray-400">${injuries || 'No listed injuries'}</span>
        </div>
        <div id="vitals-${c.id}" class="obs-box font-mono text-center my-2 p-2 bg-black rounded">
          ${vitalTrendLine(c)}
        </div>
        <div id="ext-obs-${c.id}" class="text-xs text-gray-300 font-mono text-center">
          Glucose: ${Number(c.vitals.Glucose).toFixed(1)} mmol/L |
          Pupils: L ${c.vitals.PupilL} (${c.vitals.PupilLSize}mm) /
          R ${c.vitals.PupilR} (${c.vitals.PupilRSize}mm)
        </div>
        <div class="flex flex-wrap gap-2 justify-center">
          ${(c.injuries || []).flatMap(inj => {
            const ints = inj.interventions ? Object.values(inj.interventions) : [];
            return ints.map(iv => `
              <button class="intervention-btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded"
                      data-casualty-id="${c.id}" data-injury-key="${inj.key}" data-intervention-key="${iv.key}">
                ${iv.label}
              </button>
            `);
          }).join('') || '<span class="text-gray-400 text-sm">No specific interventions</span>'}
        </div>
      </div>
    `;
  }).join('');

  liveDiv.innerHTML = `
    <h2 class="text-2xl font-bold text-center mb-4 border-b border-gray-700 pb-2">Live Simulation</h2>
    <div class="flex justify-between items-center">
      <div id="timer" class="text-2xl font-mono font-bold text-red-400 bg-gray-900 px-3 py-1 rounded-md">00:00</div>
      <button id="timerControlBtn" class="btn btn-tertiary w-28">Start Sim</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${casCards}</div>
    <div>
      <h3 class="text-xl font-bold">Incident Log</h3>
      <div id="scenario-log" class="h-40 bg-gray-900 rounded-lg p-2 mt-2 overflow-y-auto text-sm font-mono"></div>
      <div class="flex gap-2 mt-2">
        <input type="text" id="manualLogInput" class="flex-grow bg-gray-700 border-gray-600 rounded p-2"
               placeholder="Log instructor observation...">
        <button id="addLogBtn" class="btn btn-primary">Add Log</button>
      </div>
    </div>
    <div class="text-center">
      <button id="finishBtn" class="btn btn-primary w-full md:w-1/2 mt-2">Finish & Debrief</button>
    </div>
  `;

  setup.appendChild(liveDiv);

  // --- simulation state ---
  const state = { paused: true, seconds: 0, timer: null, simTicker: null };

  // timer control
  document.getElementById('timerControlBtn').addEventListener('click', () => {
    state.paused = !state.paused;
    const btn = document.getElementById('timerControlBtn');
    btn.textContent = state.paused ? 'Resume Sim' : 'Pause Sim';

    if (!state.paused) {
      if (!state.timer) {
        addLog('Simulation Started.', 'command', '00:00');
        state.timer = setInterval(() => {
          state.seconds++;
          const mins = String(Math.floor(state.seconds / 60)).padStart(2, '0');
          const secs = String(state.seconds % 60).padStart(2, '0');
          document.getElementById('timer').textContent = `${mins}:${secs}`;
        }, 1000);
      }
      if (!state.simTicker) {
        state.simTicker = setInterval(() => {
          simulationTick(cas);
          cas.forEach(c => {
            const el = document.getElementById(`vitals-${c.id}`);
            if (el) {
              el.textContent = vitalTrendLine(c);
              // check deterioration
              const v = c.vitals, p = c.prevVitals || v;
              const deteriorated = (v.SpO2 < p.SpO2) || (v.SBP < p.SBP) || (v.HR > p.HR);
              if (deteriorated) el.classList.add('flash-deterioration');
              else el.classList.remove('flash-deterioration');
            }
            const ext = document.getElementById(`ext-obs-${c.id}`);
            if (ext) {
              const glu = (typeof c.vitals.Glucose === 'number') ? c.vitals.Glucose.toFixed(1) : '—';
              const pl = c.vitals.PupilL ?? '—';
              const pr = c.vitals.PupilR ?? '—';
              const pls = (typeof c.vitals.PupilLSize === 'number') ? c.vitals.PupilLSize : '—';
              const prs = (typeof c.vitals.PupilRSize === 'number') ? c.vitals.PupilRSize : '—';
              ext.textContent = `Glucose: ${glu} mmol/L | Pupils: L ${pl} (${pls}mm) / R ${pr} (${prs}mm)`;
            }
          });
        }, 20000); // slower tick rate
      }
    } else {
      addLog('Simulation Paused.', 'command');
    }
  });

  // manual logging
  const addManual = () => {
    const input = document.getElementById('manualLogInput');
    if (input.value.trim()) {
      addLog(`<strong>Instructor Note:</strong> ${input.value.trim()}`, 'command');
      input.value = '';
    }
  };
  document.getElementById('addLogBtn').addEventListener('click', addManual);
  document.getElementById('manualLogInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') addManual();
  });

  // finish button
  document.getElementById('finishBtn').addEventListener('click', () => {
    clearInterval(state.timer);
    clearInterval(state.simTicker);
    addLog('Simulation Ended.', 'command');
    alert('Simulation Ended. Proceed to debrief.');
  });
}
