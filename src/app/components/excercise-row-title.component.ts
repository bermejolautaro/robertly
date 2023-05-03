import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExcerciseRow } from '@models/excercise-row.model';

@Component({
  selector: 'app-excercise-row-title',
  template: `
    <div class="row w-100" *ngIf="excerciseRow">
      <div *ngIf="showExcercise" class="col d-flex align-items-center justify-content-center text-center">
        {{ excerciseRow.excerciseName | titlecase }}
      </div>
      <div *ngIf="showDate" class="col d-flex align-items-center justify-content-center text-center">
        {{ excerciseRow.date }}
      </div>
      <div *ngIf="showUsername" class="col d-flex align-items-center justify-content-center text-center">
        {{ excerciseRow.username | titlecase }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex: 1;
      }
    `,
  ],
  standalone: true,
  imports: [NgFor, NgIf, TitleCasePipe],
})
export class ExcerciseRowTitleComponent {
  @Input() showExcercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input({ required: true }) excerciseRow!: ExcerciseRow;
}
