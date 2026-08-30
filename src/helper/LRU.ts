/** 缓存条目结构 */
type CacheEntry<T> = {
  /** 缓存的值 */
  value: T;
  /** 过期时间戳（毫秒），基于最后访问时间计算 */
  expireAt: number;
};

/** LRU 构造选项 */
type LRUOptions<Args extends any[], K> = {
  /** 最大缓存条目数，默认 5000 */
  max?: number;
  /** 滑动过期时间（毫秒）：条目在最后一次访问后存活的时间 */
  idleTimeout?: number;
  /**
   * 自定义序列化函数，默认 JSON.stringify。
   * 当参数对象属性顺序不稳定，或包含特殊值（如 undefined、函数）时，建议自定义。
   * 返回类型为 K（默认 string），若希望使用 number 等类型作为缓存键，请提供对应的序列化函数。
   */
  serialize?: (args: Args) => K;
};

/** 将计算结果缓存起来，当再次使用相同参数调用时直接返回缓存值，避免重复计算 */
export class LRU<Args extends any[], Result, K = string> {
  private readonly map = new Map<K, CacheEntry<Result>>();

  /** 最大缓存条目数 */
  private readonly max: number;

  /** 滑动过期时间（毫秒），所有缓存条目共用 */
  private readonly idleTimeout: number;

  /** 自定义序列化函数，将参数数组转换为缓存键（类型 K） */
  private readonly serialize: (args: Args) => K;

  /** 被包装的计算函数 */
  private readonly computeFn: (...args: Args) => Result;

  constructor(
    computeFn: (...args: Args) => Result,
    options: LRUOptions<Args, K> = {},
  ) {
    this.computeFn = computeFn;
    this.max = options.max ?? 5000;
    this.idleTimeout = options.idleTimeout ?? 5 * 60 * 1000;
    this.serialize =
      options.serialize ?? ((args) => JSON.stringify(args) as unknown as K);
  }

  /** 调用计算函数，自动使用缓存 */
  call(...args: Args): Result {
    const key = this.serialize(args);
    const now = Date.now();

    // 清理过期条目
    this.cleanupExpired(now);

    const cached = this.map.get(key);
    if (cached) {
      // 命中且未过期：更新过期时间并移至末尾
      cached.expireAt = now + this.idleTimeout;
      this.map.delete(key);
      this.map.set(key, cached);
      return cached.value;
    }

    // 未命中：执行计算
    const value = this.computeFn(...args);

    // 写入缓存
    const entry: CacheEntry<Result> = {
      value,
      expireAt: now + this.idleTimeout,
    };
    this.map.set(key, entry);

    // 超过容量时删除最旧的条目
    if (this.map.size > this.max) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) this.map.delete(oldestKey);
    }

    return value;
  }

  /** 手动删除指定参数对应的缓存 */
  delete(...args: Args): boolean {
    return this.map.delete(this.serialize(args));
  }

  /** 清空所有缓存 */
  clear(): void {
    this.map.clear();
  }

  /** 当前缓存条目数量 */
  get size(): number {
    return this.map.size;
  }

  /** 删除所有已过期的缓存条目 */
  private cleanupExpired(now: number): void {
    for (const [key, entry] of this.map) {
      if (entry.expireAt <= now) this.map.delete(key);
      else break; // 后续条目必然未过期，提前终止
    }
  }
}
