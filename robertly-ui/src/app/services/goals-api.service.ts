import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Goal } from '@models/goal';
import { CacheService } from '@services/cache.service';
import { Observable } from 'rxjs';
import { cacheResponse } from 'src/app/functions/cache-response';
import { nameof } from 'src/app/functions/name-of';
import { API_URL } from 'src/main';

@Injectable({ providedIn: 'root' })
export class GoalsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly cacheService = inject(CacheService);
  private readonly endpoint = `${this.apiUrl}/goals`;

  public saveGoal(goal: Goal): Observable<void> {
    return this.http.post<void>(this.endpoint, goal);
  }

  public getGoals(): Observable<Goal[]> {
    const cacheKey = `${nameof<GoalsApiService>('getGoals')}`;
    return this.http.get<Goal[]>(this.endpoint).pipe(cacheResponse(this.cacheService, cacheKey));
  }
}
