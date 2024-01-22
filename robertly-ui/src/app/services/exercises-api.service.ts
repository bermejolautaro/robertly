import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Exercise } from "@models/exercise.model";
import { Observable, map } from "rxjs";
import { BACKEND_URL, NET_API_URL } from "src/main";

type ExercisesResponse = {
  data: Exercise[]
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseApiService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);
  private readonly netApiUrl = inject(NET_API_URL);

  public getExercises(): Observable<Exercise[]> {
    return this.http
      .get<ExercisesResponse>(`${this.netApiUrl}/exercises`)
      .pipe(map(x => x.data));
  }
}