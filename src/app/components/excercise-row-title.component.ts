import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExcerciseRow } from '@models/excercise-row.model';

@Component({
  selector: 'app-excercise-row-title',
  template: `
    <div class="w-100">
      <div class="row w-100 pb-1" [ngClass]="showDate && showUsername ? 'fw-semibold' : null" *ngIf="excerciseRow">
        <div *ngIf="showExcercise" class="col d-flex align-items-center gap-1" [style.fontSize.rem]="1">
          {{ excerciseRow.excerciseName | titlecase }}
          <i *ngIf="showStar" class="fa fa-star"></i>
        </div>
      </div>
      <div class="row">
        <div *ngIf="showDate" class="col d-flex text-muted" [style.fontSize.rem]="0.8">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf, NgClass, TitleCasePipe],
})
export class ExcerciseRowTitleComponent {
  @Input() showStar: boolean = false;
  @Input() showExcercise: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showUsername: boolean = true;
  @Input({ required: true }) excerciseRow!: ExcerciseRow;
}
