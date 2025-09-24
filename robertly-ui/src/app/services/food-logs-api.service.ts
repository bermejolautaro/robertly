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
import { PaginatedList } from '@models/pagination';
import { buildHttpParams } from 'src/app/functions/build-params';

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
    const cacheKey = `${this.authService.userUuid()}:getFoodLogById`;
    return this.http.get<FoodLog>(`${this.endpoint}/${foodLogId}`).pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public getFoodLogs(page: number, count: number, fromDate?: string, toDate?: string): Observable<PaginatedList<FoodLog>> {
    const cacheKey = `${this.authService.userUuid()}:getFoodLogs:${fromDate}:${toDate}`;

    const params = buildHttpParams({
      page,
      count,
      fromDate,
      toDate,
    });

    return this.http
      .get<PaginatedList<FoodLog>>(`${this.endpoint}`, { params })
      .pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public getMacros(timezoneId: string): Observable<Macros> {
    const cacheKey = `${this.authService.userUuid()}:getMacros:${timezoneId}`;
    return this.http
      .get<Macros>(`${this.endpoint}/macros`, { params: { timezoneId } })
      .pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public getMacrosDaily(page: number): Observable<PaginatedList<Macro>> {
    const cacheKey = `${this.authService.userUuid()}:getMacrosDaily`;
    return this.http
      .get<PaginatedList<Macro>>(`${this.endpoint}/macros-daily?page=${page}&count=10`)
      .pipe(cacheResponse(this.cacheService, cacheKey));
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
