/**
 * Single client entry for the page. Each module looks for its own markup and
 * does nothing when it is absent.
 */
import { initDive } from '../lib/dive';
import { initPathDiscovery } from '../lib/path-discovery';
import { initFederationWheel } from '../lib/federation-wheel';
import { initPaletteSwitch } from '../lib/palette-switch';

initFederationWheel();
initDive();
initPathDiscovery();
initPaletteSwitch();
