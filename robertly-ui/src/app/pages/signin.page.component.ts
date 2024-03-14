import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '@services/auth-api.service';
import { firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule],
})
export class SignInComponent implements OnInit {
  private readonly authApiService = inject(AuthApiService);

  public email: string = '';
  public password: string = '';

  public constructor() {}

  public async ngOnInit(): Promise<void> {
    await this.authApiService.handleRedirectResult();
  }

  public async onClickSignIn(): Promise<void> {
    if (!this.email || !this.password) {
      return;
    }

    await firstValueFrom(this.authApiService.signIn({ email: this.email, password: this.password }));
  }

  public async onClickSignInWithGoogle(): Promise<void> {
    await this.authApiService.signInWithGoogle();
  }
}
