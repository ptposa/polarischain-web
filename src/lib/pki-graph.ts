/**
 * Federated path-discovery animation (ex `pki-graph-hero.html` iframe):
 * typewriter reveal of 8 CA nodes, sequential path-segment draw-ins, a
 * policy-rejection probe, and a final "trust established" pill. Autoplays
 * once via IntersectionObserver, replayable via a button. Ported from
 * `pki-graph-hero.html`'s inline <script>, unchanged in choreography/timing.
 */

export interface PkiGraphOptions {
  /** Force reduced-motion behaviour (instant reveal, no typing) regardless of matchMedia — mainly for tests. */
  reducedMotion?: boolean;
}

interface Point {
  x: number;
  y: number;
}

interface NodeConfig {
  id: string;
  fields: Record<string, string>;
}

const POSITIONS: Record<string, Point> = {
  pcN_ee: { x: 101, y: 133 },
  pcN_issuing: { x: 315, y: 91 },
  pcN_intD0: { x: 304, y: 179 },
  pcN_rootD0: { x: 457, y: 175 },
  pcN_intD1: { x: 220, y: 370 },
  pcN_intD2: { x: 407, y: 395 },
  pcN_intDn: { x: 430, y: 610 },
  pcN_rootDn: { x: 234, y: 637 },
};

const NODE_CONFIG: NodeConfig[] = [
  { id: 'pcN_ee', fields: { pcEELabel: 'End-entity', pcEESub: 'server.c.lab' } },
  {
    id: 'pcN_issuing',
    fields: {
      pcIss_title: 'Issuing CA',
      pcIss_dom: 'D₀',
      pcIss_role: 'End-entity issuance',
      pcIss_alg: 'RSA-2048',
      pcIss_adm: '✓ Admissible under Φ',
    },
  },
  {
    id: 'pcN_intD0',
    fields: {
      pcInt0_title: 'Intermediate CA',
      pcInt0_dom: 'D₀',
      pcInt0_role: 'Subordinate CA',
      pcInt0_alg: 'RSA-4096',
      pcInt0_adm: '✓ Admissible under Φ',
    },
  },
  {
    id: 'pcN_rootD0',
    fields: {
      pcRoot0_title: 'Root CA',
      pcRoot0_dom: 'D₀',
      pcRoot0_role: 'Internal trust root',
      pcRoot0_alg: 'RSA-4096',
      pcRoot0_adm: '✓ Admissible under Φ',
    },
  },
  {
    id: 'pcN_intD1',
    fields: {
      pcInt1_title: 'Intermediate CA',
      pcInt1_dom: 'D₁',
      pcInt1_role: 'Federated transit',
      pcInt1_alg: 'ECDSA P-384 + ML-DSA-65',
      pcInt1_adm: '✓ Admissible under Φ',
    },
  },
  {
    id: 'pcN_intD2',
    fields: {
      pcInt2_title: 'Intermediate CA',
      pcInt2_dom: 'D₂',
      pcInt2_role: 'Federated transit',
      pcInt2_alg: 'RSA-2048',
    },
  },
  {
    id: 'pcN_intDn',
    fields: {
      pcIntn_title: 'Intermediate CA',
      pcIntn_dom: 'Dₙ',
      pcIntn_role: 'Subordinate CA',
      pcIntn_alg: 'ML-DSA-65',
      pcIntn_adm: '✓ Admissible under Φ',
    },
  },
  {
    id: 'pcN_rootDn',
    fields: {
      pcRootn_title: 'Root CA',
      pcRootn_dom: 'Dₙ',
      pcRootn_role: 'Internal trust root',
      pcRootn_alg: 'ML-DSA-87',
      pcRootn_adm: '✓ Admissible under Φ',
    },
  },
];

const VALID_PATH_EDGES: { from: string; to: string; stroke?: string; strokeGradient?: string }[] = [
  { from: 'pcN_ee', to: 'pcN_issuing', stroke: '#7AB3E8' },
  { from: 'pcN_issuing', to: 'pcN_intD0', stroke: '#7AB3E8' },
  { from: 'pcN_intD0', to: 'pcN_rootD0', stroke: '#7AB3E8' },
  { from: 'pcN_rootD0', to: 'pcN_intD1', strokeGradient: 'pcGradBlueGray' },
  { from: 'pcN_intD1', to: 'pcN_intDn', strokeGradient: 'pcGradGrayGold' },
  { from: 'pcN_intDn', to: 'pcN_rootDn', stroke: '#E8C96A' },
];

const LATENT_EDGES: [string, string][] = [
  ['pcN_ee', 'pcN_issuing'],
  ['pcN_issuing', 'pcN_intD0'],
  ['pcN_intD0', 'pcN_rootD0'],
  ['pcN_rootD0', 'pcN_intD1'],
  ['pcN_intD1', 'pcN_intD2'],
  ['pcN_intD1', 'pcN_intDn'],
  ['pcN_intDn', 'pcN_rootDn'],
];

const REJECT_EDGE = { from: 'pcN_intD1', to: 'pcN_intD2' };
const SVG_NS = 'http://www.w3.org/2000/svg';

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function init(root: HTMLElement, opts: PkiGraphOptions = {}): () => void {
  const reduce =
    opts.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = <T extends Element = HTMLElement>(id: string): T | null =>
    root.querySelector<T>(`#${id}`);

  Object.entries(POSITIONS).forEach(([id, p]) => {
    $(id)?.setAttribute('transform', `translate(${p.x}, ${p.y})`);
  });

  const latentG = $('pcEdgesLatent');
  LATENT_EDGES.forEach(([f, t]) => {
    const a = POSITIONS[f]!;
    const b = POSITIONS[t]!;
    const ln = document.createElementNS(SVG_NS, 'line');
    ln.setAttribute('x1', String(a.x));
    ln.setAttribute('y1', String(a.y));
    ln.setAttribute('x2', String(b.x));
    ln.setAttribute('y2', String(b.y));
    latentG?.appendChild(ln);
  });

  function setGradientCoords(gradId: string, fromId: string, toId: string): void {
    const a = POSITIONS[fromId]!;
    const b = POSITIONS[toId]!;
    const g = $(gradId);
    g?.setAttribute('x1', String(a.x));
    g?.setAttribute('y1', String(a.y));
    g?.setAttribute('x2', String(b.x));
    g?.setAttribute('y2', String(b.y));
  }
  setGradientCoords('pcGradBlueGray', 'pcN_rootD0', 'pcN_intD1');
  setGradientCoords('pcGradGrayGold', 'pcN_intD1', 'pcN_intDn');

  const pathG = $('pcPath');
  const segLens: number[] = [];
  VALID_PATH_EDGES.forEach((e, i) => {
    const a = POSITIONS[e.from]!;
    const b = POSITIONS[e.to]!;
    const len = dist(a, b);
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('id', `pcSeg${i + 1}`);
    p.setAttribute('d', `M${a.x} ${a.y} L${b.x} ${b.y}`);
    p.setAttribute('stroke', e.strokeGradient ? `url(#${e.strokeGradient})` : (e.stroke ?? '#fff'));
    p.setAttribute('stroke-dasharray', String(len));
    p.setAttribute('stroke-dashoffset', String(len));
    segLens.push(len);
    pathG?.appendChild(p);
  });

  const rejProbe = $<SVGPathElement>('pcRejProbe');
  const ra = POSITIONS[REJECT_EDGE.from]!;
  const rb = POSITIONS[REJECT_EDGE.to]!;
  const rejLen = dist(ra, rb);
  rejProbe?.setAttribute('d', `M${ra.x} ${ra.y} L${rb.x} ${rb.y}`);
  rejProbe?.setAttribute('stroke-dasharray', '4 4');
  if (rejProbe) rejProbe.style.strokeDashoffset = String(rejLen);

  const trustPill = $('pcTrustPill');
  const status = $('pcStatus');
  const statusText = $('pcStatusText');
  const rejMark = $('pcRejectMark');
  const replayBtn = $('pcReplay');
  const svgEl = $('pcSvg');

  let cancelled = false;
  const pending = new Set<ReturnType<typeof setTimeout>>();
  function after(fn: () => void, ms: number): void {
    const id = setTimeout(() => {
      pending.delete(id);
      if (!cancelled) fn();
    }, ms);
    pending.add(id);
  }

  function setStatus(text: string, klass?: 's-eval' | 's-rej' | 's-found'): void {
    if (statusText) statusText.textContent = text;
    status?.classList.remove('s-eval', 's-rej', 's-found');
    if (klass) status?.classList.add(klass);
  }

  function typeInto(elId: string, text: string, perChar: number): Promise<void> {
    return new Promise((resolve) => {
      const el = $(elId);
      if (!el) {
        resolve();
        return;
      }
      el.textContent = '';
      if (reduce) {
        el.textContent = text;
        resolve();
        return;
      }
      let i = 0;
      const step = (): void => {
        if (cancelled || i >= text.length) {
          resolve();
          return;
        }
        el.textContent += text[i++];
        after(step, perChar);
      };
      step();
    });
  }

  async function typeNode(node: NodeConfig, perChar = 7): Promise<void> {
    $(node.id)?.classList.add('in');
    for (const [id, text] of Object.entries(node.fields)) {
      await typeInto(id, text, perChar);
    }
  }

  function clearNode(node: NodeConfig): void {
    Object.keys(node.fields).forEach((id) => {
      const el = $(id);
      if (el) el.textContent = '';
    });
    $(node.id)?.classList.remove('in');
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => after(resolve, ms));
  }

  function animateSeg(idx: number, durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      const s = $<SVGPathElement>(`pcSeg${idx + 1}`);
      if (!s) {
        resolve();
        return;
      }
      s.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(.4,0,.2,1)`;
      s.style.strokeDashoffset = '0';
      after(resolve, durationMs);
    });
  }

  function reset(): void {
    root.querySelectorAll<SVGPathElement>('#pcPath path').forEach((s, i) => {
      s.style.transition = 'none';
      s.style.strokeDashoffset = String(segLens[i] ?? 0);
    });
    if (trustPill) {
      trustPill.style.transition = 'none';
      trustPill.style.opacity = '0';
    }
    if (rejProbe) {
      rejProbe.style.transition = 'none';
      rejProbe.style.opacity = '0';
      rejProbe.style.strokeDashoffset = String(rejLen);
    }
    if (rejMark) {
      rejMark.style.transition = 'none';
      rejMark.style.opacity = '0';
    }
    NODE_CONFIG.forEach(clearNode);
    const rejAdm = $('pcInt2_adm');
    if (rejAdm) {
      rejAdm.textContent = '';
      rejAdm.setAttribute('fill', 'var(--color-text-danger)');
    }
    setStatus('searching…');
    void document.body.offsetHeight;
  }

  async function play(): Promise<void> {
    cancelled = false;
    reset();

    if (reduce) {
      NODE_CONFIG.forEach((n) => {
        $(n.id)?.classList.add('in');
        Object.entries(n.fields).forEach(([id, t]) => {
          const el = $(id);
          if (el) el.textContent = t;
        });
      });
      root.querySelectorAll<SVGPathElement>('#pcPath path').forEach((s) => {
        s.style.strokeDashoffset = '0';
      });
      if (trustPill) trustPill.style.opacity = '1';
      setStatus('trust established', 's-found');
      return;
    }

    await typeNode(NODE_CONFIG[0]!, 10);
    await sleep(350);
    setStatus('evaluating Φ…', 's-eval');

    await animateSeg(0, 700);
    await typeNode(NODE_CONFIG[1]!, 7);
    await sleep(180);

    await animateSeg(1, 850);
    await typeNode(NODE_CONFIG[2]!, 7);
    await sleep(180);

    await animateSeg(2, 700);
    await typeNode(NODE_CONFIG[3]!, 7);
    await sleep(180);

    await animateSeg(3, 800);
    await typeNode(NODE_CONFIG[4]!, 7);
    await sleep(280);

    if (rejProbe) {
      rejProbe.style.transition = 'opacity .3s, stroke-dashoffset 750ms cubic-bezier(.4,0,.2,1)';
      rejProbe.style.opacity = '0.85';
      rejProbe.style.strokeDashoffset = '0';
    }
    await sleep(380);
    await typeNode(NODE_CONFIG[5]!, 7);
    await sleep(280);

    setStatus('Φ rejects', 's-rej');
    if (rejMark) {
      rejMark.style.transition = 'opacity .35s';
      rejMark.style.opacity = '1';
    }
    await typeInto('pcInt2_adm', '✕ Rejected by Φ · policy', 8);
    await sleep(700);

    if (rejProbe) {
      rejProbe.style.transition = 'opacity .6s';
      rejProbe.style.opacity = '0.22';
    }
    await sleep(350);

    setStatus('evaluating Φ…', 's-eval');
    await animateSeg(4, 900);
    await typeNode(NODE_CONFIG[6]!, 7);
    await sleep(180);

    await animateSeg(5, 750);
    await typeNode(NODE_CONFIG[7]!, 7);
    await sleep(220);

    if (trustPill) {
      trustPill.style.transition = 'opacity .5s ease-out';
      trustPill.style.opacity = '1';
    }
    setStatus('trust established', 's-found');
  }

  const onReplayClick = (): void => {
    void play();
  };
  replayBtn?.addEventListener('click', onReplayClick);

  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window && svgEl) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            void play();
            io?.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(svgEl);
  } else {
    void play();
  }

  return () => {
    cancelled = true;
    pending.forEach(clearTimeout);
    pending.clear();
    replayBtn?.removeEventListener('click', onReplayClick);
    io?.disconnect();
  };
}
