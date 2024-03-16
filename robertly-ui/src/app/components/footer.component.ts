import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { Paths } from 'src/main';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: `
    nav.navbar.fixed-bottom {
      padding-bottom: max(env(safe-area-inset-bottom), 0.8rem);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLinkWithHref, RouterLinkActive],
})
export class FooterComponent {
  public readonly Paths = Paths;
}
