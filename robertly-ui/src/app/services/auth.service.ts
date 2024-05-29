import { Injectable, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User } from '@models/user.model';
import { UsersService } from './users.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly usersService = inject(UsersService);
  public readonly user = signal<User | null>(null);

  public constructor() {
    this.auth.onAuthStateChanged(async user => {
      if (!user) {
        this.user.set(null);
        return;
      }

      const userFromDb = await firstValueFrom(this.usersService.getUserByFirebaseUuid(user.uid));

      this.user.set({
        email: userFromDb.email,
        userId: userFromDb.userId,
        name: userFromDb.name,
        userFirebaseUuid: userFromDb.userFirebaseUuid
      })
    })
  }
}
