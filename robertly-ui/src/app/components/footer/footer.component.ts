import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive, Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Paths } from 'src/main';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLinkWithHref, RouterLinkActive],
})
export class FooterComponent {
  private readonly router = inject(Router);
  private readonly offcanvasService = inject(NgbOffcanvas);

  public readonly Paths = Paths;

  public navigateToCreateLog(): void {
    this.router.navigate([Paths.EXERCISE_LOGS, Paths.CREATE]);
  }

  public openSidebar(content: TemplateRef<unknown>): void {
    this.offcanvasService.open(content, { position: 'bottom' });
  }

  public navigateTo(segments: string[]): void {
    this.router.navigate(segments);
  }
}
