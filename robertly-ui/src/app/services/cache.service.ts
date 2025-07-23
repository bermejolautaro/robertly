import { Injectable, signal } from '@angular/core';

const TEN_DAYS = 1000 * 60 * 60 * 24 * 10; // 10 days in milliseconds

type CacheEntry<T> = {
  expires: number;
  value: T;
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly cache = signal<Record<string, CacheEntry<unknown>>>({});

  public get<T>(key: string): T | null {
    const entry = (this.cache()[key] ?? null) as CacheEntry<T> | null;

    if (!entry) {
      return null;
    }

    if (entry.expires && entry.expires < Date.now()) {
      this.remove(key);
      return null;
    }

    return this.cache()[key]?.value as T | null;
  }

  public set<T>(key: string, value: T, lifetime?: number): void {
    lifetime = lifetime ?? 1000 * 60 * 60; // Default to 1 hour
    const entry = { value, expires: Date.now() + TEN_DAYS };
    this.cache.update(c => ({ ...c, [key]: entry }));
    localStorage.setItem('app-cache', JSON.stringify(this.cache()));
  }

  public remove(key: string): void {
    const newCache = this.cache();
    delete newCache[key];
    this.cache.set(newCache);
    localStorage.setItem('app-cache', JSON.stringify(newCache));
  }

  public load(): void {
    const cache = localStorage.getItem('app-cache');
    if (cache) {
      this.cache.set(JSON.parse(cache));
    }
  }

  public clear(): void {
    this.cache.set({});
    localStorage.removeItem('app-cache');
  }

  public cleanupExpired(): void {
    const now = Date.now();
    const cleaned = Object.fromEntries(
      Object.entries(this.cache()).filter(([_, entry]) => !entry.expires || entry.expires > now)
    );
    this.cache.set(cleaned);
    localStorage.setItem('app-cache', JSON.stringify(cleaned));
  }
}
