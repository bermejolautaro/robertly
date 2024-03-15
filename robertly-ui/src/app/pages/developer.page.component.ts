import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { AuthApiService, IDTOKEN_KEY } from "@services/auth-api.service";

@Component({
  selector: 'app-developer-page',
  templateUrl: 'developer.page.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class DeveloperPageComponent implements OnInit {
  public token: string = '';
  public isGrouped: boolean = false;

  public ngOnInit(): void {
    this.token = localStorage.getItem(IDTOKEN_KEY) ?? '';
  }
}
