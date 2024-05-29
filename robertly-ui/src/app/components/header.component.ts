import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbDropdownModule, NgbOffcanvasModule, NgbToastModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { FiltersComponent } from './filters.component';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    TitleCasePipe,
    FiltersComponent,
    RouterLinkWithHref,
    RouterLinkActive,
    RouterOutlet,
    NgbDropdownModule,
    NgbOffcanvasModule,
    NgbToastModule,
    NgbAlertModule,
  ],
})
export class HeaderComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);
  public readonly authService = inject(AuthService);
  @Output() public readonly logsRefreshClicked = new EventEmitter<void>();
  @Output() public readonly menuSidebarClicked = new EventEmitter<void>();
  public isSpinning: boolean = false;
}
