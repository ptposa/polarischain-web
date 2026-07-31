/**
 * "How it works" timeline activation: a one-shot IntersectionObserver that,
 * the first time the process-steps sequence enters view, draws the
 * connector line top-to-bottom and staggers each step's activation by
 * 350ms. Ported from the third inline <script> of the source design.
 */

export interface StepTimelineOptions {
  /** Force reduced-motion behaviour (instant activation) regardless of matchMedia — mainly for tests. */
  reducedMotion?: boolean;
}

export function init(steps: HTMLElement, opts: StepTimelineOptions = {}): () => void {
  const items = Array.from(steps.querySelectorAll<HTMLElement>('.process-step'));
  const reduced =
    opts.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  function activate(instant: boolean): void {
    steps.classList.add('is-live');
    items.forEach((el, i) => {
      if (instant) {
        el.classList.add('is-on');
      } else {
        timeouts.push(setTimeout(() => el.classList.add('is-on'), 200 + i * 350));
      }
    });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    activate(true);
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        activate(false);
        io.disconnect();
      }
    },
    { threshold: 0.35 },
  );
  io.observe(steps);

  return () => {
    io.disconnect();
    timeouts.forEach(clearTimeout);
  };
}
