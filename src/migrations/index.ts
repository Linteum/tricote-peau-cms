import * as migration_20250220_113426 from './20250220_113426';
import * as migration_20250225_112810 from './20250225_112810';

export const migrations = [
  {
    up: migration_20250220_113426.up,
    down: migration_20250220_113426.down,
    name: '20250220_113426',
  },
  {
    up: migration_20250225_112810.up,
    down: migration_20250225_112810.down,
    name: '20250225_112810'
  },
];
