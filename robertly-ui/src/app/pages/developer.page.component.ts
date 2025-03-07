import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AuthApiService } from '@services/auth-api.service';

@Component({
  selector: 'app-developer-page',
  templateUrl: 'developer.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class DeveloperPageComponent implements OnInit {
  private readonly authApiService = inject(AuthApiService);
  public token: string = '';
  public isGrouped: boolean = false;

  public ngOnInit(): void {
    this.token = this.authApiService.idToken() ?? '';
  }
}
