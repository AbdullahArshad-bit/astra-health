# Testing Report — ASTRA HEALTH

All tests below were actually executed on 2026-11-14 against the shipped code.
Nothing in this report is fabricated; failures found during testing were fixed
and the tests re-run (noted where that happened).

## 1. Build

| Check | Command | Result |
|---|---|---|
| TypeScript type-check | `tsc -b` (part of `npm run build`) | ✅ Pass, no errors |
| Production build | `npm run build` | ✅ Pass — `dist/` produced (JS ≈ 639 kB, gzip ≈ 187 kB) |
| App serves | `python3 -m http.server` over `dist/` + request | ✅ HTTP 200 |

Known cosmetic warning: Vite reports one chunk larger than 500 kB (Recharts).
It does not affect function; code-splitting was left out deliberately to keep
this one-day MVP simple.

## 2. Logic tests — `npm run test:logic` (tsx, Node) — **22 passed, 0 failed**

- Seed data: exactly 3 astronauts × 20 days; deterministic across runs; every
  record carries all core fields; all values inside sane ranges.
- Flag engine: Maya Chen's designed sleep decline produces a **Sleep** flag and a
  **Fatigue** flag; Samir Khan's stress rise produces a **Stress** flag; Alex Morgan
  (steady) produces none; flags require enough history; every flag message names
  the day and the baseline it was compared with.
- Store: check-ins persist to localStorage; a check-in becomes the astronaut's
  latest record; **empty fields stay empty** (no invented values); re-saving the
  same day replaces rather than duplicates; reset clears check-ins; the day
  filter never returns future days.
- TEPC data: dataset ID is ISS_DOSANL_TEPC; variable is DOSE with units uGy/min;
  192 samples; all values real numbers in a sane range; timestamps parse and
  strictly ascend.

*Failures found and fixed during testing:* the first flag tests failed because
the comparison window included the decline itself (baseline dilution) and one
designed stress value landed exactly under the threshold. The flag engine now
compares against the astronaut's average over **all** previous days (personal
baseline), and the demo data's story beats were made unambiguous. Re-run: 22/22.

## 3. UI walkthrough tests — `npm run test:ui` (Vitest + jsdom + Testing Library) — **8 passed, 0 failed**

Each test drives the real app UI with clicks and form input:

1. App starts on the login page; both demo buttons are present.
2. Astronaut Demo opens the dashboard: KPIs, charts section, history, check-in button.
3. Medical Team Demo shows all three astronauts and the review panel.
4. Medical team can open Maya Chen's profile: flags (incl. the sleep message) and full history render.
5. **Daily check-in saves**, appears in history marked "Your check-in", and is still
   there after a full unmount/remount (simulated browser refresh) — persistence proven.
6. Mission day selector changes the viewed day ("showing records up to mission day 5").
7. NASA research page shows uGy/min units, the dataset ID ISS_DOSANL_TEPC, the
   "not personal exposure" explanation and the measurements table.
8. Reset data removes the saved check-in and restores the demo state.

## 4. Real-browser verification (Playwright + Chromium, production build)

The production build was served over HTTP and driven in a real Chromium browser.
Nine screenshots were captured and **visually inspected**:

| # | View | Result |
|---|---|---|
| 01 | Login (desktop, dark) | ✅ Logo, both demo buttons, data labels, disclaimer |
| 02 | Medical overview (dark) | ✅ 3 crew cards, mini trend charts render, flag chips correct (Maya 2, Samir 1, Alex 0), TEPC summary chart renders with real spikes |
| 03 | Astronaut profile — Maya Chen | ✅ Both flags explained, charts render, full history table |
| 04 | NASA research page | ✅ KPI cards (avg 0.248, peak 9.394 uGy/min), full TEPC chart, source attribution with working CDAWeb link, "is / is not" panel |
| 05 | Astronaut dashboard | ✅ KPI cards, wellbeing chips, heart-rate and sleep trend charts render; sleep drop at days 18–20 clearly visible |
| 06 | Daily check-in form | ✅ All physical + wellbeing fields render; sliders show values |
| 07 | Login on phone viewport (390 × 844) | ✅ Card and buttons stack cleanly |
| 08 | Medical overview on phone viewport | ✅ Cards stack, charts render, nothing overflows |
| 09 | Medical overview in **light mode** | ✅ Fully legible, charts and flags intact |

Screenshots are kept in `test/shots/` and can be regenerated with `npm run shots`
(serve `dist/` on port 4173 first).

## 5. Checklist from the project brief (§11) — verdicts

| Brief item | Verified by | Result |
|---|---|---|
| Application starts | Build + HTTP serve + browser | ✅ |
| Both demo login buttons work | UI test 1–3, browser | ✅ |
| All three astronauts appear | UI test 3, screenshots 02/08 | ✅ |
| Daily check-in saves | UI tests 5, 8 | ✅ |
| Saved records remain after refresh | UI test 5 (remount) | ✅ |
| Charts display | Screenshots 02–05, 08, 09 (real browser) | ✅ |
| Medical team can inspect astronauts | UI test 4, screenshot 03 | ✅ |
| Mission day selector works | UI test 6 | ✅ |
| NASA page shows correct source info | UI test 7, screenshot 04 | ✅ |
| Mobile layout works | Screenshots 07, 08 | ✅ |

## 6. Known limitations

- jsdom cannot rasterise charts, so chart rendering is proven by the
  real-browser screenshots (§4), not by the DOM tests.
- The app loads the Inter/Space Grotesk fonts from Google Fonts; offline it
  falls back to system fonts (layout unaffected).
- Check-ins are always written for the simulated "today" (mission day 21);
  the day selector is for viewing history, per the MVP's scope.
- Demo seed records cover days 1–20; days 22–30 intentionally hold no records
  (the mission is "in progress").
- localStorage is per-browser: check-ins do not sync between devices, and
  private-browsing modes may discard them.
- The TEPC dataset's coverage ends 2018-04-11, so the verified sample window
  is January 2018 — the most recent years of the dataset were used as retrieved.
- Flag thresholds are simple demonstration rules, not clinical criteria.
