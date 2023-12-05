import ***REMOVED*** AsyncPipe, TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** FormsModule ***REMOVED*** from '@angular/forms';

import ***REMOVED*** NgbDropdownModule, NgbTypeahead, NgbTypeaheadSelectItemEvent ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';

import ***REMOVED*** Observable, OperatorFunction, Subject, merge ***REMOVED*** from 'rxjs';
import ***REMOVED*** distinctUntilChanged, map ***REMOVED*** from 'rxjs/operators';

import ***REMOVED*** IfNullEmptyArrayPipe ***REMOVED*** from '@pipes/if-null-empty-array.pipe';
import ***REMOVED*** ExcerciseRowsComponent ***REMOVED*** from '@components/excercise-rows.component';
import ***REMOVED*** GroupedExcerciseRowsComponent ***REMOVED*** from '@components/grouped-excercise-rows.component';
import ***REMOVED*** PersonalRecordComponent ***REMOVED*** from '@components/personal-record.component';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

@Component(***REMOVED***
  selector: 'app-excercise-logs-page',
  templateUrl: 'excercise-logs.page.component.html',
  styles: `
    ::ng-deep ***REMOVED***
      .exercise-typeahead ***REMOVED***
        overflow-y: scroll; 
        overflow-x: hidden; 
        max-height: 400px;
  ***REMOVED***
***REMOVED***
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TitleCasePipe],
  imports: [
    FormsModule,
    AsyncPipe,
    TitleCasePipe,
    IfNullEmptyArrayPipe,
    PersonalRecordComponent,
    GroupedExcerciseRowsComponent,
    ExcerciseRowsComponent,
    NgbDropdownModule,
    NgbTypeahead,
  ],
***REMOVED***)
export class ExcerciseLogsPageComponent ***REMOVED***
  private readonly titleCasePipe = inject(TitleCasePipe);
  public readonly excerciseLogService = inject(ExerciseLogService);

  public isGrouped: boolean = false;

  public excerciseTypeAhead: string = '';

  @ViewChild('typeaheadInput', ***REMOVED*** static: true ***REMOVED***) typeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly focus$: Subject<string> = new Subject<string>();

  public readonly search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => ***REMOVED***
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.focus$).pipe(
      map(term => ***REMOVED***
        const excercises = this.excerciseLogService.excercises().map(x => x.name);
        const selectedExcercise = this.excerciseLogService.selectedExcerciseLabel();

        return term === '' || term === selectedExcercise.name
          ? excercises
          : excercises.filter(x => !!x).filter(v => v.toLowerCase().includes(term.toLowerCase()));
  ***REMOVED***)
    );
***REMOVED***;

  public readonly formatter = (x: string) => this.titleCasePipe.transform(x);

  public onExcerciseTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void ***REMOVED***
    const selectedExercise =
      this.excerciseLogService
        .excercises()
        .filter(x => x.name === event.item)
        .at(0) ?? null;

    this.excerciseLogService.selectedExcercise$.next(selectedExercise);
    this.typeaheadInput?.nativeElement.blur();
***REMOVED***

  public constructor() ***REMOVED***
    effect(() => (this.excerciseTypeAhead = this.excerciseLogService.selectedExcerciseLabel().name));
***REMOVED***
***REMOVED***
