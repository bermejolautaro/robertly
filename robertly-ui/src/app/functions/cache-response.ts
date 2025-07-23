import { CacheService } from '@services/cache.service';
import { OperatorFunction, startWith, tap } from 'rxjs';

export function cacheResponse<T>(cacheService: CacheService, cacheKey: string): OperatorFunction<T, T> {
  const cached = cacheService.get<T>(cacheKey);
  return source => {
    if (cached) {
      return source.pipe(
        startWith(cached),
        tap(response => cacheService.set(cacheKey, response))
      );
    } else {
      return source.pipe(
        tap(response => cacheService.set(cacheKey, response))
      );
    }
  }
}