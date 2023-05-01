import { Component } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { filter, take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public constructor(private readonly serviceWorkerUpdates: SwUpdate) { 
    this.serviceWorkerUpdates.versionUpdates
    .pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      take(1)
    )
    .subscribe(() => {
      document.location.reload();
    });
  }
}
