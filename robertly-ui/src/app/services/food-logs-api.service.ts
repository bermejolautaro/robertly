import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/main';
import { FoodLog } from '@models/food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodLogsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly endpoint = `${this.apiUrl}/food-logs`;

  public getFoodLogs(): Observable<FoodLog[]> {
    return this.http.get<FoodLog[]>(`${this.endpoint}`)
  }

  public createFoodLog(request: FoodLog): Observable<void> {
    return this.http.post<void>(`${this.endpoint}`, request);
  }

  public updateFoodLog(request: FoodLog): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${request.foodId}`, request);
  }

  public deleteFoodLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
