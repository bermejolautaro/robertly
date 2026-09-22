import { HttpClient } from '@angular/common/http';
import { EnvironmentInjector, Injectable, inject, runInInjectionContext } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly auth = inject(Auth);
  private readonly toastService = inject(ToastService);
  private readonly injector = inject(EnvironmentInjector);

  public signIn(request: SignInRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/signin`, request, { responseType: 'text' });
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
        await firstValueFrom(
          this.http.post(
            `${this.apiUrl}/auth/signup/google`,
            { accessToken: credential.accessToken },
            { responseType: 'text' }
          )
        );

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
    } catch (err: unknown) {
      this.toastService.error(JSON.stringify(err));
    }
  }
}
