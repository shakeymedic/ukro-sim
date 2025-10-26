// scenario.js
import { embedLiveSim } from './ui.js';
import { addLog } from './log.js';

// Builds casualties and scenario setup screen
export function renderSetupScreen(scenario) {
  const app = document.getElementById('app');
  if (!app) return;

  const casualtiesHtml = scenario.casualties.map(c => {
    const injuries = (c.injuries || []).map(i => i.name).join(', ');
    return `
      <div class="bg-gray-900 p-3 rounded">
        <h4 class="font-bold">Casualty ${c.id + 1}</h4>
        <p><strong>Age:</strong> ${c.age}</p>
        <p><strong>Injuries:</strong> ${injuries || 'None listed'}</p>
        <p><strong>Initial Vitals:</strong> HR ${c.vitals.HR}, RR ${c.vitals.RR}, SBP ${c.vitals.SBP}, SpO₂ ${c.vitals.SpO2}%, GCS ${c.vitals.GCS}</p>
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div id="setup-screen" class="bg-gray-800 p-6 rounded-lg shadow-2xl space-y-6">
      <h2 class="text-2xl font-bold mb-4 text-center">Scenario Setup</h2>
      <p class="text-gray-300">${scenario.description}</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">${casualtiesHtml}</div>

      <div class="text-center mt-6">
        <button id="proceedBtn" class="btn btn-primary w-full md:w-1/2">Proceed to Live Simulation</button>
      </div>
    </div>
  `;

  // New: embed live sim below setup screen on same page
  const proceedBtn = document.getElementById('proceedBtn');
  proceedBtn.addEventListener('click', e => {
    e.target.style.display = 'none'; // hide the button
    embedLiveSim(scenario); // append live sim section below setup
  });
}

// Casualty builder with extended vitals
export function makeCasualty(id, age, injuries, vitals = {}, prevVitals = {}) {
  const c = {
    id,
    age,
    injuries,
    vitals: {
      GCS: vitals.GCS ?? 15,
      HR: vitals.HR ?? 80,
      RR: vitals.RR ?? 16,
      SBP: vitals.SBP ?? 120,
      SpO2: vitals.SpO2 ?? 98,
      // Extended observations
      Glucose: vitals.Glucose ?? 5.6,       // mmol/L
      PupilL: vitals.PupilL ?? 'reactive',
      PupilR: vitals.PupilR ?? 'reactive',
      PupilLSize: vitals.PupilLSize ?? 3,   // mm
      PupilRSize: vitals.PupilRSize ?? 3,   // mm
    },
    prevVitals: {
      GCS: prevVitals.GCS ?? vitals.GCS ?? 15,
      HR: prevVitals.HR ?? vitals.HR ?? 80,
      RR: prevVitals.RR ?? vitals.RR ?? 16,
      SBP: prevVitals.SBP ?? vitals.SBP ?? 120,
      SpO2: prevVitals.SpO2 ?? vitals.SpO2 ?? 98,
      Glucose: prevVitals.Glucose ?? vitals.Glucose ?? 5.6,
      PupilL: prevVitals.PupilL ?? vitals.PupilL ?? 'reactive',
      PupilR: prevVitals.PupilR ?? vitals.PupilR ?? 'reactive',
      PupilLSize: prevVitals.PupilLSize ?? vitals.PupilLSize ?? 3,
      PupilRSize: prevVitals.PupilRSize ?? vitals.PupilRSize ?? 3,
    },
    treatedInjuries: new Set()
  };
  return c;
}

// Default scenario generator
export function generateScenario() {
  const casualties = [
    makeCasualty(0, 35, [
      { name: 'Tension Pneumothorax', key: 'tensionpneumo' }
    ], { HR: 120, RR: 36, SBP: 90, SpO2: 82, GCS: 14 }),
    makeCasualty(1, 42, [
      { name: 'Open Fracture Tib/Fib', key: 'fracture' }
    ], { HR: 105, RR: 24, SBP: 110, SpO2: 96, GCS: 15 }),
  ];

  const scenario = {
    id: 1,
    title: 'RTC – Two Casualties',
    description: 'Two patients involved in a road traffic collision. Use the live simulation below to manage both casualties dynamically.',
    hazards: 'Fuel leak, unstable vehicle',
    timeLimit: 20,
    casualties
  };

  addLog(`Scenario loaded: ${scenario.title}`, 'command');
  renderSetupScreen(scenario);
}
