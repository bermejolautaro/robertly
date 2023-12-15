import ***REMOVED*** TitleCasePipe ***REMOVED*** from '@angular/common';
import ***REMOVED*** ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, computed, effect, inject ***REMOVED*** from '@angular/core';

import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';
import ***REMOVED*** Chart ***REMOVED*** from 'chart.js/auto';
import ***REMOVED*** getSeriesAmountPerUserPerMuscleGroupPerMonth ***REMOVED*** from '@helpers/excercise-log.helper';

import * as R from 'remeda';

type ChartDataSetItem = ***REMOVED*** label: string; data: number[]; borderWidth: number ***REMOVED***;

@Component(***REMOVED***
  selector: 'app-series-per-muscle-group-graph-monthly',
  template: `
    <div>
      <canvas #chart></canvas>
    </div>
  `,
  styles: [
    `
      :host ***REMOVED***
        display: block;
  ***REMOVED***
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
***REMOVED***)
export class SeriesPerMuscleGroupGraphMonthlyComponent implements OnInit ***REMOVED***
  @ViewChild('chart', ***REMOVED*** static: true ***REMOVED***) chartCanvasElementRef: ElementRef<HTMLCanvasElement> | null = null;
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly titleCasePipe = inject(TitleCasePipe);

  private chart: Chart | null = null;

  public readonly seriesPerMuscleGroupPerUserPerMonth = computed(() => ***REMOVED***
    const seriesAmountPerUserPerMuscleGroupPerMonth = getSeriesAmountPerUserPerMuscleGroupPerMonth(this.exerciseLogService.exerciseRows());
    const muscleGroups = this.exerciseLogService.muscleGroups();
    const selectedMonth = this.exerciseLogService.selectedMonth();

    if (selectedMonth) ***REMOVED***
      let seriesAmountPerUserPerMuscleGroup = seriesAmountPerUserPerMuscleGroupPerMonth[selectedMonth];

      if (seriesAmountPerUserPerMuscleGroup) ***REMOVED***
        const result: ChartDataSetItem[] = [];

        for (const x of R.toPairs(seriesAmountPerUserPerMuscleGroup)) ***REMOVED***
          const name = x[0];
          const values = x[1];

          let seriesAmount: number[] = [];

          for (const muscleGroup of muscleGroups) ***REMOVED***
            const value = values[muscleGroup] || 0;
            seriesAmount.push(value);
      ***REMOVED***

          result.push(***REMOVED***
            label: this.titleCasePipe.transform(name),
            data: seriesAmount,
            borderWidth: 1,
      ***REMOVED***);
    ***REMOVED***

        return result;
  ***REMOVED***
***REMOVED***

    return [];
***REMOVED***);

  public constructor() ***REMOVED***
    effect(() => ***REMOVED***
      if (this.chart) ***REMOVED***
        this.chart.data.datasets = this.seriesPerMuscleGroupPerUserPerMonth();
        this.chart.update();
  ***REMOVED***
***REMOVED***);
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    if (this.chartCanvasElementRef) ***REMOVED***
      this.chart = new Chart(this.chartCanvasElementRef.nativeElement, ***REMOVED***
        type: 'bar',
        data: ***REMOVED***
          labels: this.exerciseLogService.muscleGroups().map(this.titleCasePipe.transform),
          datasets: this.seriesPerMuscleGroupPerUserPerMonth(),
    ***REMOVED***,
        options: ***REMOVED***
          scales: ***REMOVED***
            y: ***REMOVED***
              beginAtZero: true,
        ***REMOVED***,
      ***REMOVED***,
    ***REMOVED***,
  ***REMOVED***);

      this.chart.options.animation = false;
***REMOVED***
***REMOVED***
***REMOVED***
