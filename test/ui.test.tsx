// UI walkthrough tests — every item on the ASTRA HEALTH prompt's
// testing checklist that can be exercised in a DOM.
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../src/App";

afterEach(() => cleanup());

beforeEach(() => {
  localStorage.clear();
});

describe("ASTRA HEALTH walkthrough", () => {
  it("starts on the login page with both demo buttons", () => {
    render(<App />);
    expect(screen.getByText("ASTRA HEALTH")).toBeTruthy();
    expect(screen.getByText(/Astronaut Demo/)).toBeTruthy();
    expect(screen.getByText(/Medical Team Demo/)).toBeTruthy();
  });

  it("astronaut demo opens a dashboard with KPIs, charts and history", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Astronaut Demo/));
    expect(screen.getAllByText("Alex Morgan").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Heart rate").length).toBeGreaterThan(0);
    expect(screen.getByText("Sleep trend")).toBeTruthy();
    expect(screen.getByText("Recent check-ins")).toBeTruthy();
    expect(screen.getByText(/Daily Check-in/)).toBeTruthy();
  });

  it("all three astronauts appear on the medical overview", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Medical Team Demo/));
    expect(screen.getAllByText("Alex Morgan").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Maya Chen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Samir Khan").length).toBeGreaterThan(0);
    expect(screen.getByText("Unusual changes to review")).toBeTruthy();
  });

  it("medical team can open an astronaut profile with flags and history", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Medical Team Demo/));
    fireEvent.click(screen.getAllByText("Maya Chen")[0]);
    expect(screen.getByText("Full check-in history")).toBeTruthy();
    expect(screen.getByText(/Sleep fell to/)).toBeTruthy();
  });

  it("daily check-in saves, shows in history, and survives a remount (refresh)", () => {
    const first = render(<App />);
    fireEvent.click(screen.getByText(/Astronaut Demo/));
    fireEvent.click(screen.getByText(/Daily Check-in/));
    fireEvent.change(screen.getByLabelText(/Heart rate \(bpm\)/), { target: { value: "91" } });
    fireEvent.change(screen.getByLabelText(/Sleep duration/), { target: { value: "5.5" } });
    fireEvent.click(screen.getByText("Save check-in"));
    expect(screen.getByText("Check-in saved")).toBeTruthy();
    fireEvent.click(screen.getByText("Back to dashboard"));
    expect(screen.getAllByText("Your check-in").length).toBeGreaterThan(0);
    first.unmount();
    // Simulate a browser refresh: brand-new mount, data must come from localStorage.
    render(<App />);
    fireEvent.click(screen.getByText(/Astronaut Demo/));
    expect(screen.getAllByText("Your check-in").length).toBeGreaterThan(0);
    expect(screen.getAllByText("91").length).toBeGreaterThan(0);
  });

  it("mission day selector changes the viewed day", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Medical Team Demo/));
    const slider = document.querySelector("input[type='range']") as HTMLInputElement;
    expect(slider).toBeTruthy();
    fireEvent.change(slider, { target: { value: "5" } });
    expect(screen.getByText(/showing records up to mission day 5/)).toBeTruthy();
  });

  it("NASA research page shows verified source information", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Medical Team Demo/));
    fireEvent.click(screen.getByText(/NASA Radiation/));
    expect(screen.getAllByText(/uGy\/min/).length).toBeGreaterThan(0);
    expect(screen.getByText(/ISS_DOSANL_TEPC/)).toBeTruthy();
    expect(screen.getByText(/personal radiation exposure of any individual astronaut/)).toBeTruthy();
    expect(screen.getByText(/Sample of the measurements/)).toBeTruthy();
  });

  it("reset restores demo data (saved check-in disappears)", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Astronaut Demo/));
    fireEvent.click(screen.getByText(/Daily Check-in/));
    fireEvent.change(screen.getByLabelText(/Heart rate \(bpm\)/), { target: { value: "99" } });
    fireEvent.click(screen.getByText("Save check-in"));
    fireEvent.click(screen.getByText("Back to dashboard"));
    expect(screen.getAllByText("Your check-in").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/Reset data/));
    expect(screen.queryByText("Your check-in")).toBeNull();
  });
});
