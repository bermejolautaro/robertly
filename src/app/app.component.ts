import ***REMOVED*** Component ***REMOVED*** from '@angular/core';
import ***REMOVED*** RouterLinkActive, RouterLinkWithHref, RouterOutlet ***REMOVED*** from '@angular/router';
import ***REMOVED*** SwUpdate, VersionReadyEvent ***REMOVED*** from '@angular/service-worker';

import ***REMOVED*** filter, take ***REMOVED*** from 'rxjs';
import ***REMOVED*** LOGS_PATH, STATS_PATH ***REMOVED*** from 'src/main';

@Component(***REMOVED***
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
              [routerLinkActiveOptions]="***REMOVED*** exact: true ***REMOVED***"
            >
              Logs <i class="fa fa-history" aria-hidden="true"></i>
            </a>
          </li>
          <li class="nav-item w-100">
            <a
              class="nav-link text-center d-flex justify-content-center align-items-center gap-2"
              [routerLink]="STATS_PATH"
              routerLinkActive="active"
            >
              Stats <i class="fa fa-bar-chart" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [
    `
      nav.navbar ***REMOVED***
        padding-bottom: max(env(safe-area-inset-bottom), 0.8rem);
  ***REMOVED***
    `,
  ],
  standalone: true,
  imports: [RouterLinkWithHref, RouterLinkActive, RouterOutlet],
***REMOVED***)
export class AppComponent ***REMOVED***
  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public constructor(private readonly serviceWorkerUpdates: SwUpdate) ***REMOVED***
    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        take(1)
      )
      .subscribe(() => ***REMOVED***
        document.location.reload();
  ***REMOVED***);
***REMOVED***
***REMOVED***
