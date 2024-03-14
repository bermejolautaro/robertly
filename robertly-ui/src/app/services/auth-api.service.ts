import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap, firstValueFrom } from 'rxjs';
import { API_URL } from 'src/main';
import { Auth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from '@angular/fire/auth';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  displayName: string;
}

export const IDTOKEN_KEY = 'robertly-idtoken';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly auth = inject(Auth);

  public signIn(request: SignInRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/signin`, request, { responseType: 'text' }).pipe(
      tap(idToken => {
        localStorage.setItem(IDTOKEN_KEY, idToken);
      })
    );
  }

  public async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');

    this.auth.useDeviceLanguage();

    await signInWithRedirect(this.auth, provider);
  }

  public async handleRedirectResult(): Promise<void> {
    try {
      const result = await getRedirectResult(this.auth);
      const credential = GoogleAuthProvider.credentialFromResult(result!);
      const token = credential!.accessToken;

      const idToken = await firstValueFrom(
        this.http.post(`${this.apiUrl}/auth/signup/google`, { accessToken: token }, { responseType: 'text' })
      );
      localStorage.setItem(IDTOKEN_KEY, idToken);
    } catch (err: unknown) {
      const error = err as { code: string; message: string; customData: { email: string } };
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
    }
  }
}
