/**
 * Single shared requestAnimationFrame loop for every scroll-driven effect on
 * the page (global starfield, halo orb, hero scroll-dive). Each effect
 * registers one callback instead of running its own rAF loop, so there is
 * exactly one writer per animated frame and effects can't drift out of sync
 * with each other.
 */

type FrameCallback = (timestamp: number) => void;

const callbacks = new Set<FrameCallback>();
let rafId: number | null = null;

function tick(timestamp: number): void {
  for (const callback of callbacks) callback(timestamp);
  rafId = requestAnimationFrame(tick);
}

/** Register a per-frame callback. Returns an unregister function. */
export function register(callback: FrameCallback): () => void {
  callbacks.add(callback);
  if (rafId === null) rafId = requestAnimationFrame(tick);

  return () => {
    callbacks.delete(callback);
    if (callbacks.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
