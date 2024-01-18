import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Exercise } from '@models/exercise.model';
import { Observable, map } from 'rxjs';
import { BACKEND_URL } from 'src/main';

type ExercisesResponse = {
  data: Exercise[];
};

@Injectable({
  providedIn: 'root',
})
export class ViewModelApiService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);

  public getViewModel(): Observable<any[]> {
    return this.http.get<any>(`${this.url}/firebase/viewmodel`).pipe(map(x => x.data));
  }
}
