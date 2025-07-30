import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/main';
import { Food } from '@models/food.model';
import { CacheService } from '@services/cache.service';
import { AuthService } from '@services/auth.service';
import { cacheResponse } from 'src/app/functions/cache-response';

@Injectable({
  providedIn: 'root',
})
export class FoodsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly cacheService = inject(CacheService);
  private readonly authService = inject(AuthService);
  private readonly endpoint = `${this.apiUrl}/foods`;

  public getFoodById(foodId: number): Observable<Food> {
    const cacheKey = `${this.authService.userUuid()}:getFoodById:${foodId}`;
    return this.http.get<Food>(`${this.endpoint}/${foodId}`).pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public getFoods(): Observable<Food[]> {
    const cacheKey = `${this.authService.userUuid()}:getFoods`;
    return this.http.get<Food[]>(`${this.endpoint}`).pipe(cacheResponse(this.cacheService, cacheKey));
  }

  public createFood(request: Food): Observable<void> {
    return this.http.post<void>(`${this.endpoint}`, request);
  }

  public updateFood(request: Food): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${request.foodId}`, request);
  }

  public deleteFood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
