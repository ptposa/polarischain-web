/**
 * "Federated path discovery" artefact.
 *
 * The markup ships the finished scene, so it reads correctly without script
 * and with reduced motion. When the figure scrolls into view the scene is
 * cleared and replayed: each CA is typed in as the discovery reaches it, the
 * admissible path is drawn segment by segment from the certificate up to the
 * relying party's anchor, one candidate is pruned by the threshold, and once
 * the path is selected its dashes start to flow from the anchor down.
 */

type StatusState = 'search' | 'eval' | 'reject' | 'found';

/** Every drawing of the artefact (wide and narrow) runs on its own. */
export function initPathDiscovery(): void {
  document.querySelectorAll<HTMLElement>('[data-pd]').forEach(setup);
}

function setup(root: HTMLElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.querySelector('[data-pd-path]')?.classList.add('is-flowing');
    return;
  }

  const q = <T extends Element>(sel: string): T | null => root.querySelector<T>(sel);
  const statusEl = q<HTMLElement>('[data-pd-status]');
  const statusText = q<HTMLElement>('[data-pd-status-text]');
  const pathG = q<SVGGElement>('[data-pd-path]');
  const probe = q<SVGPathElement>('[data-pd-reject]');
  const segs = Array.from(root.querySelectorAll<SVGPathElement>('[data-seg]'));
  const node = (id: string): SVGGElement | null => q<SVGGElement>(`[data-node="${id}"]`);

  let run = 0; // bumps on every replay so stale timers do nothing
  const wait = (ms: number, id: number): Promise<boolean> =>
    new Promise((resolve) => window.setTimeout(() => resolve(id === run), ms));

  function setStatus(text: string, state: StatusState): void {
    if (statusText) statusText.textContent = text;
    if (statusEl) statusEl.dataset.state = state;
  }

  function clearNode(g: SVGGElement | null): void {
    if (!g) return;
    g.classList.remove('is-in', 'is-hit');
    g.querySelectorAll<SVGElement>('[data-type]').forEach((el) => (el.textContent = ''));
  }

  async function typeNode(id: string, runId: number, perChar = 9): Promise<boolean> {
    const g = node(id);
    if (!g) return true;
    g.classList.add('is-in');
    for (const el of Array.from(g.querySelectorAll<SVGElement>('[data-type]'))) {
      const text = el.dataset.type ?? '';
      el.textContent = '';
      for (const ch of text) {
        el.textContent += ch;
        if (!(await wait(perChar, runId))) return false;
      }
    }
    return true;
  }

  function drawSeg(i: number, ms: number, runId: number): Promise<boolean> {
    const s = segs[i];
    if (!s) return Promise.resolve(true);
    s.style.transition = `stroke-dashoffset ${ms}ms cubic-bezier(.4,0,.2,1)`;
    s.style.strokeDashoffset = '0';
    return wait(ms, runId);
  }

  function reset(): void {
    root!.setAttribute('data-playing', '');
    pathG?.classList.remove('is-flowing');
    segs.forEach((s) => {
      const len = s.dataset.len ?? '0';
      s.style.transition = 'none';
      s.style.strokeDasharray = len;
      s.style.strokeDashoffset = len;
    });
    if (probe) {
      const len = probe.dataset.len ?? '0';
      probe.style.transition = 'none';
      probe.style.strokeDasharray = `${len}`;
      probe.style.strokeDashoffset = len;
      probe.style.opacity = '0';
    }
    root!.querySelectorAll<SVGGElement>('[data-node]').forEach(clearNode);
    setStatus('searching…', 'search');
    void root!.getBoundingClientRect();
  }

  async function play(): Promise<void> {
    const id = ++run;
    reset();
    const step = async (fn: () => Promise<boolean>): Promise<boolean> => id === run && fn();

    if (!(await step(() => typeNode('ee', id, 12)))) return;
    if (!(await wait(300, id))) return;
    setStatus('evaluating Φ and τ…', 'eval');

    if (!(await step(() => drawSeg(0, 650, id)))) return;
    if (!(await step(() => typeNode('issuing', id)))) return;
    if (!(await step(() => drawSeg(1, 600, id)))) return;
    if (!(await step(() => typeNode('intD0', id)))) return;
    if (!(await step(() => typeNode('rootD0', id, 6)))) return;
    if (!(await wait(250, id))) return;

    // A candidate crossing to a classical intermediate: pruned by tau.
    if (probe) {
      probe.style.transition = 'opacity .25s, stroke-dashoffset 700ms cubic-bezier(.4,0,.2,1)';
      probe.style.opacity = '0.9';
      probe.style.strokeDashoffset = '0';
    }
    if (!(await wait(700, id))) return;
    if (!(await step(() => typeNode('intD2', id)))) return;
    node('intD2')?.classList.add('is-hit');
    setStatus('pruned by τ', 'reject');
    if (!(await wait(900, id))) return;
    if (probe) {
      probe.style.transition = 'opacity .6s';
      probe.style.strokeDasharray = '3 4';
      probe.style.strokeDashoffset = '0';
      probe.style.opacity = '0.45';
    }
    setStatus('evaluating Φ and τ…', 'eval');

    if (!(await step(() => drawSeg(2, 800, id)))) return;
    if (!(await step(() => typeNode('intD1', id)))) return;
    if (!(await step(() => drawSeg(3, 850, id)))) return;
    if (!(await step(() => typeNode('intDn', id)))) return;
    if (!(await step(() => drawSeg(4, 650, id)))) return;
    if (!(await step(() => typeNode('rootDn', id)))) return;
    if (!(await wait(250, id))) return;

    segs.forEach((s) => {
      s.style.transition = 'none';
      s.style.strokeDasharray = '';
      s.style.strokeDashoffset = '';
    });
    pathG?.classList.add('is-flowing');
    setStatus('admissible path selected', 'found');
  }

  q<HTMLButtonElement>('[data-pd-replay]')?.addEventListener('click', () => void play());

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void play();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(root);
  } else {
    void play();
  }
}
