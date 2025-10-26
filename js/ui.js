// js/ui.js
import { addLog, clearLog, incidentLog } from './log.js';
import { simulationTick, vitalTrendLine, applyIntervention } from './sim.js';
import { frameworkData } from './data.js';
import { drawSetupScene } from './drawing.js';

let state = {
  scenario: null, timer: null, simTicker: null,
  seconds: 0, paused: true, deteriorationPaused: false
};

// --- HTML Generation Functions ---
function injuryOptionsHTML() {
  return Object.keys(frameworkData.injuries)
    .map(k => `<option value="${k}">${k}</option>`).join('');
}

// --- Main UI Rendering Functions ---
export function showMenu() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="main-menu" class="bg-white p-6 rounded-lg shadow-lg border">
      <h2 class="text-2xl font-bold mb-4">Generate Scenario</h2>
      <div class="bg-gray-50 p-4 rounded-lg mb-4 border">
        <h3 class="text-lg font-bold mb-2">Preset Injuries (optional)</h3>
        <p class="text-sm text-gray-700 mb-2">Select injuries to apply to casualties in order. Unselected casualties will be randomised.</p>
        <select id="preset-injuries" class="bg-white border border-gray-300 rounded-lg w-full p-2" multiple size="8">
          ${injuryOptionsHTML()}
        </select>
        <p class="text-xs text-gray-500 mt-1">Tip: Hold Ctrl/Cmd to select multiple.</p>
      </div>
      <div id="controls" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg border">
          <h3 class="text-lg font-bold mb-2">RTC Scenario</h3>
          <label class="block text-sm text-gray-700 mb-1">Vehicles</label>
          <select id="rtc-vehicles" class="bg-white border border-gray-300 rounded-lg w-full p-2 mb-2"><option>1</option><option selected>2</option><option>3</option></select>
          <label class="block text-sm text-gray-700 mb-1">Patients</label>
          <select id="rtc-patients" class="bg-white border border-gray-300 rounded-lg w-full p-2 mb-2"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option></select>
          <div class="mt-3 space-y-2">
            <label class="flex items-center gap-2"><input id="opt-evhaz" type="checkbox" class="h-4 w-4"><span class="text-sm">Include EV battery hazard if EV present</span></label>
            <label class="block text-sm text-gray-700">Force hazards:</label>
            <div class="grid grid-cols-2 gap-1 text-sm">${['Fuel Spill','Fire','Battery Fire','Wall','Lamppost'].map(h => `<label class="flex items-center gap-2"><input type="checkbox" class="force-hazard" value="${h}"/><span>${h}</span></label>`).join('')}</div>
            <label class="block text-sm text-gray-700 mt-2">Hazard probability (<span id="hpLabel">55</span>%):</label>
            <input id="opt-hp" type="range" min="0" max="100" value="55" class="w-full" oninput="document.getElementById('hpLabel').textContent = this.value">
          </div>
          <button id="genRtc" class="btn btn-primary w-full mt-3">Generate RTC</button>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border">
          <h3 class="text-lg font-bold mb-2">Trauma Scenario</h3>
          <label class="block text-sm text-gray-700 mb-1">Patients</label>
          <select id="trauma-patients" class="bg-white border border-gray-300 rounded-lg w-full p-2 mb-2"><option>1</option><option selected>2</option><option>3</option><option>4</option></select>
          <div class="mt-3 space-y-2">
            <label class="flex items-center gap-2"><input id="opt-evhaz-trauma" type="checkbox" class="h-4 w-4"><span class="text-sm">Include EV battery hazard</span></label>
            <label class="block text-sm text-gray-700">Force hazards:</label>
            <div class="grid grid-cols-2 gap-1 text-sm">${['Fuel Spill','Fire','Battery Fire','Wall','Lamppost'].map(h => `<label class="flex items-center gap-2"><input type="checkbox" class="force-hazard-trauma" value="${h}"/><span>${h}</span></label>`).join('')}</div>
            <label class="block text-sm text-gray-700 mt-2">Hazard probability (<span id="hpLabelT">42</span>%):</label>
            <input id="opt-hp-trauma" type="range" min="0" max="100" value="42" class="w-full" oninput="document.getElementById('hpLabelT').textContent = this.value">
          </div>
          <button id="genTrauma" class="btn btn-secondary w-full mt-3">Generate Trauma</button>
        </div>
      </div>
    </div>
  `;
}

export function renderSetupScreen(scenario) {
    state = { ...state, scenario, timer: null, simTicker: null, seconds: 0, paused: true };
    clearLog();

    const app = document.getElementById('app');
    const cas = scenario.casualties || [];
    const veh = scenario.vehicles || [];

    const casualtiesHtml = cas.map(c => `
      <div class="bg-gray-50 p-3 rounded border">
        <div class="flex items-center justify-between flex-wrap">
          <h4 class="font-bold">Casualty ${c.id + 1} — Age ${c.age}</h4>
          <span class="font-mono text-xs bg-gray-200 px-2 py-1 rounded">GCS:${c.vitals.GCS} | HR:${c.vitals.HR} | RR:${c.vitals.RR} | SBP:${c.vitals.SBP} | SpO2:${c.vitals.SpO2}%</span>
        </div>
        <p class="text-amber-600 text-sm mt-1"><strong>Suspected:</strong> ${(c.injuries || []).map(i => i.name).join(', ')}</p>
        <p class="text-gray-600 text-sm mt-1"><strong>AMPLE:</strong> A:${c.ample.A} | M:${c.ample.M} | P:${c.ample.P} | L:${c.ample.L} | E:${c.ample.E}</p>
      </div>`).join('');

    const vehiclesHtml = veh.map((v, idx) => `
      <div class="bg-gray-50 p-3 rounded border">
        <h4 class="font-bold">Vehicle ${String.fromCharCode(65+idx)} — ${v.type}</h4>
        <p class="text-sm">Position: ${v.position.name} | Damage: ${v.damage}</p>
        <p class="text-sm">UHSS: ${v.hasUHSS ? '<span class="chip chip-uhss">UHSS</span>' : 'No'} | EV: ${v.isEV ? '<span class="chip chip-ev">EV</span>' : 'No'}</p>
      </div>`).join('');

    app.innerHTML = `
      <div id="setup-screen" class="bg-white p-6 rounded-lg shadow-lg space-y-6 border">
        <div class="flex justify-between items-center"><h2 class="text-2xl font-bold">Instructor Briefing</h2><div class="flex gap-2"><button id="backBtn" class="btn btn-secondary">Back</button><button id="printBtn" class="btn btn-tertiary">Print Briefing</button></div></div>
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div class="lg:col-span-3 bg-gray-50 p-4 rounded-lg border"><h3 class="text-xl font-bold mb-2">Top-Down View</h3><canvas id="setupCanvas" width="${scenario.canvas.width}" height="${scenario.canvas.height}" class="w-full h-auto bg-gray-200 rounded"></canvas></div>
          <div class="lg:col-span-2 bg-gray-50 p-4 rounded-lg border"><h3 class="text-xl font-bold mb-2">Incident Details</h3><div class="text-sm space-y-2"><p><strong>Location:</strong> ${scenario.location}</p><p><strong>Time Limit:</strong> <span class="font-bold text-red-600">${scenario.timeLimit} mins</span></p><p><strong>Hazards:</strong> <span class="text-yellow-600">${scenario.hazards}</span></p>${vehiclesHtml}</div></div>
        </div>
        <div><h3 class="text-xl font-bold mb-2">Casualty Briefing Sheets</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${casualtiesHtml}</div></div>
        <div class="text-center"><button id="startSimBtn" class="btn btn-primary w-full md:w-1/2 mt-2">Proceed to Live Simulation</button></div>
      </div>`;

    drawSetupScene(document.getElementById('setupCanvas'), scenario);

    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('backBtn').addEventListener('click', showMenu);
    document.getElementById('startSimBtn').addEventListener('click', () => {
        document.getElementById('startSimBtn').replaceWith(renderLiveSim(scenario));
        bindLiveSimEvents(scenario);
    });
}

function renderLiveSim(scenario) {
    const allCasualties = scenario.casualties;
    const actionButton = (label, color, type, dataAttrs = '') => `<button class="${type}-btn bg-${color}-600 hover:bg-${color}-700 text-white text-xs font-bold py-1 px-2 rounded" ${dataAttrs}>${label}</button>`;
    const actionGroup = (title, actions, color, type, casId = null) => `
        <div class="mb-1">
            <p class="text-xs text-gray-600">${title}:</p>
            <div class="flex flex-wrap gap-1 mb-1">${actions.map(act => actionButton(act, color, type, `data-action="${act}"` + (casId !== null ? ` data-casualty-id="${casId}"` : ''))).join('')}</div>
        </div>`;

    const casCards = allCasualties.map(c => {
        const interventions = (c.injuries || []).flatMap(inj => Object.values(inj.interventions || {})
            .map(iv => actionButton(iv.key, 'indigo', 'intervention', `data-casualty-id="${c.id}" data-injury-key="${inj.key}" data-intervention-key="${iv.key}"`))).join('');
        return `
      <div class="bg-gray-50 p-3 rounded border">
        <h4 class="font-bold">Casualty ${c.id + 1}</h4>
        <div id="vitals-${c.id}" class="font-mono text-center my-2 p-2 bg-gray-200 rounded">${vitalTrendLine(c)}</div>
        <div class="mb-2">
            ${actionGroup('Assessment', ['Hands on','Primary Survey','C-ABCDE','Reassess'], 'emerald', 'casualty-action', c.id)}
            ${actionGroup('Airway & Circ', ['Airway Open','O2 Given','Bleed Control','Spinal Care'], 'emerald', 'casualty-action', c.id)}
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">Interventions:</p>
          <div class="flex flex-wrap gap-2 justify-center">${interventions || '<span class="text-gray-500 text-sm">None</span>'}</div>
        </div>
      </div>`;
    }).join('');

    const liveSimContainer = document.createElement('div');
    liveSimContainer.id = 'live-sim';
    liveSimContainer.className = 'bg-white p-6 rounded-lg shadow-lg space-y-6 border mt-6';
    liveSimContainer.innerHTML = `
      <div class="flex justify-between items-center"><h2 class="text-2xl font-bold">Live Simulation</h2><div class="flex items-center gap-2"><div id="timer" class="text-2xl font-mono font-bold text-red-600 bg-gray-200 px-3 py-1 rounded-md">00:00</div><button id="timerControlBtn" class="btn btn-tertiary w-28">Start Sim</button></div></div>
      <div class="bg-gray-50 p-4 rounded-lg mb-4 border">
        <h3 class="text-lg font-bold mb-2 text-amber-600">Command & Technical Actions</h3>
        <div class="space-y-1">
            ${actionGroup('Scene', ['Size-Up','360 Survey','Hazards ID'], 'amber', 'scenario-action')}
            ${actionGroup('Plan', ['Rapid Plan','Tactical Plan','EV/UHSS OK'], 'amber', 'scenario-action')}
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${casCards}</div>
      <div><h3 class="text-xl font-bold">Incident Log</h3><div id="scenario-log" class="h-40 bg-gray-50 rounded-lg p-2 mt-2 overflow-y-auto text-sm font-mono border"></div><div class="flex gap-2 mt-2"><input type="text" id="manualLogInput" class="flex-grow bg-gray-200 border-gray-300 rounded p-2" placeholder="Log instructor observation..."><button id="addLogBtn" class="btn btn-primary">Add Log</button></div></div>
      <div class="text-center"><button id="finishBtn" class="btn btn-primary w-full md:w-1/2 mt-2">Finish & Debrief</button></div>`;
    return liveSimContainer;
}

function bindLiveSimEvents(scenario) {
    const allCasualties = scenario.casualties;
    document.getElementById('timerControlBtn').addEventListener('click', () => {
        state.paused = !state.paused;
        document.getElementById('timerControlBtn').textContent = state.paused ? 'Resume Sim' : 'Pause Sim';
        if (!state.paused && !state.timer) {
            addLog('Simulation Started.', 'command', '00:00');
            state.timer = setInterval(() => {
                if (!state.paused) {
                    state.seconds++;
                    const mins = String(Math.floor(state.seconds / 60)).padStart(2, '0');
                    const secs = String(state.seconds % 60).padStart(2, '0');
                    document.getElementById('timer').textContent = `${mins}:${secs}`;
                }
            }, 1000);
            state.simTicker = setInterval(() => {
                if (!state.paused && !state.deteriorationPaused) simulationTick(allCasualties);
                allCasualties.forEach(c => document.getElementById(`vitals-${c.id}`).innerHTML = vitalTrendLine(c));
            }, 5000);
        }
    });

    const addManual = () => {
        const input = document.getElementById('manualLogInput');
        if (input.value.trim()) addLog(`<strong>Instructor:</strong> ${input.value.trim()}`, 'command');
        input.value = '';
    };
    document.getElementById('addLogBtn').addEventListener('click', addManual);
    document.getElementById('manualLogInput').addEventListener('keypress', e => e.key === 'Enter' && addManual());

    document.querySelectorAll('.casualty-action-btn, .scenario-action-btn, .intervention-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const { casualtyId, action, injuryKey, interventionKey } = e.currentTarget.dataset;
            if (action) {
                const msg = casualtyId ? `C${parseInt(casualtyId,10)+1}: ${action}` : action;
                addLog(msg, 'command');
            }
            if (interventionKey) {
                const cas = allCasualties.find(c => c.id == casualtyId);
                applyIntervention(cas, injuryKey, interventionKey, e.currentTarget);
            }
            e.currentTarget.disabled = true;
            e.currentTarget.classList.add('opacity-50');
        });
    });

    document.getElementById('finishBtn').addEventListener('click', () => renderDebrief(scenario));
}

function renderDebrief(scenario) {
    if (state.timer) clearInterval(state.timer);
    if (state.simTicker) clearInterval(state.simTicker);

    const app = document.getElementById('app');
    const domains = scenario.type === 'RTC' ? ['command', 'technical', 'trauma'] : ['command', 'trauma'];
    const timelineHtml = incidentLog.map(e => `<p><span class="text-gray-500">[${e.time}]</span> ${e.message.replace(/<[^>]*>/g, '')}</p>`).join('');
    const vitalsSummaryHtml = scenario.casualties.map(c => `<p><strong>C${c.id+1}:</strong> GCS ${c.initialVitals.GCS}→${c.vitals.GCS}, HR ${c.initialVitals.HR}→${c.vitals.HR}, SBP ${c.initialVitals.SBP}→${c.vitals.SBP}, SpO2 ${c.initialVitals.SpO2}→${c.vitals.SpO2}</p>`).join('');

    app.innerHTML = `
      <div id="debrief-screen" class="bg-white p-6 rounded-lg shadow-lg space-y-6 border">
        <div class="flex justify-between items-center"><h2 class="text-2xl font-bold">Post-Scenario Debrief</h2><div class="flex gap-2"><button id="exportPdfBtn" class="btn btn-tertiary">Export PDF</button><button id="newScenarioBtn" class="btn btn-secondary">New Scenario</button></div></div>
        <div class="bg-gray-50 p-4 rounded-lg border"><h3 class="text-xl font-bold text-amber-600">Incident Timeline</h3><div class="mt-2 space-y-1 font-mono text-sm max-h-64 overflow-y-auto">${timelineHtml}</div></div>
        <div class="bg-gray-50 p-4 rounded-lg border"><h3 class="text-xl font-bold text-amber-600">Vital Signs Summary</h3><div class="mt-2 space-y-1 text-sm">${vitalsSummaryHtml}</div></div>
        ${domains.map(domain => `
          <div class="bg-gray-50 p-4 rounded-lg mb-4 border"><h3 class="text-xl font-bold capitalize text-amber-600">${domain}</h3><div class="mt-2 space-y-2">
            ${(frameworkData.scoresheets[domain] || []).map((item, idx) => `<div class="flex items-start"><input id="${domain}-${idx}" type="checkbox" class="h-5 w-5 rounded mt-1 bg-gray-200 border-gray-300"><label for="${domain}-${idx}" class="ml-3 text-sm flex-grow">${item}</label></div><textarea class="bg-gray-200 w-full text-sm rounded-md p-1 mt-1 border border-gray-300" rows="1" placeholder="Notes..."></textarea>`).join('')}
          </div></div>`).join('')}
      </div>`;
    document.getElementById('newScenarioBtn').addEventListener('click', showMenu);
    document.getElementById('exportPdfBtn').addEventListener('click', exportDebriefAsPdf);
}

async function exportDebriefAsPdf() {
    const el = document.getElementById('debrief-screen');
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const canvasWidth = pdfWidth - 40;
    const canvasHeight = canvasWidth / ratio;
    let position = 0;

    if (canvasHeight < pdfHeight - 40) {
        pdf.addImage(imgData, 'PNG', 20, 20, canvasWidth, canvasHeight);
    } else {
        while (position < imgHeight) {
            pdf.addImage(imgData, 'PNG', 20, 20, canvasWidth, canvasHeight, null, 'FAST', 0, position);
            position += (pdfHeight - 40) * (imgWidth / canvasWidth);
            if (position < imgHeight) pdf.addPage();
        }
    }
    pdf.save('UKRO_Debrief.pdf');
}
