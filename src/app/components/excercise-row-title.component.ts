import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExcerciseRow } from '@models/excercise-row.model';

@Component({
  selector: 'app-excercise-row-title',
  template: `
    <div class="w-100">
      <div class="row w-100 pb-1" [ngClass]="showDate && showUsername ? 'fw-bold': null" *ngIf="excerciseRow">
        <div *ngIf="showExcercise" class="col d-flex" [style.fontSize.rem]="1">
          {{ excerciseRow.excerciseName | titlecase }}
        </div>
      </div>
      <div class="row">
        <div *ngIf="showDate" class="col d-flex text-muted" [style.fontSize.rem]=".8">
          {{ excerciseRow.date }} - {{ excerciseRow.username | titlecase }}
        </div>
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
  imports: [NgFor, NgIf, NgClass, TitleCasePipe],
})
export class ExcerciseRowTitleComponent {
  @Input() showExcercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input({ required: true }) excerciseRow!: ExcerciseRow;
}
