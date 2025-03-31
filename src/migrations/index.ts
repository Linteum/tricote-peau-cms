import * as migration_20250220_113426 from './20250220_113426';
import * as migration_20250225_112810 from './20250225_112810';
import * as migration_20250228_165301 from './20250228_165301';
import * as migration_20250331_164147 from './20250331_164147';

export const migrations = [
  {
    up: migration_20250220_113426.up,
    down: migration_20250220_113426.down,
    name: '20250220_113426',
  },
  {
    up: migration_20250225_112810.up,
    down: migration_20250225_112810.down,
    name: '20250225_112810',
  },
  {
    up: migration_20250228_165301.up,
    down: migration_20250228_165301.down,
    name: '20250228_165301',
  },
  {
    up: migration_20250331_164147.up,
    down: migration_20250331_164147.down,
    name: '20250331_164147'
  },
];
