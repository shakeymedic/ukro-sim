const FrameworkData = {
    scoresheets: {
        command: ['Scene assessment', 'Tactical Plan', 'Communication', 'Risk Assessment', 'Inner/Outer Cordons', 'Team Briefing'],
        technical: ['Stabilisation (Pri)', 'Glass Management', 'Tool Staging', 'Space Creation', 'Extrication Path', 'Sharps Protection'],
        trauma: ['Scene Safety', 'C-Spine Control', '<C>ABCDE Survey', 'Oxygen Therapy', 'Haemorrhage Control', 'Splintage', 'ATMIST Handover']
    },
    markingCriteria: [
        { id: 'm1', cat: 'Command', text: '360 Survey completed immediately', points: 5 },
        { id: 'm2', cat: 'Technical', text: 'Vehicle stabilised prior to entry', points: 10 },
        { id: 'm3', cat: 'Technical', text: 'Battery / High Voltage isolated', points: 5 },
        { id: 'm4', cat: 'Medical', text: 'Catastrophic haemorrhage managed', points: 10 },
        { id: 'm5', cat: 'Medical', text: 'Oxygen applied appropriately', points: 5 },
        { id: 'm6', cat: 'Extrication', text: 'Safe space creation achieved', points: 10 }
    ],
    actions: {
        Assessment: {
            Airway: ['Intra-oral Check', 'External Airway Check'],
            Breathing: ['Look, Listen, Feel', 'Reassess RR', 'SpO2 Check'],
            Circulation: ['Check Pulse', 'Cap Refill', 'Check Bleeding'],
            Disability: ['Check ACVPU', 'Pupils', 'Blood Glucose', 'Temp'],
            Exposure: ['Check Back', 'Expose Injury Site']
        },
        Interventions: {
            Airway: ['Open Airway', 'Suction', 'OPA', 'NPA', 'i-gel'],
            Breathing: ['15L O2', 'Titrated O2', 'BVM', 'Chest Seal'],
            Circulation: ['Direct Pressure', 'Tourniquet', 'Wound Packing', 'Pelvic Binder', 'IV Access'],
            Disability: ['C-Collar', 'Head Blocks', 'Manual Inline Stab'],
            Exposure: ['Blanket', 'Active Warming', 'Cut Clothing']
        }
    },
    injuries: {
        'Uninjured': { name: 'Uninjured', type: 'minor', context:['rtc', 'trauma'], visual: 'Alert. No visible injuries.', vitals: { ACVPU: 'A', HR: 80, RR: 16, SBP: 120, SpO2: 99, CRT: 2 }, deterioration: {}, interventions: {} },
        'Minor Head Injury': { name: 'Minor Head Injury', type: 'minor', context:['rtc', 'trauma'], visual: 'Cut to forehead. Dazed.', vitals: { ACVPU: 'C', HR: 95, RR: 18, SBP: 130, SpO2: 98, CRT: 2 }, deterioration: { ACVPU: -0.2 }, interventions: { 'Manual Inline Stab': { key: 'Manual Inline Stab', effect: {}, stopsDeterioration: true, feedback: 'C-Spine manual stabilisation.' } } },
        'Severe Head Injury': { name: 'Severe Head Injury', type: 'major', context:['rtc', 'trauma'], visual: 'Deep scalp lac. Incoherent.', vitals: { ACVPU: 'P', HR: 55, RR: 10, SBP: 180, SpO2: 92, CRT: 2 }, deterioration: { ACVPU: -0.5, RR: -0.5, SpO2: -1 }, interventions: { 'OPA': { key: 'OPA', effect: { RR: 4, SpO2: 4 }, stopsDeterioration: true, feedback: 'Airway secured with OPA.' } } },
        'Tension Pneumothorax': { name: 'Tension Pneumothorax', type: 'critical', context:['rtc', 'trauma'], visual: 'Cyanosed. Veins distended. Struggling.', vitals: { ACVPU: 'C', HR: 140, RR: 35, SBP: 80, SpO2: 85, CRT: 4 }, deterioration: { SpO2: -2, SBP: -3, HR: 3, CRT: 0.5 }, interventions: { 'Chest Decompression': { key: 'Chest Decompression', effect: { SpO2: 12, SBP: 15, RR: -10 }, stopsDeterioration: true, feedback: 'Hiss heard. Stats improving.' } } },
        'Simple Pneumothorax': { name: 'Simple Pneumothorax', type: 'major', context:['rtc', 'trauma'], visual: 'Short of breath. Pain on inspiration.', vitals: { ACVPU: 'A', HR: 110, RR: 28, SBP: 115, SpO2: 93, CRT: 2 }, deterioration: { SpO2: -1, RR: 1 }, interventions: {} },
        'Catastrophic Haemorrhage': { name: 'Catastrophic Haemorrhage', type: 'critical', context:['rtc', 'trauma'], visual: 'Arterial bleed. Pool of blood.', vitals: { ACVPU: 'V', HR: 150, RR: 30, SBP: 75, SpO2: 90, CRT: 5 }, deterioration: { SBP: -4, HR: 3, ACVPU: -0.5 }, interventions: { 'Tourniquet': { key: 'Tourniquet', effect: { SBP: 20, HR: -20 }, stopsDeterioration: true, feedback: 'Bleeding controlled.' } } },
        'Femur Fracture': { name: 'Femur Fracture', type: 'major', context:['rtc', 'trauma'], visual: 'Thigh deformed. Screaming.', vitals: { ACVPU: 'A', HR: 120, RR: 24, SBP: 100, SpO2: 97, CRT: 3 }, deterioration: { SBP: -2, HR: 2 }, interventions: { 'Traction Splint': { key: 'Traction Splint', effect: { HR: -10, SBP: 5 }, stopsDeterioration: true, feedback: 'Traction applied.' } } },
        'Flail Chest': { name: 'Flail Chest', type: 'major', context:['rtc', 'trauma'], visual: 'Paradoxical chest movement.', vitals: { ACVPU: 'A', HR: 125, RR: 30, SBP: 110, SpO2: 88, CRT: 2 }, deterioration: { SpO2: -2, RR: 0.5 }, interventions: { 'BVM': { key: 'BVM', effect: { SpO2: 8, RR: -5 }, stopsDeterioration: true, feedback: 'BVM initiated.' } } },
        'Cardiac Arrest': { name: 'Cardiac Arrest', type: 'critical', context:['trauma'], visual: 'Unresponsive. Not breathing.', vitals: { ACVPU: 'U', HR: 0, RR: 0, SBP: 0, SpO2: 0, CRT: 0 }, deterioration: {}, interventions: { 'CPR & Defib': { key: 'CPR & Defib', effect: { HR: 80, SBP: 100, SpO2: 90, ACVPU: 'U' }, stopsDeterioration: true, feedback: 'ROSC Achieved.' } } },
        'Spinal Injury (Thoracic)': { name: 'Spinal Injury (Thoracic)', type: 'major', context:['rtc'], visual: 'No movement in legs. Back pain.', vitals: { ACVPU: 'A', HR: 60, RR: 16, SBP: 85, SpO2: 98, CRT: 3 }, deterioration: { SBP: -1 }, interventions: { 'Head Blocks': { key: 'Head Blocks', effect: {}, stopsDeterioration: true, feedback: 'Blocks applied.' } } },
        'Open Tib/Fib Fracture': { name: 'Open Tib/Fib Fracture', type: 'major', context:['rtc', 'trauma'], visual: 'Bone protruding from lower leg.', vitals: { ACVPU: 'A', HR: 110, RR: 20, SBP: 110, SpO2: 98, CRT: 2 }, deterioration: { HR: 2, SBP: -1 }, interventions: { 'Splinting': { key: 'Splinting', effect: { HR: -5 }, stopsDeterioration: true, feedback: 'Leg splinted.' } } },
        'Pelvic Fracture': { name: 'Pelvic Fracture', type: 'major', context:['rtc', 'trauma'], visual: 'Pelvic instability. Pain.', vitals: { ACVPU: 'A', HR: 130, RR: 26, SBP: 90, SpO2: 95, CRT: 3 }, deterioration: { SBP: -3, HR: 3 }, interventions: { 'Pelvic Binder': { key: 'Pelvic Binder', effect: { SBP: 10, HR: -10 }, stopsDeterioration: true, feedback: 'Binder applied.' } } }
    },
    ample: {
        allergies: ['NKDA', 'Penicillin', 'Latex', 'Nuts', 'Morphine', 'Codeine'],
        medications: ['None', 'Warfarin', 'Apixaban', 'Insulin', 'Salbutamol', 'Bisoprolol', 'Ramipril', 'Metformin'],
        pastHistory: ['Asthma', 'T2 Diabetes', 'Hypertension', 'Ischemic Heart Disease', 'Epilepsy', 'None', 'COPD', 'Previous MI'],
        lastMeal: ['Breakfast 2hrs ago', 'Sandwich at lunch', 'Tea', 'Fasted', 'Snack 1hr ago'],
        events: ['Driving home from work', 'Passenger in vehicle', 'Cyclist struck by car', 'Working at height', 'Industrial machinery accident', 'Fell down stairs']
    },
    svgAssets: {
        'Saloon Car (Intact)': '<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="30" width="10" height="30" rx="3" fill="#1f2937"/><rect x="85" y="30" width="10" height="30" rx="3" fill="#1f2937"/><rect x="5" y="140" width="10" height="30" rx="3" fill="#1f2937"/><rect x="85" y="140" width="10" height="30" rx="3" fill="#1f2937"/><rect x="15" y="10" width="70" height="180" rx="15" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2"/><polygon points="20,70 80,70 75,95 25,95" fill="#0f172a"/><polygon points="25,160 75,160 70,145 30,145" fill="#0f172a"/><rect x="25" y="95" width="50" height="50" fill="#2563eb"/><rect x="30" y="105" width="15" height="20" rx="3" fill="#334155"/><rect x="55" y="105" width="15" height="20" rx="3" fill="#334155"/><circle cx="62" cy="100" r="5" fill="#111827"/></svg>',
        'Saloon Car (Frontal Crush)': '<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="30" width="10" height="30" rx="3" fill="#1f2937"/><rect x="85" y="30" width="10" height="30" rx="3" fill="#1f2937"/><rect x="5" y="140" width="10" height="30" rx="3" fill="#1f2937"/><rect x="85" y="140" width="10" height="30" rx="3" fill="#1f2937"/><path d="M 15 50 L 30 20 L 50 40 L 70 20 L 85 50 L 85 180 Q 85 195 70 195 L 30 195 Q 15 195 15 180 Z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2"/><polygon points="20,70 80,70 75,95 25,95" fill="#0f172a"/><path d="M 30 95 L 50 75 L 60 85" stroke="#ffffff" stroke-width="1.5" fill="none"/><polygon points="25,160 75,160 70,145 30,145" fill="#0f172a"/><rect x="25" y="95" width="50" height="50" fill="#2563eb"/><rect x="30" y="105" width="15" height="20" rx="3" fill="#334155"/><rect x="55" y="105" width="15" height="20" rx="3" fill="#334155"/><circle cx="62" cy="100" r="5" fill="#111827"/></svg>',
        'Saloon Car (Side Crush)': '<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="30" width="10" height="30" rx="3" fill="#1f2937"/><rect x="85" y="30" width="10" height="30" rx="3" fill="#1f2937"/><rect x="5" y="140" width="10" height="30" rx="3" fill="#1f2937"/><rect x="85" y="140" width="10" height="30" rx="3" fill="#1f2937"/><path d="M 15 25 Q 50 10 85 25 L 85 180 Q 50 195 15 180 L 15 140 L 35 110 L 15 80 Z" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2"/><polygon points="20,70 80,70 75,95 45,95" fill="#0f172a"/><polygon points="35,160 75,160 70,145 45,145" fill="#0f172a"/><path d="M 45 95 L 75 95 L 75 145 L 45 145 Z" fill="#2563eb"/><rect x="55" y="105" width="15" height="20" rx="3" fill="#334155"/><circle cx="62" cy="100" r="5" fill="#111827"/></svg>',
        'SUV (Frontal Crush)': '<svg viewBox="0 0 110 220" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="30" width="15" height="35" rx="4" fill="#111827"/><rect x="90" y="30" width="15" height="35" rx="4" fill="#111827"/><rect x="5" y="150" width="15" height="35" rx="4" fill="#111827"/><rect x="90" y="150" width="15" height="35" rx="4" fill="#111827"/><path d="M 15 50 L 35 25 L 55 45 L 75 25 L 95 50 L 95 200 Q 95 215 75 215 L 35 215 Q 15 215 15 200 Z" fill="#475569" stroke="#334155" stroke-width="2"/><polygon points="20,80 90,80 85,105 25,105" fill="#0f172a"/><path d="M 35 105 L 55 85 L 65 95" stroke="#ffffff" stroke-width="1.5" fill="none"/><polygon points="25,180 85,180 80,165 30,165" fill="#0f172a"/><rect x="25" y="105" width="60" height="60" fill="#64748b"/><rect x="30" y="115" width="20" height="25" rx="3" fill="#1e293b"/><rect x="60" y="115" width="20" height="25" rx="3" fill="#1e293b"/><circle cx="70" cy="110" r="6" fill="#000000"/></svg>',
        'Van (Frontal Crush)': '<svg viewBox="0 0 110 240" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="30" width="15" height="35" rx="4" fill="#111827"/><rect x="90" y="30" width="15" height="35" rx="4" fill="#111827"/><rect x="5" y="170" width="15" height="35" rx="4" fill="#111827"/><rect x="90" y="170" width="15" height="35" rx="4" fill="#111827"/><path d="M 10 40 L 30 15 L 55 35 L 80 15 L 100 40 L 100 230 L 10 230 Z" fill="#d1d5db" stroke="#9ca3af" stroke-width="2"/><polygon points="15,60 95,60 90,85 20,85" fill="#0f172a"/><path d="M 30 85 L 55 65 L 75 75" stroke="#ffffff" stroke-width="1.5" fill="none"/><rect x="20" y="85" width="70" height="135" fill="#f3f4f6"/><rect x="25" y="95" width="25" height="25" rx="3" fill="#4b5563"/><rect x="60" y="95" width="25" height="25" rx="3" fill="#4b5563"/><circle cx="72" cy="90" r="7" fill="#000000"/></svg>',
        'EV Hatchback': '<svg viewBox="0 0 90 180" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="30" width="10" height="25" rx="3" fill="#1f2937"/><rect x="75" y="30" width="10" height="25" rx="3" fill="#1f2937"/><rect x="5" y="130" width="10" height="25" rx="3" fill="#1f2937"/><rect x="75" y="130" width="10" height="25" rx="3" fill="#1f2937"/><rect x="15" y="10" width="60" height="160" rx="20" fill="#10b981" stroke="#047857" stroke-width="2"/><polygon points="20,60 70,60 65,85 25,85" fill="#0f172a"/><polygon points="25,140 65,140 60,125 30,125" fill="#0f172a"/><rect x="25" y="85" width="40" height="40" fill="#34d399"/><rect x="30" y="95" width="12" height="18" rx="2" fill="#064e3b"/><rect x="48" y="95" width="12" height="18" rx="2" fill="#064e3b"/><circle cx="54" cy="90" r="4" fill="#000000"/><path d="M 45 40 L 40 50 L 50 50 L 45 60" stroke="#fef08a" stroke-width="3" fill="none"/></svg>',
        'Motorbike': '<svg viewBox="0 0 40 100" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="10" width="16" height="25" rx="4" fill="#111827"/><rect x="12" y="65" width="16" height="25" rx="4" fill="#111827"/><path d="M 15 30 L 25 30 L 28 65 L 12 65 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/><rect x="10" y="40" width="20" height="5" fill="#475569"/></svg>',
        'HGV Cab': '<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="20" width="120" height="110" rx="5" fill="#ef4444" stroke="#b91c1c" stroke-width="3"/><rect x="15" y="25" width="110" height="35" rx="2" fill="#0f172a"/><rect x="30" y="70" width="30" height="35" rx="4" fill="#334155"/><rect x="80" y="70" width="30" height="35" rx="4" fill="#334155"/><circle cx="95" cy="65" r="10" fill="#000000"/></svg>'
    },
    vehicles: {
        'Saloon Car': { type: 'Saloon Car', capacity: 4, isEV: false, hasUHSS: false, width: 80, height: 160 },
        'SUV': { type: 'SUV', capacity: 5, isEV: false, hasUHSS: true, width: 90, height: 180 },
        'Tesla Model 3': { type: 'Tesla Model 3', capacity: 4, isEV: true, hasUHSS: true, width: 80, height: 160 },
        'Van': { type: 'Commercial Van', capacity: 3, isEV: false, hasUHSS: false, width: 90, height: 200 },
        'Hatchback': { type: 'Hatchback', capacity: 4, isEV: false, hasUHSS: false, width: 75, height: 140 },
        'Motorbike': { type: 'Motorbike', capacity: 2, isEV: false, hasUHSS: false, width: 40, height: 100 },
        'HGV Cab': { type: 'HGV Cab', capacity: 2, isEV: false, hasUHSS: true, width: 120, height: 120 }
    },
    hazards: [
        { type: 'Fuel Spill', width: 100, height: 100 },
        { type: 'Fire', width: 50, height: 50 },
        { type: 'Wall', width: 150, height: 20 },
        { type: 'Battery Fire', width: 50, height: 50 },
        { type: 'Chemical Drum', width: 30, height: 30 }
    ],
    baseMedicalEvents: [
        { id: 'M01', title: 'Single Vehicle into Tree', category: 'High Energy Trauma', entrapment: 'Severe dashboard intrusion. Relocation required.', actorBrief: 'Act highly distressed. Complain of crushing chest pain and numb legs.', vehicles: [{ type: 'Saloon Car', svg: 'Saloon Car (Frontal Crush)' }] },
        { id: 'M02', title: 'Motorbike vs Van', category: 'Ejection Trauma', entrapment: 'Rider trapped under van axle. Lifting equipment required.', actorBrief: 'Rider screams constantly about leg pain. Van driver is in shock and confused.', vehicles: [{ type: 'Motorbike', svg: 'Motorbike' }, { type: 'Van', svg: 'Van (Frontal Crush)' }] },
        { id: 'M03', title: 'High Speed Side Impact', category: 'Lateral Crush', entrapment: 'Massive B-Pillar intrusion. Rip or removal required.', actorBrief: 'Hold your pelvis. Refuse to let anyone touch your hips or legs. Shallow breathing.', vehicles: [{ type: 'Saloon Car', svg: 'Saloon Car (Side Crush)' }, { type: 'Saloon Car', svg: 'Saloon Car (Frontal Crush)' }] },
        { id: 'M04', title: 'HGV Jackknife', category: 'Heavy Goods Collision', entrapment: 'Cab crushed against trailer. Platform working required.', actorBrief: 'Driver is trapped by the steering column. Severe bleeding from arms.', vehicles: [{ type: 'HGV Cab', svg: 'HGV Cab' }, { type: 'Saloon Car', svg: 'Saloon Car (Side Crush)' }] },
        { id: 'M05', title: 'Vehicle Rollover into Ditch', category: 'Complex Terrain', entrapment: 'Vehicle on its roof. Total roof removal and trench rescue required.', actorBrief: 'Hang upside down if possible. Complain of severe neck pain. Spit blood.', vehicles: [{ type: 'SUV', svg: 'SUV (Frontal Crush)' }] },
        { id: 'M06', title: 'Van Head-On Collision', category: 'Frontal Impact', entrapment: 'Footwell collapse. Pedal cuts and steering wheel lift required.', actorBrief: 'Driver has an open leg fracture. Scream whenever the vehicle shakes.', vehicles: [{ type: 'Van', svg: 'Van (Frontal Crush)' }, { type: 'Saloon Car', svg: 'Saloon Car (Frontal Crush)' }] },
        { id: 'M07', title: 'EV Thermal Runaway', category: 'Hazmat and Trauma', entrapment: 'Rapid snatch rescue required due to battery fire.', actorBrief: 'Cough violently. Complain of airway burns and heat exposure.', vehicles: [{ type: 'Tesla Model 3', svg: 'EV Hatchback' }] },
        { id: 'M08', title: 'Agricultural Impalement', category: 'Impalement', entrapment: 'Fence post through windscreen. Angle grinder needed near casualty.', actorBrief: 'Do not move your torso. Take rapid short breaths. Panic if rescuers touch the post.', vehicles: [{ type: 'Van', svg: 'Van (Frontal Crush)' }] },
        { id: 'M09', title: 'EV vs Pedestrian', category: 'Silent Collision', entrapment: 'Pedestrian trapped under EV floorpan. Isolation plug must be pulled before lifting.', actorBrief: 'Groan in severe pain. You are trapped flat on your back.', vehicles: [{ type: 'Hatchback', svg: 'EV Hatchback' }] },
        { id: 'M10', title: 'Multi-Vehicle Pile-up', category: 'Complex Trauma', entrapment: 'Vehicles stacked. Extensive stabilisation and simultaneous extrications required.', actorBrief: 'Act highly confused. Ask repeatedly what happened to your car.', vehicles: [{ type: 'Saloon Car', svg: 'Saloon Car (Frontal Crush)' }, { type: 'Hatchback', svg: 'Saloon Car (Side Crush)' }] }
    ],
    environments: [
        { weather: 'Clear', timeOfDay: 'Day', modifier: 'Standard' },
        { weather: 'Heavy Rain', timeOfDay: 'Night', modifier: 'Slippery' },
        { weather: 'Freezing', timeOfDay: 'Night', modifier: 'Hypothermia Risk' },
        { weather: 'Fog', timeOfDay: 'Day', modifier: 'Low Visibility' }
    ],

    generatePremadeScenarios: function() {
        let generated = [];
        let counter = 1;

        this.baseMedicalEvents.forEach(medical => {
            this.environments.forEach(env => {
                [1, 2].forEach(cCount => {
                    let requiredSeverities = cCount === 1 ? ['major'] : ['critical', 'minor'];
                    generated.push({
                        id: `PRE-${counter.toString().padStart(3, '0')}`,
                        title: `${medical.title} (${cCount} Cas, ${env.modifier})`,
                        category: medical.category,
                        config: {
                            vehiclesConfig: medical.vehicles,
                            cCount: cCount,
                            weather: env.weather,
                            timeOfDay: env.timeOfDay,
                            requiredSeverities: requiredSeverities,
                            entrapment: medical.entrapment,
                            actorBrief: medical.actorBrief
                        }
                    });
                    counter++;
                });
            });
        });
        return generated;
    }
};

class ScenarioGenerator {
    static createCasualty(id, context, forcedInjuries = [], customVitals = null, targetSeverities = null) {
        const ACVPU_SCALE = ['U', 'P', 'V', 'C', 'A'];
        const Utils = {
            randInt: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
            choice: (arr) => arr[Math.floor(Math.random() * arr.length)]
        };

        let injuryKeys = [];
        if (targetSeverities && targetSeverities.length > 0) {
            const targetLevel = targetSeverities[id];
            const possible = Object.keys(FrameworkData.injuries).filter(k => FrameworkData.injuries[k].type === targetLevel);
            injuryKeys.push(possible.length > 0 ? Utils.choice(possible) : 'Uninjured');
        } else if (!forcedInjuries || forcedInjuries.length === 0) {
            const possible = Object.keys(FrameworkData.injuries).filter(k => FrameworkData.injuries[k].context.includes(context));
            injuryKeys.push(Math.random() > 0.3 ? Utils.choice(possible) : 'Uninjured');
        } else {
            forcedInjuries.forEach(val => {
                if (val === 'Random') {
                    const possible = Object.keys(FrameworkData.injuries).filter(k => k !== 'Uninjured');
                    injuryKeys.push(Utils.choice(possible));
                } else if (val && val !== 'None') {
                    injuryKeys.push(val);
                }
            });
        }
        
        injuryKeys = [...new Set(injuryKeys)];
        if (injuryKeys.length === 0) injuryKeys.push('Uninjured');

        const injuriesData = injuryKeys.map(k => ({...FrameworkData.injuries[k], key: k}));
        
        let combinedVitals = customVitals ? { ...customVitals } : { ACVPU: 'A', HR: 80, RR: 16, SBP: 120, SpO2: 99, CRT: 2 };
        let combinedDeterioration = {};
        let interventions = {};
        let visualDescriptions = [];
        let entrapmentStatus = 'None';
        let severity = 'minor';

        if (!customVitals) {
            injuriesData.forEach(inj => {
                if(inj.visual) visualDescriptions.push(inj.visual);
                if (ACVPU_SCALE.indexOf(inj.vitals.ACVPU) < ACVPU_SCALE.indexOf(combinedVitals.ACVPU)) combinedVitals.ACVPU = inj.vitals.ACVPU;
                if (inj.vitals.SBP < combinedVitals.SBP) combinedVitals.SBP = inj.vitals.SBP;
                if (inj.vitals.SpO2 < combinedVitals.SpO2) combinedVitals.SpO2 = inj.vitals.SpO2;
                if (inj.vitals.CRT > combinedVitals.CRT) combinedVitals.CRT = inj.vitals.CRT;
                if (Math.abs(inj.vitals.HR - 80) > Math.abs(combinedVitals.HR - 80)) combinedVitals.HR = inj.vitals.HR;
                if (Math.abs(inj.vitals.RR - 16) > Math.abs(combinedVitals.RR - 16)) combinedVitals.RR = inj.vitals.RR;

                Object.entries(inj.deterioration || {}).forEach(([k, v]) => { combinedDeterioration[k] = (combinedDeterioration[k] || 0) + v; });
                Object.assign(interventions, inj.interventions);
                
                if (inj.type === 'critical') severity = 'critical';
                else if (inj.type === 'major' && severity !== 'critical') severity = 'major';

                if (context === 'rtc' && (inj.type === 'major' || inj.type === 'critical')) entrapmentStatus = 'Physical (Dashboard/Door)';
                else if (context === 'rtc' && inj.type === 'minor') entrapmentStatus = 'Medical (Pain/C-Spine)';
            });
        } else {
             injuriesData.forEach(inj => {
                if(inj.visual) visualDescriptions.push(inj.visual);
                Object.entries(inj.deterioration || {}).forEach(([k, v]) => { combinedDeterioration[k] = (combinedDeterioration[k] || 0) + v; });
                Object.assign(interventions, inj.interventions);
             });
             severity = 'custom';
        }

        return {
            id: id, age: Utils.randInt(18, 85), role: '', vehicleId: null,
            injuries: injuriesData, severity: severity, visualDescription: visualDescriptions.join(' ') || "Patient appears stable.",
            vitals: combinedVitals, initialVitals: {...combinedVitals}, deterioration: combinedDeterioration,
            interventions: interventions, treatedInjuries: new Set(), overrideState: 'normal',
            vitalsHistory: [], deteriorationAccumulator: {}, entrapment: entrapmentStatus, actionCounts: {}, extricated: false,
            ample: { A: Utils.choice(FrameworkData.ample.allergies), M: Utils.choice(FrameworkData.ample.medications), P: Utils.choice(FrameworkData.ample.pastHistory), L: Utils.choice(FrameworkData.ample.lastMeal), E: Utils.choice(FrameworkData.ample.events) }
        };
    }

    static createRTC(config) {
        const Utils = { randInt: (min, max) => Math.floor(Math.random() * (max - min + 1) + min) };
        const vehicles = [];
        const casualties = [];
        let hasEV = false;

        const isTJunction = Math.random() > 0.5;

        // Process Vehicles
        if (config.vehiclesConfig) {
            config.vehiclesConfig.forEach((vConf, i) => {
                const proto = FrameworkData.vehicles[vConf.type];
                if (proto.isEV) hasEV = true;
                let x = (isTJunction && i===0) ? 400 : 300 + (i * 150);
                let y = (isTJunction && i===0) ? 200 : 250 + Utils.randInt(-20, 20);
                let rotation = (isTJunction && i===0) ? 90 : Utils.randInt(-15, 15);
                vehicles.push({ id: `v${i}`, label: String.fromCharCode(65+i), type: vConf.type, svgKey: vConf.svg, ...proto, x, y, rotation });
            });
        } else {
            const proto = FrameworkData.vehicles['Saloon Car'];
            vehicles.push({ id: 'v0', label: 'A', type: 'Saloon Car', svgKey: 'Saloon Car (Intact)', ...proto, x: 350, y: 250, rotation: 0 });
        }

        // Process Casualties
        const patientCount = parseInt(config.cCount || config.patients || 2);
        for(let i=0; i<patientCount; i++) {
            let cas;
            if (config.customPatients && config.customPatients[i]) {
                cas = this.createCasualty(i, 'rtc', [config.customPatients[i].injury], config.customPatients[i].vitals);
            } else if (config.requiredSeverities) {
                cas = this.createCasualty(i, 'rtc', null, null, config.requiredSeverities);
            } else {
                cas = this.createCasualty(i, 'rtc');
            }

            // Assign to vehicle and seat
            const targetVehicle = vehicles[i % vehicles.length];
            cas.vehicleId = targetVehicle.id;
            const roles = ['Driver', 'Passenger', 'Rear Left', 'Rear Right'];
            cas.role = roles[i % 4];
            
            // Map offsets relative to vehicle centre based on role
            if (cas.role === 'Driver') { cas.offsetX = 20; cas.offsetY = -20; }
            else if (cas.role === 'Passenger') { cas.offsetX = -20; cas.offsetY = -20; }
            else if (cas.role === 'Rear Left') { cas.offsetX = -20; cas.offsetY = 20; }
            else { cas.offsetX = 20; cas.offsetY = 20; }

            casualties.push(cas);
        }

        const hazards = [];
        (config.forceHazards || []).forEach(hType => {
            const templ = FrameworkData.hazards.find(h => h.type === hType);
            if(templ) hazards.push({ ...templ, x: Utils.randInt(100, 700), y: Utils.randInt(100, 400), rotation: Utils.randInt(0, 360) });
        });

        return { 
            type: 'RTC', title: config.title || 'Road Traffic Collision', location: isTJunction ? 'Urban Junction' : 'A-Road', timeLimit: 20, 
            vehicles, casualties, hazards, containsEV: hasEV, entrapment: config.entrapment || 'Standard extrication required.', actorBrief: config.actorBrief || 'Follow instructor guidance.',
            marks: FrameworkData.markingCriteria.map(m => ({ ...m, checked: false, time: null }))
        };
    }

    static createTrauma(config) {
        const patientCount = parseInt(config.patients || 2);
        const casualties = [];
        for(let i=0; i<patientCount; i++) {
             if (config.customPatients && config.customPatients[i]) {
                casualties.push(this.createCasualty(i, 'trauma', [config.customPatients[i].injury], config.customPatients[i].vitals));
            } else {
                casualties.push(this.createCasualty(i, 'trauma'));
            }
             casualties[i].offsetX = Math.floor(Math.random() * 400) + 100;
             casualties[i].offsetY = Math.floor(Math.random() * 200) + 100;
        }
        return { 
            type: 'Trauma', title: 'Trauma Challenge', location: 'Industrial Estate', timeLimit: 15, 
            vehicles: [], casualties, hazards: [], containsEV: false, entrapment: 'None', actorBrief: 'Follow instructor guidance.',
            marks: FrameworkData.markingCriteria.map(m => ({ ...m, checked: false, time: null }))
        };
    }
}

const allAvailableScenarios = FrameworkData.getAllScenarios();
