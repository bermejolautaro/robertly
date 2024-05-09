import { Injectable, inject } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  public get user(): User | null {
    return this.auth.currentUser;
  }
}
