import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@models/user.model';
import { CacheService } from '@services/cache.service';
import { Observable, startWith, tap } from 'rxjs';
import { cacheResponse } from 'src/app/functions/cache-response';
import { API_URL } from 'src/main';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly cacheService = inject(CacheService);
  private readonly apiUrl = inject(API_URL);
  private readonly endpoint = `${this.apiUrl}/users`;

  public getUserByFirebaseUuid(firebaseUuid: string): Observable<User> {
    const cacheKey = `getUserByFirebaseUuid:${firebaseUuid}`;

    return this.http
      .get<User>(`${this.endpoint}/firebase-uuid/${firebaseUuid}`)
      .pipe(cacheResponse(this.cacheService, cacheKey));
  }
}
