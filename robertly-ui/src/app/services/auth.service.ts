import { Injectable, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UsersService } from './users.service';
import { map, of } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly usersService = inject(UsersService);
  private readonly authApiService = inject(AuthApiService);

  public readonly userUuid = signal<string | null>(null);

  public readonly user = rxResource({
    request: () => ({ userUuid: this.userUuid(), idToken: this.authApiService.idToken() }),
    loader: ({ request }) => {
      if (request.userUuid === null || request.idToken === null) {
        return of(null);
      }

      return this.usersService.getUserByFirebaseUuid(request.userUuid).pipe(
        map(userFromDb => ({
          email: userFromDb.email,
          userId: userFromDb.userId,
          name: userFromDb.name,
          userFirebaseUuid: userFromDb.userFirebaseUuid,
          assignedUsers: userFromDb.assignedUsers,
        }))
      );
    },
  });

  public constructor() {
    this.auth.onAuthStateChanged(user => {
      this.userUuid.set(user?.uid ?? null);
    });
  }
}
