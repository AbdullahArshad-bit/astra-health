import { useEffect, useMemo, useState } from "react";
import Logo from "./components/Logo";
import Login from "./pages/Login";
import AstronautDashboard from "./pages/AstronautDashboard";
import CheckInForm from "./pages/CheckInForm";
import MedicalDashboard from "./pages/MedicalDashboard";
import AstronautProfile from "./pages/AstronautProfile";
import Research from "./pages/Research";
import { ASTRONAUTS, CURRENT_DAY, MISSION_DAYS, type HealthRecord } from "./types";
import { allRecords, loadCheckIns, resetDemoData, saveCheckIn } from "./data/store";

type View = "login" | "astronaut" | "checkin" | "medical" | "profile" | "research";

export default function App() {
  const [view, setView] = useState<View>("login");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [astronautId, setAstronautId] = useState(ASTRONAUTS[0].id);
  const [day, setDay] = useState(CURRENT_DAY);
  const [checkIns, setCheckIns] = useState<HealthRecord[]>(() => loadCheckIns());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const records = useMemo(() => allRecords(checkIns), [checkIns]);

  const handleLogin = (role: "astronaut" | "medical") =>
    setView(role === "astronaut" ? "astronaut" : "medical");

  const handleSaveCheckIn = (rec: HealthRecord) => setCheckIns(saveCheckIn(rec));

  const handleReset = () => {
    resetDemoData();
    setCheckIns([]);
    setDay(CURRENT_DAY);
  };

  if (view === "login") {
    return (
      <div className="stars">
        <div className="shell">
          <Login onLogin={handleLogin} />
          <p className="footer-note">
            ASTRA HEALTH is a hackathon prototype built for the NASA Space Apps Challenge 2026.
            It is not a real medical device. Astronaut data is fictional demonstration data;
            the radiation page shows genuine NASA measurements. Not affiliated with or endorsed by NASA.
          </p>
        </div>
      </div>
    );
  }

  const navBtn = (v: View, label: string) => (
    <button
      className={view === v || (v === "medical" && view === "profile") || (v === "astronaut" && view === "checkin") ? "active" : ""}
      onClick={() => setView(v)}
    >
      {label}
    </button>
  );

  return (
    <div className="stars">
      <div className="shell">
        <header className="glass topbar">
          <div className="brand" onClick={() => setView("medical")}>
            <Logo size={38} />
            <div>
              <div className="brand-name">ASTRA HEALTH</div>
              <div className="brand-sub">ISS Crew Health · Demo</div>
            </div>
          </div>

          <div className="day-selector">
            <span className="small muted">Mission day</span>
            <input type="range" min={1} max={MISSION_DAYS} value={day} onChange={(e) => setDay(Number(e.target.value))} />
            <b style={{ minWidth: 58 }}>Day {day}{day === CURRENT_DAY ? " · today" : ""}</b>
          </div>

          <nav className="nav">
            {navBtn("astronaut", "🧑‍🚀 Astronaut")}
            {navBtn("medical", "🩺 Medical Team")}
            {navBtn("research", "☢ NASA Radiation")}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle light / dark">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button onClick={handleReset} title="Clear saved check-ins and restore demo data">↺ Reset data</button>
            <button onClick={() => setView("login")}>Log out</button>
          </nav>
        </header>

        <main>
          {view === "astronaut" && (
            <AstronautDashboard
              records={records} astronautId={astronautId} day={day}
              onSelectAstronaut={setAstronautId} onCheckIn={() => setView("checkin")}
            />
          )}
          {view === "checkin" && (
            <CheckInForm
              astronautId={astronautId}
              onSave={handleSaveCheckIn}
              onCancel={() => setView("astronaut")}
            />
          )}
          {view === "medical" && (
            <MedicalDashboard
              records={records} day={day}
              onOpenProfile={(id) => { setAstronautId(id); setView("profile"); }}
              onOpenResearch={() => setView("research")}
            />
          )}
          {view === "profile" && (
            <AstronautProfile
              records={records} astronautId={astronautId} day={day}
              onBack={() => setView("medical")}
            />
          )}
          {view === "research" && <Research />}
        </main>

        <p className="footer-note">
          ASTRA HEALTH — NASA Space Apps Challenge 2026 prototype · Not a medical device ·
          Crew records are fictional demonstration data · Radiation data: NASA CDAWeb, ISS TEPC dataset ·
          Saved check-ins live only in this browser (localStorage).
        </p>
      </div>
    </div>
  );
}
