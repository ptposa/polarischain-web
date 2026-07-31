import { z } from 'zod';

/**
 * The 4-step "How it works" timeline. `icon` is the literal inner markup of
 * each step's 40x40 viewBox SVG (rendered with `set:html`) — every path/circle
 * carries `pathLength="1"` so `lib/step-timeline.ts` can draw them in with a
 * dashoffset animation on activation.
 */
const stepSchema = z.object({
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
    title: 'Input certificate',
    desc: 'Certificate request enters the federated validation model.',
    strokeWidth: 1.5,
    isAnchor: false,
    icon: `
      <rect class="icd" x="9" y="5" width="17" height="23" rx="2.5" pathLength="1"></rect>
      <path class="icd dim" d="M13 12 H22" pathLength="1"></path>
      <path class="icd dim" d="M13 16 H22" pathLength="1"></path>
      <path class="icd dim" d="M13 20 H18" pathLength="1"></path>
      <circle class="icd" cx="27" cy="28" r="5.5" pathLength="1"></circle>
      <path class="icd dim" d="M27 25.5 V30.5 M24.5 28 H29.5" pathLength="1"></path>
    `,
  },
  {
    title: 'Graph traversal',
    desc: 'Candidate paths are explored over a weighted trust graph.',
    strokeWidth: 1.5,
    isAnchor: false,
    icon: `
      <path class="icd" d="M6 26 L14 12 L23 22 L34 8" pathLength="1"></path>
      <path class="icd dim" d="M6 26 L16 30 L28 27" pathLength="1"></path>
      <circle class="icd" cx="6" cy="26" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="14" cy="12" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="23" cy="22" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="34" cy="8" r="2.6" pathLength="1"></circle>
    `,
  },
  {
    title: 'Path scoring',
    desc: 'Paths are evaluated based on cryptographic strength, policy compatibility, and structural cost.',
    strokeWidth: 1.5,
    isAnchor: false,
    icon: `
      <path class="icd" d="M5 22 L13 17 L20 9 L28 15 L35 7" pathLength="1"></path>
      <path class="icd dim" d="M13 17 L20 24 L28 15 L34 23" pathLength="1"></path>
      <circle class="icd" cx="35" cy="7" r="2.8" pathLength="1"></circle>
      <path class="icd dim" d="M5 30 H35" pathLength="1"></path>
    `,
  },
  {
    title: 'Optimal trust chain',
    desc: 'The minimum-cost valid route is surfaced as an explainable validation path.',
    strokeWidth: 1.6,
    isAnchor: true,
    icon: `
      <path class="icd" d="M5 20 L16 12 L26 17 L36 8" pathLength="1"></path>
      <path class="icd dim" d="M5 20 L16 23 L26 17 L35 25" pathLength="1"></path>
      <circle class="icd" cx="5" cy="20" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="16" cy="12" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="26" cy="17" r="2.6" pathLength="1"></circle>
      <circle class="icd" cx="36" cy="8" r="3.2" pathLength="1"></circle>
    `,
  },
]);
