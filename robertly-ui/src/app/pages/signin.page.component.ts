import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '@services/auth-api.service';
import { ToastService } from '@services/toast.service';
import { firstValueFrom } from 'rxjs';
import { Paths } from 'src/main';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.component.html',
  styles: `
    .sign-in-google {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgb(226, 232, 240);
      background-color: white;
      gap: 5px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NgOptimizedImage],
})
export class SignInComponent implements OnInit {
  private readonly authApiService = inject(AuthApiService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  public readonly isLoading = signal(false);

  public email: string = '';
  public password: string = '';

  public async ngOnInit(): Promise<void> {
    await this.authApiService.tryRefreshToken();
  }

  public async onClickSignIn(): Promise<void> {
    if (!this.email || !this.password) {
      return;
    }

    try {
      this.isLoading.set(true);
      await firstValueFrom(this.authApiService.signIn({ email: this.email, password: this.password }));
      this.router.navigate([Paths.HOME]);
    } catch (error) {
      this.toastService.error('Sign in with email failed.');
    }

    this.isLoading.set(false);
  }

  public async onClickSignInWithGoogle(): Promise<void> {
    try {
      this.isLoading.set(true);
      await this.authApiService.signInWithGoogle();
      this.router.navigate([Paths.HOME]);
    } catch (error) {
      this.toastService.error('Sign in with google failed.');
    }
    this.isLoading.set(false);
  }
}
