import ***REMOVED*** NgClass ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** FormsModule, ReactiveFormsModule ***REMOVED*** from '@angular/forms';
import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** NgbActiveModal, NgbTypeaheadModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';
import ***REMOVED*** DeleteLogRequest ***REMOVED*** from '@services/excercise-log-api.service';
import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';
import ***REMOVED*** Subject, OperatorFunction, Observable, distinctUntilChanged, merge, map ***REMOVED*** from 'rxjs';
import ***REMOVED*** CreateOrUpdateLogFormGroup ***REMOVED*** from 'src/app/app.component';

@Component(***REMOVED***
  selector: 'app-excercise-row-body',
  templateUrl: './create-or-update-log-modal.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule, NgClass],
***REMOVED***)
export class CreateOrUpdateLogModalComponent ***REMOVED***
  public readonly modal = inject(NgbActiveModal);
  public readonly exerciseLogService = inject(ExerciseLogService);

  @Input(***REMOVED*** required: true ***REMOVED***) public mode: 'update' | 'create' = null!;
  @Input(***REMOVED*** required: true ***REMOVED***) public createLogFormGroup: CreateOrUpdateLogFormGroup = null!;
  @Input() public originalValue: ExerciseRow = null!;

  @ViewChild('usernameTypeaheadInput', ***REMOVED*** static: true ***REMOVED***) usernameTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly usernameFocus$: Subject<string> = new Subject<string>();

  public readonly usernameSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => ***REMOVED***
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.usernameFocus$).pipe(
      map(() => ***REMOVED***
        const usernames = this.exerciseLogService.usernames().map(x => x);

        return this.createLogFormGroup.value.user === ''
          ? usernames
          : usernames.filter(x => !!x).filter(v => v.toLowerCase().includes(this.createLogFormGroup.value.user?.toLowerCase() ?? ''));
  ***REMOVED***)
    );
***REMOVED***;

  @ViewChild('exerciseTypeaheadInput', ***REMOVED*** static: true ***REMOVED***) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => ***REMOVED***
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(() => ***REMOVED***
        const exercises = this.exerciseLogService.exercises().map(x => x.exercise);

        return this.createLogFormGroup.value.exercise === ''
          ? exercises
          : exercises.filter(x => !!x).filter(x => x.toLowerCase().includes(this.createLogFormGroup.value.exercise?.toLowerCase() ?? ''));
  ***REMOVED***)
    );
***REMOVED***;
***REMOVED***
