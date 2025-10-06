// ui.js
import { drawSetupScene } from './drawing.js';
import { addLog, clearLog, incidentLog } from './log.js';
import { simulationTick, applyIntervention, vitalTrendLine } from './sim.js';
import { frameworkData } from './data.js';

let state = {
  scenario: null,
  timer: null,
  simTicker: null,
  seconds: 0,
  paused: true,
  options: {
    includeEVBatteryHazard: false,
    forceHazards: [],
    hazardProbability: 0.55
  }
};

export function showMenu() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="main-menu" class="bg-gray-800 p-6 rounded-lg shadow-2xl">
      <h2 class="text-2xl font-bold mb-4">Generate Scenario</h2>

      <div id="controls" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-900 p-4 rounded-lg">
          <h3 class="text-lg font-bold text-white mb-2">RTC Scenario</h3>
          <label class="block text-sm text-gray-300 mb-1">Vehicles</label>
          <select id="rtc-vehicles" class="bg-gray-700 border border-gray-600 rounded-lg w-full p-2 mb-2">
            <option>1</option><option selected>2</option><option>3</option>
          </select>
          <label class="block text-sm text-gray-300 mb-1">Patients</label>
          <select id="rtc-patients" class="bg-gray-700 border border-gray-600 rounded-lg w-full p-2 mb-2">
            <option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option>
          </select>

          <div class="mt-3 space-y-2">
            <label class="flex items-center gap-2">
              <input id="opt-evhaz" type="checkbox" class="h-4 w-4">
              <span class="text-sm">Include EV battery hazard if EV present</span>
            </label>

            <label class="block text-sm text-gray-300">Force hazards (override random):</label>
            <div class="grid grid-cols-2 gap-1 text-sm text-gray-200">
              ${['Fuel Spill','Fire','Battery Fire','Wall','Lamppost'].map(h =>
                `<label class="flex items-center gap-2"><input type="checkbox" class="force-hazard" value="${h}"/><span>${h}</span></label>`
              ).join('')}
            </div>

            <label class="block text-sm text-gray-300 mt-2">Hazard probability (<span id="hpLabel">${(state.options.hazardProbability*100)|0}</span>%):</label>
            <input id="opt-hp" type="range" min="0" max="100" value="${(state.options.hazardProbability*100)|0}" class="w-full">
          </div>

          <button id="genRtc" class="btn btn-primary w-full mt-3">Generate RTC</button>
        </div>

        <div class="bg-gray-900 p-4 rounded-lg">
          <h3 class="text-lg font-bold text-white mb-2">Trauma Scenario</h3>
          <label class="block text-sm text-gray-300 mb-1">Patients</label>
          <select id="trauma-patients" class="bg-gray-700 border border-gray-600 rounded-lg w-full p-2 mb-2">
            <option>1</option><option selected>2</option><option>3</option><option>4</option>
          </select>

          <div class="mt-3 space-y-2">
            <label class="flex items-center gap-2">
              <input id="opt-evhaz-trauma" type="checkbox" class="h-4 w-4">
              <span class="text-sm">Include EV battery hazard (if EV present in scene)</span>
            </label>

            <label class="block text-sm text-gray-300">Force hazards (override random):</label>
            <div class="grid grid-cols-2 gap-1 text-sm text-gray-200">
              ${['Fuel Spill','Fire','Battery Fire','Wall','Lamppost'].map(h =>
                `<label class="flex items-center gap-2"><input type="checkbox" class="force-hazard-trauma" value="${h}"/><span>${h}</span></label>`
              ).join('')}
            </div>

            <label class="block text-sm text-gray-300 mt-2">Hazard probability (<span id="hpLabelT">${(state.options.hazardProbability*100)|0}</span>%):</label>
            <input id="opt-hp-trauma" type="range" min="0" max="100" value="${(state.options.hazardProbability*100)|0}" class="w-full">
          </div>

          <button id="genTrauma" class="btn btn-secondary w-full mt-3">Generate Trauma</button>
        </div>
      </div>
    </div>
  `;

  const hp = document.getElementById('opt-hp');
  const hpT = document.getElementById('opt-hp-trauma');
  const hpLabel = document.getElementById('hpLabel');
  const hpLabelT = document.getElementById('hpLabelT');
  hp.addEventListener('input', e => { state.options.hazardProbability = Number(e.target.value)/100; hpLabel.textContent = e.target.value; });
  hpT.addEventListener('input', e => { state.options.hazardProbability = Number(e.target.value)/100; hpLabelT.textContent = e.target.value; });
}

export function renderSetupScreen(scenario) {
  state = { ...state, scenario, timer: null, simTicker: null, seconds: 0, paused: true };
  clearLog();

  const app = document.getElementById('app');
  const cas = scenario.casualties || [];
  const veh = scenario.vehicles || [];
  const detailsHtml = `
    <p><strong>Location:</strong> ${scenario.location}</p>
    <p><strong>Time Limit:</strong> <span class="font-bold text-red-400">${scenario.timeLimit} mins</span></p>
    <p><strong>Hazards:</strong> <span class="text-yellow-400">${scenario.hazards}</span></p>
  `;

  const casualtiesHtml = cas.map(c => {
    const injuries = (c.injuries || []).map(i => i.name).join(', ');
    return `
      <div class="bg-gray-900 p-3 rounded">
        <div class="flex items-center justify-between">
          <h4 class="font-bold">Casualty ${c.id + 1} — Age ${c.age}</h4>
          <span class="font-mono text-sm bg-black px-2 py-1 rounded">
            GCS:${c.vitals.GCS} | HR:${c.vitals.HR} | RR:${c.vitals.RR} | SBP:${c.vitals.SBP} | SpO2:${c.vitals.SpO2}%
          </span>
        </div>
        <p class="text-amber-400 text-sm mt-1"><strong>Suspected:</strong> ${injuries}</p>
        <p class="text-gray-400 text-sm mt-1"><strong>AMPLE:</strong> A:${c.ample.A} | M:${c.ample.M} | P:${c.ample.P} | L:${c.ample.L} | E:${c.ample.E}</p>
      </div>
    `;
  }).join('');

  const vehiclesHtml = veh.map((v, idx) => `
    <div class="bg-gray-900 p-3 rounded">
      <h4 class="font-bold">Vehicle ${String.fromCharCode(65+idx)} — ${v.type}</h4>
      <p class="text-sm">Position: ${v.position.name} | Damage: ${v.damage}</p>
      <p class="text-sm">UHSS: ${v.hasUHSS ? '<span class="chip chip-uhss">UHSS</span>' : 'No'} |
         EV: ${v.isEV ? '<span class="chip chip-ev">EV</span>' : 'No'}</p>
    </div>
  `).join('');

  app.innerHTML = `
    <div id="setup-screen" class="bg-gray-800 p-6 rounded-lg shadow-2xl space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Instructor Briefing</h2>
        <div class="flex gap-2">
          <button id="backBtn" class="btn btn-secondary">Back</button>
          <button id="printBtn" class="btn btn-tertiary">Print Briefing</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3 bg-gray-900 p-4 rounded-lg">
          <h3 class="text-xl font-bold mb-2">Top-Down View</h3>
          <canvas id="setupCanvas" width="${scenario.canvas.width}" height="${scenario.canvas.height}" class="w-full h-auto bg-gray-700 rounded"></canvas>
        </div>
        <div class="lg:col-span-2 bg-gray-900 p-4 rounded-lg">
          <h3 class="text-xl font-bold mb-2">Incident Details</h3>
          <div class="text-sm space-y-2">${detailsHtml}${vehiclesHtml}</div>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-bold mb-2">Casualty Briefing Sheets</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${casualtiesHtml}
        </div>
      </div>

      <div class="text-center">
        <button id="startSimBtn" class="btn btn-primary w-full md:w-1/2 mt-2">Proceed to Live Simulation</button>
      </div>
    </div>
  `;

  const canvas = document.getElementById('setupCanvas');
  drawSetupScene(canvas, scenario);

  document.getElementById('printBtn').addEventListener('click', () => window.print());
  document.getElementById('backBtn').addEventListener('click', showMenu);
  document.getElementById('startSimBtn').addEventListener('click', () => renderLiveSim(scenario));
}

function renderVitalLineWithTrends(c) {
  return vitalTrendLine(c);
}

function bindInterventions(allCasualties) {
  document.querySelectorAll('.intervention-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const { casualtyId, injuryKey, interventionKey } = e.currentTarget.dataset;
      const cas = allCasualties.find(c => c.id == casualtyId);
      applyIntervention(cas, injuryKey, interventionKey, e.currentTarget);
      const vitalsEl = document.getElementById(`vitals-${cas.id}`);
      if (vitalsEl) vitalsEl.textContent = renderVitalLineWithTrends(cas);
    });
  });
}

export function renderLiveSim(scenario) {
  
  // Ensure flashing CSS exists
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
const app = document.getElementById('app');
  const allCasualties = scenario.casualties;

  const casCards = allCasualties.map(c => {
    const ints = (c.injuries || []).flatMap(inj => {
      const ints = inj.interventions ? Object.values(inj.interventions) : [];
      return ints.map(iv => `<button class="intervention-btn bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-2 rounded"
        data-casualty-id="${c.id}" data-injury-key="${inj.key}" data-intervention-key="${iv.key}">${iv.key}</button>`);
    }).join(' ');
    return `
      <div class="bg-gray-900 p-3 rounded">
        <h4 class="font-bold">Casualty ${c.id + 1}</h4>
        <div id="vitals-${c.id}" class="obs-box font-mono text-center my-2 p-2 bg-black rounded">${renderVitalLineWithTrends(c)}</div>
<div id="ext-obs-${c.id}" class="text-xs text-gray-300 font-mono text-center">
  Glucose: ${Number(c.vitals.Glucose).toFixed(1)} mmol/L &nbsp; | &nbsp;   Pupils: L ${c.vitals.PupilL} (${c.vitals.PupilLSize}mm) / R ${c.vitals.PupilR} (${c.vitals.PupilRSize}mm)
</div>
        <div class="flex flex-wrap gap-2 justify-center">${ints || '<span class="text-gray-400 text-sm">No specific interventions</span>'}</div>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div id="live-sim" class="bg-gray-800 p-6 rounded-lg shadow-2xl space-y-6">
      <div class="flex justify-between items-center">
        <button id="backBtn" class="btn btn-secondary">Back</button>
        <div class="flex items-center gap-2">
          <div id="timer" class="text-2xl font-mono font-bold text-red-400 bg-gray-900 px-3 py-1 rounded-md">00:00</div>
          <button id="timerControlBtn" class="btn btn-tertiary w-28">Start Sim</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${casCards}</div>

      <div>
        <h3 class="text-xl font-bold">Incident Log</h3>
        <div id="scenario-log" class="h-40 bg-gray-900 rounded-lg p-2 mt-2 overflow-y-auto text-sm font-mono"></div>
        <div class="flex gap-2 mt-2">
          <input type="text" id="manualLogInput" class="flex-grow bg-gray-700 border-gray-600 rounded p-2" placeholder="Log instructor observation...">
          <button id="addLogBtn" class="btn btn-primary">Add Log</button>
        </div>
      </div>

      <div class="text-center">
        <button id="finishBtn" class="btn btn-primary w-full md:w-1/2 mt-2">Finish & Debrief</button>
      </div>
    </div>
  `;

  document.getElementById('backBtn').addEventListener('click', () => renderSetupScreen(scenario));

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
          simulationTick(allCasualties);
          allCasualties.forEach(c => {
            const el = document.getElementById(`vitals-${c.id}`);
            if (el) {
              el.textContent = renderVitalLineWithTrends(c);
              // Compute deterioration vs previous vitals
              const v = c.vitals, p = c.prevVitals || v;
              const deteriorated = (v.SpO2 < p.SpO2) || (v.SBP < p.SBP) || (v.HR > p.HR);
              if (deteriorated) {
                el.classList.add('flash-deterioration');
              } else {
                el.classList.remove('flash-deterioration');
              }
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
        }, 20000);
      }
    } else {
      addLog('Simulation Paused.', 'command');
    }
  });

  const addManual = () => {
    const input = document.getElementById('manualLogInput');
    if (input.value.trim()) {
      addLog(`<strong>Instructor Note:</strong> ${input.value.trim()}`, 'command');
      input.value = '';
    }
  };
  document.getElementById('addLogBtn').addEventListener('click', addManual);
  document.getElementById('manualLogInput').addEventListener('keypress', e => { if (e.key === 'Enter') addManual(); });

  document.getElementById('finishBtn').addEventListener('click', () => renderDebrief(scenario));

  bindInterventions(allCasualties);
}

export function renderDebrief(scenario) {
  if (state.timer) clearInterval(state.timer);
  if (state.simTicker) clearInterval(state.simTicker);
  state.timer = null; state.simTicker = null;

  const app = document.getElementById('app');
  const domains = scenario.type === 'RTC' ? ['command', 'technical', 'trauma'] : ['command', 'trauma'];

  const timelineHtml = incidentLog.map(e =>
    `<p><span class="text-gray-500">[${e.time}]</span> ${e.message.replace(/<[^>]*>/g, '')}</p>`
  ).join('');

  const checklists = domains.map(domain => `
    <div class="bg-gray-900 p-4 rounded-lg mb-4">
      <h3 class="text-xl font-bold capitalize text-amber-500">${domain}</h3>
      <div class="mt-2 space-y-2">
        ${(frameworkData.scoresheets[domain] || []).map((item, idx) => `
          <div class="flex items-start">
            <input id="${domain}-${idx}" type="checkbox" class="h-5 w-5 rounded mt-1 bg-gray-700 border-gray-600">
            <label for="${domain}-${idx}" class="ml-3 text-sm flex-grow">${item}</label>
          </div>
          <textarea class="bg-gray-700 w-full text-sm rounded-md p-1 mt-1 border border-gray-600" rows="1" placeholder="Notes..."></textarea>
        `).join('')}
      </div>
    </div>
  `).join('');

  app.innerHTML = `
    <div id="debrief-screen" class="bg-gray-800 p-6 rounded-lg shadow-2xl space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Post-Scenario Debrief</h2>
        <div class="flex gap-2">
          <button id="exportPdfBtn" class="btn btn-tertiary">Export PDF</button>
          <button id="backBtn" class="btn btn-secondary">Back to Menu</button>
        </div>
      </div>

      <div class="bg-gray-900 p-4 rounded-lg">
        <h3 class="text-xl font-bold text-amber-500">Incident Timeline</h3>
        <div id="debrief-timeline" class="mt-2 space-y-1 font-mono text-sm max-h-64 overflow-y-auto">${timelineHtml}</div>
      </div>

      ${checklists}

      <div class="text-center">
        <button id="newScenarioBtn" class="btn btn-primary w-full md:w-1/2 mt-2">Start New Scenario</button>
      </div>
    </div>
  `;

  document.getElementById('backBtn').addEventListener('click', () => showMenu());
  document.getElementById('newScenarioBtn').addEventListener('click', () => location.reload());
  document.getElementById('exportPdfBtn').addEventListener('click', exportDebriefAsPdf);
}

/** Export the whole debrief panel to PDF using html2canvas + jsPDF */
async function exportDebriefAsPdf() {
  const el = document.getElementById('debrief-screen');
  const { jsPDF } = window.jspdf;
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'pt', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 40;
  const ratio = canvas.height / canvas.width;
  const imgHeight = imgWidth * ratio;

  let y = 20;
  let x = 20;

  if (imgHeight < pageHeight - 40) {
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  } else {
    let remaining = imgHeight;
    let position = 0;
    const pageCanvas = document.createElement('canvas');
    const pageCtx = pageCanvas.getContext('2d');
    pageCanvas.width = canvas.width;
    const pagePixels = Math.floor((pageHeight - 40) * (canvas.width / imgWidth));
    while (remaining > 0) {
      const sliceHeight = Math.min(pagePixels, remaining);
      pageCanvas.height = sliceHeight;
      pageCtx.drawImage(canvas, 0, position, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
      const sliceData = pageCanvas.toDataURL('image/png');
      const sliceHeightPt = (sliceHeight / canvas.width) * imgWidth;
      pdf.addImage(sliceData, 'PNG', x, y, imgWidth, sliceHeightPt);
      remaining -= sliceHeight;
      position += sliceHeight;
      if (remaining > 0) pdf.addPage();
    }
  }
  pdf.save('UKRO_Debrief.pdf');
}
