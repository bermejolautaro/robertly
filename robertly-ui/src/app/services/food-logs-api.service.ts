import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/main';
import { FoodLog } from '@models/food-log.model';
import { Macros } from '@models/macros';
import { Macro } from '@models/macro';
import { CacheService } from '@services/cache.service';
import { cacheResponse } from 'src/app/functions/cache-response';
import { AuthService } from '@services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FoodLogsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly cacheService = inject(CacheService);
  private readonly authService = inject(AuthService);
  private readonly endpoint = `${this.apiUrl}/food-logs`;

  public getFoodLogById(foodLogId: number): Observable<FoodLog> {
    const cacheKey = `${this.authService.userUuid()}:getFoodLogById:${foodLogId}`;
    return this.http.get<FoodLog>(`${this.endpoint}/${foodLogId}`).pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public getFoodLogs(): Observable<FoodLog[]> {
    const cacheKey = `${this.authService.userUuid()}:getFoodLogs`;
    return this.http.get<FoodLog[]>(`${this.endpoint}`).pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public getMacros(timezoneId: string): Observable<Macros> {
    const cacheKey = `${this.authService.userUuid()}:getMacros:${timezoneId}`;
    return this.http
      .get<Macros>(`${this.endpoint}/macros`, { params: { timezoneId } })
      .pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public getMacrosDaily(): Observable<Macro[]> {
    const cacheKey = `${this.authService.userUuid()}:getMacrosDaily`;
    return this.http.get<Macro[]>(`${this.endpoint}/macros-daily`).pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public createFoodLog(request: FoodLog): Observable<void> {
    return this.http.post<void>(`${this.endpoint}`, request);
  }

  public updateFoodLog(request: FoodLog): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${request.foodLogId}`, request);
  }

  public deleteFoodLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
