// data.js
export const frameworkData = {
  scoresheets: {
    command: [
      'Scene assessment & survey',
      'Formulation of tactical plan',
      'Clear communication',
      'Dynamic risk assessment',
      'Scene safety',
      'Crew resource management'
    ],
    technical: [
      'Vehicle stabilisation',
      'Glass management',
      'Use of hydraulic tools',
      'Extrication pathway',
      'Vehicle hazards (UHSS, EV)'
    ],
    trauma: [
      'Scene safety & approach',
      '<C>ABCDE assessment',
      'Identify/manage life-threats',
      'Teamwork & communication',
      'Ongoing reassessment',
      'ATMIST handover'
    ]
  },

  injuries: {
    'Tension Pneumothorax': {
      name: 'Tension Pneumothorax',
      type: 'major',
      canSelfExtricate: false,
      bodyPart: 'chest_left',
      marker: 'T',
      moulage: 'Distended neck veins, hyper-resonant chest, tracheal deviation (late).',
      briefing: 'Extreme shortness of breath, cannot complete sentences.',
      vitals: { GCS: 14, HR: 135, RR: 38, SBP: 85, SpO2: 82 },
      deterioration: { SpO2: -4, SBP: -5, HR: 5 },
      interventions: {}
    },
    'Catastrophic Haemorrhage (Thigh)': {
      name: 'Catastrophic Haemorrhage (Thigh)',
      type: 'major',
      canSelfExtricate: false,
      bodyPart: 'leg_right',
      marker: 'C',
      moulage: 'Pulsatile bleed, clothing soaked.',
      briefing: 'Pale, clammy, very anxious.',
      vitals: { GCS: 13, HR: 140, RR: 30, SBP: 80, SpO2: 92 },
      deterioration: { SBP: -8, HR: 6, GCS: -1 },
      interventions: {
        'Apply Tourniquet': {
          key: 'Apply Tourniquet',
          effect: { SBP: 15, HR: -20 },
          stopsDeterioration: true,
          feedback: 'Tourniquet applied. Haemorrhage controlled.'
        }
      }
    },
    'Severe Head Injury': {
      name: 'Severe Head Injury',
      type: 'major',
      canSelfExtricate: false,
      bodyPart: 'head',
      marker: 'H',
      moulage: 'Laceration to forehead, one pupil dilated.',
      briefing: 'GCS 8 (E2, V2, M4). Moans to pain.',
      vitals: { GCS: 8, HR: 55, RR: 26, SBP: 180, SpO2: 95 },
      deterioration: { GCS: -1, RR: -2 },
      interventions: {
        'Airway Management': {
          key: 'Airway Management',
          effect: { RR: 2 },
          stopsDeterioration: true,
          feedback: 'Airway manoeuvre performed, halting deterioration.'
        }
      }
    },
    'Lateral Flail Chest': {
      name: 'Lateral Flail Chest',
      type: 'major',
      canSelfExtricate: false,
      bodyPart: 'chest_left',
      marker: 'F',
      moulage: 'Bruising over left chest, paradoxical movement.',
      briefing: 'Shallow, slow breathing; becoming unresponsive.',
      vitals: { GCS: 7, HR: 130, RR: 6, SBP: 90, SpO2: 86 },
      deterioration: { SpO2: -5, RR: -1 },
      interventions: {
        'Positive Pressure Ventilation': {
          key: 'Positive Pressure Ventilation',
          effect: { SpO2: 8, RR: 6 },
          stopsDeterioration: true,
          feedback: 'PPV initiated, assisting breathing.'
        }
      }
    },
    'Unstable Pelvic Fracture': {
      name: 'Unstable Pelvic Fracture',
      type: 'major',
      canSelfExtricate: false,
      bodyPart: 'pelvis',
      marker: 'P',
      moulage: 'Bruising over pelvic wings, leg length discrepancy.',
      briefing: 'Severe pelvic pain, distressed.',
      vitals: { GCS: 13, HR: 130, RR: 28, SBP: 80, SpO2: 92 },
      deterioration: { SBP: -10, HR: 8 },
      interventions: {
        'Apply Pelvic Binder': {
          key: 'Apply Pelvic Binder',
          effect: { SBP: 10 },
          stopsDeterioration: true,
          feedback: 'Pelvic binder applied, providing stability.'
        }
      }
    },
    'Open Femur Fracture': {
      name: 'Open Femur Fracture',
      type: 'major',
      canSelfExtricate: false,
      bodyPart: 'leg_left',
      marker: 'OF',
      moulage: 'Bone visible through wound, heavy bleeding.',
      briefing: 'Screaming in pain, bleeding heavily.',
      vitals: { GCS: 15, HR: 120, RR: 28, SBP: 95, SpO2: 96 },
      deterioration: { HR: 5, SBP: -5 },
      interventions: {}
    },
    'Asthmatic Exacerbation': {
      name: 'Asthmatic Exacerbation',
      type: 'moderate',
      canSelfExtricate: true,
      bodyPart: 'chest_centre',
      marker: 'A',
      moulage: 'Wheeze audible, accessory muscle use.',
      briefing: 'History of asthma, struggling to speak.',
      vitals: { GCS: 15, HR: 110, RR: 32, SBP: 130, SpO2: 89 },
      deterioration: { SpO2: -2, RR: 2 },
      interventions: {}
    },
    'Severe Laceration (Forearm)': {
      name: 'Severe Laceration (Forearm)',
      type: 'minor',
      canSelfExtricate: true,
      bodyPart: 'arm_left',
      marker: 'W',
      moulage: 'Deep laceration to forearm, steady dark red flow.',
      briefing: 'Alert but in pain, worried about bleeding.',
      vitals: { GCS: 15, HR: 100, RR: 20, SBP: 115, SpO2: 98 },
      deterioration: { HR: 2 },
      interventions: {
        'Apply Wound Dressing': {
          key: 'Apply Wound Dressing',
          effect: { HR: -10 },
          stopsDeterioration: true,
          feedback: 'Dressing applied. Bleeding controlled.'
        }
      }
    },
    'Wrist Fracture': {
      name: 'Wrist Fracture',
      type: 'minor',
      canSelfExtricate: true,
      bodyPart: 'arm_right',
      marker: '#',
      moulage: 'Visible deformity to wrist ("dinner fork").',
      briefing: 'Severe wrist pain.',
      vitals: { GCS: 15, HR: 95, RR: 18, SBP: 125, SpO2: 99 },
      deterioration: { HR: 1 },
      interventions: {}
    },
    'Elderly Fall + Head Laceration': {
      name: 'Elderly Fall + Head Laceration',
      type: 'minor',
      canSelfExtricate: true,
      bodyPart: 'head',
      marker: 'L',
      moulage: 'Small scalp wound, oozing blood.',
      briefing: '80-year-old with AF on anticoagulants.',
      vitals: { GCS: 14, HR: 80, RR: 18, SBP: 140, SpO2: 97 },
      deterioration: { GCS: -1 },
      interventions: {}
    },
    'Chemical Burn (Arm)': {
      name: 'Chemical Burn (Arm)',
      type: 'moderate',
      canSelfExtricate: false,
      bodyPart: 'arm_right',
      marker: 'B',
      moulage: 'Skin blistering and redness, chemical odour.',
      briefing: 'Severe stinging pain after exposure.',
      vitals: { GCS: 15, HR: 105, RR: 20, SBP: 125, SpO2: 98 },
      deterioration: { HR: 3 },
      interventions: {}
    }
  },

  ampleHistory: {
    allergies: ['NKDA', 'Penicillin', 'Latex', 'Nuts'],
    medications: ['None', 'Warfarin', 'DOAC', 'Insulin', 'Salbutamol inhaler', 'Aspirin'],
    pastHistory: ['Asthma', 'Diabetes', 'Hypertension', 'IHD', 'COPD', 'Epilepsy'],
    lastMeal: ['Breakfast', 'Sandwich at lunch', 'Tea', 'Snack', 'Skipped meal'],
    events: ['Driving home from work', 'Climbing ladder', 'Using power tools', 'Working in factory', 'Cycling to shop']
  },

  vehicles: {
    'Saloon Car': {
      type: 'Saloon Car',
      capacity: 5,
      hasUHSS: false,
      isEV: false,
      length_m: 4.6
    },
    'Tesla Model 3': {
      type: 'Tesla Model 3',
      capacity: 5,
      hasUHSS: true,
      isEV: true,
      length_m: 4.7
    }
  },

  vehiclePositions: [
    { name: 'Upright on all fours', rotation: 0 },
    { name: 'On roof', rotation: 180 },
    { name: 'Driver’s side', rotation: 90 },
    { name: 'Passenger’s side', rotation: -90 }
  ],

  hazardTemplates: [
    { type: 'Fuel Spill', minR: 35, maxR: 70 },
    { type: 'Fire', minR: 15, maxR: 28 },
    { type: 'Wall', width_m: 4, height_m: 0.5 },
    { type: 'Lamppost' },
    { type: 'Battery Fire', minR: 18, maxR: 28 }
  ],

  casualtyPositions: {
    'Driver': { x: 25, y: -40 },
    'Front Passenger': { x: -25, y: -40 },
    'Rear Offside': { x: 25, y: 40 },
    'Rear Nearside': { x: -25, y: 40 }
  }
};
