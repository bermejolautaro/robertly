import { AsyncPipe, DOCUMENT, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDropdownModule, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { Observable, OperatorFunction, Subject, merge } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { IfNullEmptyArrayPipe } from '@pipes/if-null-empty-array.pipe';
import { ExcerciseRowsComponent } from '@components/excercise-rows.component';
import { GroupedExerciseRowsComponent } from '@components/grouped-exercise-rows.component';
import { PersonalRecordComponent } from '@components/personal-record.component';
import { ExerciseLogService, EXERCISE_DEFAULT_LABEL, WEIGHT_DEFAULT_LABEL } from '@services/excercise-log.service';

const CLEAR_FILTER_LABEL = 'Clear Filter';

@Component({
  selector: 'app-excercise-logs-page',
  templateUrl: 'excercise-logs.page.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    FormsModule,
    AsyncPipe,
    TitleCasePipe,
    IfNullEmptyArrayPipe,
    PersonalRecordComponent,
    GroupedExerciseRowsComponent,
    ExcerciseRowsComponent,
    NgbDropdownModule,
    NgbTypeahead,
  ],
})
export class ExcerciseLogsPageComponent implements OnInit {
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly document = inject(DOCUMENT);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public readonly EXERCISE_PLACEHOLDER = EXERCISE_DEFAULT_LABEL;
  public readonly WEIGHT_PLACEHOLDER = WEIGHT_DEFAULT_LABEL;

  public isGrouped: boolean = false;

  public exerciseTypeahead: string = '';

  @ViewChild('exerciseTypeaheadInput', { static: true }) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(() => {
        const exercises = this.exerciseLogService.exercises().map(x => x.name);

        if (this.exerciseLogService.selectedExercise()) {
          exercises.unshift(CLEAR_FILTER_LABEL);
        }

        return this.exerciseTypeahead === '' || this.exerciseTypeahead === EXERCISE_DEFAULT_LABEL
          ? exercises
          : exercises.filter(x => !!x).filter(v => v.toLowerCase().includes(this.exerciseTypeahead.toLowerCase()));
      })
    );
  };

  public weightTypeahead: string = '';

  @ViewChild('weightTypeaheadInput', { static: true }) weightTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly weightFocus$: Subject<string> = new Subject<string>();

  public readonly weightSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.weightFocus$).pipe(
      map(() => {
        const weights = this.exerciseLogService.weights().map(x => `${x}`);

        if (this.exerciseLogService.selectedWeight()) {
          weights.unshift(CLEAR_FILTER_LABEL);
        }

        return this.weightTypeahead === '' || this.weightTypeahead === WEIGHT_DEFAULT_LABEL
          ? weights
          : weights.filter(x => !!x).filter(x => x.includes(this.weightTypeahead));
      })
    );
  };

  public readonly exerciseFormatter = (x: string) => {
    return this.titleCasePipe.transform(x);
  };
  public readonly weightFormatter = (x: string) => (!isNaN(parseInt(x)) ? `${x}kg` : x);

  public constructor() {
    effect(() => (this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel()));
    effect(() => (this.weightTypeahead = this.exerciseLogService.selectedWeightLabel()));
  }

  public ngOnInit(): void {
    this.document.defaultView?.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  public onExerciseTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void {
    let selectedExercise =
      this.exerciseLogService
        .exercises()
        .filter(x => x.name === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) {
      selectedExercise = null;
    }

    this.exerciseLogService.selectedExercise$.next(selectedExercise);
    this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel();
    this.exerciseTypeaheadInput?.nativeElement.blur();

    this.exerciseLogService.selectedWeight$.next(null);
    this.weightTypeahead = this.exerciseLogService.selectedWeightLabel();
  }

  public onWeightTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void {
    let selectedWeight =
      this.exerciseLogService
        .weights()
        .filter(x => `${x}` === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) {
      selectedWeight = null;
    }

    this.exerciseLogService.selectedWeight$.next(selectedWeight);
    this.weightTypeaheadInput?.nativeElement.blur();
  }
}
