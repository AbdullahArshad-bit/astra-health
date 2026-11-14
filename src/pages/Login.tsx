import Logo from "../components/Logo";

export default function Login({ onLogin }: { onLogin: (role: "astronaut" | "medical") => void }) {
  return (
    <div className="login-wrap">
      <div className="glass login-card">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="pulse"><Logo size={86} /></div>
        </div>
        <h1 style={{ fontSize: 34, margin: "14px 0 4px", letterSpacing: "0.08em" }}>ASTRA HEALTH</h1>
        <p className="muted" style={{ fontSize: 14.5 }}>
          Crew health monitoring for a 30-day ISS mission.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 14 }}>
          <span className="chip demo">Demonstration data</span>
          <span className="chip nasa">Real NASA research data inside</span>
        </div>
        <div className="login-actions">
          <button className="btn btn-primary login-btn" onClick={() => onLogin("astronaut")}>
            <span className="t">🧑‍🚀 Astronaut Demo</span>
            <span className="s">See your dashboard &amp; daily check-in</span>
          </button>
          <button className="btn login-btn" onClick={() => onLogin("medical")}>
            <span className="t">🩺 Medical Team Demo</span>
            <span className="s">Overview of the whole crew</span>
          </button>
        </div>
        <p className="muted small" style={{ marginTop: 20 }}>
          No password needed — this is simulated sign-in for the hackathon demo.
          Astronaut records are fictional; the radiation page uses genuine NASA measurements.
        </p>
      </div>
    </div>
  );
}
