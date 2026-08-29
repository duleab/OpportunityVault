import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('production TypeScript build configuration', () => {
  it.each(['client', 'server'])('excludes test files from the %s build', (workspace) => {
    const config = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), workspace, 'tsconfig.json'), 'utf8')
    ) as { exclude?: string[] };

    expect(config.exclude).toContain('src/**/*.test.ts');
  });
});
