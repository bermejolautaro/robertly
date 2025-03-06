import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable, inject, runInInjectionContext, signal } from '@angular/core';
import { Observable, tap, firstValueFrom } from 'rxjs';
import { API_URL } from 'src/main';
import { Auth, GoogleAuthProvider, signOut, signInWithPopup } from '@angular/fire/auth';
import { ToastService } from './toast.service';

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
  private readonly injector = inject(EnvironmentInjector);

  private readonly isRefreshingToken = signal<boolean>(false);
  public readonly idToken = signal<string | null>(null);

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
      prompt: 'select_account',
    });

    this.auth.useDeviceLanguage();

    await runInInjectionContext(this.injector, async () => {
      const result = await signInWithPopup(this.auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (credential) {
        const idToken = await firstValueFrom(
          this.http.post(
            `${this.apiUrl}/auth/signup/google`,
            { accessToken: credential.accessToken },
            { responseType: 'text' }
          )
        );

        localStorage.setItem(IDTOKEN_KEY, idToken);
        this.idToken.set(idToken);
        this.toastService.ok('Successfully signed in with Google');
      }
    });
  }

  public async signOut(): Promise<void> {
    try {
      await runInInjectionContext(this.injector, async () => {
        await signOut(this.auth);
      });
      this.toastService.ok('Successfully signed out');
      localStorage.removeItem(IDTOKEN_KEY);
      this.idToken.set(null);
    } catch (err: unknown) {
      this.toastService.error(JSON.stringify(err));
    }
  }

  public async tryRefreshToken(): Promise<boolean> {
    try {
      if (this.isRefreshingToken()) {
        return false;
      }
      this.isRefreshingToken.set(true);
      await this.auth.authStateReady();
      const currentUser = this.auth.currentUser;
      const newToken = (await currentUser?.getIdToken(true)) ?? null;
      this.isRefreshingToken.set(false);

      if (newToken) {
        localStorage.setItem(IDTOKEN_KEY, newToken);
        this.idToken.set(newToken);
        return true;
      } else {
        localStorage.removeItem(IDTOKEN_KEY);
        this.idToken.set(null);
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
