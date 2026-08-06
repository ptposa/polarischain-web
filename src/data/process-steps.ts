import { z } from 'zod';

/**
 * The 4-step "How it works" timeline. `icon` is the literal inner markup of
 * each step's 40x40 viewBox SVG (rendered with `set:html`) - every path/circle
 * carries `pathLength="1"` so `lib/step-timeline.ts` can draw them in with a
 * dashoffset animation on activation. The glyphs are bare: no circle, tile or
 * opaque backing, so the strip reads flat like a plate of figures.
 */
const stepSchema = z.object({
  num: z.string(),
  title: z.string(),
  desc: z.string(),
  icon: z.string(),
  strokeWidth: z.number(),
  isAnchor: z.boolean(),
});

export type ProcessStep = z.infer<typeof stepSchema>;

const stepsSchema = z.array(stepSchema);

export const processSteps: ProcessStep[] = stepsSchema.parse([
  {
    num: '01',
    title: 'Input certificate',
    desc: 'Certificate request enters the federated validation model.',
    strokeWidth: 1.9,
    isAnchor: false,
    // Certificate sheet with a seal and ribbons
    icon: `
      <path class="icd" d="M7 6 H27 A2 2 0 0 1 29 8 V24" pathLength="1"></path>
      <path class="icd" d="M29 24 V32 A2 2 0 0 1 27 34 H7 A2 2 0 0 1 5 32 V8 A2 2 0 0 1 7 6" pathLength="1"></path>
      <path class="icd dim" d="M10 13 H22 M10 19 H22 M10 25 H17" pathLength="1"></path>
      <circle class="icd" cx="29" cy="26" r="6.4" pathLength="1"></circle>
      <path class="icd" d="M26 31.6 L26 37 L29 35.2 L32 37 L32 31.6" pathLength="1"></path>
    `,
  },
  {
    num: '02',
    title: 'Graph traversal',
    desc: 'Candidate paths are explored over a weighted trust graph.',
    strokeWidth: 1.9,
    isAnchor: false,
    // Root node fanning out into three branches towards the explored frontier
    icon: `
      <path class="icd dim" d="M11 20 L24 9 M11 20 L24 20 M11 20 L24 31" pathLength="1"></path>
      <path class="icd dim" d="M24 9 L33 15 M24 20 L33 15 M24 31 L33 26" pathLength="1"></path>
      <circle class="icd" cx="8" cy="20" r="3.4" pathLength="1"></circle>
      <circle class="icd" cx="26" cy="8" r="2.8" pathLength="1"></circle>
      <circle class="icd" cx="26" cy="20" r="2.8" pathLength="1"></circle>
      <circle class="icd" cx="26" cy="32" r="2.8" pathLength="1"></circle>
      <circle class="icd dim" cx="35" cy="14" r="2.4" pathLength="1"></circle>
      <circle class="icd dim" cx="35" cy="27" r="2.4" pathLength="1"></circle>
    `,
  },
  {
    num: '03',
    title: 'Path scoring',
    desc: 'Paths are evaluated based on cryptographic strength, policy compatibility, and structural cost.',
    strokeWidth: 1.9,
    isAnchor: false,
    // Two-pan balance, tipped
    icon: `
      <path class="icd" d="M20 7 V29" pathLength="1"></path>
      <path class="icd" d="M6 13 H34" pathLength="1"></path>
      <circle class="icd" cx="20" cy="6" r="2.4" pathLength="1"></circle>
      <path class="icd" d="M14 34 H26" pathLength="1"></path>
      <path class="icd dim" d="M16 34 L20 29 L24 34" pathLength="1"></path>
      <path class="icd" d="M3 17 A6.5 6.5 0 0 0 15 17 Z" pathLength="1"></path>
      <path class="icd dim" d="M9 13 V17" pathLength="1"></path>
      <path class="icd" d="M25 22 A6.5 6.5 0 0 0 37 22 Z" pathLength="1"></path>
      <path class="icd dim" d="M31 13 V22" pathLength="1"></path>
    `,
  },
  {
    num: '04',
    title: 'Optimal trust chain',
    desc: 'The minimum-cost valid route is surfaced as an explainable validation path.',
    strokeWidth: 1.9,
    isAnchor: true,
    // Resolved chain over the candidate graph, ending on a concentric trust anchor
    icon: `
      <path class="icd dim" d="M7 30 L17 30 L27 26 M17 30 L24 36 M17 12 L27 26" pathLength="1"></path>
      <path class="icd" d="M7 30 L17 12 L27 26 L34 14" pathLength="1"></path>
      <circle class="icd" cx="7" cy="30" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="17" cy="12" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="27" cy="26" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="34" cy="12" r="4.4" pathLength="1"></circle>
      <circle class="icd" cx="34" cy="12" r="1.4" pathLength="1"></circle>
    `,
  },
]);
