import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/main';
import { Food } from '@models/food.model';

@Injectable({
  providedIn: 'root',
})
export class FoodsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly endpoint = `${this.apiUrl}/foods`;

  public getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.endpoint}`)
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
