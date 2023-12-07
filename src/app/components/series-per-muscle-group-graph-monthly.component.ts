import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, inject, signal } from '@angular/core';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ExerciseRow } from '@models/excercise-row.model';
import { ParseToMonthPipe } from '@pipes/parse-to-month.pipe';
import { ExerciseLogService } from '@services/excercise-log.service';
import { Chart, registerables } from 'chart.js';

type State = {
  rows: ExerciseRow[];
};

@Component({
  selector: 'app-series-per-muscle-group-graph-monthly',
  template: `
    <div>
      <canvas #chart></canvas>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TitleCasePipe, KeyValuePipe, ParseToMonthPipe, NgbDropdownModule],
})
export class SeriesPerMuscleGroupGraphMonthlyComponent implements OnInit {
  @ViewChild('chart', { static: true }) chart: ElementRef<HTMLCanvasElement> | null = null;
  @Input({ required: true }) public set rows(value: ExerciseRow[]) {
    this.state.update(state => ({ ...state, rows: value }));
  }

  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly state = signal<State>({
    rows: [],
  });

  public ngOnInit(): void {
    Chart.register(...registerables);
    if (this.chart) {
      new Chart(this.chart.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
