import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExcerciseRow } from '@app/models/excercise-row.model';

@Component({
  selector: 'app-excercise-row-title',
  template: `
    <div class="row w-100" *ngIf="excerciseRow">
      <div class="col-4 d-flex align-items-center justify-content-center text-center">
        {{ excerciseRow.excerciseName | titlecase }}
      </div>
      <div class="col-4 d-flex align-items-center justify-content-center text-center">
        {{ excerciseRow.date }}
      </div>
      <div class="col-4 d-flex align-items-center justify-content-center text-center">
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
  @Input() excerciseRow: ExcerciseRow | null = null;
}
