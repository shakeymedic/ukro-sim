const ScenarioDatabase = {
    customScenarios: [],

    svgAssets: {
        'Saloon Car': '<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="5" width="80" height="40" rx="5" fill="#3b82f6"/><rect x="25" y="10" width="50" height="30" rx="3" fill="#1e3a8a"/></svg>',
        'Tesla Model 3': '<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="5" width="80" height="40" rx="5" fill="#10b981"/><path d="M50 15 L45 25 L55 25 L50 35" stroke="white" stroke-width="2" fill="none"/></svg>',
        'HGV Cab': '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="40" height="50" rx="2" fill="#ef4444"/><rect x="50" y="5" width="65" height="50" fill="#9ca3af"/><rect x="15" y="10" width="10" height="40" fill="#b91c1c"/></svg>',
        'Single Decker Bus': '<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="190" height="50" rx="4" fill="#f59e0b"/><rect x="15" y="10" width="20" height="40" fill="#d97706"/><rect x="45" y="10" width="140" height="40" fill="#d97706"/></svg>',
        'Fire Hazard': '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M25 5 C25 5 15 20 15 30 C15 40 20 45 25 45 C30 45 35 40 35 30 C35 20 25 5 25 5 Z" fill="#f59e0b"/><path d="M25 15 C25 15 20 25 20 32 C20 38 23 40 25 40 C27 40 30 38 30 32 C30 25 25 15 25 15 Z" fill="#dc2626"/></svg>',
        'Chemical Spill': '<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="35" rx="20" ry="10" fill="#84cc16" opacity="0.6"/><circle cx="25" cy="20" r="8" fill="#4d7c0f"/></svg>'
    },

    baseMedicalEvents: [
        {
            id: 'M01',
            title: 'Isolated Tension Pneumothorax',
            category: 'Thoracic',
            entrapment: 'Dashboard roll required',
            clinicalObservations: 'Tracheal deviation to the right. Distended neck veins. Cyanosis present around the lips. Reduced chest movement on the left side.',
            deteriorationTrend: 'Rapid decline in SpO2. Progressive hypotension. Heart rate steadily increasing until decompensation occurs at 15 minutes.',
            ample: { A: 'None', M: 'None', P: 'None', L: '3 hours ago', E: 'High speed frontal impact' },
            expectedInterventions: ['Needle Decompression', 'Oxygen Therapy'],
            injuries: ['Tension Pneumothorax', 'Uninjured'],
            equipment: { frs: ['Hydraulic Rams', 'Spreaders', 'Step Chocks', 'Hard Protection'], medical: ['Trauma Bag', 'Oxygen Cylinder', 'Chest Decompression Kit'] },
            actorBrief: 'Act highly distressed. Complain you cannot catch your breath. Clutch your left chest. Do not answer questions clearly.'
        },
        {
            id: 'M02',
            title: 'Catastrophic Amputation',
            category: 'Haemorrhage',
            entrapment: 'Door removal required',
            clinicalObservations: 'Right lower limb amputated below the knee. Bright red arterial bleeding spurting from the stump. Skin is pale and diaphoretic. Capillary refill time exceeds 4 seconds.',
            deteriorationTrend: 'Immediate hypovolaemic shock. SBP drops by 10mmHg every 2 minutes. Loss of consciousness imminent without tourniquet application.',
            ample: { A: 'Latex', M: 'None', P: 'None', L: '1 hour ago', E: 'Side impact collision' },
            expectedInterventions: ['Tourniquet', 'Oxygen Therapy'],
            injuries: ['Catastrophic Haemorrhage', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Spreaders', 'Glass Management Kit', 'Sharps Protection'], medical: ['Multiple Tourniquets', 'Haemostatic Dressings', 'Trauma Bag'] },
            actorBrief: 'Scream constantly. Point to your leg. Become progressively more confused and sleepy as the simulation runs.'
        },
        {
            id: 'M03',
            title: 'Severe TBI with Hypoxia',
            category: 'Head',
            entrapment: 'Roof flap required',
            clinicalObservations: 'Patient is unresponsive. Snoring respirations present. Right pupil is fixed and dilated. Significant bruising over the right temporal region.',
            deteriorationTrend: 'Cushing reflex develops. SBP increases while HR drops. Respiratory rate becomes erratic. Airway obstruction worsens over time.',
            ample: { A: 'None', M: 'None', P: 'Hypertension', L: 'Fasted', E: 'Vehicle rollover' },
            expectedInterventions: ['Airway Management', 'Oxygen Therapy'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Reciprocating Saw', 'Cutters', 'Step Chocks', 'Spine Board'], medical: ['Advanced Airway Kit', 'Suction Unit', 'C-Collar', 'Head Blocks'] },
            actorBrief: 'Remain completely unconscious. Produce snoring sounds. Do not react to any pain stimulus.'
        },
        {
            id: 'M04',
            title: 'Open Pelvic Ring Fracture',
            category: 'Orthopaedic',
            entrapment: 'B-Pillar removal required',
            clinicalObservations: 'Severe pain reported in the groin. Obvious external rotation of the right leg. Bruising forming over the symphysis pubis.',
            deteriorationTrend: 'Steady decline in blood pressure indicating internal bleeding. HR rises consistently. Patient becomes confused as perfusion drops.',
            ample: { A: 'Penicillin', M: 'None', P: 'None', L: '2 hours ago', E: 'Struck by HGV' },
            expectedInterventions: ['Pelvic Binder', 'Oxygen Therapy'],
            injuries: ['Pelvic Fracture', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Spreaders', 'Wedges', 'Hard Protection'], medical: ['Pelvic Binder', 'Scoop Stretcher', 'Trauma Bag'] },
            actorBrief: 'Complain of severe pain in your lower stomach and hips. Refuse to let anyone move your legs. Ask for water.'
        },
        {
            id: 'M05',
            title: 'Bilateral Femur Fractures',
            category: 'Orthopaedic',
            entrapment: 'Dash lift required',
            clinicalObservations: 'Both thighs are visibly deformed and swollen. Patient is screaming in agony. Legs are trapped tightly beneath the steering column.',
            deteriorationTrend: 'Gradual onset of hypovolaemia. Heart rate climbs rapidly due to pain and blood loss. SBP slowly drifts downwards.',
            ample: { A: 'None', M: 'None', P: 'None', L: '4 hours ago', E: 'Head-on collision' },
            expectedInterventions: ['Traction Splint', 'Oxygen Therapy'],
            injuries: ['Femur Fracture', 'Femur Fracture'],
            equipment: { frs: ['Hydraulic Rams', 'Spreaders', 'Sill Supports', 'Glass Management Kit'], medical: ['Traction Splints', 'Trauma Bag', 'Analgesia Setup'] },
            actorBrief: 'Scream when anyone touches your legs. State you cannot feel your feet. Keep your legs trapped beneath the dashboard area.'
        },
        {
            id: 'M06',
            title: 'Flail Chest and Contusion',
            category: 'Thoracic',
            entrapment: 'Side removal required',
            clinicalObservations: 'Paradoxical movement of the right anterior chest wall. Patient exhibits shallow, guarded breathing. Crepitus felt on palpation of ribs 3 to 6.',
            deteriorationTrend: 'SpO2 falls gradually as the patient tires. Respiratory rate increases to compensate. Mild tachycardia persists.',
            ample: { A: 'None', M: 'None', P: 'Asthma', L: '1 hour ago', E: 'Struck tree at high speed' },
            expectedInterventions: ['Oxygen Therapy', 'Analgesia Support'],
            injuries: ['Simple Pneumothorax', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Spreaders', 'Step Chocks'], medical: ['Oxygen Cylinder', 'BVM', 'Chest Seals'] },
            actorBrief: 'Take very shallow breaths. Hold your right chest with your hands. State it hurts to breathe deeply.'
        },
        {
            id: 'M07',
            title: 'Traumatic Cardiac Arrest',
            category: 'Critical',
            entrapment: 'Rapid extrication required',
            clinicalObservations: 'Patient is completely motionless. No respiratory effort visible. Cyanosis present centrally and peripherally. Major bleeding noted from the left thigh.',
            deteriorationTrend: 'Asystole present immediately. Requires simultaneous control of massive bleeding and immediate chest compressions upon extrication.',
            ample: { A: 'Unknown', M: 'Unknown', P: 'Unknown', L: 'Unknown', E: 'Ejected from vehicle' },
            expectedInterventions: ['CPR', 'Haemorrhage Control'],
            injuries: ['Catastrophic Haemorrhage', 'Tension Pneumothorax'],
            equipment: { frs: ['Spreaders', 'Glass Management Kit'], medical: ['Defibrillator', 'Advanced Airway Kit', 'Tourniquets', 'Chest Decompression Kit'] },
            actorBrief: 'You are deceased. No movement. No response. No breathing.'
        },
        {
            id: 'M08',
            title: 'Spinal Cord Injury',
            category: 'Spinal',
            entrapment: 'Full roof removal required',
            clinicalObservations: 'Patient complains of intense neck pain. Loss of sensation reported below the nipple line. Priapism noted. Breathing relies entirely on the diaphragm.',
            deteriorationTrend: 'Neurogenic shock develops. Blood pressure falls while heart rate remains inappropriately normal or slow. Skin feels warm and dry below the injury site.',
            ample: { A: 'None', M: 'None', P: 'None', L: '2 hours ago', E: 'Rear-end collision' },
            expectedInterventions: ['C-Spine Immobilisation', 'Careful Handling'],
            injuries: ['Uninjured', 'Uninjured'],
            equipment: { frs: ['Reciprocating Saw', 'Cutters', 'Step Chocks'], medical: ['C-Collar', 'Head Blocks', 'Scoop Stretcher'] },
            actorBrief: 'State you cannot move your arms or legs. Keep completely still. Complain of neck pain if moved.'
        },
        {
            id: 'M09',
            title: 'Multi-system Trauma',
            category: 'Multi',
            entrapment: 'Complex access required',
            clinicalObservations: 'Altered level of consciousness. Patient is combative and groaning. Large scalp laceration actively bleeding. Pelvis feels unstable on gentle palpation.',
            deteriorationTrend: 'Complex shock physiology. Rapid deterioration in conscious level combined with steady drop in blood pressure. Fast, thready pulse present.',
            ample: { A: 'Ibuprofen', M: 'None', P: 'None', L: '5 hours ago', E: 'Crushed between vehicles' },
            expectedInterventions: ['Pelvic Binder', 'Airway Management'],
            injuries: ['Severe Head Injury', 'Pelvic Fracture'],
            equipment: { frs: ['Full Hydraulic Set', 'Stabilisation Struts', 'Platform Platform'], medical: ['Pelvic Binder', 'Suction Unit', 'Trauma Bag'] },
            actorBrief: 'Act confused and aggressive. Try to push medics away. Groan loudly when your pelvis is touched.'
        },
        {
            id: 'M10',
            title: 'Burns and Airway Compromise',
            category: 'Burns',
            entrapment: 'Immediate snatch rescue required',
            clinicalObservations: 'Soot visible around the mouth and nose. Singed facial hair. Hoarse voice when speaking. Partial thickness burns to both arms.',
            deteriorationTrend: 'Progressive upper airway oedema. Stridor develops at 10 minutes. Complete airway occlusion possible if left untreated.',
            ample: { A: 'None', M: 'None', P: 'None', L: '1 hour ago', E: 'Vehicle fire post-impact' },
            expectedInterventions: ['Airway Management', 'Oxygen Therapy'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Hose Reel Jet', 'Breathing Apparatus', 'Spreaders'], medical: ['Advanced Airway Kit', 'Burn Dressings', 'Oxygen Cylinder'] },
            actorBrief: 'Cough frequently. Speak with a hoarse, raspy voice. Complain your arms are burning.'
        },
        {
            id: 'M11',
            title: 'Haemorrhagic Shock',
            category: 'Haemorrhage',
            entrapment: 'B-Pillar removal required',
            clinicalObservations: 'Skin is extremely pale and sweaty. Patient reports severe thirst. Obvious seatbelt sign across the lower abdomen.',
            deteriorationTrend: 'Delayed but severe drop in blood pressure due to anticoagulant medication. Heart rate struggles to compensate due to beta-blockers.',
            ample: { A: 'None', M: 'Apixaban', P: 'Atrial Fibrillation', L: '3 hours ago', E: 'T-bone collision' },
            expectedInterventions: ['Pelvic Binder', 'Oxygen Therapy'],
            injuries: ['Pelvic Fracture', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Spreaders', 'Step Chocks'], medical: ['Pelvic Binder', 'Trauma Bag', 'Fluid Setup'] },
            actorBrief: 'Act very weak. Complain of extreme thirst. Tell medics you are on blood thinners.'
        },
        {
            id: 'M12',
            title: 'Crush Syndrome',
            category: 'Medical',
            entrapment: 'Heavy lifting equipment required',
            clinicalObservations: 'Lower body trapped firmly under the vehicle. Patient is remarkably alert and calm. Skin below the crush point is mottled and cold.',
            deteriorationTrend: 'Vitals remain stable while trapped. Severe reperfusion injury and cardiac arrhythmias occur immediately upon release of the pressure.',
            ample: { A: 'None', M: 'None', P: 'None', L: 'Unknown', E: 'Trapped under agricultural machinery' },
            expectedInterventions: ['Oxygen Therapy', 'Tourniquet'],
            injuries: ['Femur Fracture', 'Uninjured'],
            equipment: { frs: ['High Pressure Air Bags', 'Cribbing', 'Hydraulic Rams'], medical: ['Multiple Tourniquets', 'Defibrillator', 'Fluid Setup'] },
            actorBrief: 'Remain surprisingly calm. Tell medics you have been trapped for hours. State your legs feel numb.'
        },
        {
            id: 'M13',
            title: 'Traumatic Amputation Upper Limb',
            category: 'Haemorrhage',
            entrapment: 'Door removal required',
            clinicalObservations: 'Left arm severed at the mid-humerus. Significant blood pooling in the footwell. Patient is drowsy and confused.',
            deteriorationTrend: 'Immediate life-threatening haemorrhage. Rapid fall in conscious level correlating directly with blood loss.',
            ample: { A: 'Codeine', M: 'None', P: 'None', L: '2 hours ago', E: 'Arm out of window during roll' },
            expectedInterventions: ['Tourniquet', 'Oxygen Therapy'],
            injuries: ['Catastrophic Haemorrhage', 'Uninjured'],
            equipment: { frs: ['Spreaders', 'Cutters', 'Glass Management'], medical: ['Tourniquets', 'Trauma Bag', 'Oxygen Cylinder'] },
            actorBrief: 'Look constantly at where your arm used to be. Act terrified. Close your eyes frequently as if passing out.'
        },
        {
            id: 'M14',
            title: 'Simple Pneumothorax Deterioration',
            category: 'Thoracic',
            entrapment: 'Dashboard roll required',
            clinicalObservations: 'Patient complains of sharp chest pain on inspiration. Decreased breath sounds on the right side. Trachea remains central.',
            deteriorationTrend: 'Condition slowly progresses. If positive pressure ventilation is applied incorrectly, this converts rapidly into a tension pneumothorax.',
            ample: { A: 'None', M: 'None', P: 'COPD', L: '4 hours ago', E: 'High speed collision' },
            expectedInterventions: ['Oxygen Therapy', 'Continuous Monitoring'],
            injuries: ['Simple Pneumothorax', 'Uninjured'],
            equipment: { frs: ['Hydraulic Rams', 'Sill Supports', 'Spreaders'], medical: ['Oxygen Cylinder', 'Trauma Bag'] },
            actorBrief: 'Hold your right ribs. Wince every time you take a deep breath.'
        },
        {
            id: 'M15',
            title: 'Closed Head Injury',
            category: 'Head',
            entrapment: 'Roof flap required',
            clinicalObservations: 'Patient initially alert and conversing. Small haematoma on the left temple. No other obvious injuries visible.',
            deteriorationTrend: 'Classic lucid interval. Patient suddenly becomes uncooperative, complains of a severe headache, and then consciousness plummets rapidly.',
            ample: { A: 'None', M: 'Warfarin', P: 'Previous DVT', L: '1 hour ago', E: 'Head struck windscreen' },
            expectedInterventions: ['C-Spine Immobilisation', 'Oxygen Therapy'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Step Chocks', 'Glass Management'], medical: ['C-Collar', 'Advanced Airway Kit', 'Trauma Bag'] },
            actorBrief: 'Start by acting completely normal. After 5 minutes, complain of a terrible headache. After 10 minutes, stop answering questions and act sleepy.'
        },
        {
            id: 'M16',
            title: 'Massive Facial Trauma',
            category: 'Airway',
            entrapment: 'Dash lift required',
            clinicalObservations: 'Face is highly disfigured with severe bleeding from the nose and mouth. Patient is conscious but struggling to clear blood from the airway. Teeth and bone fragments visible.',
            deteriorationTrend: 'Airway patency fluctuates. Constant risk of aspiration. Hypoxia develops quickly if suction and positioning are not maintained.',
            ample: { A: 'None', M: 'None', P: 'None', L: '3 hours ago', E: 'No seatbelt worn' },
            expectedInterventions: ['Airway Management', 'Suction'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Hydraulic Rams', 'Spreaders', 'Hard Protection'], medical: ['Suction Unit', 'Advanced Airway Kit', 'Trauma Bag'] },
            actorBrief: 'Gurgle when you breathe. Spit constantly. Lean forward to keep your airway clear.'
        },
        {
            id: 'M17',
            title: 'Penetrating Neck Trauma',
            category: 'Airway',
            entrapment: 'Side removal required',
            clinicalObservations: 'Large glass shard impaled in the left side of the neck. Venous bleeding oozing around the object. Expanding haematoma visible under the skin.',
            deteriorationTrend: 'Bleeding rate accelerates if the object moves. The expanding haematoma gradually compresses the airway over 15 minutes.',
            ample: { A: 'None', M: 'None', P: 'None', L: '2 hours ago', E: 'Glass shrapnel impact' },
            expectedInterventions: ['Haemorrhage Control', 'Airway Management'],
            injuries: ['Catastrophic Haemorrhage', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Spreaders', 'Step Chocks'], medical: ['Haemostatic Dressings', 'Advanced Airway Kit', 'Trauma Bag'] },
            actorBrief: 'Do not move your neck under any circumstances. Speak in a quiet whisper. Hold your hand near the injury but do not touch it.'
        },
        {
            id: 'M18',
            title: 'Open Tib/Fib Fracture',
            category: 'Orthopaedic',
            entrapment: 'Footwell access required',
            clinicalObservations: 'Bone protruding through the skin of the lower right leg. Moderate venous bleeding present. Foot is cold and pulseless.',
            deteriorationTrend: 'Slow blood loss causes a gradual rise in heart rate. Severe pain causes intermittent spikes in blood pressure.',
            ample: { A: 'None', M: 'None', P: 'Type 2 Diabetes', L: '5 hours ago', E: 'Pedal box intrusion' },
            expectedInterventions: ['Haemorrhage Control', 'Splinting'],
            injuries: ['Femur Fracture', 'Uninjured'],
            equipment: { frs: ['Pedal Cutters', 'Small Spreaders', 'Hard Protection'], medical: ['Box Splint', 'Trauma Dressings', 'Trauma Bag'] },
            actorBrief: 'Scream if your right leg is moved. State your right foot feels completely dead.'
        },
        {
            id: 'M19',
            title: 'Cardiac Contusion',
            category: 'Medical',
            entrapment: 'B-Pillar removal required',
            clinicalObservations: 'Distinct bruise in the shape of a steering wheel on the sternum. Patient reports a fluttering sensation in the chest. Pulse feels irregular.',
            deteriorationTrend: 'Patient experiences runs of premature ventricular contractions. Blood pressure fluctuates. Sudden onset of ventricular fibrillation is possible.',
            ample: { A: 'None', M: 'Bisoprolol', P: 'Hypertension', L: '2 hours ago', E: 'Steering wheel impact' },
            expectedInterventions: ['Oxygen Therapy', 'Continuous Monitoring'],
            injuries: ['Tension Pneumothorax', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Spreaders', 'Step Chocks'], medical: ['Defibrillator', 'Oxygen Cylinder', 'Trauma Bag'] },
            actorBrief: 'Rub your chest. Complain your heart feels like it is skipping beats. Act anxious.'
        },
        {
            id: 'M20',
            title: 'Paediatric Head Injury',
            category: 'Paediatric',
            entrapment: 'Door removal required',
            clinicalObservations: 'Seven year old child found slumped in the rear seat. Unresponsive to voice. Shallow, rapid breathing pattern.',
            deteriorationTrend: 'Children decompensate suddenly. Heart rate remains elevated to maintain output, then drops precipitously indicating imminent arrest.',
            ample: { A: 'None', M: 'None', P: 'None', L: '1 hour ago', E: 'Child seat failure' },
            expectedInterventions: ['Airway Management', 'C-Spine Immobilisation'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Spreaders', 'Glass Management Kit'], medical: ['Paediatric Airway Kit', 'Paediatric Collar', 'Trauma Bag'] },
            actorBrief: 'Act as a child. Remain unresponsive. Emit an occasional soft groan.'
        },
        {
            id: 'M21',
            title: 'Elderly Hip Fracture',
            category: 'Medical',
            entrapment: 'Side removal required',
            clinicalObservations: 'Eighty year old patient reporting severe hip pain. Leg is shortened and externally rotated. Skin is frail and bruised easily.',
            deteriorationTrend: 'Pain and stress cause a steady decline in physiological reserves. Anticoagulants accelerate internal blood loss into the thigh and pelvis.',
            ample: { A: 'None', M: 'Apixaban', P: 'Osteoporosis', L: '4 hours ago', E: 'Low speed impact' },
            expectedInterventions: ['Pelvic Binder', 'Careful Handling'],
            injuries: ['Pelvic Fracture', 'Uninjured'],
            equipment: { frs: ['Cutters', 'Spreaders', 'Step Chocks'], medical: ['Pelvic Binder', 'Scoop Stretcher', 'Blankets'] },
            actorBrief: 'Act elderly and confused. Ask where you are repeatedly. Complain of severe hip pain.'
        },
        {
            id: 'M22',
            title: 'Obstetric Trauma',
            category: 'Medical',
            entrapment: 'Full roof removal required',
            clinicalObservations: 'Twenty-six weeks pregnant female. Severe abdominal pain. Rigid abdomen on palpation. Vaginal bleeding noted.',
            deteriorationTrend: 'Signs of hypovolaemic shock masked initially due to increased blood volume of pregnancy. Fetal distress occurs before maternal signs become severe.',
            ample: { A: 'None', M: 'Pregnancy Vitamins', P: '26 weeks pregnant', L: '3 hours ago', E: 'Collision during commute' },
            expectedInterventions: ['Pelvic Binder', 'Oxygen Therapy'],
            injuries: ['Pelvic Fracture', 'Catastrophic Haemorrhage'],
            equipment: { frs: ['Reciprocating Saw', 'Cutters', 'Step Chocks'], medical: ['Pelvic Binder', 'Trauma Bag', 'Oxygen Cylinder'] },
            actorBrief: 'Hold your stomach defensively. Tell medics you are pregnant. Express extreme panic about the baby.'
        },
        {
            id: 'M23',
            title: 'Hypothermia and Minor Trauma',
            category: 'Environmental',
            entrapment: 'Complex access down embankment',
            clinicalObservations: 'Patient is shivering violently. Confusion and slurred speech present. Extremities are extremely cold to the touch. Minor lacerations on arms.',
            deteriorationTrend: 'Core temperature drops steadily. Shivering stops as hypothermia worsens. Heart rate slows and bradycardia sets in. High risk of cardiac arrest on movement.',
            ample: { A: 'None', M: 'None', P: 'None', L: '8 hours ago', E: 'Vehicle left road unseen' },
            expectedInterventions: ['Thermal Care', 'Splinting'],
            injuries: ['Femur Fracture', 'Uninjured'],
            equipment: { frs: ['Rope Rescue Kit', 'Basket Stretcher', 'Lighting'], medical: ['Foil Blankets', 'Active Warming Devices', 'Trauma Bag'] },
            actorBrief: 'Shiver violently. Speak very slowly with slurred words. Tell them you cannot feel your fingers.'
        },
        {
            id: 'M24',
            title: 'Electrocution Risk',
            category: 'Medical',
            entrapment: 'Power isolation required',
            clinicalObservations: 'Patient found unconscious leaning against the vehicle frame. Orange high voltage cables are exposed and touching the chassis. Smell of burning flesh present.',
            deteriorationTrend: 'Patient is in ventricular fibrillation. No changes occur until power is isolated and CPR is initiated safely.',
            ample: { A: 'None', M: 'None', P: 'None', L: '2 hours ago', E: 'EV high voltage cable compromised' },
            expectedInterventions: ['Scene Safety', 'CPR'],
            injuries: ['Catastrophic Haemorrhage', 'Uninjured'],
            equipment: { frs: ['Electrical Gloves', 'Insulated Hooks', 'Dry Powder Extinguisher'], medical: ['Defibrillator', 'Advanced Airway Kit', 'Trauma Bag'] },
            actorBrief: 'You are deceased until power is isolated and CPR begins.'
        },
        {
            id: 'M25',
            title: 'Chemical Exposure',
            category: 'Hazmat',
            entrapment: 'Decontamination required',
            clinicalObservations: 'Pungent odour in the air. Patient is coughing violently and wheezing. Eyes are red and streaming. Chemical burns visible on exposed forearms.',
            deteriorationTrend: 'Airway spasm worsens rapidly. SpO2 drops as chemical pneumonitis develops. Condition degrades until patient is removed from the contaminated area.',
            ample: { A: 'None', M: 'None', P: 'Asthma', L: '1 hour ago', E: 'HGV carrying corrosive liquids' },
            expectedInterventions: ['Scene Safety', 'Oxygen Therapy'],
            injuries: ['Simple Pneumothorax', 'Uninjured'],
            equipment: { frs: ['Gas-Tight Suits', 'Decontamination Tent', 'Hose Reel'], medical: ['Oxygen Cylinder', 'Saline Irrigation', 'Trauma Bag'] },
            actorBrief: 'Cough constantly. Wipe your eyes. Complain your skin is burning.'
        },
        {
            id: 'M26',
            title: 'Trapped Medical Professional',
            category: 'Airway',
            entrapment: 'Dash lift required',
            clinicalObservations: 'Patient is trapped tightly. Complains of crushing chest pain. Very anxious and directing their own care. Right arm is pinned and numb.',
            deteriorationTrend: 'Anxiety drives heart rate high. Slow crush syndrome physiology develops. Blood pressure drops slightly over 20 minutes.',
            ample: { A: 'None', M: 'None', P: 'Doctor', L: '4 hours ago', E: 'Trapped under HGV' },
            expectedInterventions: ['Airway Management', 'Rapid Extrication'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Hydraulic Rams', 'Sill Supports', 'Spreaders'], medical: ['Trauma Bag', 'Oxygen Cylinder', 'Defibrillator'] },
            actorBrief: 'Try to tell the medics what to do. Use medical terminology. Act highly anxious about your trapped arm.'
        },
        {
            id: 'M27',
            title: 'Impalement Injury',
            category: 'Thoracic',
            entrapment: 'Cutting equipment needed near patient',
            clinicalObservations: 'Large metal fence pole impaled through the right chest. Patient is awake but struggles to breathe. Minimal external bleeding visible around the pole.',
            deteriorationTrend: 'Tension pneumothorax physiology builds up slowly. Moving the pole causes catastrophic haemorrhage and immediate death.',
            ample: { A: 'None', M: 'None', P: 'None', L: '2 hours ago', E: 'Fence post through windscreen' },
            expectedInterventions: ['Haemorrhage Control', 'Oxygen Therapy'],
            injuries: ['Tension Pneumothorax', 'Uninjured'],
            equipment: { frs: ['Angle Grinder', 'Reciprocating Saw', 'Hard Protection'], medical: ['Trauma Dressings', 'Oxygen Cylinder', 'Trauma Bag'] },
            actorBrief: 'Do not move your chest. Beg the crews not to pull the pole out. Breathe in short gasps.'
        },
        {
            id: 'M28',
            title: 'Submersion Vehicle',
            category: 'Environmental',
            entrapment: 'Water rescue required',
            clinicalObservations: 'Vehicle rests in shallow, freezing water. Patient is semi-conscious and hypothermic. Coughing up frothy, pink sputum. Lips are deeply cyanosed.',
            deteriorationTrend: 'Secondary drowning physiology. SpO2 continues to fall despite oxygen administration. Bradycardia worsens as core temperature drops.',
            ample: { A: 'None', M: 'None', P: 'None', L: '1 hour ago', E: 'Vehicle entered deep water' },
            expectedInterventions: ['Airway Management', 'Thermal Care'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Water Rescue PPE', 'Throw Lines', 'Floating Sled'], medical: ['Suction Unit', 'Oxygen Cylinder', 'Foil Blankets'] },
            actorBrief: 'Shiver. Cough periodically and spit out water. Act semi-conscious and lethargic.'
        },
        {
            id: 'M29',
            title: 'Bariatric Patient Extrication',
            category: 'Medical',
            entrapment: 'Enhanced space creation required',
            clinicalObservations: 'Large patient wedged tightly between the seat and steering wheel. Shallow breathing due to abdominal compression. Sweating profusely.',
            deteriorationTrend: 'Positional asphyxia risk. Hypoxia develops slowly due to restricted chest excursion. Extrication takes significantly longer, delaying definitive care.',
            ample: { A: 'None', M: 'Metformin', P: 'Type 2 Diabetes', L: '2 hours ago', E: 'Frontal impact' },
            expectedInterventions: ['Airway Management', 'Continuous Monitoring'],
            injuries: ['Pelvic Fracture', 'Uninjured'],
            equipment: { frs: ['Hydraulic Rams', 'Spreaders', 'Bariatric Stretcher Support'], medical: ['Oxygen Cylinder', 'Trauma Bag'] },
            actorBrief: 'Complain you cannot breathe properly because your stomach is crushed. Sweat heavily.'
        },
        {
            id: 'M30',
            title: 'Combative Patient',
            category: 'Head',
            entrapment: 'Door removal required',
            clinicalObservations: 'Patient is highly aggressive and thrashing around the cabin. Bleeding heavily from a forehead laceration. Refusing to keep still or accept treatment.',
            deteriorationTrend: 'Combative behaviour exacerbates bleeding and potential spinal injuries. High risk of rescuer injury. Patient eventually becomes exhausted and loses consciousness.',
            ample: { A: 'None', M: 'None', P: 'Unknown', L: 'Unknown', E: 'Head injury causing confusion' },
            expectedInterventions: ['Scene Safety', 'C-Spine Immobilisation'],
            injuries: ['Severe Head Injury', 'Uninjured'],
            equipment: { frs: ['Spreaders', 'Cutters', 'Glass Management Kit'], medical: ['Soft Restraints', 'Trauma Bag', 'C-Collar'] },
            actorBrief: 'Swear loudly. Push rescuers away. Refuse to let them put a collar on you. Move constantly.'
        }
    ],

    environments: [
        { weather: 'Clear', timeOfDay: 'Day', modifier: 'Standard' },
        { weather: 'Heavy Rain', timeOfDay: 'Night', modifier: 'Complex' },
        { weather: 'Freezing', timeOfDay: 'Night', modifier: 'Extreme' },
        { weather: 'Fog', timeOfDay: 'Day', modifier: 'Low Visibility' }
    ],

    generatePremadeScenarios: function() {
        let generated = [];
        let counter = 1;

        this.baseMedicalEvents.forEach(medical => {
            this.environments.forEach(env => {
                generated.push({
                    id: `PRE-${counter.toString().padStart(3, '0')}`,
                    title: `${medical.title} (${env.modifier} Conditions)`,
                    category: medical.category,
                    duration: 20,
                    config: {
                        vCount: 2,
                        cCount: 2,
                        weather: env.weather,
                        timeOfDay: env.timeOfDay,
                        hasHazmat: medical.category === 'Hazmat',
                        presetInjuries: medical.injuries,
                        entrapment: medical.entrapment,
                        clinicalObservations: medical.clinicalObservations,
                        deteriorationTrend: medical.deteriorationTrend,
                        ample: medical.ample,
                        expectedInterventions: medical.expectedInterventions,
                        equipment: medical.equipment,
                        actorBrief: medical.actorBrief
                    }
                });
                counter++;
            });
        });
        return generated;
    },

    saveCustomScenario: function(scenarioData) {
        this.customScenarios.push(scenarioData);
        localStorage.setItem('ukroCustomScenarios', JSON.stringify(this.customScenarios));
    },

    loadCustomScenarios: function() {
        const saved = localStorage.getItem('ukroCustomScenarios');
        if (saved) {
            this.customScenarios = JSON.parse(saved);
        }
    },

    getAllScenarios: function() {
        const premade = this.generatePremadeScenarios();
        return {
            premade: premade,
            custom: this.customScenarios,
            total: premade.length + this.customScenarios.length
        };
    }
};

ScenarioDatabase.loadCustomScenarios();
const allAvailableScenarios = ScenarioDatabase.getAllScenarios();
