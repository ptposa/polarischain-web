/**
 * Provisional colour palette switch in the header: "0" is the current
 * palette, "1" to "3" are softer alternatives defined in global.css. The
 * choice is kept in this browser only; storage may be unavailable, and the
 * page works the same without it.
 */
export function initPaletteSwitch(): void {
  const group = document.querySelector<HTMLElement>('[data-palette-switch]');
  if (!group) return;
  const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('[data-palette-choice]'));

  const apply = (choice: string): void => {
    if (choice === '0') delete document.documentElement.dataset.palette;
    else document.documentElement.dataset.palette = choice;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.paletteChoice === choice)));
  };

  apply(document.documentElement.dataset.palette ?? '0');

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      const choice = b.dataset.paletteChoice ?? '0';
      apply(choice);
      try {
        localStorage.setItem('pc-palette', choice);
      } catch {
        /* storage unavailable: the choice lasts for this page view */
      }
    }),
  );
}
