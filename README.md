# UKRO High-Fidelity Scenario Simulator (Instructor)

A browser-based simulator to generate high-fidelity UKRO/WRO-style **RTC** and **Trauma** scenarios for training and assessment.
Includes instructor briefing, live simulation with vitals & interventions, hazards, and debrief (exportable to PDF).

## ✨ Features
- Modular codebase (data, scenario generation, drawing, simulation, UI).
- Expanded injury bank with realistic vitals & deterioration.
- Randomised hazards (fuel spill, fire, wall, lamppost, EV battery fire).
- Improved scene drawings (T-junction / offset head-on, rotated vehicles, impact markers).
- Live vitals with **trend arrows** (▲ ▼ ▬) vs last reading.
- EV/UHSS indicators on vehicles.
- Instructor log & timeline; **Export debrief to PDF**.

## 🗂 Structure
```
index.html
js/
  data.js
  scenario.js
  drawing.js
  sim.js
  ui.js
  main.js
```

## 🚀 Run locally
No build step needed—just open `index.html` in a browser.
Or use a tiny local server for CORS safety:

```bash
# Python 3
python3 -m http.server 5173
# then open http://localhost:5173
```

## 🌐 Deploy to GitHub Pages
1. Create a new repo and push these files.
2. In GitHub, go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`, select branch (e.g., `main`), and **root**.
4. Save—your site will be live at `https://<your-user>.github.io/<repo>/`.

## 📄 License
CC BY-NC-SA 4.0 — Attribution, NonCommercial, ShareAlike  
https://creativecommons.org/licenses/by-nc-sa/4.0/