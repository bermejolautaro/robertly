import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { NgbDropdownModule, NgbOffcanvasModule, NgbToastModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbDropdownModule, NgbOffcanvasModule, NgbToastModule, NgbAlertModule],
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public readonly menuSidebarClicked = output<void>();

  public isSpinning: boolean = false;
}
