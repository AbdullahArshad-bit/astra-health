// Visual QC with Playwright (real Chromium): walks the app's main views
// and saves screenshots. Run: node test/shots.mjs  (needs dist/ served on :4173)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = new URL("./shots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const APP = "http://localhost:4173/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(APP, { waitUntil: "networkidle" });
await page.screenshot({ path: `${OUT}01-login.png` });
console.log("shot 01-login");

await page.getByRole("button", { name: /Medical Team Demo/ }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}02-medical.png` });
console.log("shot 02-medical");

await page.locator(".clickable", { hasText: "Maya Chen" }).first().click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}03-profile-maya.png` });
console.log("shot 03-profile-maya");

await page.getByRole("button", { name: /NASA Radiation/ }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}04-research.png` });
console.log("shot 04-research");

await page.getByRole("button", { name: /ASTRA RADAR/ }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}10-radar.png` });
console.log("shot 10-radar");
await page.screenshot({ path: `${OUT}11-radar-full.png`, fullPage: true });
console.log("shot 11-radar-full");

await page.getByRole("button", { name: /Astronaut/ }).first().click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}05-astronaut.png` });
console.log("shot 05-astronaut");

await page.getByRole("button", { name: /Daily Check-in/ }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}06-checkin.png` });
console.log("shot 06-checkin");

// light theme check (login)
await page.goto(APP, { waitUntil: "networkidle" });
const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mob.goto(APP, { waitUntil: "networkidle" });
await mob.screenshot({ path: `${OUT}07-mobile-login.png` });
console.log("shot 07-mobile-login");
await mob.getByRole("button", { name: /Medical Team Demo/ }).click();
await mob.waitForTimeout(1200);
await mob.screenshot({ path: `${OUT}08-mobile-medical.png` });
console.log("shot 08-mobile-medical");

await browser.close();
console.log("done");
