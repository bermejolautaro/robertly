import { ChangeDetectionStrategy, Component, OnInit, inject, signal, DOCUMENT } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from '../components/dropdown.component';
import { FormControl } from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Paths } from 'src/main';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

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
] as const;

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats.page.component.html',
  styleUrl: './stats.page.component.scss',
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
    this.selectedOptionControl.valueChanges.pipe(startWith(null), takeUntilDestroyed()).subscribe(option => {
      if (option) {
        this.router.navigate([option.path], { relativeTo: this.route });
      } else {
        this.router.navigate([OPTIONS[0]?.path], { relativeTo: this.route });
      }
    });
  }

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
}
