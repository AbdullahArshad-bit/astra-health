# ASTRA HEALTH — Astronaut Health Monitoring

A one-day hackathon MVP built for the **NASA Space Apps Challenge 2026** challenge
*"Create Health Monitoring Software for Astronauts on Space Missions"* by **Team A.I.M.**

ASTRA HEALTH follows a fictional three-person crew through a 30-day ISS mission.
Astronauts record a daily health check-in; the medical team watches the whole crew
on one overview, gets simple self-explaining flags when someone's readings change
unusually, and can open any astronaut's full history. A separate research page shows
**genuine NASA radiation measurements** from the ISS TEPC instrument (NASA CDAWeb),
and the **ASTRA RADAR** page shows genuine historical ISS radiation and environment
data from NASA's RadLab and Environmental Data App (EDA), clearly separated from
the fictional crew demo.

> This is a hackathon prototype, **not a real medical device**. Crew health records
> are fictional demonstration data. The radiation pages use real NASA data.
> ASTRA HEALTH is not affiliated with or endorsed by NASA.

## Features

- **Demo login** — two buttons, no password: *Astronaut Demo* and *Medical Team Demo* (simulated sign-in).
- **Astronaut dashboard** — name, ID, role, mission day; heart rate, sleep, exercise and fatigue cards;
  mood / stress / loneliness / motivation / condition / pain summary; heart-rate and sleep trend charts;
  recent check-in history.
- **Daily check-in form** — physical health (heart rate, sleep, exercise, fatigue 1–10, pain, condition)
  and mental wellbeing (mood, stress 1–10, loneliness 1–10, motivation). Saved records persist in the
  browser (localStorage) and appear on both dashboards. Empty fields stay empty — values are never invented.
- **Medical team dashboard** — all three astronauts at a glance with latest readings, sleep/fatigue
  mini-trends, wellbeing summaries and unusual-change flags; click any astronaut for the full profile.
- **Unusual-change flags** — each astronaut is compared with their own average over previous days
  (personal baseline). Every flag explains itself in plain words. Flags never diagnose anything.
- **Mission day selector** — explore the crew's records for any day, 1–30.
- **NASA radiation research page** — verified sample of 192 genuine ISS TEPC dose-rate measurements
  (variable DOSE, uGy/min, January 2018) with KPI cards, a historical chart, a data table and full
  source attribution. A summary chart also appears on the medical dashboard.
- **ASTRA RADAR page** — real space radiation data from NASA RadLab: DosTel1 absorbed dose rate
  (µGy/hour, Columbus module, 1 Jan 2018, 226 charted samples of 904 retrieved), IV-TEPC daily
  dose rates (64 daily values, Aug 2017 – Feb 2018), plus ISS environment telemetry from NASA EDA
  for the Rodent Research-1 habitat (temperature, humidity and CO₂, 1–3 Oct 2014, 144 charted
  samples of 864). Every chart carries its instrument, units, timestamps and source link, and the
  page is explicitly labelled historical — nothing on it is simulated and none of it is live.
- **Reset demo data** button, **light/dark mode**, responsive layout for phone and desktop.
- Original Planet + Heartbeat logo; space-inspired branding without NASA logos.

## The fictional crew

| ID | Name | Role |
|---|---|---|
| AST-001 | Alex Morgan | Mission Commander |
| AST-002 | Maya Chen | Flight Engineer |
| AST-003 | Samir Khan | Medical & Science Officer |

"Today" inside the simulation is **mission day 21**. Fictional demo records exist for days 1–20;
a check-in you submit is saved as the day-21 record. Two gentle story beats are built into the demo
data so the flags have something honest to show: Maya Chen's sleep falls and fatigue rises in the
last days, and Samir Khan's stress rises late in week 3.

## Run the project

You need Node.js 18+ (Node 20+ recommended).

```bash
npm install     # once
npm run dev     # opens the dev server (default http://localhost:5173)
```

Production build:

```bash
npm run build   # type-checks and builds into dist/
npm run preview # serves the production build locally
```

The `dist/` folder can also be hosted on any static web host as-is.

## Demo instructions

1. Open the app — you land on the login page.
2. Click **Astronaut Demo**: pick any of the three demo profiles, look at the trends,
   then press **Daily Check-in**, enter values and save. Your record appears in the
   history marked "Your check-in" and stays after a refresh.
3. Use **Log out**, then click **Medical Team Demo**: the overview shows all three
   astronauts. Maya Chen and Samir Khan carry unusual-change flags — click a card
   to open the profile and read why each flag appeared.
4. Drag the **Mission day** slider in the top bar to view earlier days.
5. Click **NASA Radiation** for the genuine NASA TEPC data page.
6. Click **ASTRA RADAR** for the RadLab radiation charts and EDA station-environment data.
7. **Reset data** clears your saved check-ins and restores the demo state.

## Tests

```bash
npm test   # 34 logic tests (tsx) + 9 UI walkthrough tests (vitest/jsdom)
```

See `TESTING_REPORT.md` for everything that was verified, and
`SCIENTIFIC_REFERENCES.md` for the NASA dataset's source, method, units and limits.

## Tech

React 19 + TypeScript + Vite, Recharts for charts, plain CSS (glassmorphism theme).
No backend — demo persistence is browser localStorage, as specified for this MVP.

## Limitations

- Prototype only: no real authentication, no server, no real medical data.
- Check-ins are stored per-browser; they are not shared between devices.
- The TEPC sample is a small verified extract (Jan 2018) of the full 2010–2018 dataset.
- See `TESTING_REPORT.md` for the full known-limitations list.
