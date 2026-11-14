import Logo from "../components/Logo";
import { IconUser, IconMedical, IconArrow } from "../components/icons";

export default function Login({ onLogin }: { onLogin: (role: "astronaut" | "medical") => void }) {
  return (
    <div className="login-wrap">
      <div className="glass login-card">
        <div className="eyebrow" style={{ justifyContent: "center", maxWidth: 300, margin: "0 auto" }}>
          NASA Space Apps · 2026
        </div>
        <div className="patch" style={{ marginTop: 22 }}>
          <div className="pulse"><Logo size={72} /></div>
        </div>
        <h1 className="login-title">ASTRA HEALTH</h1>
        <p className="muted" style={{ fontSize: 14.5, maxWidth: 420, margin: "0 auto" }}>
          Crew health monitoring for a 30-day mission aboard the
          International Space Station.
        </p>

        <div className="login-stats">
          <div><div className="n">30</div><div className="l">Mission days</div></div>
          <div><div className="n">03</div><div className="l">Crew members</div></div>
          <div><div className="n">ISS</div><div className="l">Low Earth orbit</div></div>
        </div>

        <div className="login-actions">
          <button className="btn btn-primary login-btn" onClick={() => onLogin("astronaut")}>
            <span className="t" style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <IconUser /> Astronaut Demo <IconArrow />
            </span>
            <span className="s">Your dashboard &amp; daily check-in</span>
          </button>
          <button className="btn login-btn" onClick={() => onLogin("medical")}>
            <span className="t" style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <IconMedical /> Medical Team Demo <IconArrow />
            </span>
            <span className="s">Overview of the whole crew</span>
          </button>
        </div>

        <div className="row" style={{ justifyContent: "center", marginTop: 20 }}>
          <span className="chip demo">Demonstration data</span>
          <span className="chip nasa">Real NASA research data inside</span>
        </div>
        <p className="muted small" style={{ marginTop: 14 }}>
          No password needed — simulated sign-in for the hackathon demo.
          Astronaut records are fictional; the radiation page uses genuine NASA measurements.
        </p>
      </div>
    </div>
  );
}
