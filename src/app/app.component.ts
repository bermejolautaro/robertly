import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { filter, take } from 'rxjs';
import { LOGS_PATH, STATS_PATH } from 'src/main';

@Component({
  selector: 'app-root',
  template: `
    <div [style.marginBottom.rem]="6">
      <router-outlet></router-outlet>
    </div>

    <nav class="navbar navbar-dark bg-primary bg-gradient fixed-bottom fw-bold">
      <div class="container-fluid">
        <ul class="navbar-nav flex-row gap-3 justify-content-center w-100">
          <li class="nav-item w-100">
            <a
              class="nav-link text-center d-flex justify-content-center align-items-center gap-2"
              [routerLink]="LOGS_PATH"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Logs <i class="fa fa-history"></i>
            </a>
          </li>
          <li class="nav-item w-100">
            <a
              class="nav-link text-center d-flex justify-content-center align-items-center gap-2"
              [routerLink]="STATS_PATH"
              routerLinkActive="active"
            >
              Stats <i class="fa fa-bar-chart"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [
    `
      nav.navbar {
        padding-bottom: max(env(safe-area-inset-bottom), 0.8rem);
      }
    `,
  ],
  standalone: true,
  imports: [RouterLinkWithHref, RouterLinkActive, RouterOutlet],
})
export class AppComponent {
  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public constructor(serviceWorkerUpdates: SwUpdate) {
    serviceWorkerUpdates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        take(1)
      )
      .subscribe(() => {
        document.location.reload();
      });
  }
}
