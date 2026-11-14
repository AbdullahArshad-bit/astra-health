// jsdom lacks ResizeObserver, which Recharts' ResponsiveContainer needs.
// Give it a fixed-size stand-in so charts mount in tests.
class ROMock {
  private cb: (entries: unknown[]) => void;
  constructor(cb: (entries: unknown[]) => void) { this.cb = cb; }
  observe() { this.cb([{ contentRect: { width: 640, height: 320 } }]); }
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ROMock;
