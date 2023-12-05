import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbDropdownModule, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { Observable, OperatorFunction, Subject, merge } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { IfNullEmptyArrayPipe } from '@pipes/if-null-empty-array.pipe';
import { ExcerciseRowsComponent } from '@components/excercise-rows.component';
import { GroupedExcerciseRowsComponent } from '@components/grouped-excercise-rows.component';
import { PersonalRecordComponent } from '@components/personal-record.component';
import { ExerciseLogService } from '@services/excercise-log.service';

@Component({
  selector: 'app-excercise-logs-page',
  templateUrl: 'excercise-logs.page.component.html',
  styles: `
    ::ng-deep {
      .exercise-typeahead {
        overflow-y: scroll; 
        overflow-x: hidden; 
        max-height: 400px;
      }
    }
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
})
export class ExcerciseLogsPageComponent {
  private readonly titleCasePipe = inject(TitleCasePipe);
  public readonly excerciseLogService = inject(ExerciseLogService);

  public isGrouped: boolean = false;

  public excerciseTypeAhead: string = '';

  @ViewChild('typeaheadInput', { static: true }) typeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly focus$: Subject<string> = new Subject<string>();

  public readonly search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.focus$).pipe(
      map(term => {
        const excercises = this.excerciseLogService.excercises().map(x => x.name);
        const selectedExcercise = this.excerciseLogService.selectedExcerciseLabel();

        return term === '' || term === selectedExcercise.name
          ? excercises
          : excercises.filter(x => !!x).filter(v => v.toLowerCase().includes(term.toLowerCase()));
      })
    );
  };

  public readonly formatter = (x: string) => this.titleCasePipe.transform(x);

  public onExcerciseTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void {
    const selectedExercise =
      this.excerciseLogService
        .excercises()
        .filter(x => x.name === event.item)
        .at(0) ?? null;

    this.excerciseLogService.selectedExcercise$.next(selectedExercise);
    this.typeaheadInput?.nativeElement.blur();
  }

  public constructor() {
    effect(() => (this.excerciseTypeAhead = this.excerciseLogService.selectedExcerciseLabel().name));
  }
}
