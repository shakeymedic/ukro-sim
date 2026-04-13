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
    vehicles: {
        'Saloon Car': { type: 'Saloon Car', capacity: 5, isEV: false, hasUHSS: false, color: '#3b82f6', width: 100, height: 50 },
        'SUV': { type: 'SUV', capacity: 7, isEV: false, hasUHSS: true, color: '#475569', width: 110, height: 55 },
        'Tesla Model 3': { type: 'Tesla Model 3', capacity: 5, isEV: true, hasUHSS: true, color: '#10b981', width: 100, height: 50 },
        'Van': { type: 'Commercial Van', capacity: 3, isEV: false, hasUHSS: false, color: '#9ca3af', width: 120, height: 50 },
        'Hatchback': { type: 'Hatchback', capacity: 5, isEV: false, hasUHSS: false, color: '#f59e0b', width: 90, height: 45 },
        'Motorbike': { type: 'Motorbike', capacity: 2, isEV: false, hasUHSS: false, color: '#374151', width: 50, height: 20 },
        'HGV Cab': { type: 'HGV Cab', capacity: 2, isEV: false, hasUHSS: true, color: '#ef4444', width: 120, height: 80 },
        'Full HGV': { type: 'Full HGV', capacity: 2, isEV: false, hasUHSS: true, color: '#ef4444', width: 250, height: 60 },
        'Double Decker Bus': { type: 'Double Decker Bus', capacity: 70, isEV: false, hasUHSS: false, color: '#dc2626', width: 200, height: 80 }
    },
    hazards: [
        { type: 'Fuel Spill', width: 100, height: 100 },
        { type: 'Fire', width: 50, height: 50 },
        { type: 'Wall', width: 150, height: 20 },
        { type: 'Lamppost', width: 20, height: 20 },
        { type: 'Battery Fire', width: 50, height: 50 },
        { type: 'Chemical Drum', width: 30, height: 30 }
    ],
    baseMedicalEvents: [
        { id: 'M01', title: 'Single Vehicle into Tree', category: 'High Energy Trauma', entrapment: 'Severe dashboard intrusion. Relocation required.', actorBrief: 'Act highly distressed. Complain of crushing chest pain and numb legs.', vehicles: ['Saloon Car'] },
        { id: 'M02', title: 'Motorbike vs Van', category: 'Ejection Trauma', entrapment: 'Rider trapped under van axle. Lifting equipment required.', actorBrief: 'Rider screams constantly about leg pain. Van driver is in shock and confused.', vehicles: ['Motorbike', 'Van'] },
        { id: 'M03', title: 'High Speed Side Impact', category: 'Lateral Crush', entrapment: 'Massive B-Pillar intrusion. Rip or removal required.', actorBrief: 'Hold your pelvis. Refuse to let anyone touch your hips or legs. Shallow breathing.', vehicles: ['Saloon Car', 'Saloon Car'] },
        { id: 'M04', title: 'Double Decker Bus vs Bridge', category: 'Mass Casualty', entrapment: 'Upper deck roof crush. Complex access via ladders required.', actorBrief: 'Upper deck passengers are unconscious. Lower deck passengers wander aimlessly.', vehicles: ['Double Decker Bus'] },
        { id: 'M05', title: 'Full HGV Jackknife', category: 'Heavy Goods Collision', entrapment: 'Cab crushed against trailer. Platform working required.', actorBrief: 'Driver is trapped by the steering column. Severe bleeding from arms.', vehicles: ['Full HGV', 'Saloon Car'] },
        { id: 'M06', title: 'Vehicle Rollover into Ditch', category: 'Complex Terrain', entrapment: 'Vehicle on its roof. Total roof removal and trench rescue required.', actorBrief: 'Hang upside down if possible. Complain of severe neck pain. Spit blood.', vehicles: ['Saloon Car'] },
        { id: 'M07', title: 'Van Head-On Collision', category: 'Frontal Impact', entrapment: 'Footwell collapse. Pedal cuts and steering wheel lift required.', actorBrief: 'Driver has an open leg fracture. Scream whenever the vehicle shakes.', vehicles: ['Van', 'Saloon Car'] },
        { id: 'M08', title: 'Pedestrian Pinned by HGV', category: 'Crush Syndrome', entrapment: 'Pedestrian trapped under dual wheels. High pressure airbags required.', actorBrief: 'Pedestrian remains silent but awake. Pale and sweaty. Complain of extreme thirst.', vehicles: ['HGV Cab'] },
        { id: 'M09', title: 'EV Thermal Runaway Fire', category: 'Hazmat and Trauma', entrapment: 'Rapid snatch rescue required due to battery fire.', actorBrief: 'Cough violently. Complain of airway burns and heat exposure.', vehicles: ['Tesla Model 3'] },
        { id: 'M10', title: 'Agricultural Machinery Collision', category: 'Impalement', entrapment: 'Fence post through windscreen. Angle grinder needed near casualty.', actorBrief: 'Do not move your torso. Take rapid short breaths. Panic if rescuers touch the post.', vehicles: ['Van'] },
        { id: 'M11', title: 'Electric SUV Under-ride', category: 'Complex EV Rescue', entrapment: 'Roof sheared off. Battery floorpan severely compromised. High voltage risk.', actorBrief: 'State you feel a tingling sensation. Complain of a strange chemical smell.', vehicles: ['SUV', 'Full HGV'] },
        { id: 'M12', title: 'EV vs Pedestrian', category: 'Silent Collision', entrapment: 'Pedestrian trapped under EV floorpan. Isolation plug must be pulled before lifting.', actorBrief: 'Groan in severe pain. You are trapped flat on your back.', vehicles: ['Hatchback'] }
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
                [1, 2, 3].forEach(cCount => {
                    let requiredSeverities = [];
                    if (cCount === 1) requiredSeverities = ['major'];
                    if (cCount === 2) requiredSeverities = ['major', 'minor'];
                    if (cCount === 3) requiredSeverities = ['critical', 'major', 'minor'];

                    generated.push({
                        id: `PRE-${counter.toString().padStart(3, '0')}`,
                        title: `${medical.title} (${cCount} Cas, ${env.weather})`,
                        category: medical.category,
                        config: {
                            vCount: medical.vehicles.length,
                            vehicleTypes: medical.vehicles,
                            cCount: cCount,
                            weather: env.weather,
                            timeOfDay: env.timeOfDay,
                            requiredSeverities: requiredSeverities,
                            entrapment: medical.entrapment,
                            actorBrief: medical.actorBrief,
                            equipment: { 
                                frs: ['Hydraulic Rams', 'Spreaders', 'Cutters', 'Step Chocks', 'Glass Management', 'Dry Powder Extinguisher', 'Electrical Gloves'], 
                                medical: ['Trauma Bag', 'Oxygen Cylinder', 'Pelvic Binder', 'Tourniquets', 'Splints'] 
                            }
                        }
                    });
                    counter++;
                });
            });
        });
        return generated;
    },

    getAllScenarios: function() {
        return { premade: this.generatePremadeScenarios() };
    }
};

const allAvailableScenarios = FrameworkData.getAllScenarios();
