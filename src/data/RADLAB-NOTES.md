# RadLab + EDA datasets — verification notes (ASTRA RADAR page)

Retrieved 2026-11-14 from NASA's Open Science Data Repository (OSDR) visualization
services. Everything below was read directly from the RadLab Data API documentation,
the API responses themselves, or the EDA dashboard payload during this retrieval —
nothing is inferred or invented. Where a value is described, it was computed from the
retrieved records by the data-prep script.

## Source 1 — NASA RadLab (radiation)

- **Portal:** https://visualization.osdr.nasa.gov/radlab/ (redirects to /radlab/gui/overview/)
- **Data API:** GET https://visualization.osdr.nasa.gov/radlab/api/ — documented at
  https://visualization.osdr.nasa.gov/radlab/gui/data-api/
- RadLab is OSDR's portal for radiation telemetry from multiple space agencies'
  instruments, including instruments aboard the ISS. Per NASA's own release notes,
  the ISS RAD / REM / TEPC series in RadLab were "curated from SRAG data by NASA and
  LBNL collaborators", and the DosTel series comes from the DORELI project (ASI).
- API field table (from the official Data API page — names and units exactly as
  documented there):

  | Field | Description (per API docs) | Unit (per API docs) |
  |---|---|---|
  | timestamp | Timestamp of recorded value(s), ISO format | — |
  | instrument_id | Specific instrument/detector ID (case-sensitive, always returned) | — |
  | absorbed_dose_rate | Absorbed radiation dose rate | μGy/hour |
  | dose_equivalent_rate | Dose equivalent rate | μSv/hour |
  | flux | Particle flux | cm-2sr-1s-1 |
  | latitude / longitude / altitude | ISS position where tracked | deg / deg / km |

- Note on units: RadLab expresses absorbed dose rate in **μGy/hour**. This is a
  different (but equivalent-scale) unit from the CDAWeb TEPC page's uGy/min —
  1 uGy/min = 60 μGy/hour. The two pages deliberately keep each source's own units,
  exactly as published, and say so.

### Series A — DosTel1, one day at native cadence (hero chart)

- **Query (exactly as sent, URL-encoded in the request):**
  `https://visualization.osdr.nasa.gov/radlab/api/?spacecraft=ISS&instrument_id=DosTel1&timestamp>=2018-01-01T00:00&timestamp<2018-01-02T00:00&absorbed_dose_rate&flux&format=json`
- Response: 904 records, columns [timestamp, instrument_id, absorbed_dose_rate, flux,
  spacecraft], spanning 2018-01-01T00:01:18 to 2018-01-01T23:59:16 (timestamps as
  returned, no timezone suffix — RadLab presents them as UTC).
- Cadence as recorded: mostly ~100 s between readings (904 readings in 24 h).
- Absorbed dose rate over the full day: min 1.423, max 495.628, mean ≈ 27.16 μGy/hour.
  The brief high spikes are real features of the record (passes through regions of
  weaker magnetic shielding, e.g. the South Atlantic Anomaly).
- The same response also carried `flux` (0.0951–11.7622 cm-2sr-1s-1) for every record;
  `dose_equivalent_rate` was requested in an earlier probe and came back null for all
  904 DosTel1 records that day, so it is not charted.
- DosTel1 is one of the two DosTel (DOSTEL dosimetric telescope) detectors; RadLab's
  overview lists "ISS · Columbus · DosTel · DosTel1", i.e. it sits in the Columbus
  module.
- **Thinning for the app:** every 4th record kept → 226 points in `radlab.json`
  (shipped-sample range 1.423–484.605 μGy/hour — thinning skipped the single highest
  record; the KPIs on the page are computed over the shipped sample, like the
  CDAWeb TEPC page). Values/timestamps unmodified.

### Series B — IV-TEPC daily values, Aug 2017 – Feb 2018 (second chart)

- **Query:**
  `https://visualization.osdr.nasa.gov/radlab/api/?spacecraft=ISS&instrument_id=IV-TEPC-NOD2PD3-pre&timestamp>=2017-01-01T00:00&timestamp<2018-06-01T00:00&absorbed_dose_rate&format=json`
- Response: all 64 daily values RadLab holds for this instrument in the window,
  2017-08-18T00:00:00 to 2018-02-01T00:00:00, one value per day (64 values over that
  span — RadLab holds most, not literally every, day). Range 12.994–17.209 μGy/hour,
  mean ≈ 15.13 μGy/hour. No thinning — all 64 are shipped.
- A wider probe (2017-01-01 → 2020-01-01, `instrument=TEPC`) returned 127 daily values
  across five TEPC instrument IDs (IV-TEPC-COL1A2-pre, IV-TEPC-NOD2DCQ-pre,
  IV-TEPC-NOD2PCQ-pre, IV-TEPC-NOD2PD3-pre, TEPC-SMP330-pre). The app charts only the
  single longest run (NOD2PD3, Node 2) so the series is one instrument, not a mix.
- Cross-check: RadLab's IV-TEPC daily means (~15 μGy/hour ≈ 0.25 uGy/min) sit right
  on the CDAWeb TEPC sample's average (0.248 uGy/min) — the two independent NASA
  sources agree, which is a good sign both are being read correctly.

## Source 2 — NASA EDA (ISS environmental telemetry)

- **Portal:** https://visualization.osdr.nasa.gov/eda/ — the Environmental Data App
  visualizes ISS cabin / habitat environmental telemetry (temperature, relative
  humidity, CO₂) and radiation for OSDR missions, alongside matching ground-control
  units.
- EDA has no public JSON API like RadLab's; each mission dashboard is served as an
  HTML fragment at `https://visualization.osdr.nasa.gov/eda/dashboard_<MISSION>`
  with the data embedded as JSON in a `<script id="data" type="application/json">`
  element. That is the payload EDA's own front-end parses, and it is what was read
  here (retrieved 2026-11-14, HTTP 200, ~707 KB fragment for RR-1).
- **Mission used:** Rodent Research-1 — EDA's own `mission_title` is
  "Rodent Research 1 (SpaceX-4)". Telemetry keys in the payload: `time`,
  `temperature_ground`, `temperature_iss`, `rh_ground`, `rh_iss`, `co2_ground`,
  `co2_iss`, `milestones`. The matching EDA data-table column headers name the units:
  `Controller_Time_GMT`, `Temp_degC_ISS`, `RH_percent_ISS`, `CO2_ppm_ISS` — so:
  temperature in °C, relative humidity in %, CO₂ in ppm, timestamps GMT.
- Full RR-1 telemetry: 12,087 records at 5-minute cadence from 2014-09-20.
  Milestones in the same payload: Launch 2014-09-21 09:49, "Animal transfer to ISS"
  2014-09-25 16:05 — the first days include launch/transfer, so the app does **not**
  use them.
- **Window shipped:** 2014-10-01T00:00:00 to 2014-10-03T23:56:00 GMT — entirely after
  the transfer-to-ISS milestone, i.e. recorded on orbit. 864 records, **zero nulls**
  in the three ISS series. Full-window ranges: temperature 21.8–23.1 °C (mean 22.44),
  RH 42–50 % (mean 44.14), CO₂ 2,627–4,131 ppm (mean ≈ 3,342).
- **Thinning for the app:** every 6th record kept → 144 points at 30-minute spacing
  in `eda.json`. Only the `*_iss` series are shipped; the ground-control series are
  not shown (the page is about the station), and the page text says the sensors are
  the RR-1 habitat hardware's, not whole-station life-support sensors.
- Honest scope note: these are the rodent habitat's environmental sensors flown for
  Rodent Research-1, presented by EDA as ISS environmental telemetry for that
  mission. They are genuine NASA measurements, but they are **not** a live feed and
  not a whole-ISS cabin average.

## Access notes

- During retrieval the RadLab/EDA web front-ends intermittently returned
  504 Gateway Time-out on first contact and then loaded normally; the RadLab API
  itself answered every query (HTTP 200) once reached. All numbers above come from
  successful, complete responses — no partial response was used.
- No live integration is attempted by the app (it is a static site); the page links
  out to RadLab and EDA for anyone who wants the live portals.
