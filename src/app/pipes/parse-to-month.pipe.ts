import { Pipe, PipeTransform } from '@angular/core';
import { parseDate } from '@helpers/date.helper';

@Pipe({ name: 'parseToMonth', standalone: true })
export class ParseToMonthPipe implements PipeTransform {
  public transform(value: string): string {
    return parseDate(value).format('MMMM[ - ]YYYY');
  }
}
