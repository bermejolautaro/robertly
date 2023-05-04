import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({ name: 'parseToMonth', standalone: true })
export class ParseToMonthPipe implements PipeTransform {
  public transform(value: string): string {
    return dayjs(value, 'DD/MM/YYYY').format('MMMM[ - ]YYYY');
  }
}
