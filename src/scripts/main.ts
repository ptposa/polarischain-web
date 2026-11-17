/**
 * Single client entry for the page. Each module looks for its own markup and
 * does nothing when it is absent.
 */
import { initDive } from '../lib/dive';
import { initPathDiscovery } from '../lib/path-discovery';
import { initFederationWheel } from '../lib/federation-wheel';

initFederationWheel();
initDive();

/**
 * Formulas and symbols are written as plain text; a variable is a single
 * letter (or the anchor names TP, tp) and is set in italic, while names of
 * functions (src, life, Sel) stay upright. Values in <code> are left alone.
 */
function italiciseVariables(): void {
  const re = /(?<![A-Za-z\u0370-\u03ff])(TP|tp|[A-Za-z]|[\u03b1-\u03c9\u2113])(?![A-Za-z\u0370-\u03ff])/g;
  document.querySelectorAll<HTMLElement>('.eq__body, .m, .math').forEach((box) => {
    const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = (n as Text).parentElement;
      if (p && !p.closest('code, i')) nodes.push(n as Text);
    }
    for (const t of nodes) {
      if (!re.test(t.data)) continue;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let last = 0;
      for (const m of t.data.matchAll(re)) {
        frag.append(t.data.slice(last, m.index));
        const i = document.createElement('i');
        i.textContent = m[0];
        frag.append(i);
        last = (m.index ?? 0) + m[0].length;
      }
      frag.append(t.data.slice(last));
      t.replaceWith(frag);
    }
  });
}
italiciseVariables();
initPathDiscovery();

/**
 * Margin notes are pinned beside their paragraph on wide screens. A note
 * taller than its paragraph would run into whatever follows, so the
 * paragraph is given at least the height of its note.
 */
function fitMarginNotes(): void {
  document.querySelectorAll<HTMLElement>('.sn').forEach((note) => {
    const host = note.parentElement;
    if (!host) return;
    const pinned = getComputedStyle(note).position === 'absolute';
    host.style.minHeight = pinned ? `${note.offsetHeight + 10}px` : '';
  });
}
fitMarginNotes();
window.addEventListener('resize', fitMarginNotes);
void document.fonts?.ready.then(fitMarginNotes);
