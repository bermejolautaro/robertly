import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { NgbDropdownModule, NgbOffcanvasModule, NgbToastModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbDropdownModule, NgbOffcanvasModule, NgbToastModule, NgbAlertModule],
})
export class HeaderComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  public readonly authService = inject(AuthService);
  @Output() public readonly logsRefreshClicked = new EventEmitter<void>();
  @Output() public readonly menuSidebarClicked = new EventEmitter<void>();
  public isSpinning: boolean = false;
}
