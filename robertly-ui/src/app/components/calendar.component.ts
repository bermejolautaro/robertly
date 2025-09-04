import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';

interface CalendarDate {
  isHighlighted: boolean;
  isInMonth: boolean;
  date: Date;
}

function getCalendarDaysForMonth(year: number, month: number): Date[] {
  const firstDate = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0);
  const startDate = new Date(firstDate);
  startDate.setDate(startDate.getDate() - firstDate.getDay());

  const result: Date[] = [];
  let current = startDate;

  while (current <= lastDate || current.getDay() !== 0) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

@Component({
  selector: 'app-calendar',
  template: `
    <div class="months-container">
      @for (month of months; track $index) {
        <div class="month">
          {{ getMonthName(year(), month) | titlecase }}
        </div>
        <div class="calendar-grid">
          @for (day of weekDays; track $index) {
            <div class="weekday">
              <strong>{{ day }}</strong>
            </div>
          }
          @for (day of getCalendarDaysForMonth(year(), month); track $index) {
            <div
              class="day"
              [class.day-not-in-month]="!day.isInMonth"
              [class.day-highlighted]="day.isHighlighted && day.isInMonth"
            >
              {{ day.date.getDate() }}
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .day {
      padding: 0.75rem;
      font-size: 14px;
      border: 1px solid var(--light-bg);
    }

    .day-highlighted {
      background-color: var(--primary);
    }

    .day-not-in-month {
      background-color: var(--light-bg);
      opacity: 0.5;
    }

    .month {
      text-align: center;
      font-weight: 600;
      font-size: 20px;
    }

    .months-container {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      flex-direction: column;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background-color: var(--bg);
      border: 1px solid var(--light-bg);
    }

    .weekday {
      padding: 0.75rem;
      background-color: var(--light-bg);
    }
  `,
  imports: [TitleCasePipe],
})
export class CalendarComponent {
  public readonly highlightedDates = input<Date[]>([]);
  public readonly year = input.required<number>();
  public readonly months = Array.from({ length: 12 }).map((_, x) => x);
  public readonly weekDays = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'];

  public getMonthName(year: number, month: number): string {
    const date = new Date(year, month, 1);
    return Intl.DateTimeFormat('es-AR', { month: 'long' }).format(date);
  }

  public getCalendarDaysForMonth(year: number, month: number): CalendarDate[] {
    const highlightedDates = this.highlightedDates();
    const calendarDays = getCalendarDaysForMonth(year, month);

    return calendarDays.map(x => {
      return {
        isHighlighted: highlightedDates.some(y => y.getTime() === x.getTime()),
        isInMonth: x.getMonth() === month,
        date: x,
      };
    });
  }
}
