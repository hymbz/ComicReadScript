import { describe, expect, it } from 'vitest';

import { byPath } from '.';

describe('byPath', () => {
  it('嵌套对象', () => {
    const a = { q: { b: 1 } };
    byPath(a, 'q.b', (parent, key) => {
      expect(key).toBe('b');
      expect(parent).toStrictEqual({ b: 1 });
      return 9;
    });
    expect(a).toStrictEqual({ q: { b: 9 } });
  });

  it('没有嵌套的对象', () => {
    const a = { q: 1 };
    byPath(a, 'q', (parent, key) => {
      expect(key).toBe('q');
      expect(parent).toStrictEqual(a);
      return 9;
    });
    expect(a).toStrictEqual({ q: 9 });
  });

  it('含有「.」', () => {
    const a = { q: { 'b.w.e': 1 } };
    byPath(a, 'q.b.w.e', (parent, key) => {
      expect(key).toBe('b.w.e');
      expect(parent).toStrictEqual({ 'b.w.e': 1 });
      return 9;
    });
    expect(a).toStrictEqual({ q: { 'b.w.e': 9 } });

    const b = { q: { 'b.w.e': { l: 1 } } };
    byPath(b, 'q.b.w.e.l', (parent, key) => {
      expect(key).toBe('l');
      expect(parent).toStrictEqual({ l: 1 });
      return 9;
    });
    expect(b).toStrictEqual({ q: { 'b.w.e': { l: 9 } } });
  });
});
