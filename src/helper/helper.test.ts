import { describe, expect, it } from 'vitest';

import { descRange, extractRange } from './other';

describe('页面范围', () => {
  it('extractRange', () => {
    expect([...extractRange('1-2, 4-6, 8, 10-', 11)]).toStrictEqual([
      0, 1, 3, 4, 5, 7, 9, 10,
    ]);
  });

  it('descRange', () => {
    expect(descRange([0, 1, 3, 4, 5, 7, 9, 10], 11)).toBe('1-2, 4-6, 8, 10-');
  });
});
