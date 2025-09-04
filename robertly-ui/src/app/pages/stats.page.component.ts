import { ChangeDetectionStrategy, Component, OnInit, inject, signal, DOCUMENT } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from '../components/dropdown.component';
import { FormControl } from '@angular/forms';

import { ActivatedRoute, EventType, Router, RouterModule } from '@angular/router';
import { Paths } from 'src/main';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

type Option = { label: string; path: string };

const OPTIONS: Option[] = [
  {
    label: 'Series per Muscle',
    path: Paths.SERIES_PER_MUSCLE,
  },
  {
    label: 'Macros Daily',
    path: Paths.MACROS,
  },
  {
    label: 'Days Trained',
    path: Paths.DAYS_TRAINED,
  },
] as const;

@Component({
  selector: 'app-stats-page',
  template: `<div class="header-footer-padding">
    <div class="container">
      <div class="pb-4">
        <app-dropdown
          [control]="selectedOptionControl"
          [items]="options()"
          [showClear]="false"
          [formatter]="formatter"
        ></app-dropdown>
      </div>

      <router-outlet></router-outlet>
    </div>
  </div>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbNavModule, DropdownComponent, RouterModule],
})
export class StatsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly selectedOptionControl = new FormControl(OPTIONS[0]);
  public readonly options = signal(OPTIONS);

  public readonly formatter = (x: Option | null | undefined) => x?.label ?? '';

  public constructor() {
    this.selectedOptionControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(option => {
      if (option) {
        this.router.navigate([option.path], { relativeTo: this.route, queryParamsHandling: 'preserve' });
      }
    });

    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(e => e.type === EventType.NavigationEnd),
        map(x => x.type),
        startWith(EventType.NavigationEnd)
      )
      .subscribe(eventType => {
        if (eventType === EventType.NavigationEnd) {
          this.navigateToSelectedOption();
        }
      });
  }

  public ngOnInit(): void {
    this.navigateToSelectedOption();
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  private navigateToSelectedOption() {
    if (this.route.firstChild) {
      const path = this.route.snapshot.firstChild?.url?.[0]?.path;
      if (path) {
        const option = OPTIONS.find(o => o.path === path);
        if (option) {
          this.selectedOptionControl.setValue(option);
        }
      }
    } else {
      this.selectedOptionControl.setValue(OPTIONS[0]);
    }
  }
}
