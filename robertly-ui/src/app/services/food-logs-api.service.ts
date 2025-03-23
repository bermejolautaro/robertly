import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/main';
import { FoodLog } from '@models/food-log.model';
import { Macros } from '@models/macros';
import { Macro } from '@models/Macro';

@Injectable({
  providedIn: 'root',
})
export class FoodLogsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly endpoint = `${this.apiUrl}/food-logs`;

  public getFoodLogById(foodLogId: number): Observable<FoodLog> {
    return this.http.get<FoodLog>(`${this.endpoint}/${foodLogId}`);
  }

  public getFoodLogs(): Observable<FoodLog[]> {
    return this.http.get<FoodLog[]>(`${this.endpoint}`);
  }

  public getMacros(timezoneId: string): Observable<Macros> {
    return this.http.get<Macros>(`${this.endpoint}/macros`, { params: { timezoneId } });
  }

  public getMacrosDaily(): Observable<Macro[]> {
    return this.http.get<Macro[]>(`${this.endpoint}/macros-daily`);
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
