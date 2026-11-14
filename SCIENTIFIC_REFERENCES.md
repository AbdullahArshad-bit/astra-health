# Scientific References — ASTRA HEALTH

## 1. NASA dataset used (real data)

**Dataset:** ISS_DOSANL_TEPC — *"Experiment Data, ISS TEPC (from ASCII DOS.TXT file)"*
**Archive:** NASA CDAWeb (Coordinated Data Analysis Web), Goddard Space Flight Center
**Dataset page:** https://cdaweb.gsfc.nasa.gov/cgi-bin/eval2.cgi?dataset=ISS_DOSANL_TEPC&index=sp_phys
**Data access (CDAS Web Services):** https://cdaweb.gsfc.nasa.gov/WS/cdasr/1/dataviews/sp_phys/datasets/ISS_DOSANL_TEPC/data/
**Principal Investigator:** Edward Semones, NASA Space Radiation Analysis Group, Johnson Space Center
**SPASE resource ID:** spase://NASA/NumericalData/ISS/TEPC/PT10S
**Dataset coverage:** 2010-04-29 to 2018-04-11
**Retrieved for this project:** 2026-11-14

### The instrument

TEPC (Tissue Equivalent Proportional Counter) is a radiation-measuring instrument flown
aboard the International Space Station. It measures the radiation environment **inside**
the station; the dataset's LOCATION variable records where the instrument sits inside
the ISS (in our sample window: "SM P330 PORT", the Service Module). Instrument serial
number 1003 (per the dataset's CDF metadata).

### Variables in the dataset (names and units exactly as in NASA's CDF metadata)

| Variable | Description | Units |
|---|---|---|
| DOSE | Average dose rate | uGy/min |
| DOSE_EQ60 | Average Dose Equivalent Rate (ICRP-60) | uSv/min |
| TIME_INTERVAL | Minutes over which the data was collected | min |
| LONGITUDE | Geographic longitude of the ISS | Deg |
| LATITUDE | Geographic latitude of the ISS | Deg |
| ALTITUDE | Altitude of the ISS | km |
| FLAG | Code for dominant radiation source | code |
| LOCATION | Physical location of the TEPC inside the ISS | code |

### Variable and sample used in the app

- **Variable:** DOSE ("Average dose rate"), **units uGy/min** — verified against the
  CDF metadata returned with the data itself before display.
- **Window:** 2018-01-01T00:00:23Z to 2018-01-04T23:47:22Z (5,748 genuine one-minute records).
- **Cadence:** 1 record per minute (the dataset's TIME_INTERVAL = 1.0 min; each value is
  the average dose rate over that minute).
- **Thinning:** every 30th record kept → **192 points** at 30-minute spacing, shipped in
  `src/data/tepc.json`. Values and timestamps are the original records — nothing was
  averaged, interpolated, rounded or otherwise altered. No fill values (CDF FILLVAL
  −1.0E31) were present in this window.
- **Observed range in the shipped sample:** 0.023 – 9.394 uGy/min (average 0.248 uGy/min).
  Brief spikes in the record are real features of the data (dose rates rise when the
  station's orbit carries it through regions of weaker magnetic shielding, such as the
  South Atlantic Anomaly).

### What this data is — and is not

This dataset measures the **environmental radiation inside/around the ISS**. It is
**not** the personal radiation exposure of any individual astronaut, and no astronaut
in this app is linked to these readings. Personal dose monitoring uses separate
crew-worn instruments that are not part of this dataset.

## 1b. NASA RadLab — ISS radiation telemetry (ASTRA RADAR page)

**Portal:** NASA RadLab, Open Science Data Repository (OSDR) —
https://visualization.osdr.nasa.gov/radlab/
**Data API:** https://visualization.osdr.nasa.gov/radlab/api/ (docs:
https://visualization.osdr.nasa.gov/radlab/gui/data-api/)
**Retrieved for this project:** 2026-11-14. Full retrieval notes: `src/data/RADLAB-NOTES.md`.

RadLab republishes radiation telemetry from instruments aboard the ISS (among other
spacecraft). Its API documents the field **absorbed_dose_rate** ("Absorbed radiation
dose rate") with units **μGy/hour** — note this differs from the CDAWeb TEPC page's
uGy/min; both pages keep their source's own units (1 uGy/min = 60 μGy/hour).

Series used in the app (shipped in `src/data/radlab.json`):

- **DosTel1** (DOSTEL dosimetric telescope, Columbus module), 1 Jan 2018: 904 genuine
  readings at ~100 s cadence, absorbed dose rate 1.423–495.628 μGy/hour over the full
  day; every 4th record shipped (226 points). Brief spikes are real (South Atlantic
  Anomaly passes). `dose_equivalent_rate` was null for this instrument/day in RadLab
  and is not shown.
- **IV-TEPC-NOD2PD3-pre** (Node 2), daily absorbed dose rate: all 64 daily values
  RadLab holds for 2017-08-18 → 2018-02-01, 12.994–17.209 μGy/hour. These daily means
  (≈0.25 uGy/min) cross-check well against the independent CDAWeb TEPC sample in §1.

## 1c. NASA EDA — ISS environmental telemetry (ASTRA RADAR page)

**Portal:** NASA Environmental Data App (EDA), OSDR —
https://visualization.osdr.nasa.gov/eda/
**Data used:** the Rodent Research-1 dashboard payload
(https://visualization.osdr.nasa.gov/eda/dashboard_RR-1), retrieved 2026-11-14.
Full retrieval notes: `src/data/RADLAB-NOTES.md`.

EDA's telemetry table names its columns `Temp_degC_ISS`, `RH_percent_ISS`,
`CO2_ppm_ISS` with `Controller_Time_GMT` timestamps — temperature in °C, relative
humidity in %, CO₂ in ppm. For Rodent Research-1 (SpaceX-4), the app ships the ISS
habitat sensors' readings for 1–3 Oct 2014 (after the mission's "Animal transfer to
ISS" milestone, so all readings are on orbit): 864 genuine 5-minute records, every
6th shipped (144 points, `src/data/eda.json`). Window ranges: temperature
21.8–23.1 °C, RH 42–50 %, CO₂ 2,627–4,131 ppm. These are one experiment habitat's
sensors — genuine NASA measurements, but not a live feed and not a whole-station
cabin average. The matching ground-control series exists in EDA and is not shown.

## 2. Fictional demonstration data (not real data)

The astronaut health records (heart rate, sleep, exercise, fatigue, mood, stress,
loneliness, motivation, pain, condition) are **fictional**, generated by a small
deterministic generator in `src/data/seed.ts` so the demo behaves identically on
every load. They exist only to demonstrate the software. Two patterns are designed
in — a sleep decline for one astronaut and a stress rise for another — so the
unusual-change flags can be seen working.

## 3. Method — unusual-change flags

For each astronaut, the latest record is compared with that astronaut's own average
over all previous days (a simple personal baseline). A flag is raised when:

- sleep falls ≥ 1.5 h below the baseline average, or
- fatigue rises ≥ 3 points above it, or
- resting heart rate changes ≥ 12 bpm from it, or
- stress rises ≥ 3 points above it, or
- exercise falls ≥ 45 min below it.

Every flag is displayed with its reason in plain words. These are **noticing aids
for a human reviewer, not medical judgements** — the app never diagnoses any
condition, and no threshold in the app comes from a clinical guideline.

## 4. Limitations

- The TEPC sample is a 4-day extract; the full dataset spans 2010–2018 and is
  available from NASA CDAWeb for any deeper analysis.
- Dose is shown as dose *rate* (uGy/min), not accumulated dose.
- Demo health data is fictional; flag thresholds are simple demonstration rules,
  not validated clinical criteria.
- This prototype is not a medical device and must not be used for real health decisions.
