import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive, Router } from '@angular/router';
import { Paths } from 'src/main';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLinkWithHref, RouterLinkActive]
})
export class FooterComponent {
  private readonly router = inject(Router);

  public readonly Paths = Paths;

  public navigateToCreateLog(): void {
    this.router.navigate([Paths.EXERCISE_LOGS, Paths.EXERCISE_LOGS_CREATE]);
  }
}
