/** Small stroke icons (24×24, currentColor) — no emoji anywhere in the UI. */
const base = {
  fill: "none", stroke: "currentColor", strokeWidth: 2,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24", width: 15, height: 15, "aria-hidden": true,
};

export const IconHeart = () => (
  <svg {...base}><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6.2a5 5 0 1 1 7.5 6.4Z" /></svg>
);
export const IconMoon = () => (
  <svg {...base}><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></svg>
);
export const IconActivity = () => (
  <svg {...base}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);
export const IconBattery = () => (
  <svg {...base}><rect x="2" y="7" width="17" height="10" rx="2" /><line x1="22" y1="11" x2="22" y2="13" /><line x1="6" y1="11" x2="6" y2="13" /><line x1="10" y1="11" x2="10" y2="13" /></svg>
);
export const IconAlert = () => (
  <svg {...base}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
export const IconCheck = () => (
  <svg {...base}><polyline points="20 6 9 17 4 12" /></svg>
);
export const IconOrbit = () => (
  <svg {...base}><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" /><path d="M1.5 9.5a14.5 14.5 0 0 1 4-3.6" /><path d="M22.5 14.5a14.5 14.5 0 0 1-4 3.6" /></svg>
);
export const IconUser = () => (
  <svg {...base}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
export const IconMedical = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
);
export const IconSun = () => (
  <svg {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const IconReset = () => (
  <svg {...base}><path d="M3 12a9 9 0 1 0 2.6-6.3L3 8" /><polyline points="3 3 3 8 8 8" /></svg>
);
export const IconLogout = () => (
  <svg {...base}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
export const IconArrow = () => (
  <svg {...base}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
export const IconPlus = () => (
  <svg {...base}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
