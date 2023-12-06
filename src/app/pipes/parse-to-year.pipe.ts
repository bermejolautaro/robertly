import { Pipe, PipeTransform } from '@angular/core';
import { parseDate } from '@helpers/date.helper';

@Pipe({ name: 'parseToYear', standalone: true })
export class ParseToYearPipe implements PipeTransform {
  public transform(value: string): string {
    return parseDate(value).format('YYYY');
  }
}
