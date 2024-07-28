import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { TypeaheadComponent } from './typeahead.component';
import { Exercise } from '@models/exercise.model';
import { DropdownComponent } from './dropdown.component';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { combineLatest, distinctUntilChanged, skip, startWith, Subject, switchMap } from 'rxjs';
import { Filter } from '@models/filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styles: `
    ::ng-deep {
      .dropdown-item {
        background-color: var(--light-bg);
      }
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbTypeaheadModule,
    FormsModule,
    TitleCasePipe,
    NgClass,
    NgbDropdownModule,
    TypeaheadComponent,
    DropdownComponent,
  ],
})
export class FiltersComponent implements OnInit {
  @Output() public readonly filtersChanged = new EventEmitter<Filter>();
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly exerciseFormatter = (x: string) => this.titleCasePipe.transform(x);
  public readonly weightFormatter = (x: string | null | undefined) => (!isNaN(parseInt(x ?? '')) ? `${x}kg` : '');

  public readonly typeControl: FormControl<string | null> = new FormControl(null);
  public readonly exerciseControl: FormControl<Exercise | null> = new FormControl(null);
  public readonly weightControl: FormControl<string | null> = new FormControl(null);

  public readonly exerciseSelector = (x: Exercise | null) => x?.name ?? '';

  public readonly types = signal<string[]>([]);
  public readonly weights = signal<string[]>([]);
  public readonly exercises = signal<Exercise[]>([]);

  private readonly fetchFilters$ = new Subject<void>();

  public constructor() {
    combineLatest([
      this.typeControl.valueChanges.pipe(startWith(null), distinctUntilChanged()),
      this.exerciseControl.valueChanges.pipe(startWith(null), distinctUntilChanged()),
      this.weightControl.valueChanges.pipe(startWith(null), distinctUntilChanged()),
    ])
      .pipe(skip(1))
      .subscribe(() => {
        this.fetchFilters$.next();
        const exercisesIds = !!this.exerciseControl.value?.exerciseId ? [this.exerciseControl.value.exerciseId] : [];
        const types = !!this.typeControl.value ? [this.typeControl.value] : [];
        const weights = !!this.weightControl.value ? [+this.weightControl.value] : [];

        this.filtersChanged.emit({ exercisesIds, types, weights });
      });

    this.fetchFilters$
      .pipe(
        switchMap(() =>
          this.exerciseLogApiService.getFilters(
            this.typeControl.value,
            this.weightControl.value ? +this.weightControl.value : null
          )
        )
      )
      .subscribe(filter => {
        this.types.set(filter.types);
        this.weights.set(filter.weights.map(x => `${x}`));
        this.exercises.set(
          this.exerciseLogService.exercises().filter(x => filter.exercisesIds.includes(x.exerciseId!))
        );
      });
  }

  public ngOnInit(): void {
    this.fetchFilters$.next();
  }
}
