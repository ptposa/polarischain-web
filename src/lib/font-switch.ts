/**
 * Body typeface switch in the header: "mono" (the default, RFC-like face) or
 * "sans" (the face of the previous site). The choice is kept in this browser
 * only; storage may be unavailable, and the page works the same without it.
 */
export function initFontSwitch(): void {
  const group = document.querySelector<HTMLElement>('[data-font-switch]');
  if (!group) return;
  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-font-choice]'));

  const apply = (choice: string): void => {
    if (choice === 'sans') document.documentElement.dataset.font = 'sans';
    else delete document.documentElement.dataset.font;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.fontChoice === choice)));
  };

  apply(document.documentElement.dataset.font === 'sans' ? 'sans' : 'mono');

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const choice = b.dataset.fontChoice ?? 'mono';
      apply(choice);
      try {
        localStorage.setItem('pc-font', choice);
      } catch {
        /* storage unavailable: the choice lasts for this page view */
      }
    }),
  );
}
