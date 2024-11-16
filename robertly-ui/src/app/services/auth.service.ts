import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User } from '@models/user.model';
import { UsersService } from './users.service';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly usersService = inject(UsersService);
  private readonly authApiService = inject(AuthApiService);
  private readonly userUuid = signal<string | null>(null);
  public readonly user = signal<User | null>(null);

  public constructor() {
    this.auth.onAuthStateChanged(user => {
      this.userUuid.set(user?.uid ?? null);
    });

    // TODO: Check if there is some way to not use allowSignalWrites here.
    effect(() => {
      this.userUuid();

      untracked(async () => {
        const token = this.authApiService.idToken();
        const user = this.auth.currentUser;

        if (!user || !token) {
          this.user.set(null);
          return;
        }

        const userFromDb = await firstValueFrom(this.usersService.getUserByFirebaseUuid(user.uid));

        this.user.set({
          email: userFromDb.email,
          userId: userFromDb.userId,
          name: userFromDb.name,
          userFirebaseUuid: userFromDb.userFirebaseUuid,
        });
      });
    });
  }
}
