/**
 * Single client entry for the page. Each module looks for its own markup and
 * does nothing when it is absent.
 */
import { initDive } from '../lib/dive';
import { initPathDiscovery } from '../lib/path-discovery';
import { initFontSwitch } from '../lib/font-switch';

initDive();
initPathDiscovery();
initFontSwitch();
