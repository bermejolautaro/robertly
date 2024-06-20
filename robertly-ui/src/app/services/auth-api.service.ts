import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, tap, firstValueFrom } from 'rxjs';
import { API_URL } from 'src/main';
import { Auth, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { ToastService } from './toast.service';
import { signInWithPopup } from '@firebase/auth';
import { ExerciseLogService } from './exercise-log.service';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  displayName: string;
}

const IDTOKEN_KEY = 'robertly-idtoken';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly auth = inject(Auth);
  private readonly toastService = inject(ToastService);
  private readonly exerciseLogService = inject(ExerciseLogService);

  public readonly idToken: WritableSignal<string | null> = signal(null);

  public constructor() {
    this.idToken.set(localStorage.getItem(IDTOKEN_KEY) ?? null);
  }

  public signIn(request: SignInRequest): Observable<string> {
    this.auth.currentUser?.getIdToken(true);

    return this.http.post(`${this.apiUrl}/auth/signin`, request, { responseType: 'text' }).pipe(
      tap(idToken => {
        localStorage.setItem(IDTOKEN_KEY, idToken);
        this.idToken.set(idToken);
      })
    );
  }

  public async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    this.auth.useDeviceLanguage();

    this.exerciseLogService.startLoading$.next();
    const result = await signInWithPopup(this.auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    this.exerciseLogService.stopLoading$.next();

    if (credential) {
      const idToken = await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/signup/google`, { accessToken: credential.accessToken }, { responseType: 'text' })
      );
      localStorage.setItem(IDTOKEN_KEY, idToken);
      this.idToken.set(idToken);
      this.toastService.ok('Successfully signed in with Google');
    }
  }

  public async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.toastService.ok('Successfully signed out');
      localStorage.removeItem(IDTOKEN_KEY);
      this.idToken.set(null);
    } catch (err: unknown) {
      this.toastService.error(JSON.stringify(err));
    }
  }

  public async tryRefreshToken(): Promise<void> {
    const newToken = await this.auth.currentUser?.getIdToken(true);

    if (newToken) {
      localStorage.setItem(IDTOKEN_KEY, newToken);
      this.idToken.set(newToken);
    } else {
      localStorage.removeItem(IDTOKEN_KEY);
      this.idToken.set(null);
    }
  }
}
