import ***REMOVED*** Component ***REMOVED*** from '@angular/core';
import ***REMOVED*** SwUpdate, VersionReadyEvent ***REMOVED*** from '@angular/service-worker';

import ***REMOVED*** filter, take ***REMOVED*** from 'rxjs';

@Component(***REMOVED***
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
***REMOVED***)
export class AppComponent ***REMOVED***
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
