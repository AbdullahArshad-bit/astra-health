/** Original ASTRA HEALTH logo: a planet ringed by an orbit,
 *  with a heartbeat (ECG) line across it. No NASA imagery. */
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="ASTRA HEALTH logo">
      <defs>
        <linearGradient id="ah-planet" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="ah-ring" x1="0" y1="0" x2="64" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="17" fill="url(#ah-planet)" opacity="0.92" />
      <circle cx="25" cy="25" r="4.5" fill="#bae6fd" opacity="0.5" />
      <circle cx="39" cy="38" r="3" fill="#bae6fd" opacity="0.4" />
      <ellipse cx="32" cy="32" rx="29" ry="10.5" transform="rotate(-18 32 32)" stroke="url(#ah-ring)" strokeWidth="2.4" fill="none" opacity="0.9" />
      <polyline
        className="ecg-line"
        points="10,34 22,34 27,26 33,42 38,34 54,34"
        stroke="#f0abfc"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="52" cy="14" r="1.8" fill="#e0f2fe" />
      <circle cx="10" cy="12" r="1.3" fill="#e0f2fe" opacity="0.8" />
    </svg>
  );
}
