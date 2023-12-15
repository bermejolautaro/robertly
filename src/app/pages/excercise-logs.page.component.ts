import ***REMOVED*** AsyncPipe, DOCUMENT, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, effect, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** FormsModule ***REMOVED*** from '@angular/forms';

import ***REMOVED*** NgbDropdownModule, NgbTypeahead, NgbTypeaheadSelectItemEvent ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** Observable, OperatorFunction, Subject, merge ***REMOVED*** from 'rxjs';
import ***REMOVED*** distinctUntilChanged, map ***REMOVED*** from 'rxjs/operators';

import ***REMOVED*** IfNullEmptyArrayPipe ***REMOVED*** from '@pipes/if-null-empty-array.pipe';
import ***REMOVED*** ExcerciseRowsComponent ***REMOVED*** from '@components/excercise-rows.component';
import ***REMOVED*** GroupedExerciseRowsComponent ***REMOVED*** from '@components/grouped-exercise-rows.component';
import ***REMOVED*** PersonalRecordComponent ***REMOVED*** from '@components/personal-record.component';
import ***REMOVED*** ExerciseLogService, EXERCISE_DEFAULT_LABEL, WEIGHT_DEFAULT_LABEL ***REMOVED*** from '@services/excercise-log.service';

const CLEAR_FILTER_LABEL = 'Clear Filter';

@Component(***REMOVED***
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
***REMOVED***)
export class ExcerciseLogsPageComponent implements OnInit ***REMOVED***
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly document = inject(DOCUMENT);
  public readonly exerciseLogService = inject(ExerciseLogService);

  public readonly EXERCISE_PLACEHOLDER = EXERCISE_DEFAULT_LABEL;
  public readonly WEIGHT_PLACEHOLDER = WEIGHT_DEFAULT_LABEL;

  public isGrouped: boolean = false;

  public exerciseTypeahead: string = '';

  @ViewChild('exerciseTypeaheadInput', ***REMOVED*** static: true ***REMOVED***) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => ***REMOVED***
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(() => ***REMOVED***
        const exercises = this.exerciseLogService.exercises().map(x => x.name);

        if (this.exerciseLogService.selectedExercise()) ***REMOVED***
          exercises.unshift(CLEAR_FILTER_LABEL);
    ***REMOVED***

        return this.exerciseTypeahead === '' || this.exerciseTypeahead === EXERCISE_DEFAULT_LABEL
          ? exercises
          : exercises.filter(x => !!x).filter(v => v.toLowerCase().includes(this.exerciseTypeahead.toLowerCase()));
  ***REMOVED***)
    );
***REMOVED***;

  public weightTypeahead: string = '';

  @ViewChild('weightTypeaheadInput', ***REMOVED*** static: true ***REMOVED***) weightTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly weightFocus$: Subject<string> = new Subject<string>();

  public readonly weightSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => ***REMOVED***
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.weightFocus$).pipe(
      map(() => ***REMOVED***
        const weights = this.exerciseLogService.weights().map(x => `$***REMOVED***x***REMOVED***`);

        if (this.exerciseLogService.selectedWeight()) ***REMOVED***
          weights.unshift(CLEAR_FILTER_LABEL);
    ***REMOVED***

        return this.weightTypeahead === '' || this.weightTypeahead === WEIGHT_DEFAULT_LABEL
          ? weights
          : weights.filter(x => !!x).filter(x => x.includes(this.weightTypeahead));
  ***REMOVED***)
    );
***REMOVED***;

  public readonly exerciseFormatter = (x: string) => ***REMOVED***
    return this.titleCasePipe.transform(x);
***REMOVED***;
  public readonly weightFormatter = (x: string) => (!isNaN(parseInt(x)) ? `$***REMOVED***x***REMOVED***kg` : x);

  public constructor() ***REMOVED***
    effect(() => (this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel()));
    effect(() => (this.weightTypeahead = this.exerciseLogService.selectedWeightLabel()));
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    this.document.defaultView?.scroll(***REMOVED*** top: 0, left: 0, behavior: 'smooth' ***REMOVED***);
***REMOVED***

  public onExerciseTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void ***REMOVED***
    let selectedExercise =
      this.exerciseLogService
        .exercises()
        .filter(x => x.name === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) ***REMOVED***
      selectedExercise = null;
***REMOVED***

    this.exerciseLogService.selectedExercise$.next(selectedExercise);
    this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel();
    this.exerciseTypeaheadInput?.nativeElement.blur();

    this.exerciseLogService.selectedWeight$.next(null);
    this.weightTypeahead = this.exerciseLogService.selectedWeightLabel();
***REMOVED***

  public onWeightTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void ***REMOVED***
    let selectedWeight =
      this.exerciseLogService
        .weights()
        .filter(x => `$***REMOVED***x***REMOVED***` === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) ***REMOVED***
      selectedWeight = null;
***REMOVED***

    this.exerciseLogService.selectedWeight$.next(selectedWeight);
    this.weightTypeaheadInput?.nativeElement.blur();
***REMOVED***
***REMOVED***
