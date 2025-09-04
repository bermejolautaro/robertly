import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { NgbDropdownModule, NgbOffcanvasModule, NgbToastModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar fixed-top px-1 z-3">
      <div class="container-fluid d-flex">
        <div class="title">
          @if (authService.user.value()) {
            Hello! {{ authService.user.value()?.name }}
          }
        </div>

        <!-- #region MENU -->
        <button
          type="button"
          class="btn sidebar-button"
        >
          <i
            class="fa fa-bars sidebar-icon"
            (click)="menuSidebarClicked.emit()"
          ></i>
        </button>
        <!-- #endregion -->
      </div>
    </nav>
  `,
  styles: `
    nav {
      backdrop-filter: blur(4px);
      border-bottom: 1px solid rgba(255 255 255 / 10%);
    }

    .title {
      color: white;
      font-weight: bold;
      font-size: 16px;
    }

    .sidebar-button {
      outline: none;
      border: none;
      padding: 0;
    }

    .sidebar-icon {
      font-size: 22px;
      color: white;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbDropdownModule, NgbOffcanvasModule, NgbToastModule, NgbAlertModule],
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  public readonly menuSidebarClicked = output<void>();
}
