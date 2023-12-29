import ***REMOVED*** HttpClient ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** Injectable, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** Exercise ***REMOVED*** from '@models/exercise.model';
import ***REMOVED*** Observable, map ***REMOVED*** from 'rxjs';
import ***REMOVED*** BACKEND_URL ***REMOVED*** from 'src/main';

type ExercisesResponse = ***REMOVED***
  data: Exercise[];
***REMOVED***;

@Injectable(***REMOVED***
  providedIn: 'root',
***REMOVED***)
export class ViewModelApiService ***REMOVED***
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);

  public getViewModel(): Observable<any[]> ***REMOVED***
    return this.http.get<any>(`$***REMOVED***this.url***REMOVED***/firebase/viewmodel`).pipe(map(x => x.data));
***REMOVED***
***REMOVED***
