import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@models/user.model';
import { CacheService } from '@services/cache.service';
import { Observable, startWith, tap } from 'rxjs';
import { API_URL } from 'src/main';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);
  private readonly apiUrl = inject(API_URL);
  private readonly endpoint = `${this.apiUrl}/users`;

  public getUserByFirebaseUuid(firebaseUuid: string): Observable<User> {
    const cacheKey = `getUserByFirebaseUuid:${firebaseUuid}`;
    const cached = this.cacheService.get<User>(cacheKey);

    const user$ = this.http
      .get<User>(`${this.endpoint}/firebase-uuid/${firebaseUuid}`)
      .pipe(tap(response => this.cacheService.set(cacheKey, response)));

    if (cached) {
      return user$.pipe(startWith(cached));
    } else {
      return user$;
    }
  }
}
