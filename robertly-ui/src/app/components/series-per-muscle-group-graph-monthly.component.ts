import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, computed, effect, inject } from '@angular/core';

import { ExerciseLogService } from '@services/exercise-log.service';
import { Chart } from 'chart.js/auto';
import { getSeriesAmountPerUserPerMuscleGroupPerMonth } from '@helpers/exercise-log.helper';

import * as R from 'remeda';

type ChartDataSetItem = { label: string; data: number[]; borderWidth: number };

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
  imports: [],
})
export class SeriesPerMuscleGroupGraphMonthlyComponent implements OnInit {
  @ViewChild('chart', { static: true }) chartCanvasElementRef: ElementRef<HTMLCanvasElement> | null = null;
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  private chart: Chart | null = null;

  public readonly seriesPerMuscleGroupPerUserPerMonth = computed(() => {
    // const seriesAmountPerUserPerMuscleGroupPerMonth = getSeriesAmountPerUserPerMuscleGroupPerMonth(this.exerciseLogService.logs());

    // if (selectedMonth) {
    //   let seriesAmountPerUserPerMuscleGroup = seriesAmountPerUserPerMuscleGroupPerMonth[selectedMonth];

    //   if (seriesAmountPerUserPerMuscleGroup) {
    //     const result: ChartDataSetItem[] = [];

    //     for (const x of R.toPairs(seriesAmountPerUserPerMuscleGroup)) {
    //       const name = x[0];
    //       const values = x[1];

    //       let seriesAmount: number[] = [];

    //       for (const muscleGroup of muscleGroups) {
    //         const value = values[muscleGroup] || 0;
    //         seriesAmount.push(value);
    //       }

    //       result.push({
    //         label: this.titleCasePipe.transform(name),
    //         data: seriesAmount,
    //         borderWidth: 1,
    //       });
    //     }

    //     return result;
    //   }
    // }

    return [];
  });

  public constructor() {
    effect(() => {
      if (this.chart) {
        this.chart.data.datasets = this.seriesPerMuscleGroupPerUserPerMonth();
        this.chart.update();
      }
    });
  }

  public ngOnInit(): void {
    if (this.chartCanvasElementRef) {
      this.chart = new Chart(this.chartCanvasElementRef.nativeElement, {
        type: 'bar',
        data: {
          labels: this.exerciseLogService.muscleGroups().map(this.titleCasePipe.transform),
          datasets: this.seriesPerMuscleGroupPerUserPerMonth(),
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      this.chart.options.animation = false;
    }
  }
}
